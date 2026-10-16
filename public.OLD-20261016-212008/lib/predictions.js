/* ============================================
   التنبؤات الذكية — Next nap + Weekly chart
   ============================================ */
import { Storage } from './storage.js';
import { BabyStore } from './storage.js';

export const Predictions = {
  /* ============ نافذة اليقظ حسب العمر ============ */
  wakeWindow() {
    const baby = BabyStore.updateAge();
    const months = baby.ageMonths || 14;

    /* مصادر: أبحاث نوم الأطفال */
    if (months < 1)  return { min: 45, max: 60 };    /* 45-60 دقيقة */
    if (months < 3)  return { min: 60, max: 90 };
    if (months < 6)  return { min: 90, max: 150 };
    if (months < 9)  return { min: 150, max: 180 };
    if (months < 12) return { min: 180, max: 240 };
    if (months < 18) return { min: 240, max: 300 };
    if (months < 24) return { min: 300, max: 360 };
    return { min: 360, max: 420 };
  },

  /* ============ آخر استيقاظ ============ */
  lastWakeup() {
    const today = this._todayKey();
    const log = Storage.get('log_' + today, []);

    /* آخر حدث نوم */
    const sleeps = log.filter(e => e.type === 'sleep');
    if (sleeps.length === 0) return null;

    const last = sleeps[sleeps.length - 1];

    /* إن كان نوم، نستخدم endTime إن وجد */
    if (last.duration) {
      return new Date(new Date(last.startTime).getTime() + last.duration * 1000);
    }
    return new Date(last.time);
  },

  /* ============ القيلولة القادمة ============ */
  nextNap() {
    const last = this.lastWakeup();
    if (!last) return null;

    const ww = this.wakeWindow();
    const now = new Date();
    const minTime = new Date(last.getTime() + ww.min * 60 * 1000);
    const maxTime = new Date(last.getTime() + ww.max * 60 * 1000);

    /* الوقت المتبقي للقيلولة */
    const minMin = Math.floor((minTime - now) / 60000);
    const maxMin = Math.floor((maxTime - now) / 60000);

    return {
      minTime,
      maxTime,
      minMin,
      maxMin,
      window: ww,
      awakeMinutes: Math.floor((now - last) / 60000),
      isDue: maxMin <= 0,
      isSoon: minMin <= 15 && minMin > 0,
    };
  },

  /* ============ رسم بياني أسبوعي ============ */
  weeklyData(type) {
    const days = [];
    const labels = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = this._keyOf(d);
      const log = Storage.get('log_' + key, []);

      const count = type === 'all'
        ? log.length
        : log.filter(e => e.type === type).length;

      const totalMin = type === 'sleep'
        ? log.filter(e => e.type === 'sleep').reduce((s, e) => s + (e.duration || 0) / 60, 0)
        : 0;

      days.push({
        label: labels[d.getDay()],
        shortLabel: labels[d.getDay()][0],
        date: key,
        count: Math.round(count),
        minutes: Math.round(totalMin),
        isToday: i === 0,
      });
    }
    return days;
  },

  /* أعلى قيمة في الأسبوع */
  maxWeekly(type) {
    const data = this.weeklyData(type);
    return Math.max(...data.map(d => type === 'sleep' ? d.minutes : d.count), 1);
  },

  /* ============ مساعدات ============ */
  _todayKey() {
    return this._keyOf(new Date());
  },

  _keyOf(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
};

window.ommyPredictions = Predictions;

/* ============ مكونات جاهزة ============ */
window.ommyNextNapLabel = function() {
  const nap = Predictions.nextNap();
  if (!nap) return 'سجّلي نوم أولاً';
  if (nap.isDue) return 'حان وقت القيلولة';
  if (nap.isSoon) return `القيلولة بعد ${nap.minMin} دقيقة`;
  if (nap.minMin < 60) return `القيلولة خلال ${nap.minMin} د`;
  const hours = Math.floor(nap.minMin / 60);
  const mins = nap.minMin % 60;
  return `القيلولة بعد ${hours}:${String(mins).padStart(2, '0')} س`;
};

window.ommyNextNapColor = function() {
  const nap = Predictions.nextNap();
  if (!nap) return 'var(--ink-3)';
  if (nap.isDue) return 'var(--red-deep)';
  if (nap.isSoon) return 'var(--honey-deep)';
  return 'var(--clay-deep)';
};
