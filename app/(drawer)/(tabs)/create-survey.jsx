import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSurveys } from '../../../context/SurveyContext';
import { Colors, Spacing, Radius } from '../../../constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

const Field = ({ label, field, required, placeholder, multiline, tc, isDark, value, onChangeText, onFocus, onBlur, focusedField, errors, ...rest }) => {
  const focused = focusedField === field;
  const hasError = errors[field];
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: tc.text }]}>
        {label} {required && <Text style={{ color: '#DC2626' }}> *</Text>}
      </Text>
      <View style={[
        styles.fieldWrap,
        focused && { borderColor: tc.tint },
        hasError && { borderColor: '#DC2626' },
        { backgroundColor: isDark ? tc.inputBg : '#F8FAFC', borderColor: hasError ? '#DC2626' : (focused ? tc.tint : tc.cardBorder) },
      ]}>
        {focused && <View style={[styles.fieldAccent, { backgroundColor: tc.tint }]} />}
        <TextInput
          style={[styles.fieldInput, { color: tc.text }, multiline && styles.textArea]}
          placeholder={placeholder}
          placeholderTextColor={tc.muted}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...rest}
        />
      </View>
      {hasError && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );
};

export default function CreateSurvey() {
  const router = useRouter();
  const { currentSurvey, updateCurrentSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const [form, setForm] = useState({ ...currentSurvey });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handleUpdate = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleBlur = () => {
    updateCurrentSurvey(form);
  };

  const validateAndProceed = () => {
    updateCurrentSurvey(form);
    const newErrors = {};
    if (!form.siteName?.trim()) newErrors.siteName = 'Required';
    if (!form.clientName?.trim()) newErrors.clientName = 'Required';
    if (!form.description?.trim()) newErrors.description = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Incomplete', 'Please fill in all required fields.');
      return;
    }
    router.push('/preview');
  };

  const priorities = [
    { label: 'Low', value: 'Low', color: tc.tint },
    { label: 'Medium', value: 'Medium', color: tc.accent },
    { label: 'High', value: 'High', color: '#DC2626' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: tc.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="always"
    >
      <View style={styles.headerArea}>
        <Text style={[styles.headerTitle, { color: tc.text }]}>Draft Survey</Text>
        <Text style={[styles.headerSub, { color: tc.muted }]}>Data persists automatically to your current draft.</Text>
      </View>

      <Field
        label="Site Name"
        field="siteName"
        required
        placeholder="e.g. Downtown Metro Station"
        tc={tc}
        isDark={isDark}
        value={form.siteName}
        onChangeText={(text) => handleUpdate('siteName', text)}
        onFocus={() => setFocusedField('siteName')}
        onBlur={() => { setFocusedField(null); handleBlur(); }}
        focusedField={focusedField}
        errors={errors}
      />
      <Field
        label="Client Name"
        field="clientName"
        required
        placeholder="e.g. City Transit Corp"
        tc={tc}
        isDark={isDark}
        value={form.clientName}
        onChangeText={(text) => handleUpdate('clientName', text)}
        onFocus={() => setFocusedField('clientName')}
        onBlur={() => { setFocusedField(null); handleBlur(); }}
        focusedField={focusedField}
        errors={errors}
      />
      <Field
        label="Description"
        field="description"
        required
        placeholder="Detailed inspection notes..."
        multiline
        tc={tc}
        isDark={isDark}
        value={form.description}
        onChangeText={(text) => handleUpdate('description', text)}
        onFocus={() => setFocusedField('description')}
        onBlur={() => { setFocusedField(null); handleBlur(); }}
        focusedField={focusedField}
        errors={errors}
      />

      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: tc.text }]}>Priority</Text>
        <View style={styles.priorityRow}>
          {priorities.map((p) => {
            const sel = form.priority === p.value;
            return (
              <Pressable
                key={p.value}
                style={[styles.priorityBtn,
                  sel
                    ? { backgroundColor: p.color, borderColor: p.color }
                    : { backgroundColor: isDark ? tc.card : '#F1F5F9', borderColor: tc.cardBorder },
                ]}
                onPress={() => {
                  handleUpdate('priority', p.value);
                  updateCurrentSurvey({ ...form, priority: p.value });
                }}
              >
                <View style={[styles.priDot, { backgroundColor: sel ? '#FFF' : p.color }]} />
                <Text style={[styles.priLabel, { color: sel ? '#FFF' : tc.text }]}>{p.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: tc.text }]}>Date</Text>
        <View style={[styles.fieldWrap, { backgroundColor: isDark ? tc.inputBg : '#F8FAFC', borderColor: tc.cardBorder }]}>
          <TextInput
            style={[styles.fieldInput, { color: tc.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={tc.muted}
            value={form.date}
            onChangeText={(text) => handleUpdate('date', text)}
            onBlur={handleBlur}
          />
        </View>
      </View>

      <View style={[styles.attachCard, { backgroundColor: tc.card, borderColor: tc.cardBorder }]}>
        <View style={[styles.attachAccent, { backgroundColor: tc.tint }]} />
        <View style={styles.attachBody}>
          <Text style={[styles.attachTitle, { color: tc.text }]}>Attachments</Text>
          <View style={styles.attachRow}>
            {[
              { label: 'Photo', icon: 'camera', route: '/camera', active: !!currentSurvey.photoUri },
              { label: 'Location', icon: 'location', route: '/location', active: !!currentSurvey.location },
              { label: 'Contact', icon: 'person', route: '/contacts', active: !!currentSurvey.contact },
            ].map((a) => (
              <Pressable
                key={a.label}
                style={[styles.attachPill,
                  a.active
                    ? { backgroundColor: tc.tint, borderColor: tc.tint }
                    : { backgroundColor: 'transparent', borderColor: tc.cardBorder },
                ]}
                onPress={() => {
                  updateCurrentSurvey(form);
                  router.push(a.route);
                }}
              >
                <Ionicons name={a.icon} size={14} color={a.active ? '#FFF' : tc.muted} />
                <Text style={[styles.attachPillText, { color: a.active ? '#FFF' : tc.muted }]}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <Pressable style={[styles.submitBtn, { backgroundColor: tc.tint }]} onPress={validateAndProceed}>
        <Ionicons name="compass" size={16} color="#FFF" />
        <Text style={styles.submitText}>Review & Submit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing['2xl'] },
  headerArea: { marginBottom: Spacing.lg },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  headerSub: { fontSize: 13, fontWeight: '500' },
  fieldGroup: { marginBottom: Spacing.lg },
  fieldLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3, marginBottom: Spacing.sm },
  fieldWrap: { borderRadius: Radius.md, borderWidth: 1, flexDirection: 'row', overflow: 'hidden' },
  fieldAccent: { width: 3 },
  fieldInput: { flex: 1, paddingHorizontal: Spacing.md, paddingVertical: 13, fontSize: 15, fontWeight: '600' },
  textArea: { height: 100, paddingTop: 13 },
  error: { color: '#DC2626', fontSize: 11, fontWeight: '600', marginTop: 4, marginLeft: 4 },
  priorityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priorityBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRadius: Radius.md, borderWidth: 1, marginHorizontal: 4 },
  priDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 6 },
  priLabel: { fontWeight: '700', fontSize: 13, letterSpacing: -0.2 },
  attachCard: { borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.xl, overflow: 'hidden' },
  attachAccent: { height: 3 },
  attachBody: { padding: Spacing.md },
  attachTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: Spacing.md },
  attachRow: { flexDirection: 'row', justifyContent: 'space-between' },
  attachPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 6, borderWidth: 1 },
  attachPillText: { fontSize: 11, fontWeight: '700', marginLeft: 6, letterSpacing: -0.2 },
  submitBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: Radius.md },
  submitText: { color: '#FFF', fontSize: 15, fontWeight: '700', marginLeft: Spacing.sm, letterSpacing: -0.2 },
});
