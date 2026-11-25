// The "this is not an official warning system" note, shown on main screens.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from '../i18n';
import { colors, fontSize, radius, spacing } from '../theme';

export default function Disclaimer() {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{t('common.disclaimer')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.noticeBg,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  text: { color: colors.noticeText, fontSize: fontSize.small, lineHeight: 20 },
});
