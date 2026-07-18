import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { View, StyleSheet, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

function CustomDrawerContent(props) {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  
  // Custom navigation handler to jump directly to specific tab screen
  const navigateToTab = (screenName, tabPath) => {
    router.push(tabPath);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* Drawer Header */}
      <View style={[styles.header, { borderBottomColor: colorScheme === 'dark' ? '#333' : '#eee' }]}>
        <Ionicons name="construct-outline" size={40} color={themeColors.tint} />
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Smart Field Survey</Text>
        <Text style={styles.headerSubtitle}>v1.0.0</Text>
      </View>

      {/* Tabs Shortcuts */}
      <DrawerItem
        label="Dashboard"
        focused={pathname === '/' || pathname === '/(drawer)/(tabs)'}
        activeTintColor={themeColors.tint}
        inactiveTintColor={themeColors.text}
        icon={({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />}
        onPress={() => navigateToTab('Dashboard', '/')}
      />
      <DrawerItem
        label="Survey (New)"
        focused={pathname.includes('create-survey')}
        activeTintColor={themeColors.tint}
        inactiveTintColor={themeColors.text}
        icon={({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />}
        onPress={() => navigateToTab('New Survey', '/create-survey')}
      />

      {/* Shared/Device Utilities */}
      <View style={[styles.sectionHeader, { borderTopColor: colorScheme === 'dark' ? '#333' : '#eee' }]}>
        <Text style={styles.sectionText}>Device Utilities</Text>
      </View>

      <DrawerItem
        label="Camera"
        focused={pathname.includes('camera')}
        activeTintColor={themeColors.tint}
        inactiveTintColor={themeColors.text}
        icon={({ color, size }) => <Ionicons name="camera-outline" size={size} color={color} />}
        onPress={() => router.push('/camera')}
      />
      <DrawerItem
        label="Contacts"
        focused={pathname.includes('contacts')}
        activeTintColor={themeColors.tint}
        inactiveTintColor={themeColors.text}
        icon={({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />}
        onPress={() => router.push('/contacts')}
      />
      <DrawerItem
        label="Location"
        focused={pathname.includes('location')}
        activeTintColor={themeColors.tint}
        inactiveTintColor={themeColors.text}
        icon={({ color, size }) => <Ionicons name="location-outline" size={size} color={color} />}
        onPress={() => router.push('/location')}
      />
      <DrawerItem
        label="Clipboard"
        focused={pathname.includes('clipboard')}
        activeTintColor={themeColors.tint}
        inactiveTintColor={themeColors.text}
        icon={({ color, size }) => <Ionicons name="clipboard-outline" size={size} color={color} />}
        onPress={() => router.push('/clipboard')}
      />
      <DrawerItem
        label="Settings"
        focused={pathname.includes('settings')}
        activeTintColor={themeColors.tint}
        inactiveTintColor={themeColors.text}
        icon={({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />}
        onPress={() => router.push('/settings')}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.background,
          borderBottomWidth: 1,
          borderBottomColor: colorScheme === 'dark' ? '#333' : '#eee',
        },
        headerTintColor: themeColors.text,
        drawerActiveTintColor: themeColors.tint,
        drawerInactiveTintColor: '#666',
        drawerStyle: {
          backgroundColor: themeColors.background,
          width: 280,
        },
        headerShown: true,
      }}
    >
      {/* Hide (tabs) stack from the main listing but keep it active */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Dashboard',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="camera"
        options={{
          title: 'Camera',
        }}
      />
      <Drawer.Screen
        name="contacts"
        options={{
          title: 'Contacts',
        }}
      />
      <Drawer.Screen
        name="location"
        options={{
          title: 'Location',
        }}
      />
      <Drawer.Screen
        name="clipboard"
        options={{
          title: 'Clipboard',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 8,
    marginTop: 10,
    borderTopWidth: 1,
  },
  sectionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
  },
});
