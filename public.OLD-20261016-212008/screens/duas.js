/* ============================================
   شاشة الأدعية والأذكار
   ============================================ */
import { Duas } from '../lib/content2.js';
import { Voice, SoundFX } from '../lib/audio.js';

window.ommyDua = function(index) {
  const d = Duas[index];
  if (!d || !window.showModal) return;
  window.showModal({
    type: 'success',
    title: '🤲 ' + d.title,
    message: `
      <div style="text-align:center;font-size:1.05rem;line-height:2.2;font-weight:600;color:#B94F70;padding:12px;background:#F2F9F4;border-radius:14px">
        ${d.text}
      </div>
      <div style="text-align:center;margin-top:12px;font-size:0.75rem;color:var(--ink-3)">
        يمكنك تكرارها مع طفلك يومياً
      </div>
      <button onclick="ommySpeak('${d.text.replace(/'/g, "\\'")}')" type="button" style="width:100%;margin-top:14px;padding:12px;border:none;border-radius:12px;background:linear-gradient(145deg,#C65D7B,#B94F70);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">🔊 اقرأ الدعاء بصوت</button>
    `,
    confirmText: 'آمين',
    cancelText: 'إغلاق',
  });
  if (window.ommySound && window.ommySound.success) window.ommySound.success();
  if (window.haptic) window.haptic('light');
};

export function DuasScreen() {
  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#C65D7B 0%,#B94F70 60%,#8B3D5A 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:22px;box-shadow:0 20px 45px rgba(5,150,105,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">🤲</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">أدعية وأذكار</div>
              <div style="font-size:0.78rem;opacity:.92;margin-top:3px">تحصين طفلك بكلمات الله</div>
            </div>
          </div>
        </div>
      </div>

      ${sectionHeader('🤲', 'أدعية يومية', '#C65D7B')}

      ${Duas.map((d, i) => `
        <button onclick="ommyDua(${i})" type="button" style="width:100%;background:linear-gradient(135deg,#FDF6F8,#FDF0F3);border:1.5px solid #D5EAD9;border-radius:18px;padding:16px;margin-bottom:10px;cursor:pointer;text-align:start;font-family:var(--font-body);transition:all .25s">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:#B94F70">🤲 ${d.title}</span>
            <span style="font-size:0.75rem;color:#C65D7B">اضغط للقراءة</span>
          </div>
          <div style="font-size:0.86rem;color:#8B3D5A;line-height:1.8;font-weight:500;text-align:center;padding:8px;background:rgba(255,255,255,.6);border-radius:12px">
            ${d.text}
          </div>
        </button>
      `).join('')}

      <div style="background:linear-gradient(135deg,#F2F9F4,#F8DFE6);border:1.5px solid #B8DFC7;border-radius:18px;padding:20px;text-align:center;margin-bottom:20px">
        <div style="font-size:2rem;margin-bottom:8px">📿</div>
        <div style="font-family:var(--font-heading);font-size:0.95rem;font-weight:900;color:#B94F70;margin-bottom:6px">أذكار الصباح والمساء</div>
        <p style="font-size:0.78rem;color:#8B3D5A;line-height:1.7;margin:0">
          خصصي 5 دقائق كل صباح ومساء لقراءتها مع طفلك — تحصّنه وتقرّبكما من الله
        </p>
      </div>
    </div>
  `;
}

function sectionHeader(icon, title, color) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,${color},transparent);border-radius:2px"></span></div>`;
}
