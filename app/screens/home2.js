import { LogStore, BabyStore } from '../lib/storage.js';
import { Children } from '../lib/settings.js';

window.ommyQuick = function(action) {
  const labels = { feed: 'رضعة', sleep: 'نوم', diaper: 'حفاض', med: 'دواء' };
  const icons  = { feed: '🍼', sleep: '😴', diaper: '💧', med: '💊' };
  try {
    /* نحفظ بالشكل الصحيح */
    LogStore.add({ type: action, action: action });
  } catch(e) { console.warn('LogStore error:', e); }
  if (window.haptic) window.haptic('medium');
  if (window.toast) window.toast('تم تسجيل ' + (labels[action] || action), { type: 'success', icon: icons[action] || '📝', duration: 1500 });
  setTimeout(() => {
    if (window.ommyRefresh) window.ommyRefresh();
  }, 400);
};

export function HomeScreen() {
  const active = Children.active();
  const baby = { ...BabyStore.updateAge(), name: active?.name || 'آدم' };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء الخير';
  const summary = LogStore.summary();

  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#D9829A 0%,#C65D7B 50%,#8B3D5A 100%);border-radius:24px;padding:22px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 45px rgba(16,185,129,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.25),transparent 70%)"></div>
        <div style="position:absolute;inset-inline-start:-50px;bottom:-80px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.08)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">👶</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:900;line-height:1.2">${greeting}، سارة</div>
              <div style="font-size:0.78rem;opacity:.9;margin-top:3px">${baby.name} · ${baby.ageMonths || 14} شهراً</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
            ${statBox(summary.sleeps + 'س', 'نوم')}
            ${statBox(summary.feeds, 'رضعات')}
            ${statBox(summary.diapers, 'حفاضات')}
            ${statBox(summary.meds, 'أدوية')}
          </div>
        </div>
      </div>

      ${sectionHeader('⚡', 'تسجيل سريع')}
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:8px">
        ${quickBtn('🍼', 'رضعة', 'feed', '#FDF0F3', '#B94F70')}
        ${quickBtn('😴', 'نوم', 'sleep', '#F2EEFC', '#1E40AF')}
        ${quickBtn('💧', 'حفاض', 'diaper', '#CFFAFE', '#0E7490')}
        ${quickBtn('💊', 'دواء', 'med', '#FDF3EB', '#C17A4A')}
      </div>

      ${sectionHeader('📝', 'آخر الأحداث')}
      ${renderRecent()}

      ${sectionHeader('📅', 'القادم')}
      <div style="display:flex;gap:14px;align-items:center;background:var(--cream);border:1.5px solid #F8DCC0;border-radius:18px;padding:16px;margin-bottom:12px">
        <span style="width:52px;height:52px;border-radius:16px;background:linear-gradient(145deg,#F5D5B8,#F5C8A8);color:#fff;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0;box-shadow:0 8px 20px rgba(245,158,11,.3)">💉</span>
        <div style="flex:1"><div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;margin-bottom:3px">تطعيم الحصبة (MMR)</div><div style="font-size:0.74rem;color:var(--ink-3)">الجرعة الأولى</div></div>
        <div style="text-align:center"><div style="font-family:var(--font-heading);font-size:1.4rem;font-weight:900;color:#C17A4A;line-height:1">5</div><div style="font-size:0.62rem;color:var(--ink-3);font-weight:700">أيام</div></div>
      </div>

      <div style="display:flex;gap:14px;align-items:center;background:var(--cream);border:1.5px solid #B8DFC7;border-radius:18px;padding:16px;margin-bottom:12px">
        <span style="width:52px;height:52px;border-radius:16px;background:linear-gradient(145deg,#A8D5BA,#5C8F72);color:#fff;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0">🩺</span>
        <div style="flex:1"><div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;margin-bottom:3px">متابعة الطبيبة</div><div style="font-size:0.74rem;color:var(--ink-3)">عيادة د. هدى</div></div>
        <div style="text-align:center"><div style="font-family:var(--font-heading);font-size:1.4rem;font-weight:900;color:#5C8F72;line-height:1">12</div><div style="font-size:0.62rem;color:var(--ink-3);font-weight:700">يوم</div></div>
      </div>

      ${sectionHeader('💡', 'نصيحة اليوم')}
      <div style="background:linear-gradient(135deg,#F2F9F4,#F8DFE6);border:1.5px solid #D5EAD9;border-radius:18px;padding:16px;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px;font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:#B94F70;margin-bottom:8px"><span style="font-size:1.1rem">🌙</span> نوم أفضل</div>
        <p style="font-size:0.78rem;color:#8B3D5A;line-height:1.7;margin:0">جرّبي تقليل الإضاءة قبل النوم بساعة، وابدئي روتيناً ثابتاً من 3 خطوات — أثره يظهر خلال أسبوع.</p>
      </div>

      <div style="background:linear-gradient(135deg,#FDF3EB,#FBE5CE);border:1.5px solid #F8DCC0;border-radius:18px;padding:16px">
        <div style="display:flex;align-items:center;gap:8px;font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:#A6653A;margin-bottom:8px"><span style="font-size:1.1rem">🍎</span> تغذية</div>
        <p style="font-size:0.78rem;color:#8B5A38;line-height:1.7;margin:0">أضيفي الخضار الملوّن إلى طبق ${baby.name} — الألوان تزيد فضوله للطعام.</p>
      </div>
    </div>
  `;
}

function sectionHeader(icon, title) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,#D9829A,transparent);border-radius:2px"></span></div>`;
}

function statBox(value, label) {
  return `<div style="background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:12px 6px;text-align:center"><div style="font-family:var(--font-heading);font-weight:900;font-size:1.05rem;line-height:1.1">${value}</div><div style="font-size:0.62rem;opacity:.9;margin-top:3px">${label}</div></div>`;
}

function quickBtn(icon, label, action, bg, color) {
  return `<button class="quick-btn" onclick="ommyQuick('${action}')" type="button" style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px 6px;text-align:center;cursor:pointer;font-family:var(--font-body);transition:all .25s"><div style="width:52px;height:52px;border-radius:16px;background:${bg};display:grid;place-items:center;font-size:1.6rem;margin:0 auto 8px;border:1px solid rgba(0,0,0,.05)">${icon}</div><div style="font-family:var(--font-heading);font-size:0.76rem;font-weight:900;color:${color}">${label}</div></button>`;
}

function renderRecent() {
  const log = LogStore.today();
  const recent = log.slice(-5).reverse();
  if (recent.length === 0) {
    return `<div style="background:var(--cream);border:1.5px dashed var(--line);border-radius:18px;padding:28px 16px;text-align:center;margin-bottom:12px"><div style="font-size:2.2rem;margin-bottom:8px">📝</div><div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink-2);margin-bottom:4px">لا توجد أحداث اليوم</div><div style="font-size:0.75rem;color:var(--ink-3)">ابدئي بتسجيل أول رضعة أو نوم</div></div>`;
  }
  const meta = {
    feed: { icon: '🍼', label: 'رضعة', bg: '#FDF0F3', color: '#B94F70' },
    sleep: { icon: '😴', label: 'نوم', bg: '#F2EEFC', color: '#1E40AF' },
    diaper: { icon: '💧', label: 'حفاض', bg: '#CFFAFE', color: '#0E7490' },
    med: { icon: '💊', label: 'دواء', bg: '#FDF3EB', color: '#C17A4A' },
  };
  return recent.map(e => {
    const m = meta[e.type] || { icon: '📝', label: e.type, bg: 'var(--beige)', color: 'var(--ink-2)' };
    const time = new Date(e.time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    return `<div style="display:flex;gap:14px;align-items:center;background:var(--cream);border:1.5px solid var(--line);border-radius:16px;padding:12px 14px;margin-bottom:10px"><span style="width:44px;height:44px;border-radius:14px;background:${m.bg};display:grid;place-items:center;font-size:1.3rem;flex-shrink:0">${m.icon}</span><div style="flex:1"><div style="font-family:var(--font-heading);font-size:0.86rem;font-weight:900;color:${m.color}">${m.label}</div><div style="font-size:0.72rem;color:var(--ink-3);margin-top:2px">${time}</div></div></div>`;
  }).join('');
}
