import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../../constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useSurveys } from '../../../context/SurveyContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tint,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#333' : '#eee',
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: themeColors.background,
          borderBottomWidth: 1,
          borderBottomColor: colorScheme === 'dark' ? '#333' : '#eee',
        },
        headerTintColor: themeColors.text,
        // Custom left button to toggle drawer on tab screens
        headerLeft: () => (
          <DrawerToggleButton tintColor={themeColors.text} />
        ),
        // Custom right buttons: Theme Toggle + Profile Avatar
        headerRight: () => {
          const { toggleTheme } = useSurveys();
          return (
            <View style={styles.headerRightContainer}>
              <Pressable
                onPress={toggleTheme}
                style={styles.themeToggleButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={colorScheme === 'dark' ? 'sunny' : 'moon'}
                  size={20}
                  color={themeColors.text}
                />
              </Pressable>
              <Pressable
                onPress={() => router.push('/profile')}
                style={[
                  styles.avatarHeaderButton,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#065F46' : '#D1FAE5',
                  }
                ]}
              >
                <Text
                  style={[
                    styles.avatarHeaderText,
                    { color: colorScheme === 'dark' ? '#D1FAE5' : '#065F46' }
                  ]}
                >
                  RC
                </Text>
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
            <Ionicons name="home" size={size} color={color} />
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
            <Ionicons name="list" size={size} color={color} />
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
  themeToggleButton: {
    marginRight: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHeaderButton: {
    marginRight: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#065F4630',
  },
  avatarHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
