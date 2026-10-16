/* ============================================
   الميزات الاجتماعية
   ============================================ */

export const Social = {
  /* مشاركة التقدم على واتساب */
  shareProgress(data) {
    const text = `
🌸 *أُمّي - تقدم ${data.babyName}*
📅 ${new Date().toLocaleDateString('ar')}

📊 *إحصائيات اليوم:*
🍼 الرضعات: ${data.feeds}
😴 ساعات النوم: ${data.sleeps}
💧 الحفاضات: ${data.diapers}
💊 الأدوية: ${data.meds}

🎯 الحالة: ${data.status}

---
أُمّي - رفيق الأم العربية 🌸
`.trim();

    if (navigator.share) {
      navigator.share({ title: 'تقدمي في أُمّي', text });
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }
  },

  /* دعوة طبيبة */
  inviteDoctor(doctorName = '') {
    const text = `مرحباً ${doctorName}! أود مشاركة تقدم طفلي معك عبر تطبيق أُمّي.\nيمكنك مراجعة التقارير بشكل منظم.`;
    if (navigator.share) {
      navigator.share({ title: 'دعوة إلى أُمّي', text });
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }
  },

  /* تقرير نصي للطبيبة */
  generateReport(data) {
    return `
تقرير صحي - أُمّي
================
التاريخ: ${new Date().toLocaleDateString('ar')}
اسم الطفل: ${data.babyName}
العمر: ${data.ageMonths} شهراً

📊 إحصائيات آخر أسبوع:
- متوسط الرضعات: ${data.avgFeeds}/يوم
- متوسط النوم: ${data.avgSleeps} ساعة
- متوسط الحفاضات: ${data.avgDiapers}/يوم

📈 التطور:
- الوزن: ${data.weight} كجم
- الطول: ${data.height} سم
- محيط الرأس: ${data.headCirc} سم

📝 ملاحظات:
${data.notes || 'لا توجد ملاحظات'}

---
هذا التقرير استرشادي فقط. يرجى الرجوع للطبيب.
`.trim();
  },
};

window.ommySocial = Social;
window.ommyShareProgress = () => {
  Social.shareProgress({
    babyName: 'آدم',
    feeds: 4,
    sleeps: '11:20',
    diapers: 3,
    meds: 0,
    status: '✓ ممتاز',
  });
};
window.ommyInviteDoctor = () => Social.inviteDoctor('د. هدى');
