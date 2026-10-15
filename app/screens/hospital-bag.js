/* ============================================
   حقيبة الولادة الذكية — Smart Hospital Bag
   ============================================ */
import { Storage } from '../lib/storage.js';
import { Voice, SoundFX } from '../lib/audio.js';

/* ============ قوائم الحقيبة ============ */
const BAG_DATA = {
  mom: {
    title: 'للأم',
    icon: '👩',
    color: '#EC4899',
    bg: 'linear-gradient(135deg,#FCE7F3,#FBCFE8)',
    border: '#F9A8D4',
    items: [
      { id: 'm1', name: 'ملابس قطنية مريحة', essential: true },
      { id: 'm2', name: 'قميص نوم واسع (2)', essential: true },
      { id: 'm3', name: 'روب حمام', essential: false },
      { id: 'm4', name: 'مناشف صحية للولادة', essential: true },
      { id: 'm5', name: 'حمالات صدر للرضاعة', essential: true },
      { id: 'm6', name: 'فوط نسائية سميكة', essential: true },
      { id: 'm7', name: 'شبشب للحمام', essential: true },
      { id: 'm8', name: 'فرشاة أسنان + معجون', essential: true },
      { id: 'm9', name: 'صابون وشامبو', essential: true },
      { id: 'm10', name: 'كريم ترطيب الشفاه', essential: false },
      { id: 'm11', name: 'شاحن الهاتف', essential: true },
      { id: 'm12', name: 'سجادة صلاة + قرآن', essential: false },
      { id: 'm13', name: 'دفتر وملاحظات', essential: false },
      { id: 'm14', name: 'زيت مساج', essential: false },
    ],
  },
  baby: {
    title: 'للمولود',
    icon: '👶',
    color: '#D9829A',
    bg: 'linear-gradient(135deg,#FDF0F3,#F8DFE6)',
    border: '#F5C8D5',
    items: [
      { id: 'b1', name: 'بادي (3 قطع)', essential: true },
      { id: 'b2', name: 'بيجاما كاملة (2)', essential: true },
      { id: 'b3', name: 'قبعة صغيرة', essential: true },
      { id: 'b4', name: 'جوارب صغيرة', essential: true },
      { id: 'b5', name: 'لفائف (2)', essential: true },
      { id: 'b6', name: 'حفاضات صغيرة (20)', essential: true },
      { id: 'b7', name: 'مناديل مبللة للأطفال', essential: true },
      { id: 'b8', name: 'بطانيات خفيفة (2)', essential: true },
      { id: 'b9', name: 'زجاجة حليب (احتياط)', essential: false },
      { id: 'b10', name: 'لهاية نظيفة', essential: false },
      { id: 'b11', name: 'مرطب غرفة صغير', essential: false },
      { id: 'b12', name: 'فرشاة شعر ناعمة', essential: false },
    ],
  },
  docs: {
    title: 'الوثائق',
    icon: '📄',
    color: '#3B82F6',
    bg: 'linear-gradient(135deg,#F2EEFC,#BFDBFE)',
    border: '#D5CDF0',
    items: [
      { id: 'd1', name: 'بطاقة التطعيم', essential: true },
      { id: 'd2', name: 'الأوراق الثبوتية', essential: true },
      { id: 'd3', name: 'بطاقة التأمين الصحي', essential: true },
      { id: 'd4', name: 'نتائج الفحوصات', essential: true },
      { id: 'd5', name: 'بطاقة هوية الأم', essential: true },
      { id: 'd6', name: 'دفتر الحامل', essential: true },
      { id: 'd7', name: 'شهادة فصيلة الدم', essential: false },
      { id: 'd8', name: 'تقرير موجات فوق صوتية', essential: false },
    ],
  },
  partner: {
    title: 'للأب / المرافق',
    icon: '👨',
    color: '#C65D7B',
    bg: 'linear-gradient(135deg,#FDF0F3,#F5D9E2)',
    border: '#F0B8C8',
    items: [
      { id: 'p1', name: 'ملابس ليوم واحد', essential: false },
      { id: 'p2', name: 'شاحن هاتف إضافي', essential: true },
      { id: 'p3', name: 'وجبة خفيفة للانتظار', essential: false },
      { id: 'p4', name: 'نقود (للطوارئ)', essential: true },
      { id: 'p5', name: 'كاميرا لتصوير اللحظة', essential: false },
    ],
  },
};

/* ============ إدارة الحقيبة ============ */
function getBagState() {
  return Storage.get('bag_state', {});
}

function setBagState(state) {
  Storage.set('bag_state', state);
}

function toggleItem(itemId) {
  const state = getBagState();
  state[itemId] = !state[itemId];
  setBagState(state);
  if (window.haptic) window.haptic('light');

  const total = Object.keys(state).length;
  const done = Object.values(state).filter(Boolean).length;

  /* شارة عند إكمال الحقيبة */
  const allItems = Object.values(BAG_DATA).flatMap(c => c.items);
  const allDone = allItems.every(item => state[item.id]);
  if (allDone && window.ommyBadges) {
    window.ommyBadges.grant('bag_complete');
  }
}

/* ============ إحصائيات ============ */
function getStats() {
  const state = getBagState();
  const allItems = Object.values(BAG_DATA).flatMap(c => c.items);
  const total = allItems.length;
  const done = allItems.filter(i => state[i.id]).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  const essentials = allItems.filter(i => i.essential);
  const essentialsDone = essentials.filter(i => state[i.id]).length;
  return { total, done, progress, essentialsTotal: essentials.length, essentialsDone };
}

/* ============ تحديث عرض الحقيبة عند الضغط ============ */
window.ommyBagToggle = function(el, itemId) {
  toggleItem(itemId);
  el.classList.toggle('done', getBagState()[itemId]);

  /* حدث داخلي لتحديث الأرقام */
  document.dispatchEvent(new CustomEvent('bagUpdate'));
};

/* ============ قراءة القائمة بصوت ============ */
window.ommySpeakBag = function(category) {
  const cat = BAG_DATA[category];
  if (!cat) return;
  const state = getBagState();
  const remaining = cat.items.filter(i => !state[i.id]).map(i => i.name);
  const text = remaining.length === 0
    ? `${cat.title} — كل العناصر جاهزة`
    : `${cat.title}. بقي ${remaining.length} عنصر: ${remaining.join('. ')}`;
  Voice.speak(text, { rate: 0.85 });
  if (window.toast) window.toast('🔊 جاري القراءة', { type: 'success', duration: 1500 });
};

/* ============ مشاركة الحقيبة ============ */
window.ommyShareBag = function() {
  const stats = getStats();
  const state = getBagState();
  const remaining = Object.values(BAG_DATA).flatMap(c => c.items).filter(i => !state[i.id]);

  const text = `🧳 *حقيبة الولادة*\n\n✅ جاهز: ${stats.done}/${stats.total} (${stats.progress}%)\n⭐ الأساسيات: ${stats.essentialsDone}/${stats.essentialsTotal}\n\n📝 المتبقي:\n${remaining.slice(0, 10).map(i => `• ${i.name}`).join('\\n')}${remaining.length > 10 ? `\\n... و ${remaining.length - 10} عنصر آخر` : ''}\n\n🌸 أُمّي — رفيق الأم العربية`;

  if (navigator.share) {
    navigator.share({ title: 'حقيبة الولادة', text });
  } else {
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  }
};

/* ============ تصدير كـ PDF (طباعة) ============ */
window.ommyPrintBag = function() {
  const state = getBagState();
  let content = '<html dir="rtl"><head><meta charset="utf-8"><title>حقيبة الولادة</title>';
  content += '<style>body{font-family:Arial;padding:20px;line-height:1.8}h1{color:#C65D7B}h2{color:#EC4899;border-bottom:2px solid #eee;padding-bottom:8px}li{padding:4px 0}.done{color:#D9829A;text-decoration:line-through}</style></head><body>';
  content += '<h1>🧳 حقيبة الولادة</h1>';

  Object.entries(BAG_DATA).forEach(([key, cat]) => {
    content += `<h2>${cat.icon} ${cat.title}</h2><ul>`;
    cat.items.forEach(item => {
      const checked = state[item.id] ? '✅' : '☐';
      const cls = state[item.id] ? 'done' : '';
      content += `<li class="${cls}">${checked} ${item.name}${item.essential ? ' ⭐' : ''}</li>`;
    });
    content += '</ul>';
  });

  content += '<p style="margin-top:30px;text-align:center;color:#888">أُمّي — رفيق الأم العربية 🌸</p>';
  content += '</body></html>';

  const w = window.open('', '_blank');
  w.document.write(content);
  w.document.close();
  setTimeout(() => w.print(), 500);
};

/* ============ الشاشة الرئيسية ============ */
export function HospitalBagScreen() {
  const stats = getStats();
  const state = getBagState();

  return `
    <style>
      .bag-item {
        display:flex;gap:12px;align-items:center;padding:12px;
        background:var(--cream);border:1.5px solid var(--line);
        border-radius:14px;margin-bottom:8px;cursor:pointer;
        transition:all .2s;font-family:var(--font-body);text-align:start;width:100%;
      }
      .bag-item:hover { transform:translateX(-3px); border-color:#F0B8C8; }
      .bag-item.done { background:linear-gradient(135deg,#FDF0F3,#F8DFE6); border-color:#F5C8D5; }
      .bag-item.done .bag-item-name { text-decoration:line-through; color:#B94F70; }
      .bag-checkbox {
        width:26px;height:26px;border-radius:8px;border:2px solid var(--line);
        display:grid;place-items:center;flex-shrink:0;background:#fff;
        transition:all .2s;font-size:0.9rem;font-weight:900;color:transparent;
      }
      .bag-item.done .bag-checkbox {
        background:linear-gradient(145deg,#D9829A,#B94F70);
        border-color:#B94F70;color:#fff;
      }
    </style>

    <div style="grid-column:1/-1;width:100%">

      <!-- HERO -->
      <div style="background:linear-gradient(135deg,#EC4899 0%,#BE185D 60%,#831843 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 45px rgba(236,72,153,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">🧳</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">حقيبة الولادة</div>
              <div style="font-size:0.78rem;opacity:.92;margin-top:3px">${stats.done} من ${stats.total} عنصر</div>
            </div>
          </div>

          <div style="background:rgba(255,255,255,.2);height:10px;border-radius:100px;overflow:hidden;margin-bottom:8px">
            <div id="bagProgressBar" style="height:100%;width:${stats.progress}%;background:#fff;border-radius:100px;transition:width .6s cubic-bezier(.2,.8,.2,1)"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.74rem;font-weight:800;opacity:.92">
            <span>النسبة</span>
            <span id="bagProgressText">${stats.progress}%</span>
          </div>
        </div>
      </div>

      <!-- الإحصائيات -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">
        <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:16px;padding:14px;text-align:center">
          <div style="font-size:1.4rem;margin-bottom:6px">✅</div>
          <div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:900;color:#D9829A" id="bagDone">${stats.done}</div>
          <div style="font-size:0.68rem;color:var(--ink-3);margin-top:4px;font-weight:700">جاهز</div>
        </div>
        <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:16px;padding:14px;text-align:center">
          <div style="font-size:1.4rem;margin-bottom:6px">⭐</div>
          <div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:900;color:#F5C8A8" id="bagEssentials">${stats.essentialsDone}/${stats.essentialsTotal}</div>
          <div style="font-size:0.68rem;color:var(--ink-3);margin-top:4px;font-weight:700">أساسيات</div>
        </div>
      </div>

      <!-- أزرار سريعة -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px">
        <button onclick="ommyShareBag()" type="button" style="padding:12px 6px;border:none;border-radius:14px;background:linear-gradient(145deg,#EC4899,#BE185D);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.72rem;cursor:pointer;box-shadow:0 8px 18px rgba(236,72,153,.3)">📱 شاركي</button>
        <button onclick="ommyPrintBag()" type="button" style="padding:12px 6px;border:1.5px solid #F0B8C8;border-radius:14px;background:var(--cream);color:#C65D7B;font-family:var(--font-heading);font-weight:900;font-size:0.72rem;cursor:pointer">📄 اطبعي</button>
        <button onclick="ommySpeakBagRemaining()" type="button" style="padding:12px 6px;border:1.5px solid #F0B8C8;border-radius:14px;background:var(--cream);color:#C65D7B;font-family:var(--font-heading);font-weight:900;font-size:0.72rem;cursor:pointer">🔊 اسمعي</button>
      </div>

      <!-- الأقسام -->
      ${renderCategory('mom', state)}
      ${renderCategory('baby', state)}
      ${renderCategory('docs', state)}
      ${renderCategory('partner', state)}

      <!-- نصيحة -->
      <div style="background:linear-gradient(135deg,#FDF3EB,#FBE5CE);border:1.5px solid #F8DCC0;border-radius:18px;padding:16px;margin-bottom:20px;display:flex;gap:12px">
        <span style="font-size:1.5rem;flex-shrink:0">💡</span>
        <div>
          <div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:#A6653A;margin-bottom:4px">نصيحة ذهبية</div>
          <p style="font-size:0.78rem;color:#8B5A38;line-height:1.7;margin:0">جهّزي الحقيبة قبل الأسبوع 36. ضعيها قرب باب المنزل — قد تحتاجينها في أي لحظة!</p>
        </div>
      </div>

      <button onclick="ommySpeakBagAll()" type="button" style="width:100%;padding:14px;border:none;border-radius:16px;background:linear-gradient(145deg,#EC4899,#BE185D);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer;box-shadow:0 12px 26px rgba(236,72,153,.35)">🔊 اسمعي كل المتبقي</button>
    </div>
  `;
}

/* ============ عرض قسم ============ */
function renderCategory(key, state) {
  const cat = BAG_DATA[key];
  const done = cat.items.filter(i => state[i.id]).length;
  const progress = Math.round((done / cat.items.length) * 100);

  return `
    <div style="margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:10px;margin:20px 0 12px">
        <span style="font-size:1.3rem">${cat.icon}</span>
        <span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:${cat.color}">${cat.title}</span>
        <span style="font-size:0.72rem;font-weight:800;background:${cat.bg};color:${cat.color};padding:3px 10px;border-radius:100px;border:1px solid ${cat.border}">${done}/${cat.items.length}</span>
        <span style="flex:1;height:2px;background:linear-gradient(90deg,${cat.color},transparent);border-radius:2px"></span>
        <button onclick="ommySpeakBag('${key}')" type="button" style="background:transparent;border:none;color:${cat.color};font-size:1.1rem;cursor:pointer;padding:0 4px">🔊</button>
      </div>

      ${cat.items.map(item => `
        <button class="bag-item ${state[item.id] ? 'done' : ''}" onclick="ommyBagToggle(this, '${item.id}')" type="button">
          <span class="bag-checkbox">✓</span>
          <span class="bag-item-name" style="flex:1;font-family:var(--font-heading);font-size:0.85rem;font-weight:700;color:var(--ink-2)">${item.name}</span>
          ${item.essential ? '<span style="font-size:0.86rem;color:#F5C8A8">⭐</span>' : ''}
        </button>
      `).join('')}
    </div>
  `;
}

/* ============ قراءة كل المتبقي ============ */
window.ommySpeakBagAll = function() {
  const state = getBagState();
  const remaining = [];
  Object.entries(BAG_DATA).forEach(([key, cat]) => {
    const miss = cat.items.filter(i => !state[i.id]).map(i => i.name);
    if (miss.length) remaining.push(`${cat.title}: ${miss.join('. ')}`);
  });
  if (remaining.length === 0) {
    Voice.speak('حقيبتك جاهزة بالكامل، مبروك', { rate: 0.85 });
    if (window.ommySound?.celebrate) window.ommySound.celebrate();
  } else {
    Voice.speak('المتبقي في حقيبتك. ' + remaining.join('. '), { rate: 0.85 });
  }
  if (window.toast) window.toast('🔊 جاري القراءة', { type: 'success', duration: 1500 });
};

window.ommySpeakBagRemaining = function() {
  const state = getBagState();
  const total = Object.values(BAG_DATA).flatMap(c => c.items);
  const remaining = total.filter(i => !state[i.id]).length;
  Voice.speak(`بقي ${remaining} عنصر في الحقيبة`, { rate: 0.9 });
};

/* ============ تحديث الأرقام تلقائياً ============ */
document.addEventListener('bagUpdate', () => {
  const stats = getStats();
  const bar = document.getElementById('bagProgressBar');
  const txt = document.getElementById('bagProgressText');
  const done = document.getElementById('bagDone');
  const essentials = document.getElementById('bagEssentials');

  if (bar) bar.style.width = stats.progress + '%';
  if (txt) txt.textContent = stats.progress + '%';
  if (done) done.textContent = stats.done;
  if (essentials) essentials.textContent = `${stats.essentialsDone}/${stats.essentialsTotal}`;

  /* احتفال عند الاكتمال */
  if (stats.progress === 100) {
    if (window.ommySound?.celebrate) window.ommySound.celebrate();
    if (window.toast) window.toast('🎉 حقيبتك جاهزة بالكامل!', { type: 'success', duration: 3000 });
  }
});
