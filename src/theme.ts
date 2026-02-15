/**
 * Design system tokens for the chat interface template.
 * Dark-mode palette inspired by ChatGPT / Claude.
 */

export const colors = {
  // Backgrounds
  background: '#0D0D0D',
  surface: '#1A1A2E',
  inputBg: '#1E1E2E',
  modalBg: '#16162A',

  // User bubble
  userBubble: '#2A9D8F',
  userBubbleText: '#FFFFFF',

  // Assistant
  assistantText: '#F0F0F0',
  assistantIcon: '#4CC9F0',

  // Text
  textPrimary: '#F0F0F0',
  textSecondary: '#A0A0A0',
  textMuted: '#666680',

  // Accents
  accent: '#4CC9F0',
  accentDim: '#2A6F97',
  danger: '#E63946',

  // Borders / dividers
  border: '#2A2A40',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radii = {
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  full: 9999,
};

export const typography = {
  headerSize: 18,
  bodySize: 16,
  captionSize: 12,
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
