/* ============================================
   المشاركة العائلية — الأب/الأم يشاركان البيانات
   ============================================ */
import { Storage } from './storage.js';

const FAMILY_KEY = 'ommi_family';
const USER_ID_KEY = 'ommi_user_id';

export const Family = {
  /* معلومات العائلة */
  info() {
    return Storage.get('family', {
      members: [], /* [{name, role, userId, joinedAt}] */
      inviteCode: null,
      isSharing: false,
    });
  },

  save(data) {
    Storage.set('family', data);
    return true;
  },

  /* معرف المستخدم الحالي */
  myUserId() {
    return localStorage.getItem(USER_ID_KEY) || null;
  },

  /* توليد رمز دعوة قصير */
  generateInviteCode() {
    const id = this.myUserId();
    if (!id) return null;

    /* رمز مكون من 6 أحرف من user_id */
    const code = id.replace('user_', '').substring(0, 6).toUpperCase();

    const info = this.info();
    info.inviteCode = code;
    info.isSharing = true;
    this.save(info);

    return code;
  },

  /* الانضمام إلى عائلة برمز الدعوة */
  joinByCode(code) {
    if (!code || code.length < 4) {
      return { error: 'رمز غير صالح' };
    }

    /* الرمز = جزء من user_id */
    /* في الواقع، نحتاج خادم للبحث عن user_id كامل */
    /* للاستخدام الشخصي: نطلب user_id الكامل */

    return { error: 'استخدمي user_id الكامل' };
  },

  /* الانضمام بـ user_id كامل */
  joinByUserId(userId) {
    if (!userId || !userId.startsWith('user_')) {
      return { error: 'معرف غير صالح' };
    }

    /* احفظ user_id كـ "معرف مشترك" */
    localStorage.setItem(USER_ID_KEY, userId);

    const info = this.info();
    if (!info.members.find(m => m.userId === userId)) {
      info.members.push({
        name: 'عضو',
        role: 'partner',
        userId,
        joinedAt: new Date().toISOString(),
      });
    }
    info.isSharing = true;
    this.save(info);

    return { success: true, userId };
  },

  /* إضافة عضو يدوياً */
  addMember(name, role, userId) {
    const info = this.info();
    info.members.push({
      name,
      role,
      userId,
      joinedAt: new Date().toISOString(),
    });
    info.isSharing = true;
    this.save(info);
    return true;
  },

  /* إزالة عضو */
  removeMember(userId) {
    const info = this.info();
    info.members = info.members.filter(m => m.userId !== userId);
    this.save(info);
    return true;
  },

  /* إلغاء المشاركة */
  stopSharing() {
    const info = this.info();
    info.isSharing = false;
    info.inviteCode = null;
    /* احذف الأعضاء عدا أنا */
    info.members = info.members.filter(m => m.userId === this.myUserId());
    this.save(info);
    return true;
  },

  /* قائمة الأعضاء */
  members() {
    return this.info().members;
  },

  /* عدد الأعضاء */
  count() {
    return this.members().length;
  },
};

window.ommyFamily = Family;

/* ============ دوال عامة ============ */
window.ommyFamilyGenerateCode = function() {
  const code = Family.generateInviteCode();
  if (!code) {
    if (window.toast) window.toast('تعذّر توليد الرمز', { type: 'error' });
    return;
  }
  copyToClipboard(code, 'تم نسخ الرمز');
  if (window.haptic) window.haptic('success');
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommyFamilyCopyId = function() {
  const id = Family.myUserId();
  if (!id) return;
  copyToClipboard(id, 'تم نسخ المعرف');
};

window.ommyFamilyJoin = function() {
  if (!window.showModal) return;

  window.showModal({
    type: 'question',
    title: '👨‍👩‍👧 انضمي لعائلة',
    message: 'الصقي معرف الزوج/الشريك (يبدأ بـ user_)',
    input: true,
    inputPlaceholder: 'user_xxxxxxxxx',
    confirmText: 'انضمي',
    cancelText: 'إلغاء',
    onConfirm: (userId) => {
      const res = Family.joinByUserId(userId.trim());
      if (res.error) {
        if (window.toast) window.toast(res.error, { type: 'warning' });
        return;
      }
      if (window.toast) window.toast('✅ تم الانضمام — سيتم السحب', { type: 'success' });
      if (window.haptic) window.haptic('success');
      /* اسحب البيانات تلقائياً */
      if (window.ommySync) {
        setTimeout(() => window.ommySync.pull(), 800);
      }
    },
  });
};

window.ommyFamilyStop = function() {
  if (!window.ommyConfirm) {
    Family.stopSharing();
    if (window.ommyRefresh) window.ommyRefresh();
    return;
  }
  window.ommyConfirm('إيقاف المشاركة؟', 'لن يرى الآخرون بياناتك', {
    danger: true, confirmText: 'أوقفي', cancelText: 'رجوع'
  }).then(ok => {
    if (!ok) return;
    Family.stopSharing();
    if (window.toast) window.toast('تم إيقاف المشاركة', { type: 'info' });
    if (window.ommyRefresh) window.ommyRefresh();
  });
};

function copyToClipboard(text, msg) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      if (window.toast) window.toast('📋 ' + (msg || 'تم النسخ'), { type: 'success' });
    });
  } else {
    /* Fallback */
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    if (window.toast) window.toast('📋 ' + (msg || 'تم النسخ'), { type: 'success' });
  }
}
