/* ============================================
   المزامنة التلقائية — كل ساعة
   ============================================ */
import { Storage } from './storage.js';

const LAST_SYNC_KEY = 'ommi_last_auto_sync';
const SYNC_INTERVAL_MS = 60 * 60 * 1000; /* ساعة */

export const AutoSync = {
  /* الإعدادات */
  config() {
    return Storage.get('auto_sync_config', {
      enabled: true,
      intervalMinutes: 60,
      lastSync: null,
      syncOnOpen: true,
      onlyOnWifi: false,
    });
  },

  save(config) {
    Storage.set('auto_sync_config', config);
    return true;
  },

  /* هل يجب المزامنة الآن؟ */
  shouldSync() {
    const cfg = this.config();
    if (!cfg.enabled) return false;
    if (!cfg.lastSync) return true;

    const elapsed = Date.now() - new Date(cfg.lastSync).getTime();
    return elapsed >= (cfg.intervalMinutes * 60 * 1000);
  },

  /* مزامنة يدوية */
  async syncNow() {
    if (!window.ommySync || !window.ommySync.configured()) {
      return { error: 'not-configured' };
    }

    try {
      const res = await window.ommySync.push();
      if (res.success) {
        const cfg = this.config();
        cfg.lastSync = new Date().toISOString();
        this.save(cfg);
        return { success: true };
      }
      return res;
    } catch(e) {
      return { error: e.message };
    }
  },

  /* تشغيل المزامنة التلقائية */
  start() {
    const cfg = this.config();
    if (!cfg.enabled) return;

    /* مزامنة عند فتح التطبيق */
    if (cfg.syncOnOpen) {
      setTimeout(() => {
        if (this.shouldSync()) {
          this.syncNow().then(res => {
            if (res.success && window.toast) {
              /* صامت — بدون إشعار للنجاح التلقائي */
              console.log('✅ Auto-sync success');
            }
          });
        }
      }, 3000);
    }

    /* كل 5 دقائق نتحقق */
    setInterval(() => {
      if (this.shouldSync()) {
        this.syncNow().then(res => {
          if (res.error && res.error !== 'not-configured') {
            if (window.toast) {
              window.toast('⚠️ فشل المزامنة التلقائية', {
                type: 'warning', duration: 2000
              });
            }
          }
        });
      }
    }, 5 * 60 * 1000);

    /* عند استئناف التطبيق */
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.shouldSync()) {
        this.syncNow();
      }
    });
  },

  /* معلومات */
  status() {
    const cfg = this.config();
    return {
      enabled: cfg.enabled,
      intervalMinutes: cfg.intervalMinutes,
      lastSync: cfg.lastSync,
      lastSyncLabel: cfg.lastSync
        ? this._formatAgo(cfg.lastSync)
        : 'لم تتم بعد',
    };
  },

  _formatAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'الآن';
    if (diff < 60) return `منذ ${diff} د`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `منذ ${h} س`;
    return `منذ ${Math.floor(h / 24)} ي`;
  },
};

window.ommyAutoSync = AutoSync;

window.ommyAutoSyncToggle = function(enabled) {
  const cfg = AutoSync.config();
  cfg.enabled = enabled;
  AutoSync.save(cfg);
  if (window.haptic) window.haptic('light');
  if (window.toast) {
    window.toast(
      enabled ? '🔄 المزامنة التلقائية مُفعّلة' : '⏸ المزامنة التلقائية متوقفة',
      { type: 'info', duration: 1500 }
    );
  }
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommyAutoSyncNow = function() {
  if (window.toast) window.toast('🔄 جاري المزامنة...', { type: 'info' });
  AutoSync.syncNow().then(res => {
    if (res.success) {
      if (window.haptic) window.haptic('success');
      if (window.ommyRefresh) window.ommyRefresh();
    } else {
      if (window.toast) window.toast('❌ ' + (res.error || 'فشل'), { type: 'error' });
    }
  });
};

/* شغّل عند التحميل */
AutoSync.start();
