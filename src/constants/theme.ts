export const colors = {
  primary: '#00D09E',
  secondary: '#00664eff',
  background: '#FFFFFF',
  backgroundDark: '#0F0F0F',
  surface: '#F5F5F5',
  surfaceDark: '#1A1A1A',
  text: '#000000',
  textDark: '#FFFFFF',
  textSecondary: '#666666',
  textSecondaryDark: '#B0B0B0',
  error: '#E63946',
  success: '#06D6A0',
  warning: '#FFB703',
  border: '#E0E0E0',
  borderDark: '#2A2A2A',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const paperTheme = {
  dark: true,
  colors: {
    primary: colors.primary,
    background: colors.backgroundDark,
    surface: colors.surfaceDark,
    text: colors.textDark,
    placeholder: colors.textSecondaryDark,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    onSurface: colors.textDark,
    onBackground: colors.textDark,
    error: colors.error,
  },
  fonts: {
    regular: {
      fontFamily: 'Inter-Regular',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Inter-Medium',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Inter-Light',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Inter-Thin',
      fontWeight: '100' as const,
    },
  },
};
