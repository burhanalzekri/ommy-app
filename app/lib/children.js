/* ============================================
   إدارة الأطفال — إضافة/تبديل/حذف
   ============================================ */
import { Storage } from './storage.js';
import { Children } from './settings.js';

export const ChildManager = {
  /* قائمة الأطفال */
  all() {
    return Children.list();
  },

  /* الطفل النشط */
  active() {
    return Children.active();
  },

  /* تبديل */
  switchTo(id) {
    const kids = this.all();
    const target = kids.find(k => k.id === id);
    if (!target) return { error: 'الطفل غير موجود' };
    Children.setActive(id);
    return { success: true, child: target };
  },

  /* إضافة */
  add(data) {
    const child = {
      name: data.name || 'طفل',
      birthDate: data.birthDate || '',
      gender: data.gender || 'boy',
      weight: parseFloat(data.weight) || null,
      height: parseFloat(data.height) || null,
      headCirc: parseFloat(data.headCirc) || null,
      bloodType: data.bloodType || '',
      allergies: data.allergies || [],
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
    };
    return Children.add(child);
  },

  /* تعديل */
  update(id, data) {
    const all = this.all();
    const idx = all.findIndex(k => k.id === id);
    if (idx < 0) return { error: 'غير موجود' };

    all[idx] = {
      ...all[idx],
      ...data,
      weight: data.weight !== undefined ? parseFloat(data.weight) || null : all[idx].weight,
      height: data.height !== undefined ? parseFloat(data.height) || null : all[idx].height,
      headCirc: data.headCirc !== undefined ? parseFloat(data.headCirc) || null : all[idx].headCirc,
    };
    Storage.set('children', all);
    return { success: true, child: all[idx] };
  },

  /* حذف */
  remove(id) {
    const all = this.all();
    if (all.length <= 1) {
      return { error: 'لا يمكن حذف الطفل الأخير' };
    }
    const filtered = all.filter(k => k.id !== id);
    Storage.set('children', filtered);

    /* إذا كان المحذوف هو النشط، بدّل للأول */
    if (this.active()?.id === id) {
      Children.setActive(filtered[0].id);
    }
    return { success: true };
  },

  /* حساب العمر الدقيق */
  preciseAge(birthDate) {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const now = new Date();
    const diff = now - birth;

    /* سنوات، شهور، أيام */
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    /* ساعات، دقائق، ثواني */
    const totalSeconds = Math.floor(diff / 1000);
    const totalDays = Math.floor(totalSeconds / 86400);
    const totalWeeks = Math.floor(totalDays / 7);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    /* التالي: عيد الميلاد القادم */
    const nextBirthday = new Date(birth);
    nextBirthday.setFullYear(now.getFullYear());
    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const daysToBirthday = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));

    /* المرحلة */
    let stage = 'رضيع';
    if (years >= 3) stage = 'طفل';
    else if (years >= 1) stage = 'صغير';

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      totalDays,
      totalWeeks,
      daysToBirthday,
      nextBirthday,
      stage,
      label: years > 0
        ? `${years} سنة${years > 2 ? '' : years === 2 ? ' وسنتان' : ' وسنة'}${months > 0 ? ' و ' + months + ' شهر' : ''}`
        : months > 0
          ? `${months} شهر${days > 0 ? ' و ' + days + ' يوم' : ''}`
          : `${days} يوم`,
    };
  },
};

window.ommyChildManager = ChildManager;

/* ============ دوال عامة ============ */
window.ommyOpenChildSwitcher = function() {
  const kids = ChildManager.all();
  const active = ChildManager.active();

  if (kids.length === 0) return;

  const options = kids.map(k => {
    const age = k.birthDate ? ChildManager.preciseAge(k.birthDate) : null;
    const isActive = k.id === active?.id;
    const genderIcon = k.gender === 'girl' ? '👧' : '👶';

    return `
      <button onclick="ommySelectChildFromSwitcher('${k.id}')" type="button" style="width:100%;padding:14px;border:2px solid ${isActive ? 'var(--rose)' : 'var(--line)'};background:${isActive ? 'linear-gradient(135deg,var(--rose-soft),var(--lavender-soft))' : 'var(--cream)'};border-radius:16px;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:12px;font-family:var(--font-body);text-align:start;transition:all .2s">
        <span style="width:44px;height:44px;border-radius:14px;background:${isActive ? 'linear-gradient(145deg,var(--rose),var(--clay-deep))' : 'var(--rose-soft)'};color:${isActive ? '#fff' : 'var(--clay-deep)'};display:grid;place-items:center;font-size:1.4rem;flex-shrink:0">${genderIcon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--ink);margin-bottom:2px">${k.name}</div>
          <div style="font-size:0.7rem;color:var(--ink-3)">${age ? age.label : 'تاريخ الميلاد غير محدد'}</div>
        </div>
        ${isActive ? '<span style="color:var(--clay-deep);font-weight:900;font-size:0.9rem">✓</span>' : ''}
      </button>
    `;
  }).join('');

  if (window.showModal) {
    window.showModal({
      type: 'question',
      title: '👶 اختاري الطفل',
      message: `
        <div style="text-align:start">
          ${options}
          <button onclick="ommyCloseModal&&ommyCloseModal();setTimeout(ommyOpenAddChildForm,150)" type="button" style="width:100%;padding:14px;border:2px dashed var(--rose);background:transparent;border-radius:16px;margin-top:8px;cursor:pointer;font-family:var(--font-heading);font-weight:900;font-size:0.82rem;color:var(--clay-deep)">➕ إضافة طفل جديد</button>
        </div>
      `,
      confirmText: 'إغلاق',
    });
  }
};

window.ommySelectChildFromSwitcher = function(id) {
  const res = ChildManager.switchTo(id);
  if (res.error) {
    if (window.toast) window.toast(res.error, { type: 'error' });
    return;
  }
  if (window.haptic) window.haptic('light');
  if (window.ommySound?.success) window.ommySound.success();
  if (window.toast) window.toast('👶 ' + res.child.name, { type: 'success', duration: 1500 });
  if (window.ommyCloseModal) window.ommyCloseModal();
  if (window.ommyRefresh) setTimeout(() => window.ommyRefresh(), 200);
};

window.ommyOpenAddChildForm = function() {
  if (window.showModal) {
    window.showModal({
      type: 'question',
      title: '➕ إضافة طفل جديد',
      message: 'املئي البيانات التالية:',
      input: true,
      inputPlaceholder: 'اسم الطفل',
      confirmText: 'التالي',
      cancelText: 'إلغاء',
      onConfirm: async (name) => {
        if (!name || !name.trim()) {
          if (window.toast) window.toast('⚠️ الاسم مطلوب', { type: 'warning' });
          return;
        }
        await ommyAddChildStep2(name.trim());
      },
    });
  }
};

window.ommyAddChildStep2 = async function(name) {
  const birthDate = await window.ommyPrompt('تاريخ الميلاد (YYYY-MM-DD)', '2024-08-01', '2024-08-01');
  if (!birthDate) return;

  const gender = await window.ommyPrompt('الجنس (boy/girl)', 'boy', 'boy');
  const weight = await window.ommyPrompt('الوزن (كجم)', 'مثال: 10.5', '');
  const height = await window.ommyPrompt('الطول (سم)', 'مثال: 78', '');
  const headCirc = await window.ommyPrompt('محيط الرأس (سم)', 'مثال: 46', '');

  const res = ChildManager.add({
    name,
    birthDate,
    gender: (gender === 'girl' ? 'girl' : 'boy'),
    weight,
    height,
    headCirc,
  });

  if (res && res.id) {
    ChildManager.switchTo(res.id);
    if (window.haptic) window.haptic('success');
    if (window.ommySound?.celebrate) window.ommySound.celebrate();
    if (window.toast) window.toast('✅ تمت إضافة ' + name, { type: 'success', duration: 2500 });
    if (window.ommyRefresh) setTimeout(() => window.ommyRefresh(), 300);
  } else {
    if (window.toast) window.toast('حدث خطأ في الإضافة', { type: 'error' });
  }
};
