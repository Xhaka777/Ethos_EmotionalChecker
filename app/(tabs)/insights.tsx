import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ChartBar as BarChart3, TrendingUp, Heart } from 'lucide-react-native';

const mockInsights = [
  { label: 'Happy', percentage: 35, color: '#10B981' },
  { label: 'Calm', percentage: 25, color: '#3B82F6' },
  { label: 'Excited', percentage: 20, color: '#F97316' },
  { label: 'Stressed', percentage: 15, color: '#F59E0B' },
  { label: 'Other', percentage: 5, color: '#6B7280' },
];

export default function Insights() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <BarChart3 size={32} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Your Insights
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Understanding your emotional patterns
        </Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Mood Distribution */}
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Mood Distribution
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            Last 30 days
          </Text>
          
          <View style={styles.chartContainer}>
            {mockInsights.map((insight, index) => (
              <View key={index} style={styles.chartRow}>
                <View style={styles.chartLabel}>
                  <View style={[styles.colorDot, { backgroundColor: insight.color }]} />
                  <Text style={[styles.labelText, { color: colors.text }]}>
                    {insight.label}
                  </Text>
                </View>
                <View style={styles.chartBar}>
                  <View 
                    style={[
                      styles.chartFill,
                      { 
                        backgroundColor: insight.color,
                        width: `${insight.percentage}%`,
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.percentageText, { color: colors.textSecondary }]}>
                  {insight.percentage}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <TrendingUp size={24} color={colors.success} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              7
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Day Streak
            </Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Heart size={24} color={colors.error} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              23
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Check-ins
            </Text>
          </View>
        </View>

        {/* Wellness Tip */}
        <View style={[styles.tipCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}>
          <Text style={[styles.tipTitle, { color: colors.primary }]}>
            💡 Wellness Tip
          </Text>
          <Text style={[styles.tipText, { color: colors.text }]}>
            You've been feeling happy most often this month! Keep doing what makes you feel good and remember to practice gratitude daily.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
  },
  chartContainer: {
    marginTop: 8,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  chartBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  chartFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    width: 40,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  tipCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  tipTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
});