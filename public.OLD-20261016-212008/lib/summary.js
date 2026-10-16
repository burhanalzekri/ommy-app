/* ============================================
   ملخص اليوم — نظرة شاملة سريعة
   ============================================ */
import { Storage } from './storage.js';
import { BabyStore } from './storage.js';

export const Summary = {
  today() {
    const key = this._key();
    const log = Storage.get('log_' + key, []);

    const feeds = log.filter(e => e.type === 'feed');
    const sleeps = log.filter(e => e.type === 'sleep');
    const diapers = log.filter(e => e.type === 'diaper');
    const meds = log.filter(e => e.type === 'med');

    /* حساب وقت النوم الكلي */
    const totalSleepMin = sleeps.reduce((s, e) => s + Math.floor((e.duration || 0) / 60), 0);

    /* آخر حدث */
    const lastEvent = log.length > 0 ? log[log.length - 1] : null;

    /* آخر رضعة */
    const lastFeed = feeds.length > 0 ? feeds[feeds.length - 1] : null;
    const sinceLastFeed = lastFeed
      ? Math.floor((Date.now() - new Date(lastFeed.time).getTime()) / 60000)
      : null;

    return {
      feeds: feeds.length,
      sleeps: sleeps.length,
      diapers: diapers.length,
      meds: meds.length,
      totalSleepMin,
      totalSleepLabel: this._formatMinutes(totalSleepMin),
      lastEvent,
      sinceLastFeed,
      sinceLastFeedLabel: sinceLastFeed !== null ? this._formatAgo(sinceLastFeed) : 'لم تسجَّل',
      total: log.length,
    };
  },

  /* مقارنة مع الأمس */
  compareYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const key = this._keyOf(yesterday);
    const log = Storage.get('log_' + key, []);

    const today = this.today();
    const yesterdayFeeds = log.filter(e => e.type === 'feed').length;
    const yesterdaySleeps = log.filter(e => e.type === 'sleep').length;

    return {
      feedsDiff: today.feeds - yesterdayFeeds,
      sleepsDiff: today.sleeps - yesterdaySleeps,
      hadYesterday: log.length > 0,
    };
  },

  /* تقدم اليوم (نسبة الإنجاز) */
  dailyProgress() {
    const t = this.today();
    /* الهدف: 4 رضعات + 2 نوم + 5 حفاضات + 0 دواء */
    const feedPct = Math.min(t.feeds / 4, 1) * 30;
    const sleepPct = Math.min(t.sleeps / 2, 1) * 30;
    const diaperPct = Math.min(t.diapers / 5, 1) * 30;
    const extra = t.total > 0 ? 10 : 0;
    return Math.round(feedPct + sleepPct + diaperPct + extra);
  },

  /* ملخص الأسبوع */
  week() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = this._keyOf(d);
      const log = Storage.get('log_' + key, []);
      days.push({
        date: key,
        feeds: log.filter(e => e.type === 'feed').length,
        sleeps: log.filter(e => e.type === 'sleep').length,
        diapers: log.filter(e => e.type === 'diaper').length,
        totalSleepMin: log.filter(e => e.type === 'sleep')
          .reduce((s, e) => s + Math.floor((e.duration || 0) / 60), 0),
        total: log.length,
      });
    }
    return days;
  },

  _key() {
    return this._keyOf(new Date());
  },

  _keyOf(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  _formatMinutes(min) {
    if (min < 60) return min + ' د';
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m === 0 ? `${h} س` : `${h} س ${m} د`;
  },

  _formatAgo(min) {
    if (min < 1) return 'الآن';
    if (min < 60) return `منذ ${min} د`;
    const h = Math.floor(min / 60);
    if (h < 24) return `منذ ${h} س`;
    return `منذ ${Math.floor(h / 24)} ي`;
  },
};

window.ommySummary = Summary;
