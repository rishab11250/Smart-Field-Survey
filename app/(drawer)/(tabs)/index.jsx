import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSurveys } from '../../../context/SurveyContext';
import { Colors } from '../../../constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';

export default function Dashboard() {
  const router = useRouter();
  const { surveys, studentDetails } = useSurveys();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  // Calculate today's survey count dynamically
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysSurveys = surveys.filter(s => s.date === todayStr);
  const todayCount = todaysSurveys.length;

  const quickActions = [
    {
      title: 'New Survey',
      icon: 'document-text',
      color: '#065F46',
      route: '/create-survey'
    },
    {
      title: 'Camera',
      icon: 'camera',
      color: '#EF4444',
      route: '/camera'
    },
    {
      title: 'Location',
      icon: 'location',
      color: '#10B981',
      route: '/location'
    },
    {
      title: 'Contacts',
      icon: 'people',
      color: '#F59E0B',
      route: '/contacts'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const renderRecentSurveyItem = ({ item }) => (
    <Pressable
      style={[
        styles.surveyCard,
        {
          backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF',
          borderColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0',
        }
      ]}
      onPress={() => router.push({ pathname: '/history', params: { search: item.id } })}
    >
      <View style={styles.surveyHeader}>
        <Text style={[styles.surveyId, { color: '#065F46' }]}>{item.id}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
            {item.priority}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.siteName, { color: themeColors.text }]}>{item.siteName}</Text>
      <Text style={styles.clientName}>Client: {item.clientName}</Text>
      
      <View style={styles.surveyFooter}>
        <Ionicons name="calendar-outline" size={14} color="#64748B" />
        <Text style={styles.surveyDate}>{item.date}</Text>
      </View>
    </Pressable>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Area */}
      <View style={styles.welcomeContainer}>
        <View>
          <Text style={[styles.welcomeSub, { color: '#64748B' }]}>Welcome Back,</Text>
          <Text style={[styles.welcomeTitle, { color: themeColors.text }]}>Field Inspector 👋</Text>
        </View>
        <View style={[styles.avatarIcon, { backgroundColor: '#065F4620' }]}>
          <Ionicons name="construct" size={24} color="#065F46" />
        </View>
      </View>

      {/* Student Details Card */}
      <View style={[styles.studentCard, { backgroundColor: '#065F46' }]}>
        <View style={styles.studentInfoLeft}>
          <Text style={styles.studentLabel}>STUDENT INSPECTOR</Text>
          <Text style={styles.studentName}>{studentDetails.name}</Text>
          <Text style={styles.studentId}>ID: {studentDetails.id}</Text>
          <Text style={styles.studentClass}>Semester: {studentDetails.className}</Text>
          <Text style={styles.studentProject}>Project: {studentDetails.project}</Text>
        </View>
        <View style={styles.studentAvatarContainer}>
          <Text style={styles.studentAvatarInitials}>{studentDetails.name ? studentDetails.name.charAt(0) : 'S'}</Text>
        </View>
      </View>

      {/* Stats Summary Card */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#ECFDF5', borderColor: '#10B98120' }]}>
          <Ionicons name="today" size={24} color="#10B981" />
          <Text style={[styles.statCount, { color: themeColors.text }]}>{todayCount}</Text>
          <Text style={styles.statLabel}>Today's Surveys</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#EEF2F6', borderColor: '#065F4620' }]}>
          <Ionicons name="documents" size={24} color="#065F46" />
          <Text style={[styles.statCount, { color: themeColors.text }]}>{surveys.length}</Text>
          <Text style={styles.statLabel}>Total Surveys</Text>
        </View>
      </View>

      {/* Quick Action Grid */}
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Quick Actions</Text>
      <View style={styles.grid}>
        {quickActions.map((action, index) => (
          <Pressable
            key={index}
            style={[
              styles.gridItem,
              {
                backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF',
                borderColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0',
              }
            ]}
            onPress={() => router.push(action.route)}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: action.color + '15' }]}>
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={[styles.actionTitle, { color: themeColors.text }]}>{action.title}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recent Survey Summary */}
      <View style={styles.recentHeaderRow}>
        <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: 0 }]}>Recent Surveys</Text>
        <Pressable onPress={() => router.push('/history')}>
          <Text style={{ color: '#065F46', fontWeight: '600' }}>View All</Text>
        </Pressable>
      </View>

      {surveys.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#F8FAFC' }]}>
          <Ionicons name="document-text-outline" size={48} color="#94A3B8" />
          <Text style={[styles.emptyText, { color: '#64748B' }]}>No surveys conducted yet.</Text>
        </View>
      ) : (
        <FlatList
          data={surveys.slice(0, 3)}
          renderItem={renderRecentSurveyItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  welcomeSub: {
    fontSize: 14,
    fontWeight: '500',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  avatarIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  studentInfoLeft: {
    flex: 1,
  },
  studentLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  studentName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  studentId: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginBottom: 2,
  },
  studentClass: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 2,
  },
  studentProject: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  studentAvatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  studentAvatarInitials: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    flex: 0.48,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statCount: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridItem: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  surveyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  surveyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  surveyId: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  siteName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  surveyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surveyDate: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#94A3B840',
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
});
