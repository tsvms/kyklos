import Tabs from 'expo-router/js-tabs';
import { TabBar } from '@/components/TabBar';
import { useApp } from '@/lib/app-state';

export default function TabsLayout() {
  const { colors, t } = useApp();
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // The bar floats over the content; screens reserve room for it.
        tabBarStyle: { position: 'absolute' },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.today') }} />
      <Tabs.Screen name="stats" options={{ title: t('tabs.stats') }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings') }} />
    </Tabs>
  );
}
