/* ============================================
   شاشة النمو — ديناميكية حسب الطفل النشط
   ============================================ */
import { BabyStore } from '../lib/storage.js';
import { Children } from '../lib/settings.js';
import { Growth } from '../lib/growth.js';

window.ommyMetric = function(type) {
  const baby = BabyStore.get();
  const ageMonths = BabyStore.updateAge().ageMonths || 14;

  const info = {
    weight: {
      title: '⚖️ الوزن',
      value: baby.weight ? baby.weight + ' كجم' : 'لم يُسجَّل',
      range: Growth.whoWeight(ageMonths).toFixed(1) + ' كجم',
      advice: 'الوزن يتغير شهرياً — سجّلي بانتظام',
      pct: Growth.percentile('weight', baby.weight || 0, ageMonths),
    },
    height: {
      title: '📏 الطول',
      value: baby.height ? baby.height + ' سم' : 'لم يُسجَّل',
      range: Growth.whoHeight(ageMonths).toFixed(1) + ' سم',
      advice: 'الطول يزداد حوالي 1 سم شهرياً في هذه المرحلة',
      pct: Growth.percentile('height', baby.height || 0, ageMonths),
    },
    head: {
      title: '🧠 محيط الرأس',
      value: baby.headCirc ? baby.headCirc + ' سم' : 'لم يُسجَّل',
      range: '— سم',
      advice: 'محيط الرأس يزداد ببطء — يدل على نمو الدماغ',
      pct: { label: 'المئين التقريبي', status: 'طبيعي', color: 'var(--clay-deep)' },
    },
  }[type];

  if (!info || !window.showModal) return;

  window.showModal({
    type: 'success',
    title: info.title,
    message: `
      <div style="text-align:start;font-size:0.88rem;line-height:1.9">
        <div style="font-family:var(--font-heading);font-size:1.6rem;font-weight:900;color:var(--clay-deep);text-align:center;margin-bottom:6px">${info.value}</div>
        <div style="text-align:center;margin-bottom:14px"><span style="background:${info.pct.color}15;color:${info.pct.color};padding:5px 14px;border-radius:100px;font-weight:900;font-size:0.75rem">${info.pct.label} · ${info.pct.status}</span></div>
        <b style="color:var(--clay-deep)">📊 المتوسط للعمر:</b> ${info.range}<br><br>
        <b style="color:var(--clay-deep)">💡 نصيحة:</b> ${info.advice}
      </div>
    `,
    confirmText: 'تم',
  });
  if (window.haptic) window.haptic('light');
};

window.ommyAddMeasure = function() {
  const active = Children.active();
  const babyName = active?.name || 'طفلك';

  if (!window.showModal) return;
  window.showModal({
    type: 'question',
    title: '📏 قياس جديد',
    message: `أدخلي الوزن لـ${babyName} (كجم)`,
    input: true,
    inputPlaceholder: 'مثال: 10.5',
    inputType: 'number',
    confirmText: 'التالي',
    cancelText: 'إلغاء',
    onConfirm: async (weight) => {
      const height = await window.ommyPrompt('الطول (سم)', '78', '');
      const headCirc = await window.ommyPrompt('محيط الرأس (سم)', '46', '');

      if (!weight && !height && !headCirc) {
        if (window.toast) window.toast('لم تُدخل أي قياس', { type: 'warning' });
        return;
      }

      Growth.add({
        weight: weight || null,
        height: height || null,
        headCirc: headCirc || null,
      });

      if (window.haptic) window.haptic('success');
      if (window.ommySound?.celebrate) window.ommySound.celebrate();
      if (window.toast) window.toast('✅ تم حفظ القياس', { type: 'success' });
      if (window.ommyRefresh) window.ommyRefresh();
    },
  });
};

export function GrowthScreen() {
  const active = Children.active();
  const baby = { ...BabyStore.updateAge(), name: active?.name || 'طفل' };
  const ageMonths = baby.ageMonths || 14;
  const history = Growth.list();
  const latest = Growth.latest();

  /* استخدم أحدث قياس من السجل إذا موجود */
  const displayWeight = (latest && latest.weight) || baby.weight || null;
  const displayHeight = (latest && latest.height) || baby.height || null;
  const displayHead = (latest && latest.headCirc) || baby.headCirc || null;

  const weightPct = Growth.percentile('weight', displayWeight || 0, ageMonths);
  const heightPct = Growth.percentile('height', displayHeight || 0, ageMonths);

  const ageLabel = ageMonths >= 24
    ? `${Math.floor(ageMonths / 12)} سنوات`
    : `${ageMonths} شهراً`;

  return `
    <div style="grid-column:1/-1;width:100%">

      <!-- Hero -->
      <div style="background:linear-gradient(135deg,var(--mint) 0%,var(--mint-deep) 60%,#3D5E48 100%);border-radius:24px;padding:22px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 45px rgba(92,143,114,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">📈</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">نمو ${baby.name}</div>
              <div style="font-size:0.78rem;opacity:.9;margin-top:3px">${ageLabel} · ${weightPct.status}</div>
            </div>
          </div>
          <span style="display:inline-block;font-size:0.72rem;background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.35);padding:6px 14px;border-radius:100px;font-weight:700">🎯 ${weightPct.label} · ${weightPct.status}</span>
        </div>
      </div>

      <!-- 3 بطاقات القياسات -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;grid-column:1/-1">
        ${metric('weight', '⚖️', displayWeight || '—', 'كجم', 'الوزن', weightPct.label, weightPct.color)}
        ${metric('height', '📏', displayHeight || '—', 'سم', 'الطول', heightPct.label, heightPct.color)}
        ${metric('head', '🧠', displayHead || '—', 'سم', 'محيط الرأس', '—', 'var(--clay-deep)')}
      </div>

      <!-- منحنى النمو -->
      <div style="display:flex;align-items:center;gap:8px;margin:20px 0 12px;grid-column:1/-1">
        <span style="width:28px;height:28px;border-radius:10px;display:grid;place-items:center;font-size:1rem;background:var(--mint-soft);color:var(--mint-deep)">📊</span>
        <span style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900">منحنى الطول</span>
        <span style="flex:1;height:1px;background:var(--line)"></span>
      </div>

      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:20px;padding:18px;margin-bottom:20px;grid-column:1/-1">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900">${history.length > 1 ? 'آخر ' + Math.min(history.length, 12) + ' قياس' : 'منحنى النمو'}</div>
          <span style="font-size:0.68rem;font-weight:800;background:var(--mint-soft);color:var(--mint-deep);padding:4px 11px;border-radius:100px">↗ نمو متوازن</span>
        </div>
        ${renderGrowthChart(history, baby)}
      </div>

      <!-- ملاحظات -->
      <div style="display:flex;align-items:center;gap:8px;margin:20px 0 12px;grid-column:1/-1">
        <span style="width:28px;height:28px;border-radius:10px;display:grid;place-items:center;font-size:1rem;background:var(--mint-soft);color:var(--mint-deep)">✅</span>
        <span style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900">ملاحظات النمو</span>
        <span style="flex:1;height:1px;background:var(--line)"></span>
      </div>

      <div style="background:linear-gradient(135deg,var(--mint-soft),var(--cream));border:1.5px solid var(--mint);border-radius:18px;padding:16px;margin-bottom:12px;grid-column:1/-1">
        <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:var(--mint-deep);margin-bottom:6px">✅ ${weightPct.status}</div>
        <p style="font-size:0.78rem;color:var(--ink-2);line-height:1.7;margin:0">
          ${weightPct.status === 'متوسط' ? 'النمو متوازن — الوزن والطول في نفس المئين تقريباً' :
            weightPct.status.includes('فوق') ? 'الوزن أعلى من المتوسط — طبيعي للأطفال الأصحاء' :
            weightPct.status.includes('تحت') ? 'الوزن أقل من المتوسط — راقبي التغذية' :
            'متابعة النمو مهمة — سجّلي بانتظام'}
        </p>
      </div>

      <div style="background:linear-gradient(135deg,var(--honey-soft),var(--cream));border:1.5px solid var(--honey);border-radius:18px;padding:16px;margin-bottom:20px;grid-column:1/-1">
        <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:var(--honey-deep);margin-bottom:6px">💡 نصيحة</div>
        <p style="font-size:0.78rem;color:var(--ink-2);line-height:1.7;margin:0">سجّلي القياس كل 2–4 أسابيع بنفس الميزان والوقت للحصول على منحنى أدق.</p>
      </div>

      <button onclick="ommyAddMeasure()" type="button" style="width:100%;padding:14px;border:none;border-radius:16px;background:linear-gradient(145deg,var(--mint),var(--mint-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer;box-shadow:0 12px 26px rgba(92,143,114,.35);grid-column:1/-1">➕ إضافة قياس جديد لـ ${baby.name}</button>

    </div>
  `;
}

/* ============ مكونات ============ */
function metric(type, icon, value, unit, label, percentile, color) {
  return `
    <button onclick="ommyMetric('${type}')" type="button" style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:14px 8px;text-align:center;cursor:pointer;font-family:var(--font-body);transition:all .2s">
      <div style="font-size:1.4rem;margin-bottom:6px">${icon}</div>
      <div style="font-family:var(--font-heading);font-weight:900;font-size:1.05rem;color:var(--mint-deep);line-height:1"><span style="font-size:1.4rem">${value}</span> <span style="font-size:0.7rem">${unit}</span></div>
      <div style="font-size:0.68rem;color:var(--ink-3);margin-top:4px;font-weight:600">${label}</div>
      <div style="font-size:0.62rem;font-weight:800;margin-top:3px;color:${color}">${percentile}</div>
    </button>
  `;
}

function renderGrowthChart(history, baby) {
  if (history.length === 0) {
    /* إذا لا يوجد تاريخ لكن يوجد قياس حالي */
    if (baby.height || baby.weight) {
      return `
        <div style="text-align:center;padding:24px 12px;background:var(--mint-soft);border-radius:14px">
          <div style="font-size:1.5rem;margin-bottom:8px">📊</div>
          <div style="font-family:var(--font-heading);font-size:0.85rem;font-weight:900;color:var(--mint-deep);margin-bottom:4px">
            ${baby.height ? baby.height + ' سم' : baby.weight + ' كجم'}
          </div>
          <div style="font-size:0.72rem;color:var(--ink-3)">أضيفي قياسات إضافية لرؤية المنحنى</div>
        </div>
      `;
    }
    return `
      <div style="text-align:center;padding:24px 12px;background:var(--beige);border-radius:14px">
        <div style="font-size:2rem;margin-bottom:8px">📏</div>
        <div style="font-family:var(--font-heading);font-size:0.85rem;font-weight:900;color:var(--ink-2);margin-bottom:4px">لا توجد قياسات مسجّلة</div>
        <div style="font-size:0.72rem;color:var(--ink-3)">ابدئي بإضافة قياس من الزر أسفل</div>
      </div>
    `;
  }

  const recent = history.slice(-12);

  if (recent.length === 1) {
    const h = recent[0];
    return `
      <div style="text-align:center;padding:20px;background:var(--mint-soft);border-radius:14px">
        <div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:900;color:var(--mint-deep)">${h.height || h.weight || '—'}${h.height ? ' سم' : h.weight ? ' كجم' : ''}</div>
        <div style="font-size:0.7rem;color:var(--ink-3);margin-top:4px">أول قياس — أضيفي آخر لرؤية المنحنى</div>
      </div>
    `;
  }

  /* حساب نقاط SVG */
  const vals = recent.map(h => h.height || h.weight || 0).filter(v => v > 0);
  const maxV = Math.max(...vals, 100);
  const minV = Math.min(...vals, 40);
  const W = 300, H = 100;

  const points = recent.map((h, i) => {
    const x = (i / (recent.length - 1)) * W;
    const val = h.height || h.weight || 0;
    const y = val > 0 ? H - ((val - minV) / (maxV - minV || 1)) * H : H;
    return { x, y, val, date: h.date };
  });

  const pathD = points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
  const areaD = pathD + ` L${W},${H} L0,${H} Z`;

  return `
    <svg viewBox="0 0 ${W} ${H + 30}" preserveAspectRatio="none" style="width:100%;height:auto">
      <defs>
        <linearGradient id="gArea2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="var(--mint)" stop-opacity=".25"/>
          <stop offset="1" stop-color="var(--mint)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#gArea2)"/>
      <path d="${pathD}" fill="none" stroke="var(--mint-deep)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${points.map((p, i) => `
        <circle cx="${p.x}" cy="${p.y}" r="${i === points.length - 1 ? 6 : 4}" fill="var(--mint-deep)" stroke="${i === points.length - 1 ? 'var(--cream)' : 'transparent'}" stroke-width="2"/>
      `).join('')}
      ${points.map((p, i) => {
        if (i % 2 !== 0 && i !== points.length - 1) return '';
        return `<text x="${p.x}" y="${H + 20}" font-size="8" fill="var(--ink-3)" font-family="Cairo" text-anchor="middle" font-weight="700">${new Date(p.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric' })}</text>`;
      }).join('')}
    </svg>
  `;
}
