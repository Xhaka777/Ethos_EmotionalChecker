// app/journal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Save } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const MOODS = [
  { id: '1', emoji: '😊', label: 'Happy', color: '#10B981' },
  { id: '2', emoji: '😌', label: 'Calm', color: '#3B82F6' },
  { id: '3', emoji: '😴', label: 'Tired', color: '#6366F1' },
  { id: '4', emoji: '😤', label: 'Stressed', color: '#F59E0B' },
  { id: '5', emoji: '😢', label: 'Sad', color: '#EF4444' },
  { id: '6', emoji: '😡', label: 'Angry', color: '#DC2626' },
  { id: '7', emoji: '🤔', label: 'Confused', color: '#8B5CF6' },
  { id: '8', emoji: '😍', label: 'Excited', color: '#F97316' },
];

export default function Journal() {
  const router = useRouter();
  const { moodId, moodLabel } = useLocalSearchParams();
  const { colors } = useTheme();
  const { addEntry, updateEntry, getTodaysEntry } = useData();
  const [journalText, setJournalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const saveButtonScale = useSharedValue(1);
  
  const animatedSaveStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: saveButtonScale.value }],
    };
  });

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    saveButtonScale.value = withSpring(0.95, { damping: 15, stiffness: 300 }, () => {
      saveButtonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });
    
    if (journalText.trim()) {
      try {
        const selectedMood = MOODS.find(mood => mood.id === moodId);
        if (!selectedMood) {
          Alert.alert('Error', 'Invalid mood selection.');
          setIsSaving(false);
          return;
        }

        const today = new Date().toISOString().split('T')[0];
        const existingEntry = getTodaysEntry();

        if (existingEntry) {
          // Update existing entry
          updateEntry(existingEntry.id, {
            journalEntry: journalText.trim(),
            mood: selectedMood,
          });
        } else {
          // Create new entry
          addEntry({
            date: today,
            mood: selectedMood,
            journalEntry: journalText.trim(),
          });
        }

        Alert.alert(
          '✨ Entry Saved!',
          'Your journal entry has been saved successfully. Keep reflecting on your emotions!',
          [
            {
              text: 'Continue Writing',
              style: 'cancel',
            },
            {
              text: 'View History',
              onPress: () => {
                router.push('/(tabs)/history');
              },
            },
            {
              text: 'Done',
              onPress: () => router.back(),
            },
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to save your entry. Please try again.');
      }
    } else {
      Alert.alert(
        'Empty Entry', 
        'Please write something about your feelings before saving.',
        [{ text: 'OK' }]
      );
    }
    
    setIsSaving(false);
  };

  const getWordCount = () => {
    return journalText.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Journal Entry
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Feeling {moodLabel}
            </Text>
          </View>
          
          <Animated.View style={animatedSaveStyle}>
            <TouchableOpacity
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: isSaving ? colors.textSecondary : colors.primary,
                  opacity: isSaving ? 0.7 : 1,
                }
              ]}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={isSaving}
            >
              <Save size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Journal Input */}
        <View style={styles.content}>
          <View style={[styles.promptCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.promptTitle, { color: colors.text }]}>
              ✍️ Express Yourself
            </Text>
            <Text style={[styles.promptText, { color: colors.textSecondary }]}>
              What's on your mind? 
            </Text>
          </View>
          
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            multiline
            placeholder="Today I'm feeling..."
            placeholderTextColor={colors.textSecondary}
            value={journalText}
            onChangeText={setJournalText}
            textAlignVertical="top"
            autoFocus
          />
          
          <View style={styles.statsRow}>
            <Text style={[styles.statsText, { color: colors.textSecondary }]}>
              {journalText.length} characters • {getWordCount()} words
            </Text>
            <Text style={[styles.statsText, { color: colors.textSecondary }]}>
              📝 Keep writing to unlock insights
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  promptCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  promptTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  promptText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});