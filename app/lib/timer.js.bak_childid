/* ============================================
   Timer Mode — مؤقت بدء/إيقاف للرضعة والنوم
   ============================================ */
import { Storage } from './storage.js';

export const Timer = {
  /* الحالة الحالية للمؤقت */
  current() {
    return Storage.get('active_timer', null);
  },

  /* بدء مؤقت جديد */
  start(type, label = '') {
    const existing = this.current();
    if (existing) return { error: 'يوجد مؤقت نشط بالفعل' };

    const timer = {
      type,
      label: label || this._labelFor(type),
      startTime: new Date().toISOString(),
    };
    Storage.set('active_timer', timer);
    return { success: true, timer };
  },

  /* إيقاف المؤقت وحفظ الجرعة */
  stop() {
    const timer = this.current();
    if (!timer) return { error: 'لا يوجد مؤقت نشط' };

    const endTime = new Date().toISOString();
    const duration = Math.floor(
      (new Date(endTime) - new Date(timer.startTime)) / 1000
    );

    /* احفظ الحدث */
    const today = this._todayKey();
    const log = Storage.get('log_' + today, []);
    log.push({
      id: Date.now(),
      type: timer.type,
      time: endTime,
      startTime: timer.startTime,
      duration,
      label: timer.label,
    });
    Storage.set('log_' + today, log);
    Storage.remove('active_timer');

    return { success: true, event: { type: timer.type, duration } };
  },

  /* إلغاء المؤقت */
  cancel() {
    Storage.remove('active_timer');
    return { success: true };
  },

  /* هل المؤقت نشط؟ */
  isActive() {
    return this.current() !== null;
  },

  /* المدة المنقضية بالثواني */
  elapsed() {
    const timer = this.current();
    if (!timer) return 0;
    return Math.floor((new Date() - new Date(timer.startTime)) / 1000);
  },

  _labelFor(type) {
    return {
      feed: 'رضعة',
      sleep: 'نوم',
      diaper: 'حفاض',
      med: 'دواء',
    }[type] || type;
  },

  _todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
};

/* ============ دوال عامة ============ */
let timerInterval = null;

window.ommyStartTimer = function(type) {
  const result = Timer.start(type);
  if (result.error) {
    if (window.toast) window.toast(result.error, { type: 'warning' });
    return;
  }
  if (window.haptic) window.haptic('medium');
  if (window.toast) {
    window.toast(`▶ بدأ مؤقت ${result.timer.label}`, {
      type: 'success', icon: '⏱️'
    });
  }
  if (window.ommyRefresh) window.ommyRefresh();
  startTimerTicker();
};

window.ommyStopTimer = function() {
  const result = Timer.stop();
  if (result.error) {
    if (window.toast) window.toast(result.error, { type: 'warning' });
    return;
  }
  if (window.haptic) window.haptic('success');
  if (window.ommySound && window.ommySound.celebrate) window.ommySound.celebrate();

  const minutes = Math.floor(result.event.duration / 60);
  const seconds = result.event.duration % 60;
  const timeStr = minutes > 0 ? `${minutes} د ${seconds} ث` : `${seconds} ث`;
  if (window.toast) {
    window.toast(`✅ تم حفظ ${Timer._labelFor(result.event.type)} — ${timeStr}`, {
      type: 'success', icon: '💾', duration: 2500
    });
  }
  if (window.ommyRefresh) window.ommyRefresh();
  stopTimerTicker();
};

window.ommyCancelTimer = function() {
  if (!window.ommyConfirm) {
    Timer.cancel();
    if (window.ommyRefresh) window.ommyRefresh();
    return;
  }
  window.ommyConfirm('إلغاء المؤقت؟', 'سيتم حذفه بدون حفظ', {
    danger: true, confirmText: 'إلغاء', cancelText: 'رجوع'
  }).then(ok => {
    if (!ok) return;
    Timer.cancel();
    if (window.toast) window.toast('تم إلغاء المؤقت', { type: 'info' });
    if (window.ommyRefresh) window.ommyRefresh();
    stopTimerTicker();
  });
};

/* ============ تشغيل مؤقت التحديث ============ */
function startTimerTicker() {
  stopTimerTicker();
  timerInterval = setInterval(() => {
    const el = document.getElementById('timerDisplay');
    if (!el) { stopTimerTicker(); return; }
    const s = Timer.elapsed();
    el.textContent = formatDuration(s);
  }, 1000);
}

function stopTimerTicker() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

window.ommyFormatDuration = formatDuration;

/* شغّل المؤقت عند التحميل إذا كان نشطاً */
if (Timer.isActive()) {
  setTimeout(startTimerTicker, 500);
}
