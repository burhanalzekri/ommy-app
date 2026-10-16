/* ============================================
   صفحة "عن التطبيق"
   ============================================ */

export function AboutScreen() {
  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#D9829A 0%,#B94F70 60%,#8B3D5A 100%);border-radius:24px;padding:32px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:24px;box-shadow:0 20px 45px rgba(16,185,129,.35);text-align:center">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.25),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="width:100px;height:100px;border-radius:28px;background:linear-gradient(145deg,rgba(255,255,255,.35),rgba(255,255,255,.15));display:grid;place-items:center;margin:0 auto 18px;font-size:3rem;border:1px solid rgba(255,255,255,.3);box-shadow:0 12px 30px rgba(0,0,0,.15)">🌸</div>
          <div style="font-family:var(--font-heading);font-size:1.8rem;font-weight:900;line-height:1.1;margin-bottom:6px">أُمّي</div>
          <div style="font-size:0.85rem;opacity:.92;margin-bottom:4px">رفيق الأم العربية</div>
          <div style="font-size:0.72rem;opacity:.75">الإصدار 1.0.0</div>
        </div>
      </div>

      ${sectionHeader('📖', 'قصتنا')}
      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:20px;margin-bottom:20px">
        <p style="font-size:0.88rem;color:var(--ink-2);line-height:1.9;margin:0;text-align:start">
          وُلدت "أُمّي" من إيمان عميق بأن الأم العربية تستحق رفيقًا يفهمها، يتحدث لغتها، ويحترم ثقافتها.
          <br><br>
          جمعنا لكِ كل ما تحتاجينه من الحمل حتى المدرسة في تطبيق واحد أنيق وسهل — بلغتنا العربية الجميلة.
        </p>
      </div>

      ${sectionHeader('✨', 'ما يميزنا')}

      ${featureCard('🕌', 'محتوى إسلامي أصيل', 'أذكار، أدعية، وتلاوة هادئة بمراجعة شرعية', '#FDF0F3', '#B94F70')}
      ${featureCard('🌍', 'عربي 100%', 'لغة عربية سليمة، تصميم RTL، وثقافة محلية', '#F2EEFC', '#1E40AF')}
      ${featureCard('👩‍⚕️', 'محتوى موثوق', 'معلومات طبية مُراجَعة من طبيبات أطفال', '#FDF3EB', '#C17A4A')}
      ${featureCard('🔒', 'خصوصية تامة', 'بياناتك على جهازك فقط، لا سحابة، لا تتبع', '#FDEEEE', '#B83B3B')}
      ${featureCard('📱', 'بلا إعلانات', 'تجربة نظيفة تمامًا بلا إعلانات مزعجة', '#FDF0F3', '#B94F70')}
      ${featureCard('💝', 'مجاني للأمهات', 'كل الميزات الأساسية مجانية للأبد', '#FFE4D6', '#A85C45')}

      ${sectionHeader('📊', 'إحصائيات')}
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px">
        ${statCard('9', 'شاشات', '#D9829A')}
        ${statCard('26', 'سؤالاً في المساعد', '#3B82F6')}
        ${statCard('6', 'وصفات عربية', '#F5C8A8')}
        ${statCard('8', 'تطعيمات', '#C65D7B')}
      </div>

      ${sectionHeader('🙏', 'شكرًا')}
      <div style="background:linear-gradient(135deg,#F2F9F4,#F8DFE6);border:1.5px solid #D5EAD9;border-radius:18px;padding:20px;margin-bottom:20px;text-align:center">
        <div style="font-family:var(--font-heading);font-size:0.95rem;font-weight:900;color:#B94F70;margin-bottom:8px">شكراً لكل أم عربية 🌸</div>
        <p style="font-size:0.82rem;color:#8B3D5A;line-height:1.8;margin:0">أنتِ البطلة الحقيقية. هذا التطبيق صدقة جارية لكل أم تحتاجه.</p>
      </div>

      ${sectionHeader('📬', 'تواصلي معنا')}
      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px;margin-bottom:20px">
        <div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px dashed var(--line)">
          <span style="font-size:1.2rem">📧</span>
          <div style="flex:1;text-align:start"><div style="font-family:var(--font-heading);font-size:0.85rem;font-weight:800">البريد الإلكتروني</div><div style="font-size:0.72rem;color:var(--ink-3)">hello@ommi.app</div></div>
        </div>
        <div style="display:flex;gap:12px;align-items:center;padding:12px 0">
          <span style="font-size:1.2rem">🌐</span>
          <div style="flex:1;text-align:start"><div style="font-family:var(--font-heading);font-size:0.85rem;font-weight:800">الموقع الرسمي</div><div style="font-size:0.72rem;color:var(--ink-3)">ommi.app</div></div>
        </div>
      </div>

      <div style="text-align:center;padding:20px;color:var(--ink-3);font-size:0.75rem">
        <div style="font-family:var(--font-heading);font-weight:900;margin-bottom:4px;color:var(--ink-2)">صُنع بحب في اليمن 🇾🇪</div>
        <div style="font-size:0.68rem">© 2026 أُمّي — جميع الحقوق محفوظة</div>
      </div>
    </div>
  `;
}

function sectionHeader(icon, title) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,#D9829A,transparent);border-radius:2px"></span></div>`;
}

function featureCard(icon, title, desc, bg, color) {
  return `
    <div style="display:flex;gap:14px;align-items:center;background:var(--cream);border:1.5px solid var(--line);border-radius:16px;padding:14px;margin-bottom:10px">
      <span style="width:52px;height:52px;border-radius:16px;background:${bg};display:grid;place-items:center;font-size:1.5rem;flex-shrink:0">${icon}</span>
      <div style="flex:1;text-align:start">
        <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:900;color:${color};margin-bottom:3px">${title}</div>
        <div style="font-size:0.74rem;color:var(--ink-3);line-height:1.5">${desc}</div>
      </div>
    </div>
  `;
}

function statCard(value, label, color) {
  return `<div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:18px 8px;text-align:center"><div style="font-family:var(--font-heading);font-size:1.7rem;font-weight:900;color:${color};line-height:1">${value}</div><div style="font-size:0.72rem;color:var(--ink-3);margin-top:6px;font-weight:700">${label}</div></div>`;
}
