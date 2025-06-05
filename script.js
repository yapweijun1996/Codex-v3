(function () {
  const toggle = document.getElementById('nav-toggle');
  const sidebar = document.getElementById('sidebar');

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
      toggle.textContent = '✖';
      toggle.setAttribute('aria-label', 'Close navigation');
    } else {
      toggle.textContent = '☰';
      toggle.setAttribute('aria-label', 'Open navigation');
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js');
    });
  }
})();
