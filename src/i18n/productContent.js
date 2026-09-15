import catalogArabic from './catalog.ar.json';
const terms = [
  ['smartphones', 'هواتف ذكية'], ['smartphone', 'هاتف ذكي'],
  ['headphones', 'سماعات رأس'], ['headphone', 'سماعة رأس'],
  ['earbuds', 'سماعات أذن'], ['laptops', 'أجهزة لابتوب'], ['laptop', 'لابتوب'],
  ['tablets', 'أجهزة لوحية'], ['tablet', 'جهاز لوحي'],
  ['smart watches', 'ساعات ذكية'], ['smart watch', 'ساعة ذكية'],
  ['gaming', 'ألعاب'], ['wireless', 'لاسلكي'], ['portable', 'محمول'],
  ['controller', 'وحدة تحكم'], ['keyboard', 'لوحة مفاتيح'], ['mouse', 'فأرة'],
  ['camera', 'كاميرا'], ['speaker', 'مكبر صوت'], ['monitor', 'شاشة'],
  ['charger', 'شاحن'], ['case', 'غطاء حماية'], ['black', 'أسود'], ['white', 'أبيض'],
  ['blue', 'أزرق'], ['red', 'أحمر'], ['green', 'أخضر'], ['silver', 'فضي'],
  ['gold', 'ذهبي'], ['pro max', 'برو ماكس'], ['pro', 'برو'], ['max', 'ماكس'],
  ['apple', 'آبل'], ['iphone', 'آيفون'], ['samsung', 'سامسونج'], ['galaxy', 'جالكسي'],
  ['microsoft', 'مايكروسوفت'], ['xbox', 'إكس بوكس'], ['sony', 'سوني'],
  ['playstation', 'بلايستيشن'], ['google', 'جوجل'], ['pixel', 'بيكسل'],
  ['huawei', 'هواوي'], ['xiaomi', 'شاومي'], ['lenovo', 'لينوفو'], ['dell', 'ديل'],
  ['high performance', 'أداء عالٍ'], ['high-quality', 'عالي الجودة'],
  ['high quality', 'عالي الجودة'], ['battery life', 'عمر بطارية'],
  ['fast charging', 'شحن سريع'], ['noise cancellation', 'عزل الضوضاء'],
  ['display', 'شاشة'], ['storage', 'مساحة تخزين'], ['memory', 'ذاكرة'],
];

const sentences = [
  [/take your gaming experience to the next level/gi, 'ارتقِ بتجربة اللعب إلى مستوى جديد'],
  [/perfect for everyday use/gi, 'مثالي للاستخدام اليومي'],
  [/next level/gi, 'مستوى جديد'],
  [/\bfeaturing\b/gi, 'يتميز بـ'], [/\bwith\b/gi, 'مع'], [/\band\b/gi, 'و'],
  [/\bfor\b/gi, 'لـ'], [/\bthe\b/gi, 'الـ'], [/\ba\b/gi, ''],
  [/\bpowerful\b/gi, 'قوي'], [/\badvanced\b/gi, 'متقدم'], [/\blatest\b/gi, 'الأحدث'],
  [/\bexcellent\b/gi, 'ممتاز'], [/\bstunning\b/gi, 'مذهل'], [/\bdesign\b/gi, 'تصميم'],
  [/\bperformance\b/gi, 'أداء'], [/\bprocessor\b/gi, 'معالج'], [/\bbattery\b/gi, 'بطارية'],
  [/\bscreen\b/gi, 'شاشة'], [/\bresolution\b/gi, 'دقة'], [/\bmegapixel\b/gi, 'ميجابكسل'],
  [/\bfast\b/gi, 'سريع'], [/\bdurable\b/gi, 'متين'], [/\bpremium\b/gi, 'فاخر'],
  [/\boffers\b/gi, 'يوفر'], [/\bdelivers\b/gi, 'يقدم'], [/\benjoy\b/gi, 'استمتع بـ'],
  [/\bexperience\b/gi, 'تجربة'], [/\btechnology\b/gi, 'تقنية'], [/\bnew\b/gi, 'جديد'],
];

function replaceTerms(value) {
  return terms.reduce((result, [english, arabic]) => result.replace(
    new RegExp(`\\b${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), arabic
  ), value);
}

export function localizedProductName(name, language) {
  if (language === 'ar' && catalogArabic[String(name || '').trim().toLowerCase()]) return catalogArabic[String(name).trim().toLowerCase()];
  if (!name || language !== 'ar' ) return name || '';
  return replaceTerms(name).replace(/\s+/g, ' ').trim();
}

export function localizedProductDescription(description, language) {
  if (language === 'ar' && catalogArabic[String(description || '').trim().toLowerCase()]) return catalogArabic[String(description).trim().toLowerCase()];
  if (!description || language !== 'ar' ) return description || '';
  let translated = replaceTerms(description);
  translated = sentences.reduce((result, [pattern, arabic]) => result.replace(pattern, arabic), translated);
  return translated.replace(/\s+([،,.])/g, '$1').replace(/\s+/g, ' ').trim();
}

export function localizedCategory(category, language) {
  return localizedProductName(category, language);
}
