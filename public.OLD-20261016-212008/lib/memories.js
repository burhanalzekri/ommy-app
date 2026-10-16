/* ============================================
   مذكرة الأم — لحظات لا تُنسى
   ============================================ */
import { Storage } from './storage.js';

export const Memories = {
  list() {
    return Storage.get('memories', []);
  },

  add(memory) {
    const all = this.list();
    memory.id = 'mem_' + Date.now();
    memory.date = memory.date || new Date().toISOString();
    all.unshift(memory);
    Storage.set('memories', all);
    return memory;
  },

  update(id, updates) {
    const all = this.list();
    const idx = all.findIndex(m => m.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updates };
      Storage.set('memories', all);
      return all[idx];
    }
    return null;
  },

  remove(id) {
    const all = this.list().filter(m => m.id !== id);
    Storage.set('memories', all);
  },

  milestones: [
    { icon: '💗', title: 'أول ضحكة' },
    { icon: '👣', title: 'أول خطوة' },
    { icon: '💬', title: 'أول كلمة' },
    { icon: '🦷', title: 'أول سن' },
    { icon: '🍽️', title: 'أول طعام' },
    { icon: '🚶', title: 'أول مشي' },
    { icon: '🛁', title: 'أول حمام' },
    { icon: '🎂', title: 'أول عيد ميلاد' },
    { icon: '📖', title: 'أول قصة' },
    { icon: '🎨', title: 'أول رسمة' },
    { icon: '🌙', title: 'أول نوم كامل' },
    { icon: '🎤', title: 'أول أغنية' },
  ],

  count() {
    return this.list().length;
  },
};

window.ommyAddMemory = function(icon, title) {
  if (!window.showModal) return;
  window.showModal({
    type: 'question',
    title: icon + ' ' + title,
    message: 'أضيفي تفاصيل هذه اللحظة الجميلة',
    input: true,
    inputPlaceholder: 'مثال: ضحك لأول مرة عندما رآني',
    confirmText: 'احفظي',
    cancelText: 'إلغاء',
    onConfirm: (text) => {
      if (!text) return;
      Memories.add({ icon, title, text });
      if (window.toast) window.toast('💝 تم حفظ اللحظة', { type: 'success' });
      if (window.ommyRefresh) window.ommyRefresh();
    },
  });
};
