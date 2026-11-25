// Shown while we wait for GPS and work out the town.
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { t } from '../i18n';
import { colors, fontSize, spacing } from '../theme';

export default function LocatingScreen() {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.title}>{t('locating.title')}</Text>
      <Text style={styles.body}>{t('locating.body')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center' },
  body: { fontSize: fontSize.body, color: colors.muted, textAlign: 'center' },
});
