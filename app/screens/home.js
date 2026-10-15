/* ============================================
   شاشة اليوم — تصميم مستوحى من Nara Baby / Huckleberry
   ============================================ */
import { LogStore, BabyStore } from '../lib/storage.js';
import { Children } from '../lib/settings.js';

/* ============ دوال مساعدة ============ */
function relativeTime(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} د`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} س`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} ي`;
}

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function lastEvent(type) {
  const log = LogStore.today();
  const filtered = log.filter(e => e.type === type);
  return filtered.length > 0 ? filtered[filtered.length - 1] : null;
}

/* ============ أزرار التسجيل السريع ============ */
window.ommyQuick = function(action) {
  const labels = { feed: 'رضعة', sleep: 'نوم', diaper: 'حفاض', med: 'دواء' };
  const icons  = { feed: '🍼', sleep: '😴', diaper: '💧', med: '💊' };
  try { LogStore.add(action); } catch(e) { console.warn(e); }
  if (window.haptic) window.haptic('medium');
  if (window.toast) window.toast(`تم تسجيل ${labels[action]}`, {
    type: 'success', icon: icons[action], duration: 1500
  });
  setTimeout(() => {
    if (window.ommyRefresh) window.ommyRefresh();
  }, 300);
};

/* ============ عرض الشاشة ============ */
export function HomeScreen() {
  const active = Children.active();
  const baby = { ...BabyStore.updateAge(), name: active?.name || 'آدم' };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء الخير';
  const summary = LogStore.summary();

  /* آخر الأحداث */
  const lastFeed = lastEvent('feed');
  const lastSleep = lastEvent('sleep');
  const lastDiaper = lastEvent('diaper');

  /* تنسيق التاريخ */
  const today = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  return `
    <div style="grid-column:1/-1;width:100%">

      <!-- ============ بطاقة الترحيب ============ -->
      <div class="card--hero span-full" style="margin-bottom:var(--sp-4)">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--sp-3);margin-bottom:var(--sp-4)">
          <div style="flex:1;min-width:0">
            <div style="font-size:var(--fs-xs);opacity:.85;font-weight:600;margin-bottom:4px">${today}</div>
            <div style="font-family:var(--font-heading);font-size:var(--fs-xl);font-weight:900;line-height:1.25;color:#fff">${greeting}، سارة 🌸</div>
            <div style="font-size:var(--fs-sm);opacity:.9;margin-top:6px">
              كيف حال ${baby.name} اليوم؟
            </div>
          </div>
          <div style="width:60px;height:60px;border-radius:20px;background:rgba(255,255,255,.2);display:grid;place-items:center;font-size:2rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">👶</div>
        </div>

        <!-- شريط معلومات الطفل -->
        <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:100px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.22);font-size:var(--fs-xs);font-weight:700">
          <span style="font-size:1.1rem">${active?.gender === 'girl' ? '👧' : '👶'}</span>
          <span>${baby.name}</span>
          <span style="opacity:.7">·</span>
          <span style="opacity:.9">${baby.ageMonths || 14} شهراً</span>
        </div>

        <!-- شبكة الأرقام الأربعة -->
        <div class="grid-4" style="margin-top:var(--sp-4)">
          ${heroStat('🌙', summary.sleeps + 'س', 'نوم')}
          ${heroStat('🍼', summary.feeds, 'رضعات')}
          ${heroStat('💧', summary.diapers, 'حفاضات')}
          ${heroStat('💊', summary.meds, 'أدوية')}
        </div>
      </div>

      <!-- ============ تسجيل سريع ============ -->
      <div class="section-title span-full">
        <div class="section-title__label">
          <span class="section-title__icon" style="background:var(--rose-soft);color:var(--clay-deep)">⚡</span>
          <span>تسجيل سريع</span>
        </div>
      </div>

      <div class="grid-4 span-full" style="margin-bottom:var(--sp-3)">
        ${quickAction('🍼', 'رضعة', 'feed', 'rose')}
        ${quickAction('😴', 'نوم', 'sleep', 'lavender')}
        ${quickAction('💧', 'حفاض', 'diaper', 'sky')}
        ${quickAction('💊', 'دواء', 'med', 'honey')}
      </div>

      <!-- ============ آخر الأحداث ============ -->
      <div class="section-title span-full">
        <div class="section-title__label">
          <span class="section-title__icon" style="background:var(--mint-soft);color:var(--mint-deep)">🕐</span>
          <span>آخر الأحداث</span>
        </div>
      </div>

      ${lastFeed || lastSleep || lastDiaper ? `
        <div class="span-full" style="margin-bottom:var(--sp-3)">
          ${lastFeed ? recentItem('🍼', 'آخر رضعة', relativeTime(lastFeed.time), 'rose') : ''}
          ${lastSleep ? recentItem('😴', 'آخر نوم', relativeTime(lastSleep.time), 'lavender') : ''}
          ${lastDiaper ? recentItem('💧', 'آخر حفاض', relativeTime(lastDiaper.time), 'sky') : ''}
        </div>
      ` : `
        <div class="empty-state span-full" style="margin-bottom:var(--sp-3)">
          <span class="empty-state__icon">📝</span>
          <b>لا توجد أحداث اليوم</b>
          <p>ابدئي بتسجيل أول رضعة أو نوم من الأزرار أعلاه</p>
        </div>
      `}

      <!-- ============ المهام القادمة ============ -->
      <div class="section-title span-full">
        <div class="section-title__label">
          <span class="section-title__icon" style="background:var(--honey-soft);color:var(--honey-deep)">📅</span>
          <span>القادم</span>
        </div>
      </div>

      <div class="card span-full" style="margin-bottom:var(--sp-3)">
        ${upcomingItem('💉', 'تطعيم الحصبة (MMR)', 'الجرعة الأولى', '5', 'أيام', 'honey')}
        <div style="height:1px;background:var(--line);margin:var(--sp-3) 0"></div>
        ${upcomingItem('🩺', 'متابعة الطبيبة', 'عيادة د. هدى', '12', 'يوم', 'mint')}
      </div>

      <!-- ============ نصيحة اليوم ============ -->
      <div class="section-title span-full">
        <div class="section-title__label">
          <span class="section-title__icon" style="background:var(--lavender-soft);color:var(--lavender-deep)">💡</span>
          <span>نصيحة اليوم</span>
        </div>
      </div>

      <div class="card--soft card span-full" style="padding:var(--sp-4);border-radius:var(--radius-lg)">
        <div style="display:flex;gap:var(--sp-3);align-items:flex-start">
          <div style="width:44px;height:44px;border-radius:14px;background:#fff;display:grid;place-items:center;font-size:1.4rem;flex-shrink:0;box-shadow:var(--shadow-sm)">🌙</div>
          <div style="flex:1">
            <b style="display:block;font-family:var(--font-heading);font-size:var(--fs-sm);font-weight:900;color:var(--clay-deep);margin-bottom:4px">نوم أفضل</b>
            <p style="font-size:var(--fs-sm);color:var(--ink-2);line-height:1.75;margin:0">جرّبي تقليل الإضاءة قبل النوم بساعة، وابدئي روتيناً ثابتاً من 3 خطوات — أثره يظهر خلال أسبوع.</p>
          </div>
        </div>
      </div>

    </div>
  `;
}

/* ============ مكونات فرعية ============ */

function heroStat(icon, value, label) {
  return `
    <div style="background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.22);border-radius:16px;padding:12px 6px;text-align:center">
      <div style="font-size:1rem;margin-bottom:4px">${icon}</div>
      <div style="font-family:var(--font-heading);font-weight:900;font-size:var(--fs-base);line-height:1;color:#fff">${value}</div>
      <div style="font-size:0.62rem;opacity:.85;margin-top:4px">${label}</div>
    </div>
  `;
}

function quickAction(icon, label, action, color) {
  return `
    <button class="quick-action quick-action--${color}" onclick="ommyQuick('${action}')" type="button">
      <div class="quick-action__icon" style="background:var(--${color === 'honey' ? 'honey' : color === 'sky' ? 'sky' : color === 'lavender' ? 'lavender' : 'rose'}-soft)">
        ${icon}
      </div>
      <div class="quick-action__label">${label}</div>
      <div class="quick-action__plus">+</div>
    </button>
  `;
}

function recentItem(icon, label, time, color) {
  const bg = {
    rose: 'var(--rose-soft)',
    lavender: 'var(--lavender-soft)',
    sky: 'var(--sky-soft)',
    mint: 'var(--mint-soft)',
    honey: 'var(--honey-soft)'
  }[color] || 'var(--rose-soft)';

  return `
    <div class="recent-item" style="margin-bottom:var(--sp-2)">
      <span class="recent-item__icon" style="background:${bg}">${icon}</span>
      <div class="recent-item__body">
        <b>${label}</b>
        <span>${time}</span>
      </div>
    </div>
  `;
}

function upcomingItem(icon, title, subtitle, days, unit, color) {
  const bg = {
    honey: 'var(--honey-soft)',
    mint: 'var(--mint-soft)',
    rose: 'var(--rose-soft)',
    lavender: 'var(--lavender-soft)'
  }[color] || 'var(--rose-soft)';

  const fg = {
    honey: 'var(--honey-deep)',
    mint: 'var(--mint-deep)',
    rose: 'var(--clay-deep)',
    lavender: 'var(--lavender-deep)'
  }[color] || 'var(--clay-deep)';

  return `
    <div style="display:flex;align-items:center;gap:var(--sp-3)">
      <span style="width:48px;height:48px;border-radius:16px;background:${bg};display:grid;place-items:center;font-size:1.4rem;flex-shrink:0">${icon}</span>
      <div style="flex:1;min-width:0">
        <b style="display:block;font-family:var(--font-heading);font-size:var(--fs-sm);font-weight:900;color:var(--ink)">${title}</b>
        <span style="display:block;font-size:var(--fs-xs);color:var(--ink-3);margin-top:2px">${subtitle}</span>
      </div>
      <div style="text-align:center;flex-shrink:0">
        <div style="font-family:var(--font-heading);font-weight:900;font-size:var(--fs-lg);color:${fg};line-height:1">${days}</div>
        <div style="font-size:0.6rem;color:var(--ink-3);font-weight:700;margin-top:2px">${unit}</div>
      </div>
    </div>
  `;
}
