import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const { t, i18n } = useTranslation();
  return <footer className="site_footer">
    <div className="container">
      <p>{t('Website designed by engineer')} <strong>{i18n.language === 'ar' ? t('Sondos Mashahreh') : 'Sondos Mashahreh'}</strong></p>
      <nav aria-label={t('Store')}><Link to="/about">{t('About Us')}</Link><Link to="/contact">{t('Contact Us')}</Link></nav>
      <small>© {new Date().getFullYear().toLocaleString(i18n.language, { useGrouping: false })} · {t('All rights reserved.')}</small>
    </div>
  </footer>;
}
