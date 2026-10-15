/* ============================================
   شاشة المذكرة — لحظات لا تُنسى
   ============================================ */
import { Memories } from '../lib/memories.js';
import { Children } from '../lib/settings.js';

window.ommyFilterMemories = function(query) {
  const q = String(query || '').trim().toLocaleLowerCase('ar');
  document.querySelectorAll('[data-memory-search]').forEach(card => {
    card.hidden = q.length > 0 && !card.dataset.memorySearch.toLocaleLowerCase('ar').includes(q);
  });
};

window.ommyStartVoiceDiary = function() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    window.toast?.('الإملاء الصوتي غير مدعوم في هذا المتصفح؛ يمكنكِ الكتابة بدلًا منه.', { type: 'warning' });
    return;
  }
  const recognition = new Recognition();
  recognition.lang = 'ar';
  recognition.interimResults = true;
  recognition.continuous = false;
  const field = document.getElementById('ommyVoiceDiaryText');
  if (!field) return;
  const oldText = field.value.trim();
  recognition.onresult = event => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) transcript += event.results[i][0].transcript;
    field.value = [oldText, transcript].filter(Boolean).join(' ').trim();
  };
  recognition.onerror = () => window.toast?.('لم نتمكن من التقاط الكلام. تحققي من إذن الميكروفون أو اكتبي الملاحظة.', { type: 'error' });
  recognition.onend = () => { field.focus(); };
  try { recognition.start(); window.toast?.('🎙️ تفضلي بالتحدث بالعربية', { type: 'info' }); }
  catch (_) { window.toast?.('تعذر بدء الإملاء الصوتي الآن', { type: 'error' }); }
};

window.ommySaveVoiceDiary = function() {
  const field = document.getElementById('ommyVoiceDiaryText');
  const text = field?.value.trim();
  if (!text) { window.toast?.('اكتبي الملاحظة أو استخدمي الإملاء الصوتي أولًا', { type: 'warning' }); return; }
  Memories.add({ icon: '🎙️', title: 'مذكرة يومية', text, kind: 'voice-diary' });
  if (field) field.value = '';
  window.toast?.('💗 تم حفظ مذكرتكِ على هذا الجهاز', { type: 'success' });
  if (window.ommyRefresh) window.ommyRefresh();
};

window.ommyDeleteMemory = function(id) {
  if (!window.ommyConfirm) return;
  window.ommyConfirm('حذف اللحظة؟', 'لا يمكن التراجع', { danger: true, confirmText: 'احذفي' })
    .then(ok => {
      if (!ok) return;
      Memories.remove(id);
      if (window.toast) window.toast('🗑️ تم الحذف', { type: 'success' });
      if (window.ommyRefresh) window.ommyRefresh();
    });
};

export function MemoriesScreen() {
  const active = Children.active();
  const babyName = active?.name || 'آدم';
  const memories = Memories.list();

  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#EC4899 0%,#BE185D 60%,#831843 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:22px;box-shadow:0 20px 45px rgba(236,72,153,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">💝</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">مذكرة ${escapeHtml(babyName)}</div>
              <div style="font-size:0.78rem;opacity:.92;margin-top:3px">لحظات لا تُنسى</div>
            </div>
          </div>
          <div style="display:flex;gap:10px">
            <div style="flex:1;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:12px;text-align:center">
              <div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:900">${memories.length}</div>
              <div style="font-size:0.68rem;opacity:.9;margin-top:2px">لحظة محفوظة</div>
            </div>
            <div style="flex:1;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:12px;text-align:center">
              <div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:900">${Memories.milestones.length}</div>
              <div style="font-size:0.68rem;opacity:.9;margin-top:2px">لحظة مقترحة</div>
            </div>
          </div>
        </div>
      </div>

      ${sectionHeader('🎙️', 'مذكرة يومية بالصوت أو الكتابة')}
      <div class="mom-diary-card" style="background:var(--cream);border:1px solid var(--line);border-radius:20px;padding:15px;margin-bottom:20px;box-shadow:var(--shadow-sm)">
        <label for="ommyVoiceDiaryText" style="display:block;font-weight:800;font-size:.85rem;margin-bottom:8px">ما الذي تحبين تذكّره اليوم؟</label>
        <textarea id="ommyVoiceDiaryText" rows="3" maxlength="3000" placeholder="اكتبي خاطرة أو اضغطي على الإملاء الصوتي…" style="width:100%;box-sizing:border-box;resize:vertical;background:var(--sand);color:var(--ink);border:1px solid var(--line);border-radius:14px;padding:12px;line-height:1.7"></textarea>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
          <button type="button" onclick="ommyStartVoiceDiary()" style="flex:1;min-width:125px;border:1px solid var(--line);border-radius:13px;padding:11px;background:var(--rose-soft);color:var(--ink);font-weight:800">🎙️ إملاء صوتي</button>
          <button type="button" onclick="ommySaveVoiceDiary()" style="flex:1;min-width:125px;border:0;border-radius:13px;padding:11px;background:var(--clay);color:#fff;font-weight:800">💗 حفظ المذكرة</button>
        </div>
        <small style="display:block;color:var(--ink-3);margin-top:8px;line-height:1.6">الإملاء يحوّل الكلام إلى نص عبر دعم المتصفح؛ لا يتم حفظ تسجيل صوتي خام. تُحفظ المذكرة محليًا على جهازكِ.</small>
      </div>

      ${sectionHeader('⭐', 'أضيفي لحظة جديدة')}
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px">
        ${Memories.milestones.map(m => `
          <button onclick="ommyAddMemory('${m.icon}', '${m.title}')" type="button" style="background:var(--cream);border:1.5px solid var(--line);border-radius:14px;padding:14px 6px;text-align:center;cursor:pointer;font-family:var(--font-body);transition:all .25s">
            <div style="font-size:1.5rem;display:block;margin-bottom:4px">${m.icon}</div>
            <div style="font-family:var(--font-heading);font-size:0.68rem;font-weight:800;color:var(--ink-2);line-height:1.2">${escapeHtml(m.title || 'ذكرى')}</div>
          </button>
        `).join('')}
      </div>

      ${sectionHeader('📔', 'لحظات محفوظة')}
      ${memories.length ? `<input type="search" aria-label="البحث في المذكرات" placeholder="🔎 ابحثي في مذكراتكِ…" oninput="ommyFilterMemories(this.value)" style="width:100%;box-sizing:border-box;background:var(--cream);color:var(--ink);border:1px solid var(--line);border-radius:14px;padding:12px;margin-bottom:12px">` : ''}

      ${memories.length === 0 ? `
        <div style="background:var(--cream);border:1.5px dashed var(--line);border-radius:18px;padding:40px 20px;text-align:center;margin-bottom:20px">
          <div style="font-size:3rem;margin-bottom:12px">💝</div>
          <div style="font-family:var(--font-heading);font-size:1rem;font-weight:900;color:var(--ink-2);margin-bottom:6px">لا توجد لحظات بعد</div>
          <div style="font-size:0.78rem;color:var(--ink-3);line-height:1.6">ابدئي بحفظ أجمل لحظات ${escapeHtml(babyName)}<br>من الأزرار في الأعلى</div>
        </div>
      ` : memories.map(m => memoryCard(m)).join('')}

      ${memories.length > 0 ? `
        <button onclick="ommyShareSummary && ommyShareSummary()" type="button" style="width:100%;padding:14px;border:none;border-radius:16px;background:linear-gradient(145deg,#EC4899,#BE185D);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;cursor:pointer;box-shadow:0 12px 26px rgba(236,72,153,.35)">📱 شاركي المذكرة</button>
      ` : ''}
    </div>
  `;
}

function sectionHeader(icon, title) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,#EC4899,transparent);border-radius:2px"></span></div>`;
}

function memoryCard(m) {
  const date = new Date(m.date);
  const dateStr = date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
  return `
    <div data-memory-search="${escapeHtml(`${m.title || ''} ${m.text || ''}`)}" style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px;margin-bottom:12px;position:relative">
      <button onclick="ommyDeleteMemory('${escapeHtml(m.id)}')" type="button" style="position:absolute;top:12px;inset-inline-end:12px;width:28px;height:28px;border-radius:50%;background:var(--red-soft);color:#DC2626;border:none;cursor:pointer;font-size:0.85rem;display:grid;place-items:center">✕</button>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <span style="width:52px;height:52px;border-radius:16px;background:linear-gradient(145deg,#FCE7F3,#FBCFE8);display:grid;place-items:center;font-size:1.6rem;flex-shrink:0">${escapeHtml(m.icon || '💗')}</span>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;color:#BE185D;margin-bottom:4px">${escapeHtml(m.title || 'ذكرى')}</div>
          <div style="font-size:0.82rem;color:var(--ink-2);line-height:1.6;margin-bottom:8px">${escapeHtml(m.text || '')}</div>
          <div style="font-size:0.68rem;color:var(--ink-3);font-weight:700">📅 ${dateStr}</div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}
