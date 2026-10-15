/* ============================================
   شاشة الإسعافات — ديناميكية من content.js
   ============================================ */

import { FirstAidScenarios } from '../lib/content.js';

window.ommyEmergencyInfo = function() {
  if (!window.showModal) {
    window.toast?.('إذا كانت الحالة طارئة فاتصلي بخدمات الطوارئ المحلية فورًا.', { type: 'error' });
    return;
  }
  window.showModal({
    type: 'error',
    title: '🚨 حالة طارئة',
    message: 'إذا كان الطفل لا يتنفس بشكل طبيعي، أو يعاني تشنجًا، أو يصعب إيقاظه، أو تظهر عليه علامات خطرة، فاتصلي بخدمات الطوارئ المحلية فورًا. لا تنتظري رد التطبيق. رقم الطوارئ يختلف حسب البلد ويحتاج إلى ضبط محلي موثوق.',
    confirmText: 'فهمت',
    cancelText: 'إغلاق'
  });
};

window.ommyFA = function(tile) {
  const id = tile.dataset.fa;
  const scenario = FirstAidScenarios.find(s => s.id === id);
  if (!scenario || !window.showModal) return;

  const stepsHtml = scenario.steps.map((s, i) => `
    <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px;text-align:start">
      <span style="width:28px;height:28px;border-radius:50%;background:linear-gradient(145deg,#E57070,#B83B3B);color:#fff;display:grid;place-items:center;font-family:var(--font-heading);font-weight:900;font-size:0.8rem;flex-shrink:0;margin-top:2px">${i+1}</span>
      <span style="font-size:0.86rem;line-height:1.7;flex:1">${s}</span>
    </div>
  `).join('');

  window.showModal({
    type: 'error',
    title: scenario.icon + ' ' + scenario.title,
    message: stepsHtml,
    confirmText: 'فهمت',
    cancelText: 'إغلاق',
  });

  if (window.haptic) window.haptic('medium');
};

export function FirstAidScreen() {
  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#E57070 0%,#B83B3B 60%,#8B2020 100%);border-radius:22px;padding:20px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 40px rgba(220,38,38,.4)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.25),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">🚨</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">حالة طارئة؟</div>
              <div style="font-size:0.78rem;opacity:.9;margin-top:3px">اتصلي بخدمات الطوارئ المحلية أولاً</div>
            </div>
          </div>
          <button onclick="ommyEmergencyInfo()" type="button" style="width:100%;background:#fff;color:#E57070;border-radius:14px;padding:14px;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer;border:none;box-shadow:0 8px 20px rgba(0,0,0,.2)">🚨 إرشادات عند الطوارئ</button>
        </div>
      </div>

      ${sectionHeader('⚕️', 'اختر الحالة')}

      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px">
        ${FirstAidScenarios.map(s => `
          <button class="fa-tile" data-fa="${s.id}" onclick="ommyFA(this)" type="button" style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px 12px;text-align:center;cursor:pointer;transition:all .25s;font-family:var(--font-body);box-shadow:0 2px 8px rgba(220,38,38,.05)">
            <span style="font-size:1.7rem;display:block;margin-bottom:6px">${s.icon}</span>
            <b style="font-family:var(--font-heading);font-size:0.82rem;font-weight:900;color:var(--ink);display:block">${s.title}</b>
            <span style="font-size:0.68rem;color:var(--ink-3);display:block;margin-top:3px">${s.subtitle}</span>
          </button>
        `).join('')}
      </div>

      <div style="background:linear-gradient(135deg,#FDF5F5,#FDEEEE);border:1.5px solid #F5C8C8;border-radius:18px;padding:16px;margin-bottom:16px;display:flex;gap:12px">
        <span style="font-size:1.5rem;flex-shrink:0">💡</span>
        <div>
          <div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:#B91C1C;margin-bottom:4px">نصيحة مهمة</div>
          <p style="font-size:0.78rem;color:#8B2020;line-height:1.7;margin:0">اضغطي على أي حالة لعرض الخطوات التفصيلية.</p>
        </div>
      </div>

      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px">
        <div style="font-family:var(--font-heading);font-size:0.86rem;font-weight:900;margin-bottom:8px;display:flex;align-items:center;gap:8px">📱 رقم الطوارئ المحلي</div>
        <p style="font-size:0.78rem;color:var(--ink-2);line-height:1.8;margin:0">تختلف أرقام الإسعاف والطوارئ حسب البلد والمنطقة. تحققي من الرقم الرسمي المحلي واحفظيه في هاتفكِ قبل الحاجة إليه؛ لا يعتمد هذا الإصدار على رقم موحد غير متحقق منه.</p>
      </div>
    </div>
  `;
}

function sectionHeader(icon, title) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,#E57070,transparent);border-radius:2px"></span></div>`;
}
