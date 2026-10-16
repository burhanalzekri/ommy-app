/* ============================================
   Silent Mode — الوضع الليلي التلقائي
   ============================================ */
import { Storage } from './storage.js';

export const Silent = {
  /* الإعدادات */
  config() {
    return Storage.get('silent_config', {
      enabled: false,
      startHour: 20,  /* 8 PM */
      endHour: 7,     /* 7 AM */
      darkTheme: true,
      muteSounds: true,
      hideNotifications: true,
    });
  },

  save(config) {
    Storage.set('silent_config', config);
    return true;
  },

  /* هل نحن الآن في وضع الصامت؟ */
  isActive() {
    const cfg = this.config();
    if (!cfg.enabled) return false;

    const hour = new Date().getHours();
    const { startHour, endHour } = cfg;

    /* الحالة: عبر منتصف الليل (مثل 20 → 7) */
    if (startHour > endHour) {
      return hour >= startHour || hour < endHour;
    }
    /* الحالة: نفس اليوم (مثل 13 → 15) */
    return hour >= startHour && hour < endHour;
  },

  /* تطبيق الوضع */
  apply() {
    const active = this.isActive();
    const cfg = this.config();

    document.documentElement.setAttribute('data-silent', active ? 'on' : 'off');

    /* تطبيق الوضع الليلي إذا مفعل */
    if (active && cfg.darkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    return active;
  },

  /* تحديث الحالة تلقائياً */
  watch() {
    /* تحديث فوري */
    this.apply();

    /* كل دقيقة */
    setInterval(() => this.apply(), 60 * 1000);

    /* عند تغيير النافذة */
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.apply();
    });
  },
};

/* ============ دوال عامة ============ */
window.ommySilentToggle = function(enabled) {
  const cfg = Silent.config();
  cfg.enabled = enabled;
  Silent.save(cfg);
  Silent.apply();

  if (window.haptic) window.haptic('light');
  if (window.toast) {
    window.toast(
      enabled ? '🌙 الوضع الصامت مُفعَّل' : '☀️ الوضع الصامت مُعطَّل',
      { type: 'info', duration: 1500 }
    );
  }
};

window.ommySilentSave = function(key, value) {
  const cfg = Silent.config();
  cfg[key] = value;
  Silent.save(cfg);
  Silent.apply();
};

window.ommySilentTest = function() {
  const active = Silent.isActive();
  if (window.toast) {
    window.toast(
      active ? '🌙 الوضع الصامت نشط الآن' : '☀️ الوضع العادي نشط الآن',
      { type: 'info' }
    );
  }
};

/* شغّل التتبع */
Silent.watch();
