/* ============================================
   العناية بالأم — تتبع شخصي + تمارين + أهداف
   ============================================ */
import { Storage } from './storage.js';

export const SelfCare = {
  /* ============ الحالة المزاجية اليومية ============ */
  moods: [
    { key: 'great', icon: '😊', label: 'ممتازة', color: 'var(--mint-deep)', value: 5 },
    { key: 'good', icon: '🙂', label: 'جيدة', color: 'var(--clay-deep)', value: 4 },
    { key: 'okay', icon: '😐', label: 'عادية', color: 'var(--honey-deep)', value: 3 },
    { key: 'tired', icon: '😔', label: 'متعبة', color: 'var(--peach-deep)', value: 2 },
    { key: 'low', icon: '😢', label: 'منخفضة', color: 'var(--red-deep)', value: 1 },
  ],

  logMood(moodKey) {
    const today = this._todayKey();
    const log = Storage.get('mom_mood_log', {});
    log[today] = moodKey;
    Storage.set('mom_mood_log', log);
    return true;
  },

  todayMood() {
    const today = this._todayKey();
    const log = Storage.get('mom_mood_log', {});
    return log[today] || null;
  },

  weeklyMoods() {
    const log = Storage.get('mom_mood_log', {});
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = this._keyOf(d);
      const dayLabel = ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'][d.getDay()];
      days.push({
        key,
        label: dayLabel,
        mood: log[key] || null,
        isToday: i === 0,
      });
    }
    return days;
  },

  moodInsight() {
    const moods = this.weeklyMoods().filter(d => d.mood);
    if (moods.length === 0) return null;

    const total = moods.reduce((s, d) => {
      const m = this.moods.find(x => x.key === d.mood);
      return s + (m ? m.value : 0);
    }, 0);
    const avg = total / moods.length;

    if (avg >= 4) return { level: 'ممتاز', color: 'var(--mint-deep)', icon: '🌟', msg: 'أسبوع رائع! استمري' };
    if (avg >= 3) return { level: 'جيد', color: 'var(--clay-deep)', icon: '💚', msg: 'أسبوع متوازن' };
    if (avg >= 2) return { level: 'يحتاج رعاية', color: 'var(--honey-deep)', icon: '💛', msg: 'خذي وقتاً لنفسك' };
    return { level: 'انتبهي لنفسك', color: 'var(--red-deep)', icon: '❤️', msg: 'أنتِ أولوية — تحدثي مع من تثقين' };
  },

  /* ============ الأهداف اليومية ============ */
  dailyGoals: [
    { id: 'water', icon: '💧', label: 'شرب 8 أكواب ماء', category: 'جسدية' },
    { id: 'meal', icon: '🥗', label: '3 وجبات متوازنة', category: 'جسدية' },
    { id: 'walk', icon: '🚶‍♀️', label: '20 دقيقة مشي', category: 'جسدية' },
    { id: 'sleep', icon: '😴', label: 'نوم 7 ساعات', category: 'جسدية' },
    { id: 'break', icon: '📵', label: '15 دقيقة هدوء', category: 'نفسية' },
    { id: 'talk', icon: '💬', label: 'تواصل مع صديقة', category: 'اجتماعية' },
    { id: 'breath', icon: '🌬️', label: 'تمرين تنفس', category: 'نفسية' },
    { id: 'hobby', icon: '🎨', label: '5 دقائق هواية', category: 'نفسية' },
  ],

  completedGoals() {
    const today = this._todayKey();
    const log = Storage.get('mom_goals_log', {});
    return log[today] || [];
  },

  toggleGoal(goalId) {
    const today = this._todayKey();
    const log = Storage.get('mom_goals_log', {});
    const completed = log[today] || [];

    if (completed.includes(goalId)) {
      log[today] = completed.filter(id => id !== goalId);
    } else {
      log[today] = [...completed, goalId];
    }
    Storage.set('mom_goals_log', log);
    return log[today];
  },

  goalsProgress() {
    const completed = this.completedGoals();
    const total = this.dailyGoals.length;
    return {
      completed: completed.length,
      total,
      percent: Math.round((completed.length / total) * 100),
    };
  },

  /* ============ سلسلة الأيام المتتالية ============ */
  streak() {
    const log = Storage.get('mom_goals_log', {});
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = this._keyOf(d);
      const completed = log[key] || [];
      if (completed.length >= 3) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  },

  /* ============ نصائح ذكية حسب الحالة ============ */
  smartTip() {
    const hour = new Date().getHours();
    const mood = this.todayMood();
    const goals = this.goalsProgress();

    /* أولوية 1: مزاج منخفض */
    if (mood === 'low' || mood === 'tired') {
      return {
        icon: '💗',
        title: 'أنتِ تستحقين الراحة',
        text: 'خذي 5 دقائق للتنفس العميق. لا شيء أهم من صحتك الآن.',
        action: 'breath',
        actionLabel: 'ابدئي تمرين تنفس',
      };
    }

    /* أولوية 2: أهداف غير مكتملة */
    if (goals.completed === 0 && hour >= 14) {
      return {
        icon: '🎯',
        title: 'ابدئي بأهداف اليوم',
        text: 'حتى هدف واحد يُحدث فرقاً. ابدئي بشرب كوب ماء الآن.',
        action: 'goals',
        actionLabel: 'شاهدي الأهداف',
      };
    }

    /* أولوية 3: وقت المساء */
    if (hour >= 20) {
      return {
        icon: '🌙',
        title: 'وقت الاسترخاء',
        text: 'حضّري كوب شاي دافئ واقرئي صفحة من كتاب. راحة تستحقينها.',
        action: null,
      };
    }

    /* أولوية 4: سلسلة إنجاز */
    const streak = this.streak();
    if (streak >= 3) {
      return {
        icon: '🏆',
        title: `${streak} أيام متتالية!`,
        text: 'التزامك ملهم. استمري — أنتِ تبني عادة رائعة.',
        action: null,
      };
    }

    /* نصيحة افتراضية */
    return {
      icon: '🌸',
      title: 'أنتِ كافية',
      text: 'لا تنسي أن تعتني بنفسك. صحتك أساس صحة طفلك.',
      action: null,
    };
  },

  /* ============ تمارين التنفس السريعة ============ */
  breathingPatterns: [
    { key: 'calm', name: 'التنفس الهادئ', duration: 60, desc: 'دقيقة واحدة للتهدئة' },
    { key: '478', name: '4-7-8', duration: 90, desc: 'للاسترخاء العميق' },
    { key: 'box', name: 'المربع', duration: 120, desc: 'للتركيز' },
  ],

  /* ============ رسائل تشجيعية ============ */
  messages: [
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
    '💗 لا تقارني نفسك بغيرك — كل أم قصتها مختلفة',
    '🌟 أنتِ كافية. تماماً كما أنتِ',
  ],

  randomMessage() {
    return this.messages[Math.floor(Math.random() * this.messages.length)];
  },

  /* ============ مساعدات ============ */
  _todayKey() {
    return this._keyOf(new Date());
  },

  _keyOf(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
};

window.ommySelfCare = SelfCare;

/* ============ دوال عامة ============ */
window.ommyLogMood = function(moodKey) {
  SelfCare.logMood(moodKey);
  if (window.haptic) window.haptic('light');
  const mood = SelfCare.moods.find(m => m.key === moodKey);
  if (window.toast) window.toast(`💗 ${mood.icon} ${mood.label}`, { type: 'success', duration: 1500 });
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommyToggleGoal = function(goalId) {
  SelfCare.toggleGoal(goalId);
  if (window.haptic) window.haptic('light');
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommySelfCareBreath = function(patternKey) {
  if (window.ommyStartBreathing) window.ommyStartBreathing(patternKey);
};

window.ommyShowSelfCareTip = function(tip) {
  if (window.toast) window.toast(tip.text, { type: 'info', duration: 3000 });
};
