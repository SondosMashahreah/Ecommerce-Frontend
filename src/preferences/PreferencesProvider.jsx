import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { PreferencesContext } from './PreferencesContext';
import { readPreference, savePreference } from './storage';

const ltrCache = createCache({ key: 'store-ltr' });
const rtlCache = createCache({ key: 'store-rtl', stylisPlugins: [prefixer, rtlPlugin] });
export default function PreferencesProvider({ children }) {
  const { i18n } = useTranslation();
  const [preference, setPreference] = useState(() => readPreference('store.theme', 'system', ['light', 'dark', 'system']));
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const mode = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = (event) => setSystemDark(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);
  const setTheme = (value) => {
    if (!['light', 'dark', 'system'].includes(value)) return;
    savePreference('store.theme', value);
    setPreference(value);
  };
  const theme = useMemo(() => createTheme({
    direction,
    palette: { mode, primary: { main: '#87ceeb' },
      ...(mode === 'dark' ? { background: { default: '#0b1218', paper: '#15222c' }, text: { primary: '#f4f8fb', secondary: '#b7c7d2' } } : {}) },
    typography: { fontFamily: 'Inter, Tahoma, Arial, sans-serif' },
  }), [direction, mode]);
  return <PreferencesContext.Provider value={{ preference, mode, setTheme }}>
    <CacheProvider value={direction === 'rtl' ? rtlCache : ltrCache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  </PreferencesContext.Provider>;
}
