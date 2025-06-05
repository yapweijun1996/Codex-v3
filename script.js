(function () {
  const toggle = document.getElementById('nav-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.getElementById('theme-toggle');

  const applyTheme = () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'light' || (!saved && !prefersDark)) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  };

  const updateToggle = () => {
    if (sidebar.classList.contains('open')) {
      toggle.textContent = '✖';
      toggle.setAttribute('aria-label', 'Close navigation');
      toggle.setAttribute('aria-expanded', 'true');
      overlay.classList.add('visible');
      localStorage.setItem('sidebarOpen', 'true');
    } else {
      toggle.textContent = '☰';
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('visible');
      localStorage.setItem('sidebarOpen', 'false');
    }
  };

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    updateToggle();
  });

  const savedSidebar = localStorage.getItem('sidebarOpen') === 'true';
  if (savedSidebar) {
    sidebar.classList.add('open');
  }
  updateToggle();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      updateToggle();
    }
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    updateToggle();
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem(
      'theme',
      document.body.classList.contains('light') ? 'light' : 'dark'
    );
  });

  applyTheme();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js');
    });
  }
})();
