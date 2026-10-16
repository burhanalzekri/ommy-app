/* ============================================
   شاشة التغذية — نسخة ديناميكية من content.js
   ============================================ */

import { FoodsByAge, ArabicRecipes } from '../lib/content.js';

let currentAge = '12';

window.ommyTab = function(panelId, btn) {
  document.querySelectorAll('.nt-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.nt-tab').forEach(b => {
    b.style.background = 'transparent';
    b.style.color = 'var(--ink-3)';
    b.style.boxShadow = 'none';
  });
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.style.display = 'block';
    panel.style.animation = 'ntFade .35s cubic-bezier(.2,.8,.2,1)';
  }
  if (btn) {
    btn.style.background = 'linear-gradient(145deg, #D9829A, #B94F70)';
    btn.style.color = '#fff';
    btn.style.boxShadow = '0 8px 20px rgba(16,185,129,.35)';
  }
  if (window.haptic) window.haptic('light');
};

window.ommyAge = function(ageKey, btn) {
  currentAge = ageKey;
  /* تحديث الأزرار */
  document.querySelectorAll('.nt-age').forEach(b => {
    b.style.background = 'var(--cream)';
    b.style.color = 'var(--ink-3)';
    b.style.borderColor = 'var(--line)';
    b.style.boxShadow = 'none';
    const em = b.querySelector('b');
    if (em) em.style.color = 'var(--ink)';
  });
  btn.style.background = 'linear-gradient(145deg, #D9829A, #B94F70)';
  btn.style.color = '#fff';
  btn.style.borderColor = 'transparent';
  btn.style.boxShadow = '0 8px 20px rgba(16,185,129,.35)';
  const em = btn.querySelector('b');
  if (em) em.style.color = '#fff';

  /* تحديث قائمة الأطعمة */
  const list = document.getElementById('foodList');
  if (list) {
    list.innerHTML = renderFoodList(ageKey);
  }

  /* تحديث العنوان والوصف */
  const info = FoodsByAge[ageKey];
  if (info) {
    const titleEl = document.getElementById('foodTitle');
    const descEl = document.getElementById('foodDesc');
    if (titleEl) titleEl.textContent = info.title;
    if (descEl) descEl.textContent = info.description;
  }

  if (window.haptic) window.haptic('light');
};

window.ommyRecipe = function(recipeId) {
  const recipe = ArabicRecipes.find(r => r.id === recipeId);
  if (!recipe) return;
  if (window.showModal) {
    window.showModal({
      type: 'info',
      title: recipe.icon + ' ' + recipe.name,
      message: `
        <div style="text-align:start;font-size:0.85rem;line-height:1.8">
          <b style="color:#B94F70">⏱️ الوقت:</b> ${recipe.time}<br>
          <b style="color:#B94F70">👶 العمر:</b> ${recipe.age}<br><br>
          <b style="color:#B94F70">🥄 المكونات:</b><br>
          ${recipe.ingredients.map(i => '• ' + i).join('<br>')}<br><br>
          <b style="color:#B94F70">📝 الخطوات:</b><br>
          ${recipe.steps.map((s, i) => (i+1) + '. ' + s).join('<br>')}
        </div>
      `,
      confirmText: 'تم',
      cancelText: 'إغلاق',
    });
  }
};

export function NutritionScreen() {
  const ageInfo = FoodsByAge[currentAge] || FoodsByAge['12'];
  return `
    <style>
      @keyframes ntFade {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>

    <div style="grid-column:1/-1;width:100%">
      <div style="display:flex;gap:6px;background:linear-gradient(145deg,#FFFFFF,#F6FEF9);border:1.5px solid #F8DFE6;border-radius:18px;padding:6px;margin-bottom:20px;box-shadow:0 4px 14px rgba(16,185,129,.08);overflow-x:auto;-webkit-overflow-scrolling:touch">
        <button class="nt-tab" onclick="ommyTab('nt-p1', this)" style="flex:1;min-width:78px;border:none;background:linear-gradient(145deg, #D9829A, #B94F70);color:#fff;font-family:var(--font-heading);font-weight:800;font-size:0.75rem;padding:11px 10px;border-radius:13px;cursor:pointer;white-space:nowrap;box-shadow:0 8px 20px rgba(16,185,129,.35)">📋 الجدول</button>
        <button class="nt-tab" onclick="ommyTab('nt-p2', this)" style="flex:1;min-width:78px;border:none;background:transparent;color:var(--ink-3);font-family:var(--font-heading);font-weight:800;font-size:0.75rem;padding:11px 10px;border-radius:13px;cursor:pointer;white-space:nowrap">🍽️ وصفات</button>
        <button class="nt-tab" onclick="ommyTab('nt-p3', this)" style="flex:1;min-width:78px;border:none;background:transparent;color:var(--ink-3);font-family:var(--font-heading);font-weight:800;font-size:0.75rem;padding:11px 10px;border-radius:13px;cursor:pointer;white-space:nowrap">📝 يوميات</button>
        <button class="nt-tab" onclick="ommyTab('nt-p4', this)" style="flex:1;min-width:78px;border:none;background:transparent;color:var(--ink-3);font-family:var(--font-heading);font-weight:800;font-size:0.75rem;padding:11px 10px;border-radius:13px;cursor:pointer;white-space:nowrap">⚠️ الحساسية</button>
      </div>

      <div id="nt-p1" class="nt-panel" style="display:block">${tableTab(ageInfo)}</div>
      <div id="nt-p2" class="nt-panel" style="display:none">${recipesTab()}</div>
      <div id="nt-p3" class="nt-panel" style="display:none">${diaryTab()}</div>
      <div id="nt-p4" class="nt-panel" style="display:none">${allergyTab()}</div>
    </div>
  `;
}

function tableTab(ageInfo) {
  return `
    <div style="background:linear-gradient(135deg,#C65D7B 0%,#B94F70 60%,#8B3D5A 100%);border-radius:22px;padding:20px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 40px rgba(16,185,129,.35)">
      <div style="position:absolute;inset-inline-end:-60px;top:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(163,230,53,.3),transparent 70%)"></div>
      <div style="position:relative;z-index:1">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
          <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">🍲</span>
          <div>
            <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">طعام آدم</div>
            <div style="font-size:0.78rem;opacity:.9;margin-top:3px">اختاري العمر لترى التفاصيل</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span style="font-size:0.68rem;background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.35);padding:5px 12px;border-radius:100px;font-weight:600">🥜 حساسية مُفعّلة</span>
        </div>
      </div>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:20px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none">
      ${ageBtn('0-6', '0–6', 'شهور', currentAge === '0-6')}
      ${ageBtn('6', '6', 'شهور', currentAge === '6')}
      ${ageBtn('9', '9', 'شهور', currentAge === '9')}
      ${ageBtn('12', '12', 'شهراً', currentAge === '12')}
      ${ageBtn('18', '18', 'شهراً', currentAge === '18')}
    </div>

    <div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px">
      <span style="font-size:1.1rem">📋</span>
      <span id="foodTitle" style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${ageInfo.title}</span>
      <span style="flex:1;height:2px;background:linear-gradient(90deg,#D9829A,transparent);border-radius:2px"></span>
    </div>

    <p id="foodDesc" style="font-size:0.82rem;color:var(--ink-2);line-height:1.6;margin:0 0 14px">${ageInfo.description}</p>

    <div id="foodList">${renderFoodList(currentAge)}</div>

    <div style="background:linear-gradient(135deg,#FDF6F8,#FDF0F3);border:1.5px solid #D5EAD9;border-radius:18px;padding:16px;margin:20px 0">
      <div style="display:flex;align-items:center;gap:8px;font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:#B94F70;margin-bottom:12px">🧮 حاسبات العمر</div>
      ${calcRow('🍼', 'احتياج الحليب', '480 مل')}
      ${calcRow('💧', 'احتياج الماء', '950 مل')}
      ${calcRow('🍽️', 'الوجبات الصلبة', '3 + سناك')}
    </div>

    <div style="display:flex;gap:12px;align-items:flex-start;background:linear-gradient(135deg,#FDF5F5,#FDEEEE);border:1.5px solid #F5C8C8;border-radius:18px;padding:14px 16px;margin:16px 0">
      <span style="font-size:1.3rem;flex-shrink:0">⚠️</span>
      <div>
        <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:#B91C1C;margin-bottom:4px">خطر الاختناق</div>
        <p style="font-size:0.78rem;color:#8B2020;line-height:1.6;margin:0">تجنّبي المكسرات الكاملة والعنب غير المقطّع والجزر النيء.</p>
      </div>
    </div>
  `;
}

function renderFoodList(ageKey) {
  const info = FoodsByAge[ageKey];
  if (!info) return '<p>لا توجد بيانات</p>';

  return `
    <div style="font-family:var(--font-heading);font-size:0.8rem;font-weight:800;color:#B94F70;margin:0 0 10px">✅ مسموح</div>
    ${info.allowed.map(f => foodRow(f.icon, f.name, f.desc, 'ok', 'مسموح')).join('')}

    <div style="font-family:var(--font-heading);font-size:0.8rem;font-weight:800;color:#B91C1C;margin:18px 0 10px">⚠️ ممنوع / بحذر</div>
    ${info.forbidden.map(f => foodRow(f.icon, f.name, f.desc, 'forbidden', 'ممنوع')).join('')}
  `;
}

function recipesTab() {
  return `
    <div style="display:flex;align-items:center;gap:10px;margin:0 0 14px">
      <span style="font-size:1.1rem">🍽️</span>
      <span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">وصفات عربية</span>
      <span style="flex:1;height:2px;background:linear-gradient(90deg,#D9829A,transparent);border-radius:2px"></span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
      ${ArabicRecipes.map(r => `
        <button onclick="ommyRecipe('${r.id}')" type="button" style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:18px 10px;text-align:center;cursor:pointer;transition:all .25s">
          <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(145deg,#FDF0F3,#F8DFE6);display:grid;place-items:center;font-size:1.8rem;margin:0 auto 10px">${r.icon}</div>
          <div style="font-family:var(--font-heading);font-size:0.82rem;font-weight:800;color:var(--ink);margin-bottom:4px">${r.name}</div>
          <div style="font-size:0.68rem;color:var(--ink-3)">${r.age} · ${r.time}</div>
        </button>
      `).join('')}
    </div>
  `;
}

function diaryTab() {
  return `
    <div style="display:flex;align-items:center;gap:10px;margin:0 0 14px">
      <span style="font-size:1.1rem">📝</span>
      <span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">يوميات آدم</span>
      <span style="flex:1;height:2px;background:linear-gradient(90deg,#D9829A,transparent);border-radius:2px"></span>
    </div>
    ${mealRow('8:15 ص', 'فطور', 'شوفان بالحليب — 3/4 الطبق', '🥣', '#FDF0F3')}
    ${mealRow('10:30 ص', 'سناك', 'تفاح مهروس — نصفها', '🍎', '#FDEEEE')}
    ${mealRow('1:00 م', 'غداء', 'أرز + دجاج — جيداً', '🍛', '#FDF3EB')}

    <div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px">
      <span style="font-size:1.1rem">📊</span>
      <span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">ملخص الأسبوع</span>
      <span style="flex:1;height:2px;background:linear-gradient(90deg,#D9829A,transparent);border-radius:2px"></span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px 8px;text-align:center"><div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:900;color:#D9829A;line-height:1">4.8</div><div style="font-size:0.68rem;color:var(--ink-3);margin-top:6px;font-weight:600">وجبات/يوم</div></div>
      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px 8px;text-align:center"><div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:900;color:#F5C8A8;line-height:1">14</div><div style="font-size:0.68rem;color:var(--ink-3);margin-top:6px;font-weight:600">نوعاً</div></div>
      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px 8px;text-align:center"><div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:900;color:#B94F70;line-height:1">0</div><div style="font-size:0.68rem;color:var(--ink-3);margin-top:6px;font-weight:600">تفاعل</div></div>
    </div>
  `;
}

function allergyTab() {
  return `
    <div style="background:linear-gradient(135deg,#FDF5F5,#FDEEEE);border:1.5px solid #F5C8C8;border-radius:18px;padding:16px;margin-bottom:20px;display:flex;gap:12px">
      <span style="font-size:1.5rem;flex-shrink:0">🥜</span>
      <div>
        <div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:#B91C1C;margin-bottom:4px">حساسية: الفول السوداني</div>
        <p style="font-size:0.78rem;color:#8B2020;line-height:1.6;margin:0">تم تفعيل التحذير على كل الأطعمة المرتبطة تلقائياً.</p>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px">
      <span style="font-size:1.1rem">✅</span>
      <span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">البدائل المسموحة</span>
      <span style="flex:1;height:2px;background:linear-gradient(90deg,#D9829A,transparent);border-radius:2px"></span>
    </div>
    ${foodRow('🌰', 'زبدة اللوز', 'بديل آمن بعد اختبار', 'ok', 'بديل')}
    ${foodRow('🌻', 'بذور عبّاد الشمس', 'مهروسة ناعمة', 'ok', 'بديل')}
    ${foodRow('🥜', 'أي منتج بفول سوداني', 'يُنبه دائماً', 'forbidden', 'ممنوع')}
  `;
}

function ageBtn(key, value, unit, active) {
  return `
    <button class="nt-age" onclick="ommyAge('${key}', this)" type="button" style="flex:1 0 auto;min-width:72px;background:${active ? 'linear-gradient(145deg,#D9829A,#B94F70)' : 'var(--cream)'};color:${active ? '#fff' : 'var(--ink-3)'};border:1.5px solid ${active ? 'transparent' : 'var(--line)'};border-radius:16px;padding:12px 8px;text-align:center;font-size:0.68rem;font-weight:700;cursor:pointer;font-family:var(--font-body);white-space:nowrap;${active ? 'box-shadow:0 8px 20px rgba(16,185,129,.3);' : ''}">
      <b style="display:block;font-family:var(--font-heading);font-weight:900;font-size:1rem;color:${active ? '#fff' : 'var(--ink)'};margin-bottom:3px">${value}</b>${unit}
    </button>
  `;
}

function foodRow(icon, name, desc, status, tag) {
  const c = {
    ok: { bg: 'linear-gradient(135deg,#FDF0F3,#F8DFE6)', color: '#B94F70', border: '#F5C8D5', icon: '#FDF0F3' },
    caution: { bg: 'linear-gradient(135deg,#FDF3EB,#FBE5CE)', color: '#A6653A', border: '#F8DCC0', icon: '#FDF3EB' },
    forbidden: { bg: 'linear-gradient(135deg,#FDEEEE,#FECACA)', color: '#B83B3B', border: '#F5C8C8', icon: '#FDEEEE' },
  }[status] || {};
  return `
    <div style="display:flex;gap:14px;align-items:center;background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:14px;margin-bottom:10px;transition:all .25s">
      <span style="width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0;background:${c.icon};border:1px solid ${c.border}">${icon}</span>
      <div style="flex:1;min-width:0">
        <div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:800;line-height:1.3;margin-bottom:4px">${name}</div>
        <div style="font-size:0.74rem;color:var(--ink-3);line-height:1.5">${desc}</div>
      </div>
      <span style="font-size:0.7rem;font-weight:900;padding:6px 12px;border-radius:100px;white-space:nowrap;flex-shrink:0;background:${c.bg};color:${c.color};border:1px solid ${c.border};font-family:var(--font-heading)">${tag}</span>
    </div>
  `;
}

function calcRow(icon, label, value) {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;font-size:0.82rem;color:var(--ink-2);border-bottom:1px dashed rgba(16,185,129,.25)">
      <span style="display:flex;align-items:center;gap:8px">${icon} ${label}</span>
      <b style="font-family:var(--font-heading);color:#B94F70;font-size:0.9rem">${value}</b>
    </div>
  `;
}

function mealRow(time, title, desc, icon, bg) {
  return `
    <div style="display:flex;gap:14px;align-items:center;background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:14px;margin-bottom:10px">
      <span style="width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0;background:${bg}">${icon}</span>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:3px">
          <span style="font-family:var(--font-heading);font-size:0.72rem;font-weight:900;color:#B94F70;background:#FDF0F3;padding:3px 9px;border-radius:100px">${time}</span>
          <span style="font-family:var(--font-heading);font-size:0.88rem;font-weight:800">${title}</span>
        </div>
        <div style="font-size:0.74rem;color:var(--ink-3);line-height:1.5">${desc}</div>
      </div>
    </div>
  `;
}
