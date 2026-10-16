/* ============================================
   المزامنة السحابية — Supabase (اختياري)
   ============================================ */

const SUPABASE_URL = 'https://ihawwllrsjhyzriamwog.supabase.co'; /* املئي هنا */
const SUPABASE_KEY = 'sb_publishable_8EFG3k8j8uWZd9mPTlRCHw_6qscs-cC'; /* املئي هنا */
const USER_ID_KEY = 'ommi_user_id';

export const Sync = {
  configured() {
    return SUPABASE_URL && SUPABASE_KEY;
  },

  userId() {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  },

  /* جمع كل بيانات التطبيق */
  collectAll() {
    const data = {};
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('ommi_') && k !== USER_ID_KEY) {
        try {
          data[k] = JSON.parse(localStorage[k]);
        } catch(e) {
          data[k] = localStorage[k];
        }
      }
    });
    return data;
  },

  /* رفع البيانات */
  async push() {
    if (!this.configured()) {
      if (window.toast) window.toast('⚠️ المزامنة غير مُعدّة', { type: 'warning' });
      return { error: 'not-configured' };
    }

    const payload = {
      user_id: this.userId(),
      data: this.collectAll(),
      updated_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/user_data?on_conflict=user_id`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Push failed: ' + res.status);
      if (window.toast) window.toast('☁️ تم الرفع', { type: 'success' });
      return { success: true };
    } catch(e) {
      if (window.toast) window.toast('❌ فشل الرفع: ' + e.message, { type: 'error' });
      return { error: e.message };
    }
  },

  /* سحب البيانات */
  async pull() {
    if (!this.configured()) return { error: 'not-configured' };

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/user_data?user_id=eq.${this.userId()}&select=data`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          },
        }
      );

      if (!res.ok) throw new Error('Pull failed');
      const rows = await res.json();
      if (rows.length === 0) {
        if (window.toast) window.toast('لا توجد بيانات سحابية', { type: 'info' });
        return { error: 'no-data' };
      }

      /* امسح كل data المحلية (فقط ommi_) */
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('ommi_') && k !== USER_ID_KEY) {
          localStorage.removeItem(k);
        }
      });

      /* اكتب البيانات الجديدة */
      Object.entries(rows[0].data).forEach(([key, value]) => {
        try {
          localStorage[key] = JSON.stringify(value);
        } catch(e) {
          localStorage[key] = value;
        }
      });

      if (window.toast) window.toast('☁️ تم السحب', { type: 'success' });
      setTimeout(() => location.reload(), 800);
      return { success: true };
    } catch(e) {
      if (window.toast) window.toast('❌ فشل السحب', { type: 'error' });
      return { error: e.message };
    }
  },

  /* حالة المزامنة */
  status() {
    return {
      configured: this.configured(),
      userId: this.userId(),
      lastSync: localStorage.getItem('ommi_last_sync') || 'أبداً',
    };
  },
};

window.ommySync = Sync;
