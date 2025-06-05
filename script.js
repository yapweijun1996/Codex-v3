(function () {
  const toggle = document.getElementById('nav-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.getElementById('theme-toggle');
  const closeBtn = document.getElementById('sidebar-close');
  const tableSkeleton = document.getElementById('table-skeleton');
  const userTable = document.getElementById('user-table');
  const form = document.getElementById('settings-form');
  const toast = document.getElementById('toast');
  const chartCanvas = document.getElementById('reportChart');

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

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
      updateToggle();
    });
  }

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

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  };

  sidebar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('open');
      updateToggle();
    });
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem(
      'theme',
      document.body.classList.contains('light') ? 'light' : 'dark'
    );
  });

  if (tableSkeleton && userTable) {
    setTimeout(() => {
      tableSkeleton.remove();
      userTable.hidden = false;
    }, 1000);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Settings saved');
    });
  }

  if (chartCanvas && window.Chart) {
    new Chart(chartCanvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
          label: 'Visitors',
          backgroundColor: '#3498db',
          data: [3, 7, 4, 6]
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  applyTheme();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js');
    });
  }
})();
