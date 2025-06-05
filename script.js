(function () {
  const toggle = document.getElementById('nav-toggle');
  const sidebar = document.getElementById('sidebar');
  const body = document.body;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
      body.classList.add('sidebar-open');
    } else {
      body.classList.remove('sidebar-open');
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js');
    });
  }
})();
