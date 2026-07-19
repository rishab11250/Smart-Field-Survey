import { Platform } from 'react-native';

export const Colors = {
  light: {
    chrome: '#1B2620',
    chromeLight: '#2A3A32',
    text: '#1C1C1E',
    textSecondary: '#6B6560',
    background: '#EEE9E2',
    surface: '#E4DDD4',
    tint: '#065F46',
    tintLight: '#D1FAE5',
    accent: '#C4663F',
    accentLight: '#F5E0D4',
    card: '#FFFFFF',
    cardBorder: '#D9D2C8',
    cardAccent: '#065F46',
    tabIconDefault: '#8A847D',
    tabIconSelected: '#065F46',
    icon: '#7A746E',
    success: '#065F46',
    warning: '#C4663F',
    danger: '#DC2626',
    muted: '#8A847D',
    shadow: 'rgba(27, 38, 32, 0.06)',
    divider: '#D9D2C8',
    inputBg: '#E8E2D9',
  },
  dark: {
    chrome: '#0F0D0B',
    chromeLight: '#1C1916',
    text: '#E8E4DE',
    textSecondary: '#8A847D',
    background: '#0F0D0B',
    surface: '#1A1815',
    tint: '#6EE7B7',
    tintLight: '#065F46',
    accent: '#D4815C',
    accentLight: '#2A1E18',
    card: '#1A1815',
    cardBorder: '#2C2823',
    cardAccent: '#6EE7B7',
    tabIconDefault: '#6B6560',
    tabIconSelected: '#6EE7B7',
    icon: '#8A847D',
    success: '#34D399',
    warning: '#D4815C',
    danger: '#F87171',
    muted: '#6B6560',
    shadow: 'rgba(0, 0, 0, 0.5)',
    divider: '#2C2823',
    inputBg: '#12100E',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
