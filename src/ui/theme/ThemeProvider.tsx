import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { initDatabase } from '@/db/client';
import { THEME_MODE_ENUM } from '@/domain/constants';
import { createSettingsRepo, SettingsRepo } from '@/domain/repositories/settings.repo';
import { ThemeMode } from '@/domain/schemas/settings.schema';
import { darkTheme, lightTheme, Theme } from './tokens';

type ThemeContextValue = {
  tokens: Theme;
  mode: ThemeMode;
  resolved: 'light' | 'dark';
  setMode: (next: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(THEME_MODE_ENUM.SYSTEM);
  const [repo, setRepo] = useState<SettingsRepo | null>(null);

  useEffect(() => {
    let canceled = false;
    initDatabase().then(async (db) => {
      if (canceled) return;
      const r = createSettingsRepo(db);
      setRepo(r);
      const current = await r.get();
      if (!canceled && current) setModeState(current.theme_mode);
    });
    return () => {
      canceled = true;
    };
  }, []);

  const resolved: 'light' | 'dark' =
    mode === THEME_MODE_ENUM.SYSTEM
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : mode === THEME_MODE_ENUM.DARK
        ? 'dark'
        : 'light';

  const tokens = resolved === 'dark' ? darkTheme : lightTheme;

  const setMode = async (next: ThemeMode) => {
    setModeState(next);
    if (repo) await repo.update({ theme_mode: next });
  };

  return (
    <ThemeContext.Provider value={{ tokens, mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
