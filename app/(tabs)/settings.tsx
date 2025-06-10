import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Settings as SettingsIcon, Moon, Sun, Smartphone, Bell, Shield, CircleHelp as HelpCircle, MessageCircle } from 'lucide-react-native';

export default function Settings() {
  const { theme, setTheme, colors, actualTheme } = useTheme();

  const themeOptions = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Smartphone },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <SettingsIcon size={32} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Customize your wellness experience
        </Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Theme
            </Text>
            
            <View style={styles.themeOptions}>
              {themeOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = theme === option.key;
                
                return (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.themeOption,
                      { 
                        backgroundColor: isSelected ? colors.primary + '15' : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => setTheme(option.key as any)}
                    activeOpacity={0.7}
                  >
                    <IconComponent 
                      size={20} 
                      color={isSelected ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.themeOptionText,
                      { 
                        color: isSelected ? colors.primary : colors.text,
                        fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular'
                      }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        {/* <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notifications
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <SettingItem
              icon={Bell}
              title="Daily Reminders"
              description="Get reminded to check in with your emotions"
              colors={colors}
              hasSwitch={true}
              switchValue={true}
            />
          </View>
        </View> */}

        {/* Privacy Section */}
        {/* <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Privacy & Support
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <SettingItem
              icon={Shield}
              title="Privacy Policy"
              description="Learn how we protect your data"
              colors={colors}
            />
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
              description="Get help and contact support"
              colors={colors}
            />
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
            <SettingItem
              icon={MessageCircle}
              title="Send Feedback"
              description="Help us improve the app"
              colors={colors}
            />
          </View>
        </View> */}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Made with ❤️ for your wellbeing
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingItem({ 
  icon: IconComponent, 
  title, 
  description, 
  colors, 
  hasSwitch = false, 
  switchValue = false 
}: {
  icon: any;
  title: string;
  description: string;
  colors: any;
  hasSwitch?: boolean;
  switchValue?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
      <IconComponent size={24} color={colors.primary} />
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      {hasSwitch && (
        <Switch
          value={switchValue}
          trackColor={{ false: colors.border, true: colors.primary + '40' }}
          thumbColor={switchValue ? colors.primary : colors.textSecondary}
        />
      )}
    </TouchableOpacity>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  themeOptions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  themeOptionText: {
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  separator: {
    height: 1,
    marginHorizontal: 20,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
});