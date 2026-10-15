/* ============================================
   شاشة السلامة — نصائح لحماية طفلك
   ============================================ */
import { SafetyTips, Warnings } from '../lib/content2.js';
import { Voice } from '../lib/audio.js';

export function SafetyScreen() {
  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#F97316 0%,#C2410C 60%,#7C2D12 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:22px;box-shadow:0 20px 45px rgba(249,115,22,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">🛡️</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">سلامة طفلك</div>
              <div style="font-size:0.78rem;opacity:.92;margin-top:3px">بيئة آمنة = طفل مطمئن</div>
            </div>
          </div>
        </div>
      </div>

      ${sectionHeader('🛡️', 'تدابير السلامة في المنزل', '#F97316')}
      ${SafetyTips.map(t => tipCard(t)).join('')}

      ${sectionHeader('⚠️', 'تحذيرات مهمة', '#E57070')}
      ${Warnings.map(w => warningCard(w)).join('')}

      <div style="background:linear-gradient(135deg,#FDF5F5,#FDEEEE);border:1.5px solid #F5C8C8;border-radius:18px;padding:16px;margin-bottom:20px;display:flex;gap:12px">
        <span style="font-size:1.5rem;flex-shrink:0">🚨</span>
        <div>
          <div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:#B91C1C;margin-bottom:4px">أرقام الطوارئ</div>
          <p style="font-size:0.78rem;color:#8B2020;line-height:1.7;margin:0">
            🚑 الإسعاف: <b>997</b><br>
            🚓 الشرطة: <b>999</b><br>
            🔥 الدفاع المدني: <b>998</b>
          </p>
        </div>
      </div>
    </div>
  `;
}

function sectionHeader(icon, title, color) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,${color},transparent);border-radius:2px"></span></div>`;
}

function tipCard(t) {
  return `
    <button onclick="ommySpeak('${t.title}. ${t.desc}')" type="button" style="width:100%;display:flex;gap:14px;align-items:center;background:var(--cream);border:1.5px solid var(--line);border-radius:16px;padding:14px;margin-bottom:10px;cursor:pointer;text-align:start;font-family:var(--font-body)">
      <span style="width:52px;height:52px;border-radius:16px;background:${t.color};display:grid;place-items:center;font-size:1.5rem;flex-shrink:0">${t.icon}</span>
      <div style="flex:1;text-align:start">
        <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:var(--ink);margin-bottom:3px">${t.title}</div>
        <div style="font-size:0.74rem;color:var(--ink-3);line-height:1.5">${t.desc}</div>
      </div>
      <span style="font-size:1rem;color:var(--ink-3)">🔊</span>
    </button>
  `;
}

function warningCard(w) {
  return `
    <div style="display:flex;gap:14px;align-items:center;background:linear-gradient(135deg,#FDF5F5,#FDEEEE);border:1.5px solid #F5C8C8;border-radius:16px;padding:14px;margin-bottom:10px">
      <span style="width:52px;height:52px;border-radius:16px;background:#fff;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0;border:1px solid #F5C8C8">${w.icon}</span>
      <div style="flex:1;text-align:start">
        <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:#B91C1C;margin-bottom:3px">${w.title}</div>
        <div style="font-size:0.74rem;color:#8B2020;line-height:1.5">${w.desc}</div>
      </div>
    </div>
  `;
}
