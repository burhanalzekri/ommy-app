/* ============================================
   شاشة العناية بالأم — تصميم ذكي وأنيق
   ============================================ */
import { SelfCare } from '../lib/selfcare.js';

export function SelfCareScreen() {
  const mood = SelfCare.todayMood();
  const insight = SelfCare.moodInsight();
  const goals = SelfCare.goalsProgress();
  const streak = SelfCare.streak();
  const tip = SelfCare.smartTip();
  const message = SelfCare.randomMessage();

  return `
    <div style="grid-column:1/-1;width:100%">

      <!-- ============ Hero Card ============ -->
      <div style="background:linear-gradient(135deg,#C9BFE5 0%,#E8A3B6 55%,#D9829A 100%);border-radius:24px;padding:22px;color:#fff;position:relative;overflow:hidden;margin-bottom:16px;box-shadow:0 20px 45px rgba(198,93,123,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
            <span style="width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.22);display:grid;place-items:center;font-size:1.6rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">🌸</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:900;line-height:1.25">يومك مع نفسك</div>
              <div style="font-size:0.75rem;opacity:.9;margin-top:3px">الأم السعيدة = طفل سعيد</div>
            </div>
          </div>

          <div style="background:rgba(255,255,255,.15);border-radius:14px;padding:12px;display:flex;align-items:center;gap:10px">
            <span style="font-size:1.4rem">${streak > 0 ? '🏆' : '🌟'}</span>
            <div style="flex:1;min-width:0">
              <div style="font-family:var(--font-heading);font-weight:900;font-size:0.88rem">${streak > 0 ? streak + ' أيام متتالية!' : 'ابدئي اليوم'}</div>
              <div style="font-size:0.68rem;opacity:.85;margin-top:2px">${streak > 0 ? 'التزامك ملهم — استمري' : 'خطوة صغيرة كل يوم'}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ كيف تشعرين اليوم؟ ============ -->
      <div class="section-title span-full">
        <div class="section-title__label">
          <span class="section-title__icon" style="background:var(--rose-soft);color:var(--clay-deep)">💗</span>
          <span>كيف تشعرين اليوم؟</span>
        </div>
      </div>

      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:20px;padding:16px;margin-bottom:16px;grid-column:1/-1">
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:12px">
          ${SelfCare.moods.map(m => `
            <button onclick="ommyLogMood('${m.key}')" type="button" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px;border:2px solid ${mood === m.key ? m.color : 'transparent'};border-radius:14px;background:${mood === m.key ? m.color + '15' : 'var(--sand)'};cursor:pointer;transition:all .2s;font-family:var(--font-body)">
              <span style="font-size:1.7rem;line-height:1">${m.icon}</span>
              <span style="font-size:0.6rem;font-weight:800;color:${mood === m.key ? m.color : 'var(--ink-3)'};text-align:center">${m.label}</span>
            </button>
          `).join('')}
        </div>

        ${insight ? `
          <div style="display:flex;gap:10px;align-items:center;padding:10px;border-radius:12px;background:${insight.color}15">
            <span style="font-size:1.3rem">${insight.icon}</span>
            <div style="flex:1">
              <div style="font-family:var(--font-heading);font-weight:900;font-size:0.78rem;color:${insight.color}">${insight.level}</div>
              <div style="font-size:0.68rem;color:var(--ink-2);margin-top:2px">${insight.msg}</div>
            </div>
          </div>
        ` : `
          <div style="text-align:center;font-size:0.72rem;color:var(--ink-3);padding:8px">
            سجّلي مزاجك لترين أنماط الأسبوع
          </div>
        `}
      </div>

      <!-- ============ نصائح ذكية ============ -->
      <div class="section-title span-full">
        <div class="section-title__label">
          <span class="section-title__icon" style="background:var(--honey-soft);color:var(--honey-deep)">💡</span>
          <span>لكِ الآن</span>
        </div>
      </div>

      <div style="background:linear-gradient(135deg,var(--lavender-soft),var(--rose-soft));border:1.5px solid var(--lavender);border-radius:20px;padding:16px;margin-bottom:16px;grid-column:1/-1">
        <div style="display:flex;gap:12px;align-items:flex-start">
          <span style="width:48px;height:48px;border-radius:16px;background:#fff;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0;box-shadow:0 4px 12px rgba(123,104,184,.15)">${tip.icon}</span>
          <div style="flex:1;min-width:0">
            <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--lavender-deep);margin-bottom:4px">${tip.title}</div>
            <div style="font-size:0.76rem;color:var(--ink-2);line-height:1.7;margin-bottom:${tip.action ? '12px' : '0'}">${tip.text}</div>
            ${tip.action === 'breath' ? `
              <button onclick="ommySelfCareBreath('calm')" type="button" style="padding:8px 16px;border:none;border-radius:100px;background:var(--lavender-deep);color:#fff;font-family:var(--font-heading);font-weight:800;font-size:0.72rem;cursor:pointer">🌬️ ${tip.actionLabel}</button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- ============ أهداف اليوم ============ -->
      <div class="section-title span-full">
        <div class="section-title__label">
          <span class="section-title__icon" style="background:var(--mint-soft);color:var(--mint-deep)">🎯</span>
          <span>أهداف اليوم</span>
        </div>
        <div style="font-size:0.72rem;font-weight:800;color:var(--clay-deep)">${goals.completed}/${goals.total}</div>
      </div>

      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:20px;padding:16px;margin-bottom:16px;grid-column:1/-1">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.82rem;color:var(--ink)">${goals.percent}% مكتمل</div>
          <div style="font-size:0.7rem;font-weight:800;color:var(--mint-deep)">${goals.completed === goals.total && goals.total > 0 ? '🎉 أنجزتِ الكل!' : 'استمري'}</div>
        </div>

        <div style="height:8px;background:var(--beige);border-radius:100px;overflow:hidden;margin-bottom:14px">
          <div style="height:100%;width:${goals.percent}%;background:linear-gradient(90deg,var(--mint),var(--mint-deep));border-radius:100px;transition:width .6s"></div>
        </div>

        <div style="display:grid;gap:8px">
          ${SelfCare.dailyGoals.map(g => {
            const done = SelfCare.completedGoals().includes(g.id);
            return `
              <button onclick="ommyToggleGoal('${g.id}')" type="button" style="display:flex;align-items:center;gap:12px;padding:11px 12px;border:1.5px solid ${done ? 'var(--mint)' : 'var(--line)'};border-radius:14px;background:${done ? 'var(--mint-soft)' : 'var(--cream)'};cursor:pointer;text-align:start;font-family:var(--font-body);transition:all .2s">
                <span style="width:26px;height:26px;border-radius:8px;border:2px solid ${done ? 'var(--mint-deep)' : 'var(--line)'};background:${done ? 'var(--mint-deep)' : 'transparent'};display:grid;place-items:center;flex-shrink:0;color:#fff;font-weight:900;font-size:0.85rem">${done ? '✓' : ''}</span>
                <span style="font-size:1.3rem">${g.icon}</span>
                <span style="flex:1;min-width:0;font-size:0.82rem;font-weight:600;color:${done ? 'var(--mint-deep)' : 'var(--ink)'};text-decoration:${done ? 'line-through' : 'none'}">${g.label}</span>
                <span style="font-size:0.62rem;font-weight:800;color:var(--ink-3);background:var(--beige);padding:3px 8px;border-radius:100px">${g.category}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ============ تمارين التنفس ============ -->
      <div class="section-title span-full">
        <div class="section-title__label">
          <span class="section-title__icon" style="background:var(--sky-soft);color:var(--sky-deep)">🌬️</span>
          <span>تمارين سريعة</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;grid-column:1/-1">
        ${SelfCare.breathingPatterns.map(p => `
          <button onclick="ommySelfCareBreath('${p.key}')" type="button" style="padding:14px 8px;border:1.5px solid var(--sky-soft);border-radius:16px;background:linear-gradient(135deg,var(--cream),var(--sky-soft));cursor:pointer;font-family:var(--font-body);text-align:center;transition:all .2s">
            <div style="font-size:1.5rem;margin-bottom:6px">🌬️</div>
            <div style="font-family:var(--font-heading);font-weight:900;font-size:0.75rem;color:var(--sky-deep);margin-bottom:2px">${p.name}</div>
            <div style="font-size:0.6rem;color:var(--ink-3);line-height:1.3">${p.desc}</div>
          </button>
        `).join('')}
      </div>

      <!-- ============ رسالة اليوم ============ -->
      <div style="background:linear-gradient(135deg,var(--rose-soft),var(--lavender-soft));border:1.5px solid var(--rose);border-radius:24px;padding:24px;margin-bottom:16px;grid-column:1/-1;text-align:center">
        <div style="font-size:2.5rem;margin-bottom:12px">💗</div>
        <div style="font-size:0.92rem;line-height:1.9;color:var(--ink-2);font-weight:600;font-style:italic">
          "${message}"
        </div>
        <div style="margin-top:14px;font-size:0.68rem;color:var(--ink-3);font-weight:700">🌸 من أُمّي — لأنك تستحقين</div>
      </div>

    </div>
  `;
}
