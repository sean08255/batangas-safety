// One emergency contact: name, status badge, address, and Call / Map buttons.
import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contact } from '../data/types';
import { t } from '../i18n';
import { colors, fontSize, radius, spacing, touchTarget } from '../theme';

export default function ContactCard({ contact }: { contact: Contact }) {
  // tel: opens the phone dialer. It works with no internet.
  const call = () => {
    if (!contact.phone) return;
    Linking.openURL(`tel:${contact.phone.replace(/\s/g, '')}`).catch(() => {});
  };

  // Opens Google Maps (or the maps app). This one needs internet.
  const openMap = () => {
    if (!contact.mapQuery) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{contact.name}</Text>

      {/* Unverified entries are clearly marked. Verified ones show the check date. */}
      {contact.verified ? (
        <View style={[styles.badge, styles.badgeOk]}>
          <Ionicons name="checkmark-circle" size={16} color={colors.coveredText} />
          <Text style={[styles.badgeText, { color: colors.coveredText }]}>
            {t('emergency.verifiedOn', { date: contact.lastVerified ?? '' })}
          </Text>
        </View>
      ) : (
        <View style={[styles.badge, styles.badgeWarn]}>
          <Ionicons name="warning" size={16} color={colors.noticeText} />
          <Text style={[styles.badgeText, { color: colors.noticeText }]}>
            {t('emergency.unverified')}
          </Text>
        </View>
      )}

      <Text style={styles.detail}>{contact.address ?? t('emergency.noAddress')}</Text>
      {contact.note ? <Text style={styles.detail}>{contact.note}</Text> : null}
      <Text style={styles.source}>{t('emergency.source', { source: contact.source })}</Text>

      <View style={styles.buttons}>
        {contact.phone ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t('emergency.call')} ${contact.name} ${contact.phone}`}
            onPress={call}
            style={({ pressed }) => [styles.button, styles.callButton, pressed && styles.pressed]}
          >
            <Ionicons name="call" size={20} color={colors.primaryText} />
            <Text style={styles.callText}>{contact.phone}</Text>
          </Pressable>
        ) : (
          <Text style={styles.noPhone}>{t('emergency.noPhone')}</Text>
        )}

        {contact.mapQuery ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t('emergency.map')} ${contact.name}`}
            onPress={openMap}
            style={({ pressed }) => [styles.button, styles.mapButton, pressed && styles.pressed]}
          >
            <Ionicons name="map-outline" size={20} color={colors.primary} />
            <Text style={styles.mapText}>{t('emergency.map')}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeWarn: { backgroundColor: colors.noticeBg },
  badgeOk: { backgroundColor: colors.coveredBg },
  badgeText: { fontSize: 13, fontWeight: '700' },
  detail: { fontSize: fontSize.small, lineHeight: 20, color: colors.muted },
  source: { fontSize: 12, lineHeight: 17, color: colors.muted },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  button: {
    minHeight: touchTarget,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callButton: { backgroundColor: colors.primary, flexGrow: 1 },
  mapButton: { borderWidth: 1.5, borderColor: colors.primary },
  pressed: { opacity: 0.75 },
  callText: { color: colors.primaryText, fontSize: fontSize.body, fontWeight: '600' },
  mapText: { color: colors.primary, fontSize: fontSize.body, fontWeight: '600' },
  noPhone: { fontSize: fontSize.small, color: colors.muted, fontStyle: 'italic', flexGrow: 1 },
});
