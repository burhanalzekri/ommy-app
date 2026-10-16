/* ============================================
   Toast Notifications — رسائل مؤقتة
   ============================================ */

export function toast(message, options = {}) {
  const {
    type = 'info',        // 'info' | 'success' | 'warning' | 'error'
    duration = 2500,
    icon = null,
  } = options;

  /* أيقونة افتراضية حسب النوع */
  const icons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  /* إنشاء العنصر */
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.innerHTML = `
    <span class="toast__icon">${icon || icons[type]}</span>
    <span class="toast__msg">${message}</span>
  `;

  /* إضافته للـ body */
  document.body.appendChild(el);

  /* إظهار تدريجي */
  requestAnimationFrame(() => el.classList.add('toast--show'));

  /* إزالة تلقائية */
  setTimeout(() => {
    el.classList.remove('toast--show');
    setTimeout(() => el.remove(), 300);
  }, duration);
}

/* === اهتزاز خفيف (Haptics) === */
export function haptic(type = 'light') {
  if (!navigator.vibrate) return;
  const patterns = {
    light: [8],
    medium: [15],
    heavy: [30],
    success: [10, 50, 10],
    error: [30, 80, 30],
  };
  try {
    navigator.vibrate(patterns[type] || patterns.light);
  } catch (e) {}
}

/* === تسجيل عالمي للأزرار inline === */
window.toast = toast;
window.haptic = haptic;
