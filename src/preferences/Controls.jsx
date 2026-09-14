import { useTranslation } from 'react-i18next';
import { FiGlobe, FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { usePreferences } from './PreferencesContext';

export function LanguageButton() {
  const { i18n } = useTranslation();
  const arabic = i18n.language === 'ar';
  return <button type="button" className="language_btn" lang={arabic ? 'en' : 'ar'}
    aria-label={arabic ? 'Switch to English' : 'التبديل إلى العربية'}
    onClick={() => i18n.changeLanguage(arabic ? 'en' : 'ar')}>
    <FiGlobe aria-hidden="true" /><span>{arabic ? 'English' : 'العربية'}</span>
  </button>;
}
export function ThemeSelector() {
  const { t } = useTranslation();
  const { preference, setTheme } = usePreferences();
  const Icon = preference === 'system' ? FiMonitor : preference === 'dark' ? FiMoon : FiSun;
  return <label className="theme_selector">
    <Icon aria-hidden="true" /><span>{t('Theme')}</span>
    <select aria-label={t('Theme')} value={preference} onChange={(e) => setTheme(e.target.value)}>
      <option value="system">{t('System')}</option>
      <option value="light">{t('Light')}</option>
      <option value="dark">{t('Dark')}</option>
    </select>
  </label>;
}
export function PreferencesToolbar() {
  return <div className="preferences_toolbar"><LanguageButton /><ThemeSelector /></div>;
}
