import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, Radius } from '../../../constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useSurveys } from '../../../context/SurveyContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tc.tabIconSelected,
        tabBarInactiveTintColor: tc.tabIconDefault,
        tabBarStyle: {
          backgroundColor: isDark ? tc.chrome : '#FFF',
          borderTopWidth: 1,
          borderTopColor: tc.divider,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        headerStyle: {
          backgroundColor: isDark ? tc.chrome : '#FFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: tc.divider,
        },
        headerTintColor: tc.text,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 17,
          letterSpacing: -0.5,
        },
        headerLeft: () => (
          <DrawerToggleButton tintColor={tc.text} />
        ),
        headerRight: () => {
          const { toggleTheme } = useSurveys();
          return (
            <View style={styles.headerRightContainer}>
              <Pressable
                onPress={toggleTheme}
                style={[styles.themeToggle, { backgroundColor: isDark ? tc.surface : tc.background }]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={isDark ? 'sunny' : 'moon'}
                  size={15}
                  color={tc.textSecondary}
                />
              </Pressable>
              <Pressable
                onPress={() => router.push('/profile')}
                style={[styles.avatarBadge, { backgroundColor: tc.tint }]}
              >
                <Text style={styles.avatarLetter}>RC</Text>
              </Pressable>
            </View>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-survey"
        options={{
          title: 'New Survey',
          tabBarLabel: 'New Survey',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    marginRight: 10,
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBadge: {
    marginRight: 16,
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontWeight: '800',
    fontSize: 12,
    color: '#FFF',
    letterSpacing: 0.5,
  },
});
