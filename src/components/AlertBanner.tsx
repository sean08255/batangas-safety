// Safety alerts: Taal volcano, rain warnings, typhoons.
// Every card shows its source, an official link and a "last updated" time.
// If anything cannot be checked, we say so and point to the official pages. No stale data.
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alerts, OFFICIAL_LINKS, fetchAlerts, formatTime, isFresh } from '../data/alerts';
import { t } from '../i18n';
import { colors, fontSize, radius, spacing, statusColors, taalColors, touchTarget } from '../theme';

type Palette = { bg: string; border: string; text: string };

// A link button that opens an official page in the browser.
function LinkButton({ label, url, color }: { label: string; url: string; color: string }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={() => Linking.openURL(url).catch(() => {})}
      style={({ pressed }) => [styles.link, { borderColor: color }, pressed && { opacity: 0.7 }]}
    >
      <Ionicons name="open-outline" size={18} color={color} />
      <Text style={[styles.linkText, { color }]}>{label}</Text>
    </Pressable>
  );
}

// One alert card. `checkedAt` is shown as "last updated".
function Card(props: {
  palette: Palette;
  title: string;
  headline: string;
  body?: string;
  extra?: string;
  source: string;
  url: string;
  checkedAt: string | null;
}) {
  const { palette: p, title, headline, body, extra, source, url, checkedAt } = props;
  return (
    <View style={[styles.card, { backgroundColor: p.bg, borderColor: p.border }]}>
      <Text style={[styles.cardTitle, { color: p.text }]} accessibilityRole="header">
        {title}
      </Text>
      <Text style={[styles.headline, { color: p.text }]}>{headline}</Text>
      {body ? <Text style={[styles.body, { color: p.text }]}>{body}</Text> : null}
      {extra ? <Text style={[styles.meta, { color: p.text }]}>{extra}</Text> : null}
      <Text style={[styles.meta, { color: p.text }]}>{t('alerts.source', { source })}</Text>
      {checkedAt ? (
        <Text style={[styles.meta, { color: p.text }]}>
          {t('alerts.updated', { time: formatTime(checkedAt) })}
        </Text>
      ) : null}
      <LinkButton label={t('alerts.openOfficial')} url={url} color={p.text} />
    </View>
  );
}

// Shown for a single section we cannot trust right now.
function unavailableCard(title: string, source: string, url: string) {
  return (
    <Card
      key={title}
      palette={statusColors.unknown}
      title={title}
      headline={t('alerts.unavailableShort')}
      source={source}
      url={url}
      checkedAt={null}
    />
  );
}

export default function AlertBanner() {
  const [alerts, setAlerts] = useState<Alerts | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0); // bump to check again

  // Runs on first show and every time the user taps "Check again".
  useEffect(() => {
    let cancelled = false;
    fetchAlerts()
      .then((data) => !cancelled && setAlerts(data))
      .catch(() => !cancelled && setAlerts(null)) // never keep old data after a failure
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const load = () => {
    setLoading(true);
    setAttempt((n) => n + 1);
  };

  let content: React.ReactNode;

  if (loading) {
    content = (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>{t('alerts.loading')}</Text>
      </View>
    );
  } else if (!alerts || !isFresh(alerts.fetchedAt)) {
    // Could not load, or the backend's own data is old: do not show any alert as current.
    const p = statusColors.unknown;
    content = (
      <View style={[styles.card, { backgroundColor: p.bg, borderColor: p.border }]}>
        <Text style={[styles.cardTitle, { color: p.text }]} accessibilityRole="header">
          {t('alerts.unavailableTitle')}
        </Text>
        <Text style={[styles.body, { color: p.text }]}>{t('alerts.unavailableBody')}</Text>
        <LinkButton label={t('alerts.phivolcs')} url={OFFICIAL_LINKS.phivolcs} color={p.text} />
        <LinkButton label={t('alerts.pagasa')} url={OFFICIAL_LINKS.pagasa} color={p.text} />
      </View>
    );
  } else {
    const { taal, rain, typhoon } = alerts;
    const taalTitle = t('alerts.taal.title');
    const rainTitle = t('alerts.rain.title');
    const typhoonTitle = t('alerts.typhoon.title');

    // ---- Taal ----
    const level = taal.level;
    const taalOk = taal.status === 'ok' && level !== null && level >= 0 && level <= 5 && isFresh(taal.checkedAt);
    const taalCard = taalOk ? (
      <Card
        key="taal"
        palette={taalColors[level as number]}
        title={taalTitle}
        headline={t('alerts.taal.level', { level: level as number })}
        body={t(`alerts.taal.l${level}`)}
        extra={taal.bulletinDate ? t('alerts.bulletin', { date: taal.bulletinDate }) : undefined}
        source={taal.sourceName}
        url={taal.sourceUrl}
        checkedAt={taal.checkedAt}
      />
    ) : (
      unavailableCard(taalTitle, taal.sourceName, taal.sourceUrl)
    );

    // ---- Rain and typhoon (PAGASA) ----
    function pagasaCard(key: 'rain' | 'typhoon', title: string, s: Alerts['rain']) {
      if (s.status === 'error' || !isFresh(s.checkedAt)) return unavailableCard(title, s.sourceName, s.sourceUrl);
      const palette = s.status === 'none' ? statusColors.clear : statusColors.check;
      return (
        <Card
          key={key}
          palette={palette}
          title={title}
          headline={t(`alerts.${key}.${s.status}`)}
          source={s.sourceName}
          url={s.sourceUrl}
          checkedAt={s.checkedAt}
        />
      );
    }

    content = (
      <>
        {taalCard}
        {pagasaCard('rain', rainTitle, rain)}
        {pagasaCard('typhoon', typhoonTitle, typhoon)}
      </>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.heading} accessibilityRole="header">
          {t('alerts.title')}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('alerts.retry')}
          onPress={load}
          disabled={loading}
          style={({ pressed }) => [styles.retry, (pressed || loading) && { opacity: 0.5 }]}
        >
          <Ionicons name="refresh" size={20} color={colors.primary} />
          <Text style={styles.retryText}>{t('alerts.retry')}</Text>
        </Pressable>
      </View>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heading: { fontSize: 18, fontWeight: '700', color: colors.text },
  retry: { minHeight: touchTarget, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.sm },
  retryText: { color: colors.primary, fontSize: fontSize.small, fontWeight: '600' },
  loading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  loadingText: { color: colors.muted, fontSize: fontSize.body },
  card: { borderWidth: 2, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs },
  cardTitle: { fontSize: fontSize.small, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  headline: { fontSize: 20, fontWeight: '800' },
  body: { fontSize: fontSize.body, lineHeight: 22 },
  meta: { fontSize: 13, lineHeight: 18 },
  link: {
    minHeight: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  linkText: { fontSize: fontSize.small, fontWeight: '700' },
});
