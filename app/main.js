import { HomeScreen } from './screens/home.js';
import { NutritionScreen } from './screens/nutrition.js';
import { SleepScreen } from './screens/sleep.js';
import { PregnancyScreen } from './screens/pregnancy.js';
import { GrowthScreen } from './screens/growth.js';
import { VaccinesScreen } from './screens/vaccines.js';
import { AssistantScreen } from './screens/assistant.js';
import { FirstAidScreen } from './screens/firstaid.js';
import { SettingsScreen } from './screens/settings.js';
import { BreastfeedingScreen } from './screens/breastfeeding.js';
import { MentalHealthScreen } from './screens/mental-health.js';
import './lib/mental-health.js';
import { AboutScreen } from './screens/about.js';
import { MemoriesScreen } from './screens/memories.js';
import { SafetyScreen } from './screens/safety.js';
import { MilestonesScreen } from './screens/milestones.js';
import { ActivitiesScreen } from './screens/activities.js';
import { DuasScreen } from './screens/duas.js';
import { SelfCareScreen } from './screens/selfcare.js';
import { StoriesScreen } from './screens/stories.js';
import { MedicationsScreen } from './screens/medications.js';
import { PregnancyCalcScreen } from './screens/pregnancy-calc.js';
import { HospitalBagScreen } from './screens/hospital-bag.js';
import './lib/badges.js';
import './lib/medications.js';
import './lib/cloud.js';
import './lib/social.js';
import { FoodsByAge, ArabicRecipes, VaccineTimeline, FirstAidScenarios, SleepTips, NutritionTips } from './lib/content.js';
import { WeeklyMealPlan, GrowthMilestones, SafetyTips, Duas, ArabicRecipes2, Activities, Warnings, WHOData, MomSelfCare } from './lib/content2.js';
import { LogStore, BabyStore } from './lib/storage.js';
import { toast, haptic } from './lib/toast.js';
import { ommyAlert, ommyConfirm, ommyPrompt } from './lib/modal.js';
import './lib/notifications.js';
import './lib/timer.js';
import './lib/silent.js';
import './lib/predictions.js';
import './lib/summary.js';
import './lib/report.js';
import './lib/temperature.js';
import './lib/tips.js';
import './lib/multi-child.js';
import './lib/notifications.js';
import './lib/audio.js';
import './lib/sync.js';
import './lib/whatsapp.js';
import './lib/family.js';
import './lib/auto-sync.js';

/* اجعلها متاحة عالمياً للأزرار inline */
window.toast = toast;
window.ommyContent = { FoodsByAge, ArabicRecipes, VaccineTimeline, FirstAidScenarios, SleepTips, NutritionTips };
window.ommyContent2 = { WeeklyMealPlan, GrowthMilestones, SafetyTips, Duas, ArabicRecipes2, Activities, Warnings, WHOData, MomSelfCare };
window.ommyAlert = ommyAlert;
window.ommyConfirm = ommyConfirm;
window.ommyPrompt = ommyPrompt;
window.ommyToast = function(msg, icon) { toast(msg, { type: 'info', icon: icon, duration: 1800 }); };
window.haptic = haptic;

const routes = {
  home:      { label: 'اليوم',     icon: '🏠', view: HomeScreen },
  nutrition: { label: 'التغذية',   icon: '🍲', view: NutritionScreen },
  sleep:     { label: 'النوم',     icon: '🌙', view: SleepScreen },
  pregnancy: { label: 'الحمل',     icon: '🤰', view: PregnancyScreen },
  growth:    { label: 'النمو',     icon: '📈', view: GrowthScreen },
  vaccines:  { label: 'التطعيمات', icon: '💉', view: VaccinesScreen },
  assistant: { label: 'المساعد',   icon: '💬', view: AssistantScreen },
  firstaid:  { label: 'الإسعافات', icon: '🚨', view: FirstAidScreen },
  settings:  { label: 'الإعدادات', icon: '⚙️', view: SettingsScreen },
  memories:  { label: 'المذكرة', icon: '💝', view: MemoriesScreen },
  about:     { label: 'عن التطبيق', icon: 'ℹ️', view: AboutScreen },
  safety:    { label: 'السلامة', icon: '🛡️', view: SafetyScreen },
  milestones: { label: 'معالم التطور', icon: '🌱', view: MilestonesScreen },
  activities: { label: 'أنشطة', icon: '🎨', view: ActivitiesScreen },
  duas:      { label: 'أدعية', icon: '🤲', view: DuasScreen },
  selfcare:  { label: 'العناية بالأم', icon: '🌸', view: SelfCareScreen },
  stories:   { label: 'قصص', icon: '📚', view: StoriesScreen },
  medications: { label: 'الأدوية', icon: '💊', view: MedicationsScreen },
  pregcalc:  { label: 'حاسبة الحمل', icon: '🤰', view: PregnancyCalcScreen },
  bag:       { label: 'حقيبة الولادة', icon: '🧳', view: HospitalBagScreen },
};

export const state = {
  currentRoute: 'home',
  theme: localStorage.getItem('ommi-theme') || 'light',
  baby: BabyStore.get(),
};

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  
/* ============================================
   وضع المطر والغيوم
   ============================================ */

function activateRainyMode() {
  /* إنشاء حاوية المطر إذا لم تكن موجودة */
  let rainContainer = document.getElementById('rainLayer');
  if (!rainContainer) {
    rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    rainContainer.id = 'rainLayer';
    document.body.appendChild(rainContainer);

    /* وميض خفيف */
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    document.body.appendChild(lightning);

    /* إنشاء 60 قطرة مطر */
    for (let i = 0; i < 60; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = Math.random() * 100 + '%';
      drop.style.animationDuration = (0.5 + Math.random() * 0.7) + 's';
      drop.style.animationDelay = (Math.random() * 2) + 's';
      drop.style.opacity = 0.3 + Math.random() * 0.5;
      rainContainer.appendChild(drop);
    }
  }
}

function toggleRainyMode() {
  const current = state.theme;
  if (current === 'rainy') {
    /* أوقف المطر — ارجع للوضع السابق أو الفاتح */
    state.theme = 'light';
  } else {
    state.theme = 'rainy';
    activateRainyMode();
  }
  /* sidebar starts open */
if (window.innerWidth > 900 && matchMedia('(hover: hover)').matches) {
  document.body.classList.remove('sidebar-collapsed');
}

/* ============ دوال المساعد العامة ============ */
const ommyChatReplies = {
  'كيف أزيد وزن آدم؟': 'لزيادة الوزن بشكل صحي 🌱<br>• مصادر دهون صحية: زبدة اللوز، الأفوكادو.<br>• 5 وجبات صغيرة بدل 3 كبيرة.<br>• لا تُجبريه على الأكل.<br><br>إذا استمر نقص الوزن، راجعي الطبيبة.',
  'متى يبدأ المشي؟': 'المشي بين 11 و15 شهراً 👣<br>• بعض الأطفال في 9 وآخرون في 18.<br>• شجّعيه بالمشي حافياً.<br><br>راجعي الطبيبة إذا لم يمشِ بعد 18 شهراً.',
  'آدم رفض الرضعة': 'رفض الرضعة شائع 🍼<br>• جرّبي تدفئة الحليب.<br>• غيّري المكان أو الوضعية.<br>• راقبي ألم الأسنان.<br><br>إذا رفض أكثر من 8 ساعات، راجعي الطبيبة.',
  'نصائح لنوم أطول': 'لنوم أطول 🌙<br>• روتين مسائي من 3 خطوات.<br>• إضاءة خافتة قبل النوم بساعة.<br>• لا شاشات بعد 6 مساءً.<br>• نفس الوقت يومياً.'
};

window.ommyChat = function(btn) {
  ommyChatSendText(btn.dataset.q);
};

window.ommyChatSend = function() {
  const inp = document.getElementById('chatInput');
  if (!inp) return;
  const v = inp.value.trim();
  if (!v) return;
  inp.value = '';
  ommyChatSendText(v);
};

function ommyChatSendText(text) {
  const wrap = document.getElementById('chatWrap');
  if (!wrap || !text) return;

  const u = document.createElement('div');
  u.style.cssText = 'max-width:85%;padding:12px 16px;border-radius:16px 16px 4px 16px;font-size:0.82rem;line-height:1.7;align-self:flex-end;background:linear-gradient(145deg,#10B981,#047857);color:#fff;';
  u.textContent = text;
  wrap.appendChild(u);
  wrap.scrollTop = wrap.scrollHeight;

  const t = document.createElement('div');
  t.style.cssText = 'max-width:85%;padding:14px 18px;border-radius:16px 16px 16px 4px;background:linear-gradient(135deg,#ECFDF5,#D1FAE5);border:1px solid #A7F3D0;align-self:flex-start;display:flex;gap:4px;align-items:center;';
  t.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:#059669;animation:ommyBlink 1.2s infinite"></span><span style="width:6px;height:6px;border-radius:50%;background:#059669;animation:ommyBlink 1.2s infinite .2s"></span><span style="width:6px;height:6px;border-radius:50%;background:#059669;animation:ommyBlink 1.2s infinite .4s"></span>';
  wrap.appendChild(t);
  wrap.scrollTop = wrap.scrollHeight;

  setTimeout(() => {
    t.remove();
    const b = document.createElement('div');
    b.style.cssText = 'max-width:85%;padding:12px 16px;border-radius:16px 16px 16px 4px;font-size:0.82rem;line-height:1.7;background:linear-gradient(135deg,#ECFDF5,#D1FAE5);color:var(--ink);border:1px solid #A7F3D0;';
    b.innerHTML = ommyChatReplies[text] || 'سؤال رائع 🌸<br>هذا الموضوع يحتاج تفاصيل أكثر. اكتبي الحالة بدقة أو راجعي الطبيبة.';
    wrap.appendChild(b);
    wrap.scrollTop = wrap.scrollHeight;
  }, 1100);
}

/* أضف نمط للحركة */
if (!document.getElementById('ommyChatStyle')) {
  const s = document.createElement('style');
  s.id = 'ommyChatStyle';
  s.textContent = '@keyframes ommyBlink{0%,60%,100%{opacity:.3}30%{opacity:1}}';
  document.head.appendChild(s);
}


document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('ommi-theme', state.theme);
  render();
}

/* === تفعيل المطر عند تحميل الصفحة إذا كان الوضع الحالي ممطراً === */
if (state.theme === 'rainy') {
  activateRainyMode();
}

/* === ربط زر المطر === */
document.addEventListener('click', (e) => {
  if (e.target.closest('#rainBtnSidebar')) {
    toggleRainyMode();
    haptic('medium');
    toast(state.theme === 'rainy' ? '☔ وضع المطر مُفعَّل' : '☀️ عاد النهار', {
      type: 'info',
      duration: 1800,
    });
    return;
  }
});

/* sidebar starts open */
if (window.innerWidth > 900 && matchMedia('(hover: hover)').matches) {
  document.body.classList.remove('sidebar-collapsed');
}

/* ============ دوال المساعد العامة ============ */
const ommyChatReplies = {
  'كيف أزيد وزن آدم؟': 'لزيادة الوزن بشكل صحي 🌱<br>• مصادر دهون صحية: زبدة اللوز، الأفوكادو.<br>• 5 وجبات صغيرة بدل 3 كبيرة.<br>• لا تُجبريه على الأكل.<br><br>إذا استمر نقص الوزن، راجعي الطبيبة.',
  'متى يبدأ المشي؟': 'المشي بين 11 و15 شهراً 👣<br>• بعض الأطفال في 9 وآخرون في 18.<br>• شجّعيه بالمشي حافياً.<br><br>راجعي الطبيبة إذا لم يمشِ بعد 18 شهراً.',
  'آدم رفض الرضعة': 'رفض الرضعة شائع 🍼<br>• جرّبي تدفئة الحليب.<br>• غيّري المكان أو الوضعية.<br>• راقبي ألم الأسنان.<br><br>إذا رفض أكثر من 8 ساعات، راجعي الطبيبة.',
  'نصائح لنوم أطول': 'لنوم أطول 🌙<br>• روتين مسائي من 3 خطوات.<br>• إضاءة خافتة قبل النوم بساعة.<br>• لا شاشات بعد 6 مساءً.<br>• نفس الوقت يومياً.'
};

window.ommyChat = function(btn) {
  ommyChatSendText(btn.dataset.q);
};

window.ommyChatSend = function() {
  const inp = document.getElementById('chatInput');
  if (!inp) return;
  const v = inp.value.trim();
  if (!v) return;
  inp.value = '';
  ommyChatSendText(v);
};

function ommyChatSendText(text) {
  const wrap = document.getElementById('chatWrap');
  if (!wrap || !text) return;

  const u = document.createElement('div');
  u.style.cssText = 'max-width:85%;padding:12px 16px;border-radius:16px 16px 4px 16px;font-size:0.82rem;line-height:1.7;align-self:flex-end;background:linear-gradient(145deg,#10B981,#047857);color:#fff;';
  u.textContent = text;
  wrap.appendChild(u);
  wrap.scrollTop = wrap.scrollHeight;

  const t = document.createElement('div');
  t.style.cssText = 'max-width:85%;padding:14px 18px;border-radius:16px 16px 16px 4px;background:linear-gradient(135deg,#ECFDF5,#D1FAE5);border:1px solid #A7F3D0;align-self:flex-start;display:flex;gap:4px;align-items:center;';
  t.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:#059669;animation:ommyBlink 1.2s infinite"></span><span style="width:6px;height:6px;border-radius:50%;background:#059669;animation:ommyBlink 1.2s infinite .2s"></span><span style="width:6px;height:6px;border-radius:50%;background:#059669;animation:ommyBlink 1.2s infinite .4s"></span>';
  wrap.appendChild(t);
  wrap.scrollTop = wrap.scrollHeight;

  setTimeout(() => {
    t.remove();
    const b = document.createElement('div');
    b.style.cssText = 'max-width:85%;padding:12px 16px;border-radius:16px 16px 16px 4px;font-size:0.82rem;line-height:1.7;background:linear-gradient(135deg,#ECFDF5,#D1FAE5);color:var(--ink);border:1px solid #A7F3D0;';
    b.innerHTML = ommyChatReplies[text] || 'سؤال رائع 🌸<br>هذا الموضوع يحتاج تفاصيل أكثر. اكتبي الحالة بدقة أو راجعي الطبيبة.';
    wrap.appendChild(b);
    wrap.scrollTop = wrap.scrollHeight;
  }, 1100);
}

/* أضف نمط للحركة */
if (!document.getElementById('ommyChatStyle')) {
  const s = document.createElement('style');
  s.id = 'ommyChatStyle';
  s.textContent = '@keyframes ommyBlink{0%,60%,100%{opacity:.3}30%{opacity:1}}';
  document.head.appendChild(s);
}


document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('ommi-theme', state.theme);
  render();
}

export function navigate(route) {
  if (!routes[route]) return;
  state.currentRoute = route;
  render();
  requestAnimationFrame(() => {
    document.querySelector('.content')?.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.title = 'أُمّي · ' + routes[route].label;
  haptic('light');
}

function renderSidebar() {
  return `
    <aside class="sidebar">
      <div class="sidebar__brand">
        <div class="sidebar__logo">أ</div>
        <div>
          <div class="sidebar__title">أُمّي</div>
          <div class="sidebar__subtitle">رفيق الأم العربية</div>
        </div>
      </div>
      <nav class="sidebar__nav">
        ${Object.entries(routes).map(([key, r]) => `
          <button class="sidebar__item" data-route="${key}" aria-selected="${key === state.currentRoute}">
            <span class="sidebar__item-icon">${r.icon}</span>
            <span>${r.label}</span>
          </button>
        `).join('')}
      </nav>
      <div class="sidebar__footer">
        <div class="sidebar__baby">
          <div class="sidebar__baby-avatar">👶</div>
          <div class="sidebar__baby-info">
            <b>${state.baby.name}</b>
            <span>${state.baby.ageMonths || 14} شهراً</span>
          </div>
        </div>
        <button class="sidebar__theme-btn" id="themeBtnSidebar" type="button">
          <span>${state.theme === 'dark' ? '☀️' : state.theme === 'rainy' ? '☀️' : '🌙'}</span>
          <span>${state.theme === 'dark' ? 'نهاري' : state.theme === 'rainy' ? 'نهاري' : 'ليلي'}</span>
        </button>
        <button class="rain-toggle-btn" id="rainBtnSidebar" type="button">
          <span>${state.theme === 'rainy' ? '☀️' : '🌧️'}</span>
          <span>${state.theme === 'rainy' ? 'إيقاف المطر' : 'وضع المطر'}</span>
        </button>
      </div>
    </aside>
  `;
}

function renderMobileBar(route) {
  return `
    <header class="app-bar">
      <button class="app-bar__btn app-bar__menu-btn" id="menuBtn" aria-label="القائمة" type="button" onclick="window.ommyToggle(); return false;">☰</button>
      <div class="app-bar__mobile-logo">أ</div>
      <button class="app-bar__child-btn" id="childPickerBtn" onclick="ommyChildPicker()" type="button" title="تبديل الطفل">
        <span id="childPickerIcon">👶</span>
      </button>
      <div class="app-bar__title">${route.label}</div>
      <button class="app-bar__btn" id="themeBtnMobile" aria-label="الوضع" type="button">
        ${state.theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  `;
}

function renderTabBar() {
  return `
    <nav class="tab-bar">
      ${Object.entries(routes).map(([key, r]) => `
        <button class="tab-bar__item" data-route="${key}" aria-selected="${key === state.currentRoute}" type="button">
          <span class="tab-bar__icon">${r.icon}</span>
          <span>${r.label}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

function render() {
  const app = document.getElementById('app');
  const route = routes[state.currentRoute];
  app.innerHTML = `
    <div class="app-shell">
      ${renderSidebar()}
      <div class="app-main">
        ${renderMobileBar(route)}
        <main class="content">${route.view(state)}</main>
        ${renderTabBar()}
      </div>
    </div>
    ${renderWhatsAppButton()}
  `;
  setTimeout(animations, 50);
}

function animations() {
  document.querySelectorAll('.bar-chart__item i').forEach((bar, i) => {
    setTimeout(() => { bar.style.height = bar.dataset.h; }, i * 80);
  });
  const ring = document.getElementById('pregRing');
  if (ring) setTimeout(() => {
    ring.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.2,.8,.2,1)';
    ring.style.strokeDashoffset = ring.dataset.ring;
  }, 300);
  const bagBar = document.querySelector('.bag__progress i');
  if (bagBar) setTimeout(() => { bagBar.style.width = bagBar.dataset.w; }, 300);
}

/* === فتح/إغلاق الشريط === */
function toggleSidebar() {
  document.body.classList.toggle('sidebar-collapsed');
  haptic('light');
}


/* === للوصول من onclick مباشرة === */
window.ommyToggle = function() {
  document.body.classList.toggle('sidebar-collapsed');
  var isClosed = document.body.classList.contains('sidebar-collapsed');
  console.log('Sidebar now:', isClosed ? 'CLOSED' : 'OPEN');
  return false;
};
window.toggleSidebar = window.ommyToggle;

/* === مستمع النقر الموحّد === */
document.addEventListener('click', (e) => {
  if (e.target.closest('#menuBtn')) {
    document.body.classList.toggle('sidebar-collapsed');
    if (window.haptic) window.haptic('light');
    return;
  }
  if (e.target.closest('#themeBtnMobile') || e.target.closest('#themeBtnSidebar')) { toggleTheme(); return; }

  /* إغلاق الشريط عند النقر خارجه (جوال) */
  if (window.innerWidth <= 900 && !document.body.classList.contains('sidebar-collapsed')) {
    if (!e.target.closest('.sidebar') && !e.target.closest('#menuBtn')) {
      /* sidebar starts open */
      return;
    }
  }

  /* التنقل */
  const routeBtn = e.target.closest('[data-route]');
  if (routeBtn) {
    e.preventDefault();
    if (window.innerWidth <= 900) {
      document.body.classList.add('sidebar-collapsed');
    }
    const r = routeBtn.dataset.route;
    if (r && r !== state.currentRoute) navigate(r);
    return;
  }

  /* أزرار التسجيل السريع */
  const quick = e.target.closest('.quick-btn');
  if (quick) {
    const a = quick.dataset.action;
    const labels = { feed: 'رضعة', sleep: 'نوم', diaper: 'حفاض', med: 'دواء' };
    const icons = { feed: '🍼', sleep: '😴', diaper: '💧', med: '💊' };
    quick.classList.add('tapped');
    setTimeout(() => quick.classList.remove('tapped'), 300);
    try { LogStore.add(a); } catch (err) {}
    haptic('medium');
    toast('تم تسجيل ' + labels[a], { type: 'success', icon: icons[a], duration: 1500 });
    setTimeout(() => { if (state.currentRoute === 'home') navigate('home'); }, 400);
    return;
  }

  /* تبويبات داخلية */
  const nt = e.target.closest('.nt');
  if (nt) {
    /* أعد تعيين كل التبويبات */
    document.querySelectorAll('.nt').forEach(b => {
      b.style.background = 'transparent';
      b.style.color = 'var(--ink-3)';
      b.style.boxShadow = 'none';
    });
    nt.style.background = 'linear-gradient(145deg,var(--clay),var(--clay-deep))';
    nt.style.color = '#fff';
    nt.style.boxShadow = '0 4px 12px rgba(16,185,129,.3)';

    /* أخفِ كل البانلز */
    ['p1','p2','p3','p4'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    /* أظهر البانل المطلوب */
    const target = document.getElementById(nt.dataset.p);
    if (target) target.style.display = 'block';
    haptic('light');
    return;
  }

  /* شريط الأعمار */
  const age = e.target.closest('.age-btn');
  if (age) {
    age.parentElement.querySelectorAll('.age-btn').forEach(a => a.classList.remove('on'));
    age.classList.add('on');
    haptic('light');
    return;
  }

  /* أيام الأسبوع */
  const day = e.target.closest('.week-day');
  if (day) {
    day.parentElement.querySelectorAll('.week-day').forEach(d => d.classList.remove('on'));
    day.classList.add('on');
    haptic('light');
    return;
  }

  /* الأصوات */
  const wave = e.target.closest('.sound__waves');
  if (wave) {
    const s = wave.closest('.sound');
    if (s) s.classList.toggle('on');
    haptic('light');
    return;
  }

  /* عدّاد النبضات */
  const kick = e.target.closest('#kickBtn');
  if (kick) {
    if (!kick._s) kick._s = { count: 0, start: null, timer: null };
    const ks = kick._s;
    const countEl = document.getElementById('kickCount');
    const timeEl = document.getElementById('kickTime');
    const stateEl = document.getElementById('kickState');
    if (!ks.start) {
      ks.start = Date.now();
      ks.timer = setInterval(() => {
        const s = Math.floor((Date.now() - ks.start) / 1000);
        if (timeEl) timeEl.textContent = Math.floor(s/60) + ':' + String(s%60).padStart(2,'0');
      }, 1000);
      if (stateEl) stateEl.textContent = 'جارية';
    }
    ks.count++;
    if (countEl) countEl.textContent = ks.count;
    haptic('light');
    if (ks.count >= 10) {
      clearInterval(ks.timer);
      if (stateEl) stateEl.textContent = '✓ مكتمل';
      toast('أكملتِ 10 نبضات 🎉', { type: 'success' });
    }
    return;
  }

  /* الحقيبة */
  const bag = e.target.closest('[data-bag-item]');
  if (bag) {
    bag.classList.toggle('done');
    const card = bag.closest('.bag');
    if (card) {
      const total = card.querySelectorAll('[data-bag-item]').length;
      const done = card.querySelectorAll('[data-bag-item].done').length;
      const pct = Math.round((done/total) * 100);
      const bar = card.querySelector('.bag__progress i');
      const title = card.querySelector('h5');
      if (bar) bar.style.width = pct + '%';
      if (title) title.textContent = '🧳 جاهزة بنسبة ' + pct + '%';
    }
    haptic('light');
    return;
  }

  /* الإسعافات */
  const faTile = e.target.closest('.fa-tile');
  if (faTile) {
    document.querySelectorAll('.fa-detail').forEach(d => d.classList.remove('open'));
    document.getElementById(faTile.dataset.fa)?.classList.add('open');
    haptic('medium');
    return;
  }
  const faHead = e.target.closest('.fa-detail__head');
  if (faHead) { faHead.parentElement.classList.toggle('open'); return; }

  /* الوصفات */
  const recipe = e.target.closest('.recipe-tile');
  if (recipe) { toast('قريباً: تفاصيل الوصفة 🍽️', { type: 'info' }); return; }
});

/* === المحادثة === */
const chatReplies = {
  'كيف أزيد وزن آدم؟': 'لزيادة الوزن بشكل صحي 🌱<br>• دهون صحية: زبدة اللوز، الأفوكادو.<br>• 5 وجبات صغيرة بدل 3 كبيرة.<br><br>إذا استمر نقص الوزن، راجعي الطبيبة.',
  'متى يبدأ المشي؟': 'المشي بين 11 و15 شهراً 👣<br>• بعض الأطفال في 9 وآخرون في 18.<br>• شجّعيه بالمشي حافياً.<br><br>إذا لم يمشِ بعد 18 شهراً، راجعي الطبيبة.',
  'آدم رفض الرضعة': 'رفض الرضعة شائع 🍼<br>• جرّبي تدفئة الحليب.<br>• غيّري الوضعية.<br><br>إذا رفض أكثر من 8 ساعات، راجعي الطبيبة.',
  'نصائح لنوم أطول': 'لنوم أطول 🌙<br>• روتين مسائي من 3 خطوات.<br>• إضاءة خافتة قبل النوم.<br>• لا شاشات بعد 6 مساءً.',
};

function sendChat(text) {
  const wrap = document.getElementById('chatWrap');
  if (!wrap || !text) return;
  const u = document.createElement('div');
  u.className = 'msg me'; u.textContent = text;
  wrap.appendChild(u); wrap.scrollTop = wrap.scrollHeight;
  const t = document.createElement('div');
  t.className = 'msg typing bot'; t.innerHTML = '<i></i><i></i><i></i>';
  wrap.appendChild(t); wrap.scrollTop = wrap.scrollHeight;
  setTimeout(() => {
    t.remove();
    const b = document.createElement('div');
    b.className = 'msg bot';
    b.innerHTML = chatReplies[text] || 'سؤال رائع 🌸<br>هذا الموضوع يحتاج تفاصيل أكثر. اكتبي الحالة بدقة أو راجعي الطبيبة.';
    wrap.appendChild(b); wrap.scrollTop = wrap.scrollHeight;
  }, 1100);
}

document.addEventListener('click', (e) => {
  const chip = e.target.closest('.chat-chips button');
  if (chip) { sendChat(chip.dataset.q); return; }
  if (e.target.closest('#sendBtn')) {
    const inp = document.getElementById('chatInput');
    if (inp) { const v = inp.value.trim(); if (v) { inp.value = ''; sendChat(v); } }
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.id === 'chatInput') {
    const v = e.target.value.trim();
    if (v) { e.target.value = ''; sendChat(v); }
  }
});

/* === Service Worker === */
/* SW removed */

/* === التشغيل === */
/* sidebar starts open */
if (window.innerWidth > 900 && matchMedia('(hover: hover)').matches) {
  document.body.classList.remove('sidebar-collapsed');
}

/* ============ دوال المساعد العامة ============ */
const ommyChatReplies = {
  'كيف أزيد وزن آدم؟': 'لزيادة الوزن بشكل صحي 🌱<br>• مصادر دهون صحية: زبدة اللوز، الأفوكادو.<br>• 5 وجبات صغيرة بدل 3 كبيرة.<br>• لا تُجبريه على الأكل.<br><br>إذا استمر نقص الوزن، راجعي الطبيبة.',
  'متى يبدأ المشي؟': 'المشي بين 11 و15 شهراً 👣<br>• بعض الأطفال في 9 وآخرون في 18.<br>• شجّعيه بالمشي حافياً.<br><br>راجعي الطبيبة إذا لم يمشِ بعد 18 شهراً.',
  'آدم رفض الرضعة': 'رفض الرضعة شائع 🍼<br>• جرّبي تدفئة الحليب.<br>• غيّري المكان أو الوضعية.<br>• راقبي ألم الأسنان.<br><br>إذا رفض أكثر من 8 ساعات، راجعي الطبيبة.',
  'نصائح لنوم أطول': 'لنوم أطول 🌙<br>• روتين مسائي من 3 خطوات.<br>• إضاءة خافتة قبل النوم بساعة.<br>• لا شاشات بعد 6 مساءً.<br>• نفس الوقت يومياً.'
};

window.ommyChat = function(btn) {
  ommyChatSendText(btn.dataset.q);
};

window.ommyChatSend = function() {
  const inp = document.getElementById('chatInput');
  if (!inp) return;
  const v = inp.value.trim();
  if (!v) return;
  inp.value = '';
  ommyChatSendText(v);
};

function ommyChatSendText(text) {
  const wrap = document.getElementById('chatWrap');
  if (!wrap || !text) return;

  const u = document.createElement('div');
  u.style.cssText = 'max-width:85%;padding:12px 16px;border-radius:16px 16px 4px 16px;font-size:0.82rem;line-height:1.7;align-self:flex-end;background:linear-gradient(145deg,#10B981,#047857);color:#fff;';
  u.textContent = text;
  wrap.appendChild(u);
  wrap.scrollTop = wrap.scrollHeight;

  const t = document.createElement('div');
  t.style.cssText = 'max-width:85%;padding:14px 18px;border-radius:16px 16px 16px 4px;background:linear-gradient(135deg,#ECFDF5,#D1FAE5);border:1px solid #A7F3D0;align-self:flex-start;display:flex;gap:4px;align-items:center;';
  t.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:#059669;animation:ommyBlink 1.2s infinite"></span><span style="width:6px;height:6px;border-radius:50%;background:#059669;animation:ommyBlink 1.2s infinite .2s"></span><span style="width:6px;height:6px;border-radius:50%;background:#059669;animation:ommyBlink 1.2s infinite .4s"></span>';
  wrap.appendChild(t);
  wrap.scrollTop = wrap.scrollHeight;

  setTimeout(() => {
    t.remove();
    const b = document.createElement('div');
    b.style.cssText = 'max-width:85%;padding:12px 16px;border-radius:16px 16px 16px 4px;font-size:0.82rem;line-height:1.7;background:linear-gradient(135deg,#ECFDF5,#D1FAE5);color:var(--ink);border:1px solid #A7F3D0;';
    b.innerHTML = ommyChatReplies[text] || 'سؤال رائع 🌸<br>هذا الموضوع يحتاج تفاصيل أكثر. اكتبي الحالة بدقة أو راجعي الطبيبة.';
    wrap.appendChild(b);
    wrap.scrollTop = wrap.scrollHeight;
  }, 1100);
}

/* أضف نمط للحركة */
if (!document.getElementById('ommyChatStyle')) {
  const s = document.createElement('style');
  s.id = 'ommyChatStyle';
  s.textContent = '@keyframes ommyBlink{0%,60%,100%{opacity:.3}30%{opacity:1}}';
  document.head.appendChild(s);
}


document.documentElement.setAttribute('data-theme', state.theme);
document.title = 'أُمّي · ' + routes[state.currentRoute].label;
/* sidebar starts open */
render();

/* ============================================
   Pull-to-Refresh — السحب للتحديث
   ============================================ */
(function initPullToRefresh() {
  const content = document.querySelector('.content');
  if (!content) return;

  /* أنشئ المؤشر */
  let indicator = document.getElementById('ptrIndicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'ptr-indicator';
    indicator.id = 'ptrIndicator';
    indicator.innerHTML = '<span>↓</span>';
    content.appendChild(indicator);
  }

  let startY = 0;
  let currentY = 0;
  let pulling = false;
  let refreshing = false;
  const THRESHOLD = 90;

  content.addEventListener('touchstart', (e) => {
    if (content.scrollTop > 0 || refreshing) return;
    startY = e.touches[0].clientY;
    pulling = true;
  }, { passive: true });

  content.addEventListener('touchmove', (e) => {
    if (!pulling || refreshing) return;
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 0 && content.scrollTop === 0) {
      const distance = Math.min(diff * 0.5, 130);
      const progress = Math.min(distance / THRESHOLD, 1);

      indicator.classList.add('visible');
      indicator.style.transform = `translateX(-50%) translateY(${distance - 30}px) rotate(${progress * 180}deg)`;
      indicator.classList.toggle('ready', distance >= THRESHOLD);
    }
  }, { passive: true });

  content.addEventListener('touchend', () => {
    if (!pulling || refreshing) {
      pulling = false;
      return;
    }
    pulling = false;

    const diff = currentY - startY;
    const distance = Math.min(diff * 0.5, 130);

    if (distance >= THRESHOLD) {
      triggerRefresh();
    } else {
      resetIndicator();
    }
    startY = 0;
    currentY = 0;
  }, { passive: true });

  function triggerRefresh() {
    refreshing = true;
    indicator.classList.remove('ready');
    indicator.classList.add('loading');
    indicator.style.transform = 'translateX(-50%) translateY(16px)';
    indicator.innerHTML = '<span></span>';

    if (window.haptic) window.haptic('medium');

    /* محاكاة التحديث */
    setTimeout(() => {
      /* أعد رسم الشاشة الحالية */
      if (typeof window.ommyRefresh === 'function') {
        window.ommyRefresh();
      }

      indicator.classList.remove('loading');
      indicator.classList.add('done');
      indicator.innerHTML = '<span>✓</span>';

      if (window.toast) window.toast('تم التحديث', { type: 'success', duration: 1500 });

      setTimeout(() => {
        resetIndicator();
        refreshing = false;
      }, 700);
    }, 1000);
  }

  function resetIndicator() {
    indicator.classList.remove('visible', 'ready', 'loading', 'done');
    indicator.style.transform = 'translateX(-50%) translateY(-60px)';
    indicator.innerHTML = '<span>↓</span>';
  }
})();

/* دالة عامة لإعادة الرسم */
window.ommyRefresh = function() {
  const current = state.currentRoute;
  if (current) navigate(current);
};

/* ============ دوال الإعدادات العامة ============ */
import('./lib/settings.js').then(({ Settings, Children, Stats }) => {

  window.ommySelectChild = function(id) {
    Children.setActive(id);
    const child = Children.list().find(c => c.id === id);
    if (window.toast) window.toast('✅ تم التبديل إلى ' + (child?.name || ''), { type: 'success', duration: 1500 });
    navigate('settings');
  };

  window.ommyAddChild = async function() {
    const name = await ommyPrompt('اسم الطفل الجديد', 'مثال: ليان');
    if (!name) return;
    const birthDate = await ommyPrompt('تاريخ الميلاد (YYYY-MM-DD)', '2024-08-01', '2024-08-01');
    if (!birthDate) return;
    Children.add({ name, birthDate, gender: 'boy', allergies: [] });
    await ommyAlert('تمت الإضافة!', `تمت إضافة ${name} بنجاح`, 'success');
    navigate('settings');
  };

  window.ommyToggle = function(key, btn) {
    const isOn = btn.style.background.includes('16, 185, 129') || btn.style.background.includes('10B981');
    const ns = !isOn;
    btn.style.background = ns ? 'linear-gradient(145deg,#10B981,#047857)' : 'var(--beige-2)';
    const dot = btn.querySelector('span');
    if (dot) {
      dot.style.left = ns ? '3px' : 'auto';
      dot.style.right = ns ? 'auto' : '3px';
    }
    Settings.set(key, ns);
    if (window.haptic) window.haptic('light');
  };

  window.ommyNotify = async function(key, btn) {
    const isOn = btn.style.background.includes('16, 185, 129') || btn.style.background.includes('10B981');
    let next = !isOn;
    if (next) {
      if (!('Notification' in window)) {
        if (window.toast) window.toast('الإشعارات غير مدعومة في هذا المتصفح', { type: 'warning' });
        return;
      }
      let permission = Notification.permission;
      if (permission === 'default') permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        if (window.toast) window.toast('لم يتم تفعيل الإشعارات؛ يمكنكِ تغيير الإذن من إعدادات الجهاز', { type: 'warning' });
        return;
      }
      if (key === 'med_reminder' || key === 'vac_reminder') {
        if (window.toast) window.toast('تم حفظ التفضيل. التذكير الفعلي يحتاج تسجيل موعد أو جدول داخل التطبيق.', { type: 'info' });
      } else if (window.toast) {
        window.toast('🔔 تم تفعيل التذكير أثناء استخدام التطبيق', { type: 'success' });
      }
    }
    btn.style.background = next ? 'linear-gradient(145deg,#10B981,#047857)' : 'var(--beige-2)';
    const dot = btn.querySelector('span');
    if (dot) {
      dot.style.left = next ? '3px' : 'auto';
      dot.style.right = next ? 'auto' : '3px';
    }
    Settings.set(key, next);
    if (next && key === 'feed_reminder') localStorage.setItem('ommi_runtime_feed_notified_at', String(Date.now()));
    if (window.haptic) window.haptic('light');
  };

  window.ommyExport = function() {
    const data = {
      children: Children.list(),
      settings: Settings.all(),
      logs: {},
      exported: new Date().toISOString(),
    };
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('ommi_log_')) data.logs[k] = JSON.parse(localStorage[k]);
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ommi-backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    if (window.toast) window.toast('📤 تم التصدير', { type: 'success' });
  };

  window.ommyReset = async function() {
    const ok = await ommyConfirm(
      'حذف كل البيانات؟',
      'سيتم مسح كل الأطفال والإعدادات والسجلات. لا يمكن التراجع.',
      { danger: true, confirmText: 'نعم، احذفي', cancelText: 'إلغاء' }
    );
    if (!ok) return;
    Object.keys(localStorage).filter(k => k.startsWith('ommi_')).forEach(k => localStorage.removeItem(k));
    await ommyAlert('تم الحذف', 'سيتم إعادة تشغيل التطبيق', 'success');
    setTimeout(() => location.reload(), 800);
  };

}).catch(e => console.warn('settings load:', e));

/* ============ استعادة من ملف ============ */
window.ommyRestore = async function(file) {
  if (!file) return;
  if (!window.ommyConfirm) {
    if (window.toast) window.toast('نافذة التأكيد غير متاحة؛ لم يتم تغيير البيانات', { type: 'error' });
    return;
  }
  const ok = await window.ommyConfirm('استعادة البيانات؟', 'سيتم استبدال بيانات أُمّي الحالية بالنسخة المختارة. يُفضّل تنزيل نسخة احتياطية أولًا.', { danger: true, confirmText: 'استعادة', cancelText: 'إلغاء' });
  if (!ok) return;

  try {
    const result = await window.ommyBackup.restore(file);
    if (result.success) {
      if (window.toast) window.toast('✅ تمت الاستعادة', { type: 'success' });
      setTimeout(() => location.reload(), 1200);
    } else {
      if (window.toast) window.toast('❌ ' + result.error, { type: 'error' });
    }
  } catch(e) {
    if (window.toast) window.toast('❌ فشل الاستعادة', { type: 'error' });
  }
};

/* ============ عرض حجم البيانات ============ */
window.ommyUpdateDataSize = function() {
  const el = document.getElementById('dataSize');
  if (!el || !window.ommyBackup) return;
  const size = window.ommyBackup.size();
  const kb = (size / 1024).toFixed(1);
  el.textContent = kb + ' KB';
};

setInterval(window.ommyUpdateDataSize, 1000);

/* الشريط الجانبي: مفتوح دائماً — زر ☰ يطوي/يفتح */
(function() {
  /* ابدأ مفتوحاً دائماً */
  document.body.classList.remove('sidebar-collapsed');

  /* زر ☰ */
  document.addEventListener('click', function(e) {
    if (e.target.closest('#menuBtn')) {
      document.body.classList.toggle('sidebar-collapsed');
      if (window.haptic) window.haptic('light');
    }
  });
})();

/* ============ تسجيل Service Worker وتحديثه بأمان ============ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', {
        scope: './',
        updateViaCache: 'none'
      });
      console.log('✅ Ommi offline support ready:', reg.scope);
      // Check for updates on launch. Never reload while the mother is entering data.
      reg.update().catch(() => {});
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            console.info('يتوفر تحديث جديد لتطبيق أُمّي؛ سيُستخدم عند إعادة فتح التطبيق.');
          }
        });
      });
    } catch (err) {
      console.warn('Ommi service worker registration failed:', err);
    }
  });
}

/* ============================================
   زر واتساب العائم + القائمة
   ============================================ */
function renderWhatsAppButton() {
  return `
    <button class="wa-float" id="waFloatBtn" type="button" onclick="ommyToggleWAMenu(event)" aria-label="مشاركة عبر واتساب">
      <svg class="wa-float__icon" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </button>

    <div class="wa-menu" id="waMenu">
      <button class="wa-menu__item" type="button" onclick="ommyWAShare();ommyCloseWAMenu()">
        <span class="wa-menu__icon wa-menu__icon--green">📊</span>
        <span>ملخص اليوم</span>
      </button>
      <button class="wa-menu__item" type="button" onclick="ommyWAShareWeek();ommyCloseWAMenu()">
        <span class="wa-menu__icon wa-menu__icon--blue">📅</span>
        <span>ملخص الأسبوع</span>
      </button>
      <button class="wa-menu__item" type="button" onclick="ommyWASharePreg();ommyCloseWAMenu()">
        <span class="wa-menu__icon wa-menu__icon--pink">🤰</span>
        <span>تقدم الحمل</span>
      </button>
      <button class="wa-menu__item" type="button" onclick="ommyWAInvite();ommyCloseWAMenu()">
        <span class="wa-menu__icon wa-menu__icon--purple">💌</span>
        <span>دعوة صديقة للتطبيق</span>
      </button>
      <button class="wa-menu__item" type="button" onclick="ommyWAReportToDoctor();ommyCloseWAMenu()">
        <span class="wa-menu__icon wa-menu__icon--honey">👩‍⚕️</span>
        <span>تقرير للطبيبة</span>
      </button>
    </div>
  `;
}

window.ommyToggleWAMenu = function(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('waMenu');
  if (!menu) return;
  menu.classList.toggle('show');
  if (window.haptic) window.haptic('light');
};

window.ommyCloseWAMenu = function() {
  const menu = document.getElementById('waMenu');
  if (menu) menu.classList.remove('show');
};

/* إغلاق القائمة عند النقر خارجها */
document.addEventListener('click', (e) => {
  const menu = document.getElementById('waMenu');
  if (!menu || !menu.classList.contains('show')) return;
  if (!e.target.closest('.wa-menu') && !e.target.closest('#waFloatBtn')) {
    menu.classList.remove('show');
  }
});

/* مشاركة التقرير للطبيبة عبر واتساب */
window.ommyWAReportToDoctor = function() {
  const text = `⚕️ *تقرير صحي — أُمّي*

يرجى الاطلاع على تفاصيل حالة الطفل في التطبيق.

يمكنك فتح التقرير الكامل عبر:
📄 الإعدادات → تقرير الطبيبة → حفظ PDF

━━━━━━━━━━━━━━
أُمّي — رفيق الأم العربية 🌸`;

  window.ommyWA.share(text);
};
