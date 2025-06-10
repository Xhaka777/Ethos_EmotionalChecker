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
import { ArrowLeft, Save } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function Journal() {
  const router = useRouter();
  const { moodId, moodLabel } = useLocalSearchParams();
  const { colors } = useTheme();
  const [journalText, setJournalText] = useState('');
  
  const saveButtonScale = useSharedValue(1);
  
  const animatedSaveStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: saveButtonScale.value }],
    };
  });

  const handleSave = () => {
    saveButtonScale.value = withSpring(0.95, { damping: 15, stiffness: 300 }, () => {
      saveButtonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });
    
    if (journalText.trim()) {
      // Here you would save to your data store
      Alert.alert(
        'Entry Saved',
        'Your journal entry has been saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert('Empty Entry', 'Please write something before saving.');
    }
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
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Save size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Journal Input */}
        <View style={styles.content}>
          <Text style={[styles.promptText, { color: colors.textSecondary }]}>
            What's on your mind? Take a moment to reflect on your feelings...
          </Text>
          
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
            placeholder="Start writing..."
            placeholderTextColor={colors.textSecondary}
            value={journalText}
            onChangeText={setJournalText}
            textAlignVertical="top"
            autoFocus
          />
          
          <Text style={[styles.wordCount, { color: colors.textSecondary }]}>
            {journalText.length} characters
          </Text>
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
  promptText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 20,
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
  wordCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
    marginBottom: 24,
  },
});