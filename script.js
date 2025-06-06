(function(){const s=localStorage.getItem("theme");const p=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("light",s=="light"||(!s&&!p));})();
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.querySelector('.theme-toggle');
  const sunIcon = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const moonIcon = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const closeBtn = document.getElementById('sidebar-close');
  const pageLoader = document.getElementById('page-loader');
  const modal = document.getElementById('modal');
  const firstLink = sidebar ? sidebar.querySelector('a') : null;
  let initialLoad = true;
  const tableSkeleton = document.querySelector('.table-skeleton');
  const userTable = document.getElementById('user-table');
  const filterInput = document.getElementById('user-filter');
  const form = document.getElementById('settings-form');
  const toast = document.getElementById('toast');
  const chartCanvas = document.getElementById('reportChart');

  window.showLoader = function () {
    if (pageLoader) pageLoader.classList.add('visible');
  };

  window.hideLoader = function () {
    if (pageLoader) pageLoader.classList.remove('visible');
  };

  hideLoader();

  let lastFocused;
  const focusableSelector =
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

  function handleKey(e) {
    if (e.key === 'Escape') {
      closeModal();
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
  }

  function outsideClick(e) {
    if (e.target === modal) closeModal();
  }

  function openModal(html) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.innerHTML = '<div class="modal-content">' + html + '</div>';
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    const focusable = modal.querySelectorAll(focusableSelector);
    if (focusable[0]) focusable[0].focus();
    modal.addEventListener('click', outsideClick);
    document.addEventListener('keydown', handleKey);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '';
    modal.removeEventListener('click', outsideClick);
    document.removeEventListener('keydown', handleKey);
    if (lastFocused) lastFocused.focus();
  }

  window.openModal = openModal;
  window.closeModal = closeModal;

  const applyTheme = () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const light = saved === 'light' || (!saved && !prefersDark);
    document.documentElement.classList.toggle('light', light);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', light ? 'true' : 'false');
      themeToggle.innerHTML = light ? sunIcon : moonIcon;
    }
  };

  const updateToggle = () => {
    const isOpen = sidebar.classList.contains('open');
    if (isOpen) {
      toggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
      toggle.setAttribute('aria-label', 'Close navigation');
      toggle.setAttribute('aria-expanded', 'true');
      overlay.classList.add('visible');
      localStorage.setItem('sidebarOpen', 'true');
      if (!initialLoad && firstLink) firstLink.focus();
    } else {
      toggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
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
      showLoader();
    });
  });

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const light = !document.documentElement.classList.contains('light');
      document.documentElement.classList.toggle('light', light);
      themeToggle.setAttribute('aria-pressed', light ? 'true' : 'false');
      themeToggle.innerHTML = light ? sunIcon : moonIcon;
      localStorage.setItem('theme', light ? 'light' : 'dark');
    });
  }

  const fetchUsers = () =>
    new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

  if (tableSkeleton && userTable) {
    fetchUsers().then(() => {
      tableSkeleton.remove();
      userTable.hidden = false;
      initTable();
    });
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
    const headers = userTable.querySelectorAll('th.sortable');
    headers.forEach((th, index) => {
      th.addEventListener('click', () => {
        const asc = !sortStates[index];
        sortStates[index] = asc;
        rows.sort((a, b) => {
          const at = a.children[index].textContent.trim();
          const bt = b.children[index].textContent.trim();
          return asc ? at.localeCompare(bt) : bt.localeCompare(at);
        });
        tbody.append(...rows);
        headers.forEach((h) => h.removeAttribute('aria-sort'));
        th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
      });
    });

    if (filterInput) {
      filterInput.addEventListener('input', filterRows);
    }

    tbody.querySelectorAll('.edit-user-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const username = row.children[0].textContent.trim();
        const status = row.querySelector('td:nth-child(2) .label').textContent.trim();
        const html = `
          <form id="edit-user-form">
            <h3>Edit User</h3>
            <label>Username
              <input id="edit-username" type="text" value="${username}" required />
            </label>
            <label>Status
              <select id="edit-status">
                <option value="Active"${status === 'Active' ? ' selected' : ''}>Active</option>
                <option value="Suspended"${status === 'Suspended' ? ' selected' : ''}>Suspended</option>
              </select>
            </label>
            <div class="modal-actions">
              <button type="submit" class="btn">Save</button>
              <button type="button" class="btn" id="cancel-edit">Cancel</button>
            </div>
          </form>`;

        openModal(html);

        const form = document.getElementById('edit-user-form');
        const cancel = document.getElementById('cancel-edit');

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          row.children[0].textContent = document.getElementById('edit-username').value;
          const newStatus = document.getElementById('edit-status').value;
          const label = row.querySelector('td:nth-child(2) .label');
          label.textContent = newStatus;
          label.classList.toggle('success', newStatus === 'Active');
          label.classList.toggle('danger', newStatus !== 'Active');
          closeModal();
        });

        cancel.addEventListener('click', () => {
          closeModal();
        });
      });
    });
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
