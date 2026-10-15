/* ============================================
   شاشة إدارة الأطفال — كاملة
   ============================================ */
import { ChildManager } from '../lib/children.js';

export function ChildrenScreen() {
  const kids = ChildManager.all();
  const active = ChildManager.active();

  return `
    <div style="grid-column:1/-1;width:100%;max-width:800px;margin:0 auto">

      <!-- رأس الصفحة -->
      <div style="background:linear-gradient(135deg,var(--rose),var(--clay-deep));
        border-radius:24px;padding:24px 20px;color:#fff;margin-bottom:20px;
        position:relative;overflow:hidden;box-shadow:0 20px 45px rgba(198,93,123,.3)">
        <div style="position:absolute;inset-inline-end:-60px;top:-60px;width:180px;height:180px;
          border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.25),transparent 70%)"></div>

        <div style="position:relative;z-index:1">
          <div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:900;margin-bottom:6px">
            👨‍👩‍👧 عائلتي
          </div>
          <div style="font-size:0.85rem;opacity:.9">
            ${kids.length === 0 ? 'أضيفي طفلك الأول' : `${kids.length} ${kids.length === 1 ? 'طفل' : 'أطفال'}`}
          </div>
        </div>
      </div>

      <!-- قائمة الأطفال -->
      ${kids.length === 0 ? `
        <div style="text-align:center;padding:40px 20px;background:var(--cream);border-radius:24px;
          border:2px dashed var(--line)">
          <div style="font-size:3rem;margin-bottom:12px">👶</div>
          <div style="font-family:var(--font-heading);font-weight:900;font-size:1rem;
            color:var(--ink);margin-bottom:8px">لا يوجد أطفال بعد</div>
          <div style="font-size:0.8rem;color:var(--ink-3);margin-bottom:20px">
            أضيفي طفلك الأول لتبدأي رحلة أُمّي
          </div>
          <button onclick="ommyOpenAddChildForm()" type="button"
            style="padding:14px 28px;border-radius:100px;border:none;cursor:pointer;
            background:linear-gradient(135deg,var(--rose),var(--clay-deep));color:#fff;
            font-family:var(--font-heading);font-weight:900;font-size:0.9rem;
            box-shadow:0 8px 20px rgba(198,93,123,.35)">
            ➕ إضافة طفل جديد
          </button>
        </div>
      ` : kids.map(k => renderChildCard(k, active)).join('')}

      ${kids.length > 0 ? `
        <button onclick="ommyOpenAddChildForm()" type="button"
          style="width:100%;padding:16px;border:2px dashed var(--rose);background:transparent;
          border-radius:18px;cursor:pointer;font-family:var(--font-heading);font-weight:900;
          font-size:0.9rem;color:var(--clay-deep);margin-bottom:16px;
          display:flex;align-items:center;justify-content:center;gap:8px">
          ➕ إضافة طفل جديد
        </button>
      ` : ''}

    </div>
  `;
}

function renderChildCard(k, active) {
  const age = k.birthDate ? ChildManager.preciseAge(k.birthDate) : null;
  const isActive = k.id === active?.id;
  const genderIcon = k.gender === 'girl' ? '👧' : '👶';
  const genderGrad = k.gender === 'girl'
    ? 'linear-gradient(145deg,#f7a8c0,#c65d7b)'
    : 'linear-gradient(145deg,#7ec8e3,#4a90b8)';

  return `
    <div style="background:var(--cream);border:2px solid ${isActive ? 'var(--rose)' : 'var(--line)'};
      border-radius:22px;padding:18px;margin-bottom:14px;position:relative;overflow:hidden;
      transition:all .2s">

      ${isActive ? `
        <div style="position:absolute;top:0;inset-inline-end:0;background:var(--clay-deep);
          color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.65rem;
          padding:5px 14px;border-end-start-radius:14px">
          ✓ نشط الآن
        </div>
      ` : ''}

      <!-- الرأس -->
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
        <div style="width:60px;height:60px;border-radius:18px;background:${genderGrad};
          color:#fff;display:grid;place-items:center;font-size:2rem;flex-shrink:0;
          box-shadow:0 6px 16px rgba(0,0,0,.15)">
          ${genderIcon}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--font-heading);font-weight:900;font-size:1.1rem;
            color:var(--ink);margin-bottom:4px">${k.name}</div>
          <div style="font-size:0.78rem;color:var(--ink-3)">
            ${age ? '🎂 ' + age.label : '📅 تاريخ غير محدد'}
          </div>
        </div>
      </div>

      <!-- تفاصيل -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px">
        <div style="background:var(--rose-soft);padding:10px;border-radius:12px">
          <div style="font-size:0.65rem;color:var(--ink-3);margin-bottom:3px">📅 الميلاد</div>
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.75rem;
            color:var(--clay-deep)">${k.birthDate || '—'}</div>
        </div>
        <div style="background:var(--lavender-soft);padding:10px;border-radius:12px">
          <div style="font-size:0.65rem;color:var(--ink-3);margin-bottom:3px">⚧ الجنس</div>
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.75rem;
            color:var(--ink)">${k.gender === 'girl' ? '👧 بنت' : '👶 ولد'}</div>
        </div>
        ${k.weight ? `
          <div style="background:#dff3fa;padding:10px;border-radius:12px">
            <div style="font-size:0.65rem;color:var(--ink-3);margin-bottom:3px">⚖️ الوزن</div>
            <div style="font-family:var(--font-heading);font-weight:900;font-size:0.75rem;
              color:var(--ink)">${k.weight} كجم</div>
          </div>
        ` : ''}
        ${k.height ? `
          <div style="background:#e8f5e9;padding:10px;border-radius:12px">
            <div style="font-size:0.65rem;color:var(--ink-3);margin-bottom:3px">📏 الطول</div>
            <div style="font-family:var(--font-heading);font-weight:900;font-size:0.75rem;
              color:var(--ink)">${k.height} سم</div>
          </div>
        ` : ''}
      </div>

      <!-- أزرار -->
      <div style="display:grid;grid-template-columns:${isActive ? '1fr 1fr' : '1fr 1fr 1fr'};gap:8px">
        ${!isActive ? `
          <button onclick="ommySwitchChildFromScreen('${k.id}')" type="button"
            style="padding:11px;border:none;border-radius:12px;cursor:pointer;
            background:linear-gradient(135deg,var(--rose),var(--clay-deep));color:#fff;
            font-family:var(--font-heading);font-weight:900;font-size:0.78rem;
            display:flex;align-items:center;justify-content:center;gap:4px">
            🔄 تبديل
          </button>
        ` : ''}
        <button onclick="ommyEditChildForm('${k.id}')" type="button"
          style="padding:11px;border:1.5px solid var(--line);border-radius:12px;cursor:pointer;
          background:var(--sand);color:var(--ink);
          font-family:var(--font-heading);font-weight:900;font-size:0.78rem;
          display:flex;align-items:center;justify-content:center;gap:4px">
          ✏️ تعديل
        </button>
        ${ChildManager.all().length > 1 ? `
          <button onclick="ommyDeleteChildFromScreen('${k.id}', '${k.name}')" type="button"
            style="padding:11px;border:1.5px solid var(--red);border-radius:12px;cursor:pointer;
            background:var(--red-soft);color:var(--red-deep);
            font-family:var(--font-heading);font-weight:900;font-size:0.78rem;
            display:flex;align-items:center;justify-content:center;gap:4px">
            🗑️ حذف
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

window.ommySwitchChildFromScreen = function(id) {
  const res = ChildManager.switchTo(id);
  if (res.error) {
    if (window.toast) window.toast(res.error, { type: 'error' });
    return;
  }
  if (window.haptic) window.haptic('success');
  if (window.ommySound?.success) window.ommySound.success();
  if (window.toast) window.toast('✅ ' + res.child.name + ' نشط الآن', { type: 'success', duration: 1800 });
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommyDeleteChildFromScreen = function(id, name) {
  if (window.ommyConfirm) {
    window.ommyConfirm('حذف ' + name + '؟', 'سيتم حذف كل البيانات المرتبطة به', {
      danger: true, confirmText: 'احذفي', cancelText: 'إلغاء'
    }).then(ok => {
      if (!ok) return;
      const res = ChildManager.remove(id);
      if (res.error) {
        if (window.toast) window.toast(res.error, { type: 'warning' });
        return;
      }
      if (window.toast) window.toast('🗑️ تم الحذف', { type: 'success' });
      if (window.ommyRefresh) window.ommyRefresh();
    });
  }
};
