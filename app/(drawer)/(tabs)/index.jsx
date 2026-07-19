import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSurveys } from '../../../context/SurveyContext';
import { Colors, Spacing, Radius } from '../../../constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';

function Striker({ priority }) {
  const map = { high: '#DC2626', medium: '#C4663F', low: '#065F46' };
  return <View style={[styles.striker, { backgroundColor: map[priority?.toLowerCase()] || '#065F46' }]} />;
}

export default function Dashboard() {
  const router = useRouter();
  const { surveys, studentDetails } = useSurveys();
  const colorScheme = useColorScheme();
  const tc = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = surveys.filter(s => s.date === todayStr).length;

  const quickActions = [
    { title: 'New Survey', icon: 'document-text', color: tc.tint, route: '/create-survey' },
    { title: 'Camera', icon: 'camera', color: '#DC2626', route: '/camera' },
    { title: 'Location', icon: 'location', color: tc.tint, route: '/location' },
    { title: 'Contacts', icon: 'people', color: tc.accent, route: '/contacts' },
  ];

  const getPriColor = (p) => {
    switch (p?.toLowerCase()) {
      case 'high': return '#DC2626';
      case 'medium': return tc.accent;
      default: return tc.tint;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: tc.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero — dark chrome, not green */}
      <View style={[styles.hero, { backgroundColor: tc.chrome }]}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroGreeting}>Good morning,</Text>
            <Text style={styles.heroName}>{studentDetails.name?.split(' ')[0]}</Text>
            <Text style={styles.heroMeta}>ID {studentDetails.id}  ·  {studentDetails.className}</Text>
          </View>
          <View style={styles.heroEmblem}>
            <Ionicons name="compass" size={36} color="#FFF" />
          </View>
        </View>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>{todayCount}</Text>
            <Text style={styles.heroStatLabel}>Today</Text>
          </View>
          <View style={[styles.heroStatDivider, { backgroundColor: 'rgba(255,255,255,0.15)' }]} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>{surveys.length}</Text>
            <Text style={styles.heroStatLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Field Tools */}
      <Text style={[styles.sectionTitle, { color: tc.muted }]}>FIELD TOOLS</Text>
      <View style={styles.grid}>
        {quickActions.map((a, i) => (
          <Pressable
            key={i}
            style={[styles.gridItem, { backgroundColor: tc.card, borderColor: tc.cardBorder }]}
            onPress={() => router.push(a.route)}
          >
            <View style={[styles.gridIconWrap, { backgroundColor: a.color + '12' }]}>
              <Ionicons name={a.icon} size={24} color={a.color} />
            </View>
            <Text style={[styles.gridLabel, { color: tc.text }]}>{a.title}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recent Surveys */}
      <View style={styles.recentHeader}>
        <Text style={[styles.sectionTitle, { color: tc.muted }]}>RECENT SURVEYS</Text>
        <Pressable onPress={() => router.push('/history')}>
          <Text style={[styles.viewAll, { color: tc.tint }]}>View all</Text>
        </Pressable>
      </View>

      {surveys.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: tc.card, borderColor: tc.cardBorder }]}>
          <View style={[styles.emptyIconBox, { backgroundColor: tc.tintLight }]}>
            <Ionicons name="compass-outline" size={30} color={tc.tint} />
          </View>
          <Text style={[styles.emptyTitle, { color: tc.text }]}>Ready for the field</Text>
          <Text style={[styles.emptySub, { color: tc.muted }]}>Your first survey is a tap away</Text>
        </View>
      ) : (
        surveys.slice(0, 3).map((item) => (
          <Pressable
            key={item.id}
            style={[styles.surveyCard, { backgroundColor: tc.card, borderColor: tc.cardBorder }]}
            onPress={() => router.push({ pathname: '/history', params: { search: item.id } })}
          >
            <Striker priority={item.priority} />
            <View style={styles.surveyBody}>
              <View style={styles.surveyTop}>
                <Text style={[styles.surveyId, { color: tc.tint }]}>{item.id}</Text>
                <View style={[styles.surveyPill, { backgroundColor: getPriColor(item.priority) + '15' }]}>
                  <Text style={[styles.surveyPillText, { color: getPriColor(item.priority) }]}>{item.priority}</Text>
                </View>
              </View>
              <Text style={[styles.surveySite, { color: tc.text }]}>{item.siteName}</Text>
              <View style={styles.surveyFoot}>
                <Ionicons name="calendar-outline" size={11} color={tc.muted} />
                <Text style={[styles.surveyDate, { color: tc.muted }]}>{item.date}</Text>
              </View>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: Spacing['2xl'] },

  hero: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    marginBottom: Spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  heroGreeting: { color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  heroName: { color: '#FFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginTop: 2 },
  heroMeta: { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: '500', marginTop: 4 },
  heroEmblem: {
    width: 58, height: 58, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatNum: { color: '#FFF', fontSize: 24, fontWeight: '800', letterSpacing: -1 },
  heroStatLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600', marginTop: 2, letterSpacing: 0.5 },
  heroStatDivider: { width: 1, marginVertical: 4 },

  sectionTitle: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    marginBottom: Spacing.md, paddingHorizontal: Spacing.lg,
  },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  gridItem: {
    width: '48%',
    borderRadius: Radius.lg, borderWidth: 1,
    padding: Spacing.lg, alignItems: 'center',
    marginBottom: Spacing.md,
  },
  gridIconWrap: {
    width: 50, height: 50, borderRadius: Radius.md,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm,
  },
  gridLabel: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },

  recentHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingRight: Spacing.lg, marginBottom: Spacing.md,
  },
  viewAll: { fontWeight: '700', fontSize: 13, letterSpacing: -0.2 },

  surveyCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg, borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  striker: { width: 4 },
  surveyBody: { flex: 1, padding: Spacing.md },
  surveyTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  surveyId: { fontSize: 12, fontWeight: '700', marginRight: Spacing.sm },
  surveyPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  surveyPillText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  surveySite: { fontSize: 15, fontWeight: '700', letterSpacing: -0.3, marginBottom: 6 },
  surveyFoot: { flexDirection: 'row', alignItems: 'center' },
  surveyDate: { fontSize: 11, marginLeft: 4, fontWeight: '500' },

  emptyCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg, borderWidth: 1,
    padding: Spacing.xl, alignItems: 'center',
  },
  emptyIconBox: {
    width: 58, height: 58, borderRadius: Radius.lg,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3, marginBottom: 4 },
  emptySub: { fontSize: 13, textAlign: 'center' },
});
