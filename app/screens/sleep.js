/* ============================================
   شاشة النوم — نسخة ديناميكية
   ============================================ */

import { SleepTips } from '../lib/content.js';

window.ommySound = function(btn) {
  const card = btn.closest('.sd-card');
  if (!card) return;
  const isOn = card.classList.toggle('sd-on');
  const slider = card.querySelector('.sd-slider');
  if (slider) slider.style.display = isOn ? 'block' : 'none';
  const playBtn = card.querySelector('.sd-play');
  if (playBtn) playBtn.textContent = isOn ? '❚❚' : '▶';
  if (window.haptic) window.haptic('light');
  if (window.toast) window.toast(isOn ? '▶ تشغيل الصوت' : '⏸ إيقاف الصوت', { type: 'info', duration: 1200 });
};

window.ommySoundClick = function(el) {
  const card = el.closest('.sd-card');
  if (!card) return;
  const isOn = card.classList.toggle('sd-on');
  const slider = card.querySelector('.sd-slider');
  if (slider) slider.style.display = isOn ? 'block' : 'none';
  const playBtn = card.querySelector('.sd-play');
  if (playBtn) playBtn.textContent = isOn ? '❚❚' : '▶';
  if (window.haptic) window.haptic('light');
};

window.ommySleepTip = function(index) {
  const tip = SleepTips[index];
  if (!tip || !window.showModal) return;
  window.showModal({
    type: 'info',
    title: tip.icon + ' ' + tip.title,
    message: tip.desc,
    confirmText: 'فهمت',
    cancelText: 'إغلاق',
  });
};

export function SleepScreen() {
  return `
    <style>
      @keyframes sleepPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(91,124,153,.4); }
        50% { box-shadow: 0 0 0 12px rgba(91,124,153,0); }
      }
    </style>

    <div style="grid-column:1/-1;width:100%">

      <div style="background:linear-gradient(135deg,#5B7C99 0%,#3E5C75 50%,#1E2F40 100%);border-radius:24px;padding:22px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 45px rgba(62,92,117,.4)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:230px;height:230px;border-radius:50%;background:radial-gradient(circle,rgba(184,211,235,.35),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">🌙</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">نوم آدم اليوم</div>
              <div style="font-size:0.78rem;opacity:.9;margin-top:3px">الهدف لعمر 14 شهراً: 11–14 ساعة</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
            ${heroStat('11س 20د', 'نوم فعلي', '🌙')}
            ${heroStat('2', 'قيلولات', '☀️')}
            ${heroStat('8:15م', 'بداية الليل', '🛏️')}
          </div>
        </div>
      </div>

      <div style="background:linear-gradient(135deg,#F0F7FF,#DBEAFE);border:1.5px solid #93C5FD;border-radius:20px;padding:18px;margin-bottom:20px;display:flex;gap:14px;align-items:center">
        <span style="width:52px;height:52px;border-radius:16px;background:linear-gradient(145deg,#5B7C99,#3E5C75);color:#fff;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0;box-shadow:0 8px 20px rgba(62,92,117,.35)">⏰</span>
        <div style="flex:1">
          <div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;color:#1E3A5F;margin-bottom:3px">نافذة اليقظ المثالية</div>
          <div style="font-size:0.76rem;color:#4A6580">القيلولة القادمة لعمر 14 شهراً</div>
        </div>
        <div style="text-align:center">
          <div style="font-family:var(--font-heading);font-size:1.6rem;font-weight:900;color:#1E3A5F;line-height:1">3:30</div>
          <div style="font-size:0.65rem;color:#4A6580;font-weight:700">ساعة</div>
        </div>
      </div>

      ${sectionHeader('📊', 'متتبع النوم · هذا الأسبوع')}

      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:20px;padding:18px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
          <div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900">ساعات النوم اليومية</div>
          <span style="font-size:0.7rem;font-weight:900;background:linear-gradient(145deg,#DCFCE7,#BBF7D0);color:#15803D;padding:5px 12px;border-radius:100px;border:1px solid #86EFAC">✓ ضمن النطاق</span>
        </div>
        ${renderChart()}
      </div>

      ${sectionHeader('💡', 'نصائح لنوم أفضل')}

      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px">
        ${SleepTips.map((t, i) => `
          <button onclick="ommySleepTip(${i})" type="button" style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px 12px;text-align:center;cursor:pointer;transition:all .25s;font-family:var(--font-body)">
            <div style="width:52px;height:52px;border-radius:16px;background:linear-gradient(145deg,#DBEAFE,#BFDBFE);display:grid;place-items:center;font-size:1.5rem;margin:0 auto 10px">${t.icon}</div>
            <div style="font-family:var(--font-heading);font-size:0.82rem;font-weight:900;color:var(--ink);margin-bottom:4px">${t.title}</div>
            <div style="font-size:0.68rem;color:var(--ink-3)">${t.desc}</div>
          </button>
        `).join('')}
      </div>

      ${sectionHeader('🎵', 'أصوات مهدئة · تعمل بالخلفية')}

      ${soundCard('🕌', 'تلاوة هادئة', 'سورة الرحمن · تشغيل تلقائي', true)}
      ${soundCard('🌊', 'ضجيج أبيض', 'أصوات المطر · 45 دقيقة', false)}
      ${soundCard('🤲', 'أذكار النوم', 'بصوت هادئ مع نص مكتوب', false)}
      ${soundCard('💗', 'نبضات القلب', 'تحاكي الرحم · للمواليد', false)}

      ${sectionHeader('🛁', 'روتين ما قبل النوم')}

      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:20px;padding:18px;margin-bottom:16px">
        <div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;margin-bottom:18px;display:flex;align-items:center;gap:8px">🛁 روتين آدم الليلة</div>
        ${rtLine('7:00م', 'عشاء خفيف', 'قبل النوم بـ90 دقيقة', true)}
        ${rtLine('7:45م', 'حمّام دافئ', 'يساعد على خفض حرارة الجسم', true)}
        ${rtLine('8:05م', 'قراءة هادئة', 'قصة قصيرة بلا شاشات', false)}
        ${rtLine('8:15م', 'أذكار وتلاوة', 'يُشغَّل الصوت الهادئ تلقائياً', false)}
        <button onclick="ommyToast && ommyToast('▶ ابدأ روتين الليلة', '🌙')" type="button" style="width:100%;margin-top:14px;padding:14px;border:none;border-radius:14px;background:linear-gradient(145deg,#5B7C99,#3E5C75);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.88rem;cursor:pointer;box-shadow:0 10px 22px rgba(62,92,117,.3)">🌙 ابدأ روتين الليلة</button>
      </div>

    </div>
  `;
}

function sectionHeader(icon, title) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,#5B7C99,transparent);border-radius:2px"></span></div>`;
}

function heroStat(value, label, icon) {
  return `<div style="background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);border-radius:14px;padding:12px 6px;text-align:center"><div style="font-size:1rem;margin-bottom:4px">${icon}</div><div style="font-family:var(--font-heading);font-size:1rem;font-weight:900;line-height:1.1">${value}</div><div style="font-size:0.62rem;opacity:.85;margin-top:3px">${label}</div></div>`;
}

function renderChart() {
  const days = [
    { d: 'س', h: 78, good: true }, { d: 'ح', h: 88, good: true }, { d: 'ن', h: 68, good: true },
    { d: 'ث', h: 94, good: true }, { d: 'ر', h: 72, good: true }, { d: 'خ', h: 58, good: false },
    { d: 'ج', h: 84, good: true },
  ];
  return `<div style="display:flex;align-items:flex-end;gap:8px;height:110px;padding:0 4px">${days.map(d => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end"><div style="width:100%;max-width:28px;height:${d.h}%;border-radius:10px 10px 4px 4px;background:${d.good ? 'linear-gradient(180deg,#4ADE80,#16A34A)' : 'linear-gradient(180deg,#94A3B8,#64748B)'};box-shadow:0 3px 8px rgba(0,0,0,.08)"></div><span style="font-size:0.72rem;color:var(--ink-3);font-weight:800">${d.d}</span></div>`).join('')}</div>`;
}

function soundCard(icon, name, desc, isOn) {
  return `
    <div class="sd-card${isOn ? ' sd-on' : ''}" style="background:${isOn ? 'linear-gradient(135deg,#F0F7FF,#DBEAFE)' : 'var(--cream)'};border:1.5px solid ${isOn ? '#93C5FD' : 'var(--line)'};border-radius:18px;padding:14px;margin-bottom:10px;transition:all .25s">
      <div style="display:flex;gap:14px;align-items:center">
        <span onclick="ommySoundClick(this)" style="width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0;cursor:pointer;${isOn ? 'background:linear-gradient(145deg,#5B7C99,#3E5C75);color:#fff;' : 'background:var(--beige);border:1px solid var(--line);'}">${icon}</span>
        <div style="flex:1"><div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;line-height:1.3;margin-bottom:3px">${name}</div><div style="font-size:0.74rem;color:var(--ink-3)">${desc}</div></div>
        <button class="sd-play" onclick="ommySound(this)" type="button" style="width:44px;height:44px;border-radius:14px;border:none;background:${isOn ? 'linear-gradient(145deg,#5B7C99,#3E5C75)' : 'linear-gradient(145deg,#D1FAE5,#A7F3D0)'};color:${isOn ? '#fff' : '#047857'};font-size:1rem;cursor:pointer;font-weight:900">${isOn ? '❚❚' : '▶'}</button>
      </div>
      <div class="sd-slider" style="margin-top:14px;display:${isOn ? 'block' : 'none'}">
        <input type="range" min="0" max="100" value="55" style="width:100%;-webkit-appearance:none;height:5px;border-radius:100px;background:linear-gradient(90deg,#5B7C99,#DBEAFE);outline:none" />
      </div>
    </div>
  `;
}

function rtLine(time, title, desc, active) {
  return `
    <div style="display:flex;gap:14px;margin-bottom:14px;padding-inline-start:4px">
      <span style="font-family:var(--font-heading);font-size:0.75rem;font-weight:900;color:#3E5C75;width:52px;flex-shrink:0;padding-top:2px">${time}</span>
      <span style="width:12px;height:12px;border-radius:50%;background:${active ? 'linear-gradient(145deg,#5B7C99,#3E5C75)' : 'var(--beige-2)'};flex-shrink:0;margin-top:6px;${active ? 'box-shadow:0 0 0 5px rgba(91,124,153,.18);' : ''}"></span>
      <div style="flex:1">
        <div style="font-family:var(--font-heading);font-size:0.85rem;font-weight:900;line-height:1.3;margin-bottom:2px">${title}</div>
        <div style="font-size:0.72rem;color:var(--ink-3);line-height:1.5">${desc}</div>
      </div>
    </div>
  `;
}
