import Feather from '@expo/vector-icons/Feather';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { router, useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert, Linking, Share, View } from 'react-native';
import { RingMark } from '@/components/RingMark';
import { Card, Row, Screen, SectionLabel, Segmented, Text, type IconName } from '@/components/ui';
import { useApp } from '@/lib/app-state';
import { parseBackup } from '@/lib/backup';
import { deleteAllData, exportData, restoreBackup } from '@/lib/db';
import { getPermission, requestPermission, type PermissionState } from '@/lib/notifications';
import { space, withAlpha, type ThemePref } from '@/lib/theme';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function Settings() {
  const db = useSQLiteContext();
  const { colors, t, themePref, setThemePref, changed, commit, today, notify } = useApp();
  const [permission, setPermission] = useState<PermissionState>('unavailable');
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getPermission().then(setPermission);
    }, []),
  );

  const onReminders = async () => {
    if (permission === 'denied') return Linking.openSettings();
    if (permission === 'undetermined') {
      setPermission(await requestPermission(t));
      changed();
    }
  };

  const onExport = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const json = JSON.stringify(await exportData(db, APP_VERSION), null, 2);
      const file = new File(Paths.cache, `kyklos-${today}.json`);
      if (file.exists) file.delete();
      file.create();
      file.write(json);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle: 'Kyklos' });
      } else {
        await Share.share({ message: json });
      }
    } catch (e) {
      console.warn('[kyklos] export failed', e);
      notify(t('settings.exportFailed'));
    } finally {
      setBusy(false);
    }
  };

  const onImport = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/plain', 'application/octet-stream'],
        copyToCacheDirectory: true,
      });
      if (picked.canceled) return;
      const backup = parseBackup(await new File(picked.assets[0].uri).text());
      if (!backup) return notify(t('settings.importInvalid'));
      Alert.alert(
        t('settings.importTitle'),
        t('settings.importBody', {
          date: backup.exportedOn || '—',
          habits: backup.habits.length,
          checkins: backup.checkins.length,
        }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('settings.importConfirm'),
            style: 'destructive',
            onPress: async () => {
              if (await commit(() => restoreBackup(db, backup))) notify(t('settings.importDone'));
            },
          },
        ],
      );
    } catch (e) {
      console.warn('[kyklos] import failed', e);
      notify(t('settings.importInvalid'));
    } finally {
      setBusy(false);
    }
  };

  const onDeleteAll = () => {
    Alert.alert(t('settings.deleteAllTitle'), t('settings.deleteAllBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.deleteAllConfirm'),
        style: 'destructive',
        onPress: async () => {
          if (await commit(() => deleteAllData(db))) notify(t('settings.deleted'));
        },
      },
    ]);
  };

  const themeOptions: { value: ThemePref; label: string }[] = [
    { value: 'system', label: t('settings.system') },
    { value: 'light', label: t('settings.light') },
    { value: 'dark', label: t('settings.dark') },
  ];

  return (
    <Screen edgeTop>
      <Text variant="display">{t('tabs.settings')}</Text>

      <SectionLabel>{t('settings.appearance')}</SectionLabel>
      <Segmented options={themeOptions} value={themePref} onChange={setThemePref} />


      {permission !== 'unavailable' && (
        <>
          <SectionLabel>{t('settings.notifications')}</SectionLabel>
          <Card style={{ paddingVertical: space.xs }}>
            <Row onPress={permission === 'granted' ? undefined : onReminders} last>
              <IconTile icon={permission === 'granted' ? 'bell' : 'bell-off'} color={colors.accent} />
              <Text style={{ flex: 1 }}>{t('settings.notifications')}</Text>
              <Text muted>{permission === 'granted' ? t('settings.notifOn') : t('settings.notifOff')}</Text>
              {permission !== 'granted' && <Feather name="chevron-right" size={18} color={colors.muted} />}
            </Row>
          </Card>
          <Text variant="caption" muted style={{ marginHorizontal: space.xs }}>
            {permission === 'denied' ? t('notif.deniedHint') : t('notif.explain')}
          </Text>
        </>
      )}

      <SectionLabel>{t('settings.data')}</SectionLabel>
      <Card style={{ paddingVertical: space.xs }}>
        <LinkRow icon="download" label={t('settings.export')} hint={t('settings.exportHint')} onPress={onExport} />
        <LinkRow icon="upload" label={t('settings.import')} hint={t('settings.importHint')} onPress={onImport} />
        <LinkRow icon="archive" label={t('settings.archived')} onPress={() => router.push('/archived')} />
        <LinkRow
          icon="trash-2"
          label={t('settings.deleteAll')}
          hint={t('settings.deleteAllHint')}
          onPress={onDeleteAll}
          danger
          last
        />
      </Card>

      <SectionLabel>{t('settings.legal')}</SectionLabel>
      <Card style={{ paddingVertical: space.xs }}>
        <LinkRow icon="shield" label={t('settings.privacy')} onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'privacy' } })} />
        <LinkRow icon="file-text" label={t('settings.terms')} onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'terms' } })} />
        <LinkRow icon="code" label={t('settings.licenses')} onPress={() => router.push('/legal/licenses')} last />
      </Card>

      <SectionLabel>{t('settings.about')}</SectionLabel>
      <Card style={{ flexDirection: 'row', gap: space.md, alignItems: 'flex-start' }}>
        <RingMark size={44} />
        <View style={{ flex: 1, gap: space.xs }}>
          <Text variant="label">Kyklos</Text>
          <Text muted>{t('settings.aboutBody')}</Text>
          <Text variant="caption" muted style={{ fontVariant: ['tabular-nums'] }}>
            {t('settings.version', { v: APP_VERSION })}
          </Text>
        </View>
      </Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, justifyContent: 'center', marginTop: space.sm }}>
        <Feather name="lock" size={14} color={colors.muted} />
        <Text variant="caption" muted style={{ textAlign: 'center', flexShrink: 1 }}>
          {t('settings.privacyShort')}
        </Text>
      </View>
    </Screen>
  );
}

function LinkRow({
  icon,
  label,
  hint,
  onPress,
  danger,
  last,
}: {
  icon: IconName;
  label: string;
  hint?: string;
  onPress: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  const { colors } = useApp();
  const tint = danger ? colors.danger : colors.accent;
  return (
    <Row onPress={onPress} last={last}>
      <IconTile icon={icon} color={tint} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text color={danger ? colors.danger : undefined}>{label}</Text>
        {hint && (
          <Text variant="caption" muted>
            {hint}
          </Text>
        )}
      </View>
      <Feather name="chevron-right" size={18} color={colors.muted} />
    </Row>
  );
}

function IconTile({ icon, color }: { icon: IconName; color: string }) {
  return (
    <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: withAlpha(color, 0.13), alignItems: 'center', justifyContent: 'center' }}>
      <Feather name={icon} size={18} color={color} />
    </View>
  );
}
