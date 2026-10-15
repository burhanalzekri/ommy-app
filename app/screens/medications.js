/* ============================================
   شاشة الأدوية
   ============================================ */
import { Medications } from '../lib/medications.js';

export function MedicationsScreen() {
  const meds = Medications.active();

  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#E57070 0%,#B83B3B 60%,#8B2020 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:22px;box-shadow:0 20px 45px rgba(220,38,38,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">💊</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">الأدوية</div>
              <div style="font-size:0.78rem;opacity:.92;margin-top:3px">${meds.length} دواء نشط</div>
            </div>
          </div>
        </div>
      </div>

      <button onclick="ommyAddMed()" type="button" style="width:100%;padding:16px;border:2px dashed #F5C8C8;border-radius:16px;background:#FDF5F5;color:#B91C1C;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer;margin-bottom:20px">➕ إضافة دواء جديد</button>

      ${meds.length === 0 ? `
        <div style="background:var(--cream);border:1.5px dashed var(--line);border-radius:18px;padding:40px 20px;text-align:center">
          <div style="font-size:3rem;margin-bottom:12px">💊</div>
          <div style="font-family:var(--font-heading);font-size:1rem;font-weight:900;color:var(--ink-2);margin-bottom:6px">لا توجد أدوية</div>
          <div style="font-size:0.78rem;color:var(--ink-3);line-height:1.6">أضيفي دواء طفلك لتتابعي جرعاته</div>
        </div>
      ` : meds.map(m => medCard(m)).join('')}
    </div>
  `;
}

function medCard(m) {
  const todayDoses = Medications.todayDoses(m.id);
  const expected = m.dosesPerDay || 1;
  const progress = Math.min((todayDoses / expected) * 100, 100);
  const isComplete = todayDoses >= expected;

  return `
    <div style="background:var(--cream);border:1.5px solid ${isComplete ? '#F5C8D5' : '#F5C8C8'};border-radius:18px;padding:16px;margin-bottom:12px;position:relative">
      <button onclick="ommyDeleteMed('${m.id}')" type="button" style="position:absolute;top:12px;inset-inline-end:12px;width:28px;height:28px;border-radius:50%;background:var(--red-soft);color:#E57070;border:none;cursor:pointer;font-size:0.85rem;display:grid;place-items:center">✕</button>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <span style="width:52px;height:52px;border-radius:16px;background:linear-gradient(145deg,#FDEEEE,#FECACA);display:grid;place-items:center;font-size:1.6rem;flex-shrink:0">💊</span>
        <div style="flex:1;min-width:0;padding-inline-end:32px">
          <div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;color:#B91C1C;margin-bottom:4px">${m.name}</div>
          <div style="font-size:0.78rem;color:var(--ink-3);margin-bottom:8px">
            ${m.dose} · ${expected} مرة/يوم
          </div>
          <div style="height:6px;background:var(--beige);border-radius:100px;overflow:hidden;margin-bottom:8px">
            <div style="height:100%;width:${progress}%;background:${isComplete ? 'linear-gradient(90deg,#E8A3B6,#D9829A)' : 'linear-gradient(90deg,#F0A0A0,#E57070)'};border-radius:100px;transition:width .4s"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:0.72rem;color:var(--ink-3)">اليوم: <b style="color:${isComplete ? '#B94F70' : '#E57070'}">${todayDoses}/${expected}</b></span>
            <button onclick="ommyLogMed('${m.id}')" type="button" style="padding:6px 14px;border:none;border-radius:100px;background:linear-gradient(145deg,#D9829A,#B94F70);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.72rem;cursor:pointer">+ جرعة</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
