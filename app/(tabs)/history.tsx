import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar } from 'lucide-react-native';

const mockHistoryData = [
  { date: '2024-01-15', mood: '😊', label: 'Happy', note: 'Had a great day at work!' },
  { date: '2024-01-14', mood: '😌', label: 'Calm', note: 'Enjoyed a peaceful evening' },
  { date: '2024-01-13', mood: '😤', label: 'Stressed', note: 'Busy day with deadlines' },
  { date: '2024-01-12', mood: '😍', label: 'Excited', note: 'Planning weekend trip' },
  { date: '2024-01-11', mood: '😊', label: 'Happy', note: 'Spent time with friends' },
];

export default function History() {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Calendar size={32} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Your Emotion History
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Track your emotional journey over time
        </Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mockHistoryData.map((entry, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.historyCard, { 
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
            }]}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.moodEmoji}>{entry.mood}</Text>
              <View style={styles.cardContent}>
                <Text style={[styles.moodLabel, { color: colors.text }]}>
                  {entry.label}
                </Text>
                <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                  {formatDate(entry.date)}
                </Text>
              </View>
            </View>
            {entry.note && (
              <Text style={[styles.noteText, { color: colors.textSecondary }]}>
                "{entry.note}"
              </Text>
            )}
          </TouchableOpacity>
        ))}
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
  historyCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 28,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  moodLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  noteText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
    lineHeight: 24,
    marginTop: 8,
  },
});