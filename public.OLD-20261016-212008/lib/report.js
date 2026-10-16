/* ============================================
   تقرير PDF للطبيبة — طباعة أنيقة
   ============================================ */
import { Storage } from './storage.js';
import { BabyStore } from './storage.js';
import { Summary } from './summary.js';

export const Report = {
  /* توليد تقرير كامل */
  generate() {
    const baby = BabyStore.get();
    const s = Summary.today();
    const week = Summary.week();

    const today = new Date().toLocaleDateString('ar-EG', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    /* جدول الأسبوع */
    const weekRows = week.map((d, i) => {
      const dayName = ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'][new Date(d.date).getDay()];
      return `
        <tr>
          <td>${dayName}</td>
          <td style="text-align:center">${d.feeds}</td>
          <td style="text-align:center">${d.sleeps}</td>
          <td style="text-align:center">${d.diapers}</td>
          <td style="text-align:center">${Math.floor(d.totalSleepMin / 60)}س ${d.totalSleepMin % 60}د</td>
        </tr>
      `;
    }).join('');

    /* المتوسطات */
    const avgFeeds = (week.reduce((sum, d) => sum + d.feeds, 0) / 7).toFixed(1);
    const avgSleeps = (week.reduce((sum, d) => sum + d.sleeps, 0) / 7).toFixed(1);
    const avgDiapers = (week.reduce((sum, d) => sum + d.diapers, 0) / 7).toFixed(1);
    const totalSleepWeek = week.reduce((sum, d) => sum + d.totalSleepMin, 0);
    const avgSleepHours = (totalSleepWeek / 7 / 60).toFixed(1);

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>تقرير أُمّي — ${baby.name}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Cairo', sans-serif;
    background: #FFF8F7;
    color: #2E1F2B;
    padding: 40px;
    line-height: 1.7;
  }
  .container {
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 10px 40px rgba(46,31,43,.08);
  }
  .header {
    text-align: center;
    padding-bottom: 24px;
    border-bottom: 3px solid #E8A3B6;
    margin-bottom: 32px;
  }
  .logo {
    width: 80px; height: 80px;
    border-radius: 24px;
    background: linear-gradient(135deg, #D9829A, #B94F70);
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 2rem;
    font-weight: 900;
    margin: 0 auto 16px;
  }
  h1 {
    font-size: 28px;
    font-weight: 900;
    color: #B94F70;
    margin-bottom: 8px;
  }
  .subtitle {
    font-size: 14px;
    color: #6B5A63;
  }
  .baby-info {
    background: linear-gradient(135deg, #FDF0F3, #F2EEFC);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 32px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .baby-info__item {
    font-size: 13px;
  }
  .baby-info__label {
    color: #6B5A63;
    font-weight: 700;
    margin-bottom: 2px;
  }
  .baby-info__value {
    color: #B94F70;
    font-weight: 900;
    font-size: 15px;
  }
  h2 {
    font-size: 18px;
    font-weight: 900;
    color: #B94F70;
    margin: 28px 0 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  .stat-box {
    text-align: center;
    padding: 16px 8px;
    background: #FDF8F6;
    border-radius: 14px;
    border: 1px solid #F0E2E6;
  }
  .stat-box__value {
    font-size: 22px;
    font-weight: 900;
    color: #B94F70;
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-box__label {
    font-size: 11px;
    color: #6B5A63;
    font-weight: 700;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
    font-size: 13px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #F0E2E6;
  }
  th {
    background: linear-gradient(135deg, #D9829A, #B94F70);
    color: #fff;
    padding: 12px 8px;
    text-align: center;
    font-weight: 900;
    font-size: 12px;
  }
  td {
    padding: 10px 8px;
    border-bottom: 1px solid #F0E2E6;
    color: #2E1F2B;
    font-weight: 600;
  }
  tr:last-child td { border-bottom: none; }
  tr:nth-child(even) { background: #FDF8F6; }
  .notice {
    background: #FDF6E5;
    border: 1.5px solid #F0C878;
    border-radius: 12px;
    padding: 16px;
    font-size: 12px;
    color: #A87C22;
    line-height: 1.7;
    margin-top: 24px;
  }
  .footer {
    text-align: center;
    margin-top: 40px;
    padding-top: 24px;
    border-top: 2px solid #F0E2E6;
    font-size: 12px;
    color: #A8969E;
  }
  .footer b {
    color: #B94F70;
    font-weight: 900;
  }
  @media print {
    body { padding: 0; background: #fff; }
    .container { box-shadow: none; border-radius: 0; padding: 20px; }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">أ</div>
      <h1>تقرير صحي — أُمّي</h1>
      <div class="subtitle">${today}</div>
    </div>

    <div class="baby-info">
      <div class="baby-info__item">
        <div class="baby-info__label">👶 اسم الطفل</div>
        <div class="baby-info__value">${baby.name}</div>
      </div>
      <div class="baby-info__item">
        <div class="baby-info__label">📅 تاريخ الميلاد</div>
        <div class="baby-info__value">${baby.birthDate || 'غير محدد'}</div>
      </div>
      <div class="baby-info__item">
        <div class="baby-info__label">⚖️ الوزن</div>
        <div class="baby-info__value">${baby.weight ? baby.weight + ' كجم' : '—'}</div>
      </div>
      <div class="baby-info__item">
        <div class="baby-info__label">📏 الطول</div>
        <div class="baby-info__value">${baby.height ? baby.height + ' سم' : '—'}</div>
      </div>
    </div>

    <h2>📊 ملخص اليوم</h2>
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-box__value">${s.feeds}</div>
        <div class="stat-box__label">🍼 رضعات</div>
      </div>
      <div class="stat-box">
        <div class="stat-box__value">${s.sleeps}</div>
        <div class="stat-box__label">😴 نومات</div>
      </div>
      <div class="stat-box">
        <div class="stat-box__value">${s.diapers}</div>
        <div class="stat-box__label">💧 حفاضات</div>
      </div>
      <div class="stat-box">
        <div class="stat-box__value">${s.totalSleepLabel}</div>
        <div class="stat-box__label">⏱️ نوم كلي</div>
      </div>
    </div>

    <h2>📅 الأسبوع الماضي (7 أيام)</h2>
    <table>
      <thead>
        <tr>
          <th>اليوم</th>
          <th>الرضعات</th>
          <th>النومات</th>
          <th>الحفاضات</th>
          <th>وقت النوم</th>
        </tr>
      </thead>
      <tbody>
        ${weekRows}
      </tbody>
    </table>

    <h2>📈 المتوسطات</h2>
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-box__value">${avgFeeds}</div>
        <div class="stat-box__label">رضعة/يوم</div>
      </div>
      <div class="stat-box">
        <div class="stat-box__value">${avgSleeps}</div>
        <div class="stat-box__label">نومة/يوم</div>
      </div>
      <div class="stat-box">
        <div class="stat-box__value">${avgDiapers}</div>
        <div class="stat-box__label">حفاض/يوم</div>
      </div>
      <div class="stat-box">
        <div class="stat-box__value">${avgSleepHours}س</div>
        <div class="stat-box__label">نوم/يوم</div>
      </div>
    </div>

    <div class="notice">
      <b>⚕️ تنبيه:</b> هذا التقرير استرشادي فقط، ولا يُغني عن استشارة الطبيب المختص.
      الأرقام تعتمد على التسجيلات اليدوية من الأم خلال آخر 7 أيام.
    </div>

    <div class="footer">
      <b>🌸 أُمّي</b> — رفيق الأم العربية<br>
      تم إنشاء التقرير في ${new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
    </div>
  </div>
</body>
</html>`;
  },

  /* فتح التقرير في نافذة جديدة */
  open() {
    const html = this.generate();
    const w = window.open('', '_blank');
    if (!w) {
      if (window.toast) window.toast('⚠️ اسمحي بالنوافذ المنبثقة', { type: 'warning' });
      return;
    }
    w.document.write(html);
    w.document.close();

    /* فتح تلقائي لنافذة الطباعة بعد 1.5 ثانية */
    setTimeout(() => {
      try {
        w.focus();
        w.print();
      } catch(e) {
        console.warn('print error:', e);
      }
    }, 1500);

    if (window.haptic) window.haptic('success');
    if (window.toast) {
      window.toast('📄 فتح التقرير — يمكنك حفظه PDF', {
        type: 'success', icon: '📄', duration: 2500
      });
    }
  },

  /* تنزيل HTML (للأرشفة) */
  download() {
    const html = this.generate();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const name = (BabyStore.get().name || 'طفل').replace(/\s/g, '-');
    a.href = url;
    a.download = `ommy-report-${name}-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (window.toast) window.toast('📥 تم التنزيل', { type: 'success' });
  },
};

window.ommyReport = Report;
window.ommyOpenReport = () => Report.open();
window.ommyDownloadReport = () => Report.download();
