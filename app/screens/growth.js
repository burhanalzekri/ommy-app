/* ============================================
   شاشة النمو — ديناميكية
   ============================================ */

import { BabyStore } from '../lib/storage.js';

window.ommyMetric = function(type) {
  const info = {
    weight: { title: '⚖️ الوزن', value: '10.2 كجم', range: '8.5 - 12.5', percentile: 'المئين 62', advice: 'الوزن ضمن النطاق الطبيعي لعمر 14 شهراً. حافظي على 3 وجبات + 2 سناك.' },
    height: { title: '📏 الطول', value: '78 سم', range: '73 - 82', percentile: 'المئين 55', advice: 'الطول يتطور بشكل ممتاز. لا تقلقي إذا بدا أبطأ من أقرانه — كل طفل وتيرته.' },
    head:   { title: '🧠 محيط الرأس', value: '46 سم', range: '44 - 48', percentile: 'المئين 58', advice: 'محيط الرأس طبيعي. يدل على نمو الدماغ الصحي.' },
  }[type];
  if (!info || !window.showModal) return;
  window.showModal({
    type: 'success',
    title: info.title,
    message: `
      <div style="text-align:start;font-size:0.88rem;line-height:1.9">
        <div style="font-family:var(--font-heading);font-size:1.6rem;font-weight:900;color:#5C8F72;text-align:center;margin-bottom:6px">${info.value}</div>
        <div style="text-align:center;margin-bottom:14px"><span style="background:#FDF0F3;color:#B94F70;padding:5px 14px;border-radius:100px;font-weight:900;font-size:0.75rem">${info.percentile}</span></div>
        <b style="color:#B94F70">📊 النطاق الطبيعي:</b> ${info.range}<br><br>
        <b style="color:#B94F70">💡 نصيحة:</b> ${info.advice}
      </div>
    `,
    confirmText: 'تم',
    cancelText: 'إغلاق',
  });
  if (window.haptic) window.haptic('light');
};

window.ommyAddMeasure = function() {
  if (!window.showModal) return;
  window.showModal({
    type: 'question',
    title: '➕ إضافة قياس جديد',
    message: 'سجّلي قياساً جديداً لـ آدم',
    input: true,
    inputPlaceholder: 'مثال: 10.5',
    inputType: 'number',
    confirmText: 'حفظ',
    cancelText: 'إلغاء',
    onConfirm: (val) => {
      if (!val || isNaN(parseFloat(val))) return;
      if (window.toast) window.toast('✅ تم حفظ القياس: ' + val + ' كجم', { type: 'success' });
    },
  });
};

export function GrowthScreen() {
  const baby = BabyStore.get();
  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#A8D5BA 0%,#5C8F72 60%,#3D5E48 100%);border-radius:22px;padding:20px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 40px rgba(20,184,166,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.25),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">📈</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">نمو ${baby.name} ممتاز</div>
              <div style="font-size:0.78rem;opacity:.9;margin-top:3px">آخر قياس: قبل 5 أيام</div>
            </div>
          </div>
          <span style="display:inline-block;font-size:0.72rem;background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.35);padding:6px 14px;border-radius:100px;font-weight:700">🎯 المئين 62 · ضمن الطبيعي</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
        ${metric('weight', '⚖️', '10.2', 'كجم', 'الوزن', 'مئين 62')}
        ${metric('height', '📏', '78', 'سم', 'الطول', 'مئين 55')}
        ${metric('head', '🧠', '46', 'سم', 'محيط الرأس', 'مئين 58')}
      </div>

      ${sectionHeader('📊', 'منحنى الطول')}

      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:20px;padding:18px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900">آخر 12 شهراً</div>
          <span style="font-size:0.68rem;font-weight:800;background:#EDF7F0;color:#5C8F72;padding:4px 11px;border-radius:100px">↗ نمو متوازن</span>
        </div>
        <svg viewBox="0 0 300 140" preserveAspectRatio="none" style="width:100%;height:auto">
          <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8D5BA" stop-opacity=".25"/><stop offset="1" stop-color="#A8D5BA" stop-opacity="0"/></linearGradient></defs>
          <path d="M0,105 Q40,95 80,88 Q120,80 160,68 Q200,58 240,48 L280,40 L280,130 L0,130 Z" fill="url(#area)"/>
          <path d="M0,105 Q40,95 80,88 Q120,80 160,68 Q200,58 240,48 L280,40" fill="none" stroke="#A8D5BA" stroke-width="3" stroke-linecap="round"/>
          <circle cx="40" cy="95" r="4" fill="#A8D5BA"/>
          <circle cx="80" cy="88" r="4" fill="#A8D5BA"/>
          <circle cx="120" cy="80" r="4" fill="#A8D5BA"/>
          <circle cx="160" cy="68" r="4" fill="#A8D5BA"/>
          <circle cx="200" cy="58" r="4" fill="#A8D5BA"/>
          <circle cx="240" cy="48" r="4" fill="#A8D5BA"/>
          <circle cx="280" cy="40" r="6" fill="#A8D5BA" stroke="#fff" stroke-width="3"/>
        </svg>
      </div>

      ${sectionHeader('✅', 'ملاحظات النمو')}

      <div style="background:linear-gradient(135deg,#F2F9F4,#F8DFE6);border:1.5px solid #B8DFC7;border-radius:18px;padding:16px;margin-bottom:12px">
        <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:#B94F70;margin-bottom:6px">✅ نمو متوازن</div>
        <p style="font-size:0.78rem;color:#8B3D5A;line-height:1.7;margin:0">الطول والوزن في نفس المئين تقريباً — نمو صحي دون قفزات.</p>
      </div>

      <div style="background:linear-gradient(135deg,#FDF3EB,#FBE5CE);border:1.5px solid #F8DCC0;border-radius:18px;padding:16px;margin-bottom:20px">
        <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:#A6653A;margin-bottom:6px">💡 نصيحة</div>
        <p style="font-size:0.78rem;color:#8B5A38;line-height:1.7;margin:0">سجّلي القياس كل 2–4 أسابيع بنفس الميزان والوقت.</p>
      </div>

      <button onclick="ommyAddMeasure()" type="button" style="width:100%;padding:14px;border:none;border-radius:16px;background:linear-gradient(145deg,#A8D5BA,#5C8F72);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer;box-shadow:0 12px 26px rgba(20,184,166,.35)">➕ إضافة قياس جديد</button>
    </div>
  `;
}

function sectionHeader(icon, title) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,#A8D5BA,transparent);border-radius:2px"></span></div>`;
}

function metric(type, icon, value, unit, label, percentile) {
  return `
    <button onclick="ommyMetric('${type}')" type="button" style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:14px 8px;text-align:center;cursor:pointer;font-family:var(--font-body);transition:all .2s">
      <div style="font-size:1.4rem;margin-bottom:6px">${icon}</div>
      <div style="font-family:var(--font-heading);font-weight:900;font-size:1.05rem;color:#5C8F72;line-height:1"><span style="font-size:1.4rem">${value}</span> <span style="font-size:0.7rem">${unit}</span></div>
      <div style="font-size:0.68rem;color:var(--ink-3);margin-top:4px;font-weight:600">${label}</div>
      <div style="font-size:0.62rem;color:#B94F70;font-weight:800;margin-top:3px">${percentile}</div>
    </button>
  `;
}
