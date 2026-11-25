// Home screen: "Welcome to [Town]" plus quick buttons.
// (This replaces TownResultScreen from Milestone 1.)
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AlertBanner from '../components/AlertBanner';
import Disclaimer from '../components/Disclaimer';
import { Town } from '../data/towns';
import { t } from '../i18n';
import { colors, fontSize, radius, spacing, touchTarget } from '../theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  town: Town;
  source: 'gps' | 'manual';
  onOpenEmergency: () => void;
  onOpenSettings: () => void;
};

// One big quick-access tile. `disabled` tiles are placeholders for later milestones.
function Tile(props: { icon: IconName; label: string; onPress?: () => void; disabled?: boolean }) {
  const { icon, label, onPress, disabled } = props;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={disabled ? `${label}, ${t('home.comingSoon')}` : label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, disabled ? styles.tileOff : styles.tileOn, pressed && { opacity: 0.8 }]}
    >
      <Ionicons name={icon} size={34} color={disabled ? colors.muted : colors.primaryText} />
      <Text style={[styles.tileLabel, disabled && { color: colors.muted }]}>{label}</Text>
      {disabled ? <Text style={styles.soon}>{t('home.comingSoon')}</Text> : null}
    </Pressable>
  );
}

export default function HomeScreen({ town, source, onOpenEmergency, onOpenSettings }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} accessibilityRole="header">
            {t('result.welcomeTo', { town: town.name })}
          </Text>
          <Text style={styles.sub}>{source === 'gps' ? t('result.detected') : t('result.chosen')}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.settings')}
          onPress={onOpenSettings}
          style={({ pressed }) => [styles.gear, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="settings-outline" size={28} color={colors.primary} />
        </Pressable>
      </View>

      {/* Honest note about whether this town has detailed info yet */}
      <View style={[styles.note, town.covered ? styles.noteCovered : styles.noteSoon]}>
        <Text style={[styles.noteText, { color: town.covered ? colors.coveredText : colors.noticeText }]}>
          {town.covered ? t('result.coveredNote') : t('result.notCoveredNote')}
        </Text>
      </View>

      {/* Safety alerts come first: they matter most */}
      <AlertBanner />

      <Text style={styles.section}>{t('home.quick')}</Text>
      <View style={styles.tiles}>
        <Tile icon="medkit" label={t('home.emergency')} onPress={onOpenEmergency} />
        <Tile icon="cloud-outline" label={t('home.weather')} disabled />
        <Tile icon="book-outline" label={t('home.guide')} disabled />
      </View>

      <Disclaimer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  title: { fontSize: fontSize.hero, fontWeight: '700', color: colors.text },
  sub: { fontSize: fontSize.body, color: colors.muted, marginTop: spacing.xs },
  gear: { width: touchTarget, height: touchTarget, alignItems: 'center', justifyContent: 'center' },
  note: { borderRadius: radius.md, padding: spacing.md },
  noteCovered: { backgroundColor: colors.coveredBg },
  noteSoon: { backgroundColor: colors.noticeBg },
  noteText: { fontSize: fontSize.small, lineHeight: 20 },
  section: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  tiles: { gap: spacing.sm },
  tile: {
    minHeight: 84,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tileOn: { backgroundColor: colors.primary },
  tileOff: { backgroundColor: colors.soonBg },
  tileLabel: { fontSize: 20, fontWeight: '700', color: colors.primaryText, flex: 1 },
  soon: { fontSize: 12, fontWeight: '600', color: colors.muted },
});
