import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSurveys } from '../../../context/SurveyContext';
import { Colors } from '../../../constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CreateSurvey() {
  const router = useRouter();
  const { currentSurvey, updateCurrentSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const [errors, setErrors] = useState({});

  const handleUpdate = (field, value) => {
    updateCurrentSurvey({ [field]: value });
    // Clear error for this field if user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateAndProceed = () => {
    let newErrors = {};
    if (!currentSurvey.siteName?.trim()) newErrors.siteName = 'Site Name is required';
    if (!currentSurvey.clientName?.trim()) newErrors.clientName = 'Client Name is required';
    if (!currentSurvey.description?.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Missing Fields', 'Please fill out all required fields before proceeding.');
      return;
    }

    // Proceed to Module 7 (Preview)
    router.push('/preview');
  };

  const renderPriorityButton = (label, value, color) => {
    const isSelected = currentSurvey.priority === value;
    return (
      <Pressable
        key={value}
        style={[
          styles.priorityButton,
          isSelected && { backgroundColor: color, borderColor: color },
          !isSelected && { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }
        ]}
        onPress={() => handleUpdate('priority', value)}
      >
        <Text
          style={[
            styles.priorityText,
            isSelected ? { color: '#FFF' } : { color: themeColors.text }
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Draft New Survey</Text>
        <Text style={styles.headerSub}>Data saves automatically to draft.</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: themeColors.text }]}>Site Name *</Text>
        <TextInput
          style={[
            styles.input,
            { color: themeColors.text, backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: errors.siteName ? '#EF4444' : (isDark ? '#334155' : '#E2E8F0') }
          ]}
          placeholder="e.g., Downtown Metro Station"
          placeholderTextColor="#94A3B8"
          value={currentSurvey.siteName}
          onChangeText={(text) => handleUpdate('siteName', text)}
        />
        {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: themeColors.text }]}>Client Name *</Text>
        <TextInput
          style={[
            styles.input,
            { color: themeColors.text, backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: errors.clientName ? '#EF4444' : (isDark ? '#334155' : '#E2E8F0') }
          ]}
          placeholder="e.g., City Transit Corp"
          placeholderTextColor="#94A3B8"
          value={currentSurvey.clientName}
          onChangeText={(text) => handleUpdate('clientName', text)}
        />
        {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: themeColors.text }]}>Description *</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            { color: themeColors.text, backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: errors.description ? '#EF4444' : (isDark ? '#334155' : '#E2E8F0') }
          ]}
          placeholder="Detailed notes regarding the inspection..."
          placeholderTextColor="#94A3B8"
          value={currentSurvey.description}
          onChangeText={(text) => handleUpdate('description', text)}
          multiline
          textAlignVertical="top"
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: themeColors.text }]}>Priority Level</Text>
        <View style={styles.priorityRow}>
          {renderPriorityButton('Low', 'Low', '#10B981')}
          {renderPriorityButton('Medium', 'Medium', '#F59E0B')}
          {renderPriorityButton('High', 'High', '#EF4444')}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: themeColors.text }]}>Date of Survey</Text>
        <TextInput
          style={[
            styles.input,
            { color: themeColors.text, backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: isDark ? '#334155' : '#E2E8F0' }
          ]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#94A3B8"
          value={currentSurvey.date}
          onChangeText={(text) => handleUpdate('date', text)}
        />
      </View>

      {/* Attachment Indicators */}
      <View style={styles.attachmentContainer}>
        <Text style={[styles.attachmentTitle, { color: themeColors.text }]}>Draft Attachments</Text>
        
        <View style={styles.attachmentBadgeRow}>
          <Pressable 
            style={[styles.badge, currentSurvey.photoUri ? styles.badgeActive : styles.badgeInactive]}
            onPress={() => router.push('/camera')}
          >
            <Ionicons name="camera" size={16} color={currentSurvey.photoUri ? '#FFF' : '#94A3B8'} />
            <Text style={[styles.badgeText, currentSurvey.photoUri ? {color: '#FFF'} : {color: '#94A3B8'}]}>Photo</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.badge, currentSurvey.location ? styles.badgeActive : styles.badgeInactive]}
            onPress={() => router.push('/location')}
          >
            <Ionicons name="location" size={16} color={currentSurvey.location ? '#FFF' : '#94A3B8'} />
            <Text style={[styles.badgeText, currentSurvey.location ? {color: '#FFF'} : {color: '#94A3B8'}]}>Location</Text>
          </Pressable>

          <Pressable 
            style={[styles.badge, currentSurvey.contact ? styles.badgeActive : styles.badgeInactive]}
            onPress={() => router.push('/contacts')}
          >
            <Ionicons name="person" size={16} color={currentSurvey.contact ? '#FFF' : '#94A3B8'} />
            <Text style={[styles.badgeText, currentSurvey.contact ? {color: '#FFF'} : {color: '#94A3B8'}]}>Contact</Text>
          </Pressable>
        </View>
      </View>

      <Pressable 
        style={[styles.submitBtn, { backgroundColor: themeColors.tint }]} 
        onPress={validateAndProceed}
      >
        <Text style={[styles.submitBtnText, { color: isDark ? '#065F46' : '#FFF' }]}>
          Proceed to Preview
        </Text>
        <Ionicons name="arrow-forward" size={20} color={isDark ? '#065F46' : '#FFF'} />
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },
  priorityText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  attachmentContainer: {
    marginTop: 8,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.05)',
  },
  attachmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  attachmentBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeActive: {
    backgroundColor: '#065F46',
    borderColor: '#065F46',
  },
  badgeInactive: {
    backgroundColor: 'transparent',
    borderColor: '#CBD5E1',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
