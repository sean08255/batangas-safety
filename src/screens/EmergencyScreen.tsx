// Emergency info for the current town. All data is stored in the app, so it works offline.
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ContactCard from '../components/ContactCard';
import Disclaimer from '../components/Disclaimer';
import ScreenHeader from '../components/ScreenHeader';
import { getTownEmergency } from '../data/emergency';
import { EMBASSIES, NATIONAL } from '../data/national';
import { Town } from '../data/towns';
import { Contact } from '../data/types';
import { t } from '../i18n';
import { colors, fontSize, radius, spacing, touchTarget } from '../theme';

type Props = { town: Town; onBack: () => void };

// A titled group of contact cards.
function Section({ title, contacts }: { title: string; contacts: Contact[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </View>
  );
}

export default function EmergencyScreen({ town, onBack }: Props) {
  // null for towns we have not filled in yet
  const data = getTownEmergency(town.id);

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title={`${t('emergency.title')} · ${town.name}`} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* The one big button: call 911 */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('emergency.call911')}
          onPress={() => Linking.openURL('tel:911').catch(() => {})}
          style={({ pressed }) => [styles.sos, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="call" size={32} color="#FFFFFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.sosTitle}>{t('emergency.call911')}</Text>
            <Text style={styles.sosHint}>{t('emergency.call911Hint')}</Text>
          </View>
        </Pressable>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>{t('emergency.draftNote')}</Text>
          <Text style={styles.noticeText}>{t('emergency.offlineNote')}</Text>
        </View>

        {data ? (
          <>
            <Section title={t('emergency.hospitals')} contacts={data.hospitals} />
            <Section title={t('emergency.police')} contacts={data.police} />
            <Section title={t('emergency.fire')} contacts={data.fire} />
            <Section title={t('emergency.mdrrmo')} contacts={data.mdrrmo} />
          </>
        ) : (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>{t('emergency.townNotReady', { town: town.name })}</Text>
          </View>
        )}

        <Section title={t('emergency.national')} contacts={NATIONAL} />
        <Section title={t('emergency.embassies')} contacts={EMBASSIES} />
        <Text style={styles.embassyNote}>{t('emergency.embassyNote')}</Text>

        <Disclaimer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.md },
  sos: {
    minHeight: 84,
    backgroundColor: '#B91C1C', // strong red, white text passes contrast
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sosTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  sosHint: { color: '#FFFFFF', fontSize: fontSize.small },
  notice: { backgroundColor: colors.noticeBg, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs },
  noticeText: { color: colors.noticeText, fontSize: fontSize.small, lineHeight: 20 },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginTop: spacing.sm, minHeight: touchTarget / 2 },
  embassyNote: { fontSize: fontSize.small, color: colors.muted },
});
