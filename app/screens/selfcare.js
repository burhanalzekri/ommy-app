/* ============================================
   شاشة العناية بالأم
   ============================================ */
import { MomSelfCare } from '../lib/content2.js';

export function SelfCareScreen() {
  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#14B8A6 0%,#0F766E 60%,#134E4A 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:22px;box-shadow:0 20px 45px rgba(20,184,166,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">🌸</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">العناية بك</div>
              <div style="font-size:0.78rem;opacity:.92;margin-top:3px">الأم السعيدة = طفل سعيد</div>
            </div>
          </div>
        </div>
      </div>

      ${sectionHeader('🌸', 'نصائح للعناية بنفسك', '#14B8A6')}

      ${MomSelfCare.map(t => `
        <div style="display:flex;gap:14px;align-items:center;background:var(--cream);border:1.5px solid var(--line);border-radius:16px;padding:14px;margin-bottom:10px">
          <span style="width:52px;height:52px;border-radius:16px;background:linear-gradient(145deg,#CCFBF1,#99F6E4);display:grid;place-items:center;font-size:1.5rem;flex-shrink:0;border:1px solid #5EEAD4">${t.icon}</span>
          <div style="flex:1;text-align:start">
            <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:#0F766E;margin-bottom:3px">${t.title}</div>
            <div style="font-size:0.74rem;color:var(--ink-3);line-height:1.5">${t.desc}</div>
          </div>
        </div>
      `).join('')}

      ${sectionHeader('💗', 'رسالة لك')}
      <div style="background:linear-gradient(135deg,#CCFBF1,#99F6E4);border:1.5px solid #5EEAD4;border-radius:18px;padding:20px;text-align:center;margin-bottom:20px">
        <div style="font-size:2.5rem;margin-bottom:10px">💗</div>
        <div style="font-family:var(--font-heading);font-size:1rem;font-weight:900;color:#0F766E;margin-bottom:10px">أنتِ كافية 🌸</div>
        <p style="font-size:0.85rem;color:#134E4A;line-height:1.9;margin:0;text-align:start">
          عزيزتي الأم، لا تنسي أن تعتني بنفسك أيضاً. صحتك النفسية والجسدية أساس صحة طفلك.
          <br><br>
          لا تشعري بالذنب إذا أخذتِ وقتاً لنفسك — أنتِ تستحقينه، وطفلك يستفيد من أم مرتاحة وسعيدة.
        </p>
      </div>
    </div>
  `;
}

function sectionHeader(icon, title, color) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,${color},transparent);border-radius:2px"></span></div>`;
}
