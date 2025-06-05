(function () {
  const toggle = document.getElementById('nav-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.getElementById('theme-toggle');
  const closeBtn = document.getElementById('sidebar-close');
  const firstLink = sidebar ? sidebar.querySelector('a') : null;
  let initialLoad = true;
  const tableSkeleton = document.getElementById('table-skeleton');
  const userTable = document.getElementById('user-table');
  const filterInput = document.getElementById('user-filter');
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
    const isOpen = sidebar.classList.contains('open');
    if (isOpen) {
      toggle.textContent = '✖';
      toggle.setAttribute('aria-label', 'Close navigation');
      toggle.setAttribute('aria-expanded', 'true');
      overlay.classList.add('visible');
      localStorage.setItem('sidebarOpen', 'true');
      if (!initialLoad && firstLink) firstLink.focus();
    } else {
      toggle.textContent = '☰';
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('visible');
      localStorage.setItem('sidebarOpen', 'false');
      if (!initialLoad) toggle.focus();
    }
    initialLoad = false;
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
      initTable();
    }, 1000);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Settings saved');
    });
  }

  const initTable = () => {
    if (!userTable) return;
    const tbody = userTable.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const filterRows = () => {
      const term = filterInput.value.toLowerCase();
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.hidden = !text.includes(term);
      });
    };

    const sortStates = {};
    userTable.querySelectorAll('th.sortable').forEach((th, index) => {
      th.addEventListener('click', () => {
        const asc = !sortStates[index];
        sortStates[index] = asc;
        rows.sort((a, b) => {
          const at = a.children[index].textContent.trim();
          const bt = b.children[index].textContent.trim();
          return asc ? at.localeCompare(bt) : bt.localeCompare(at);
        });
        tbody.append(...rows);
      });
    });

    if (filterInput) {
      filterInput.addEventListener('input', filterRows);
    }
  };

  if (chartCanvas && window.Chart) {
    const chart = new Chart(chartCanvas.getContext('2d'), {
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

    const range = document.getElementById('report-range');
    if (range) {
      range.addEventListener('change', () => {
        const value = range.value;
        if (value === 'week') {
          chart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          chart.data.datasets[0].data = [1, 2, 1, 3, 2, 4, 2];
        } else if (value === 'year') {
          chart.data.labels = ['Q1', 'Q2', 'Q3', 'Q4'];
          chart.data.datasets[0].data = [30, 45, 28, 40];
        } else {
          chart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr'];
          chart.data.datasets[0].data = [3, 7, 4, 6];
        }
        chart.update();
      });
    }
  }

  applyTheme();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js');
    });
  }
})();
