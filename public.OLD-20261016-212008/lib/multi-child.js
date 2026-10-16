/* ============================================
   Multi-Child — إدارة أطفال متعددين
   ============================================ */
import { Storage } from './storage.js';
import { Children } from './settings.js';

export const MultiChild = {
  /* الطفل النشط حالياً */
  active() {
    return Children.active();
  },

  /* قائمة الأطفال */
  all() {
    return Children.list();
  },

  /* تبديل سريع */
  switchTo(id) {
    const kids = this.all();
    const target = kids.find(k => k.id === id);
    if (!target) return false;
    Children.setActive(id);
    if (window.haptic) window.haptic('light');
    if (window.toast) {
      window.toast(`👶 ${target.name}`, {
        type: 'success',
        icon: target.gender === 'girl' ? '👧' : '👶',
        duration: 1500,
      });
    }
    return true;
  },

  /* عدد الأطفال */
  count() {
    return this.all().length;
  },

  /* هل هناك أكثر من طفل؟ */
  hasMultiple() {
    return this.count() > 1;
  },
};

window.ommySwitchChild = function(id) {
  if (MultiChild.switchTo(id)) {
    if (window.ommyRefresh) window.ommyRefresh();
  }
};

window.ommyChildPicker = function() {
  const kids = MultiChild.all();
  if (kids.length <= 1) {
    if (window.toast) window.toast('طفل واحد فقط — أضيفي آخر من الإعدادات', { type: 'info' });
    return;
  }

  const current = MultiChild.active();
  const options = kids.map(k =>
    `<button onclick="ommySwitchChild('${k.id}');ommyCloseModal&&ommyCloseModal();" type="button" style="width:100%;padding:12px;border:1.5px solid ${k.id === current?.id ? 'var(--rose)' : 'var(--line)'};background:${k.id === current?.id ? 'var(--rose-soft)' : 'var(--cream)'};border-radius:14px;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:12px;font-family:var(--font-body);text-align:start">
      <span style="width:36px;height:36px;border-radius:50%;background:var(--rose-soft);display:grid;place-items:center;font-size:1.2rem;flex-shrink:0">${k.gender === 'girl' ? '👧' : '👶'}</span>
      <div style="flex:1;min-width:0">
        <b style="display:block;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--ink)">${k.name}</b>
        <span style="display:block;font-size:0.72rem;color:var(--ink-3);margin-top:2px">${k.birthDate || 'تاريخ غير محدد'}</span>
      </div>
      ${k.id === current?.id ? '<span style="color:var(--clay-deep);font-weight:900;font-size:0.9rem">✓</span>' : ''}
    </button>`
  ).join('');

  if (window.showModal) {
    window.showModal({
      type: 'question',
      title: '👶 اختاري الطفل',
      message: `<div style="text-align:start">${options}</div>`,
      confirmText: 'إغلاق',
      cancelText: '➕ إضافة طفل',
      onCancel: () => {
        if (window.navigate) window.navigate('settings');
      },
    });
  }
};
