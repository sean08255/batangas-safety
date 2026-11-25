// First screen: explains WHY we need location, then asks for it.
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import Disclaimer from '../components/Disclaimer';
import { t } from '../i18n';
import { colors, fontSize, spacing } from '../theme';

type Props = {
  onContinue: () => void; // user agrees -> ask for location permission
  onChooseManually: () => void; // user skips GPS -> go to town picker
};

export default function WelcomeScreen({ onContinue, onChooseManually }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="location" size={44} color={colors.primary} />
      </View>

      <Text style={styles.title} accessibilityRole="header">
        {t('welcome.title')}
      </Text>
      <Text style={styles.body}>{t('welcome.why')}</Text>
      <Text style={styles.privacy}>{t('welcome.privacy')}</Text>

      <View style={styles.buttons}>
        <AppButton label={t('welcome.button')} onPress={onContinue} />
        <AppButton label={t('welcome.manual')} onPress={onChooseManually} variant="secondary" />
      </View>

      <Disclaimer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md, flexGrow: 1, justifyContent: 'center' },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#DCEBF8',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontSize: fontSize.title, fontWeight: '700', color: colors.text, textAlign: 'center' },
  body: { fontSize: 18, lineHeight: 26, color: colors.text, textAlign: 'center' },
  privacy: { fontSize: fontSize.small, lineHeight: 20, color: colors.muted, textAlign: 'center' },
  buttons: { gap: spacing.sm, marginVertical: spacing.md },
});
