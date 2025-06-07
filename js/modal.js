export function openModal(html, titleId) {
  const modal = document.getElementById('modal');
  if (!modal) return;
  const focusableSelector =
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const lastFocused = document.activeElement;
  modal.innerHTML = '<div class="modal-content">' + html + '</div>';
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  if (titleId) {
    modal.setAttribute('aria-labelledby', titleId);
  } else {
    modal.removeAttribute('aria-labelledby');
  }
  const focusable = modal.querySelectorAll(focusableSelector);
  if (focusable[0]) focusable[0].focus();
  const handleKey = (e) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll(focusableSelector);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  const outsideClick = (e) => {
    if (e.target === modal) close();
  };
  function close() {
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '';
    modal.removeEventListener('click', outsideClick);
    document.removeEventListener('keydown', handleKey);
    if (lastFocused) lastFocused.focus();
  }
  modal.addEventListener('click', outsideClick);
  document.addEventListener('keydown', handleKey);
  return close;
}
export function closeModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = '';
}
