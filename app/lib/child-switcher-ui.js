/* ============================================
   واجهة تبديل الأطفال — محسّنة
   ============================================ */
import { ChildManager } from './children.js';

export function openSwitcherModal() {
  const kids = ChildManager.all();
  const active = ChildManager.active();

  if (kids.length === 0) {
    if (window.toast) window.toast('لا يوجد أطفال', { type: 'warning' });
    return;
  }

  const cards = kids.map(k => {
    const age = k.birthDate ? ChildManager.preciseAge(k.birthDate) : null;
    const isActive = k.id === active?.id;
    const genderIcon = k.gender === 'girl' ? '👧' : '👶';
    const genderGrad = k.gender === 'girl'
      ? 'linear-gradient(145deg,#f7a8c0,#c65d7b)'
      : 'linear-gradient(145deg,#7ec8e3,#4a90b8)';

    return `
      <button onclick="ommyPickChild('${k.id}')" type="button"
        style="width:100%;padding:14px;border:2px solid ${isActive ? 'var(--rose)' : 'var(--line)'};
        background:${isActive ? 'linear-gradient(135deg,var(--rose-soft),var(--lavender-soft))' : 'var(--cream)'};
        border-radius:18px;margin-bottom:10px;cursor:pointer;display:flex;align-items:center;gap:12px;
        font-family:var(--font-body);text-align:start;transition:all .2s;position:relative;overflow:hidden">

        <div style="width:50px;height:50px;border-radius:15px;background:${genderGrad};
          color:#fff;display:grid;place-items:center;font-size:1.6rem;flex-shrink:0;
          box-shadow:0 4px 12px rgba(0,0,0,.12)">${genderIcon}</div>

        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
            <span style="font-family:var(--font-heading);font-weight:900;font-size:0.95rem;color:var(--ink)">${k.name}</span>
            ${isActive ? '<span style="font-size:0.55rem;font-weight:900;color:#fff;background:var(--clay-deep);padding:2px 7px;border-radius:100px">نشط</span>' : ''}
          </div>
          <div style="font-size:0.72rem;color:var(--ink-3);line-height:1.4">
            ${age ? `🎂 ${age.label}` : '📅 تاريخ غير محدد'}
          </div>
          ${k.weight ? `<div style="font-size:0.68rem;color:var(--ink-3);margin-top:2px">⚖️ ${k.weight} كجم${k.height ? ' · 📏 ' + k.height + ' سم' : ''}</div>` : ''}
        </div>

        ${isActive ? '<span style="color:var(--clay-deep);font-weight:900;font-size:1.2rem">✓</span>' : '<span style="color:var(--ink-3);font-size:1.2rem">›</span>'}
      </button>
    `;
  }).join('');

  if (window.showModal) {
    window.showModal({
      type: 'question',
      title: `👨‍👩‍👧 عائلتك (${kids.length})`,
      message: `
        <div style="text-align:start;max-height:60vh;overflow-y:auto;padding:2px">
          ${cards}
          <button onclick="ommyCloseModal&&ommyCloseModal();setTimeout(ommyOpenAddChildForm,150)" type="button"
            style="width:100%;padding:14px;border:2px dashed var(--rose);background:transparent;
            border-radius:16px;margin-top:6px;cursor:pointer;font-family:var(--font-heading);
            font-weight:900;font-size:0.85rem;color:var(--clay-deep);display:flex;align-items:center;
            justify-content:center;gap:6px">
            ➕ إضافة طفل جديد
          </button>
        </div>
      `,
      confirmText: 'إغلاق',
      cancelText: '',
    });
  }
}

window.ommyPickChild = function(id) {
  const res = ChildManager.switchTo(id);
  if (res.error) {
    if (window.toast) window.toast(res.error, { type: 'error' });
    return;
  }

  if (window.haptic) window.haptic('success');
  if (window.ommySound?.success) window.ommySound.success();

  /* إغلاق النافذة */
  if (window.ommyCloseModal) window.ommyCloseModal();

  /* تأثير انتقالي */
  document.body.style.transition = 'opacity .2s';
  document.body.style.opacity = '0.7';
  setTimeout(() => {
    document.body.style.opacity = '1';
    if (window.ommyRefresh) window.ommyRefresh();
    setTimeout(() => { document.body.style.transition = ''; }, 300);
  }, 200);

  if (window.toast) {
    window.toast(`✅ ${res.child.name} نشط الآن`, { type: 'success', duration: 1800 });
  }
};

window.ommyOpenChildSwitcher = openSwitcherModal;
