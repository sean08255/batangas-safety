// Settings: shows the current town and lets the user change it.
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Disclaimer from '../components/Disclaimer';
import ScreenHeader from '../components/ScreenHeader';
import { Town } from '../data/towns';
import { t } from '../i18n';
import { colors, fontSize, radius, spacing } from '../theme';

type Props = {
  town: Town;
  onBack: () => void;
  onChangeTown: () => void; // open the manual picker
  onUseGps: () => void; // run GPS detection again
};

export default function SettingsScreen({ town, onBack, onChangeTown, onUseGps }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title={t('settings.title')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>{t('settings.currentTown')}</Text>
          <Text style={styles.value}>{town.name}</Text>
        </View>

        <AppButton label={t('settings.changeTown')} onPress={onChangeTown} />
        <AppButton label={t('settings.useGps')} onPress={onUseGps} variant="secondary" />

        <View style={styles.card}>
          <Text style={styles.label}>{t('settings.about')}</Text>
          <Text style={styles.body}>{t('settings.aboutText')}</Text>
          <Text style={styles.body}>{t('settings.dataNote')}</Text>
        </View>

        <Disclaimer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  label: { fontSize: fontSize.small, fontWeight: '700', color: colors.muted },
  value: { fontSize: 24, fontWeight: '700', color: colors.text },
  body: { fontSize: fontSize.body, lineHeight: 22, color: colors.text },
});
