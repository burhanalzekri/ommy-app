/* ============================================
   بطاقة العمر الحية — تتحدّث كل ثانية
   ============================================ */
import { ChildManager } from './children.js';

let ageTimer = null;

export function renderAgeHero() {
  const active = ChildManager.active();
  if (!active || !active.birthDate) return '';

  const genderIcon = active.gender === 'girl' ? '👧' : '👶';

  return `
    <div class="age-hero" id="ageHero">
      <div class="age-hero__head">
        <div class="age-hero__icon">${genderIcon}</div>
        <div style="flex:1;min-width:0">
          <div class="age-hero__name">${active.name}</div>
          <div class="age-hero__birth">📅 ${formatArabicDate(active.birthDate)}</div>
        </div>
        <button onclick="ommyOpenChildSwitcher()" type="button" style="background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.3);color:#fff;padding:8px 12px;border-radius:100px;font-family:var(--font-heading);font-weight:900;font-size:0.7rem;cursor:pointer;display:flex;align-items:center;gap:4px">
          🔄 تبديل
        </button>
      </div>

      <div class="age-grid">
        <div class="age-unit">
          <div class="age-unit__value" id="ageYears">0</div>
          <div class="age-unit__label">سنة</div>
        </div>
        <div class="age-unit">
          <div class="age-unit__value" id="ageMonths">0</div>
          <div class="age-unit__label">شهر</div>
        </div>
        <div class="age-unit">
          <div class="age-unit__value" id="ageDays">0</div>
          <div class="age-unit__label">يوم</div>
        </div>
      </div>

      <div class="age-grid age-grid--small">
        <div class="age-unit">
          <div class="age-unit__value" id="ageHours">0</div>
          <div class="age-unit__label">ساعة</div>
        </div>
        <div class="age-unit">
          <div class="age-unit__value" id="ageMinutes">0</div>
          <div class="age-unit__label">دقيقة</div>
        </div>
        <div class="age-unit">
          <div class="age-unit__value" id="ageSeconds">0</div>
          <div class="age-unit__label">ثانية</div>
        </div>
      </div>

      <div class="age-info">
        <span class="age-info__icon">🎂</span>
        <div class="age-info__body">
          <div class="age-info__label">عيد الميلاد القادم</div>
          <div class="age-info__value" id="ageBirthday">—</div>
        </div>
        <span class="age-stage" id="ageStage">${ChildManager.preciseAge(active.birthDate)?.stage || ''}</span>
      </div>
    </div>
  `;
}

export function startAgeTimer() {
  stopAgeTimer();
  updateAgeValues();
  ageTimer = setInterval(updateAgeValues, 1000);
}

export function stopAgeTimer() {
  if (ageTimer) {
    clearInterval(ageTimer);
    ageTimer = null;
  }
}

function updateAgeValues() {
  const active = ChildManager.active();
  if (!active || !active.birthDate) return;

  const age = ChildManager.preciseAge(active.birthDate);
  if (!age) return;

  /* سنوات، شهور، أيام */
  const yEl = document.getElementById('ageYears');
  const mEl = document.getElementById('ageMonths');
  const dEl = document.getElementById('ageDays');
  const hEl = document.getElementById('ageHours');
  const miEl = document.getElementById('ageMinutes');
  const sEl = document.getElementById('ageSeconds');
  const bEl = document.getElementById('ageBirthday');
  const stEl = document.getElementById('ageStage');

  if (yEl) yEl.textContent = age.years;
  if (mEl) mEl.textContent = age.months;
  if (dEl) dEl.textContent = age.days;
  if (hEl) hEl.textContent = age.hours;
  if (miEl) miEl.textContent = age.minutes;
  if (sEl) sEl.textContent = String(age.seconds).padStart(2, '0');

  if (bEl) {
    if (age.daysToBirthday === 0) {
      bEl.textContent = '🎉 اليوم! كل سنة وأنتِ بخير';
    } else if (age.daysToBirthday === 1) {
      bEl.textContent = 'غداً! 🎈';
    } else if (age.daysToBirthday <= 30) {
      bEl.textContent = `بعد ${age.daysToBirthday} يوم 🎈`;
    } else {
      const months = Math.floor(age.daysToBirthday / 30);
      bEl.textContent = `بعد ${months} ${months === 1 ? 'شهر' : 'شهور'}`;
    }
  }

  if (stEl && stEl.textContent !== age.stage) {
    stEl.textContent = age.stage;
  }
}

function formatArabicDate(dateStr) {
  try {
    const d = new Date(dateStr);
    const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch { return dateStr; }
}

window.ommyAgeHero = { render: renderAgeHero, start: startAgeTimer, stop: stopAgeTimer };
