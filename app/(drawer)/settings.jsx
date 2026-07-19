import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Colors, Spacing, Radius } from '../../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: tc.background }]}>
      <View style={[styles.card, { backgroundColor: tc.card, borderColor: tc.cardBorder }]}>
        <View style={[styles.striker, { backgroundColor: tc.tint }]} />
        <View style={styles.body}>
          <View style={[styles.iconBox, { backgroundColor: tc.tintLight }]}>
            <Ionicons name="settings-outline" size={32} color={tc.tint} />
          </View>
          <Text style={[styles.title, { color: tc.text }]}>Settings</Text>
          <Text style={[styles.sub, { color: tc.muted }]}>Coming soon</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  card: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden', flexDirection: 'row', width: '100%' },
  striker: { width: 5 },
  body: { flex: 1, padding: Spacing.xl, alignItems: 'center' },
  iconBox: { width: 64, height: 64, borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4 },
  sub: { fontSize: 14, fontWeight: '500' },
});
