/* المساعد الذكي — 30+ سؤال */
import { ArabicRecipes } from '../lib/content.js';

const REPLIES = {
  'كيف أزيد وزن آدم؟': 'لزيادة الوزن بشكل صحي 🌱<br>• مصادر دهون صحية: زبدة اللوز، الأفوكادو.<br>• 5 وجبات صغيرة بدل 3 كبيرة.<br>• لا تُجبريه على الأكل.<br><br>إذا استمر نقص الوزن شهراً، راجعي الطبيبة.',
  'متى يبدأ المشي؟': 'المشي بين 11 و15 شهراً 👣<br>• بعض الأطفال في 9 وآخرون في 18.<br>• شجّعيه بالمشي حافياً.<br>• لا تستخدمي مشّايات الأطفال.<br><br>راجعي الطبيبة إذا لم يمشِ بعد 18 شهراً.',
  'آدم رفض الرضعة': 'رفض الرضعة شائع 🍼<br>• جرّبي تدفئة الحليب.<br>• غيّري المكان أو الوضعية.<br>• راقبي ألم الأسنان.<br><br>إذا رفض أكثر من 8 ساعات، راجعي الطبيبة.',
  'نصائح لنوم أطول': 'لنوم أطول 🌙<br>• روتين مسائي من 3 خطوات.<br>• إضاءة خافتة قبل النوم بساعة.<br>• لا شاشات بعد 6 مساءً.<br>• نفس الوقت يومياً.',
  'متى يبدأ الكلام؟': 'الكلام 💬<br>• كلمات مفردة: 12-18 شهراً.<br>• جمل قصيرة: عمر سنتين.<br>• 50 كلمة: عمر سنتين.<br><br>راجعي الطبيبة إذا لم ينطق بعد 18 شهراً.',
  'كيف أعالج الإسهال؟': 'الإسهال ⚠️<br>• محلول معالجة الجفاف (ORS).<br>• استمري بالرضاعة.<br>• تجنّبي العصائر.<br><br>راجعي الطبيبة إذا استمر > 24 ساعة أو رافقه دم.',
  'أسنان آدم تتألم': 'ألم التسنين 🦷<br>• عضاضة مبردة (لا مجمدة).<br>• تدليك اللثة بإصبع نظيف.<br>• مسكن حسب الوزن.<br><br>إذا رافقه حرارة > 38°، راجعي الطبيبة.',
  'كيف أحمم المولود؟': 'حمّام المولود 🛁<br>• ماء فاتر 37-38°.<br>• 5-10 دقائق كافية.<br>• ابدئي بالوجه.<br>• لا تتركيه لحظة.',
  'متى أعطي طعاماً صلباً؟': 'متى أبدأ الطعام التكميلي؟ 🥄<br>• غالبًا قرب عمر 6 أشهر عندما تظهر علامات الاستعداد النمائي، مع استمرار الرضاعة أو الحليب المناسب.<br>• قدمي أطعمة طرية غنية بالحديد ومناسبة للعمر، مع مراعاة منع الاختناق والحساسيات.<br>• لا تقدمي العسل قبل عمر سنة، ولا المكسرات الكاملة للأطفال الصغار.<br><br>استشيري الطبيبة إذا كان الطفل خديجًا أو لديه صعوبات تغذية.',
  'كيف أعالج الحرارة؟': 'الحرارة عند الطفل 🌡️<br>• إذا كان عمر الطفل أقل من 3 أشهر وبلغت الحرارة 38° م أو أكثر، اطلبي تقييمًا طبيًا عاجلًا.<br>• صعوبة التنفس، التشنج، صعوبة الإيقاظ أو علامات الجفاف الشديد تستدعي مساعدة عاجلة.<br>• لا تعطي دواءً أو جرعة اعتمادًا على هذه الإجابة؛ اتبعي تعليمات الطبيب المناسبة لعمر الطفل ووزنه.<br><br>عند القلق، تواصلي مع مقدم الرعاية الصحية.',
  'الطفل يبكي كثيراً': 'البكاء المتكرر 😢<br>• تحققي: جوع؟ حفاض؟ حرارة؟ ألم؟<br>• الحمل والتأرجح.<br>• صوت هادئ.<br><br>إذا لم يهدأ ساعات، راجعي الطبيبة.',
  'متى يبدأ الجلوس؟': 'معالم التطور 🪑<br>• الجلوس: 6-8 أشهر.<br>• الزحف: 8-10 أشهر.<br>• الوقوف: 9-12 شهر.<br>• المشي: 11-15 شهر.',
  'كيف أزيد الحليب؟': 'لدعم الرضاعة 🤱<br>• أرضعي حسب إشارات الجوع وتأكدي من الالتقام الصحيح.<br>• اشربي حسب عطشكِ وتناولي غذاءً متوازنًا.<br>• لا تعتمدي على الأعشاب أو المكملات لزيادة الحليب دون استشارة مختص.<br><br>إذا قلّت الحفاضات المبللة أو لم يزد الوزن كما ينبغي، تواصلي مع طبيبة أو استشارية رضاعة.',
  'ما أفضل حليب صناعي؟': 'اختيار الحليب الصناعي 🍼<br>• اختاري تركيبة رضّع معتمدة ومناسبة لعمر الطفل، واتّبعي تعليمات التحضير بدقة.<br>• لا تغيّري التركيبة أو تستخدمي تركيبة علاجية بسبب الحساسية دون استشارة مختص.<br>• لا تخففي الحليب أو تركّزيه أكثر من التعليمات.<br><br>اسألي الطبيبة عن النوع الأنسب لطفلكِ.',
  'التسنين الطبيعي': 'التسنين 🦷<br>• أول سن: 6-10 أشهر.<br>• القواطع السفلية أولاً.<br>• 20 سناً لبنياً قبل 3 سنوات.<br>• صورة أشعة عند 4 سنوات.',
  'أسباب فقدان الشهية': 'فقدان الشهية 🍽️<br>• شائع في عمر 1-3 سنوات.<br>• لا تُجبري.<br>• 5 وجبات صغيرة.<br>• لا سناكس قبل الأكل.',
  'الحساسية الموسمية': 'قد تشمل الحساسية الموسمية العطاس أو سيلان الأنف أو حكة العين، لكن أعراضًا أخرى قد تشبهها.<br>• قللي التعرض للمهيجات ونظفي الأنف بمحلول ملحي مناسب للعمر عند الحاجة.<br>• لا تعطي مضاد حساسية للطفل دون سؤال الطبيب أو الصيدلي عن ملاءمته للعمر والجرعة.',
  'كيف أعالج الإمساك؟': 'الإمساك 💩<br>• ماء + خضار + فواكه.<br>• عصير البرقوق (بعد سنة).<br>• تدليك البطن.<br>• حمّام دافئ.',
  'متى أبدأ السباحة؟': 'سباحة الرضيع 🏊<br>• بعد 6 أشهر.<br>• ماء 32°.<br>• 10-15 دقيقة.<br>• مع بالغ دائماً.',
  'الشاشات للأطفال': 'الشاشات 📱<br>• < 18 شهراً: ممنوعة.<br>• 18-24 شهر: 20 دقيقة.<br>• 2-5 سنوات: 60 دقيقة.<br>• محتوى تعليمي.',
  'الأكل قبل النوم': 'العشاء 🍽️<br>• قبل النوم بـ90 دقيقة.<br>• وجبة خفيفة.<br>• تجنّبي الحلويات.<br>• حليب دافئ مساعد.',
  'خوف الليل': 'خوف الليل 😨<br>• 2-6 سنوات شائع.<br>• إضاءة خفيفة.<br>• دمى محبوبة.<br>• لا تُسخري من خوفه.',
  'الغيرة من مولود جديد': 'غيرة الأخ الجديد 💙<br>• شائعة جداً.<br>• وقت خاص للطفل الأكبر.<br>• اشركيه في الرعاية.',
  'الدرجة المناسبة للحرارة': 'درجة الحرارة 🌡️<br>• طبيعية: 36.5-37.5.<br>• خفيفة: 37.5-38.<br>• حرارة: > 38.<br>• خطيرة: > 39.',
  'وضعية النوم الصحيحة': 'وضعية الرضيع 🛏️<br>• على الظهر دائماً.<br>• بدون وسائد.<br>• سطح مستوٍ صلب.<br>• غرفة الأم 6 أشهر.',
  'متى أعطي الماء؟': 'الماء 💧<br>• قبل عمر 6 أشهر، لا تقدمي الماء عادةً إلا إذا وجّهكِ مختص صحي لذلك؛ يعتمد الرضيع على حليب الأم أو التركيبة.<br>• بعد بدء الطعام التكميلي قرابة 6 أشهر، يمكن تقديم رشفات من الماء مع الوجبات، مع استمرار الحليب المناسب للعمر.<br>• تختلف الاحتياجات بحسب العمر والحالة والطقس؛ اسألي الطبيبة إذا كان لديكِ قلق.',
  'متى أول زيارة طبيب أسنان؟': 'أول زيارة أسنان 🦷<br>• عند ظهور أول سن.<br>• أو قبل عمر سنة.<br>• كل 6 أشهر بعدها.',
};

window.ommyChat = function(btn) { ommyChatSendText(btn.dataset.q); };
window.ommyChatSend = function() {
  const inp = document.getElementById('chatInput');
  if (!inp) return;
  const v = inp.value.trim();
  if (!v) return;
  inp.value = '';
  ommyChatSendText(v);
};
window.ommyChatSendText = function(text) {
  const wrap = document.getElementById('chatWrap');
  if (!wrap || !text) return;
  const u = document.createElement('div');
  u.style.cssText = 'max-width:85%;padding:12px 16px;border-radius:16px 16px 4px 16px;font-size:0.82rem;line-height:1.7;align-self:flex-end;background:linear-gradient(145deg,#D9829A,#B94F70);color:#fff;';
  u.textContent = text;
  wrap.appendChild(u);
  wrap.scrollTop = wrap.scrollHeight;

  const t = document.createElement('div');
  t.style.cssText = 'max-width:85%;padding:14px 18px;border-radius:16px 16px 16px 4px;background:linear-gradient(135deg,#F2F9F4,#F8DFE6);border:1px solid #D5EAD9;align-self:flex-start;display:flex;gap:4px;';
  t.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:#C65D7B;animation:ommyBlink 1.2s infinite"></span><span style="width:6px;height:6px;border-radius:50%;background:#C65D7B;animation:ommyBlink 1.2s infinite .2s"></span><span style="width:6px;height:6px;border-radius:50%;background:#C65D7B;animation:ommyBlink 1.2s infinite .4s"></span>';
  wrap.appendChild(t);
  wrap.scrollTop = wrap.scrollHeight;

  setTimeout(() => {
    t.remove();
    const b = document.createElement('div');
    b.style.cssText = 'max-width:85%;padding:12px 16px;border-radius:16px 16px 16px 4px;font-size:0.82rem;line-height:1.7;background:linear-gradient(135deg,#F2F9F4,#F8DFE6);color:var(--ink);border:1px solid #D5EAD9;';
    b.innerHTML = REPLIES[text] || 'سؤال رائع 🌸<br>لم أجد إجابة محددة. جرّبي إعادة الصياغة أو اسألي الطبيبة.';
    wrap.appendChild(b);
    wrap.scrollTop = wrap.scrollHeight;
  }, 1000);
};

if (!document.getElementById('ommyChatStyle')) {
  const s = document.createElement('style');
  s.id = 'ommyChatStyle';
  s.textContent = '@keyframes ommyBlink{0%,60%,100%{opacity:.3}30%{opacity:1}}';
  document.head.appendChild(s);
}

const Q = [
  'كيف أزيد وزن آدم؟', 'متى يبدأ المشي؟', 'آدم رفض الرضعة', 'نصائح لنوم أطول',
  'متى يبدأ الكلام؟', 'كيف أعالج الإسهال؟', 'أسنان آدم تتألم', 'الطفل يبكي كثيراً',
  'متى أعطي طعاماً صلباً؟', 'كيف أعالج الحرارة؟', 'متى يبدأ الجلوس؟', 'كيف أزيد الحليب؟',
  'ما أفضل حليب صناعي؟', 'التسنين الطبيعي', 'أسباب فقدان الشهية', 'الحساسية الموسمية',
  'كيف أعالج الإمساك؟', 'متى أبدأ السباحة؟', 'الشاشات للأطفال', 'الأكل قبل النوم',
  'خوف الليل', 'الغيرة من مولود جديد', 'الدرجة المناسبة للحرارة', 'وضعية النوم الصحيحة',
  'متى أعطي الماء؟', 'متى أول زيارة طبيب أسنان؟',
];

export function AssistantScreen() {
  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#D9829A 0%,#B94F70 60%,#8B3D5A 100%);border-radius:22px;padding:18px;color:#fff;position:relative;overflow:hidden;margin-bottom:18px;box-shadow:0 20px 40px rgba(16,185,129,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.25),transparent 70%)"></div>
        <div style="display:flex;align-items:center;gap:14px;position:relative;z-index:1">
          <span style="width:52px;height:52px;border-radius:16px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.6rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">💬</span>
          <div>
            <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:900;line-height:1.25">المساعد الذكي</div>
            <div style="font-size:0.75rem;opacity:.92;margin-top:3px">إجابات تثقيفية محفوظة داخل التطبيق 🌸</div>
          </div>
        </div>
      </div>

      <div style="background:#FFF5E3;border:1px solid #E9C98B;color:#6B4A20;border-radius:14px;padding:12px;margin-bottom:12px;font-size:.75rem;line-height:1.7">تنبيه: هذا ليس مساعد ذكاء اصطناعي متصلًا ولا أداة تشخيص. الإجابات عامة وقد لا تناسب كل طفل. في الطوارئ أو عند صعوبة التنفس أو التشنج أو صعوبة الإيقاظ، اطلبي المساعدة الطبية العاجلة.</div>
      <div id="chatWrap" style="background:var(--cream);border:1.5px solid var(--line);border-radius:20px;padding:16px;height:400px;overflow-y:auto;margin-bottom:14px;display:flex;flex-direction:column;gap:12px">
        <div style="max-width:85%;padding:12px 16px;border-radius:16px 16px 16px 4px;font-size:0.82rem;line-height:1.7;background:linear-gradient(135deg,#F2F9F4,#F8DFE6);color:var(--ink);border:1px solid #D5EAD9">أهلًا بكِ في أُمّي 🌸<br>اختاري سؤالًا شائعًا أو اكتبي سؤالًا من القائمة. هذه النسخة تعرض إجابات محفوظة مسبقًا.</div>
      </div>

      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
        ${Q.map(q => `<button onclick="ommyChat(this)" data-q="${q}" type="button" style="font-size:0.72rem;font-weight:700;padding:8px 14px;border-radius:100px;background:var(--cream);border:1.5px solid var(--line);color:var(--ink-2);cursor:pointer;font-family:var(--font-body)">${q}</button>`).join('')}
      </div>

      <div style="display:flex;gap:8px;align-items:center">
        <button onclick="ommyChatSend()" type="button" style="width:48px;height:48px;border-radius:14px;background:linear-gradient(145deg,#D9829A,#B94F70);border:none;color:#fff;font-size:1.2rem;cursor:pointer;flex-shrink:0;font-weight:900">▶</button>
        <input type="text" id="chatInput" placeholder="اكتبي سؤالك..." style="flex:1;border:1.5px solid var(--line);background:var(--cream);border-radius:14px;padding:14px 16px;font-family:var(--font-body);font-size:0.86rem;color:var(--ink);outline:none" onkeydown="if(event.key==='Enter'){ommyChatSend();}" />
      </div>
    </div>
  `;
}
