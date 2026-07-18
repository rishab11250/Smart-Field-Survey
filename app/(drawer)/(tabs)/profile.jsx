import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';
import { useSurveys } from '../../../context/SurveyContext';

export default function Profile() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { surveys } = useSurveys();

  const student = {
    name: 'Rishab Chandgothia',
    id: '108713',
    class: 'SEM-3',
    course: 'React Native Mobile Application Dev',
    email: 'rishab.chandgothia@college.edu',
    project: 'Smart-Field-Survey',
    year: '2026'
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header Profile Section */}
      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>RC</Text>
        </View>
        <Text style={[styles.name, { color: themeColors.text }]}>{student.name}</Text>
        <Text style={styles.subtext}>Student Inspector</Text>
      </View>

      {/* Stats Quick View */}
      <View style={[styles.statsContainer, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#F8FAFC' }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#065F46' }]}>{surveys.length}</Text>
          <Text style={styles.statLabel}>Surveys Run</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#065F46' }]}>Active</Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#065F46' }]}>100%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      {/* Details List */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Academic Details</Text>
        
        <View style={[styles.detailRow, { borderBottomColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="card-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View>
            <Text style={styles.rowLabel}>Student ID / Roll No</Text>
            <Text style={[styles.rowValue, { color: themeColors.text }]}>{student.id}</Text>
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="school-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View>
            <Text style={styles.rowLabel}>Class & Semester</Text>
            <Text style={[styles.rowValue, { color: themeColors.text }]}>{student.class}</Text>
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="book-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View>
            <Text style={styles.rowLabel}>Course</Text>
            <Text style={[styles.rowValue, { color: themeColors.text }]}>{student.course}</Text>
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="mail-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View>
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={[styles.rowValue, { color: themeColors.text }]}>{student.email}</Text>
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="ribbon-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View>
            <Text style={styles.rowLabel}>Project Assignment</Text>
            <Text style={[styles.rowValue, { color: themeColors.text }]}>{student.project}</Text>
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="calendar-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View>
            <Text style={styles.rowLabel}>Academic Year</Text>
            <Text style={[styles.rowValue, { color: themeColors.text }]}>{student.year}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#065F46',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#CBD5E1',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowIcon: {
    marginRight: 16,
  },
  rowLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },
});
