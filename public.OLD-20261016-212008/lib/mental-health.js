/* ============================================
   الصحة النفسية للأم — مقياس إدنبرة + تتبع المزاج
   ============================================ */
import { Storage } from './storage.js';

export const MentalHealth = {
  edinburghQuestions: [
    { id: 'q1', text: 'استطعت أن أضحك وأرى الجانب المضحك من الأمور', options: ['بنفس الدرجة كالمعتاد', 'أقل قليلاً', 'أقل بكثير', 'لم أستطع أبداً'] },
    { id: 'q2', text: 'تطلعت إلى الأمور بمتعة', options: ['بنفس الدرجة كالمعتاد', 'أقل قليلاً', 'أقل بكثير', 'بالكاد'] },
    { id: 'q3', text: 'ألومت نفسي بلا داعٍ عندما كانت الأمور تسوء', options: ['لا، أبداً', 'نادراً', 'أحياناً', 'معظم الوقت'] },
    { id: 'q4', text: 'شعرت بالقلق أو التوتر بلا سبب', options: ['لا، أبداً', 'نادراً', 'أحياناً', 'كثيراً'] },
    { id: 'q5', text: 'شعرت بالخوف أو الذعر بلا سبب واضح', options: ['لا، أبداً', 'نادراً', 'أحياناً', 'نعم، كثيراً'] },
    { id: 'q6', text: 'كانت الأمور تتراكم عليّ', options: ['لا، كنت أتعامل معها', 'أحياناً لا أتعامل جيداً', 'أحياناً لا أتعامل', 'معظم الوقت لا أتعامل'] },
    { id: 'q7', text: 'شعرت بالحزن والتعاسة لدرجة صعوبة النوم', options: ['لا، أبداً', 'نادراً', 'أحياناً', 'معظم الوقت'] },
    { id: 'q8', text: 'شعرت بالحزن والبؤس', options: ['لا، أبداً', 'أحياناً', 'كثيراً', 'معظم الوقت'] },
    { id: 'q9', text: 'شعرت بالبكاء لدرجة أنني كنت أبكي', options: ['لا، أبداً', 'فقط أحياناً', 'نعم، معظم الوقت', 'نعم، باستمرار'] },
    { id: 'q10', text: 'فكرت في إيذاء نفسي', options: ['لا، أبداً', 'نادراً', 'أحياناً', 'نعم، كثيراً'] },
  ],

  saveEdinburgh(answers) {
    const score = answers.reduce((sum, a) => sum + a, 0);
    const entry = {
      id: 'epds_' + Date.now(),
      date: new Date().toISOString(),
      score,
      answers,
    };
    const all = this.history();
    all.push(entry);
    Storage.set('edinburgh_history', all);
    return { ...entry, interpretation: this.interpret(score) };
  },

  history() {
    return Storage.get('edinburgh_history', []);
  },

  interpret(score) {
    if (score <= 9) {
      return {
        level: 'طبيعي',
        color: 'var(--mint-deep)',
        icon: '🌸',
        advice: 'حالتك النفسية جيدة. استمري في العناية بنفسك.',
        action: null,
      };
    }
    if (score <= 12) {
      return {
        level: 'اكتئاب خفيف',
        color: 'var(--honey-deep)',
        icon: '💛',
        advice: 'قد تشعرين بتعب نفسي. حاولي الراحة الكافية والتحدث مع من تثقين به.',
        action: 'تحدثي مع صديقة أو طبيبة',
      };
    }
    if (score <= 19) {
      return {
        level: 'اكتئاب متوسط',
        color: 'var(--clay-deep)',
        icon: '🧡',
        advice: 'من المهم مراجعة طبيبة نفسية أو طبيبتك. أنتِ لست وحدك.',
        action: 'استشارة طبية موصى بها',
      };
    }
    return {
      level: 'اكتئاب شديد',
      color: 'var(--red-deep)',
      icon: '🔴',
      advice: 'يجب مراجعة مختص فوراً. صحتك وصحة طفلك تهمنا — أنتِ تستحقين المساعدة.',
      action: '🚨 استشارة عاجلة',
    };
  },

  latest() {
    const h = this.history();
    return h.length > 0 ? h[h.length - 1] : null;
  },

  breathingPatterns: {
    '478': {
      name: '4-7-8 (للاسترخاء)',
      desc: 'شهيق 4 · حبس 7 · زفير 8',
      phases: [
        { name: 'شهيق', duration: 4, color: 'var(--mint-deep)' },
        { name: 'حبس', duration: 7, color: 'var(--lavender-deep)' },
        { name: 'زفير', duration: 8, color: 'var(--rose-deep)' },
      ],
    },
    'box': {
      name: 'التنفس المربع',
      desc: '4-4-4-4 للتركيز',
      phases: [
        { name: 'شهيق', duration: 4, color: 'var(--mint-deep)' },
        { name: 'حبس', duration: 4, color: 'var(--lavender-deep)' },
        { name: 'زفير', duration: 4, color: 'var(--rose-deep)' },
        { name: 'حبس', duration: 4, color: 'var(--sky-deep)' },
      ],
    },
    'calm': {
      name: 'التنفس الهادئ',
      desc: '4-6 للتهدئة السريعة',
      phases: [
        { name: 'شهيق', duration: 4, color: 'var(--mint-deep)' },
        { name: 'زفير', duration: 6, color: 'var(--sky-deep)' },
      ],
    },
  },

  saveBreathingSession(patternKey, cycles) {
    const all = Storage.get('breathing_sessions', []);
    all.push({
      id: 'br_' + Date.now(),
      pattern: patternKey,
      cycles,
      date: new Date().toISOString(),
    });
    if (all.length > 30) all.splice(0, all.length - 30);
    Storage.set('breathing_sessions', all);
    return true;
  },

  breathingCount() {
    return Storage.get('breathing_sessions', []).length;
  },

  /* تتبع المزاج */
  logDailyMood(moodKey) {
    const today = this._todayKey();
    const log = Storage.get('mh_mood_log', {});
    log[today] = { mood: moodKey, time: new Date().toISOString() };
    Storage.set('mh_mood_log', log);
    return true;
  },

  todayMood() {
    const today = this._todayKey();
    const log = Storage.get('mh_mood_log', {});
    return log[today] || null;
  },

  moodHistory() {
    const log = Storage.get('mh_mood_log', {});
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = this._keyOf(d);
      const dayLabel = ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'][d.getDay()];
      days.push({
        key,
        label: dayLabel,
        mood: (log[key] && log[key].mood) || null,
        isToday: i === 0,
      });
    }
    return days;
  },

  detectPatterns() {
    const history = this.history();
    if (history.length === 0) return null;

    const latest = history[history.length - 1];
    const previous = history.length > 1 ? history[history.length - 2] : null;
    const patterns = [];

    if (previous) {
      if (latest.score < previous.score - 3) {
        patterns.push({
          type: 'improving',
          icon: '📈',
          title: 'تحسّن ملحوظ',
          text: 'نتيجتك انخفضت من ' + previous.score + ' إلى ' + latest.score + ' — علامة إيجابية!',
          color: 'var(--mint-deep)',
        });
      } else if (latest.score > previous.score + 3) {
        patterns.push({
          type: 'worsening',
          icon: '📉',
          title: 'ارتفاع طفيف',
          text: 'نتيجتك ارتفعت من ' + previous.score + ' إلى ' + latest.score + ' — خذي وقتاً لنفسك',
          color: 'var(--honey-deep)',
        });
      } else {
        patterns.push({
          type: 'stable',
          icon: '➡️',
          title: 'مستقرة',
          text: 'نتائجك متقاربة — استمري في الرعاية الذاتية',
          color: 'var(--sky-deep)',
        });
      }
    }

    const moodHistory = this.moodHistory().filter(d => d.mood);
    if (moodHistory.length >= 3) {
      const lowMoods = moodHistory.filter(d => ['low', 'tired'].indexOf(d.mood) !== -1).length;
      if (lowMoods >= moodHistory.length / 2) {
        patterns.push({
          type: 'mood',
          icon: '💗',
          title: 'مزاجك يحتاج رعاية',
          text: 'معظم أيام الأسبوع كانت متعبة — ربما تحتاجين دعماً إضافياً',
          color: 'var(--rose-deep)',
        });
      }
    }

    return patterns.length > 0 ? patterns : null;
  },

  calmingQuotes: [
    { text: 'أنتِ لست وحدك في هذا', source: '🌸' },
    { text: 'صحتك النفسية أولوية — ليس رفاهية', source: '💗' },
    { text: 'طلب المساعدة قوة، ليس ضعفاً', source: '🤲' },
    { text: 'كل أم تمر بأيام صعبة — هذا طبيعي', source: '🌷' },
    { text: 'أنتِ تبذلين جهداً يستحق التقدير', source: '⭐' },
    { text: 'الاعتناء بنفسك ليس أنانية', source: '🌸' },
    { text: 'تحدثي عن مشاعرك — الكلام يشفي', source: '💬' },
    { text: 'خذي وقتك — لا أحد يستعجلك', source: '🌿' },
    { text: 'أنتِ أقوى مما تظنين', source: '💪' },
    { text: 'بكاؤك لا يعني ضعفك — بل إنسانيتك', source: '💧' },
  ],

  randomQuote() {
    return this.calmingQuotes[Math.floor(Math.random() * this.calmingQuotes.length)];
  },

  smartAdvice() {
    const hour = new Date().getHours();
    const todayMood = this.todayMood();
    const latest = this.latest();

    if (todayMood && ['low', 'tired'].indexOf(todayMood.mood) !== -1) {
      return {
        icon: '💗',
        title: 'أنتِ تستحقين رعاية',
        text: 'إذا كنتِ تشعرين بالثقل اليوم، هذه علامة على أنك تبذلين جهداً كبيراً. خذي 5 دقائق تنفس عميق.',
        action: 'breathe',
        actionLabel: 'ابدئي تمرين',
        color: 'var(--rose-deep)',
      };
    }

    if (latest && latest.score >= 13) {
      return {
        icon: '🤲',
        title: 'دعم متاح لك',
        text: 'نتائجك الأخيرة تشير إلى أنك تستحقين دعماً إضافياً. تحدثي مع طبيبتك أو صديقة تثقين بها.',
        action: null,
        color: 'var(--rose-deep)',
      };
    }

    if (hour >= 20) {
      return {
        icon: '🌙',
        title: 'وقت الاسترخاء',
        text: 'جرّبي تمرين تنفس 4-7-8 قبل النوم — يساعد على تهدئة الأفكار.',
        action: 'breathe',
        actionLabel: 'ابدئي التمرين',
        color: 'var(--lavender-deep)',
      };
    }

    if (hour < 12) {
      return {
        icon: '☀️',
        title: 'صباح جديد',
        text: 'ابدئي يومك بنية طيبة. ذكّري نفسك بأنك تفعلين ما يكفي.',
        action: null,
        color: 'var(--honey-deep)',
      };
    }

    return {
      icon: '🌸',
      title: 'تذكير مهم',
      text: 'صحتك النفسية جزء أساسي من رعايتك لطفلك. امنحي نفسك مساحة.',
      action: null,
      color: 'var(--clay-deep)',
    };
  },

  detailedAnalysis(score) {
    const base = this.interpret(score);
    const breakdown = [];

    if (score <= 9) {
      breakdown.push({ icon: '✅', title: 'حالة صحية', text: 'لا تظهر علامات اكتئاب ما بعد الولادة' });
      breakdown.push({ icon: '💡', title: 'استمري', text: 'حافظي على روتينك الصحي والرعاية الذاتية' });
    } else if (score <= 12) {
      breakdown.push({ icon: '⚠️', title: 'اكتئاب خفيف', text: 'قد تشعرين بتعب نفسي متزايد' });
      breakdown.push({ icon: '💗', title: 'توصية', text: 'تحدثي مع صديقة أو طبيبة — الدعم المبكر مهم' });
      breakdown.push({ icon: '🌬️', title: 'جرّبي', text: 'تمارين التنفس اليومية لتهدئة التوتر' });
    } else if (score <= 19) {
      breakdown.push({ icon: '🧡', title: 'اكتئاب متوسط', text: 'من المهم مراجعة مختص نفسي' });
      breakdown.push({ icon: '🤲', title: 'ليس ضعفاً', text: 'طلب المساعدة قرار حكيم — أنتِ تستحقين الدعم' });
      breakdown.push({ icon: '📞', title: 'خطوة أولى', text: 'احجزي موعداً مع طبيبتك أو مختصة' });
    } else {
      breakdown.push({ icon: '🚨', title: 'اكتئاب شديد', text: 'يجب مراجعة مختص فوراً' });
      breakdown.push({ icon: '💗', title: 'أنتِ مهمة', text: 'حياتك وصحتك أولوية — لا تترددي في طلب المساعدة' });
      breakdown.push({ icon: '🤲', title: 'ادعمي نفسك', text: 'أخبري من تثقين به الآن عن مشاعرك' });
    }

    return { ...base, breakdown };
  },

  quickSessions: [
    { key: 'calm', icon: '🌿', name: 'تهدئة سريعة', duration: '60 ثانية', pattern: 'calm' },
    { key: '478', icon: '😴', name: 'استرخاء عميق', duration: '90 ثانية', pattern: '478' },
    { key: 'box', icon: '🧘', name: 'تركيز وتوازن', duration: '120 ثانية', pattern: 'box' },
  ],

  _keyOf(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  },

  _todayKey() {
    return this._keyOf(new Date());
  },
};

window.ommyMH = MentalHealth;
