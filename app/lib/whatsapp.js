/* ============================================
   المشاركة عبر واتساب — زر عائم + مشاركة ذكية
   ============================================ */
import { Storage } from './storage.js';
import { BabyStore } from './storage.js';
import { Summary } from './summary.js';

export const WhatsApp = {
  /* مشاركة نص عادي */
  share(text) {
    const url = 'https://wa.me/?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
    if (window.haptic) window.haptic('light');
  },

  /* مشاركة رقم معين */
  shareTo(phone, text) {
    const clean = (phone || '').replace(/[^0-9]/g, '');
    const url = `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    if (window.haptic) window.haptic('light');
  },

  /* مشاركة ملخص اليوم */
  shareDailySummary() {
    const baby = BabyStore.get();
    const s = Summary.today();
    const today = new Date().toLocaleDateString('ar-EG', {
      weekday: 'long', day: 'numeric', month: 'long'
    });

    const text = `🌸 *أُمّي — ملخص ${baby.name}*

📅 ${today}

📊 *إحصائيات اليوم:*
🍼 الرضعات: ${s.feeds}
😴 عدد النومات: ${s.sleeps}
⏱️ وقت النوم: ${s.totalSleepLabel}
💧 الحفاضات: ${s.diapers}
${s.meds > 0 ? `💊 الأدوية: ${s.meds}\n` : ''}
${s.sinceLastFeed !== null ? `\n🍼 آخر رضعة: ${s.sinceLastFeedLabel}` : ''}

━━━━━━━━━━━━━━
أُمّي — رفيق الأم العربية 🌸`;

    this.share(text);
  },

  /* مشاركة ملخص الأسبوع */
  shareWeeklySummary() {
    const baby = BabyStore.get();
    const week = Summary.week();

    const totalFeeds = week.reduce((s, d) => s + d.feeds, 0);
    const totalSleeps = week.reduce((s, d) => s + d.sleeps, 0);
    const totalDiapers = week.reduce((s, d) => s + d.diapers, 0);
    const totalSleepMin = week.reduce((s, d) => s + d.totalSleepMin, 0);
    const avgSleep = (totalSleepMin / 7 / 60).toFixed(1);

    const text = `🌸 *أُمّي — أسبوع ${baby.name}*

📅 آخر 7 أيام

📊 *الإجماليات:*
🍼 الرضعات: ${totalFeeds}
😴 عدد النومات: ${totalSleeps}
⏱️ إجمالي النوم: ${Math.floor(totalSleepMin / 60)} س
💧 الحفاضات: ${totalDiapers}

📈 *المتوسط اليومي:*
🍼 ${(totalFeeds / 7).toFixed(1)} رضعة
😴 ${avgSleep} ساعة نوم
💧 ${(totalDiapers / 7).toFixed(1)} حفاض

━━━━━━━━━━━━━━
أُمّي — رفيق الأم العربية 🌸`;

    this.share(text);
  },

  /* مشاركة تقدم الحمل */
  sharePregnancy() {
    const preg = Storage.get('pregnancy', null);
    if (!preg || !preg.lmp) {
      if (window.toast) window.toast('سجّلي حملك أولاً', { type: 'info' });
      return;
    }

    const lmp = new Date(preg.lmp);
    const weeks = Math.floor((new Date() - lmp) / (1000 * 60 * 60 * 24 * 7));
    const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);

    const text = `🌸 *أُمّي — رحلة الحمل*

🤰 *الأسبوع ${weeks}*
📅 موعد الولادة: ${dueDate.toLocaleDateString('ar-EG')}

💗 اللهم احفظ جنيني واجعله من الصالحين

━━━━━━━━━━━━━━
أُمّي — رفيق الأم العربية 🌸`;

    this.share(text);
  },

  /* مشاركة إنجاز */
  shareAchievement(title, description) {
    const text = `🎉 *إنجاز جديد في أُمّي*

🏆 ${title}
${description}

🌸 شاركينا إنجازاتك!

━━━━━━━━━━━━━━
أُمّي — رفيق الأم العربية`;

    this.share(text);
  },

  /* دعوة صديقة للتطبيق */
  inviteFriend() {
    const text = `🌸 *أُمّي — رفيق الأم العربية*

جربي تطبيق أُمّي المجاني:
👶 متابعة النمو والتغذية والنوم
🤰 رفيق الحمل
📚 قصص وأدعية
💗 صحة نفسية للأم

الرابط:
https://ommy-app.web.app

━━━━━━━━━━━━━━
أُمّي — لأن الأم تستحق الأفضل 🌸`;

    this.share(text);
  },

  /* مشاركة وصفة */
  shareRecipe(recipe) {
    const text = `🍽️ *${recipe.icon} ${recipe.name}*
👶 ${recipe.age} · ⏱️ ${recipe.time}

*المكونات:*
${recipe.ingredients.map(i => '• ' + i).join('\n')}

*الخطوات:*
${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

━━━━━━━━━━━━━━
من أُمّي — رفيق الأم العربية 🌸`;

    this.share(text);
  },

  /* مشاركة نص مخصص */
  shareCustom(text) {
    const formatted = `🌸 من أُمّي\n\n${text}\n\n━━━━━━━━━━━━━━\nأُمّي — رفيق الأم العربية`;
    this.share(formatted);
  },
};

window.ommyWA = WhatsApp;

/* ============ دوال عامة ============ */
window.ommyWAShare = () => WhatsApp.shareDailySummary();
window.ommyWAShareWeek = () => WhatsApp.shareWeeklySummary();
window.ommyWASharePreg = () => WhatsApp.sharePregnancy();
window.ommyWAInvite = () => WhatsApp.inviteFriend();
window.ommyWACustom = (text) => WhatsApp.shareCustom(text);
