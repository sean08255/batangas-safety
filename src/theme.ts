// One place for colors, sizes and spacing so every screen looks consistent.
export const colors = {
  background: '#F4F7FA',
  card: '#FFFFFF',
  text: '#12202E',
  muted: '#475869',
  primary: '#0B5FA5', // calm blue (white text on it passes contrast)
  primaryText: '#FFFFFF',
  border: '#CBD6E0',
  noticeBg: '#FEF3C7', // soft amber for notes and the disclaimer
  noticeText: '#78350F',
  coveredBg: '#DCFCE7',
  coveredText: '#14532D',
  soonBg: '#E8EDF2',
  soonText: '#475869',
};

// Taal alert levels 0 to 5, from calm to most serious. Text colors keep good contrast.
export const taalColors = [
  { bg: '#DCFCE7', border: '#16A34A', text: '#14532D' }, // 0
  { bg: '#FEF08A', border: '#CA8A04', text: '#422006' }, // 1
  { bg: '#FED7AA', border: '#EA580C', text: '#431407' }, // 2
  { bg: '#C2410C', border: '#7C2D12', text: '#FFFFFF' }, // 3
  { bg: '#B91C1C', border: '#7F1D1D', text: '#FFFFFF' }, // 4
  { bg: '#7F1D1D', border: '#450A0A', text: '#FFFFFF' }, // 5
];

// For rain and typhoon cards.
export const statusColors = {
  clear: { bg: '#DCFCE7', border: '#16A34A', text: '#14532D' },
  check: { bg: '#FED7AA', border: '#EA580C', text: '#431407' },
  unknown: { bg: '#E8EDF2', border: '#94A3B8', text: '#12202E' },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { md: 12, lg: 16 };

export const fontSize = { body: 16, small: 14, title: 26, hero: 30 };

// Minimum size for anything tappable (accessibility guideline).
export const touchTarget = 48;
