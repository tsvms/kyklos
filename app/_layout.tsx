import * as Notifications from 'expo-notifications';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, router, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, Text, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toast } from '@/components/Toast';
import { AppProvider, useApp } from '@/lib/app-state';
import { DB_NAME, migrate } from '@/lib/db';
import { t } from '@/lib/i18n';
import { configureNotifications } from '@/lib/notifications';
import { palettes } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ duration: 250, fade: true });
configureNotifications();

export default function RootLayout() {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  return (
    <SafeAreaProvider>
      {failed ? (
        <OpenError
          onRetry={() => {
            setFailed(false);
            setAttempt((a) => a + 1);
          }}
        />
      ) : (
        <SQLiteProvider
          key={attempt}
          databaseName={DB_NAME}
          onInit={migrate}
          onError={(e) => {
            console.warn('[kyklos] database could not open', e);
            SplashScreen.hideAsync().catch(() => {});
            setFailed(true);
          }}
        >
          <AppProvider>
            <Navigation />
          </AppProvider>
        </SQLiteProvider>
      )}
    </SafeAreaProvider>
  );
}

/** Shown only if the database cannot open: calm, bilingual-safe, retryable. */
function OpenError({ onRetry }: { onRetry: () => void }) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = palettes[scheme];
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
      <Text style={{ color: c.text, fontSize: 22, fontWeight: '600', textAlign: 'center' }}>{t('error.title')}</Text>
      <Text style={{ color: c.muted, fontSize: 17, textAlign: 'center', maxWidth: 320 }}>{t('error.body')}</Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        style={{ backgroundColor: c.text, borderRadius: 16, paddingHorizontal: 24, minHeight: 52, justifyContent: 'center' }}
      >
        <Text style={{ color: c.bg, fontSize: 15, fontWeight: '500' }}>{t('error.retry')}</Text>
      </Pressable>
    </View>
  );
}

function Navigation() {
  const { ready, scheme, colors, t } = useApp();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  // Only once the Stack is mounted: pushing earlier throws on a cold start.
  useNotificationTaps(ready);

  const navTheme = useMemo<Theme>(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.bg,
        card: colors.bg,
        text: colors.text,
        border: colors.border,
        notification: colors.accent,
      },
    };
  }, [scheme, colors]);

  if (!ready) return null;

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="habit/new"
          options={{ title: t('form.newTitle'), presentation: Platform.OS === 'ios' ? 'modal' : 'card' }}
        />
        <Stack.Screen name="habit/[id]/index" options={{ title: '' }} />
        <Stack.Screen
          name="habit/[id]/edit"
          options={{ title: t('form.editTitle'), presentation: Platform.OS === 'ios' ? 'modal' : 'card' }}
        />
        <Stack.Screen name="archived" options={{ title: t('settings.archived') }} />
        <Stack.Screen name="legal/[doc]" options={{ title: '' }} />
        <Stack.Screen name="legal/licenses" options={{ title: t('settings.licenses') }} />
      </Stack>
      <Toast />
    </ThemeProvider>
  );
}

/** Tapping a reminder opens that habit — also from a cold start. */
function useNotificationTaps(ready: boolean) {
  useEffect(() => {
    if (Platform.OS === 'web' || !ready) return;
    const open = (response: Notifications.NotificationResponse | null) => {
      const id = response?.notification.request.content.data?.habitId;
      if (typeof id === 'number') router.push({ pathname: '/habit/[id]', params: { id: String(id) } });
    };
    try {
      open(Notifications.getLastNotificationResponse());
      Notifications.clearLastNotificationResponse();
    } catch {
      // not available in every runtime (e.g. Expo Go limitations)
    }
    const sub = Notifications.addNotificationResponseReceivedListener(open);
    return () => sub.remove();
  }, [ready]);
}
