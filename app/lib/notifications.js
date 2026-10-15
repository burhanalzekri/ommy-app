/* ============================================
   الإشعارات الحقيقية
   ============================================ */

export const Notifications = {
  /* التحقق من الدعم */
  supported() {
    return 'Notification' in window;
  },

  /* طلب الإذن */
  async requestPermission() {
    if (!this.supported()) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  },

  /* إشعار فوري */
  async show(title, options = {}) {
    if (!this.supported()) return false;
    const granted = await this.requestPermission();
    if (!granted) return false;

    try {
      const n = new Notification(title, {
        icon: './assets/icon-192.png',
        badge: './assets/icon-192.png',
        dir: 'rtl',
        lang: 'ar',
        ...options,
      });
      setTimeout(() => n.close(), 8000);
      return true;
    } catch (e) {
      console.warn('Notification error:', e);
      return false;
    }
  },

  /* تذكيرات أثناء بقاء التطبيق مفتوحًا فقط؛ هذه ليست جدولة نظام تعمل بعد إغلاق التطبيق. */
  schedule() {
    setInterval(() => {
      if (!this.supported() || Notification.permission !== 'granted') return;
      if (localStorage.getItem('ommi_set_feed_reminder') !== 'true') return;
      const now = Date.now();
      const rawLast = localStorage.getItem('ommi_runtime_feed_notified_at');
      if (!rawLast) { localStorage.setItem('ommi_runtime_feed_notified_at', String(now)); return; }
      const last = Number(rawLast);
      if (now - last < 3 * 60 * 60 * 1000) return;
      localStorage.setItem('ommi_runtime_feed_notified_at', String(now));
      this.show('🍼 تذكير الرضعة', { body: 'إذا حان موعد رضعة طفلك، يمكنكِ تسجيلها الآن.', tag: 'feed_reminder' });
    }, 60 * 1000);

    setInterval(() => {
      if (!this.supported() || Notification.permission !== 'granted') return;
      if (localStorage.getItem('ommi_set_notifications') !== 'true') return;
      const now = new Date();
      const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      if (now.getHours() !== 9 || localStorage.getItem('ommi_runtime_tip_date') === dateKey) return;
      localStorage.setItem('ommi_runtime_tip_date', dateKey);
      this.show('💡 رسالة أُمّي اليومية', { body: 'خذي لحظة لنفسكِ؛ أنتِ تقومين بعمل مهم.', tag: 'daily_tip' });
    }, 60 * 1000);
  },

  /* إشعارات محددة */
  async feedReminder() {
    return this.show('🍼 وقت الرضعة', { body: 'حان وقت رضعة طفلك' });
  },

  async vaccineReminder(name, days) {
    return this.show('💉 تطعيم قادم', {
      body: `${name} بعد ${days} أيام`,
    });
  },

  async sleepReminder() {
    return this.show('🌙 وقت النوم', {
      body: 'حان وقت بدء روتين النوم',
    });
  },
};

/* اجعلها متاحة عالمياً */
window.ommyNotifications = Notifications;

/* ابدأ الجدولة */
Notifications.schedule();

// لا نطلب إذن الإشعارات تلقائيًا؛ يتم طلبه فقط بعد اختيار الأم تفعيلها.
