/* ============================================
   شاشة التطعيمات — نظام ذكي تلقائي
   ============================================ */
import { VaccineScheduler } from '../lib/vaccine-scheduler.js';
import { BabyStore } from '../lib/storage.js';

export function VaccinesScreen() {
  const baby = BabyStore.get();
  const ageMonths = VaccineScheduler.babyAgeMonths();
  const progress = VaccineScheduler.progress();
  const items = VaccineScheduler.status();
  const late = VaccineScheduler.late();
  const soon = VaccineScheduler.soon();
  const next = VaccineScheduler.next();

  const ageLabel = ageMonths >= 24
    ? `${Math.floor(ageMonths / 12)} سنوات`
    : `${ageMonths} شهراً`;

  return `
    <div style="grid-column:1/-1;width:100%">

      <!-- Hero -->
      <div class="vac-hero-smart">
        <div style="position:relative;z-index:1">
          <div class="vac-progress-ring" style="--p: ${progress.percent}%">
            <span>${progress.percent}%</span>
          </div>
          <div style="text-align:center;margin-bottom:14px">
            <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:900;line-height:1.3">تطعيمات ${baby.name}</div>
            <div style="font-size:0.75rem;opacity:.9;margin-top:4px">${progress.done} من ${progress.total} تطعيمات أساسية</div>
          </div>

          <div style="background:rgba(255,255,255,.15);border-radius:14px;padding:12px;display:flex;gap:10px;align-items:center;margin-bottom:8px">
            <span style="font-size:1.3rem">👶</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:0.7rem;opacity:.85">العمر الحالي</div>
              <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem">${ageLabel}</div>
            </div>
          </div>

          ${next ? `
            <div onclick="ommyShowVacStats('late')" style="background:rgba(255,255,255,.2);border-radius:14px;padding:12px;display:flex;gap:10px;align-items:center;cursor:pointer;position:relative">
              <span style="font-size:1.3rem">💉</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:0.7rem;opacity:.85">القادم</div>
                <div style="font-family:var(--font-heading);font-weight:900;font-size:0.85rem;line-height:1.3">${next.name}</div>
                <div style="font-size:0.68rem;opacity:.9;margin-top:2px">${next.daysUntil > 0 ? 'بعد ' + next.daysUntil + ' يوم' : next.daysUntil === 0 ? 'اليوم' : 'منذ ' + Math.abs(next.daysUntil) + ' يوم'}</div>
              </div>
              ${late.length > 0 ? `
                <span style="background:#fff;color:var(--red-deep);font-family:var(--font-heading);font-weight:900;font-size:0.75rem;width:26px;height:26px;border-radius:50%;display:grid;place-items:center">${late.length}</span>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>

      <!-- العمر الدقيق -->
      ${renderAgeCard(baby)}

      <!-- إضافة تاريخ الميلاد -->
      ${!baby.birthDate ? `
        <div class="card span-full" style="padding:16px;margin-bottom:16px;background:linear-gradient(135deg,var(--honey-soft),var(--rose-soft));border-color:var(--honey)">
          <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px">
            <span style="font-size:1.5rem">🎂</span>
            <div style="flex:1">
              <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--honey-deep);margin-bottom:4px">أضيفي تاريخ ميلاد ${baby.name}</div>
              <div style="font-size:0.74rem;color:var(--ink-2);line-height:1.6">سيتم حساب كل التطعيمات تلقائياً من تاريخ الميلاد</div>
            </div>
          </div>
          <button onclick="ommySetBabyBirthDate()" type="button" style="width:100%;padding:12px;border:none;border-radius:12px;background:linear-gradient(145deg,var(--honey),var(--honey-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.82rem;cursor:pointer">🎂 تحديد تاريخ الميلاد</button>
        </div>
      ` : ''}

      <!-- تنبيهات المتأخرة -->
      ${late.length > 0 ? `
        <div class="vac-alert late span-full">
          <span class="vac-alert__icon">⚠️</span>
          <div class="vac-alert__body">
            <div class="vac-alert__title">${late.length} تطعيم متأخر</div>
            <div class="vac-alert__text">${late.map(v => v.name).join(' · ')}</div>
          </div>
        </div>
      ` : ''}

      <!-- تنبيهات القريبة -->
      ${soon.length > 0 ? `
        <div class="vac-alert soon span-full">
          <span class="vac-alert__icon">⏰</span>
          <div class="vac-alert__body">
            <div class="vac-alert__title">${soon.length} تطعيم قريب</div>
            <div class="vac-alert__text">${soon.map(v => v.name + ' — بعد ' + v.daysUntil + ' يوم').join(' · ')}</div>
          </div>
        </div>
      ` : ''}

      <!-- الخط الزمني -->
      <div class="section-title span-full">
        <div class="section-title__label">
          <span class="section-title__icon" style="background:var(--honey-soft);color:var(--honey-deep)">📅</span>
          <span>الخط الزمني الكامل</span>
        </div>
        <div style="font-size:0.72rem;font-weight:800;color:var(--clay-deep)">${items.length} مرحلة</div>
      </div>

      <div class="vac-timeline span-full">
        ${items.map(v => renderVaccineItem(v, baby)).join('')}
      </div>

      <!-- أزرار ذكية -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px;grid-column:1/-1">
        <button onclick="ommyShowVacStats('done')" type="button" style="padding:14px;border:none;border-radius:16px;background:linear-gradient(145deg,var(--rose),var(--clay-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.82rem;cursor:pointer;box-shadow:0 8px 20px rgba(198,93,123,.3)">
          📊 إحصائيات
        </button>
        <button id="vacNotifyBtn" type="button" style="padding:14px;border:none;border-radius:16px;background:linear-gradient(145deg,var(--honey),var(--honey-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.82rem;cursor:pointer;box-shadow:0 8px 20px rgba(193,122,74,.3)">
          🔔 التذكيرات
        </button>
      </div>

    </div>
  `;
}

function renderVaccineItem(v, baby) {
  const stateLabels = {
    done: '✓ تم',
    due: 'الآن',
    soon: 'قريب',
    late: 'متأخر',
    upcoming: 'قادم',
  };

  const dateStr = v.dueDate
    ? v.dueDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  let countdownText = '';
  if (v.isDone) countdownText = '✅ مكتمل';
  else if (v.daysUntil === 0) countdownText = 'اليوم';
  else if (v.daysUntil > 0 && v.daysUntil < 30) countdownText = `بعد ${v.daysUntil} يوم`;
  else if (v.daysUntil > 0) countdownText = `بعد ${Math.floor(v.daysUntil / 30)} شهر`;
  else countdownText = `منذ ${Math.abs(v.daysUntil)} يوم`;

  return `
    <div class="vac-item ${v.state}">
      <div class="vac-card">
        <div class="vac-card__head">
          <div class="vac-card__title">${v.name}</div>
          <div class="vac-card__age">${stateLabels[v.state]}</div>
        </div>

        <div class="vac-card__vaccines">
          ${v.vaccines.map(vac => `<span>${vac}</span>`).join('')}
        </div>

        ${dateStr ? `
          <div class="vac-card__footer">
            <div class="vac-card__date">📅 ${dateStr}</div>
            <div class="vac-card__countdown ${v.state}">${countdownText}</div>
          </div>
        ` : ''}

        ${!v.isDone && v.isDue ? `
          <button onclick="ommyMarkVaccineDone('${v.id}')" type="button" class="vac-check done-btn" style="width:100%;margin-top:10px;justify-content:center">
            ✅ تسجيل كمكتمل
          </button>
        ` : ''}

        ${v.isDone ? `
          <button onclick="ommyMarkVaccineUndone('${v.id}')" type="button" class="vac-check undo-btn" style="width:100%;margin-top:10px;justify-content:center">
            ↩️ إلغاء التسجيل
          </button>
        ` : ''}
      </div>
    </div>
  `;
}





/* ============ بطاقة العمر الدقيق ============ */
window.ommyStartAgeTicker = function() {
  const birthDate = window._ommyBabyBirthDate;
  if (!birthDate) return;

  const updateAge = () => {
    const birth = new Date(birthDate);
    const now = new Date();
    const diff = now - birth;

    /* حساب دقيق */
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    /* تصحيح الأيام */
    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    /* تصحيح الشهور */
    if (months < 0) {
      years--;
      months += 12;
    }

    /* الوقت المتبقي */
    const seconds = Math.floor(diff / 1000);
    const totalDays = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    /* تحديث العناصر */
    const yEl = document.getElementById('ageYears');
    const mEl = document.getElementById('ageMonths');
    const dEl = document.getElementById('ageDays');
    const hEl = document.getElementById('ageHours');
    const minEl = document.getElementById('ageMinutes');
    const sEl = document.getElementById('ageSeconds');
    const totalEl = document.getElementById('ageTotalDays');

    if (yEl) yEl.textContent = years;
    if (mEl) mEl.textContent = months;
    if (dEl) dEl.textContent = days;
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    if (totalEl) totalEl.textContent = totalDays.toLocaleString('ar-EG');
  };

  updateAge();
  if (window._ommyAgeTicker) clearInterval(window._ommyAgeTicker);
  window._ommyAgeTicker = setInterval(updateAge, 1000);
};

function renderAgeCard(baby) {
  if (!baby.birthDate) {
    return '';
  }

  /* خزّن التاريخ للاستخدام في العدّاد */
  setTimeout(() => {
    window._ommyBabyBirthDate = baby.birthDate;
    if (window.ommyStartAgeTicker) window.ommyStartAgeTicker();
  }, 100);

  const birth = new Date(baby.birthDate);
  const birthStr = birth.toLocaleDateString('ar-EG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return `
    <div style="background:linear-gradient(135deg,var(--cream) 0%,var(--rose-soft) 100%);border:1.5px solid var(--rose);border-radius:22px;padding:18px;margin-bottom:16px;grid-column:1/-1;box-shadow:0 8px 24px rgba(198,93,123,.12)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <span style="width:44px;height:44px;border-radius:14px;background:#fff;display:grid;place-items:center;font-size:1.4rem;flex-shrink:0;box-shadow:0 4px 12px rgba(198,93,123,.15)">🎂</span>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;color:var(--clay-deep)">عمر ${baby.name} الدقيق</div>
          <div style="font-size:0.68rem;color:var(--ink-3);margin-top:2px;font-weight:600">${birthStr}</div>
        </div>
      </div>

      <!-- العدّاد الرئيسي: سنوات + شهور + أيام -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">
        <div style="background:#fff;border-radius:14px;padding:12px 6px;text-align:center;border:1px solid var(--rose-soft)">
          <div id="ageYears" style="font-family:var(--font-heading);font-weight:900;font-size:1.8rem;color:var(--clay-deep);line-height:1">0</div>
          <div style="font-size:0.66rem;color:var(--ink-3);font-weight:800;margin-top:4px">سنوات</div>
        </div>
        <div style="background:#fff;border-radius:14px;padding:12px 6px;text-align:center;border:1px solid var(--rose-soft)">
          <div id="ageMonths" style="font-family:var(--font-heading);font-weight:900;font-size:1.8rem;color:var(--clay-deep);line-height:1">0</div>
          <div style="font-size:0.66rem;color:var(--ink-3);font-weight:800;margin-top:4px">شهور</div>
        </div>
        <div style="background:#fff;border-radius:14px;padding:12px 6px;text-align:center;border:1px solid var(--rose-soft)">
          <div id="ageDays" style="font-family:var(--font-heading);font-weight:900;font-size:1.8rem;color:var(--clay-deep);line-height:1">0</div>
          <div style="font-size:0.66rem;color:var(--ink-3);font-weight:800;margin-top:4px">أيام</div>
        </div>
      </div>

      <!-- العدّاد الفرعي: ساعات + دقائق + ثواني -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">
        <div style="background:linear-gradient(135deg,var(--lavender-soft),var(--rose-soft));border-radius:12px;padding:10px 4px;text-align:center">
          <div id="ageHours" style="font-family:var(--font-heading);font-weight:900;font-size:1.3rem;color:var(--lavender-deep);line-height:1;font-variant-numeric:tabular-nums">00</div>
          <div style="font-size:0.6rem;color:var(--ink-3);font-weight:800;margin-top:3px">ساعة</div>
        </div>
        <div style="background:linear-gradient(135deg,var(--lavender-soft),var(--rose-soft));border-radius:12px;padding:10px 4px;text-align:center">
          <div id="ageMinutes" style="font-family:var(--font-heading);font-weight:900;font-size:1.3rem;color:var(--lavender-deep);line-height:1;font-variant-numeric:tabular-nums">00</div>
          <div style="font-size:0.6rem;color:var(--ink-3);font-weight:800;margin-top:3px">دقيقة</div>
        </div>
        <div style="background:linear-gradient(135deg,var(--lavender-soft),var(--rose-soft));border-radius:12px;padding:10px 4px;text-align:center">
          <div id="ageSeconds" style="font-family:var(--font-heading);font-weight:900;font-size:1.3rem;color:var(--lavender-deep);line-height:1;font-variant-numeric:tabular-nums">00</div>
          <div style="font-size:0.6rem;color:var(--ink-3);font-weight:800;margin-top:3px">ثانية</div>
        </div>
      </div>

      <!-- إجمالي الأيام -->
      <div style="background:linear-gradient(135deg,var(--clay-deep),var(--rose));border-radius:14px;padding:12px;text-align:center;color:#fff">
        <div style="font-size:0.68rem;opacity:.9;font-weight:700;margin-bottom:4px">🎯 إجمالي الأيام</div>
        <div id="ageTotalDays" style="font-family:var(--font-heading);font-weight:900;font-size:1.4rem;line-height:1;font-variant-numeric:tabular-nums">0</div>
        <div style="font-size:0.62rem;opacity:.85;margin-top:4px">يوم من الفرح والحب</div>
      </div>
    </div>
  `;
}
/* ============ نافذة إحصائيات التطعيمات — تفاعلية ============ */
let vacStatsTab = 'done';

window.ommyShowVacStats = function(tab) {
  vacStatsTab = tab || 'done';
  const html = buildVacStatsHTML();

  if (window.showModal) {
    window.showModal({
      type: 'info',
      title: '💉 إحصائيات التطعيمات',
      message: html,
      confirmText: 'حسناً',
    });
  }
};

window.ommySwitchVacTab = function(tab) {
  vacStatsTab = tab;

  /* حدّث التبويبات */
  document.querySelectorAll('.vac-stat-tab').forEach(t => {
    const isActive = t.dataset.tab === tab;
    t.style.background = isActive ? 'linear-gradient(135deg,var(--rose),var(--clay-deep))' : 'var(--cream)';
    t.style.color = isActive ? '#fff' : 'var(--ink-2)';
    t.style.borderColor = isActive ? 'transparent' : 'var(--line)';
    t.style.boxShadow = isActive ? '0 4px 12px rgba(198,93,123,.25)' : 'none';
  });

  /* حدّث القائمة */
  const listEl = document.getElementById('vacStatsList');
  if (listEl) {
    listEl.innerHTML = buildVacStatsList(tab);
  }

  if (window.haptic) window.haptic('light');
};

function buildVacStatsHTML() {
  const items = VaccineScheduler.status();
  const progress = VaccineScheduler.progress();

  const done = items.filter(v => v.isDone);
  const late = items.filter(v => v.state === 'late');
  const soon = items.filter(v => v.state === 'soon');
  const due = items.filter(v => v.state === 'due');
  const upcoming = items.filter(v => v.state === 'upcoming');

  /* دمج due + soon في "قريب" */
  const soonCount = soon.length + due.length;

  return `
    <div style="text-align:start">
      <!-- المؤشر العام -->
      <div style="text-align:center;margin-bottom:16px;padding:16px;background:linear-gradient(135deg,var(--rose-soft),var(--lavender-soft));border-radius:16px">
        <div style="font-family:var(--font-heading);font-weight:900;font-size:2.2rem;color:var(--clay-deep);line-height:1">${progress.percent}%</div>
        <div style="font-size:0.72rem;color:var(--ink-2);margin-top:6px;font-weight:700">${progress.done} من ${progress.total} تطعيمات أساسية</div>
      </div>

      <!-- التبويبات -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:14px">
        <button class="vac-stat-tab" data-tab="done"
                onclick="ommySwitchVacTab('done')"
                style="padding:10px 4px;border:1.5px solid transparent;border-radius:12px;background:linear-gradient(135deg,var(--rose),var(--clay-deep));color:#fff;font-family:var(--font-heading);font-weight:900;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(198,93,123,.25)">
          <div style="font-size:1.3rem;line-height:1">${done.length}</div>
          <div style="font-size:0.58rem;font-weight:800;margin-top:3px">تم ✅</div>
        </button>
        <button class="vac-stat-tab" data-tab="late"
                onclick="ommySwitchVacTab('late')"
                style="padding:10px 4px;border:1.5px solid var(--line);border-radius:12px;background:var(--cream);color:var(--ink-2);font-family:var(--font-heading);font-weight:900;cursor:pointer;transition:all .2s">
          <div style="font-size:1.3rem;line-height:1">${late.length}</div>
          <div style="font-size:0.58rem;font-weight:800;margin-top:3px">متأخر ⚠️</div>
        </button>
        <button class="vac-stat-tab" data-tab="soon"
                onclick="ommySwitchVacTab('soon')"
                style="padding:10px 4px;border:1.5px solid var(--line);border-radius:12px;background:var(--cream);color:var(--ink-2);font-family:var(--font-heading);font-weight:900;cursor:pointer;transition:all .2s">
          <div style="font-size:1.3rem;line-height:1">${soonCount}</div>
          <div style="font-size:0.58rem;font-weight:800;margin-top:3px">قريب ⏰</div>
        </button>
        <button class="vac-stat-tab" data-tab="upcoming"
                onclick="ommySwitchVacTab('upcoming')"
                style="padding:10px 4px;border:1.5px solid var(--line);border-radius:12px;background:var(--cream);color:var(--ink-2);font-family:var(--font-heading);font-weight:900;cursor:pointer;transition:all .2s">
          <div style="font-size:1.3rem;line-height:1">${upcoming.length}</div>
          <div style="font-size:0.58rem;font-weight:800;margin-top:3px">قادم 📅</div>
        </button>
      </div>

      <!-- عنوان القائمة -->
      <div id="vacStatsTitle" style="font-family:var(--font-heading);font-size:0.78rem;font-weight:900;color:var(--ink-2);margin-bottom:8px">
        ${getTabTitle('done')}
      </div>

      <!-- القائمة -->
      <div id="vacStatsList">
        ${buildVacStatsList('done')}
      </div>

      <div style="background:var(--beige);border-radius:12px;padding:10px;text-align:center;font-size:0.7rem;color:var(--ink-2);font-weight:700;line-height:1.6;margin-top:14px">
        💡 اضغطي على أي تبويب لعرض القائمة
      </div>
    </div>
  `;
}

function getTabTitle(tab) {
  const titles = {
    done: '✅ التطعيمات المكتملة',
    late: '⚠️ التطعيمات المتأخرة',
    soon: '⏰ التطعيمات القريبة',
    upcoming: '📅 التطعيمات القادمة',
  };
  return titles[tab] || '';
}

function buildVacStatsList(tab) {
  const items = VaccineScheduler.status();

  let list = [];
  if (tab === 'done') {
    list = items.filter(v => v.isDone);
  } else if (tab === 'late') {
    list = items.filter(v => v.state === 'late');
  } else if (tab === 'soon') {
    list = items.filter(v => v.state === 'soon' || v.state === 'due');
  } else if (tab === 'upcoming') {
    list = items.filter(v => v.state === 'upcoming');
  }

  if (list.length === 0) {
    const emptyMessages = {
      done: 'لم تُسجَّل أي تطعيمات بعد',
      late: '🎉 لا توجد تطعيمات متأخرة',
      soon: 'لا توجد تطعيمات قريبة',
      upcoming: 'لا توجد تطعيمات قادمة',
    };
    return `
      <div style="text-align:center;padding:24px 12px;background:var(--beige);border-radius:14px">
        <div style="font-size:2rem;margin-bottom:8px">🌸</div>
        <div style="font-size:0.76rem;color:var(--ink-2);font-weight:700">${emptyMessages[tab]}</div>
      </div>
    `;
  }

  const colors = {
    done: { bg: 'var(--mint-soft)', color: 'var(--mint-deep)', icon: '✅' },
    late: { bg: 'var(--red-soft)', color: 'var(--red-deep)', icon: '⚠️' },
    soon: { bg: 'var(--honey-soft)', color: 'var(--honey-deep)', icon: '⏰' },
    upcoming: { bg: 'var(--beige)', color: 'var(--ink-2)', icon: '📅' },
  };
  const c = colors[tab];

  return list.map(v => {
    let timeText = '';
    if (v.isDone) timeText = '✅ مكتمل';
    else if (v.daysUntil === 0) timeText = 'اليوم';
    else if (v.daysUntil > 0) timeText = `بعد ${v.daysUntil} يوم`;
    else timeText = `منذ ${Math.abs(v.daysUntil)} يوم`;

    const dateText = v.dueDate
      ? v.dueDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })
      : '';

    return `
      <div style="background:${c.bg};border-radius:12px;padding:12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.78rem;color:${c.color};flex:1;min-width:0">${c.icon} ${v.name}</div>
          <div style="font-size:0.62rem;font-weight:900;color:${c.color};background:#fff;padding:2px 8px;border-radius:100px;flex-shrink:0">${timeText}</div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">
          ${v.vaccines.map(vac => `<span style="font-size:0.6rem;font-weight:700;background:rgba(255,255,255,.7);color:${c.color};padding:2px 8px;border-radius:100px">${vac}</span>`).join('')}
        </div>
        ${dateText ? `<div style="font-size:0.6rem;color:${c.color};opacity:.75;font-weight:700">📅 ${dateText}</div>` : ''}
      </div>
    `;
  }).join('');
}

/* ============ ربط مباشر للزر (بديل onclick) ============ */
setTimeout(() => {
  const btn = document.getElementById('vacNotifyBtn');
  if (btn && !btn.dataset.bound) {
    btn.dataset.bound = '1';
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('🔔 ضغط على زر التذكير');
      if (window.ommyRequestVacNotification) {
        window.ommyRequestVacNotification();
      } else {
        console.error('❌ ommyRequestVacNotification غير معرّفة');
      }
    });
    console.log('✅ زر التذكير مربوط');
  }
}, 500);

// إعادة الربط عند كل render
document.addEventListener('click', function(e) {
  if (e.target.closest('#vacNotifyBtn') && !e.target.closest('#vacNotifyBtn').dataset.handled) {
    // سيتم التعامل عبر المستمع المباشر
  }
});

/* ============ زر التذكيرات — تفاعلي فوري ============ */
window.ommyRequestVacNotification = function() {
  const next = VaccineScheduler.next();

  /* ============ حالة 1: لا توجد تطعيمات قادمة ============ */
  if (!next) {
    if (window.toast) {
      window.toast('🎉 كل التطعيمات الأساسية مكتملة!', {
        type: 'success', icon: '🎉', duration: 3000
      });
    }
    if (window.haptic) window.haptic('success');
    if (window.ommySound?.celebrate) window.ommySound.celebrate();
    return;
  }

  const daysText = next.daysUntil > 0
    ? `بعد ${next.daysUntil} يوم`
    : next.daysUntil === 0
      ? 'اليوم'
      : `منذ ${Math.abs(next.daysUntil)} يوم`;

  /* ============ حالة 2: المتصفح لا يدعم الإشعارات ============ */
  if (!('Notification' in window)) {
    if (window.toast) {
      window.toast('⚠️ متصفحك لا يدعم الإشعارات', { type: 'warning', duration: 3000 });
    }
    if (window.haptic) window.haptic('error');
    return;
  }

  /* ============ حالة 3: الإشعارات مرفوضة ============ */
  if (Notification.permission === 'denied') {
    if (window.toast) {
      window.toast('⚠️ الرجاء السماح بالإشعارات من إعدادات المتصفح', {
        type: 'warning', duration: 4000
      });
    }
    if (window.haptic) window.haptic('error');
    if (window.ommySound?.error) window.ommySound.error();
    return;
  }

  /* ============ حالة 4: الإشعارات مسموحة — إشعار فوري ============ */
  if (Notification.permission === 'granted') {
    showVacNotification(next, daysText);
    return;
  }

  /* ============ حالة 5: طلب الإذن ============ */
  Notification.requestPermission().then(perm => {
    if (perm === 'granted') {
      showVacNotification(next, daysText);
    } else {
      if (window.toast) window.toast('⚠️ لم يتم تفعيل الإشعارات', { type: 'warning' });
      if (window.haptic) window.haptic('error');
    }
  });
};

/* ============ عرض الإشعار الفوري ============ */
function showVacNotification(next, daysText) {
  /* 1) Toast فوري */
  if (window.toast) {
    window.toast(`✅ تم تفعيل تذكير: ${next.name}`, {
      type: 'success',
      icon: '🔔',
      duration: 3500
    });
  }

  /* 2) اهتزاز */
  if (window.haptic) window.haptic('success');

  /* 3) صوت نجاح */
  if (window.ommySound?.success) window.ommySound.success();

  /* 4) إشعار حقيقي في شريط الإشعارات */
  try {
    const notif = new Notification('🔔 تم تفعيل التذكير', {
      body: `${next.name}\n${next.vaccines.join(' · ')}\n${daysText}`,
      icon: './assets/icon-192.png',
      badge: './assets/icon-192.png',
      tag: 'vac_enabled_' + next.id,
      dir: 'rtl',
      lang: 'ar',
      requireInteraction: false,
    });

    /* إغلاق تلقائي بعد 10 ثواني */
    setTimeout(() => notif.close(), 10000);

    /* عند الضغط على الإشعار */
    notif.onclick = function() {
      window.focus();
      notif.close();
    };

  } catch(e) {
    console.warn('Notification error:', e);
    /* Fallback: alert */
    if (window.showModal) {
      window.showModal({
        type: 'success',
        title: '✅ تم تفعيل التذكير',
        message: `سنذكرك بـ${next.name} قبل موعده بـ5 أيام\n\nالموعد: ${daysText}`,
        confirmText: 'حسناً',
      });
    }
  }

  /* 5) إشعار خلفي بعد 5 ثواني (لتأكيد الاستمرارية) */
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      try {
        const reminderNotif = new Notification('💉 سنتذكرك', {
          body: `قبل موعد ${next.name} بـ5 أيام ستتلقين تذكيراً`,
          icon: './assets/icon-192.png',
          tag: 'vac_reminder_' + next.id,
          dir: 'rtl',
          lang: 'ar',
        });
        setTimeout(() => reminderNotif.close(), 8000);
      } catch(e) {}
    }
  }, 5000);
}

/* ============ دالة التذكير المبسّطة — لا تعتمد على شيء ============ */
window.ommyVaccineNotifyTest = function(e) {
  if (e) e.preventDefault();

  console.log('🎯 ommyVaccineNotifyTest تم استدعاءها');

  // 1) Toast فوري (بدون شرط)
  try {
    if (window.toast) {
      window.toast('✅ تم تفعيل التذكير', {
        type: 'success',
        icon: '🔔',
        duration: 3000,
      });
    } else {
      alert('✅ تم تفعيل التذكير');
    }
  } catch (err) {
    console.error('Toast error:', err);
    alert('✅ تم تفعيل التذكير');
  }

  // 2) اهتزاز
  try {
    if (window.haptic) window.haptic('success');
    else if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
  } catch(e) {}

  // 3) إشعار
  try {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🔔 تم تفعيل التذكير', {
          body: 'سيتم تذكيرك قبل موعد التطعيم بـ5 أيام',
          icon: './assets/icon-192.png',
          dir: 'rtl',
          lang: 'ar',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            new Notification('🔔 تم تفعيل التذكير', {
              body: 'سيتم تذكيرك قبل موعد التطعيم بـ5 أيام',
              icon: './assets/icon-192.png',
              dir: 'rtl',
              lang: 'ar',
            });
            if (window.toast) window.toast('✅ تم تفعيل الإشعارات', { type: 'success' });
          }
        });
      }
    }
  } catch(err) {
    console.error('Notification error:', err);
  }
};

console.log('✅ ommyVaccineNotifyTest محمّلة');
