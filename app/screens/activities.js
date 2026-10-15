/* ============================================
   شاشة الأنشطة التعليمية
   ============================================ */
import { Activities } from '../lib/content2.js';

window.ommyActivity = function(index) {
  const a = Activities[index];
  if (!a || !window.showModal) return;
  window.showModal({
    type: 'info',
    title: a.icon + ' ' + a.title,
    message: `
      <div style="text-align:start;font-size:0.88rem;line-height:1.9">
        <b style="color:#EC4899">👶 الفئة العمرية:</b> ${a.age}<br><br>
        <b style="color:#EC4899">💡 النشاط:</b><br>${a.desc}<br><br>
        <div style="background:#FCE7F3;padding:12px;border-radius:12px;font-size:0.82rem;color:#9F1239">
          💡 <b>نصيحة:</b> خصصي 10-15 دقيقة يومياً لهذا النشاط.
        </div>
      </div>
    `,
    confirmText: 'حسناً',
    cancelText: 'إغلاق',
  });
};

export function ActivitiesScreen() {
  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#EC4899 0%,#BE185D 60%,#831843 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:22px;box-shadow:0 20px 45px rgba(236,72,153,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">🎨</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">أنشطة تعليمية</div>
              <div style="font-size:0.78rem;opacity:.92;margin-top:3px">لعب + تعلّم + متعة</div>
            </div>
          </div>
        </div>
      </div>

      ${sectionHeader('🎨', 'أنشطة حسب العمر', '#EC4899')}

      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px">
        ${Activities.map((a, i) => `
          <button onclick="ommyActivity(${i})" type="button" style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:18px 10px;text-align:center;cursor:pointer;transition:all .25s;font-family:var(--font-body)">
            <div style="width:60px;height:60px;border-radius:18px;background:linear-gradient(145deg,#FCE7F3,#FBCFE8);display:grid;place-items:center;font-size:2rem;margin:0 auto 10px;border:1px solid #FBCFE8">${a.icon}</div>
            <div style="font-family:var(--font-heading);font-size:0.82rem;font-weight:900;color:#BE185D;margin-bottom:4px">${a.title}</div>
            <div style="font-size:0.68rem;color:var(--ink-3);line-height:1.4">${a.desc}</div>
            <div style="display:inline-block;margin-top:8px;font-size:0.62rem;font-weight:900;color:#9F1239;background:#FCE7F3;padding:3px 10px;border-radius:100px">${a.age}</div>
          </button>
        `).join('')}
      </div>

      <div style="background:linear-gradient(135deg,#FCE7F3,#FBCFE8);border:1.5px solid #F9A8D4;border-radius:18px;padding:16px;margin-bottom:20px;display:flex;gap:12px">
        <span style="font-size:1.5rem;flex-shrink:0">💡</span>
        <div>
          <div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:#9F1239;margin-bottom:4px">نصيحة ذهبية</div>
          <p style="font-size:0.78rem;color:#831843;line-height:1.7;margin:0">
            الأنشطة البسيطة في المنزل أقوى من الألعاب الغالية. 15 دقيقة مركّزة يومياً تصنع فرقاً هائلاً.
          </p>
        </div>
      </div>
    </div>
  `;
}

function sectionHeader(icon, title, color) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,${color},transparent);border-radius:2px"></span></div>`;
}
