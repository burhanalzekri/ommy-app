/* ============================================
   مكتبة النصائح المصورة — مستوحاة من Nara Baby
   ============================================ */

export const Tips = {
  all: [
    {
      id: 't1',
      icon: '👀',
      title: 'التواصل البصري',
      desc: 'انظري في عيني طفلك وابتسمي — التعرف على الوجه يقوي الرابط',
      category: 'تطور',
      color: 'rose',
      age: 'منذ الولادة',
    },
    {
      id: 't2',
      icon: '🎵',
      title: 'الغناء والترديد',
      desc: 'غنّي له وكرري أصواته — يساعد على تطوير اللغة',
      category: 'لغة',
      color: 'lavender',
      age: 'منذ الولادة',
    },
    {
      id: 't3',
      icon: '🤲',
      title: 'اللعب الحسي',
      desc: 'اعطيه ألعاباً بألوان وأصوات وأنسجة مختلفة',
      category: 'تطور',
      color: 'mint',
      age: '2+ شهور',
    },
    {
      id: 't4',
      icon: '📖',
      title: 'القراءة اليومية',
      desc: 'اقرئي له قصة قصيرة كل يوم — 5 دقائق تكفي',
      category: 'لغة',
      color: 'honey',
      age: '3+ شهور',
    },
    {
      id: 't5',
      icon: '🧸',
      title: 'وقت البطن',
      desc: 'ضعيه على بطنه 3-5 دقائق — يقوي الرقبة والكتفين',
      category: 'حركة',
      color: 'peach',
      age: 'منذ الولادة',
    },
    {
      id: 't6',
      icon: '🚼',
      title: 'التدليك اللطيف',
      desc: 'دلّكي جسمه بلطف بعد الحمام — يهدئ ويساعد على النوم',
      category: 'عناية',
      color: 'sky',
      age: 'منذ الولادة',
    },
    {
      id: 't7',
      icon: '🗣️',
      title: 'الحديث المستمر',
      desc: 'صفي ما تفعلينه — "نحن الآن نغيّر الحفاض"',
      category: 'لغة',
      color: 'sage',
      age: 'منذ الولادة',
    },
    {
      id: 't8',
      icon: '🚶',
      title: 'المشي في الهواء الطلق',
      desc: '20 دقيقة يومياً — يزيد الأكسجين ويحسن المزاج',
      category: 'صحة',
      color: 'mint',
      age: '1+ شهر',
    },
    {
      id: 't9',
      icon: '🎨',
      title: 'الألوان والصور',
      desc: 'أري طفلك صوراً ملونة — يقوي التمييز البصري',
      category: 'تطور',
      color: 'rose',
      age: '2+ شهور',
    },
    {
      id: 't10',
      icon: '💧',
      title: 'ترطيب البشرة',
      desc: 'بعد كل حمام — كريم لطيف لتفادي الجفاف',
      category: 'عناية',
      color: 'sky',
      age: 'منذ الولادة',
    },
  ],

  random(count = 3) {
    const shuffled = [...this.all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  },

  byCategory(cat) {
    return this.all.filter(t => t.category === cat);
  },

  byAge(months) {
    /* فلترة تقريبية حسب العمر */
    return this.all.filter(t => {
      if (t.age === 'منذ الولادة') return true;
      if (t.age.includes('1+') && months >= 1) return true;
      if (t.age.includes('2+') && months >= 2) return true;
      if (t.age.includes('3+') && months >= 3) return true;
      return false;
    });
  },

  today() {
    /* نصيحة ثابتة لهذا اليوم (لا تتغير) */
    const today = new Date().toISOString().split('T')[0];
    let seed = 0;
    for (let i = 0; i < today.length; i++) {
      seed += today.charCodeAt(i);
    }
    const idx = seed % this.all.length;
    return this.all[idx];
  },
};

window.ommyTips = Tips;
