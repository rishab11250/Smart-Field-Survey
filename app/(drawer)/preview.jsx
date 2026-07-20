import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSurveys } from '../../context/SurveyContext';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SurveyPreview() {
  const router = useRouter();
  const { currentSurvey, submitSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const getPriColor = (p) => {
    switch (p?.toLowerCase()) {
      case 'high': return '#DC2626';
      case 'medium': return '#B45309';
      default: return '#059669';
    }
  };

  const handleSubmit = () => {
    const saved = submitSurvey();
    Alert.alert('Survey Submitted', `${saved.id} has been logged.`, [
      { text: 'View History', onPress: () => router.push('/history') },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: tc.background }]} contentContainerStyle={styles.content}>
      <View style={styles.headerArea}>
        <Text style={[styles.headerTitle, { color: tc.text }]}>Review Submission</Text>
        <Text style={[styles.headerSub, { color: tc.muted }]}>Verify all details before submitting.</Text>
      </View>

      <View style={[styles.card, { backgroundColor: tc.card, borderColor: tc.cardBorder }]}>
        <View style={[styles.striker, { backgroundColor: tc.tint }]} />
        <View style={styles.cardInner}>
          <View style={styles.section}>
            <View style={styles.titleRow}>
              <Text style={[styles.siteName, { color: tc.text }]}>{currentSurvey.siteName || 'Unnamed Site'}</Text>
              <View style={[styles.priPill, { backgroundColor: getPriColor(currentSurvey.priority) + '15' }]}>
                <Text style={[styles.priPillText, { color: getPriColor(currentSurvey.priority) }]}>{currentSurvey.priority}</Text>
              </View>
            </View>
            <Text style={[styles.clientName, { color: tc.textSecondary }]}>Client: {currentSurvey.clientName}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={13} color={tc.muted} />
              <Text style={[styles.dateText, { color: tc.muted }]}>{currentSurvey.date}</Text>
            </View>
          </View>

          <View style={[styles.sep, { backgroundColor: tc.divider }]} />

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: tc.text }]}>Description</Text>
            <Text style={[styles.bodyText, { color: tc.textSecondary }]}>{currentSurvey.description || '—'}</Text>
            {currentSurvey.notes && (
              <View style={[styles.notesBlock, { borderTopColor: tc.divider }]}>
                <Text style={[styles.sectionLabel, { color: tc.text }]}>Notes</Text>
                <Text style={[styles.bodyText, { color: tc.textSecondary, fontStyle: 'italic' }]}>{"\"" + currentSurvey.notes + "\""}</Text>
              </View>
            )}
          </View>

          <View style={[styles.sep, { backgroundColor: tc.divider }]} />

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: tc.text, marginBottom: Spacing.md }]}>Attachments</Text>

            {currentSurvey.photoUri ? (
              <View style={styles.attachBlock}>
                <View style={styles.attachHead}><Ionicons name="camera" size={14} color={tc.tint} /><Text style={[styles.attachLabel, { color: tc.text }]}>Site Photo</Text></View>
                <Image source={{ uri: currentSurvey.photoUri }} style={styles.photo} resizeMode="contain" />
              </View>
            ) : (
              <View style={styles.missing}><Ionicons name="camera-outline" size={14} color={tc.muted} /><Text style={styles.missingText}>No photo</Text></View>
            )}

            {currentSurvey.location ? (
              <View style={styles.attachBlock}>
                <View style={styles.attachHead}><Ionicons name="location" size={14} color={tc.tint} /><Text style={[styles.attachLabel, { color: tc.text }]}>GPS Coordinates</Text></View>
                <View style={[styles.dataBox, { backgroundColor: isDark ? '#060C09' : '#F8FAFC' }]}>
                  <Text style={[styles.dataText, { color: tc.text }]}>{currentSurvey.location.latitude.toFixed(5)}, {currentSurvey.location.longitude.toFixed(5)}</Text>
                  <Text style={styles.dataSub}>Accuracy: ±{currentSurvey.location.accuracy?.toFixed(1) || '?'}m</Text>
                </View>
              </View>
            ) : (
              <View style={styles.missing}><Ionicons name="location-outline" size={14} color={tc.muted} /><Text style={styles.missingText}>No location</Text></View>
            )}

            {currentSurvey.contact ? (
              <View style={styles.attachBlock}>
                <View style={styles.attachHead}><Ionicons name="person" size={14} color={tc.tint} /><Text style={[styles.attachLabel, { color: tc.text }]}>Client Contact</Text></View>
                <View style={[styles.dataBox, { backgroundColor: isDark ? '#060C09' : '#F8FAFC' }]}>
                  <Text style={[styles.dataText, { color: tc.text }]}>{currentSurvey.contact.name}</Text>
                  <Text style={styles.dataSub}>{currentSurvey.contact.phoneNumber}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.missing}><Ionicons name="person-outline" size={14} color={tc.muted} /><Text style={styles.missingText}>No contact</Text></View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={[styles.editBtn, { borderColor: tc.tint }]} onPress={() => router.back()}>
          <Ionicons name="create-outline" size={16} color={tc.tint} />
          <Text style={[styles.editBtnText, { color: tc.tint }]}>Edit</Text>
        </Pressable>
        <Pressable style={[styles.submitBtn, { backgroundColor: tc.tint }]} onPress={handleSubmit}>
          <Ionicons name="compass" size={16} color={isDark ? '#0A1410' : '#FFF'} />
          <Text style={[styles.submitBtnText, { color: isDark ? '#0A1410' : '#FFF' }]}>Submit Survey</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing['2xl'] },
  headerArea: { marginBottom: Spacing.lg, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { fontSize: 14, marginTop: 4, fontWeight: '500' },
  card: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden', marginBottom: Spacing.lg, flexDirection: 'row' },
  striker: { width: 5 },
  cardInner: { flex: 1 },
  section: { padding: Spacing.lg },
  sep: { height: 1, opacity: 0.2 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  siteName: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3, flex: 1, marginRight: Spacing.md },
  priPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  priPillText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  clientName: { fontSize: 15, fontWeight: '500', marginBottom: Spacing.sm },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 13, marginLeft: 6, fontWeight: '500' },
  sectionLabel: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2, marginBottom: Spacing.sm },
  bodyText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
  notesBlock: { borderTopWidth: 1, marginTop: Spacing.md, paddingTop: Spacing.md },
  attachBlock: { marginBottom: Spacing.md },
  attachHead: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  attachLabel: { fontSize: 13, fontWeight: '700', marginLeft: Spacing.sm, letterSpacing: -0.2 },
  photo: { width: '100%', height: 180, borderRadius: Radius.md, backgroundColor: '#000' },
  dataBox: { padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: 'rgba(150,150,150,0.1)' },
  dataText: { fontSize: 14, fontWeight: '600', fontFamily: 'monospace', letterSpacing: -0.3, marginBottom: 2 },
  dataSub: { fontSize: 12, color: '#64748B', marginTop: 4 },
  missing: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, opacity: 0.6 },
  missingText: { fontSize: 14, color: '#94A3B8', marginLeft: Spacing.sm, fontStyle: 'italic' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  editBtn: { flex: 0.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: Radius.md, borderWidth: 1 },
  editBtnText: { fontWeight: '700', marginLeft: 6, fontSize: 14 },
  submitBtn: { flex: 0.65, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: Radius.md },
  submitBtnText: { fontSize: 16, fontWeight: '700', marginLeft: Spacing.sm, letterSpacing: -0.2 },
});
