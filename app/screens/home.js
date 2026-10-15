/* ============================================
   شاشة اليوم — نسخة مستقرة
   ============================================ */
import { LogStore, BabyStore } from '../lib/storage.js';
import { Children } from '../lib/settings.js';
import { Timer } from '../lib/timer.js';
import { Predictions } from '../lib/predictions.js';
import { Summary } from '../lib/summary.js';
import { Tips } from '../lib/tips.js';
import { Temperature } from '../lib/temperature.js';

window.ommyQuick = function(action) {
  const labels = { feed: 'رضعة', sleep: 'نوم', diaper: 'حفاض', med: 'دواء' };
  const icons  = { feed: '🍼', sleep: '😴', diaper: '💧', med: '💊' };
  try { LogStore.add(action); } catch(e) {}
  if (window.haptic) window.haptic('medium');
  if (window.toast) window.toast('تم تسجيل ' + labels[action], {
    type: 'success', icon: icons[action], duration: 1500
  });
  setTimeout(() => {
    if (window.ommyRefresh) window.ommyRefresh();
  }, 300);
};

export function HomeScreen() {
  const active = Children.active();
  const baby = { ...BabyStore.updateAge(), name: active?.name || 'آدم' };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : 'مساء الخير';
  const summary = LogStore.summary();
  const today = new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });

  return `
    <div style="grid-column:1/-1;width:100%">

      <div class="card--hero span-full" style="margin-bottom:16px">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px">
          <div style="flex:1;min-width:0">
            <div style="font-size:0.72rem;opacity:.85;font-weight:600;margin-bottom:4px">${today}</div>
            <div style="font-family:var(--font-heading);font-size:1.4rem;font-weight:900;line-height:1.25;color:#fff">${greeting}، سارة 🌸</div>
            <div style="font-size:0.85rem;opacity:.9;margin-top:6px">كيف حال ${baby.name} اليوم؟</div>
          </div>
          <div style="width:60px;height:60px;border-radius:20px;background:rgba(255,255,255,.2);display:grid;place-items:center;font-size:2rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">👶</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
          ${heroStat('🌙', summary.sleeps + 'س', 'نوم')}
          ${heroStat('🍼', summary.feeds, 'رضعات')}
          ${heroStat('💧', summary.diapers, 'حفاضات')}
          ${heroStat('💊', summary.meds, 'أدوية')}
        </div>
      </div>

      ${renderSummaryCard()}

      ${renderTimer()}

      ${renderNextNap()}

      ${renderWeeklyChart()}

      ${renderTemperatureCard()}

      ${renderTipsCarousel()}

      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:20px 0 12px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:28px;height:28px;border-radius:10px;display:grid;place-items:center;font-size:1rem;background:var(--rose-soft);color:var(--clay-deep)">⚡</span>
          <span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900">تسجيل سريع</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">
        ${quickAction('🍼', 'رضعة', 'feed')}
        ${quickAction('😴', 'نوم', 'sleep')}
        ${quickAction('💧', 'حفاض', 'diaper')}
        ${quickAction('💊', 'دواء', 'med')}
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:20px 0 12px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:28px;height:28px;border-radius:10px;display:grid;place-items:center;font-size:1rem;background:var(--mint-soft);color:var(--mint-deep)">🕐</span>
          <span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900">آخر الأحداث</span>
        </div>
      </div>

      <div class="empty-state span-full" style="margin-bottom:16px">
        <span class="empty-state__icon">📝</span>
        <b>لا توجد أحداث اليوم</b>
        <p>ابدئي بتسجيل أول رضعة أو نوم من الأزرار أعلاه</p>
      </div>

    </div>
  `;
}

function heroStat(icon, value, label) {
  return '<div style="background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.22);border-radius:16px;padding:12px 6px;text-align:center">' +
    '<div style="font-size:1rem;margin-bottom:4px">' + icon + '</div>' +
    '<div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;line-height:1;color:#fff">' + value + '</div>' +
    '<div style="font-size:0.62rem;opacity:.85;margin-top:4px">' + label + '</div>' +
    '</div>';
}

function quickAction(icon, label, action) {
  return '<button onclick="ommyQuick(\'' + action + '\')" type="button" style="background:var(--cream);border:1px solid var(--line);border-radius:18px;padding:14px 6px;text-align:center;cursor:pointer;font-family:var(--font-body);transition:all .2s;box-shadow:0 2px 8px rgba(46,31,43,.04)">' +
    '<div style="width:52px;height:52px;border-radius:16px;background:var(--rose-soft);display:grid;place-items:center;font-size:1.6rem;margin:0 auto 8px">' + icon + '</div>' +
    '<div style="font-family:var(--font-heading);font-size:0.72rem;font-weight:800;color:var(--ink-2)">' + label + '</div>' +
    '</button>';
}

function renderTimer() {
  const timer = Timer.current();
  if (!timer) {
    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;grid-column:1/-1">' +
      '<button onclick="ommyStartTimer(\'feed\')" type="button" style="padding:14px;background:var(--cream);border:1.5px solid var(--rose);border-radius:16px;font-family:var(--font-heading);font-weight:800;font-size:0.82rem;color:var(--clay-deep);cursor:pointer">🍼 بدء رضعة</button>' +
      '<button onclick="ommyStartTimer(\'sleep\')" type="button" style="padding:14px;background:var(--cream);border:1.5px solid var(--rose);border-radius:16px;font-family:var(--font-heading);font-weight:800;font-size:0.82rem;color:var(--clay-deep);cursor:pointer">😴 بدء نوم</button>' +
      '</div>';
  }
  const icons = { feed: '🍼', sleep: '😴', diaper: '💧', med: '💊' };
  const elapsed = Timer.elapsed();
  const formatted = window.ommyFormatDuration ? window.ommyFormatDuration(elapsed) : '00:00';
  return '<div style="background:linear-gradient(135deg,var(--rose),var(--clay-deep));color:#fff;border-radius:20px;padding:16px;margin-bottom:16px;grid-column:1/-1;box-shadow:0 12px 32px rgba(198,93,123,.25)">' +
    '<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">' +
    '<span style="width:48px;height:48px;border-radius:16px;background:rgba(255,255,255,.22);display:grid;place-items:center;font-size:1.5rem">' + (icons[timer.type] || '⏱️') + '</span>' +
    '<div><div style="font-size:0.72rem;opacity:.85;font-weight:700">مؤقت نشط</div>' +
    '<div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900">' + timer.label + '</div></div>' +
    '</div>' +
    '<div id="timerDisplay" style="font-family:Cairo,monospace;font-size:2.5rem;font-weight:900;text-align:center;letter-spacing:2px;margin:12px 0;font-variant-numeric:tabular-nums">' + formatted + '</div>' +
    '<div style="display:flex;gap:8px">' +
    '<button onclick="ommyCancelTimer()" type="button" style="flex:1;padding:12px;border:1px solid rgba(255,255,255,.3);border-radius:14px;background:rgba(255,255,255,.2);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.8rem;cursor:pointer">إلغاء</button>' +
    '<button onclick="ommyStopTimer()" type="button" style="flex:1;padding:12px;border:none;border-radius:14px;background:#fff;color:var(--clay-deep);font-family:var(--font-heading);font-weight:900;font-size:0.8rem;cursor:pointer">⏹ إيقاف وحفظ</button>' +
    '</div>' +
    '</div>';
}

function renderNextNap() {
  const nap = Predictions.nextNap();
  if (!nap) {
    return '<div style="background:linear-gradient(135deg,var(--lavender-soft),var(--rose-soft));border:1.5px solid var(--rose);border-radius:20px;padding:16px;margin-bottom:16px;display:flex;gap:12px;align-items:center;grid-column:1/-1">' +
      '<span style="width:54px;height:54px;border-radius:18px;background:#fff;display:grid;place-items:center;font-size:1.6rem">⏰</span>' +
      '<div><div style="font-size:0.72rem;color:var(--ink-2);font-weight:800;margin-bottom:4px">القيلولة القادمة</div>' +
      '<div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--clay-deep)">سجّلي نوم أولاً</div>' +
      '<div style="font-size:0.7rem;color:var(--ink-3);margin-top:4px">حتى نحسب نافذة اليقظ بدقة</div></div>' +
      '</div>';
  }
  const label = window.ommyNextNapLabel ? window.ommyNextNapLabel() : '';
  const color = window.ommyNextNapColor ? window.ommyNextNapColor() : 'var(--clay-deep)';
  const startStr = nap.minTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  const endStr = nap.maxTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  return '<div style="background:linear-gradient(135deg,var(--lavender-soft),var(--rose-soft));border:1.5px solid var(--rose);border-radius:20px;padding:16px;margin-bottom:16px;display:flex;gap:12px;align-items:center;grid-column:1/-1">' +
    '<span style="width:54px;height:54px;border-radius:18px;background:#fff;display:grid;place-items:center;font-size:1.6rem">⏰</span>' +
    '<div style="flex:1"><div style="font-size:0.72rem;color:var(--ink-2);font-weight:800;margin-bottom:4px">القيلولة القادمة</div>' +
    '<div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:' + color + '">' + label + '</div>' +
    '<div style="font-size:0.7rem;color:var(--ink-3);margin-top:4px">النافذة: ' + startStr + ' – ' + endStr + ' · يقظ ' + nap.awakeMinutes + ' د</div></div>' +
    '</div>';
}

function renderWeeklyChart() {
  const feeds = Predictions.weeklyData('feed');
  const max = Predictions.maxWeekly('feed');
  const total = feeds.reduce((s, d) => s + d.count, 0);

  let bars = '';
  feeds.forEach(d => {
    const h = d.count === 0 ? 5 : Math.max(15, Math.round((d.count / max) * 100));
    const bg = d.isToday
      ? 'linear-gradient(180deg,var(--lavender),var(--lavender-deep))'
      : 'linear-gradient(180deg,var(--rose),var(--clay-deep))';
    bars += '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end;min-width:0">' +
      '<div style="width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center">' +
      '<span style="width:100%;max-width:24px;border-radius:10px 10px 4px 4px;display:block;height:' + h + '%;background:' + bg + '"></span>' +
      '</div>' +
      '<span style="font-size:0.62rem;font-weight:800;color:var(--ink-3)">' + d.shortLabel + '</span>' +
      '</div>';
  });

  return '<div style="background:var(--cream);border:1.5px solid var(--line);border-radius:20px;padding:16px;margin-bottom:16px;grid-column:1/-1;box-sizing:border-box;width:100%">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
    '<div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem">📊 الرضعات · آخر 7 أيام</div>' +
    '<div style="font-size:0.68rem;font-weight:800;color:var(--clay-deep);background:var(--rose-soft);padding:4px 10px;border-radius:100px">' + total + ' إجمالي</div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;align-items:end;height:100px;padding:8px 0">' + bars + '</div>' +
    '</div>';
}

/* ============ بطاقة الملخص ============ */
function renderSummaryCard() {
  const s = Summary.today();
  const progress = Summary.dailyProgress();

  return `
    <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:20px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(46,31,43,.04);grid-column:1/-1">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem">📋 ملخص اليوم</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:0.7rem;font-weight:900;color:var(--clay-deep)">${progress}%</span>
          <div style="width:36px;height:36px;border-radius:50%;background:conic-gradient(var(--rose) 0%, var(--rose) ${progress}%, var(--beige) ${progress}%, var(--beige) 100%);display:grid;place-items:center;position:relative">
            <span style="position:absolute;inset:4px;background:var(--cream);border-radius:50%"></span>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
        <div style="text-align:center;padding:12px 6px;background:var(--sand);border-radius:14px">
          <div style="font-size:1.3rem;margin-bottom:4px">🍼</div>
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--ink);line-height:1">${s.feeds}</div>
          <div style="font-size:0.62rem;font-weight:700;color:var(--ink-3);margin-top:4px">رضعات</div>
        </div>
        <div style="text-align:center;padding:12px 6px;background:var(--sand);border-radius:14px">
          <div style="font-size:1.3rem;margin-bottom:4px">😴</div>
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--ink);line-height:1">${s.totalSleepLabel}</div>
          <div style="font-size:0.62rem;font-weight:700;color:var(--ink-3);margin-top:4px">نوم كلي</div>
        </div>
        <div style="text-align:center;padding:12px 6px;background:var(--sand);border-radius:14px">
          <div style="font-size:1.3rem;margin-bottom:4px">💧</div>
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--ink);line-height:1">${s.diapers}</div>
          <div style="font-size:0.62rem;font-weight:700;color:var(--ink-3);margin-top:4px">حفاضات</div>
        </div>
      </div>

      ${s.sinceLastFeed !== null ? `
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:linear-gradient(135deg,var(--rose-soft),var(--lavender-soft));border-radius:14px">
          <span style="width:40px;height:40px;border-radius:14px;background:#fff;display:grid;place-items:center;font-size:1.3rem;flex-shrink:0">🍼</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.68rem;font-weight:800;color:var(--ink-2)">آخر رضعة</div>
            <div style="font-family:var(--font-heading);font-weight:900;font-size:0.85rem;color:var(--clay-deep);margin-top:2px">${s.sinceLastFeedLabel}</div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

/* ============ شريط النصائح ============ */
function renderTipsCarousel() {
  const tips = Tips.random(4);

  let cards = '';
  tips.forEach(t => {
    cards += '<div class="tip-card tip-card--' + t.color + '" onclick="ommyToast && ommyToast(\'' + t.title + '\', \'' + t.icon + '\')" style="flex:0 0 200px;background:var(--cream);border:1.5px solid var(--line);border-radius:20px;padding:16px;box-shadow:0 2px 8px rgba(46,31,43,.04);display:flex;flex-direction:column;gap:8px;cursor:pointer">' +
      '<div style="width:56px;height:56px;border-radius:18px;background:var(--' + t.color + '-soft);display:grid;place-items:center;font-size:1.8rem">' + t.icon + '</div>' +
      '<div style="font-size:0.65rem;font-weight:800;color:var(--clay-deep);background:var(--rose-soft);padding:3px 10px;border-radius:100px;align-self:flex-start">' + t.category + '</div>' +
      '<div style="font-family:var(--font-heading);font-weight:900;font-size:0.85rem;color:var(--ink);line-height:1.3">' + t.title + '</div>' +
      '<div style="font-size:0.72rem;color:var(--ink-2);line-height:1.6;flex:1">' + t.desc + '</div>' +
      '<div style="font-size:0.62rem;color:var(--ink-3);font-weight:700">👶 ' + t.age + '</div>' +
      '</div>';
  });

  return `
    <div style="display:flex;align-items:center;gap:8px;margin:20px 0 12px;grid-column:1/-1">
      <span style="width:28px;height:28px;border-radius:10px;display:grid;place-items:center;font-size:1rem;background:var(--honey-soft);color:var(--honey-deep)">💡</span>
      <span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900">نصائح لكِ</span>
      <span style="flex:1;height:1px;background:var(--line)"></span>
    </div>
    <div style="display:flex;gap:12px;overflow-x:auto;padding:4px 0 12px;grid-column:1/-1;scrollbar-width:none;-webkit-overflow-scrolling:touch">
      ${cards}
    </div>
  `;
}

/* ============ بطاقة الحرارة ============ */
function renderTemperatureCard() {
  const latest = Temperature.latest();
  const all = Temperature.list().slice(0, 5);

  if (!latest) {
    return `
      <div style="background:linear-gradient(135deg,var(--mint-soft),var(--sky-soft));border:1.5px solid var(--mint);border-radius:20px;padding:16px;margin-bottom:16px;grid-column:1/-1;display:flex;gap:12px;align-items:center;cursor:pointer" onclick="ommyAddTemp()">
        <span style="width:52px;height:52px;border-radius:16px;background:#fff;display:grid;place-items:center;font-size:1.6rem;flex-shrink:0">🌡️</span>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--mint-deep);margin-bottom:3px">قياس الحرارة</div>
          <div style="font-size:0.74rem;color:var(--ink-2)">لم تُسجَّل قياسات اليوم</div>
        </div>
        <span style="font-size:1.5rem;color:var(--mint-deep)">+</span>
      </div>
    `;
  }

  const info = Temperature.interpret(latest.temp);
  const timeAgo = (() => {
    const diff = Math.floor((Date.now() - new Date(latest.time).getTime()) / 60000);
    if (diff < 1) return 'الآن';
    if (diff < 60) return `منذ ${diff} د`;
    return `منذ ${Math.floor(diff / 60)} س`;
  })();

  return `
    <div style="background:linear-gradient(135deg,var(--mint-soft),var(--sky-soft));border:1.5px solid var(--mint);border-radius:20px;padding:16px;margin-bottom:16px;grid-column:1/-1">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--mint-deep)">🌡️ الحرارة</div>
        <button onclick="ommyAddTemp()" type="button" style="background:var(--mint-deep);color:#fff;border:none;border-radius:100px;padding:6px 14px;font-family:var(--font-heading);font-weight:900;font-size:0.72rem;cursor:pointer">+ قياس جديد</button>
      </div>

      <div style="display:flex;gap:14px;align-items:center;padding:14px;background:#fff;border-radius:16px;margin-bottom:12px">
        <span style="width:60px;height:60px;border-radius:18px;background:${info.color}20;display:grid;place-items:center;font-size:1.8rem;flex-shrink:0">${info.icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--font-heading);font-weight:900;font-size:1.5rem;color:${info.color};line-height:1">${latest.temp}°<span style="font-size:0.9rem">م</span></div>
          <div style="font-size:0.72rem;color:var(--ink-2);margin-top:4px"><b style="color:${info.color}">${info.label}</b> · ${timeAgo}</div>
          <div style="font-size:0.68rem;color:var(--ink-3);margin-top:2px">${info.advice}</div>
        </div>
      </div>

      ${all.length > 1 ? `
        <div style="display:flex;gap:6px;overflow-x:auto;padding:4px 0">
          ${all.slice(1).map(t => {
            const i = Temperature.interpret(t.temp);
            const time = new Date(t.time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
            return `<div style="flex:0 0 auto;padding:8px 12px;background:#fff;border-radius:12px;text-align:center;border:1px solid var(--line)">
              <div style="font-family:var(--font-heading);font-weight:900;font-size:0.82rem;color:${i.color}">${t.temp}°</div>
              <div style="font-size:0.6rem;color:var(--ink-3);margin-top:2px">${time}</div>
            </div>`;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}
