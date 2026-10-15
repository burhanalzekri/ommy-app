/* ============================================
   شاشة الصحة النفسية للأم
   ============================================ */
import { MentalHealth } from '../lib/mental-health.js';

/* حالة الاختبار */
let mhState = {
  currentQuestion: 0,
  answers: [],
  active: false,
};

window.ommyStartEdinburgh = function() {
  mhState = { currentQuestion: 0, answers: [], active: true };
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommyAnswerEdinburgh = function(score) {
  mhState.answers.push(score);
  if (mhState.currentQuestion < MentalHealth.edinburghQuestions.length - 1) {
    mhState.currentQuestion++;
    if (window.ommyRefresh) window.ommyRefresh();
  } else {
    /* انتهى الاختبار */
    const result = MentalHealth.saveEdinburgh(mhState.answers);
    mhState.active = false;
    if (window.haptic) window.haptic('medium');
    showEdinburghResult(result);
  }
};

window.ommyCancelEdinburgh = function() {
  mhState = { currentQuestion: 0, answers: [], active: false };
  if (window.ommyRefresh) window.ommyRefresh();
};

/* عرض النتيجة */
function showEdinburghResult(result) {
  const interp = result.interpretation;
  if (window.showModal) {
    window.showModal({
      type: result.score >= 13 ? 'error' : 'success',
      title: interp.icon + ' نتيجتك: ' + result.score + ' / 30',
      message: `
        <div style="text-align:start;font-size:0.88rem;line-height:1.9">
          <div style="text-align:center;margin-bottom:14px">
            <span style="font-size:1.5rem;font-weight:900;color:${interp.color};font-family:var(--font-heading)">${interp.level}</span>
          </div>
          <div style="background:${result.score >= 13 ? '#FDEEEE' : '#EDF7F0'};padding:14px;border-radius:14px;color:${interp.color};font-weight:700;line-height:1.8">
            ${interp.advice}
          </div>
          ${interp.action ? `
            <div style="text-align:center;margin-top:14px;padding:10px;background:#FDF6E5;border-radius:12px;font-weight:800;color:#A87C22">
              ${interp.action}
            </div>
          ` : ''}
        </div>
      `,
      confirmText: 'حسناً',
    });
  }
  if (window.ommyRefresh) setTimeout(() => window.ommyRefresh(), 500);
}

/* تمرين التنفس */
let breathingState = {
  active: false,
  pattern: null,
  phaseIndex: 0,
  timeLeft: 0,
  cycle: 0,
  timer: null,
};

window.ommyStartBreathing = function(patternKey) {
  const pattern = MentalHealth.breathingPatterns[patternKey];
  if (!pattern) return;
  breathingState = {
    active: true,
    pattern,
    phaseIndex: 0,
    timeLeft: pattern.phases[0].duration,
    cycle: 0,
    timer: null,
  };
  startBreathingCycle();
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommyStopBreathing = function() {
  if (breathingState.timer) clearInterval(breathingState.timer);
  const cycles = breathingState.cycle;
  if (cycles > 0) {
    MentalHealth.saveBreathingSession(breathingState.pattern.name, cycles);
    if (window.haptic) window.haptic('success');
    if (window.toast) window.toast(`✅ أكملتِ ${cycles} دورة`, { type: 'success' });
  }
  breathingState = { active: false, pattern: null, phaseIndex: 0, timeLeft: 0, cycle: 0, timer: null };
  if (window.ommyRefresh) window.ommyRefresh();
};

function startBreathingCycle() {
  if (breathingState.timer) clearInterval(breathingState.timer);

  breathingState.timer = setInterval(() => {
    breathingState.timeLeft--;

    if (breathingState.timeLeft <= 0) {
      /* انتقل للمرحلة التالية */
      breathingState.phaseIndex++;
      if (breathingState.phaseIndex >= breathingState.pattern.phases.length) {
        breathingState.phaseIndex = 0;
        breathingState.cycle++;
      }
      breathingState.timeLeft = breathingState.pattern.phases[breathingState.phaseIndex].duration;

      if (window.haptic) window.haptic('light');
    }

    updateBreathingUI();

    /* تحديث تلقائي */
    const el = document.getElementById('breathePhase');
    if (el) {
      const phase = breathingState.pattern.phases[breathingState.phaseIndex];
      el.textContent = phase.name;
      el.style.color = phase.color;
    }
    const timer = document.getElementById('breatheTimer');
    if (timer) timer.textContent = breathingState.timeLeft;
    const circle = document.getElementById('breatheCircle');
    if (circle) {
      circle.style.background = breathingState.pattern.phases[breathingState.phaseIndex].color;
      const scale = 1 + (breathingState.timeLeft / breathingState.pattern.phases[breathingState.phaseIndex].duration) * 0.5;
      circle.style.transform = 'scale(' + scale + ')';
    }
    const cycles = document.getElementById('breatheCycles');
    if (cycles) cycles.textContent = breathingState.cycle;
  }, 1000);
}

function updateBreathingUI() {
  /* placeholder — actual updates in ticker */
}

/* ============ الشاشة ============ */
export function MentalHealthScreen() {
  if (mhState.active) return renderEdinburghQuestion();
  if (breathingState.active) return renderBreathing();
  return renderMain();
}

function renderMain() {
  const latest = MentalHealth.latest();
  const encouragement = MentalHealth.randomEncouragement();
  const breathingCount = MentalHealth.breathingCount();

  return `
    <div style="grid-column:1/-1;width:100%">

      <div style="background:linear-gradient(135deg,#C9BFE5 0%,#E8A3B6 60%,#D9829A 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:22px;box-shadow:0 20px 45px rgba(198,93,123,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">💗</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">صحتك النفسية</div>
              <div style="font-size:0.78rem;opacity:.92;margin-top:3px">أنتِ الأهم — لا تهملي نفسك</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card span-full" style="padding:16px;margin-bottom:16px;background:linear-gradient(135deg,var(--lavender-soft),var(--rose-soft));border:1.5px solid var(--lavender)">
        <div style="text-align:center;font-size:0.85rem;line-height:1.9;color:var(--ink-2);font-weight:600">
          ${encouragement}
        </div>
      </div>

      ${latest ? renderLatestResult(latest) : ''}

      <div class="section-title span-full">
        <div class="section-title__label">
          <span class="section-title__icon" style="background:var(--rose-soft);color:var(--clay-deep)">📋</span>
          <span>اختبار إدنبرة (EPDS)</span>
        </div>
      </div>

      <div class="card span-full" style="padding:16px;margin-bottom:16px">
        <div style="font-size:0.78rem;color:var(--ink-2);line-height:1.7;margin-bottom:14px">
          اختبار موثوق عالمياً لاكتشاف اكتئاب ما بعد الولادة. <b>10 أسئلة فقط · 3 دقائق.</b>
        </div>
        <button onclick="ommyStartEdinburgh()" type="button" style="width:100%;padding:14px;border:none;border-radius:14px;background:linear-gradient(145deg,var(--rose),var(--clay-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer;box-shadow:0 8px 20px rgba(198,93,123,.3)">📋 ابدئي الاختبار</button>
      </div>

      <div class="section-title span-full">
        <div class="section-title__label">
          <span class="section-title__icon" style="background:var(--mint-soft);color:var(--mint-deep)">🌬️</span>
          <span>تمارين التنفس</span>
        </div>
      </div>

      ${renderBreathingPatterns(breathingCount)}
    </div>
  `;
}

function renderLatestResult(latest) {
  const interp = latest.interpretation;
  const date = new Date(latest.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });

  return `
    <div class="card span-full" style="padding:16px;margin-bottom:16px;border-color:${interp.color}">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">
        <span style="font-size:1.8rem">${interp.icon}</span>
        <div style="flex:1">
          <div style="font-size:0.68rem;color:var(--ink-3);font-weight:700">آخر اختبار · ${date}</div>
          <div style="font-family:var(--font-heading);font-weight:900;font-size:1rem;color:${interp.color}">${interp.level}</div>
        </div>
        <div style="text-align:center">
          <div style="font-family:var(--font-heading);font-weight:900;font-size:1.5rem;color:${interp.color};line-height:1">${latest.score}</div>
          <div style="font-size:0.6rem;color:var(--ink-3);margin-top:2px">من 30</div>
        </div>
      </div>
      <div style="font-size:0.74rem;color:var(--ink-2);line-height:1.7">${interp.advice}</div>
    </div>
  `;
}

function renderBreathingPatterns(count) {
  let cards = '';
  Object.entries(MentalHealth.breathingPatterns).forEach(([key, pattern]) => {
    cards += `
      <button onclick="ommyStartBreathing('${key}')" type="button" style="width:100%;text-align:start;padding:14px;border:1.5px solid var(--line);border-radius:16px;background:var(--cream);margin-bottom:10px;cursor:pointer;font-family:var(--font-body);transition:all .2s;box-shadow:0 2px 8px rgba(46,31,43,.04)">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="width:44px;height:44px;border-radius:14px;background:var(--mint-soft);display:grid;place-items:center;font-size:1.3rem;flex-shrink:0">🌬️</span>
          <div style="flex:1;min-width:0">
            <div style="font-family:var(--font-heading);font-weight:900;font-size:0.88rem;color:var(--ink);margin-bottom:3px">${pattern.name}</div>
            <div style="font-size:0.72rem;color:var(--ink-3)">${pattern.desc}</div>
          </div>
          <span style="font-size:1.1rem;color:var(--mint-deep)">▶</span>
        </div>
      </button>
    `;
  });

  return `
    <div class="span-full" style="margin-bottom:16px">
      ${cards}
      ${count > 0 ? `<div style="text-align:center;font-size:0.72rem;color:var(--ink-3);margin-top:8px">أكملتِ ${count} جلسة تنفس 🌿</div>` : ''}
    </div>
  `;
}

function renderEdinburghQuestion() {
  const q = MentalHealth.edinburghQuestions[mhState.currentQuestion];
  const total = MentalHealth.edinburghQuestions.length;
  const progress = Math.round(((mhState.currentQuestion) / total) * 100);

  return `
    <div style="grid-column:1/-1;width:100%">
      <div class="card span-full" style="padding:18px;margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-family:var(--font-heading);font-size:0.82rem;font-weight:900;color:var(--clay-deep)">السؤال ${mhState.currentQuestion + 1} من ${total}</div>
          <button onclick="ommyCancelEdinburgh()" type="button" style="background:transparent;border:none;color:var(--ink-3);font-size:0.75rem;cursor:pointer;font-family:var(--font-body)">إلغاء</button>
        </div>
        <div style="height:6px;background:var(--beige);border-radius:100px;overflow:hidden;margin-bottom:20px">
          <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,var(--rose),var(--clay-deep));border-radius:100px;transition:width .4s"></div>
        </div>

        <div style="font-family:var(--font-heading);font-size:1rem;font-weight:900;color:var(--ink);line-height:1.7;margin-bottom:20px;text-align:center">
          ${q.text}
        </div>

        <div style="display:flex;flex-direction:column;gap:8px">
          ${q.options.map((opt, i) => `
            <button onclick="ommyAnswerEdinburgh(${i})" type="button" style="width:100%;padding:14px;border:1.5px solid var(--line);border-radius:14px;background:var(--cream);text-align:start;font-family:var(--font-body);font-size:0.85rem;font-weight:600;color:var(--ink);cursor:pointer;transition:all .2s">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderBreathing() {
  const phase = breathingState.pattern.phases[breathingState.phaseIndex];

  return `
    <div style="grid-column:1/-1;width:100%">
      <div class="card span-full" style="padding:24px;text-align:center;margin-bottom:16px">
        <div style="font-family:var(--font-heading);font-size:1rem;font-weight:900;color:var(--clay-deep);margin-bottom:8px">${breathingState.pattern.name}</div>
        <div style="font-size:0.75rem;color:var(--ink-3);margin-bottom:24px">${breathingState.pattern.desc}</div>

        <div id="breatheCircle" style="width:140px;height:140px;border-radius:50%;background:${phase.color};margin:0 auto 20px;transition:transform 1s ease,background .4s ease;display:grid;place-items:center;box-shadow:0 12px 32px rgba(46,31,43,.15)">
          <div id="breatheTimer" style="font-family:var(--font-heading);font-size:3rem;font-weight:900;color:#fff;line-height:1">${breathingState.timeLeft}</div>
        </div>

        <div id="breathePhase" style="font-family:var(--font-heading);font-size:1.2rem;font-weight:900;color:${phase.color};margin-bottom:8px">${phase.name}</div>

        <div style="font-size:0.75rem;color:var(--ink-3)">الدورة: <b id="breatheCycles" style="color:var(--clay-deep);font-weight:900">${breathingState.cycle}</b></div>

        <button onclick="ommyStopBreathing()" type="button" style="width:100%;margin-top:24px;padding:14px;border:none;border-radius:14px;background:linear-gradient(145deg,var(--rose),var(--clay-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer">⏸ إيقاف وحفظ</button>
      </div>
    </div>
  `;
}
