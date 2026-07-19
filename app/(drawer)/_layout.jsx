import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { View, StyleSheet, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

function CustomDrawerContent(props) {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const mainItems = [
    { label: 'Dashboard', icon: 'compass', route: '/' },
    { label: 'New Survey', icon: 'document-text', route: '/create-survey' },
    { label: 'History', icon: 'map', route: '/history' },
    { label: 'Profile', icon: 'person', route: '/profile' },
  ];

  const toolItems = [
    { label: 'Camera', icon: 'camera', route: '/camera' },
    { label: 'Location', icon: 'location', route: '/location' },
    { label: 'Contacts', icon: 'people', route: '/contacts' },
    { label: 'Clipboard', icon: 'clipboard', route: '/clipboard' },
  ];

  const isFocused = (route) => {
    if (route === '/') return pathname === '/' || pathname === '/(drawer)/(tabs)';
    return pathname.includes(route);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.scroll, { backgroundColor: tc.background }]}
    >
      <View style={[styles.header, { backgroundColor: tc.chrome }]}>
        <View style={styles.compassBox}>
          <Ionicons name="compass" size={22} color="#FFF" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.brand}>Field Survey</Text>
          <Text style={styles.version}>v1.0</Text>
        </View>
      </View>

      <Text style={[styles.sectionLabel, { color: tc.muted }]}>Main</Text>
      {mainItems.map((item) => (
        <DrawerItem
          key={item.label}
          label={item.label}
          focused={isFocused(item.route)}
          activeTintColor={isDark ? tc.chrome : '#FFF'}
          inactiveTintColor={tc.textSecondary}
          activeBackgroundColor={tc.tint}
          icon={({ color, size }) => (
            <Ionicons name={item.icon} size={size} color={isFocused(item.route) ? (isDark ? tc.chrome : '#FFF') : color} />
          )}
          onPress={() => router.push(item.route)}
          labelStyle={{ fontWeight: isFocused(item.route) ? '700' : '500', fontSize: 15, letterSpacing: -0.3 }}
        />
      ))}

      <Text style={[styles.sectionLabel, { color: tc.muted }]}>Tools</Text>
      {toolItems.map((item) => (
        <DrawerItem
          key={item.label}
          label={item.label}
          focused={isFocused(item.route)}
          activeTintColor={isDark ? tc.chrome : '#FFF'}
          inactiveTintColor={tc.textSecondary}
          activeBackgroundColor={tc.tint}
          icon={({ color, size }) => (
            <Ionicons name={item.icon} size={size} color={isFocused(item.route) ? (isDark ? tc.chrome : '#FFF') : color} />
          )}
          onPress={() => router.push(item.route)}
          labelStyle={{ fontWeight: isFocused(item.route) ? '700' : '500', fontSize: 15, letterSpacing: -0.3 }}
        />
      ))}
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? tc.chrome : '#FFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: tc.divider,
        },
        headerTintColor: tc.text,
        drawerActiveTintColor: tc.tint,
        drawerInactiveTintColor: tc.textSecondary,
        drawerStyle: {
          backgroundColor: tc.background,
          width: 280,
        },
        headerShown: true,
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: 'Dashboard', headerShown: false }} />
      <Drawer.Screen name="camera" options={{ title: 'Camera' }} />
      <Drawer.Screen name="contacts" options={{ title: 'Contacts' }} />
      <Drawer.Screen name="location" options={{ title: 'Location' }} />
      <Drawer.Screen name="clipboard" options={{ title: 'Clipboard' }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
      <Drawer.Screen name="preview" options={{ title: 'Preview Survey' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: Spacing.xl },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  compassBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerText: { flex: 1 },
  brand: { color: '#FFF', fontSize: 17, fontWeight: '800', letterSpacing: -0.5 },
  version: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600', marginTop: 1 },
  sectionLabel: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
