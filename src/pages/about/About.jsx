import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiArrowDown, FiArrowUpRight, FiHeadphones, FiSmartphone, FiWatch } from 'react-icons/fi';
import ProductImage from '../../components/ProductImage/ProductImage';
import { getProducts } from '../../services/api';
import { localizedProductName } from '../../i18n/productContent';
import './About.css';

const chapters = ['discover', 'choose', 'enjoy'];
const fallbackIcons = [FiSmartphone, FiHeadphones, FiWatch];

export default function About() {
  const { t, i18n } = useTranslation();
  const story = useRef(null);
  const [active, setActive] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    getProducts().then((items) => {
      if (mounted) setProducts([
        items.find((item) => item.category === 'Smartphones') || items[0],
        items.find((item) => item.category === 'Headphones & Earbuds') || items[1],
        items.find((item) => item.category === 'Smart Watches') || items[2],
      ]);
    }).catch(() => {}); // The story remains complete without catalog images.
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const element = story.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    const update = () => {
      frame = null;
      if (reducedMotion.matches) return;
      const bounds = element.getBoundingClientRect();
      const distance = Math.max(1, element.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -bounds.top / distance));
      element.style.setProperty('--story-progress', progress);
      setActive(Math.min(chapters.length - 1, Math.floor(progress * chapters.length)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reducedMotion.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
    };
  }, []);

  const goToChapter = (index) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.getElementById(`story-${chapters[index]}`)?.scrollIntoView();
      return;
    }
    const element = story.current;
    const distance = element.offsetHeight - window.innerHeight;
    window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top + distance * (index + 0.15) / chapters.length, behavior: 'smooth' });
  };

  const number = (value) => value.toLocaleString(i18n.language, { minimumIntegerDigits: 2 });

  return <main className="about_page">
    <section className="about_intro">
      <div className="about_intro_orbit" aria-hidden="true"><FiSmartphone /><FiHeadphones /><FiWatch /></div>
      <p className="about_eyebrow">{t('about.eyebrow')}</p>
      <h1>{t('about.title')}</h1>
      <p className="about_lead">{t('about.intro')}</p>
      <a className="about_scroll" href="#about-story"><span>{t('about.scroll')}</span><FiArrowDown aria-hidden="true" /></a>
      <span className="about_intro_note">{t('about.note')}</span>
    </section>

    <section id="about-story" className="about_story" ref={story} aria-label={t('About Us')}>
      <div className="about_stage">
        <div className="about_stage_top"><span>{t('about.devices')}</span><span>{number(active + 1)} / {number(chapters.length)}</span></div>
        <div className="about_scenes">
          {chapters.map((chapter, index) => {
            const product = products[index];
            const Icon = fallbackIcons[index];
            return <article id={`story-${chapter}`} key={chapter} className={`about_scene about_scene--${index} ${active === index ? 'is_active' : ''}`}>
              <div className="about_scene_copy">
                <p className="about_eyebrow">{number(index + 1)} · {t(`about.${chapter}`)}</p>
                <h2>{t(`about.${chapter}.title`)}</h2>
                <p>{t(`about.${chapter}.body`)}</p>
                <Link className="about_text_link" to="/">{t('about.cta')}<FiArrowUpRight aria-hidden="true" /></Link>
              </div>
              <div className="about_visual">
                <div className="about_halo" aria-hidden="true" />
                <span className="about_visual_number" aria-hidden="true">{number(index + 1)}</span>
                {product?.image_path ? <ProductImage imagePath={product.image_path} alt={localizedProductName(product.name, i18n.language)} size="hero" /> : <Icon className="about_device_icon" aria-hidden="true" />}
                <span className="about_visual_caption">{product ? localizedProductName(product.name, i18n.language) : t('about.devices')}</span>
              </div>
            </article>;
          })}
        </div>
        <nav className="about_chapters" aria-label={t('about.sceneNav')}>
          {chapters.map((chapter, index) => <button type="button" key={chapter} onClick={() => goToChapter(index)} aria-current={active === index ? 'step' : undefined}>
            <span>{number(index + 1)}</span>{t(`about.${chapter}`)}
          </button>)}
        </nav>
        <div className="about_progress" aria-hidden="true"><div /></div>
      </div>
    </section>

    <section className="about_end">
      <span className="about_eyebrow">{t('about.note')}</span>
      <h2>{t('about.end.title')}</h2>
      <p>{t('about.end.body')}</p>
      <div className="about_end_actions"><Link className="about_cta" to="/">{t('about.cta')}<FiArrowUpRight aria-hidden="true" /></Link><Link to="/contact">{t('about.contact')}</Link></div>
    </section>
  </main>;
}
