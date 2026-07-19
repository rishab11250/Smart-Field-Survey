import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import { useSurveys } from '../../context/SurveyContext';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ClipboardScreen() {
  const [clip, setClip] = useState('');
  const [mediaPerm, requestMediaPerm] = MediaLibrary.usePermissions({ writeOnly: true });
  const { currentSurvey, updateCurrentSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const fetchClip = async () => { setClip(await Clipboard.getStringAsync()); };
  useEffect(() => { fetchClip(); const i = setInterval(fetchClip, 2000); return () => clearInterval(i); }, []);

  const copy = async (type, text) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    setClip(text);
    Alert.alert('Copied', `${type} copied`);
  };

  const tempId = `DRAFT-${new Date().toISOString().split('T')[0]}`;
  const contactStr = currentSurvey.contact?.phoneNumber || '';
  const locStr = currentSurvey.location
    ? `${currentSurvey.location.latitude.toFixed(5)}, ${currentSurvey.location.longitude.toFixed(5)}`
    : '';

  return (
    <ScrollView style={[styles.container, { backgroundColor: tc.background }]}>
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Ionicons name="push-outline" size={20} color={tc.tint} />
          <Text style={[styles.sectionTitle, { color: tc.text }]}>Extract from Draft</Text>
        </View>
        <Text style={[styles.sectionSub, { color: tc.muted }]}>Copy data from your active survey.</Text>

        {[
          { label: 'Survey ID', value: tempId, empty: false },
          { label: 'Contact Number', value: contactStr, empty: !contactStr },
          { label: 'Coordinates', value: locStr, empty: !locStr },
        ].map((item) => (
          <Pressable
            key={item.label}
            style={[styles.copyCard, { backgroundColor: tc.card, borderColor: tc.cardBorder }, item.empty && { opacity: 0.5 }]}
            onPress={() => copy(item.label, item.value)}
            disabled={item.empty}
          >
            <View style={styles.copyLeft}>
              <Text style={[styles.copyLabel, { color: tc.muted }]}>{item.label}</Text>
              <Text style={[styles.copyValue, { color: item.empty ? tc.muted : tc.text }]} numberOfLines={1}>
                {item.value || 'Not available'}
              </Text>
            </View>
            <Ionicons name="copy-outline" size={20} color={item.empty ? tc.muted : tc.tint} />
          </Pressable>
        ))}

        {currentSurvey.photoUri ? (
          <View style={[styles.photoCard, { backgroundColor: tc.card, borderColor: tc.cardBorder }]}>
            <Image source={{ uri: currentSurvey.photoUri }} style={styles.photoImg} resizeMode="cover" />
            <View style={styles.photoFooter}>
              <View>
                <Text style={[styles.copyLabel, { color: tc.muted }]}>Site Photo</Text>
                <Text style={[styles.copyValue, { color: tc.text }]}>Ready to save</Text>
              </View>
              <Pressable style={[styles.saveBtn, { backgroundColor: tc.tint }]} onPress={async () => {
                if (!currentSurvey.photoUri) return;
                try {
                  if (mediaPerm?.status !== 'granted') {
                    const p = await requestMediaPerm();
                    if (!p.granted) { Alert.alert('Permission Required', 'Gallery access needed.'); return; }
                  }
                  await MediaLibrary.saveToLibraryAsync(currentSurvey.photoUri);
                  Alert.alert('Saved!', 'Photo saved to gallery.');
                } catch { Alert.alert('Error', 'Failed to save photo.'); }
              }}>
                <Ionicons name="download-outline" size={16} color={isDark ? '#0A1410' : '#FFF'} />
                <Text style={[styles.saveBtnText, { color: isDark ? '#0A1410' : '#FFF' }]}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={[styles.copyCard, { backgroundColor: tc.card, borderColor: tc.cardBorder }, { opacity: 0.5 }]}>
            <View style={styles.copyLeft}>
              <Text style={[styles.copyLabel, { color: tc.muted }]}>Site Photo</Text>
              <Text style={[styles.copyValue, { color: tc.muted }]}>No photo attached</Text>
            </View>
            <Ionicons name="image-outline" size={20} color={tc.muted} />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Ionicons name="clipboard-outline" size={20} color={tc.tint} />
          <Text style={[styles.sectionTitle, { color: tc.text }]}>Clipboard Viewer</Text>
        </View>

        <View style={[styles.viewer, { backgroundColor: isDark ? '#060C09' : '#F1F5F9', borderColor: tc.cardBorder }]}>
          {clip ? (
            <Text style={[styles.viewerText, { color: tc.text }]}>{clip}</Text>
          ) : (
            <Text style={styles.viewerEmpty}>Clipboard is empty</Text>
          )}
        </View>

        <View style={styles.clipActions}>
          <Pressable style={[styles.pasteBtn, { backgroundColor: tc.tint }]} onPress={() => {
            if (!clip) { Alert.alert('Empty', 'Nothing to paste.'); return; }
            const existing = currentSurvey.notes || '';
            updateCurrentSurvey({ notes: existing ? `${existing}\n${clip}` : clip });
            Alert.alert('Pasted!', 'Content appended to notes.');
          }}>
            <Ionicons name="document-text-outline" size={16} color={isDark ? '#0A1410' : '#FFF'} />
            <Text style={[styles.pasteText, { color: isDark ? '#0A1410' : '#FFF' }]}>Paste to Notes</Text>
          </Pressable>
          <Pressable style={styles.clearBtn} onPress={async () => {
            await Clipboard.setStringAsync('');
            setClip('');
            Alert.alert('Cleared', 'Clipboard emptied.');
          }}>
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.06)' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3, marginLeft: Spacing.sm },
  sectionSub: { fontSize: 13, marginBottom: Spacing.lg, fontWeight: '500' },
  copyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.sm },
  copyLeft: { flex: 1, marginRight: Spacing.md },
  copyLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  copyValue: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  photoCard: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },
  photoImg: { width: '100%', height: 190, backgroundColor: '#000' },
  photoFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
  saveBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  saveBtnText: { fontWeight: '700', marginLeft: 6, fontSize: 13 },
  viewer: { minHeight: 90, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, justifyContent: 'center', marginBottom: Spacing.md },
  viewerText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
  viewerEmpty: { fontSize: 15, color: '#94A3B8', fontStyle: 'italic', textAlign: 'center' },
  clipActions: { flexDirection: 'row', alignItems: 'center' },
  pasteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 14, borderRadius: Radius.md, marginRight: Spacing.sm },
  pasteText: { fontSize: 15, fontWeight: '700', marginLeft: Spacing.sm, letterSpacing: -0.2 },
  clearBtn: { width: 52, height: 52, borderRadius: Radius.md, borderWidth: 1, borderColor: '#DC2626', alignItems: 'center', justifyContent: 'center' },
});
