import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useSurveys } from '../../context/SurveyContext';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { updateCurrentSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const fetchLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setErrorMsg('Location access denied.'); setIsLoading(false); return; }
      let loc;
      try {
        const acc = Platform.OS === 'web' ? Location.Accuracy.Low : Location.Accuracy.Balanced;
        loc = await Promise.race([Location.getCurrentPositionAsync({ accuracy: acc }), new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 3000))]);
      } catch {
        loc = await Location.getLastKnownPositionAsync();
        if (!loc) throw new Error();
      }
      setLocation(loc);
    } catch { setErrorMsg('Could not fetch location. Ensure GPS is enabled.'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchLocation(); }, []);

  return (
    <View style={[styles.container, { backgroundColor: tc.background }]}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: tc.tintLight }]}>
          <Ionicons name="location" size={28} color={tc.tint} />
        </View>
        <Text style={[styles.title, { color: tc.text }]}>Current Location</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={tc.tint} />
          <Text style={[styles.loadText, { color: tc.textSecondary }]}>Acquiring GPS signal...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.center}>
          <Ionicons name="warning-outline" size={36} color="#DC2626" />
          <Text style={[styles.errorText, { color: tc.text }]}>{errorMsg}</Text>
          <Pressable style={[styles.btn, { backgroundColor: tc.tint }]} onPress={fetchLocation}>
            <Text style={styles.btnText}>Retry</Text>
          </Pressable>
        </View>
      ) : location ? (
        <View style={styles.content}>
          <View style={[styles.coordCard, { backgroundColor: tc.card, borderColor: tc.cardBorder }]}>
            <View style={[styles.striker, { backgroundColor: tc.tint }]} />
            <View style={styles.coordBody}>
              {[
                { label: 'Latitude', value: `${location.coords.latitude.toFixed(6)}°` },
                { label: 'Longitude', value: `${location.coords.longitude.toFixed(6)}°` },
                { label: 'Accuracy', value: `±${location.coords.accuracy ? location.coords.accuracy.toFixed(1) : '?'}m` },
              ].map((r, i) => (
                <React.Fragment key={r.label}>
                  <View style={styles.coordRow}>
                    <Text style={[styles.coordLabel, { color: tc.muted }]}>{r.label}</Text>
                    <Text style={[styles.coordValue, { color: tc.text }]}>{r.value}</Text>
                  </View>
                  {i < 2 && <View style={[styles.divider, { backgroundColor: tc.divider }]} />}
                </React.Fragment>
              ))}
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={[styles.secondaryBtn, { backgroundColor: isDark ? tc.card : '#F1F5F9', borderColor: tc.cardBorder }]} onPress={fetchLocation}>
              <Ionicons name="refresh" size={18} color={tc.text} />
              <Text style={[styles.secondaryText, { color: tc.text }]}>Refresh</Text>
            </Pressable>
            <Pressable style={[styles.secondaryBtn, { backgroundColor: isDark ? tc.card : '#F1F5F9', borderColor: tc.cardBorder }]} onPress={async () => {
              if (!location) return;
              await Clipboard.setStringAsync(`Lat: ${location.coords.latitude.toFixed(6)}, Lon: ${location.coords.longitude.toFixed(6)}`);
              Alert.alert('Copied', 'Coordinates copied.');
            }}>
              <Ionicons name="copy-outline" size={18} color={tc.text} />
              <Text style={[styles.secondaryText, { color: tc.text }]}>Copy</Text>
            </Pressable>
          </View>

          <Pressable style={[styles.attachBtn, { backgroundColor: tc.tint }]} onPress={() => {
            if (!location) return;
            updateCurrentSurvey({ location: { latitude: location.coords.latitude, longitude: location.coords.longitude, accuracy: location.coords.accuracy } });
            Alert.alert('Attached', 'Location added to draft', [{ text: 'OK', onPress: () => router.back() }]);
          }}>
            <Ionicons name="compass" size={20} color={isDark ? '#0A1410' : '#FFF'} />
            <Text style={[styles.attachText, { color: isDark ? '#0A1410' : '#FFF' }]}>Attach to Draft</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg },
  header: { alignItems: 'center', marginTop: Spacing.md, marginBottom: Spacing.xl },
  iconBox: { width: 56, height: 56, borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadText: { marginTop: Spacing.md, fontSize: 15, fontWeight: '500' },
  errorText: { fontSize: 15, textAlign: 'center', marginVertical: Spacing.md, paddingHorizontal: Spacing.lg },
  btn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.md },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  content: { flex: 1 },
  coordCard: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden', marginBottom: Spacing.lg, flexDirection: 'row' },
  striker: { width: 5 },
  coordBody: { flex: 1, padding: Spacing.lg },
  coordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  coordLabel: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  coordValue: { fontSize: 18, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', letterSpacing: -0.5 },
  divider: { height: 1, marginVertical: Spacing.sm, opacity: 0.4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  secondaryBtn: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: Radius.md, borderWidth: 1 },
  secondaryText: { fontWeight: '700', marginLeft: Spacing.sm, fontSize: 14, letterSpacing: -0.2 },
  attachBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: Radius.md },
  attachText: { fontSize: 16, fontWeight: '700', marginLeft: Spacing.sm, letterSpacing: -0.2 },
});
