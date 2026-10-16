/* ============================================
   شاشة الرضاعة الطبيعية
   ============================================ */
import { Breastfeeding } from '../lib/breastfeeding.js';

export function BreastfeedingScreen() {
  const info = Breastfeeding.sessionInfo();
  const rec = Breastfeeding.recommendSide();

  return `
    <div style="grid-column:1/-1;width:100%">

      <div class="card--hero span-full" style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <span style="width:56px;height:56px;border-radius:18px;background:rgba(255,255,255,.22);display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">🤱</span>
          <div>
            <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;color:#fff">الرضاعة الطبيعية</div>
            <div style="font-size:0.78rem;opacity:.9;margin-top:3px">تتبع اليسار واليمين بدقة</div>
          </div>
        </div>
      </div>

      ${info ? renderActiveSession(info) : renderStartScreen(rec)}
    </div>
  `;
}

function renderStartScreen(rec) {
  const sideLabel = rec.side === 'left' ? 'اليسرى' : 'اليمنى';
  return `
    <div class="card span-full" style="margin-bottom:16px">
      <div style="display:flex;gap:12px;align-items:center;padding:14px;background:linear-gradient(135deg,var(--rose-soft),var(--lavender-soft));border-radius:16px;margin-bottom:16px">
        <span style="font-size:1.6rem">💡</span>
        <div style="flex:1">
          <div style="font-size:0.72rem;font-weight:800;color:var(--ink-2);margin-bottom:2px">التوصية</div>
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--clay-deep)">ابدئي بـ${sideLabel}</div>
          <div style="font-size:0.68rem;color:var(--ink-3);margin-top:2px">${rec.reason}</div>
        </div>
      </div>

      <button onclick="ommyBfStart()" type="button" style="width:100%;padding:18px;border:none;border-radius:16px;background:linear-gradient(145deg,var(--rose),var(--clay-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:1rem;cursor:pointer;box-shadow:0 12px 32px rgba(198,93,123,.3)">
        🤱 ابدئي جلسة رضاعة
      </button>
    </div>
  `;
}

function renderActiveSession(info) {
  const fmt = window.ommyFormatDuration || (s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`);
  const sideLabel = info.currentSide === 'left' ? 'اليسرى' : info.currentSide === 'right' ? 'اليمنى' : 'متوقفة';

  return `
    <div class="card span-full" style="margin-bottom:16px">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:0.72rem;font-weight:800;color:var(--ink-3);margin-bottom:4px">الجهة الحالية</div>
        <div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:900;color:var(--clay-deep)">${sideLabel}</div>
        ${info.isActive ? `
          <div id="bfActiveTimer" style="font-family:Cairo,monospace;font-size:2.5rem;font-weight:900;color:var(--ink);letter-spacing:2px;margin-top:8px;font-variant-numeric:tabular-nums">${fmt(info.currentSegDuration)}</div>
        ` : `
          <div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:900;color:var(--ink-3);margin-top:8px">متوقفة مؤقتاً</div>
        `}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="text-align:center;padding:14px;background:var(--rose-soft);border-radius:14px">
          <div style="font-size:1.5rem;margin-bottom:4px">⬅️</div>
          <div style="font-family:var(--font-heading);font-weight:900;font-size:1rem;color:var(--clay-deep)">${fmt(info.leftTotal)}</div>
          <div style="font-size:0.65rem;color:var(--ink-3);font-weight:700;margin-top:2px">اليسرى</div>
        </div>
        <div style="text-align:center;padding:14px;background:var(--lavender-soft);border-radius:14px">
          <div style="font-size:1.5rem;margin-bottom:4px">➡️</div>
          <div style="font-family:var(--font-heading);font-weight:900;font-size:1rem;color:var(--lavender-deep)">${fmt(info.rightTotal)}</div>
          <div style="font-size:0.65rem;color:var(--ink-3);font-weight:700;margin-top:2px">اليمنى</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <button onclick="ommyBfStartSide('left')" type="button" style="padding:16px;border:2px solid ${info.currentSide === 'left' ? 'transparent' : 'var(--rose)'};border-radius:14px;background:${info.currentSide === 'left' ? 'linear-gradient(145deg,var(--rose),var(--clay-deep))' : 'var(--cream)'};color:${info.currentSide === 'left' ? '#fff' : 'var(--clay-deep)'};font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer">
          ⬅️ اليسرى
        </button>
        <button onclick="ommyBfStartSide('right')" type="button" style="padding:16px;border:2px solid ${info.currentSide === 'right' ? 'transparent' : 'var(--lavender)'};border-radius:14px;background:${info.currentSide === 'right' ? 'linear-gradient(145deg,var(--lavender),var(--lavender-deep))' : 'var(--cream)'};color:${info.currentSide === 'right' ? '#fff' : 'var(--lavender-deep)'};font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer">
          اليمنى ➡️
        </button>
      </div>

      ${info.isActive ? `
        <button onclick="ommyBfPause()" type="button" style="width:100%;padding:12px;margin-bottom:8px;border:1.5px solid var(--line);border-radius:12px;background:var(--cream);color:var(--ink-2);font-family:var(--font-heading);font-weight:800;font-size:0.82rem;cursor:pointer">⏸ إيقاف مؤقت</button>
      ` : ''}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <button onclick="ommyBfCancel()" type="button" style="padding:12px;border:1.5px solid var(--red);border-radius:12px;background:var(--cream);color:var(--red-deep);font-family:var(--font-heading);font-weight:800;font-size:0.82rem;cursor:pointer">إلغاء</button>
        <button onclick="ommyBfEnd()" type="button" style="padding:12px;border:none;border-radius:12px;background:linear-gradient(145deg,var(--mint),var(--mint-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.82rem;cursor:pointer;box-shadow:0 6px 16px rgba(92,143,114,.3)">✅ إتمام</button>
      </div>
    </div>
  `;
}
