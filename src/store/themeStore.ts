import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface PaperTheme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    placeholder: string;
    backdrop: string;
    onSurface: string;
    onBackground: string;
    error: string;
  };
  fonts: {
    regular: {
      fontFamily: string;
      fontWeight: '400' | '500' | '300' | '100';
    };
    medium: {
      fontFamily: string;
      fontWeight: '400' | '500' | '300' | '100';
    };
    light: {
      fontFamily: string;
      fontWeight: '400' | '500' | '300' | '100';
    };
    thin: {
      fontFamily: string;
      fontWeight: '400' | '500' | '300' | '100';
    };
  };
}

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  theme: PaperTheme;
}

const lightTheme: PaperTheme = {
  dark: false,
  colors: {
    primary: '#00D09E',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#212529',
    placeholder: '#6C757D',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    onSurface: '#212529',
    onBackground: '#212529',
    error: '#DC3545',
  },
  fonts: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Poppins-Medium',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Poppins-Thin',
      fontWeight: '100' as const,
    },
  },
};

const darkTheme: PaperTheme = {
  dark: true,
  colors: {
    primary: '#00D09E',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    placeholder: '#B3B3B3',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
    error: '#CF6679',
  },
  fonts: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Inter-Medium',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Poppins-Thin',
      fontWeight: '100' as const,
    },
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      toggleTheme: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light';
        set({ mode: newMode });
      },
      setTheme: (mode: ThemeMode) => set({ mode }),
      get theme() {
        return get().mode === 'light' ? lightTheme : darkTheme;
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ mode: state.mode }),
    },
  ),
);
