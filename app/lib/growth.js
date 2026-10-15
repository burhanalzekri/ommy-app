/* ============================================
   تتبع النمو — الطول والوزن مع منحنيات
   ============================================ */
import { Storage } from './storage.js';
import { BabyStore } from './storage.js';

export const Growth = {
  /* سجل القياسات */
  list() {
    return Storage.get('growth_log', []);
  },

  add(measure) {
    const all = this.list();
    const entry = {
      id: 'g_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(measure.weight) || null,
      height: parseFloat(measure.height) || null,
      headCirc: parseFloat(measure.headCirc) || null,
    };
    all.push(entry);
    all.sort((a, b) => new Date(a.date) - new Date(b.date));
    Storage.set('growth_log', all);

    /* حدّث بيانات الطفل الحالية */
    const baby = BabyStore.get();
    if (entry.weight) baby.weight = entry.weight;
    if (entry.height) baby.height = entry.height;
    if (entry.headCirc) baby.headCirc = entry.headCirc;
    BabyStore.save(baby);

    return entry;
  },

  remove(id) {
    const all = this.list().filter(m => m.id !== id);
    Storage.set('growth_log', all);
  },

  /* آخر قياس */
  latest() {
    const all = this.list();
    return all.length > 0 ? all[all.length - 1] : null;
  },

  /* منحنى WHO للوزن حسب العمر */
  whoWeight(months) {
    /* قيم مئين 50 (وسيط) للأولاد من منظمة الصحة العالمية */
    const data = [
      { m: 0, p50: 3.3 }, { m: 1, p50: 4.5 }, { m: 2, p50: 5.6 },
      { m: 3, p50: 6.4 }, { m: 4, p50: 7.0 }, { m: 5, p50: 7.5 },
      { m: 6, p50: 7.9 }, { m: 7, p50: 8.3 }, { m: 8, p50: 8.6 },
      { m: 9, p50: 8.9 }, { m: 10, p50: 9.2 }, { m: 11, p50: 9.4 },
      { m: 12, p50: 9.6 }, { m: 15, p50: 10.3 }, { m: 18, p50: 10.9 },
      { m: 21, p50: 11.5 }, { m: 24, p50: 12.2 }, { m: 30, p50: 13.3 },
      { m: 36, p50: 14.3 },
    ];

    /* إيجاد أقرب قيمة */
    let closest = data[0];
    for (const d of data) {
      if (Math.abs(d.m - months) < Math.abs(closest.m - months)) {
        closest = d;
      }
    }
    return closest.p50;
  },

  /* منحنى WHO للطول */
  whoHeight(months) {
    const data = [
      { m: 0, p50: 49.9 }, { m: 1, p50: 54.7 }, { m: 2, p50: 58.4 },
      { m: 3, p50: 61.4 }, { m: 4, p50: 63.9 }, { m: 5, p50: 65.9 },
      { m: 6, p50: 67.6 }, { m: 7, p50: 69.2 }, { m: 8, p50: 70.6 },
      { m: 9, p50: 72.0 }, { m: 10, p50: 73.3 }, { m: 11, p50: 74.5 },
      { m: 12, p50: 75.7 }, { m: 15, p50: 79.1 }, { m: 18, p50: 82.3 },
      { m: 21, p50: 85.1 }, { m: 24, p50: 87.1 }, { m: 30, p50: 91.9 },
      { m: 36, p50: 96.1 },
    ];
    let closest = data[0];
    for (const d of data) {
      if (Math.abs(d.m - months) < Math.abs(closest.m - months)) {
        closest = d;
      }
    }
    return closest.p50;
  },

  /* حساب المئين التقريبي */
  percentile(type, value, ageMonths) {
    const median = type === 'weight' ? this.whoWeight(ageMonths) : this.whoHeight(ageMonths);
    const ratio = value / median;
    /* تقدير تقريبي */
    if (ratio >= 1.15) return { p: 90, label: 'المئين 90', color: 'var(--mint-deep)', status: 'أعلى من المتوسط' };
    if (ratio >= 1.05) return { p: 75, label: 'المئين 75', color: 'var(--mint-deep)', status: 'فوق المتوسط' };
    if (ratio >= 0.95) return { p: 50, label: 'المئين 50', color: 'var(--clay-deep)', status: 'متوسط' };
    if (ratio >= 0.85) return { p: 25, label: 'المئين 25', color: 'var(--honey-deep)', status: 'تحت المتوسط' };
    return { p: 10, label: 'المئين 10', color: 'var(--red-deep)', status: 'منخفض' };
  },
};

window.ommyGrowth = Growth;

window.ommyAddGrowth = function() {
  if (!window.showModal) return;
  window.showModal({
    type: 'question',
    title: '📏 قياس جديد',
    message: 'أدخلي الوزن (كجم) — اتركيه فارغاً إذا لا تريدين تسجيله',
    input: true,
    inputPlaceholder: '10.2',
    inputType: 'number',
    confirmText: 'التالي',
    cancelText: 'إلغاء',
    onConfirm: async (weight) => {
      const height = await window.ommyPrompt('الطول (سم)', '78', '');
      const headCirc = await window.ommyPrompt('محيط الرأس (سم) — اختياري', '46', '');

      Growth.add({
        weight: weight || null,
        height: height || null,
        headCirc: headCirc || null,
      });

      if (window.haptic) window.haptic('success');
      if (window.ommySound?.celebrate) window.ommySound.celebrate();
      if (window.toast) window.toast('✅ تم حفظ القياس', { type: 'success' });
      if (window.ommyRefresh) window.ommyRefresh();
    },
  });
};
