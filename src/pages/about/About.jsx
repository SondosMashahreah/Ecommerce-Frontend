import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiArrowDown, FiArrowUpRight, FiHeadphones, FiSmartphone, FiWatch, FiStar, FiTarget, FiHeart } from 'react-icons/fi';
import ProductImage from '../../components/ProductImage/ProductImage';
import { getProducts } from '../../services/api';
import { localizedProductName } from '../../i18n/productContent';
import './About.css';

const chapters = ['discover', 'choose', 'enjoy'];
const fallbackIcons = [FiSmartphone, FiHeadphones, FiWatch];
const chapterIcons = [FiStar, FiTarget, FiHeart];

export default function About() {
  const { t, i18n } = useTranslation();
  const storyRef = useRef(null);
  const [active, setActive] = useState(0);
  const [products, setProducts] = useState([]);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = useRef(false);
  const frameRef = useRef(null);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let mounted = true;
    getProducts().then((items) => {
      if (mounted) setProducts([
        items.find((item) => item.category === 'Smartphones') || items[0],
        items.find((item) => item.category === 'Headphones & Earbuds') || items[1],
        items.find((item) => item.category === 'Smart Watches') || items[2],
      ]);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const handleScroll = useCallback(() => {
    if (prefersReducedMotion.current || !storyRef.current) return;
    const element = storyRef.current;
    const bounds = element.getBoundingClientRect();
    const distance = Math.max(1, element.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -bounds.top / distance));
    setScrollProgress(progress);
    setActive(Math.min(chapters.length - 1, Math.floor(progress * chapters.length)));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion.current) return;
    const schedule = () => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        handleScroll();
      });
    };

    handleScroll();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [handleScroll]);

  

  const goToChapter = (index) => {
    const target = document.getElementById(`story-${chapters[index]}`);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion.current ? 'auto' : 'smooth',
      block: 'start'
    });
  };

  const number = (value) => value.toLocaleString(i18n.language, { minimumIntegerDigits: 2 });

  return (
    <main className="about_page">
      <section className="about_intro" data-animate="fade-up">
        <div className="about_intro_bg" aria-hidden="true">
          <div className="about_orb about_orb--1" />
          <div className="about_orb about_orb--2" />
          <div className="about_orb about_orb--3" />
        </div>
        <div className="about_intro_orbit" aria-hidden="true">
          <FiSmartphone className="orbit-item" style={{ top: '12%', left: '8%' }} />
          <FiHeadphones className="orbit-item" style={{ top: '22%', right: '6%' }} />
          <FiWatch className="orbit-item" style={{ bottom: '5%', left: '35%' }} />
        </div>
        <p className="about_eyebrow">{t('about.eyebrow')}</p>
        <h1>{t('about.title')}</h1>
        <p className="about_lead">{t('about.intro')}</p>
        <a className="about_scroll" href="#about-story">
          <span>{t('about.scroll')}</span>
          <FiArrowDown aria-hidden="true" className="scroll-arrow" />
        </a>
        <span className="about_intro_note">{t('about.note')}</span>
      </section>

      <section id="about-story" className="about_story" ref={storyRef} aria-label={t('About Us')}>
        <div className="about_progress_bar" aria-hidden="true">
          <div className="about_progress_fill" style={{ transform: `scaleX(${scrollProgress})` }} />
        </div>
        <div className="about_stage">
          <div className="about_stage_top">
            <span>{t('about.devices')}</span>
            <span>{number(active + 1)} / {number(chapters.length)}</span>
          </div>
          <div className="about_scenes">
            {chapters.map((chapter, index) => {
              const product = products[index];
              const Icon = fallbackIcons[index];
              const ChapterIcon = chapterIcons[index];
              return (
                <article
                  id={`story-${chapter}`}
                  key={chapter}
                  className={`about_scene about_scene--${index} ${active === index ? 'is_active' : ''}`}
                  aria-current={active === index ? 'step' : undefined}
                >
                  <div className="about_scene_copy">
                    <p className="about_eyebrow">
                      <span className="eyebrow-number">{number(index + 1)}</span>
                      <span className="eyebrow-dot" aria-hidden="true" />
                      {t(`about.${chapter}`)}
                    </p>
                    <h2>{t(`about.${chapter}.title`)}</h2>
                    <p>{t(`about.${chapter}.body`)}</p>
                    <Link className="about_text_link" to="/">
                      {t('about.cta')}
                      <FiArrowUpRight aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="about_visual">
                    <div className="about_halo" aria-hidden="true" />
                    <span className="about_visual_number" aria-hidden="true">{number(index + 1)}</span>
                    <div className="about_chapter_icon" aria-hidden="true">
                      <ChapterIcon />
                    </div>
                    {product?.image_path ? (
                      <ProductImage
                        imagePath={product.image_path}
                        alt={localizedProductName(product.name, i18n.language)}
                        size="hero"
                        className="about_product_image"
                      />
                    ) : (
                      <Icon className="about_device_icon" aria-hidden="true" />
                    )}
                    <span className="about_visual_caption">
                      {product ? localizedProductName(product.name, i18n.language) : t('about.devices')}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
          <nav className="about_chapters" aria-label={t('about.sceneNav')}>
            {chapters.map((chapter, index) => (
              <button
                type="button"
                key={chapter}
                onClick={() => goToChapter(index)}
                aria-current={active === index ? 'step' : undefined}
                className={active === index ? 'is_active' : ''}
              >
                <span className="chapter-number">{number(index + 1)}</span>
                <span className="chapter-label">{t(`about.${chapter}`)}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      <section className="about_end" data-animate="fade-up">
        <span className="about_eyebrow">{t('about.note')}</span>
        <h2>{t('about.end.title')}</h2>
        <p>{t('about.end.body')}</p>
        <div className="about_end_actions">
          <Link className="about_cta" to="/">
            {t('about.cta')}
            <FiArrowUpRight aria-hidden="true" />
          </Link>
          <Link to="/contact">{t('about.contact')}</Link>
        </div>
      </section>
    </main>
  );
}