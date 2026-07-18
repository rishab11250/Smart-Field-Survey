import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSurveys } from '../../context/SurveyContext';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SurveyPreview() {
  const router = useRouter();
  const { currentSurvey, submitSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const handleSubmit = () => {
    const savedSurvey = submitSurvey();
    Alert.alert(
      'Survey Submitted!',
      `Survey ${savedSurvey.id} has been successfully logged.`,
      [
        { 
          text: 'View History', 
          onPress: () => router.push('/history') 
        }
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Review Submission</Text>
        <Text style={styles.headerSub}>Please verify all details before submitting.</Text>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
        
        {/* Core Details */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={[styles.siteName, { color: themeColors.text }]}>{currentSurvey.siteName}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(currentSurvey.priority) + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(currentSurvey.priority) }]}>
                {currentSurvey.priority}
              </Text>
            </View>
          </View>
          
          <Text style={styles.clientName}>Client: {currentSurvey.clientName}</Text>
          
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" />
            <Text style={styles.dateText}>{currentSurvey.date}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Description & Notes */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: themeColors.text }]}>Description</Text>
          <Text style={[styles.bodyText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
            {currentSurvey.description}
          </Text>
          
          {currentSurvey.notes ? (
            <View style={styles.notesContainer}>
              <Text style={[styles.sectionLabel, { color: themeColors.text, marginTop: 12 }]}>Additional Notes</Text>
              <Text style={[styles.bodyText, { color: isDark ? '#CBD5E1' : '#475569', fontStyle: 'italic' }]}>
                "{currentSurvey.notes}"
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.divider} />

        {/* Attachments */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: themeColors.text, marginBottom: 12 }]}>Attachments</Text>
          
          {/* Photo */}
          {currentSurvey.photoUri ? (
            <View style={styles.attachmentBlock}>
              <View style={styles.attachmentHeader}>
                <Ionicons name="camera" size={18} color={themeColors.tint} />
                <Text style={[styles.attachmentTitle, { color: themeColors.text }]}>Site Photo</Text>
              </View>
              <Image source={{ uri: currentSurvey.photoUri }} style={styles.previewImage} resizeMode="contain" />
            </View>
          ) : (
            <View style={styles.missingBlock}>
              <Ionicons name="camera-outline" size={18} color="#94A3B8" />
              <Text style={styles.missingText}>No photo attached</Text>
            </View>
          )}

          {/* Location */}
          {currentSurvey.location ? (
            <View style={styles.attachmentBlock}>
              <View style={styles.attachmentHeader}>
                <Ionicons name="location" size={18} color={themeColors.tint} />
                <Text style={[styles.attachmentTitle, { color: themeColors.text }]}>GPS Coordinates</Text>
              </View>
              <View style={[styles.dataBox, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
                <Text style={[styles.dataText, { color: themeColors.text }]}>Lat: {currentSurvey.location.latitude.toFixed(5)}</Text>
                <Text style={[styles.dataText, { color: themeColors.text }]}>Lon: {currentSurvey.location.longitude.toFixed(5)}</Text>
                <Text style={styles.dataSub}>Accuracy: ±{currentSurvey.location.accuracy?.toFixed(1)}m</Text>
              </View>
            </View>
          ) : (
            <View style={styles.missingBlock}>
              <Ionicons name="location-outline" size={18} color="#94A3B8" />
              <Text style={styles.missingText}>No location attached</Text>
            </View>
          )}

          {/* Contact */}
          {currentSurvey.contact ? (
            <View style={styles.attachmentBlock}>
              <View style={styles.attachmentHeader}>
                <Ionicons name="person" size={18} color={themeColors.tint} />
                <Text style={[styles.attachmentTitle, { color: themeColors.text }]}>Client Contact</Text>
              </View>
              <View style={[styles.dataBox, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
                <Text style={[styles.dataText, { color: themeColors.text }]}>{currentSurvey.contact.name}</Text>
                <Text style={styles.dataSub}>{currentSurvey.contact.phoneNumber}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.missingBlock}>
              <Ionicons name="person-outline" size={18} color="#94A3B8" />
              <Text style={styles.missingText}>No contact attached</Text>
            </View>
          )}

        </View>

      </View>

      <View style={styles.actionRow}>
        <Pressable 
          style={[styles.editButton, { borderColor: themeColors.tint }]} 
          onPress={() => router.back()}
        >
          <Ionicons name="create-outline" size={20} color={themeColors.tint} />
          <Text style={[styles.editButtonText, { color: themeColors.tint }]}>Edit Details</Text>
        </Pressable>

        <Pressable 
          style={[styles.submitButton, { backgroundColor: themeColors.tint }]} 
          onPress={handleSubmit}
        >
          <Ionicons name="cloud-upload-outline" size={20} color={isDark ? '#065F46' : '#FFF'} />
          <Text style={[styles.submitButtonText, { color: isDark ? '#065F46' : '#FFF' }]}>Submit Survey</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  section: {
    padding: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    opacity: 0.3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  siteName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  clientName: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.1)',
  },
  attachmentBlock: {
    marginBottom: 16,
  },
  attachmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  dataBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.1)',
  },
  dataText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  dataSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  missingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  missingText: {
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 0.35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  editButtonText: {
    fontWeight: '600',
    marginLeft: 6,
  },
  submitButton: {
    flex: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
