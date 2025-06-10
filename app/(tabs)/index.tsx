import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');

type Mood = {
  id: string;
  emoji: string;
  label: string;
  color: string;
  description: string;
};

const moods: Mood[] = [
  { id: '1', emoji: '😊', label: 'Happy', color: '#10B981', description: 'Feeling great and positive!' },
  { id: '2', emoji: '😌', label: 'Calm', color: '#3B82F6', description: 'Peaceful and relaxed state of mind.' },
  { id: '3', emoji: '😴', label: 'Tired', color: '#6366F1', description: 'Need some rest and recovery.' },
  { id: '4', emoji: '😤', label: 'Stressed', color: '#F59E0B', description: 'Feeling overwhelmed or pressured.' },
  { id: '5', emoji: '😢', label: 'Sad', color: '#EF4444', description: 'Going through a difficult time.' },
  { id: '6', emoji: '😡', label: 'Angry', color: '#DC2626', description: 'Frustrated or upset about something.' },
  { id: '7', emoji: '🤔', label: 'Confused', color: '#8B5CF6', description: 'Uncertain or puzzled about things.' },
  { id: '8', emoji: '😍', label: 'Excited', color: '#F97316', description: 'Enthusiastic and energetic!' },
];

export default function EmotionCheckIn() {
  const { colors, actualTheme } = useTheme();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const cardScale = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  const triggerFeedback = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    triggerFeedback();
    
    // Animate the card in
    cardScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    cardOpacity.value = withTiming(1, { duration: 300 });
    cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 150 });
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: cardScale.value },
        { translateY: cardTranslateY.value },
      ],
      opacity: cardOpacity.value,
    };
  });

  const handleJournalPress = () => {
    if (selectedMood) {
      router.push({
        pathname: '/journal',
        params: { moodId: selectedMood.id, moodLabel: selectedMood.label },
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={actualTheme === 'dark' 
          ? ['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.05)', 'transparent']
          : ['rgba(59, 130, 246, 0.05)', 'rgba(139, 92, 246, 0.03)', 'transparent']
        }
        style={styles.gradientOverlay}
      />
      
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {new Date().getHours() < 12 ? 'Good morning' : 
             new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            How are you feeling today?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Take a moment to check in with yourself
          </Text>
        </View>

        {/* Mood Picker */}
        <View style={styles.moodGrid}>
          {moods.map((mood, index) => (
            <MoodButton
              key={mood.id}
              mood={mood}
              isSelected={selectedMood?.id === mood.id}
              onPress={() => handleMoodSelect(mood)}
              colors={colors}
              index={index}
            />
          ))}
        </View>

        {/* Selected Mood Card */}
        {selectedMood && (
          <Animated.View style={[animatedCardStyle, styles.selectedCardWrapper]}>
            <View style={[styles.selectedCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardEmoji]}>{selectedMood.emoji}</Text>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Feeling {selectedMood.label}
                  </Text>
                  <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                    {selectedMood.description}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[styles.journalButton, { backgroundColor: colors.primary }]}
                onPress={handleJournalPress}
                activeOpacity={0.8}
              >
                <Text style={styles.journalButtonText}>
                  Write about it
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MoodButton({ mood, isSelected, onPress, colors, index }: {
  mood: Mood;
  isSelected: boolean;
  onPress: () => void;
  colors: any;
  index: number;
}) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });
    
    rotate.value = withSpring(5, { damping: 15, stiffness: 300 }, () => {
      rotate.value = withSpring(-5, { damping: 15, stiffness: 300 }, () => {
        rotate.value = withSpring(0, { damping: 15, stiffness: 300 });
      });
    });
    
    runOnJS(onPress)();
  };

  return (
    <Animated.View style={[animatedStyle, styles.moodButtonWrapper]}>
      <TouchableOpacity
        style={[
          styles.moodButton,
          { 
            backgroundColor: colors.surface,
            borderColor: isSelected ? mood.color : colors.border,
            borderWidth: isSelected ? 2 : 1,
            shadowColor: colors.shadow,
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.moodEmoji}>{mood.emoji}</Text>
        <Text style={[styles.moodLabel, { 
          color: isSelected ? mood.color : colors.text,
          fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Medium'
        }]}>
          {mood.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  moodButtonWrapper: {
    width: (screenWidth - 72) / 2,
    marginBottom: 16,
  },
  moodButton: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedCardWrapper: {
    marginBottom: 24,
  },
  selectedCard: {
    padding: 24,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  journalButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  journalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  bottomSpacing: {
    height: 40,
  },
});