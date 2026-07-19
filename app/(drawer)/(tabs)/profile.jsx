import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors, Spacing, Radius } from '../../../constants/theme';
import { useSurveys } from '../../../context/SurveyContext';

export default function Profile() {
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];
  const { studentDetails, setStudentDetails } = useSurveys();
  const isDark = colorScheme === 'dark';

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(studentDetails);

  const initials = (name) => {
    if (!name) return 'ID';
    const p = name.split(' ');
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  const save = () => { setStudentDetails(form); setEditing(false); };
  const cancel = () => { setForm(studentDetails); setEditing(false); };

  const fields = [
    { key: 'name', icon: 'person-outline', label: 'Full Name' },
    { key: 'id', icon: 'card-outline', label: 'Student ID' },
    { key: 'className', icon: 'school-outline', label: 'Class' },
    { key: 'course', icon: 'book-outline', label: 'Course' },
    { key: 'email', icon: 'mail-outline', label: 'Email' },
    { key: 'project', icon: 'ribbon-outline', label: 'Project' },
    { key: 'year', icon: 'calendar-outline', label: 'Year' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: tc.background }]}>
      {/* Dark chrome hero — not green */}
      <View style={[styles.hero, { backgroundColor: tc.chrome }]}>
        <View style={[styles.avatarRing, { borderColor: 'rgba(255,255,255,0.2)' }]}>
          <Text style={styles.avatarText}>{initials(studentDetails.name)}</Text>
        </View>
        <Text style={styles.nameText}>{studentDetails.name}</Text>
        <Text style={styles.roleText}>Student Inspector</Text>
        {!editing && (
          <Pressable style={[styles.editPill, { backgroundColor: 'rgba(255,255,255,0.1)' }]} onPress={() => setEditing(true)}>
            <Ionicons name="pencil" size={12} color="#FFF" />
            <Text style={styles.editPillText}>Edit</Text>
          </Pressable>
        )}
      </View>

      {/* Detail card with emerald striker */}
      <View style={[styles.card, { backgroundColor: tc.card, borderColor: tc.cardBorder }]}>
        <View style={[styles.striker, { backgroundColor: tc.tint }]} />
        <View style={styles.cardBody}>
          {fields.map((f, i) => (
            <View key={f.key} style={[styles.row, i < fields.length - 1 && { borderBottomWidth: 1, borderBottomColor: tc.divider }]}>
              <View style={[styles.iconBox, { backgroundColor: tc.tintLight }]}>
                <Ionicons name={f.icon} size={15} color={tc.tint} />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowLabel, { color: tc.muted }]}>{f.label}</Text>
                {editing ? (
                  <TextInput
                    style={[styles.editInput, { color: tc.text, borderBottomColor: tc.tint }]}
                    value={form[f.key]}
                    onChangeText={(t) => setForm({ ...form, [f.key]: t })}
                    {...(f.key === 'email' ? { autoCapitalize: 'none', keyboardType: 'email-address' } : {})}
                    {...(f.key === 'year' ? { keyboardType: 'numeric' } : {})}
                  />
                ) : (
                  <Text style={[styles.rowValue, { color: tc.text }]}>{studentDetails[f.key]}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {editing && (
        <View style={styles.actions}>
          <Pressable style={[styles.actionBtn, { backgroundColor: 'rgba(150,150,150,0.12)' }]} onPress={cancel}>
            <Text style={{ fontWeight: '700', color: '#64748B' }}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, { backgroundColor: tc.tint }]} onPress={save}>
            <Text style={[styles.saveText, { color: '#FFF' }]}>Save</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    marginBottom: Spacing.lg,
  },
  avatarRing: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 2.5,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { color: '#FFF', fontSize: 30, fontWeight: '800', letterSpacing: 0.5 },
  nameText: { color: '#FFF', fontSize: 20, fontWeight: '800', letterSpacing: -0.3, marginBottom: 2 },
  roleText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' },
  editPill: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: Spacing.md,
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 8,
  },
  editPillText: { color: '#FFF', fontWeight: '700', fontSize: 12, marginLeft: 6 },

  card: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg, borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  striker: { width: 4 },
  cardBody: { flex: 1, padding: Spacing.md },

  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm,
  },
  iconBox: {
    width: 34, height: 34, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.md,
  },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  rowValue: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  editInput: {
    fontSize: 15, fontWeight: '700', letterSpacing: -0.2,
    borderBottomWidth: 1.5, paddingVertical: 2,
  },

  actions: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  actionBtn: {
    flex: 1, paddingVertical: 13, alignItems: 'center',
    borderRadius: Radius.md, marginHorizontal: 4,
  },
  saveText: { fontWeight: '700', fontSize: 14, letterSpacing: -0.2 },
});
