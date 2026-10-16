/* ============================================
   البحث الشامل — يبحث في كل المحتوى
   ============================================ */
import { FoodsByAge, ArabicRecipes, VaccineTimeline, FirstAidScenarios } from './content.js';
import { ArabicRecipes2, Duas, Activities, SleepTips, MomSelfCare, Warnings } from './content2.js';
import { BedtimeStories, MomStories, Metaphors } from './stories.js';

export const Search = {
  /* فهرس كل المحتوى */
  buildIndex() {
    const index = [];

    /* الأطعمة */
    Object.entries(FoodsByAge).forEach(([age, data]) => {
      data.allowed.forEach(f => {
        index.push({
          type: 'food',
          typeLabel: 'طعام',
          icon: f.icon || '🍽️',
          title: f.name,
          desc: f.desc,
          category: 'التغذية',
          route: 'nutrition',
          keywords: [f.name, f.desc, age, 'طعام', 'مسموح'],
        });
      });
      data.forbidden.forEach(f => {
        index.push({
          type: 'food',
          typeLabel: 'طعام ممنوع',
          icon: f.icon || '⚠️',
          title: f.name,
          desc: f.desc,
          category: 'التغذية',
          route: 'nutrition',
          keywords: [f.name, f.desc, age, 'ممنوع'],
        });
      });
    });

    /* الوصفات */
    [...ArabicRecipes, ...ArabicRecipes2].forEach(r => {
      index.push({
        type: 'recipe',
        typeLabel: 'وصفة',
        icon: r.icon,
        title: r.name,
        desc: r.age + ' · ' + r.time,
        category: 'التغذية',
        route: 'nutrition',
        keywords: [r.name, ...r.ingredients, ...r.steps, 'وصفة'],
      });
    });

    /* التطعيمات */
    VaccineTimeline.forEach(v => {
      index.push({
        type: 'vaccine',
        typeLabel: 'تطعيم',
        icon: '💉',
        title: v.name,
        desc: v.age + ' · ' + v.desc,
        category: 'التطعيمات',
        route: 'vaccines',
        keywords: [v.name, v.desc, v.age, 'تطعيم'],
      });
    });

    /* الإسعافات */
    FirstAidScenarios.forEach(s => {
      index.push({
        type: 'firstaid',
        typeLabel: 'إسعاف',
        icon: s.icon,
        title: s.title,
        desc: s.subtitle,
        category: 'الإسعافات',
        route: 'firstaid',
        keywords: [s.title, s.subtitle, ...s.steps, 'إسعاف'],
      });
    });

    /* الأدعية */
    Duas.forEach(d => {
      index.push({
        type: 'dua',
        typeLabel: 'دعاء',
        icon: '🤲',
        title: d.title,
        desc: d.text,
        category: 'أدعية',
        route: 'duas',
        keywords: [d.title, d.text, 'دعاء'],
      });
    });

    /* الأنشطة */
    Activities.forEach(a => {
      index.push({
        type: 'activity',
        typeLabel: 'نشاط',
        icon: a.icon,
        title: a.title,
        desc: a.age + ' · ' + a.desc,
        category: 'أنشطة',
        route: 'activities',
        keywords: [a.title, a.desc, a.age, 'نشاط'],
      });
    });

    /* القصص */
    [...BedtimeStories, ...MomStories].forEach(s => {
      index.push({
        type: 'story',
        typeLabel: 'قصة',
        icon: s.icon,
        title: s.title,
        desc: s.text ? s.text.substring(0, 80) + '...' : '',
        category: 'قصص',
        route: 'stories',
        keywords: [s.title, s.text || '', 'قصة'],
      });
    });

    /* الأمثلة */
    Metaphors.forEach(m => {
      index.push({
        type: 'metaphor',
        typeLabel: 'مثال',
        icon: m.icon,
        title: m.title,
        desc: m.text,
        category: 'قصص',
        route: 'stories',
        keywords: [m.title, m.text, 'مثال'],
      });
    });

    /* نصائح النوم */
    SleepTips.forEach(t => {
      index.push({
        type: 'sleeptip',
        typeLabel: 'نصيحة نوم',
        icon: t.icon,
        title: t.title,
        desc: t.desc,
        category: 'النوم',
        route: 'sleep',
        keywords: [t.title, t.desc, 'نوم'],
      });
    });

    /* العناية بالأم */
    MomSelfCare.forEach(t => {
      index.push({
        type: 'selfcare',
        typeLabel: 'عناية بالأم',
        icon: t.icon,
        title: t.title,
        desc: t.desc,
        category: 'العناية بالأم',
        route: 'selfcare',
        keywords: [t.title, t.desc, 'أم', 'رعاية'],
      });
    });

    /* التحذيرات */
    Warnings.forEach(w => {
      index.push({
        type: 'warning',
        typeLabel: 'تحذير',
        icon: w.icon,
        title: w.title,
        desc: w.desc,
        category: 'السلامة',
        route: 'safety',
        keywords: [w.title, w.desc, 'تحذير'],
      });
    });

    return index;
  },

  /* بحث */
  query(text) {
    if (!text || text.trim().length < 2) return [];
    const q = text.trim().toLowerCase();

    const index = this.buildIndex();
    const results = [];

    index.forEach(item => {
      let score = 0;
      const title = (item.title || '').toLowerCase();
      const desc = (item.desc || '').toLowerCase();

      /* عنوان مطابق */
      if (title.includes(q)) score += 10;
      /* وصف مطابق */
      if (desc.includes(q)) score += 5;
      /* كلمات مفتاحية */
      (item.keywords || []).forEach(k => {
        if (String(k).toLowerCase().includes(q)) score += 3;
      });

      if (score > 0) {
        results.push({ ...item, score });
      }
    });

    return results.sort((a, b) => b.score - a.score).slice(0, 20);
  },
};

window.ommySearch = Search;
