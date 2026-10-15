/* ============================================
   الصحة النفسية للأم — مقياس إدنبرة + تمارين
   ============================================ */
import { Storage } from './storage.js';

export const MentalHealth = {
  /* ============ مقياس إدنبرة (EPDS) ============ */
  edinburghQuestions: [
    { id: 'q1', text: 'استطعت أن أضحك وأرى الجانب المضحك من الأمور', options: ['بنفس الدرجة كالمعتاد', 'أقل قليلاً', 'أقل بكثير', 'لم أستطع أبداً'] },
    { id: 'q2', text: 'تطلعت إلى الأمور بمتعة', options: ['بنفس الدرجة كالمعتاد', 'أقل قليلاً', 'أقل بكثير', 'بالكاد', ] },
    { id: 'q3', text: 'ألومت نفسي بلا داعٍ عندما كانت الأمور تسوء', options: ['لا، أبداً', 'نادراً', 'أحياناً', 'معظم الوقت'] },
    { id: 'q4', text: 'شعرت بالقلق أو التوتر بلا سبب', options: ['لا، أبداً', 'نادراً', 'أحياناً', 'كثيراً'] },
    { id: 'q5', text: 'شعرت بالخوف أو الذعر بلا سبب واضح', options: ['لا، أبداً', 'نادراً', 'أحياناً', 'نعم، كثيراً'] },
    { id: 'q6', text: 'كانت الأمور تتراكم عليّ', options: ['لا، كنت أتعامل معها', 'أحياناً لا أتعامل جيداً', 'أحياناً لا أتعامل', 'معظم الوقت لا أتعامل'] },
    { id: 'q7', text: 'شعرت بالحزن والتعاسة لدرجة صعوبة النوم', options: ['لا، أبداً', 'نادراً', 'أحياناً', 'معظم الوقت'] },
    { id: 'q8', text: 'شعرت بالحزن والبؤس', options: ['لا، أبداً', 'أحياناً', 'كثيراً', 'معظم الوقت'] },
    { id: 'q9', text: 'شعرت بالبكاء لدرجة أنني كنت أبكي', options: ['لا، أبداً', 'فقط أحياناً', 'نعم، معظم الوقت', 'نعم، باستمرار'] },
    { id: 'q10', text: 'فكرت في إيذاء نفسي', options: ['لا، أبداً', 'نادراً', 'أحياناً', 'نعم، كثيراً'] },
  ],

  /* حفظ نتائج الاختبار */
  saveEdinburgh(answers) {
    /* الدرجات: 0-3 لكل سؤال */
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

  /* تفسير الدرجة */
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

  /* أحدث اختبار */
  latest() {
    const h = this.history();
    return h.length > 0 ? h[h.length - 1] : null;
  },

  /* ============ تمارين التنفس ============ */
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

  /* سجل جلسات التنفس */
  saveBreathingSession(patternKey, cycles) {
    const all = Storage.get('breathing_sessions', []);
    all.push({
      id: 'br_' + Date.now(),
      pattern: patternKey,
      cycles,
      date: new Date().toISOString(),
    });
    /* آخر 30 جلسة */
    if (all.length > 30) all.splice(0, all.length - 30);
    Storage.set('breathing_sessions', all);
    return true;
  },

  breathingCount() {
    return Storage.get('breathing_sessions', []).length;
  },

  /* ============ رسائل تشجيعية ============ */
  encouragement: [
    '🌸 أنتِ أم رائعة، فقط لأنك تحاولين',
    '💗 طفلك لا يحتاج أم مثالية، بل أم حاضرة',
    '🌟 كل يوم مع طفلك هدية من الله',
    '🌱 الصبر مفتاح كل شيء جميل',
    '🤲 الله اختارك لهذا الطفل، لأنك الأجدر',
    '🌸 راحتك جزء من رعايتك له',
    '💗 الأم القوية ليست التي لا تتعب، بل التي تكمّل رغم التعب',
    '🌙 الليالي الطويلة ستصبح ذكريات جميلة',
    '🌟 كل ضحكة من طفلك مكافأة على جهدك',
    '🌸 أنتِ تبني إنساناً، وهذا أعظم عمل',
  ],

  randomEncouragement() {
    return this.encouragement[Math.floor(Math.random() * this.encouragement.length)];
  },
};

window.ommyMH = MentalHealth;
