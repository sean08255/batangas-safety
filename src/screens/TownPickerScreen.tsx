// Manual town list. Used when permission is denied, GPS fails,
// the place is not covered, or the user simply prefers to choose.
import React, { useMemo, useState } from 'react';
import { FlatList, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../components/AppButton';
import { TOWNS, Town } from '../data/towns';
import { t } from '../i18n';
import { colors, fontSize, radius, spacing, touchTarget } from '../theme';

// Why are we showing the picker? Decides the message at the top.
export type PickerReason =
  | { type: 'denied' }
  | { type: 'unavailable' }
  | { type: 'notCovered'; place: string }
  | { type: 'outside' }
  | { type: 'manual' };

type Props = {
  reason: PickerReason;
  onPick: (town: Town) => void;
};

export default function TownPickerScreen({ reason, onPick }: Props) {
  const [query, setQuery] = useState('');

  // Filter the list as the user types
  const towns = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOWNS.filter((town) => town.name.toLowerCase().includes(q));
  }, [query]);

  // Pick the right message for the reason
  let heading: string | null = null;
  let message = '';
  if (reason.type === 'denied') message = t('picker.reasonDenied');
  else if (reason.type === 'unavailable') message = t('picker.reasonUnavailable');
  else if (reason.type === 'notCovered') {
    heading = t('picker.reasonNotCoveredTitle');
    message = t('picker.reasonNotCovered', { place: reason.place });
  } else if (reason.type === 'outside') {
    heading = t('picker.reasonNotCoveredTitle');
    message = t('picker.reasonOutside');
  } else message = t('picker.reasonManual');

  const header = (
    <View style={styles.header}>
      <Text style={styles.title} accessibilityRole="header">
        {t('picker.title')}
      </Text>
      {heading && <Text style={styles.heading}>{heading}</Text>}
      <Text style={styles.message}>{message}</Text>
      {reason.type === 'denied' && (
        <AppButton
          label={t('picker.openSettings')}
          onPress={() => Linking.openSettings()}
          variant="secondary"
        />
      )}
      <TextInput
        style={styles.search}
        placeholder={t('picker.search')}
        placeholderTextColor={colors.muted}
        accessibilityLabel={t('picker.search')}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />
    </View>
  );

  return (
    <FlatList
      data={towns}
      keyExtractor={(town) => town.id}
      ListHeaderComponent={header}
      ListEmptyComponent={<Text style={styles.empty}>{t('picker.noResults')}</Text>}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.name}
          onPress={() => onPick(item)}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        >
          <Text style={styles.rowName}>{item.name}</Text>
          <View style={[styles.tag, item.covered ? styles.tagCovered : styles.tagSoon]}>
            <Text style={[styles.tagText, item.covered ? styles.tagCoveredText : styles.tagSoonText]}>
              {item.covered ? t('picker.covered') : t('picker.comingSoon')}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.sm },
  header: { gap: spacing.sm, marginBottom: spacing.sm },
  title: { fontSize: fontSize.title, fontWeight: '700', color: colors.text },
  heading: { fontSize: 20, fontWeight: '700', color: colors.noticeText },
  message: { fontSize: fontSize.body, lineHeight: 22, color: colors.muted },
  search: {
    minHeight: touchTarget,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.body,
    color: colors.text,
  },
  row: {
    minHeight: touchTarget + 8,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowPressed: { opacity: 0.7 },
  rowName: { fontSize: 17, color: colors.text, fontWeight: '500', flexShrink: 1 },
  tag: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  tagCovered: { backgroundColor: colors.coveredBg },
  tagSoon: { backgroundColor: colors.soonBg },
  tagText: { fontSize: 12, fontWeight: '600' },
  tagCoveredText: { color: colors.coveredText },
  tagSoonText: { color: colors.soonText },
  empty: { fontSize: fontSize.body, color: colors.muted, textAlign: 'center', marginTop: spacing.lg },
});
