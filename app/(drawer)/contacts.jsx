import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useSurveys } from '../../context/SurveyContext';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const { updateCurrentSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const fetch = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers], sort: Contacts.SortTypes.FirstName });
        setContacts(data);
        setFiltered(data);
      }
    } catch { Alert.alert('Error', 'Failed to load contacts.'); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetch(); }, []);

  const onRefresh = useCallback(() => { setRefreshing(true); fetch(); }, []);

  const search = (text) => {
    setQuery(text);
    if (!text.trim()) { setFiltered(contacts); return; }
    setFiltered(contacts.filter((c) => c.name?.toLowerCase().includes(text.toLowerCase())));
  };

  const getPhone = (c) => c.phoneNumbers?.[0]?.number || null;

  if (hasPermission === false) {
    return (
      <View style={[styles.center, { backgroundColor: tc.background }]}>
        <Ionicons name="people-outline" size={48} color="#94A3B8" />
        <Text style={[styles.msg, { color: tc.text }]}>Contacts access is required</Text>
        <Pressable style={styles.permBtn} onPress={fetch}><Text style={styles.permBtnText}>Grant Permission</Text></Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: tc.background }]}>
      <View style={[styles.topBar, { borderBottomColor: tc.divider }]}>
        <View style={[styles.search, { backgroundColor: isDark ? tc.card : '#F1F5F9' }]}>
          <Ionicons name="search" size={16} color={tc.muted} style={{ marginRight: 8 }} />
          <TextInput style={[styles.searchInput, { color: tc.text }]} placeholder="Search by name..." placeholderTextColor={tc.muted} value={query} onChangeText={search} />
          {query.length > 0 && <Pressable onPress={() => search('')}><Ionicons name="close-circle" size={16} color={tc.muted} /></Pressable>}
        </View>
        <Text style={[styles.counter, { color: tc.muted }]}>{filtered.length} {filtered.length === 1 ? 'contact' : 'contacts'}</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}><ActivityIndicator size="large" color={tc.tint} /></View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={36} color={tc.muted} />
          <Text style={[styles.emptyTitle, { color: tc.text }]}>No contacts found</Text>
          <Text style={[styles.emptySub, { color: tc.muted }]}>Try a different name</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => {
            const phone = getPhone(item);
            const initial = item.name ? item.name.charAt(0).toUpperCase() : '#';
            return (
              <View style={[styles.card, { backgroundColor: tc.card, borderColor: tc.cardBorder }]}>
                <View style={[styles.avatar, { backgroundColor: tc.tintLight }]}>
                  <Text style={[styles.avatarText, { color: tc.tint }]}>{initial}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={[styles.name, { color: tc.text }]} numberOfLines={1}>{item.name || 'Unknown'}</Text>
                  {phone ? <Text style={[styles.phone, { color: tc.textSecondary }]}>{phone}</Text> : <Text style={styles.noPhone}>No number available</Text>}
                </View>
                <View style={styles.actions}>
                  <Pressable style={[styles.actionIcon, !phone && { opacity: 0.3 }]} disabled={!phone} onPress={async () => { if (phone) { await Clipboard.setStringAsync(phone); Alert.alert('Copied', phone); } }}>
                    <Ionicons name="copy-outline" size={17} color={phone ? tc.tint : tc.muted} />
                  </Pressable>
                  <View style={[styles.divider, { backgroundColor: tc.divider }]} />
                  <Pressable style={[styles.actionIcon, !phone && { opacity: 0.3 }]} disabled={!phone} onPress={() => { if (phone) { updateCurrentSurvey({ contact: { name: item.name || 'Unknown', phoneNumber: phone } }); Alert.alert('Attached', 'Contact added to survey', [{ text: 'OK', onPress: () => router.back() }]); } }}>
                    <Ionicons name="checkmark-circle-outline" size={17} color={phone ? tc.tint : tc.muted} />
                  </Pressable>
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[tc.tint]} tintColor={tc.tint} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  topBar: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1 },
  search: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md, paddingHorizontal: Spacing.md, height: 44 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '600', height: '100%' },
  counter: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: Spacing.sm },
  list: { padding: Spacing.lg, paddingBottom: Spacing['2xl'] },
  card: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, marginBottom: Spacing.sm, borderRadius: Radius.lg, borderWidth: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  avatarText: { fontSize: 18, fontWeight: '800' },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2, marginBottom: 2 },
  phone: { fontSize: 13, fontWeight: '500' },
  noPhone: { fontSize: 12, color: '#94A3B8', fontStyle: 'italic' },
  actions: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(150,150,150,0.08)', borderRadius: 8, padding: 2 },
  actionIcon: { padding: 8 },
  divider: { width: 1, height: 18, marginHorizontal: 2 },
  msg: { fontSize: 16, textAlign: 'center', marginTop: 16, marginBottom: 24 },
  permBtn: { backgroundColor: '#065F46', paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.md },
  permBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  emptyTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3, marginTop: Spacing.md, marginBottom: 4 },
  emptySub: { fontSize: 14 },
});
