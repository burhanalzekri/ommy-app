export function VaccinesScreen() {
  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#F59E0B 0%,#B45309 60%,#78350F 100%);border-radius:22px;padding:20px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 40px rgba(245,158,11,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.25),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">💉</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">القادم بعد 5 أيام</div>
              <div style="font-size:0.78rem;opacity:.9;margin-top:3px">الحصبة (MMR) · الجرعة الأولى</div>
            </div>
          </div>
          <button onclick="ommyToast && ommyToast('🔔 سيتم التذكير قبلها بيوم', '🔔')" type="button" style="width:100%;background:rgba(255,255,255,.25);border:1px solid rgba(255,255,255,.4);color:#fff;border-radius:14px;padding:12px;font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">🔔 ذكّريني قبلها بيوم</button>
        </div>
      </div>

      ${sectionHeader('📅', 'الخط الزمني · 0–18 شهراً', '#F59E0B')}

      <div style="position:relative;padding-inline-start:32px">
        <div style="position:absolute;inset-inline-start:11px;top:14px;bottom:14px;width:2px;background:var(--line);border-radius:2px"></div>
        ${tlItem('done', 'الجرعة الأولى (عند الولادة)', 'عند الولادة', 'BCG + التهاب الكبد B', '✓ تم', '#15803D', '#DCFCE7')}
        ${tlItem('done', 'الجرعة الثانية', 'شهران', 'شلل الأطفال + السعال الديكي + الكزاز', '✓ تم', '#15803D', '#DCFCE7')}
        ${tlItem('done', 'الجرعة الثالثة', '4 أشهر', 'الجرعة الروتينية الثالثة', '✓ تم', '#15803D', '#DCFCE7')}
        ${tlItem('done', 'الجرعة المنشّطة', '9 أشهر', 'الحصبة الألمانية + النكاف', '✓ تم', '#15803D', '#DCFCE7')}
        ${tlItem('next', 'تطعيم الحصبة (MMR)', '14 شهراً', 'الجرعة الأولى · بعد 5 أيام', '⏰ القادم', '#B45309', '#FEF3C7')}
        ${tlItem('later', 'الجرعة المنشّطة', '18 شهراً', 'شلل الأطفال + الثلاثي البكتيري', 'قادم لاحقاً', '#4B5563', '#E5E7EB')}
      </div>

      ${sectionHeader('📄', 'بطاقة التطعيم الرسمية', '#F59E0B')}

      <button onclick="ommyToast && ommyToast('📄 تحميل البطاقة PDF', '📄')" type="button" style="width:100%;padding:14px;border:none;border-radius:16px;background:linear-gradient(145deg,#F59E0B,#B45309);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer;box-shadow:0 12px 26px rgba(245,158,11,.35)">📄 تحميل البطاقة PDF</button>
    </div>
  `;
}

function sectionHeader(icon, title, color) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,${color},transparent);border-radius:2px"></span></div>`;
}

function tlItem(state, title, date, desc, badge, badgeColor, badgeBg) {
  const dotColors = { done: 'linear-gradient(145deg,#34D399,#10B981)', next: 'linear-gradient(145deg,#FBBF24,#F59E0B)', later: '#D1D5DB' };
  const shadow = state === 'next' ? 'box-shadow:0 0 0 5px rgba(245,158,11,.22);' : state === 'done' ? 'box-shadow:0 0 0 4px rgba(16,185,129,.15);' : '';
  return `
    <div style="position:relative;margin-bottom:14px">
      <span style="position:absolute;inset-inline-start:-27px;top:14px;width:14px;height:14px;border-radius:50%;background:${dotColors[state]};border:3px solid var(--sand);${shadow}"></span>
      <div style="background:var(--cream);border:1.5px solid ${state === 'next' ? '#FCD34D' : state === 'done' ? '#86EFAC' : 'var(--line)'};border-radius:16px;padding:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:5px">
          <b style="font-family:var(--font-heading);font-size:0.85rem;font-weight:900;line-height:1.3">${title}</b>
          <span style="font-family:var(--font-heading);font-size:0.7rem;font-weight:800;color:var(--ink-3);flex-shrink:0">${date}</span>
        </div>
        <p style="font-size:0.74rem;color:var(--ink-3);line-height:1.5;margin:0">${desc}</p>
        <span style="display:inline-block;margin-top:8px;font-size:0.68rem;font-weight:900;padding:4px 12px;border-radius:100px;background:${badgeBg};color:${badgeColor}">${badge}</span>
      </div>
    </div>
  `;
}
