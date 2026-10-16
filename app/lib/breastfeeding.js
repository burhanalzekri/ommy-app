/* ============================================
   تتبع الرضاعة الطبيعية — يمين/يسار
   ============================================ */
import { Storage, LogStore } from './storage.js';

export const Breastfeeding = {
  /* الجلسة النشطة */
  currentSession() {
    return Storage.get('bf_session', null);
  },

  /* بدء جلسة جديدة */
  startSession() {
    const existing = this.currentSession();
    if (existing) return { error: 'يوجد جلسة نشطة' };

    const session = {
      id: 'bf_' + Date.now(),
      startTime: new Date().toISOString(),
      segments: [], /* [{side, start, end, duration}] */
      currentSide: null,
      currentStart: null,
    };
    Storage.set('bf_session', session);
    return { success: true, session };
  },

  /* بدء رضعة على جهة معينة */
  startSide(side) {
    const session = this.currentSession();
    if (!session) return { error: 'لا يوجد جلسة نشطة' };

    /* إذا كان هناك جهة نشطة، أنهاها */
    if (session.currentSide && session.currentStart) {
      const duration = Math.floor(
        (Date.now() - new Date(session.currentStart).getTime()) / 1000
      );
      session.segments.push({
        side: session.currentSide,
        start: session.currentStart,
        end: new Date().toISOString(),
        duration,
      });
    }

    session.currentSide = side; /* 'left' | 'right' */
    session.currentStart = new Date().toISOString();
    Storage.set('bf_session', session);
    return { success: true, session };
  },

  /* إيقاف الجهة النشطة (بدون إنهاء الجلسة) */
  pauseSide() {
    const session = this.currentSession();
    if (!session || !session.currentSide) return { error: 'لا شيء نشط' };

    const duration = Math.floor(
      (Date.now() - new Date(session.currentStart).getTime()) / 1000
    );
    session.segments.push({
      side: session.currentSide,
      start: session.currentStart,
      end: new Date().toISOString(),
      duration,
    });
    session.currentSide = null;
    session.currentStart = null;
    Storage.set('bf_session', session);
    return { success: true, session };
  },

  /* إنهاء الجلسة وحفظها */
  endSession() {
    const session = this.currentSession();
    if (!session) return { error: 'لا يوجد جلسة' };

    /* أنهِ الجهة النشطة */
    if (session.currentSide && session.currentStart) {
      const duration = Math.floor(
        (Date.now() - new Date(session.currentStart).getTime()) / 1000
      );
      session.segments.push({
        side: session.currentSide,
        start: session.currentStart,
        end: new Date().toISOString(),
        duration,
      });
    }

    const totalDuration = session.segments.reduce((sum, s) => sum + s.duration, 0);
    const leftDuration = session.segments
      .filter(s => s.side === 'left')
      .reduce((sum, s) => sum + s.duration, 0);
    const rightDuration = session.segments
      .filter(s => s.side === 'right')
      .reduce((sum, s) => sum + s.duration, 0);

    /* احفظ في السجل */
    LogStore.add('feed', {
      subtype: 'breastfeeding',
      time: new Date().toISOString(),
      startTime: session.startTime,
      duration: totalDuration,
      leftDuration,
      rightDuration,
      segments: session.segments,
    });

    /* امسح الجلسة النشطة */
    Storage.remove('bf_session');

    return {
      success: true,
      totalDuration,
      leftDuration,
      rightDuration,
      nextSide: rightDuration < leftDuration ? 'right' : 'left',
    };
  },

  /* إلغاء */
  cancel() {
    Storage.remove('bf_session');
    return { success: true };
  },

  /* معلومات الجلسة الحالية */
  sessionInfo() {
    const session = this.currentSession();
    if (!session) return null;

    const currentSegDuration = session.currentStart
      ? Math.floor((Date.now() - new Date(session.currentStart).getTime()) / 1000)
      : 0;

    const completedDuration = session.segments.reduce((sum, s) => sum + s.duration, 0);

    const leftTotal = session.segments
      .filter(s => s.side === 'left')
      .reduce((sum, s) => sum + s.duration, 0)
      + (session.currentSide === 'left' ? currentSegDuration : 0);

    const rightTotal = session.segments
      .filter(s => s.side === 'right')
      .reduce((sum, s) => sum + s.duration, 0)
      + (session.currentSide === 'right' ? currentSegDuration : 0);

    return {
      id: session.id,
      startTime: session.startTime,
      currentSide: session.currentSide,
      currentSegDuration,
      totalDuration: completedDuration + currentSegDuration,
      leftTotal,
      rightTotal,
      isActive: !!session.currentSide,
    };
  },

  /* آخر رضعة (للتوصية بالجهة) */
  lastSession() {
    const log = LogStore.today();
    const bfs = log.filter(e => e.type === 'feed' && e.subtype === 'breastfeeding');
    return bfs.length > 0 ? bfs[bfs.length - 1] : null;
  },

  /* توصية الجهة التالية */
  recommendSide() {
    const last = this.lastSession();
    if (!last) return { side: 'left', reason: 'البداية — ابدئي باليسار' };
    if (last.rightDuration < last.leftDuration) {
      return { side: 'right', reason: 'الجهة اليمنى كانت أقصر — ابدئي بها' };
    }
    return { side: 'left', reason: 'الجهة اليسرى كانت أقصر — ابدئي بها' };
  },

  _todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
};

/* ============ دوال عامة ============ */
let bfInterval = null;

window.ommyBfStart = function() {
  const res = Breastfeeding.startSession();
  if (res.error) {
    if (window.toast) window.toast(res.error, { type: 'warning' });
    return;
  }
  if (window.haptic) window.haptic('medium');
  if (window.toast) window.toast('🤱 بدأت جلسة الرضاعة', { type: 'success' });
  if (window.ommyRefresh) window.ommyRefresh();
  startBfTicker();
};

window.ommyBfStartSide = function(side) {
  const res = Breastfeeding.startSide(side);
  if (res.error) {
    if (window.toast) window.toast(res.error, { type: 'warning' });
    return;
  }
  if (window.haptic) window.haptic('light');
  if (window.ommySound?.success) window.ommySound.success();
  const label = side === 'left' ? 'اليسرى' : 'اليمنى';
  if (window.toast) window.toast(`🤱 الرضاعة من الجهة ${label}`, { type: 'success', duration: 1500 });
  if (window.ommyRefresh) window.ommyRefresh();
  startBfTicker();
};

window.ommyBfPause = function() {
  const res = Breastfeeding.pauseSide();
  if (res.error) return;
  if (window.haptic) window.haptic('light');
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommyBfEnd = function() {
  const res = Breastfeeding.endSession();
  if (res.error) {
    if (window.toast) window.toast(res.error, { type: 'warning' });
    return;
  }
  if (window.haptic) window.haptic('success');
  if (window.ommySound?.celebrate) window.ommySound.celebrate();

  const mins = Math.floor(res.totalDuration / 60);
  const secs = res.totalDuration % 60;
  const timeStr = mins > 0 ? `${mins} د ${secs} ث` : `${secs} ث`;
  const nextLabel = res.nextSide === 'left' ? 'اليسرى' : 'اليمنى';

  if (window.toast) {
    window.toast(`✅ تم حفظ الرضعة — ${timeStr}. ابدئي القادمة بـ${nextLabel}`, {
      type: 'success', duration: 3500
    });
  }
  if (window.ommyRefresh) window.ommyRefresh();
  stopBfTicker();
};

window.ommyBfCancel = function() {
  Breastfeeding.cancel();
  if (window.ommyRefresh) window.ommyRefresh();
  stopBfTicker();
};

function startBfTicker() {
  stopBfTicker();
  bfInterval = setInterval(() => {
    const el = document.getElementById('bfActiveTimer');
    if (!el) { stopBfTicker(); return; }
    const info = Breastfeeding.sessionInfo();
    if (info) {
      el.textContent = window.ommyFormatDuration ? window.ommyFormatDuration(info.currentSegDuration) : '00:00';
    }
  }, 1000);
}

function stopBfTicker() {
  if (bfInterval) {
    clearInterval(bfInterval);
    bfInterval = null;
  }
}

if (Breastfeeding.currentSession()) {
  setTimeout(startBfTicker, 500);
}
