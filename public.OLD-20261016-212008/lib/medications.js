/* ============================================
   تتبع الدواء
   ============================================ */
import { Storage } from './storage.js';

export const Medications = {
  list() {
    return Storage.get('medications', []);
  },

  add(med) {
    const all = this.list();
    med.id = 'med_' + Date.now();
    med.created = new Date().toISOString();
    med.history = [];
    all.push(med);
    Storage.set('medications', all);
    return med;
  },

  remove(id) {
    const all = this.list().filter(m => m.id !== id);
    Storage.set('medications', all);
  },

  /* تسجيل جرعة */
  logDose(id) {
    const all = this.list();
    const med = all.find(m => m.id === id);
    if (!med) return null;
    med.history = med.history || [];
    med.history.push({
      time: new Date().toISOString(),
    });
    /* احتفظ بآخر 30 جرعة */
    if (med.history.length > 30) med.history = med.history.slice(-30);
    Storage.set('medications', all);
    return med;
  },

  /* الجرعات اليوم */
  todayDoses(id) {
    const med = this.list().find(m => m.id === id);
    if (!med) return 0;
    const today = new Date().toISOString().split('T')[0];
    return (med.history || []).filter(h => h.time.startsWith(today)).length;
  },

  /* هل فات وقت الجرعة؟ */
  isOverdue(id) {
    const med = this.list().find(m => m.id === id);
    if (!med || !med.frequency) return false;
    const todayDoses = this.todayDoses(id);
    const expectedToday = med.dosesPerDay || 1;
    return todayDoses < expectedToday && new Date().getHours() >= 18;
  },

  /* الأدوية النشطة */
  active() {
    const now = new Date();
    return this.list().filter(m => {
      if (!m.endDate) return true;
      return new Date(m.endDate) >= now;
    });
  },
};

window.ommyAddMed = function() {
  if (!window.showModal) return;
  window.showModal({
    type: 'question',
    title: '💊 اسم الدواء',
    message: 'اكتبي اسم الدواء',
    input: true,
    inputPlaceholder: 'مثال: فيتامين د',
    confirmText: 'التالي',
    cancelText: 'إلغاء',
    onConfirm: async (name) => {
      if (!name) return;
      const dose = await window.ommyPrompt('الجرعة', 'مثال: 5 مل', '5 مل');
      if (!dose) return;
      const dosesPerDay = await window.ommyPrompt('عدد الجرعات يومياً', 'مثال: 2', '2');
      if (!dosesPerDay) return;

      Medications.add({
        name,
        dose,
        dosesPerDay: parseInt(dosesPerDay) || 1,
      });
      if (window.toast) window.toast('💊 تمت الإضافة', { type: 'success' });
      if (window.ommyRefresh) window.ommyRefresh();
    },
  });
};

window.ommyLogMed = function(id) {
  Medications.logDose(id);
  if (window.haptic) window.haptic('medium');
  if (window.toast) window.toast('✅ تم تسجيل الجرعة', { type: 'success' });
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommyDeleteMed = function(id) {
  if (!window.ommyConfirm) return;
  window.ommyConfirm('حذف الدواء؟', 'سيتم مسح كل السجل', { danger: true, confirmText: 'احذفي' })
    .then(ok => {
      if (!ok) return;
      Medications.remove(id);
      if (window.toast) window.toast('🗑️ تم الحذف', { type: 'success' });
      if (window.ommyRefresh) window.ommyRefresh();
    });
};
