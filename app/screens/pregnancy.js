/* ============================================
   شاشة الحمل — تصميم حديث 2026
   ============================================ */

let kickState = { count: 0, start: null, timer: null };

window.ommyKick = function(btn) {
  const countEl = document.getElementById('kickCount');
  const timeEl = document.getElementById('kickTime');
  const stateEl = document.getElementById('kickState');

  if (!kickState.start) {
    kickState.start = Date.now();
    kickState.timer = setInterval(() => {
      const s = Math.floor((Date.now() - kickState.start) / 1000);
      if (timeEl) timeEl.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }, 1000);
    if (stateEl) stateEl.textContent = 'جارية';
  }

  kickState.count++;
  if (countEl) countEl.textContent = kickState.count;
  if (window.haptic) window.haptic('light');

  if (kickState.count >= 10) {
    clearInterval(kickState.timer);
    if (stateEl) stateEl.textContent = '✓ مكتمل';
    if (window.toast) window.toast('🎉 أكملتِ 10 نبضات!', { type: 'success' });
  }
};

window.ommyBag = function(el) {
  el.classList.toggle('done');
  const card = el.closest('.bag-card');
  if (!card) return;
  const total = card.querySelectorAll('.bag-item').length;
  const done = card.querySelectorAll('.bag-item.done').length;
  const pct = Math.round((done / total) * 100);
  const bar = card.querySelector('.bag-bar i');
  const title = card.querySelector('.bag-title');
  if (bar) bar.style.width = pct + '%';
  if (title) title.textContent = '🧳 جاهزة بنسبة ' + pct + '%';
  if (window.haptic) window.haptic('light');
};

export function PregnancyScreen() {
  return `
    <style>
      .bag-item.done {
        background: linear-gradient(135deg, #FDF0F3, #F8DFE6) !important;
        color: #B94F70 !important;
        text-decoration: line-through;
        opacity: 0.85;
        border-color: #F5C8D5 !important;
      }
      .bag-item { transition: all 0.2s; }
      .bag-item:hover { transform: translateY(-1px); }
    </style>

    <div style="grid-column:1/-1;width:100%">

      <!-- ============ HERO ============ -->
      <div style="background:linear-gradient(135deg,#C65D7B 0%,#B94F70 60%,#8B3D5A 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 40px rgba(139,92,246,.35);text-align:center">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.25),transparent 70%)"></div>
        <div style="position:absolute;inset-inline-start:-50px;bottom:-80px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.08)"></div>

        <div style="position:relative;z-index:1">
          <div style="font-size:0.78rem;opacity:.9;font-weight:600;letter-spacing:0.05em">الأسبوع الحالي</div>
          <div style="font-family:var(--font-heading);font-size:3.2rem;font-weight:900;line-height:1;margin:8px 0 4px">24</div>
          <div style="font-size:0.82rem;opacity:.92;font-weight:700">أسبوعاً · الثلث الثاني</div>
          <div style="font-size:0.72rem;opacity:.8;margin-top:4px">بقي 16 أسبوعاً</div>

          <!-- حلقة التقدم -->
          <div style="margin:18px auto 0;width:120px;height:120px;position:relative">
            <svg width="120" height="120" viewBox="0 0 120 120" style="transform:rotate(-90deg)">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="10"/>
              <circle cx="60" cy="60" r="52" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="326.7" id="pregRing" data-ring="130"/>
            </svg>
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
              <div style="font-family:var(--font-heading);font-size:1.6rem;font-weight:900;line-height:1">60%</div>
              <div style="font-size:0.65rem;opacity:.85;margin-top:2px">من الرحلة</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ تطور الجنين ============ -->
      ${sectionHeader('👶', 'تطور الجنين هذا الأسبوع', '#C65D7B')}

      <div style="background:linear-gradient(135deg,#FFFFFF,#F5F3FF);border:1.5px solid #F5D9E2;border-radius:18px;padding:16px;margin-bottom:20px;display:flex;gap:14px;align-items:center">
        <span style="width:76px;height:76px;border-radius:20px;background:linear-gradient(145deg,#FDF0F3,#F5F3FF);display:grid;place-items:center;font-size:2.2rem;flex-shrink:0;border:1px solid #F5D9E2">👶</span>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;margin-bottom:4px;color:#8B3D5A">يبدأ التذوق والسمع</div>
          <div style="font-size:0.76rem;color:var(--ink-2);line-height:1.6">تتشكل بصمات الأصابع ويستجيب لصوتك الآن — تحدّثي معه يومياً.</div>
          <span style="display:inline-block;margin-top:8px;font-size:0.7rem;font-weight:800;background:linear-gradient(145deg,#FDF0F3,#F5D9E2);color:#B94F70;padding:5px 12px;border-radius:100px;border:1px solid #F0B8C8">📏 بحجم كوز الذرة · ≈ 30 سم</span>
        </div>
      </div>

      <!-- ============ الأعراض ============ -->
      ${sectionHeader('💗', 'أعراض هذا الأسبوع', '#C65D7B')}

      ${symptomRow('🦵', 'تشنجات الساق', 'رفع القدم والتمدد اللطيف قبل النوم', 'حل منزلي')}
      ${symptomRow('🌀', 'دوار خفيف', 'الاستلقاء على الجانب الأيسر', 'حل منزلي')}

      <!-- تحذير -->
      <div style="display:flex;gap:12px;align-items:flex-start;background:linear-gradient(135deg,#FDF5F5,#FDEEEE);border:1.5px solid #F5C8C8;border-radius:18px;padding:14px 16px;margin:16px 0">
        <span style="font-size:1.3rem;flex-shrink:0">🚨</span>
        <div>
          <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:#B91C1C;margin-bottom:4px">علامات خطر — راجعي الطبيب فوراً</div>
          <p style="font-size:0.78rem;color:#8B2020;line-height:1.6;margin:0">نزيف، صداع شديد مستمر، تورم مفاجئ، أو انقطاع حركة الجنين.</p>
        </div>
      </div>

      <!-- ============ عدّاد النبضات ============ -->
      ${sectionHeader('👣', 'عدّاد نبضات الجنين', '#C65D7B')}

      <div style="background:linear-gradient(135deg,#FFFFFF,#F5F3FF);border:1.5px solid #F5D9E2;border-radius:22px;padding:24px 20px;text-align:center;margin-bottom:20px">
        <div style="font-family:var(--font-heading);font-size:0.86rem;font-weight:900;color:#B94F70;margin-bottom:14px">👣 عدي 10 حركات في الساعة</div>
        <div style="font-family:var(--font-heading);font-size:3.6rem;font-weight:900;color:#B94F70;line-height:1" id="kickCount">0</div>
        <div style="font-size:0.72rem;color:var(--ink-3);margin-bottom:18px">نبضات مسجّلة</div>

        <button onclick="ommyKick(this)" type="button" style="width:92px;height:92px;border-radius:50%;background:linear-gradient(145deg,#C65D7B,#B94F70);color:#fff;border:none;font-size:2.2rem;cursor:pointer;box-shadow:0 14px 30px rgba(139,92,246,.4),inset 0 2px 0 rgba(255,255,255,.2);transition:transform .12s">👣</button>

        <div style="display:flex;justify-content:space-around;margin-top:20px">
          <div><div style="font-family:var(--font-heading);font-weight:900;font-size:1.1rem" id="kickTime">0:00</div><div style="font-size:0.68rem;color:var(--ink-3);font-weight:600;margin-top:2px">الوقت</div></div>
          <div><div style="font-family:var(--font-heading);font-weight:900;font-size:1.1rem">10</div><div style="font-size:0.68rem;color:var(--ink-3);font-weight:600;margin-top:2px">الهدف</div></div>
          <div><div style="font-family:var(--font-heading);font-weight:900;font-size:1.1rem" id="kickState">لم يبدأ</div><div style="font-size:0.68rem;color:var(--ink-3);font-weight:600;margin-top:2px">الحالة</div></div>
        </div>
      </div>

      <!-- ============ الانقباضات ============ -->
      ${sectionHeader('⏱️', 'متتبع الانقباضات', '#C65D7B')}

      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px;margin-bottom:20px">
        ${cxRow('منذ 12 دقيقة', '45 ثانية')}
        ${cxRow('منذ 34 دقيقة', '40 ثانية')}
        ${cxRow('منذ 56 دقيقة', '38 ثانية')}
        <button onclick="ommyToast && ommyToast('▶ بدء تسجيل انقباضة', '⏱️')" type="button" style="width:100%;padding:14px;margin-top:14px;border:none;border-radius:14px;background:linear-gradient(145deg,#C65D7B,#B94F70);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.88rem;cursor:pointer;box-shadow:0 10px 22px rgba(139,92,246,.35)">▶ ابدئي تسجيل انقباضة</button>
      </div>

      <!-- ============ الحقيبة ============ -->
      ${sectionHeader('🧳', 'حقيبة الولادة', '#C65D7B')}

      <div class="bag-card" style="background:var(--cream);border:1.5px solid var(--line);border-radius:20px;padding:16px;margin-bottom:20px">
        <div class="bag-title" style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;margin-bottom:12px">🧳 جاهزة بنسبة 50%</div>
        <div class="bag-bar" style="height:10px;border-radius:100px;background:var(--beige);overflow:hidden;margin-bottom:14px">
          <i style="display:block;height:100%;border-radius:100px;background:linear-gradient(90deg,#C65D7B,#E8A3B6);width:50%;transition:width .6s cubic-bezier(.2,.8,.2,1)"></i>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${bagItem('ملابس الأم', true)}
          ${bagItem('ملابس المولود', true)}
          ${bagItem('حفاضات', true)}
          ${bagItem('شهادة التطعيم', false)}
          ${bagItem('الأوراق الثبوتية', false)}
          ${bagItem('سجادة صلاة', false)}
        </div>
      </div>

      <!-- ============ الدعاء ============ -->
      <div style="background:linear-gradient(135deg,#FFFFFF,#F5F3FF);border:1.5px solid #F5D9E2;border-radius:20px;padding:20px;text-align:center;margin-bottom:16px">
        <div style="font-family:var(--font-heading);font-size:0.86rem;font-weight:900;color:#B94F70;margin-bottom:12px;display:flex;align-items:center;justify-content:center;gap:8px">🤲 دعاء الحمل والولادة</div>
        <p style="font-size:0.86rem;color:var(--ink-2);line-height:2;font-weight:500;margin:0">«رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا»</p>
      </div>

    </div>
  `;
}

/* ============== المكونات ============== */
function sectionHeader(icon, title, color) {
  return `
    <div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px">
      <span style="font-size:1.1rem">${icon}</span>
      <span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink);white-space:nowrap">${title}</span>
      <span style="flex:1;height:2px;background:linear-gradient(90deg,${color || '#C65D7B'},transparent);border-radius:2px"></span>
    </div>
  `;
}

function symptomRow(icon, title, desc, tag) {
  return `
    <div style="display:flex;gap:14px;align-items:center;background:var(--cream);border:1.5px solid var(--line);border-radius:16px;padding:14px;margin-bottom:10px">
      <span style="width:48px;height:48px;border-radius:14px;background:linear-gradient(145deg,#FDF0F3,#F5D9E2);display:grid;place-items:center;font-size:1.3rem;flex-shrink:0;border:1px solid #F0B8C8">${icon}</span>
      <div style="flex:1;min-width:0">
        <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:800;margin-bottom:3px">${title}</div>
        <div style="font-size:0.74rem;color:var(--ink-3);line-height:1.5">${desc}</div>
      </div>
      <span style="font-size:0.7rem;font-weight:800;color:#B94F70;background:linear-gradient(145deg,#FDF0F3,#F5D9E2);padding:6px 11px;border-radius:100px;white-space:nowrap;border:1px solid #F0B8C8">${tag}</span>
    </div>
  `;
}

function cxRow(time, dur) {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px dashed var(--line);font-size:0.82rem">
      <span style="display:flex;align-items:center;gap:8px;color:var(--ink-2)"><span style="width:9px;height:9px;border-radius:50%;background:#C65D7B;display:inline-block"></span>${time}</span>
      <b style="font-family:var(--font-heading);font-weight:900;color:var(--ink);font-size:0.86rem">${dur}</b>
    </div>
  `;
}

function bagItem(name, done) {
  return `
    <button onclick="ommyBag(this)" type="button" class="bag-item${done ? ' done' : ''}" style="font-size:0.75rem;font-weight:700;padding:8px 14px;border-radius:100px;background:var(--beige);color:var(--ink-2);border:1.5px solid transparent;cursor:pointer;font-family:var(--font-body);${done ? 'background:linear-gradient(135deg,#FDF0F3,#F8DFE6);color:#B94F70;text-decoration:line-through;border-color:#F5C8D5;' : ''}">${name}</button>
  `;
}
