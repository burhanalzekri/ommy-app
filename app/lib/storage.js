/* ============================================
   طبقة التخزين المحلي — LocalStorage
   كل بيانات التطبيق تُحفظ هنا
   ============================================ */

const PREFIX = 'ommi_';

// Use the device's local calendar date; ISO UTC dates can shift a log to yesterday/tomorrow.
export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const Storage = {
  /* === حفظ === */
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage.set error:', e);
      return false;
    }
  },

  /* === قراءة === */
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn('Storage.get error:', e);
      return fallback;
    }
  },

  /* === حذف === */
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch (e) {
      return false;
    }
  },

  /* === مسح كل شيء === */
  clear() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k));
      return true;
    } catch (e) {
      return false;
    }
  },

  /* === حجم البيانات === */
  size() {
    let total = 0;
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => { total += localStorage[k].length; });
    return total;
  }
};

/* ============================================
   بيانات الطفل
   ============================================ */
export const BabyStore = {
  get() {
    return Storage.get('baby', {
      name: 'آدم',
      birthDate: '2024-08-01',
      weight: 10.2,
      height: 78,
      headCirc: 46,
      allergies: ['peanut'],
    });
  },

  save(baby) {
    return Storage.set('baby', baby);
  },

  updateAge() {
    const baby = this.get();
    const birth = new Date(baby.birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12
                 + (now.getMonth() - birth.getMonth());
    baby.ageMonths = Math.max(0, months);
    this.save(baby);
    return baby;
  }
};

/* ============================================
   سجل الأحداث اليومية
   ============================================ */
export const LogStore = {
  /* الحصول على سجل اليوم */
  today() {
    const today = localDateKey();
    return Storage.get('log_' + today, []);
  },

  /* إضافة حدث */
  add(typeOrObj, data = {}) {
    const today = localDateKey();
    const log = this.today();

    let type = 'event';
    if (typeof typeOrObj === 'string') {
      type = typeOrObj;
    } else if (typeOrObj && typeof typeOrObj === 'object') {
      type = typeOrObj.type || typeOrObj.action || 'event';
    }

    const event = {
      id: Date.now(),
      type,
      time: new Date().toISOString(),
      ...data,
    };

    log.push(event);
    Storage.set('log_' + today, log);
    return event;
  },

  /* عدد أحداث نوع معين اليوم */
  countToday(type) {
    return this.today().filter(e => e.type === type).length;
  },

  /* ملخص اليوم */
  summary() {
    const log = this.today();
    return {
      feeds: log.filter(e => e.type === 'feed').length,
      sleeps: log.filter(e => e.type === 'sleep').length,
      diapers: log.filter(e => e.type === 'diaper').length,
      meds: log.filter(e => e.type === 'med').length,
      total: log.length,
    };
  },

  /* حذف آخر حدث */
  removeLast(type) {
    const today = localDateKey();
    const log = this.today();
    const idx = [...log].reverse().findIndex(e => e.type === type);
    if (idx === -1) return false;
    log.splice(log.length - 1 - idx, 1);
    Storage.set('log_' + today, log);
    return true;
  }
};

/* ============================================
   الإعدادات
   ============================================ */
export const Settings = {
  get(key, fallback = null) {
    return Storage.get('setting_' + key, fallback);
  },
  set(key, value) {
    return Storage.set('setting_' + key, value);
  }
};
