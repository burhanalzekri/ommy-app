/* ============================================
   نظام الصوت — قارئ عربي + مؤثرات صوتية
   ============================================ */

export const Voice = {
  /* قارئ عربي حقيقي */
  supported() {
    return 'speechSynthesis' in window;
  },

  /* قائمة الأصوات العربية */
  getArabicVoice() {
    if (!this.supported()) return null;
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.lang && v.lang.startsWith('ar')) ||
           voices.find(v => v.lang && v.lang.startsWith('he')) ||
           voices[0];
  },

  /* نطق نص عربي */
  speak(text, options = {}) {
    if (!this.supported()) {
      if (window.toast) window.toast('⚠️ القارئ غير مدعوم في هذا المتصفح', { type: 'warning' });
      return false;
    }

    /* أوقف أي نطق سابق */
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getArabicVoice();
    if (voice) utterance.voice = voice;

    utterance.lang = options.lang || 'ar-SA';
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onStart) utterance.onstart = options.onStart;

    window.speechSynthesis.speak(utterance);

    if (window.haptic) window.haptic('light');
    return true;
  },

  stop() {
    if (this.supported()) {
      window.speechSynthesis.cancel();
    }
  },

  isSpeaking() {
    return this.supported() && window.speechSynthesis.speaking;
  },
};

/* ============ مؤثرات صوتية (Web Audio API) ============ */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext not supported');
      return null;
    }
  }
  return audioCtx;
}

export const SoundFX = {
  /* صوت نجاح */
  success() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99]; /* C, E, G */
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const startTime = ctx.currentTime + (i * 0.08);
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  },

  /* صوت تنبيه */
  alert() {
    const ctx = getAudioContext();
    if (!ctx) return;
    [800, 600].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'triangle';
      const startTime = ctx.currentTime + (i * 0.15);
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  },

  /* صوت نجاح احتفالي */
  celebrate() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const startTime = ctx.currentTime + (i * 0.1);
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  },

  /* صوت نقرة */
  tap() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 400;
    osc.type = 'square';
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  },

  /* صوت خطأ */
  error() {
    const ctx = getAudioContext();
    if (!ctx) return;
    [200, 150].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sawtooth';
      const startTime = ctx.currentTime + (i * 0.12);
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  },
};

/* ============ دمج مع Toast ============ */
const originalToast = window.toast;
if (originalToast) {
  window.toast = function(message, options) {
    if (options && options.type === 'success') SoundFX.success();
    if (options && options.type === 'error') SoundFX.error();
    if (options && options.type === 'warning') SoundFX.alert();
    return originalToast(message, options);
  };
}

/* ============ دوال عامة للاستخدام في HTML ============ */
window.ommySpeak = (text) => Voice.speak(text);
window.ommyStopSpeak = () => Voice.stop();
window.ommySound = {
  success: () => SoundFX.success(),
  celebrate: () => SoundFX.celebrate(),
  alert: () => SoundFX.alert(),
  tap: () => SoundFX.tap(),
  error: () => SoundFX.error(),
};

/* أحداث تشغيل لتفعيل AudioContext */
document.addEventListener('click', () => {
  /* AudioContext يحتاج تفاعل المستخدم */
  getAudioContext();
}, { once: true });
