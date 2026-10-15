/* ============================================
   شاشة معالم التطور
   ============================================ */
import { GrowthMilestones } from '../lib/content2.js';

export function MilestonesScreen() {
  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#C65D7B 0%,#B94F70 60%,#8B3D5A 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:22px;box-shadow:0 20px 45px rgba(139,92,246,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">🌱</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">معالم التطور</div>
              <div style="font-size:0.78rem;opacity:.92;margin-top:3px">مراحل نمو طفلك خطوة بخطوة</div>
            </div>
          </div>
        </div>
      </div>

      ${sectionHeader('🌱', 'المراحل حسب العمر', '#C65D7B')}

      <div style="position:relative;padding-inline-start:32px">
        <div style="position:absolute;inset-inline-start:11px;top:14px;bottom:14px;width:2px;background:var(--line);border-radius:2px"></div>
        ${GrowthMilestones.map((m, i) => milestoneItem(m, i)).join('')}
      </div>
    </div>
  `;
}

function sectionHeader(icon, title, color) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,${color},transparent);border-radius:2px"></span></div>`;
}

function milestoneItem(m, i) {
  const colors = [
    { dot: 'linear-gradient(145deg,#F472B6,#DB2777)', bg: '#FCE7F3', border: '#FBCFE8' },
    { dot: 'linear-gradient(145deg,#E8A3B6,#D9829A)', bg: '#FDF0F3', border: '#F5D9E2' },
    { dot: 'linear-gradient(145deg,#60A5FA,#2563EB)', bg: '#F2EEFC', border: '#BFDBFE' },
    { dot: 'linear-gradient(145deg,#E8A3B6,#C65D7B)', bg: '#F8DFE6', border: '#D5EAD9' },
    { dot: 'linear-gradient(145deg,#F5D5B8,#C17A4A)', bg: '#FDF3EB', border: '#FBE5CE' },
    { dot: 'linear-gradient(145deg,#F0A0A0,#E57070)', bg: '#FDEEEE', border: '#FECACA' },
  ];
  const c = colors[i % colors.length];
  return `
    <div style="position:relative;margin-bottom:14px">
      <span style="position:absolute;inset-inline-start:-27px;top:16px;width:14px;height:14px;border-radius:50%;background:${c.dot};border:3px solid var(--sand);box-shadow:0 0 0 4px ${c.bg}"></span>
      <div style="background:var(--cream);border:1.5px solid ${c.border};border-radius:16px;padding:14px">
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:6px">
          <span style="width:44px;height:44px;border-radius:14px;background:${c.bg};display:grid;place-items:center;font-size:1.4rem;flex-shrink:0">${m.icon}</span>
          <div style="flex:1;text-align:start">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
              <span style="font-family:var(--font-heading);font-size:0.72rem;font-weight:900;color:#B94F70;background:#FDF0F3;padding:3px 9px;border-radius:100px">${m.age}</span>
            </div>
            <div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${m.title}</div>
          </div>
        </div>
        <p style="font-size:0.76rem;color:var(--ink-3);line-height:1.6;margin:0;padding-inline-start:56px">${m.desc}</p>
      </div>
    </div>
  `;
}
