/* ============================================
   تتبع الحرارة والنمو
   ============================================ */
import { Storage } from './storage.js';

export const Temperature = {
  list() {
    return Storage.get('temperature_log', []);
  },

  add(temp, note = '') {
    const all = this.list();
    const entry = {
      id: 'temp_' + Date.now(),
      temp: parseFloat(temp),
      note,
      time: new Date().toISOString(),
    };
    all.unshift(entry);
    /* احفظ آخر 30 قياس */
    if (all.length > 30) all.length = 30;
    Storage.set('temperature_log', all);
    return entry;
  },

  latest() {
    return this.list()[0] || null;
  },

  /* تفسير الحرارة */
  interpret(temp) {
    if (temp < 36) return { label: 'منخفضة', color: 'var(--sky-deep)', icon: '❄️', advice: 'دفّئي الطفل وراقبيه' };
    if (temp < 37.5) return { label: 'طبيعية', color: 'var(--mint-deep)', icon: '✅', advice: 'الحرارة طبيعية' };
    if (temp < 38) return { label: 'خفيفة', color: 'var(--honey-deep)', icon: '⚠️', advice: 'راقبي — ملابس خفيفة + سوائل' };
    if (temp < 39) return { label: 'حرارة', color: 'var(--clay-deep)', icon: '🌡️', advice: 'خافض حرارة + راجعي الطبيبة' };
    return { label: 'عالية جداً', color: 'var(--red-deep)', icon: '🚨', advice: 'راجعي الطوارئ فوراً' };
  },
};

window.ommyAddTemp = function() {
  if (!window.showModal) return;
  window.showModal({
    type: 'question',
    title: '🌡️ قياس الحرارة',
    message: 'أدخلي درجة الحرارة (°م)',
    input: true,
    inputPlaceholder: 'مثال: 37.2',
    inputType: 'number',
    confirmText: 'حفظ',
    cancelText: 'إلغاء',
    onConfirm: (val) => {
      const temp = parseFloat(val);
      if (isNaN(temp) || temp < 30 || temp > 45) {
        if (window.toast) window.toast('⚠️ درجة غير صحيحة', { type: 'warning' });
        return;
      }
      Temperature.add(temp);
      const info = Temperature.interpret(temp);
      if (window.haptic) window.haptic('success');
      if (window.toast) {
        window.toast(`${info.icon} ${temp}° — ${info.label}`, {
          type: temp >= 38 ? 'warning' : 'success',
          duration: 2500,
        });
      }
      if (window.ommyRefresh) window.ommyRefresh();
    },
  });
};

window.ommyTemperature = Temperature;
