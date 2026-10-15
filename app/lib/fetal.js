/* ============================================
   مقارنة حجم الجنين — مستوحى من Flo
   ============================================ */

export const Fetal = {
  /* بيانات الجنين حسب الأسبوع */
  data: {
    4:  { size: 'بذرة الخشخاش',      emoji: '🌱', length: 0.1, weight: 0 },
    5:  { size: 'حبة السمسم',        emoji: '⚪', length: 0.3, weight: 0 },
    6:  { size: 'حبة العدس',         emoji: '🟤', length: 0.6, weight: 0 },
    7:  { size: 'حبة التوت الأزرق',   emoji: '🫐', length: 1.3, weight: 1 },
    8:  { size: 'حبة الفاصولياء',    emoji: '🫘', length: 1.6, weight: 1 },
    9:  { size: 'حبة العنب',         emoji: '🍇', length: 2.3, weight: 2 },
    10: { size: 'حبة الفراولة',      emoji: '🍓', length: 3.1, weight: 4 },
    11: { size: 'حبة التين',         emoji: '🫒', length: 4.1, weight: 7 },
    12: { size: 'حبة الليمون',       emoji: '🍋', length: 5.4, weight: 14 },
    13: { size: 'قرن البازلاء',      emoji: '🫛', length: 7.4, weight: 23 },
    14: { size: 'حبة الليمون الكبير', emoji: '🍋', length: 8.7, weight: 43 },
    15: { size: 'تفاحة صغيرة',       emoji: '🍎', length: 10.1, weight: 70 },
    16: { size: 'حبة الأفوكادو',     emoji: '🥑', length: 11.6, weight: 100 },
    17: { size: 'حبة الكمثرى',       emoji: '🍐', length: 13.0, weight: 140 },
    18: { size: 'حبة الفلفل الحلو',  emoji: '🫑', length: 14.2, weight: 190 },
    19: { size: 'حبة المانجو',       emoji: '🥭', length: 15.3, weight: 240 },
    20: { size: 'حبة الموز',         emoji: '🍌', length: 25.6, weight: 300 },
    21: { size: 'حبة الجزر الكبير',  emoji: '🥕', length: 26.7, weight: 360 },
    22: { size: 'حبة الباباي',       emoji: '🍈', length: 27.8, weight: 430 },
    23: { size: 'حبة المانجو الكبيرة', emoji: '🥭', length: 28.9, weight: 501 },
    24: { size: 'كوز الذرة',          emoji: '🌽', length: 30.0, weight: 600 },
    25: { size: 'حبة البنجر',         emoji: '🍠', length: 34.6, weight: 660 },
    26: { size: 'حبة الخس',           emoji: '🥬', length: 35.6, weight: 760 },
    27: { size: 'رأس القرنبيط',       emoji: '🥦', length: 36.6, weight: 875 },
    28: { size: 'حبة الباذنجان',      emoji: '🍆', length: 37.6, weight: 1005 },
    29: { size: 'حبة القرع',          emoji: '🎃', length: 38.6, weight: 1153 },
    30: { size: 'رأس الملفوف',        emoji: '🥬', length: 39.9, weight: 1319 },
    31: { size: 'حبة جوز الهند',      emoji: '🥥', length: 41.1, weight: 1502 },
    32: { size: 'حبة الجريب فروت',    emoji: '🍊', length: 42.4, weight: 1702 },
    33: { size: 'حبة الأناناس',       emoji: '🍍', length: 43.7, weight: 1918 },
    34: { size: 'حبة الشمام',         emoji: '🍈', length: 45.0, weight: 2146 },
    35: { size: 'حبة العسل',          emoji: '🍯', length: 46.2, weight: 2383 },
    36: { size: 'رأس الخس',           emoji: '🥬', length: 47.4, weight: 2622 },
    37: { size: 'حبة السلق',          emoji: '🥬', length: 48.6, weight: 2859 },
    38: { size: 'حبة الكراث',         emoji: '🥬', length: 49.8, weight: 3083 },
    39: { size: 'حبة البطيخ الصغيرة',  emoji: '🍉', length: 50.7, weight: 3288 },
    40: { size: 'حبة اليقطين',        emoji: '🎃', length: 51.2, weight: 3462 },
  },

  /* بيانات الأسبوع */
  get(week) {
    if (this.data[week]) return { ...this.data[week], week };
    /* ابحث عن أقرب أسبوع */
    const keys = Object.keys(this.data).map(Number);
    const closest = keys.reduce((a, b) =>
      Math.abs(b - week) < Math.abs(a - week) ? b : a
    );
    return { ...this.data[closest], week: closest };
  },

  /* حساب الأسبوع من آخر دورة */
  weekFromLMP(lmpDate) {
    const lmp = new Date(lmpDate);
    const now = new Date();
    const diffDays = Math.floor((now - lmp) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    return Math.min(Math.max(weeks, 1), 40);
  },

  /* مقارنة سريعة */
  quickCompare(week) {
    const f = this.get(week);
    return {
      emoji: f.emoji,
      size: f.size,
      length: f.length,
      weight: f.weight,
      week: f.week,
    };
  },
};

window.ommyFetal = Fetal;
