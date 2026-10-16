/* ============================================
   نظام التطعيمات الذكي — حساب تلقائي + إشعارات
   ============================================ */
import { Storage } from './storage.js';
import { BabyStore } from './storage.js';

export const VaccineScheduler = {
  /* === معرّف الطفل النشط === */
  _activeChildId() {
    try {
      const kids = Storage.get('children', []);
      if (!Array.isArray(kids) || kids.length === 0) return 'child_1';
      const activeId = Storage.get('set_activeChild', 'child_1');
      const found = kids.find(c => c.id === activeId);
      return found ? found.id : kids[0].id;
    } catch (e) {
      return 'child_1';
    }
  },

  /* === مفتاح التخزين للطفل النشط === */
  _storageKey(base) {
    return base + '_' + this._activeChildId();
  },

  /* === Migration: نقل بيانات 'vaccines_done' القديمة للطفل الأول === */
  _migrate() {
    try {
      const legacy = Storage.get('vaccines_done', null);
      if (!legacy || !Array.isArray(legacy) || legacy.length === 0) return;
      
      const kids = Storage.get('children', []);
      if (!Array.isArray(kids) || kids.length === 0) return;
      
      const firstId = kids[0].id;
      const newKey = 'vaccines_done_' + firstId;
      const existing = Storage.get(newKey, null);
      
      // انقل فقط إن لم يكن للطفل الأول تطعيمات مسجلة
      if (!existing || existing.length === 0) {
        Storage.set(newKey, legacy);
        console.log('✅ Migration: نقل ' + legacy.length + ' تطعيم للطفل', kids[0].name);
      }
    } catch (e) {
      console.warn('Migration error:', e);
    }
  },

  /* جدول التطعيمات حسب العمر (بالشهور) */
  schedule: [
    { id: 'v0', ageMonths: 0, name: 'عند الولادة', vaccines: ['BCG (الدرن)', 'التهاب الكبد B'], desc: 'الجرعة الأولى', essential: true },
    { id: 'v1', ageMonths: 2, name: 'شهران', vaccines: ['شلل الأطفال', 'السعال الديكي', 'الكزاز', 'الدفتيريا', 'المستدمية النزلية', 'الالتهاب الرئوي'], desc: 'الجرعة الثانية', essential: true },
    { id: 'v2', ageMonths: 4, name: '4 أشهر', vaccines: ['شلل الأطفال', 'السعال الديكي', 'الكزاز', 'الدفتيريا', 'المستدمية النزلية', 'الالتهاب الرئوي'], desc: 'الجرعة الثالثة', essential: true },
    { id: 'v3', ageMonths: 6, name: '6 أشهر', vaccines: ['شلل الأطفال', 'السعال الديكي', 'الكزاز', 'الدفتيريا'], desc: 'الجرعة الرابعة', essential: true },
    { id: 'v4', ageMonths: 9, name: '9 أشهر', vaccines: ['الحصبة الألمانية'], desc: 'الجرعة الأولى', essential: true },
    { id: 'v5', ageMonths: 12, name: '12 شهراً', vaccines: ['MMR (الحصبة + النكاف + الحصبة الألمانية)'], desc: 'الجرعة الأولى', essential: true },
    { id: 'v6', ageMonths: 18, name: '18 شهراً', vaccines: ['شلل الأطفال', 'الثلاثي البكتيري', 'MMR'], desc: 'الجرعة المنشّطة', essential: true },
    { id: 'v7', ageMonths: 24, name: 'سنتان', vaccines: ['التهاب الكبد A'], desc: 'الجرعة الأولى', essential: false },
    { id: 'v8', ageMonths: 48, name: '4 سنوات', vaccines: ['شلل الأطفال', 'MMR'], desc: 'جرعة المدرسة', essential: false },
    { id: 'v9', ageMonths: 72, name: '6 سنوات', vaccines: ['الثلاثي البكتيري', 'شلل الأطفال'], desc: 'جرعة المدرسة', essential: false },
  ],

  /* تطعيمات تمت */
  completed() {
    // Migration أول مرة
    this._migrate();
    return Storage.get('vaccines_done_' + this._activeChildId(), []);
  },

  /* تعليم تطعيم كـ "تم" */
  markDone(vaccineId) {
    const all = this.completed();
    if (!all.includes(vaccineId)) {
      all.push(vaccineId);
      Storage.set('vaccines_done_' + this._activeChildId(), all);
    }
    return true;
  },

  /* إلغاء */
  markUndone(vaccineId) {
    const all = this.completed().filter(id => id !== vaccineId);
    Storage.set('vaccines_done_' + this._activeChildId(), all);
    return true;
  },

  /* عمر الطفل بالشهور */
  babyAgeMonths() {
    const baby = BabyStore.get();
    if (!baby.birthDate) return 0;
    const birth = new Date(baby.birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 +
                   (now.getMonth() - birth.getMonth());
    return Math.max(0, months);
  },

  /* حالة كل تطعيم */
  status() {
    const baby = BabyStore.get();
    const birthDate = baby.birthDate ? new Date(baby.birthDate) : null;
    const ageMonths = this.babyAgeMonths();
    const done = this.completed();

    return this.schedule.map(v => {
      const dueDate = birthDate ? new Date(birthDate) : null;
      if (dueDate) dueDate.setMonth(dueDate.getMonth() + v.ageMonths);

      const isDone = done.includes(v.id);
      const isDue = ageMonths >= v.ageMonths;
      const daysUntil = dueDate ? Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24)) : 0;

      let state = 'upcoming';
      if (isDone) state = 'done';
      else if (isDue && daysUntil < -30) state = 'late';
      else if (isDue) state = 'due';
      else if (daysUntil <= 14) state = 'soon';

      return {
        ...v,
        dueDate,
        isDone,
        isDue,
        daysUntil,
        state,
      };
    });
  },

  /* التطعيم القادم */
  next() {
    const all = this.status();
    const upcoming = all.filter(v => !v.isDone && v.state !== 'done');
    if (upcoming.length === 0) return null;
    return upcoming[0];
  },

  /* التطعيمات المتأخرة */
  late() {
    return this.status().filter(v => v.state === 'late');
  },

  /* التطعيمات القريبة (14 يوم) */
  soon() {
    return this.status().filter(v => v.state === 'soon');
  },

  /* نسبة الإنجاز */
  progress() {
    const all = this.status();
    const total = all.filter(v => v.essential).length;
    const done = all.filter(v => v.essential && v.isDone).length;
    return {
      total,
      done,
      percent: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  },

  /* إشعارات ذكية */
  async checkNotifications() {
    const next = this.next();
    if (!next) return;

    /* إشعار قبل الموعد بـ 5 أيام */
    if (next.daysUntil <= 5 && next.daysUntil >= 0 && !next.notified5) {
      await this.sendNotification(
        '💉 تطعيم قريب',
        `${next.name} — ${next.vaccines.join(' · ')} بعد ${next.daysUntil} أيام`,
        'v5_' + next.id
      );
    }

    /* إشعار يوم الموعد */
    if (next.daysUntil === 0 && !next.notified0) {
      await this.sendNotification(
        '💉 اليوم موعد التطعيم',
        `${next.name} — ${next.vaccines.join(' · ')}`,
        'v0_' + next.id
      );
    }

    /* إشعار التطعيمات المتأخرة */
    const late = this.late();
    late.forEach(v => {
      if (!v.notifiedLate) {
        this.sendNotification(
          '⚠️ تطعيم متأخر',
          `${v.name} — ${v.vaccines.join(' · ')}`,
          'vl_' + v.id
        );
      }
    });
  },

  async sendNotification(title, body, tag) {
    /* منع التكرار */
    const sentKey = 'vaccines_notified_' + this._activeChildId();
    const sent = Storage.get(sentKey, []);
    if (sent.includes(tag)) return false;

    if (window.ommyNotify) {
      await window.ommyNotify.show(title, { body, tag });
      sent.push(tag);
      Storage.set('vaccines_notified', sent);
    }
    return true;
  },

  /* عدّاد للتذكير */
  startReminderCheck() {
    /* فحص عند التحميل */
    setTimeout(() => this.checkNotifications(), 5000);

    /* فحص كل ساعة */
    setInterval(() => this.checkNotifications(), 60 * 60 * 1000);
  },
};

window.ommyVaccineScheduler = VaccineScheduler;

/* ============ دوال عامة ============ */
window.ommyMarkVaccineDone = function(id) {
  VaccineScheduler.markDone(id);
  if (window.haptic) window.haptic('success');
  if (window.ommySound?.celebrate) window.ommySound.celebrate();
  if (window.toast) window.toast('✅ تم تسجيل التطعيم', { type: 'success' });
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommyMarkVaccineUndone = function(id) {
  VaccineScheduler.markUndone(id);
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommySetBabyBirthDate = function() {
  if (!window.showModal) return;
  const baby = BabyStore.get();

  window.showModal({
    type: 'question',
    title: '🎂 تاريخ ميلاد الطفل',
    message: 'سنحسب كل التطعيمات تلقائياً من هذا التاريخ',
    input: true,
    inputType: 'date',
    inputDefault: baby.birthDate || '',
    confirmText: 'حفظ',
    cancelText: 'إلغاء',
    onConfirm: (date) => {
      if (!date) return;
      const b = BabyStore.get();
      b.birthDate = date;
      BabyStore.save(b);
      if (window.toast) window.toast('✅ تم الحفظ — سيتم حساب التطعيمات', { type: 'success' });
      if (window.ommyRefresh) window.ommyRefresh();
    },
  });
};

/* شغّل التذكيرات */
VaccineScheduler.startReminderCheck();
