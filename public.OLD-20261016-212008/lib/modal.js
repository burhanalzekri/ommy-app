/* ============================================
   مكتبة النوافذ الأنيقة — Modal Library
   ============================================ */

let currentModal = null;

export function showModal(opts = {}) {
  const {
    type = 'info',
    title = '',
    message = '',
    input = false,
    inputPlaceholder = '',
    inputDefault = '',
    inputType = 'text',
    confirmText = 'حسناً',
    cancelText = 'إلغاء',
    danger = false,
    success = false,
    onConfirm = null,
    onCancel = null,
  } = opts;

  closeModal();

  const icons = {
    info:    { emoji: '💬', bg: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)', color: '#1E40AF' },
    success: { emoji: '✅', bg: 'linear-gradient(135deg,#DCFCE7,#BBF7D0)', color: '#15803D' },
    warning: { emoji: '⚠️', bg: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', color: '#92400E' },
    error:   { emoji: '❌', bg: 'linear-gradient(135deg,#FEE2E2,#FECACA)', color: '#991B1B' },
    question:{ emoji: '❓', bg: 'linear-gradient(135deg,#EDE9FE,#DDD6FE)', color: '#6D28D9' },
    delete:  { emoji: '🗑️', bg: 'linear-gradient(135deg,#FEE2E2,#FECACA)', color: '#991B1B' },
  };
  const ic = icons[danger ? 'delete' : type] || icons.info;

  const overlay = document.createElement('div');
  overlay.className = 'ommy-modal-overlay';

  const confirmBg = danger
    ? 'linear-gradient(135deg,#DC2626,#991B1B)'
    : 'linear-gradient(135deg,#10B981,#047857)';

  overlay.innerHTML = `
    <div class="ommy-modal" role="dialog" aria-modal="true">
      <div class="ommy-modal__icon" style="background:${ic.bg};color:${ic.color}">${ic.emoji}</div>
      ${title ? `<div class="ommy-modal__title">${title}</div>` : ''}
      ${message ? `<div class="ommy-modal__message">${message}</div>` : ''}
      ${input ? `
        <input class="ommy-modal__input" type="${inputType}"
               placeholder="${inputPlaceholder}"
               value="${inputDefault}"
               id="ommyModalInput" />
      ` : ''}
      <div class="ommy-modal__actions">
        ${onCancel !== null || input || opts.showCancel !== false ? `
          <button class="ommy-modal__btn ommy-modal__btn--ghost" id="ommyModalCancel" type="button">${cancelText}</button>
        ` : ''}
        <button class="ommy-modal__btn ommy-modal__btn--primary"
                id="ommyModalConfirm"
                type="button"
                style="background:${confirmBg}">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  currentModal = overlay;

  requestAnimationFrame(() => overlay.classList.add('ommy-modal-overlay--show'));

  const inputEl = overlay.querySelector('#ommyModalInput');
  if (inputEl) setTimeout(() => inputEl.focus(), 300);

  function handleConfirm() {
    const value = inputEl ? inputEl.value.trim() : true;
    closeModal();
    if (onConfirm) onConfirm(value);
  }

  function handleCancel() {
    closeModal();
    if (onCancel) onCancel();
  }

  overlay.querySelector('#ommyModalConfirm').addEventListener('click', handleConfirm);
  const cancelBtn = overlay.querySelector('#ommyModalCancel');
  if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);

  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleConfirm();
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) handleCancel();
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  return { confirm: handleConfirm, cancel: handleCancel };
}

export function closeModal() {
  if (currentModal) {
    currentModal.classList.remove('ommy-modal-overlay--show');
    const m = currentModal;
    setTimeout(() => m.remove(), 250);
    currentModal = null;
  }
}

/* ============ دوال مختصرة ============ */
export function ommyAlert(title, message, type = 'info') {
  return showModal({ type, title, message, showCancel: false, confirmText: 'حسناً' });
}

export function ommyConfirm(title, message, opts = {}) {
  return new Promise((resolve) => {
    showModal({
      type: opts.type || 'question',
      title,
      message,
      confirmText: opts.confirmText || 'تأكيد',
      cancelText: opts.cancelText || 'إلغاء',
      danger: opts.danger,
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}

export function ommyPrompt(title, placeholder, defaultValue = '') {
  return new Promise((resolve) => {
    showModal({
      type: 'question',
      title,
      input: true,
      inputPlaceholder: placeholder,
      inputDefault: defaultValue,
      confirmText: 'حفظ',
      cancelText: 'إلغاء',
      onConfirm: (v) => resolve(v),
      onCancel: () => resolve(null),
    });
  });
}

/* ============ ربط عام ============ */
window.ommyAlert = ommyAlert;
window.ommyConfirm = ommyConfirm;
window.ommyPrompt = ommyPrompt;
window.showModal = showModal;
