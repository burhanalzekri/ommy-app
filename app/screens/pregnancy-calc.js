/* ============================================
   شاشة الحمل الذكية — Smart Pregnancy Hub
   ============================================ */
import { Storage } from '../lib/storage.js';
import { Badges } from '../lib/badges.js';
import { Voice, SoundFX } from '../lib/audio.js';

/* ============ نصائح حسب الأسبوع ============ */
const WEEKLY_TIPS = {
  '1-4':   { icon: '🌱', title: 'بداية الرحلة', tips: ['تناولي حمض الفوليك يومياً', 'اشربي 2-3 لتر ماء', 'ابتعدي عن التدخين والكافيين', 'نوم كافٍ 8 ساعات'] },
  '5-8':   { icon: '🌿', title: 'الأسابيع الأولى', tips: ['تجنّبي الأجبان الطرية والنيئة', 'ابتعدي عن الأسماك عالية الزئبق', 'ابدئي بتمارين التنفس', 'ارتاحي عند الغثيان'] },
  '9-12':  { icon: '💗', title: 'نهاية الثلث الأول', tips: ['موعد فحص الشفافية القفوية', 'تجنّبي الأدوية دون استشارة', 'تناولي الحديد بجانب فيتامين C', 'قللي الملح لتفادي التورم'] },
  '13-16': { icon: '✨', title: 'بداية الثلث الثاني', tips: ['أفضل وقت للسفر إن اضطررت', 'مارسي المشي 20 دقيقة', 'ابدئي بترطيب البطن بزيت الزيتون', 'نامي على الجانب الأيسر'] },
  '17-20': { icon: '🦋', title: 'بداية الحركة', tips: ['ستشعرين بحركة الجنين قريباً', 'تحدثي معه يومياً', 'تناولي 300 سعرة إضافية', 'رقّي رأس السرير قليلاً'] },
  '21-24': { icon: '👶', title: 'منتصف الطريق', tips: ['فحص السكري الحملي', 'تجنّبي الوقوف الطويل', 'قيسي ضغطك أسبوعياً', 'ابدئي التسوق لملابس الأمومة'] },
  '25-28': { icon: '🌸', title: 'الثلث الثالث', tips: ['احسبي حركات الجنين يومياً', 'نم مبكراً واستيقظي مبكراً', 'قللي الكافيين لأقل من 200 ملغ', 'راقبي التورم المفاجئ'] },
  '29-32': { icon: '🧡', title: 'الاستعداد للولادة', tips: ['سجّلي في دورة تحضير الولادة', 'حضّري حقيبة الولادة', 'مارسي تمارين كيجل', 'جربي وضعيات الاسترخاء'] },
  '33-36': { icon: '💫', title: 'الأسابيع الأخيرة', tips: ['زيارات الطبيبة أسبوعية', 'تعلمي علامات المخاض', 'خذي قسطاً كافياً من الراحة', 'رقّقي أغراض المولود'] },
  '37-40': { icon: '🎀', title: 'الأسبوع الحاسم', tips: ['الولادة قريبة جداً', 'احملي حقيبة الولادة دائماً', 'راجعي أرقام الطوارئ', 'استرخي وتنفسي بعمق'] },
};

/* ============ رسائل التهنئة ============ */
const CELEBRATIONS = {
  firstTrimester: '🎉 مبروك! أكملتِ الثلث الأول بنجاح',
  secondTrimester: '✨ رائع! دخلتِ الثلث الثاني — الأسهل',
  thirdTrimester: '🌸 أنتِ في الثلث الأخير — اللقاء قريب!',
  halfway: '🌟 يا سلام! منتصف الرحلة اليوم',
  oneMonthLeft: '💗 بقي شهر واحد — استعدي للقاء',
  oneWeekLeft: '🎀 بقي أسبوع واحد فقط!',
  fullTerm: '👶 أكملتِ أسابيع الحمل — بالتوفيق!',
};

/* ============ حساب الحمل ============ */
function calcPregnancy() {
  const data = Storage.get('pregnancy', null);
  if (!data || !data.lmp) return null;

  const lmp = new Date(data.lmp);
  const today = new Date();
  const diffDays = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));

  if (diffDays < 0 || diffDays > 300) return null;

  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  const totalDays = 280;
  const remaining = Math.max(totalDays - diffDays, 0);
  const dueDate = new Date(lmp.getTime() + totalDays * 24 * 60 * 60 * 1000);
  const progress = Math.min(Math.round((diffDays / totalDays) * 100), 100);

  let trimester = 'الأول';
  if (weeks >= 27) trimester = 'الثالث';
  else if (weeks >= 13) trimester = 'الثاني';

  /* احسبي الشهر */
  const month = Math.floor(weeks / 4) + 1;
  const monthNames = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر'];
  const monthName = monthNames[Math.min(month, 10)] || 'العاشر';

  /* نصائح الأسبوع */
  const tipKey = Object.keys(WEEKLY_TIPS).find(k => {
    const [min, max] = k.split('-').map(Number);
    return weeks >= min && weeks <= max;
  });
  const tips = WEEKLY_TIPS[tipKey] || WEEKLY_TIPS['13-16'];

  /* تهنئة */
  let celebration = null;
  if (weeks === 13) celebration = CELEBRATIONS.firstTrimester;
  if (weeks === 14) celebration = CELEBRATIONS.secondTrimester;
  if (weeks === 20) celebration = CELEBRATIONS.halfway;
  if (weeks === 27) celebration = CELEBRATIONS.thirdTrimester;
  if (weeks === 36) celebration = CELEBRATIONS.oneMonthLeft;
  if (weeks === 39) celebration = CELEBRATIONS.oneWeekLeft;
  if (weeks >= 40) celebration = CELEBRATIONS.fullTerm;

  return {
    lmp, weeks, days, remaining, dueDate, progress, trimester,
    monthName, tips, celebration,
    daysUntilNextWeek: 7 - days,
  };
}

/* ============ فتح نافذة الإدخال ============ */
window.ommyCalcPreg = function() {
  if (!window.showModal) return;
  const existing = Storage.get('pregnancy', null);

  window.showModal({
    type: 'question',
    title: '🤰 تاريخ آخر دورة شهرية',
    message: `أدخلي التاريخ لحساب حملك بدقة${existing ? '<br><span style="color:#6D28D9;font-size:0.78rem">(التاريخ الحالي: ' + existing.lmp + ')</span>' : ''}`,
    input: true,
    inputPlaceholder: 'مثال: 2026-08-15',
    inputType: 'date',
    inputDefault: existing?.lmp || '',
    confirmText: '💾 احفظي',
    cancelText: 'إلغاء',
    onConfirm: (dateStr) => {
      if (!dateStr) return;
      const lmp = new Date(dateStr);
      const today = new Date();
      const diffDays = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        if (window.toast) window.toast('⚠️ التاريخ في المستقبل!', { type: 'warning' });
        return;
      }
      if (diffDays > 300) {
        if (window.toast) window.toast('⚠️ التاريخ قديم جداً — تأكدي', { type: 'warning' });
        return;
      }

      Storage.set('pregnancy', { lmp: dateStr });
      if (window.ommySound?.celebrate) window.ommySound.celebrate();
      if (window.toast) window.toast('🎉 تم الحفظ! جاري الحساب...', { type: 'success' });

      setTimeout(() => {
        if (window.ommyRefresh) window.ommyRefresh();
      }, 300);
    },
  });
};

/* ============ قراءة نصائح الأسبوع بصوت ============ */
window.ommySpeakTips = function() {
  const p = calcPregnancy();
  if (!p) return;
  const text = `${p.tips.title}. نصائح الأسبوع ${p.weeks}: ` + p.tips.tips.join('. ');
  Voice.speak(text, { rate: 0.85 });
  if (window.toast) window.toast('🔊 جاري القراءة...', { type: 'success', duration: 1500 });
};

/* ============ الشاشة الرئيسية ============ */
export function PregnancyCalcScreen() {
  const p = calcPregnancy();

  /* ============ حالة 1: لا توجد بيانات ============ */
  if (!p) {
    return `
      <div style="grid-column:1/-1;width:100%">
        <div style="background:linear-gradient(135deg,#8B5CF6 0%,#6D28D9 60%,#4C1D95 100%);border-radius:24px;padding:28px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:22px;box-shadow:0 20px 45px rgba(139,92,246,.4);text-align:center">
          <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
          <div style="position:relative;z-index:1">
            <div style="font-size:4rem;margin-bottom:12px">🤰</div>
            <div style="font-family:var(--font-heading);font-size:1.4rem;font-weight:900;line-height:1.25;margin-bottom:8px">رحلة حمل جميلة</div>
            <div style="font-size:0.86rem;opacity:.92;line-height:1.6">ابدئي بمعرفة أسبوعك<br>ستحصلين على نصائح مخصصة كل أسبوع</div>
          </div>
        </div>

        <button onclick="ommyCalcPreg()" type="button" style="width:100%;padding:18px;border:none;border-radius:18px;background:linear-gradient(145deg,#8B5CF6,#6D28D9);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:1rem;cursor:pointer;box-shadow:0 14px 30px rgba(139,92,246,.4)">
          🤰 ابدئي حساب حملك
        </button>
      </div>
    `;
  }

  /* ============ حالة 2: عرض البيانات ============ */
  return `
    <div style="grid-column:1/-1;width:100%">

      <!-- HERO -->
      <div style="background:linear-gradient(135deg,#8B5CF6 0%,#6D28D9 60%,#4C1D95 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 45px rgba(139,92,246,.4)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="text-align:center;margin-bottom:16px">
            <div style="font-size:0.82rem;opacity:.9;margin-bottom:4px">الأسبوع ${p.weeks} · الشهر ${p.monthName} · الثلث ${p.trimester}</div>
            <div style="font-family:var(--font-heading);font-size:3.5rem;font-weight:900;line-height:1;letter-spacing:-2px">${p.weeks}</div>
            <div style="font-size:0.85rem;opacity:.9;margin-top:4px">أسبوعاً و ${p.days} أيام</div>
          </div>

          <!-- شريط التقدم -->
          <div style="background:rgba(255,255,255,.2);height:10px;border-radius:100px;overflow:hidden;margin-bottom:12px">
            <div style="height:100%;width:${p.progress}%;background:#fff;border-radius:100px;transition:width 1s cubic-bezier(.2,.8,.2,1)"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.7rem;font-weight:800;opacity:.9">
            <span>البداية</span>
            <span>${p.progress}%</span>
            <span>الولادة</span>
          </div>
        </div>
      </div>

      <!-- الإحصائيات الثلاث -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
        ${statBox('📅', 'بقي', p.remaining + ' يوم', '#8B5CF6')}
        ${statBox('🌙', 'الأسبوع القادم', p.daysUntilNextWeek + ' أيام', '#6D28D9')}
        ${statBox('🎀', 'الولادة', p.dueDate.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }), '#4C1D95')}
      </div>

      <!-- التهنئة -->
      ${p.celebration ? `
        <div style="background:linear-gradient(135deg,#FEF3C7,#FDE68A);border:2px solid #F59E0B;border-radius:18px;padding:16px;margin-bottom:20px;display:flex;gap:12px;align-items:center;box-shadow:0 8px 20px rgba(245,158,11,.25)">
          <span style="font-size:2rem;flex-shrink:0">🎉</span>
          <div>
            <div style="font-family:var(--font-heading);font-size:0.95rem;font-weight:900;color:#92400E;line-height:1.4">${p.celebration}</div>
            <div style="font-size:0.74rem;color:#78350F;margin-top:3px">استمري — أنتِ قوية!</div>
          </div>
        </div>
      ` : ''}

      <!-- نصائح الأسبوع -->
      ${sectionHeader(p.tips.icon, 'نصائح الأسبوع ' + p.weeks + ' · ' + p.tips.title, '#8B5CF6')}

      <div style="background:var(--cream);border:1.5px solid #DDD6FE;border-radius:18px;padding:16px;margin-bottom:16px">
        ${p.tips.tips.map((t, i) => `
          <div style="display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:${i === p.tips.tips.length - 1 ? 'none' : '1px dashed #DDD6FE'}">
            <span style="width:32px;height:32px;border-radius:50%;background:linear-gradient(145deg,#8B5CF6,#6D28D9);color:#fff;display:grid;place-items:center;font-family:var(--font-heading);font-weight:900;font-size:0.82rem;flex-shrink:0">${i+1}</span>
            <span style="font-size:0.82rem;color:var(--ink-2);line-height:1.5;flex:1">${t}</span>
          </div>
        `).join('')}
      </div>

      <!-- أزرار سريعة -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">
        <button onclick="ommySpeakTips()" type="button" style="padding:14px;border:none;border-radius:14px;background:linear-gradient(145deg,#8B5CF6,#6D28D9);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.82rem;cursor:pointer;box-shadow:0 8px 20px rgba(139,92,246,.3)">🔊 اسمعي النصائح</button>
        <button onclick="ommyCalcPreg()" type="button" style="padding:14px;border:1.5px solid #C4B5FD;border-radius:14px;background:var(--cream);color:#6D28D9;font-family:var(--font-heading);font-weight:900;font-size:0.82rem;cursor:pointer">✏️ تعديل التاريخ</button>
      </div>

      <!-- معلومات إضافية -->
      ${sectionHeader('💡', 'معلومات مهمة', '#6D28D9')}

      <div style="display:flex;gap:12px;align-items:flex-start;background:linear-gradient(135deg,#FEF2F2,#FEE2E2);border:1.5px solid #FCA5A5;border-radius:16px;padding:14px;margin-bottom:20px">
        <span style="font-size:1.3rem;flex-shrink:0">🚨</span>
        <div>
          <div style="font-family:var(--font-heading);font-size:0.85rem;font-weight:900;color:#B91C1C;margin-bottom:4px">علامات خطر — راجعي الطبيب فوراً</div>
          <div style="font-size:0.74rem;color:#7F1D1D;line-height:1.7">
            • نزيف<br>
            • صداع شديد مستمر<br>
            • تورم مفاجئ بالوجه أو اليدين<br>
            • انقطاع حركة الجنين<br>
            • تشنجات أو ألم بطن شديد
          </div>
        </div>
      </div>

      <!-- ============ قسم الإنجازات ============ -->
      ${sectionHeader('🏆', 'إنجازات رحلة الحمل', '#F59E0B')}

      ${renderBadgesInline()}

      <!-- زر الحقيبة -->
      <button onclick="ommyToast && ommyToast('توجهي لقسم الحمل لمتابعة الحقيبة', '🧳')" type="button" style="width:100%;padding:14px;border:1.5px solid #DDD6FE;border-radius:16px;background:var(--cream);color:#6D28D9;font-family:var(--font-heading);font-weight:900;font-size:0.88rem;cursor:pointer;margin-top:16px">🧳 فتح حقيبة الولادة</button>
    </div>
  `;
}

/* ============ عرض الإنجازات داخل الشاشة ============ */
function renderBadgesInline() {
  const earned = Badges.earned();
  const total = Badges.all.length;
  const progress = Math.round((earned.length / total) * 100);

  /* الشارات المفيدة للحمل فقط */
  const pregBadges = Badges.all.filter(b =>
    ['start', 'week10', 'week13', 'week20', 'week27', 'week36', 'week40'].includes(b.id)
  );

  return `
    <div style="background:linear-gradient(135deg,#FEF3C7,#FDE68A);border:1.5px solid #FCD34D;border-radius:18px;padding:16px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:#92400E">🏆 ${earned.length} من ${total} شارة</div>
        <div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:#B45309">${progress}%</div>
      </div>
      <div style="height:8px;background:rgba(255,255,255,.6);border-radius:100px;overflow:hidden;margin-bottom:14px">
        <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,#F59E0B,#B45309);border-radius:100px;transition:width 1s"></div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
        ${pregBadges.map(b => {
          const has = earned.includes(b.id);
          return `
            <div title="${b.desc}" style="background:${has ? '#fff' : 'rgba(255,255,255,.4)'};border:1.5px solid ${has ? '#F59E0B' : 'rgba(245,158,11,.25)'};border-radius:14px;padding:10px 4px;text-align:center;${has ? '' : 'opacity:.45'}">
              <div style="font-size:1.5rem;${!has ? 'filter:grayscale(1);' : ''}">${b.icon}</div>
              <div style="font-size:0.58rem;font-weight:900;color:#92400E;margin-top:4px;line-height:1.2">${b.title}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      <button onclick="ommyShareBadgesInPreg()" type="button" style="padding:12px;border:none;border-radius:14px;background:linear-gradient(145deg,#F59E0B,#B45309);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.78rem;cursor:pointer;box-shadow:0 8px 18px rgba(245,158,11,.3)">📱 شاركي</button>
      <button onclick="ommyToast && ommyToast('أنجزي المزيد من الشارات! 🏆', '🏆')" type="button" style="padding:12px;border:1.5px solid #FCD34D;border-radius:14px;background:var(--cream);color:#92400E;font-family:var(--font-heading);font-weight:900;font-size:0.78rem;cursor:pointer">🔒 القادمة</button>
    </div>
  `;
}

window.ommyShareBadgesInPreg = function() {
  const earned = Badges.earned();
  const text = `🏆 *إنجازاتي في رحلة الحمل*

🌟 حصلت على ${earned.length} شارة

${Badges.all.filter(b => earned.includes(b.id)).map(b => `${b.icon} ${b.title}`).join('\n')}

🌸 أُمّي — رفيق الأم العربية`;
  if (navigator.share) {
    navigator.share({ title: 'إنجازاتي', text });
  } else {
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  }
};

function sectionHeader(icon, title, color) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,${color},transparent);border-radius:2px"></span></div>`;
}

function statBox(icon, label, value, color) {
  return `
    <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:16px;padding:14px 8px;text-align:center">
      <div style="font-size:1.3rem;margin-bottom:6px">${icon}</div>
      <div style="font-family:var(--font-heading);font-size:0.95rem;font-weight:900;color:${color};line-height:1">${value}</div>
      <div style="font-size:0.65rem;color:var(--ink-3);margin-top:5px;font-weight:700">${label}</div>
    </div>
  `;
}

/* ============ إشعار ذكي يومي ============ */
function schedulePregnancyNotification() {
  const p = calcPregnancy();
  if (!p) return;

  const stored = Storage.get('preg_last_notif', '');
  const today = new Date().toISOString().split('T')[0];

  if (stored === today) return;

  const hour = new Date().getHours();
  if (hour >= 9 && hour <= 21) {
    if (window.ommyNotify) {
      window.ommyNotify.show(`🤰 الأسبوع ${p.weeks}`, {
        body: `${p.tips.title} — ${p.remaining} يوم حتى الولادة`,
        tag: 'preg_daily',
      });
      Storage.set('preg_last_notif', today);
    }
  }
}

setTimeout(schedulePregnancyNotification, 8000);
