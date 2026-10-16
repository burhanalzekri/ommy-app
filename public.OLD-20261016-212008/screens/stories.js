/* ============================================
   شاشة القصص مع قارئ صوتي
   ============================================ */
import { BedtimeStories, MomStories, Metaphors, getRandomMessage } from '../lib/stories.js';
import { Voice, SoundFX } from '../lib/audio.js';

window.ommyReadStory = function(storyId, type) {
  const list = type === 'mom' ? MomStories : BedtimeStories;
  const story = list.find(s => s.id === storyId);
  if (!story || !window.showModal) return;

  /* أضف قارئ صوتي في النافذة */
  window.ommyCurrentStory = story.text;

  window.showModal({
    type: 'info',
    title: story.icon + ' ' + story.title,
    message: `
      <div style="text-align:start">
        ${story.age ? `<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
          <span style="font-size:0.68rem;font-weight:900;background:#FDF0F3;color:#B94F70;padding:4px 10px;border-radius:100px">👶 ${story.age}</span>
          <span style="font-size:0.68rem;font-weight:900;background:#F2EEFC;color:#1E40AF;padding:4px 10px;border-radius:100px">⏱️ ${story.duration}</span>
        </div>` : ''}
        <div id="storyText" style="font-size:0.9rem;line-height:2;color:var(--ink-2);padding:14px;background:linear-gradient(135deg,#FDF6F8,#FDF0F3);border-radius:14px;border:1px solid #D5EAD9">${story.text}</div>
        ${story.moral ? `<div style="margin-top:14px;padding:12px;background:#FDF3EB;border-radius:12px;text-align:center;font-weight:800;color:#A6653A;font-size:0.86rem">🌟 العبرة: ${story.moral}</div>` : ''}
        <div style="display:flex;gap:8px;margin-top:14px">
          <button onclick="ommySpeakCurrent()" type="button" style="flex:1;padding:12px;border:none;border-radius:12px;background:linear-gradient(145deg,#C65D7B,#B94F70);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">🔊 اقرأ بصوت</button>
          <button onclick="ommyStopSpeak()" type="button" style="flex:1;padding:12px;border:none;border-radius:12px;background:var(--beige);color:var(--ink-2);font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">⏸️ أوقف</button>
        </div>
      </div>
    `,
    confirmText: 'إغلاق',
  });

  if (window.haptic) window.haptic('light');
};

window.ommySpeakCurrent = function() {
  if (window.ommyCurrentStory) {
    Voice.speak(window.ommyCurrentStory, { rate: 0.85, pitch: 1.05 });
    if (window.toast) window.toast('🔊 القارئ يعمل الآن', { type: 'success', duration: 1500 });
  }
};

window.ommyReadMetaphor = function(index) {
  if (!window.showModal) return;
  /* المؤشر يُمرَّر مباشرة من onclick */
  const m = window._metaphorsArr && window._metaphorsArr[index];
  if (!m) return;

  window.ommyCurrentStory = m.title + '. ' + m.text;

  window.showModal({
    type: 'success',
    title: m.icon + ' ' + m.title,
    message: `
      <div style="text-align:center">
        <div style="font-size:0.95rem;line-height:1.9;color:#8B3D5A;padding:16px;background:linear-gradient(135deg,#F2F9F4,#F8DFE6);border-radius:14px;font-weight:600">${m.text}</div>
        <button onclick="ommySpeakCurrent()" type="button" style="width:100%;margin-top:14px;padding:12px;border:none;border-radius:12px;background:linear-gradient(145deg,#C65D7B,#B94F70);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">🔊 اسمعي المثال</button>
      </div>
    `,
    confirmText: 'حسناً',
  });
};

export function StoriesScreen() {
  const msg = getRandomMessage();
  window._metaphorsArr = Metaphors;

  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#C65D7B 0%,#B94F70 60%,#8B3D5A 100%);border-radius:24px;padding:24px 20px;color:#fff;position:relative;overflow:hidden;margin-bottom:22px;box-shadow:0 20px 45px rgba(139,92,246,.35)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.3)">📚</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">مكتبة القصص</div>
              <div style="font-size:0.78rem;opacity:.92;margin-top:3px">مع قارئ صوتي عربي</div>
            </div>
          </div>
          <div style="background:rgba(255,255,255,.15);border-radius:12px;padding:12px;font-size:0.82rem;line-height:1.7">
            <div style="font-weight:900;margin-bottom:4px">🌸 رسالة اليوم:</div>
            <div>${msg}</div>
          </div>
        </div>
      </div>

      ${sectionHeader('🌙', 'قصص ما قبل النوم', '#C65D7B')}

      ${BedtimeStories.map(s => storyCard(s, 'bedtime')).join('')}

      ${sectionHeader('💗', 'قصص للأمهات', '#EC4899')}

      ${MomStories.map(s => storyCard(s, 'mom')).join('')}

      ${sectionHeader('🌟', 'أمثلة وتشبيهات', '#F5C8A8')}

      ${Metaphors.map((m, i) => `
        <button onclick="ommyReadMetaphor(${i})" type="button" style="width:100%;background:linear-gradient(135deg,#FDF3EB,#FBE5CE);border:1.5px solid #F8DCC0;border-radius:16px;padding:16px;margin-bottom:10px;cursor:pointer;text-align:start;font-family:var(--font-body);transition:all .25s">
          <div style="display:flex;gap:12px;align-items:center">
            <span style="width:52px;height:52px;border-radius:16px;background:#fff;display:grid;place-items:center;font-size:1.6rem;flex-shrink:0">${m.icon}</span>
            <div style="flex:1">
              <div style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:#A6653A;margin-bottom:4px">${m.title}</div>
              <div style="font-size:0.74rem;color:#8B5A38;line-height:1.5">${m.text.substring(0, 60)}...</div>
            </div>
            <span style="font-size:1.2rem;color:#C17A4A">🔊</span>
          </div>
        </button>
      `).join('')}
    </div>
  `;
}

function sectionHeader(icon, title, color) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,${color},transparent);border-radius:2px"></span></div>`;
}

function storyCard(s, type) {
  const isMom = type === 'mom';
  const bg = isMom ? 'linear-gradient(135deg,#FCE7F3,#FBCFE8)' : 'linear-gradient(135deg,#FDF0F3,#F5D9E2)';
  const border = isMom ? '#F9A8D4' : '#F0B8C8';
  const color = isMom ? '#BE185D' : '#B94F70';
  return `
    <button onclick="ommyReadStory('${s.id}', '${type}')" type="button" style="width:100%;background:${bg};border:1.5px solid ${border};border-radius:18px;padding:16px;margin-bottom:10px;cursor:pointer;text-align:start;font-family:var(--font-body);transition:all .25s">
      <div style="display:flex;gap:14px;align-items:center">
        <span style="width:58px;height:58px;border-radius:18px;background:#fff;display:grid;place-items:center;font-size:1.8rem;flex-shrink:0;border:1px solid ${border}">${s.icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;color:${color};margin-bottom:4px">${s.title}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            ${s.age ? `<span style="font-size:0.62rem;font-weight:800;background:#fff;color:${color};padding:3px 9px;border-radius:100px">${s.age}</span>` : ''}
            ${s.duration ? `<span style="font-size:0.62rem;font-weight:800;background:#fff;color:${color};padding:3px 9px;border-radius:100px">⏱️ ${s.duration}</span>` : ''}
          </div>
        </div>
        <span style="font-size:1.3rem;color:${color}">🔊</span>
      </div>
    </button>
  `;
}
