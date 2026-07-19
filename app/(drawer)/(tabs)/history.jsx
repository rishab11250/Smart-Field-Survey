import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert, Image, Modal } from 'react-native';
import { useSurveys } from '../../../context/SurveyContext';
import { Colors, Spacing, Radius } from '../../../constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';

function Striker({ priority }) {
  const map = { high: '#DC2626', medium: '#C4663F', low: '#065F46' };
  return <View style={[styles.striker, { backgroundColor: map[priority?.toLowerCase()] || '#065F46' }]} />;
}

export default function SurveyHistory() {
  const { surveys, deleteSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.search || '');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(params.search || null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const getPriColor = (p) => {
    switch (p?.toLowerCase()) {
      case 'high': return '#DC2626';
      case 'medium': return tc.accent;
      default: return tc.tint;
    }
  };

  const filtered = useMemo(() => {
    return surveys.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (s.siteName?.toLowerCase().includes(q) || s.id?.toLowerCase().includes(q)) &&
        (activeFilter === 'All' || s.priority?.toLowerCase() === activeFilter.toLowerCase());
    });
  }, [surveys, searchQuery, activeFilter]);

  const handleDelete = (id) => {
    Alert.alert('Delete Record', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteSurvey(id); if (expandedId === id) setExpandedId(null); } },
    ]);
  };

  const Pill = ({ label }) => {
    const active = activeFilter === label;
    return (
      <Pressable
        style={[styles.pill,
          active
            ? { backgroundColor: tc.chrome, borderColor: tc.chrome }
            : { backgroundColor: 'transparent', borderColor: tc.cardBorder },
        ]}
        onPress={() => setActiveFilter(label)}
      >
        <Text style={[styles.pillText, { color: active ? '#FFF' : tc.textSecondary }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: tc.background }]}>
      <View style={[styles.topBar, { borderBottomColor: tc.divider }]}>
        <View style={[styles.search, { backgroundColor: isDark ? tc.chromeLight : '#F1F5F9' }]}>
          <Ionicons name="search" size={15} color={tc.muted} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: tc.text }]}
            placeholder="Search by ID or site..."
            placeholderTextColor={tc.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={15} color={tc.muted} />
            </Pressable>
          )}
        </View>
        <View style={styles.pillRow}>
          {['All', 'High', 'Medium', 'Low'].map((l) => <Pill key={l} label={l} />)}
        </View>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: tc.tintLight }]}>
            <Ionicons name="map-outline" size={30} color={tc.tint} />
          </View>
          <Text style={[styles.emptyTitle, { color: tc.text }]}>No surveys found</Text>
          <Text style={[styles.emptySub, { color: tc.muted }]}>Adjust search or filters</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => {
            const open = expandedId === item.id;
            const pc = getPriColor(item.priority);
            return (
              <View style={[styles.card, { backgroundColor: tc.card, borderColor: tc.cardBorder }]}>
                <Striker priority={item.priority} />
                <View style={styles.cardInner}>
                  <Pressable style={styles.cardHead} onPress={() => setExpandedId(open ? null : item.id)}>
                    <View style={styles.cardTop}>
                      <View style={styles.idRow}>
                        <Text style={[styles.idText, { color: tc.tint }]}>{item.id}</Text>
                        <View style={[styles.idPill, { backgroundColor: pc + '15' }]}>
                          <Text style={[styles.idPillText, { color: pc }]}>{item.priority}</Text>
                        </View>
                      </View>
                      <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={tc.muted} />
                    </View>
                    <Text style={[styles.siteName, { color: tc.text }]}>{item.siteName}</Text>
                    <View style={styles.dateRow}>
                      <Ionicons name="calendar-outline" size={11} color={tc.muted} />
                      <Text style={[styles.dateText, { color: tc.muted }]}>{item.date}</Text>
                    </View>
                  </Pressable>

                  {open && (
                    <View style={[styles.expanded, { borderTopColor: tc.divider }]}>
                      <Detail label="Client" value={item.clientName} tc={tc} />
                      <Detail label="Description" value={item.description} tc={tc} />
                      {item.notes && <Detail label="Notes" value={`"${item.notes}"`} tc={tc} italic />}

                      {(item.location || item.contact || item.photoUri) && (
                        <View style={[styles.attachSection, { borderTopColor: tc.divider }]}>
                          <Text style={[styles.attachLabel, { color: tc.muted }]}>Attachments</Text>
                          {item.location && (
                            <View style={styles.attachRow}>
                              <Ionicons name="location" size={13} color={tc.tint} />
                              <Text style={[styles.attachValue, { color: tc.text }]}>
                                {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
                              </Text>
                            </View>
                          )}
                          {item.contact && (
                            <View style={styles.attachRow}>
                              <Ionicons name="person" size={13} color={tc.tint} />
                              <Text style={[styles.attachValue, { color: tc.text }]}>
                                {item.contact.name} ({item.contact.phoneNumber})
                              </Text>
                            </View>
                          )}
                          {item.photoUri && (
                            <Pressable onPress={() => setFullscreenImage(item.photoUri)}>
                              <Image source={{ uri: item.photoUri }} style={styles.thumb} resizeMode="cover" />
                            </Pressable>
                          )}
                        </View>
                      )}

                      <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash-outline" size={13} color="#DC2626" />
                        <Text style={styles.deleteText}>Delete</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal visible={!!fullscreenImage} transparent animationType="fade" onRequestClose={() => setFullscreenImage(null)}>
        <View style={styles.modalBg}>
          <Pressable style={styles.modalClose} onPress={() => setFullscreenImage(null)}>
            <Ionicons name="close" size={26} color="#FFF" />
          </Pressable>
          {fullscreenImage && <Image source={{ uri: fullscreenImage }} style={styles.modalImg} resizeMode="contain" />}
        </View>
      </Modal>
    </View>
  );
}

function Detail({ label, value, tc, italic }) {
  return (
    <View style={styles.detailBlock}>
      <Text style={[styles.detailLabel, { color: tc.muted }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: tc.text }, italic && { fontStyle: 'italic' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1 },
  search: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md, paddingHorizontal: Spacing.md, height: 42, marginBottom: Spacing.sm },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600', height: '100%' },
  pillRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pill: { flex: 1, alignItems: 'center', paddingVertical: 7, marginHorizontal: 4, borderRadius: 6, borderWidth: 1 },
  pillText: { fontSize: 11, fontWeight: '700' },
  list: { padding: Spacing.lg, paddingBottom: Spacing['2xl'] },
  card: { borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.md, overflow: 'hidden', flexDirection: 'row' },
  striker: { width: 4 },
  cardInner: { flex: 1 },
  cardHead: { padding: Spacing.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  idRow: { flexDirection: 'row', alignItems: 'center' },
  idText: { fontSize: 12, fontWeight: '700', marginRight: Spacing.sm },
  idPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 },
  idPillText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  siteName: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3, marginBottom: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 11, marginLeft: 4, fontWeight: '500' },
  expanded: { padding: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1 },
  detailBlock: { marginBottom: Spacing.sm },
  detailLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  detailValue: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  attachSection: { borderTopWidth: 1, paddingTop: Spacing.md, marginTop: Spacing.sm },
  attachLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm },
  attachRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  attachValue: { fontSize: 12, marginLeft: Spacing.sm, fontWeight: '500' },
  thumb: { width: '100%', height: 120, borderRadius: Radius.md, marginTop: Spacing.sm },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, alignSelf: 'flex-end', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#DC262615' },
  deleteText: { color: '#DC2626', fontSize: 11, fontWeight: '700', marginLeft: 6 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { width: 58, height: 58, borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  emptyTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3, marginBottom: 4 },
  emptySub: { fontSize: 13 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
  modalClose: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8 },
  modalImg: { width: '100%', height: '100%' },
});
