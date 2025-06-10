// app/(tabs)/history.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData, type MoodEntry } from '@/contexts/DataContext';
import { Calendar, Trash2, Edit3, Heart } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  FadeInDown,
} from 'react-native-reanimated';

export default function History() {
  const { colors } = useTheme();
  const { entries, deleteEntry } = useData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleDeleteEntry = (entry: MoodEntry) => {
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete your journal entry from ${formatDate(entry.date)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEntry(entry.id),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (entries.length === 0) {
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

        <View style={styles.emptyState}>
          <Text style={[styles.emptyEmoji]}>📝</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Entries Yet
          </Text>
          <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
            Start your emotional wellness journey by checking in with your feelings and writing your first journal entry.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Calendar size={32} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Your Emotion History
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {entries.length} entr{entries.length === 1 ? 'y' : 'ies'} • Keep up the great work!
        </Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {entries.map((entry, index) => (
          <HistoryCard
            key={entry.id}
            entry={entry}
            colors={colors}
            onDelete={() => handleDeleteEntry(entry)}
            formatDate={formatDate}
            getTimeAgo={getTimeAgo}
            index={index}
          />
        ))}
        
        <View style={styles.bottomMessage}>
          <Heart size={20} color={colors.primary} />
          <Text style={[styles.bottomText, { color: colors.textSecondary }]}>
            Great job tracking your emotions! Self-awareness is the first step to emotional wellness.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function HistoryCard({ 
  entry, 
  colors, 
  onDelete, 
  formatDate, 
  getTimeAgo,
  index 
}: {
  entry: MoodEntry;
  colors: any;
  onDelete: () => void;
  formatDate: (date: string) => string;
  getTimeAgo: (timestamp: number) => string;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const rotateValue = useSharedValue(0);
  const heightValue = useSharedValue(0);
  const opacityValue = useSharedValue(0);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value}deg` }],
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      height: heightValue.value,
      opacity: opacityValue.value,
    };
  });

  const toggleExpanded = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    rotateValue.value = withSpring(newExpanded ? 180 : 0);
    heightValue.value = withTiming(newExpanded ? 'auto' : 0);
    opacityValue.value = withTiming(newExpanded ? 1 : 0);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      style={[styles.historyCard, { 
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        borderLeftColor: entry.mood.color,
      }]}
    >
      <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={styles.moodInfo}>
            <Text style={styles.moodEmoji}>{entry.mood.emoji}</Text>
            <View style={styles.cardContent}>
              <Text style={[styles.moodLabel, { color: colors.text }]}>
                {entry.mood.label}
              </Text>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {formatDate(entry.date)}
              </Text>
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                {getTimeAgo(entry.timestamp)}
              </Text>
            </View>
          </View>
          
          {entry.journalEntry && (
            <Animated.View style={[animatedIconStyle]}>
              <Text style={[styles.expandIcon, { color: colors.textSecondary }]}>
                ▼
              </Text>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>

      {entry.journalEntry && (
        <Animated.View style={[styles.journalSection, animatedContentStyle]}>
          <View style={[styles.journalDivider, { backgroundColor: colors.border }]} />
          <Text style={[styles.journalLabel, { color: colors.textSecondary }]}>
            📖 Journal Entry
          </Text>
          <Text style={[styles.journalText, { color: colors.text }]}>
            "{entry.journalEntry}"
          </Text>
          
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error + '15' }]}
              onPress={onDelete}
              activeOpacity={0.7}
            >
              <Trash2 size={16} color={colors.error} />
              <Text style={[styles.actionButtonText, { color: colors.error }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </Animated.View>
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
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  moodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  expandIcon: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  journalSection: {
    overflow: 'hidden',
  },
  journalDivider: {
    height: 1,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  journalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  journalText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
    lineHeight: 24,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  bottomText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});