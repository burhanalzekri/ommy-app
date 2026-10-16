/* ============================================
   شاشة صحتك النفسية — تصميم ذكي شامل
   ============================================ */
import { MentalHealth } from '../lib/mental-health.js';

/* حالة الاختبار */
let mhState = {
  currentQuestion: 0,
  answers: [],
  active: false,
};

let breathingState = {
  active: false,
  pattern: null,
  phaseIndex: 0,
  timeLeft: 0,
  cycle: 0,
  timer: null,
};

/* ============ الاختبار ============ */
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
    const result = MentalHealth.saveEdinburgh(mhState.answers);
    mhState.active = false;
    if (window.haptic) window.haptic('medium');
    showResultModal(result);
  }
};

window.ommyCancelEdinburgh = function() {
  mhState = { currentQuestion: 0, answers: [], active: false };
  if (window.ommyRefresh) window.ommyRefresh();
};

/* ============ سجل المزاج ============ */
window.ommyLogMHMood = function(moodKey) {
  MentalHealth.logDailyMood(moodKey);
  if (window.haptic) window.haptic('light');
  const labels = { great: 'ممتازة 🌟', good: 'جيدة 💚', okay: 'عادية 😊', tired: 'متعبة 💛', low: 'منخفضة 💗' };
  if (window.toast) window.toast(labels[moodKey] || moodKey, { type: 'success', duration: 1500 });
  if (window.ommyRefresh) window.ommyRefresh();
};

/* ============ التنفس ============ */
window.ommyStartMHBreath = function(patternKey) {
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
  startBreathTicker();
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommyStopMHBreath = function() {
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

function startBreathTicker() {
  if (breathingState.timer) clearInterval(breathingState.timer);
  breathingState.timer = setInterval(() => {
    breathingState.timeLeft--;
    if (breathingState.timeLeft <= 0) {
      breathingState.phaseIndex++;
      if (breathingState.phaseIndex >= breathingState.pattern.phases.length) {
        breathingState.phaseIndex = 0;
        breathingState.cycle++;
      }
      breathingState.timeLeft = breathingState.pattern.phases[breathingState.phaseIndex].duration;
      if (window.haptic) window.haptic('light');
    }
    updateBreathUI();
  }, 1000);
}

function updateBreathUI() {
  const phase = breathingState.pattern?.phases[breathingState.phaseIndex];
  if (!phase) return;

  const phaseEl = document.getElementById('mhBreathPhase');
  if (phaseEl) {
    phaseEl.textContent = phase.name;
    phaseEl.style.color = phase.color;
  }
  const timerEl = document.getElementById('mhBreathTimer');
  if (timerEl) timerEl.textContent = breathingState.timeLeft;
  const circleEl = document.getElementById('mhBreathCircle');
  if (circleEl) {
    circleEl.style.background = phase.color;
    const scale = 1 + (breathingState.timeLeft / phase.duration) * 0.5;
    circleEl.style.transform = 'scale(' + scale + ')';
  }
  const cycleEl = document.getElementById('mhBreathCycles');
  if (cycleEl) cycleEl.textContent = breathingState.cycle;
}

/* ============ نتيجة الاختبار ============ */
function showResultModal(result) {
  const analysis = MentalHealth.detailedAnalysis(result.score);
  const breakdownHtml = analysis.breakdown.map(b => `
    <div style="display:flex;gap:10px;align-items:flex-start;padding:10px;background:${result.score >= 13 ? '#FDEEEE' : '#F2F9F4'};border-radius:12px;margin-bottom:8px;text-align:start">
      <span style="font-size:1.1rem">${b.icon}</span>
      <div style="flex:1">
        <div style="font-family:var(--font-heading);font-weight:800;font-size:0.78rem;color:${analysis.color};margin-bottom:2px">${b.title}</div>
        <div style="font-size:0.7rem;color:var(--ink-2);line-height:1.6">${b.text}</div>
      </div>
    </div>
  `).join('');

  if (window.showModal) {
    window.showModal({
      type: result.score >= 13 ? 'error' : 'success',
      title: analysis.icon + ' نتيجتك: ' + result.score + ' / 30',
      message: `
        <div style="text-align:center;margin-bottom:14px">
          <span style="font-size:1.4rem;font-weight:900;color:${analysis.color};font-family:var(--font-heading)">${analysis.level}</span>
        </div>
        ${breakdownHtml}
      `,
      confirmText: 'حسناً',
    });
  }
  if (window.ommyRefresh) setTimeout(() => window.ommyRefresh(), 500);
}

/* ============ الشاشة ============ */
export function MentalHealthScreen() {
  if (mhState.active) return renderEdinburghQuestion();
  if (breathingState.active) return renderBreathing();
  return renderMain();
}

/* ============ الشاشة الرئيسية ============ */
function renderMain() {
  const latest = MentalHealth.latest();
  const todayMood = MentalHealth.todayMood();
  const moodHistory = MentalHealth.moodHistory();
  const advice = MentalHealth.smartAdvice();
  const patterns = MentalHealth.detectPatterns();
  const quote = MentalHealth.randomQuote();
  const breathCount = MentalHealth.breathingCount();

  return `
    <div style="grid-column:1/-1;width:100%">

      <!-- Hero -->
      <div style="background:linear-gradient(135deg,#C9BFE5 0%,#E8A3B6 55%,#D9829A 100%);border-radius:24px;padding:22px;color:#fff;position:relative;overflow:hidden;margin-bottom:16px;box-shadow:0 20px 45px rgba(198,93,123,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
            <span style="width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.22);display:grid;place-items:center;font-size:1.6rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">💗</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">صحتك النفسية</div>
              <div style="font-size:0.75rem;opacity:.9;margin-top:3px">أنتِ الأهم — لا تهملي نفسك</div>
            </div>
          </div>
          <div style="background:rgba(255,255,255,.15);border-radius:14px;padding:12px;text-align:center">
            <div style="font-size:0.82rem;line-height:1.7;font-weight:600">"${quote.text}"</div>
            <div style="font-size:0.7rem;opacity:.85;margin-top:6px">${quote.source}</div>
          </div>
        </div>
      </div>

      <!-- كيف تشعرين اليوم؟ -->
      ${sectionHeader('💗', 'كيف تشعرين اليوم؟')}
      ${renderMoodTracker(todayMood, moodHistory)}

      <!-- نصيحة ذكية -->
      ${sectionHeader('💡', 'لكِ الآن')}
      <div style="background:linear-gradient(135deg,${advice.color}15,var(--cream));border:1.5px solid ${advice.color};border-radius:20px;padding:16px;margin-bottom:16px;grid-column:1/-1">
        <div style="display:flex;gap:12px;align-items:flex-start">
          <span style="width:46px;height:46px;border-radius:14px;background:#fff;display:grid;place-items:center;font-size:1.4rem;flex-shrink:0;box-shadow:0 4px 12px ${advice.color}20">${advice.icon}</span>
          <div style="flex:1;min-width:0">
            <div style="font-family:var(--font-heading);font-weight:900;font-size:0.88rem;color:${advice.color};margin-bottom:4px">${advice.title}</div>
            <div style="font-size:0.74rem;color:var(--ink-2);line-height:1.7;margin-bottom:${advice.action ? '12px' : '0'}">${advice.text}</div>
            ${advice.action === 'breathe' ? `<button onclick="ommyStartMHBreath('478')" type="button" style="padding:8px 16px;border:none;border-radius:100px;background:${advice.color};color:#fff;font-family:var(--font-heading);font-weight:800;font-size:0.72rem;cursor:pointer">${advice.actionLabel}</button>` : ''}
          </div>
        </div>
      </div>

      <!-- نتائج سابقة -->
      ${latest ? renderLatestResult(latest) : ''}

      <!-- أنماط مكتشفة -->
      ${patterns ? `
        ${sectionHeader('🔍', 'أنماطك')}
        <div class="card span-full" style="padding:16px;margin-bottom:16px">
          ${patterns.map(p => `
            <div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px dashed var(--line)">
              <span style="width:42px;height:42px;border-radius:12px;background:${p.color}15;display:grid;place-items:center;font-size:1.2rem;flex-shrink:0">${p.icon}</span>
              <div style="flex:1;min-width:0">
                <div style="font-family:var(--font-heading);font-weight:900;font-size:0.82rem;color:${p.color};margin-bottom:2px">${p.title}</div>
                <div style="font-size:0.7rem;color:var(--ink-2);line-height:1.5">${p.text}</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- اختبار إدنبرة -->
      ${sectionHeader('📋', 'اختبار إدنبرة (EPDS)')}
      <div class="card span-full" style="padding:16px;margin-bottom:16px">
        <div style="font-size:0.76rem;color:var(--ink-2);line-height:1.7;margin-bottom:14px">
          اختبار موثوق عالمياً لاكتشاف اكتئاب ما بعد الولادة. <b>10 أسئلة · 3 دقائق.</b>
        </div>
        <button onclick="ommyStartEdinburgh()" type="button" style="width:100%;padding:14px;border:none;border-radius:14px;background:linear-gradient(145deg,var(--rose),var(--clay-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.88rem;cursor:pointer;box-shadow:0 8px 20px rgba(198,93,123,.3)">
          📋 ${latest ? 'أعيدي الاختبار' : 'ابدئي الاختبار'}
        </button>
      </div>

      <!-- تمارين التنفس -->
      ${sectionHeader('🌬️', 'تمارين التنفس')}
      ${renderBreathingList(breathCount)}

    </div>
  `;
}

/* ============ مكونات ============ */
function sectionHeader(icon, title) {
  return `
    <div style="display:flex;align-items:center;gap:8px;margin:20px 0 12px;grid-column:1/-1">
      <span style="width:28px;height:28px;border-radius:10px;display:grid;place-items:center;font-size:1rem;background:var(--rose-soft);color:var(--clay-deep)">${icon}</span>
      <span style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900">${title}</span>
      <span style="flex:1;height:1px;background:var(--line)"></span>
    </div>
  `;
}

function renderMoodTracker(todayMood, history) {
  const moods = [
    { key: 'great', icon: '😊', label: 'ممتازة', color: 'var(--mint-deep)' },
    { key: 'good', icon: '🙂', label: 'جيدة', color: 'var(--clay-deep)' },
    { key: 'okay', icon: '😐', label: 'عادية', color: 'var(--honey-deep)' },
    { key: 'tired', icon: '😔', label: 'متعبة', color: 'var(--peach-deep)' },
    { key: 'low', icon: '😢', label: 'منخفضة', color: 'var(--red-deep)' },
  ];

  const currentMood = todayMood?.mood;

  return `
    <div class="card span-full" style="padding:16px;margin-bottom:16px">
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:14px">
        ${moods.map(m => `
          <button onclick="ommyLogMHMood('${m.key}')" type="button" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px;border:2px solid ${currentMood === m.key ? m.color : 'transparent'};border-radius:14px;background:${currentMood === m.key ? m.color + '15' : 'var(--sand)'};cursor:pointer;font-family:var(--font-body);transition:all .2s">
            <span style="font-size:1.7rem;line-height:1">${m.icon}</span>
            <span style="font-size:0.6rem;font-weight:800;color:${currentMood === m.key ? m.color : 'var(--ink-3)'};text-align:center">${m.label}</span>
          </button>
        `).join('')}
      </div>

      ${history.some(d => d.mood) ? `
        <div style="padding-top:12px;border-top:1px dashed var(--line)">
          <div style="font-size:0.68rem;font-weight:800;color:var(--ink-3);margin-bottom:10px">📊 آخر 7 أيام</div>
          <div style="display:flex;align-items:flex-end;gap:6px;height:60px">
            ${history.map(d => {
              const mood = moods.find(m => m.key === d.mood);
              const height = mood ? (mood.key === 'great' ? 100 : mood.key === 'good' ? 80 : mood.key === 'okay' ? 60 : mood.key === 'tired' ? 40 : 20) : 8;
              return `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end">
                  <div style="width:100%;max-width:26px;height:${height}%;border-radius:8px;background:${mood ? mood.color : 'var(--beige)'};min-height:6px;transition:height .4s"></div>
                  <span style="font-size:0.6rem;color:var(--ink-3);font-weight:700">${d.label[0]}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : `
        <div style="text-align:center;font-size:0.72rem;color:var(--ink-3);padding:8px">
          سجّلي مزاجك يومياً لاكتشاف الأنماط
        </div>
      `}
    </div>
  `;
}

function renderLatestResult(latest) {
  const analysis = MentalHealth.detailedAnalysis(latest.score);
  const date = new Date(latest.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });

  return `
    ${sectionHeader('📊', 'آخر نتيجة')}
    <div class="card span-full" style="padding:16px;margin-bottom:16px;border-color:${analysis.color}">
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:12px">
        <span style="width:56px;height:56px;border-radius:18px;background:${analysis.color}15;display:grid;place-items:center;font-size:1.8rem;flex-shrink:0">${analysis.icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:0.68rem;color:var(--ink-3);font-weight:700">${date}</div>
          <div style="font-family:var(--font-heading);font-weight:900;font-size:1rem;color:${analysis.color};margin-top:2px">${analysis.level}</div>
        </div>
        <div style="text-align:center">
          <div style="font-family:var(--font-heading);font-weight:900;font-size:1.6rem;color:${analysis.color};line-height:1">${latest.score}</div>
          <div style="font-size:0.6rem;color:var(--ink-3);margin-top:2px">من 30</div>
        </div>
      </div>
      <div style="background:${analysis.color}10;border-radius:12px;padding:12px;font-size:0.74rem;color:var(--ink-2);line-height:1.7">
        ${analysis.advice}
      </div>
    </div>
  `;
}

function renderBreathingList(count) {
  return `
    <div class="span-full" style="margin-bottom:16px">
      ${MentalHealth.quickSessions.map(s => `
        <button onclick="ommyStartMHBreath('${s.pattern}')" type="button" style="width:100%;display:flex;align-items:center;gap:12px;padding:14px;border:1.5px solid var(--line);border-radius:16px;background:var(--cream);margin-bottom:10px;cursor:pointer;font-family:var(--font-body);text-align:start;transition:all .2s;box-shadow:0 2px 8px rgba(46,31,43,.04)">
          <span style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,var(--sky-soft),var(--lavender-soft));display:grid;place-items:center;font-size:1.5rem;flex-shrink:0">${s.icon}</span>
          <div style="flex:1;min-width:0">
            <div style="font-family:var(--font-heading);font-weight:900;font-size:0.85rem;color:var(--ink);margin-bottom:2px">${s.name}</div>
            <div style="font-size:0.7rem;color:var(--ink-3)">⏱️ ${s.duration}</div>
          </div>
          <span style="font-size:1.1rem;color:var(--clay-deep)">▶</span>
        </button>
      `).join('')}
      ${count > 0 ? `<div style="text-align:center;font-size:0.72rem;color:var(--ink-3);margin-top:8px">🌿 أكملتِ ${count} جلسة</div>` : ''}
    </div>
  `;
}

function renderEdinburghQuestion() {
  const q = MentalHealth.edinburghQuestions[mhState.currentQuestion];
  const total = MentalHealth.edinburghQuestions.length;
  const progress = Math.round((mhState.currentQuestion / total) * 100);

  return `
    <div style="grid-column:1/-1;width:100%">
      <div class="card span-full" style="padding:18px;margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-family:var(--font-heading);font-size:0.82rem;font-weight:900;color:var(--clay-deep)">السؤال ${mhState.currentQuestion + 1} من ${total}</div>
          <button onclick="ommyCancelEdinburgh()" type="button" style="background:transparent;border:none;color:var(--ink-3);font-size:0.75rem;cursor:pointer">إلغاء</button>
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

        <div id="mhBreathCircle" style="width:140px;height:140px;border-radius:50%;background:${phase.color};margin:0 auto 20px;transition:transform 1s ease,background .4s ease;display:grid;place-items:center;box-shadow:0 12px 32px rgba(46,31,43,.15)">
          <div id="mhBreathTimer" style="font-family:var(--font-heading);font-size:3rem;font-weight:900;color:#fff;line-height:1">${breathingState.timeLeft}</div>
        </div>

        <div id="mhBreathPhase" style="font-family:var(--font-heading);font-size:1.2rem;font-weight:900;color:${phase.color};margin-bottom:8px">${phase.name}</div>

        <div style="font-size:0.75rem;color:var(--ink-3)">الدورة: <b id="mhBreathCycles" style="color:var(--clay-deep);font-weight:900">${breathingState.cycle}</b></div>

        <button onclick="ommyStopMHBreath()" type="button" style="width:100%;margin-top:24px;padding:14px;border:none;border-radius:14px;background:linear-gradient(145deg,var(--rose),var(--clay-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer">⏸ إيقاف وحفظ</button>
      </div>
    </div>
  `;
}
