import { LogStore, BabyStore, Storage } from '../lib/storage.js';
import { Children } from '../lib/settings.js';

window.ommyQuick = function(action) {
  const labels = { feed: 'رضعة', sleep: 'نوم', diaper: 'حفاض', med: 'دواء' };
  const icons  = { feed: '🍼', sleep: '😴', diaper: '🧷', med: '💊' };
  try { LogStore.add({ type: action, action }); }
  catch (e) { console.warn('LogStore error:', e); }
  if (window.haptic) window.haptic('medium');
  if (window.toast) window.toast('تم تسجيل ' + (labels[action] || action), { type: 'success', icon: icons[action] || '📝', duration: 1500 });
  setTimeout(() => { if (window.ommyRefresh) window.ommyRefresh(); }, 250);
};

export function HomeScreen() {
  const active = Children.active();
  const baby = { ...BabyStore.updateAge(), name: active?.name || 'آدم' };
  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'صباحكِ حُب' : hour < 17 ? 'نهاركِ جميل' : 'مساؤكِ هادئ';
  const summary = LogStore.summary();
  const today = LogStore.today();
  const total = summary.total || 0;
  const goal = 8;
  const progress = Math.min(100, Math.round(total / goal * 100));
  const week = getWeekActivity();

  return `
    <div class="mom-dashboard" style="grid-column:1/-1;width:100%">
      <section class="mom-welcome">
        <div class="mom-welcome__glow mom-welcome__glow--one"></div>
        <div class="mom-welcome__glow mom-welcome__glow--two"></div>
        <div class="mom-welcome__top">
          <div class="mom-avatar" aria-hidden="true"><span>♡</span></div>
          <div class="mom-welcome__copy">
            <div class="mom-eyebrow">رفيقكِ في رحلة الأمومة</div>
            <h1>${greeting}، يا أمّ ${escapeHtml(baby.name)}</h1>
            <p>كل يوم تتعلمين شيئًا جديدًا… وأنتِ تقومين بعمل رائع 💗</p>
          </div>
          <span class="mom-sparkle" aria-hidden="true">✦</span>
        </div>
        <div class="mom-baby-pill"><span>👶</span><span><b>${escapeHtml(baby.name)}</b><small>${baby.ageMonths ?? 0} شهرًا من الحب</small></span><span class="mom-pill-heart">♥</span></div>
        <div class="mom-today-stats">
          ${statBox('😴', formatSleep(summary.sleeps), 'سجل النوم', 'lilac')}
          ${statBox('🍼', summary.feeds, 'رضعة', 'rose')}
          ${statBox('🧷', summary.diapers, 'حفاض', 'sage')}
          ${statBox('💊', summary.meds, 'دواء', 'honey')}
        </div>
      </section>

      <section class="mom-section mom-quick-section">
        <div class="mom-section-heading"><div><span class="mom-kicker">بسهولة وفي ثوانٍ</span><h2>ماذا نُسجّل اليوم؟</h2></div><span class="mom-heading-mark">✳</span></div>
        <div class="mom-quick-grid">
          ${quickBtn('🍼', 'رضعة', 'feed', 'rose')}
          ${quickBtn('🌙', 'نوم', 'sleep', 'lilac')}
          ${quickBtn('🧷', 'حفاض', 'diaper', 'sage')}
          ${quickBtn('💊', 'دواء', 'med', 'honey')}
        </div>
      </section>

      <section class="mom-progress-card">
        <div class="mom-progress-icon">🌷</div>
        <div class="mom-progress-copy"><span>خطوات صغيرة، فرق كبير</span><b>أنجزتِ ${total} من ${goal} تسجيلات اليوم</b><div class="mom-progress-track"><i style="width:${progress}%"></i></div></div>
        <strong>${progress}%</strong>
      </section>

      <section class="mom-section">
        <div class="mom-section-heading"><div><span class="mom-kicker">نظرة لطيفة على أسبوعكِ</span><h2>نشاط هذا الأسبوع</h2></div><span class="mom-heading-mark">↗</span></div>
        <div class="mom-week-card">
          <div class="mom-week-chart">${week.map(day => `<div class="mom-week-day"><div class="mom-week-bar-wrap"><i style="height:${day.height}%" title="${day.count} تسجيلات"></i></div><b>${day.label}</b></div>`).join('')}</div>
          <div class="mom-week-note"><span>🌸</span><span>كل تسجيل يساعدكِ على فهم روتين ${escapeHtml(baby.name)} بشكل أفضل.</span></div>
        </div>
      </section>

      <section class="mom-section">
        <div class="mom-section-heading"><div><span class="mom-kicker">لحظات اليوم</span><h2>آخر التسجيلات</h2></div><span class="mom-heading-mark">⌁</span></div>
        ${renderRecent(today)}
      </section>

      <section class="mom-section">
        <div class="mom-section-heading"><div><span class="mom-kicker">لا تنسي نفسكِ أيضًا</span><h2>موعد ونصيحة</h2></div></div>
        <article class="mom-reminder-card"><div class="mom-reminder-icon mom-reminder-icon--honey">🩺</div><div class="mom-reminder-copy"><b>متابعة صحة صغيركِ</b><p>احتفظي بمواعيد التطعيم والمتابعة في مكان واحد.</p></div><span class="mom-reminder-arrow">‹</span></article>
        <article class="mom-tip-card"><div class="mom-tip-card__icon">💗</div><div><span>رسالة أُمّي لكِ</span><p>لستِ مطالبة بأن يكون كل شيء مثاليًا. وجودكِ واهتمامكِ ومحاولاتكِ اليومية تعني الكثير.</p></div></article>
      </section>
    </div>
  `;
}

function statBox(icon, value, label, tone) {
  return `<div class="mom-stat mom-stat--${tone}"><span class="mom-stat__icon">${icon}</span><b>${value}</b><small>${label}</small></div>`;
}
function quickBtn(icon, label, action, tone) {
  return `<button class="mom-quick-btn mom-quick-btn--${tone}" onclick="ommyQuick('${action}')" type="button"><span class="mom-quick-btn__icon">${icon}</span><b>${label}</b><span class="mom-quick-btn__plus">＋</span></button>`;
}
function formatSleep(value) { return `${Number(value) || 0}`; }
function getWeekActivity() {
  const names = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
  const now = new Date();
  const items = [];
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(now); d.setDate(now.getDate() - offset);
    const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const key = `ommi_log_${dayKey}`;
    let count = 0;
    try { count = (JSON.parse(localStorage.getItem(key) || '[]') || []).length; } catch (_) {}
    items.push({ label: offset === 0 ? 'اليوم' : names[d.getDay()], count, height: count ? Math.max(14, Math.min(100, count * 13)) : 7 });
  }
  return items;
}
function renderRecent(log) {
  const recent = (log || []).slice(-4).reverse();
  if (!recent.length) return `<div class="mom-empty"><span>☁️</span><b>يومكِ يبدأ بلحظة صغيرة</b><p>سجّلي أول رضعة أو نوم، وسنحتفظ بالتفاصيل هنا.</p></div>`;
  const meta = {
    feed: { icon: '🍼', label: 'رضعة', tone: 'rose' },
    sleep: { icon: '🌙', label: 'نوم', tone: 'lilac' },
    diaper: { icon: '🧷', label: 'حفاض', tone: 'sage' },
    med: { icon: '💊', label: 'دواء', tone: 'honey' }
  };
  return `<div class="mom-recent-list">${recent.map(e => {
    const m = meta[e.type] || { icon: '📝', label: e.type || 'تسجيل', tone: 'rose' };
    const time = new Date(e.time).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
    return `<div class="mom-recent-item"><span class="mom-recent-item__icon mom-tone-${m.tone}">${m.icon}</span><div><b>${m.label}</b><small>${time}</small></div><span class="mom-recent-check">✓</span></div>`;
  }).join('')}</div>`;
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
}
