(function () {
  const toggle = document.querySelector('.nav-toggle');
  const sidebarContainer = document.getElementById('sidebar-container');
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
  const addUserBtn = document.getElementById('add-user-btn');
  const form = document.getElementById('settings-form');
  const profileForm = document.getElementById('profile-form');
  const toast = document.getElementById('toast');
  const chartCanvas = document.getElementById('reportChart');
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskTable = document.getElementById('task-table');
  const calendarTable = document.getElementById('calendar-table');
  const calendarMonth = document.getElementById('calendar-month');
  const calendarPrev = document.getElementById('calendar-prev');
  const calendarNext = document.getElementById('calendar-next');

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

  function openModal(html, titleId) {
    if (!modal) return;
    lastFocused = document.activeElement;
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
    const isOpen = sidebarContainer.classList.contains('open');
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
    sidebarContainer.classList.toggle('open');
    updateToggle();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebarContainer.classList.remove('open');
      updateToggle();
    });
  }

  const savedSidebar = localStorage.getItem('sidebarOpen') === 'true';
  if (savedSidebar) {
    sidebarContainer.classList.add('open');
  }
  updateToggle();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarContainer.classList.contains('open')) {
      sidebarContainer.classList.remove('open');
      updateToggle();
    }
  });

  overlay.addEventListener('click', () => {
    sidebarContainer.classList.remove('open');
    updateToggle();
  });

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  };

  const debounce = (fn, delay = 300) => {
    let id;
    return (...args) => {
      clearTimeout(id);
      id = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const filterTableRows = (rows, term, columns) => {
    const search = term.toLowerCase();
    rows.forEach((row) => {
      const cells = columns
        ? columns.map((i) => row.children[i]).filter(Boolean)
        : Array.from(row.children);
      const match = cells.some((c) =>
        c.textContent.toLowerCase().includes(search)
      );
      row.hidden = !match;
    });
  };

  window.filterTableRows = filterTableRows;

  const initPagination = (table, perPage = 5) => {
    const tbody = table.querySelector('tbody');
    const container = table.parentElement.querySelector('.pagination');
    if (!container) return { update() {} };
    const prev = document.createElement('button');
    prev.textContent = 'Prev';
    prev.className = 'btn';
    const info = document.createElement('span');
    const next = document.createElement('button');
    next.textContent = 'Next';
    next.className = 'btn';
    container.append(prev, info, next);
    let page = 1;
    const update = () => {
      const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => !r.hidden);
      const pages = Math.max(1, Math.ceil(rows.length / perPage));
      page = Math.min(page, pages);
      rows.forEach((row, i) => {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        row.style.display = i >= start && i < end ? '' : 'none';
      });
      info.textContent = `${page} / ${pages}`;
      prev.disabled = page === 1;
      next.disabled = page === pages;
      container.style.display = pages <= 1 ? 'none' : 'flex';
    };
    prev.addEventListener('click', () => { if (page > 1) { page--; update(); } });
    next.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => !r.hidden);
      const pages = Math.max(1, Math.ceil(rows.length / perPage));
      if (page < pages) { page++; update(); }
    });
    update();
    return { update };
  };

  sidebar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      sidebarContainer.classList.remove('open');
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

  if (taskTable) {
    initTasks();
  }

  if (calendarTable) {
    initCalendar();
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Settings saved');
    });
  }

  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const html = `
        <h3 id="profile-dialog-title">Save Changes</h3>
        <p>Save profile changes?</p>
        <div class="modal-actions">
          <button id="confirm-profile" class="btn">Yes</button>
          <button id="cancel-profile" class="btn">Cancel</button>
        </div>`;
      openModal(html, 'profile-dialog-title');
      const confirmBtn = document.getElementById('confirm-profile');
      const cancelBtn = document.getElementById('cancel-profile');
      confirmBtn.addEventListener('click', () => {
        closeModal();
        showToast('Profile updated');
      });
      cancelBtn.addEventListener('click', closeModal);
    });
  }

  const initTable = () => {
    if (!userTable) return;
    const tbody = userTable.querySelector('tbody');
    let rows = Array.from(tbody.querySelectorAll('tr'));
    const pager = initPagination(userTable);
    const updateRows = () => {
      rows = Array.from(tbody.querySelectorAll('tr'));
      pager.update();
    };

    const filterCols = filterInput && filterInput.dataset.columns
      ? filterInput.dataset.columns.split(',').map(Number)
      : null;

    const filterRows = () => {
      filterTableRows(rows, filterInput.value, filterCols);
      pager.update();
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
        pager.update();
      });
    });

    if (filterInput) {
      filterInput.addEventListener('input', debounce(filterRows, 200));
    }

    const attachRowHandlers = (row) => {
      const editBtn = row.querySelector('.edit-user-btn');
      const delBtn = row.querySelector('.delete-user-btn');
      const setLabels = () => {
        const name = row.children[0].textContent.trim();
        if (editBtn) editBtn.setAttribute('aria-label', `Edit ${name}`);
        if (delBtn) delBtn.setAttribute('aria-label', `Delete ${name}`);
      };
      setLabels();
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          const username = row.children[0].textContent.trim();
          const status = row.querySelector('td:nth-child(2) .label').textContent.trim();
          const html = `
            <form id="edit-user-form">
              <h3 id="edit-user-title">Edit User</h3>
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

          openModal(html, 'edit-user-title');

          const form = document.getElementById('edit-user-form');
          const cancel = document.getElementById('cancel-edit');

          form.addEventListener('submit', (e) => {
            e.preventDefault();
            row.children[0].textContent = document.getElementById('edit-username').value;
            setLabels();
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
      }

      if (delBtn) {
        delBtn.addEventListener('click', () => {
          row.remove();
          updateRows();
        });
      }
    };

    rows.forEach(attachRowHandlers);
    pager.update();

    if (addUserBtn) {
      addUserBtn.addEventListener('click', () => {
        const html = `
          <form id="add-user-form">
            <h3 id="add-user-title">Add User</h3>
            <label>Username
              <input id="new-username" type="text" required />
            </label>
            <label>Status
              <select id="new-status">
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </label>
            <div class="modal-actions">
              <button type="submit" class="btn">Add</button>
              <button type="button" class="btn" id="cancel-add">Cancel</button>
            </div>
          </form>`;

        openModal(html, 'add-user-title');

        const form = document.getElementById('add-user-form');
        const cancel = document.getElementById('cancel-add');

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const username = document.getElementById('new-username').value;
          const status = document.getElementById('new-status').value;
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${username}</td><td><span class="label ${status === 'Active' ? 'success' : 'danger'}">${status}</span></td><td><button class="btn edit-user-btn" aria-label="Edit ${username}">Edit</button> <button class="btn delete-user-btn" aria-label="Delete ${username}">Delete</button></td>`;
        tbody.appendChild(tr);
        attachRowHandlers(tr);
        updateRows();
        closeModal();
      });

        cancel.addEventListener('click', () => {
          closeModal();
        });
      });
    }
  };

  const initTasks = () => {
    if (!taskTable) return;
    const tbody = taskTable.querySelector('tbody');
    const pager = initPagination(taskTable);

    const attachHandlers = (row) => {
      const edit = row.querySelector('.edit-task-btn');
      if (edit) {
        edit.addEventListener('click', () => {
          const current = row.children[0].textContent.trim();
          const html = `
            <form id="edit-task-form">
              <h3 id="edit-task-title">Edit Task</h3>
              <input id="edit-task-input" type="text" value="${current}" required />
              <div class="modal-actions">
                <button type="submit" class="btn">Save</button>
                <button type="button" class="btn" id="cancel-edit-task">Cancel</button>
              </div>
            </form>`;
          openModal(html, 'edit-task-title');
          const form = document.getElementById('edit-task-form');
          const cancel = document.getElementById('cancel-edit-task');
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            row.children[0].textContent = document.getElementById('edit-task-input').value;
            closeModal();
          });
          cancel.addEventListener('click', closeModal);
        });
      }

      const del = row.querySelector('.delete-task-btn');
      if (del) {
        del.addEventListener('click', () => {
          row.remove();
          pager.update();
        });
      }
    };

    Array.from(tbody.querySelectorAll('tr')).forEach(attachHandlers);
    pager.update();

    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = taskInput.value.trim();
        if (!name) return;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${name}</td><td><button class="btn edit-task-btn">Edit</button> <button class="btn delete-task-btn">Delete</button></td>`;
        tbody.appendChild(tr);
        attachHandlers(tr);
        pager.update();
        taskForm.reset();
      });
    }
  };

  const initCalendar = () => {
    if (!calendarTable) return;
    let current = new Date();
    const tbody = calendarTable.querySelector('tbody');
    const render = () => {
      const year = current.getFullYear();
      const month = current.getMonth();
      calendarMonth.textContent = current.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      const first = new Date(year, month, 1).getDay();
      const days = new Date(year, month + 1, 0).getDate();
      let html = '<tr>';
      for (let i = 0; i < first; i++) html += '<td></td>';
      for (let d = 1; d <= days; d++) {
        if ((first + d - 1) % 7 === 0 && d !== 1) html += '</tr><tr>';
        html += `<td>${d}</td>`;
      }
      html += '</tr>';
      tbody.innerHTML = html;
    };
    if (calendarPrev)
      calendarPrev.addEventListener('click', () => {
        current.setMonth(current.getMonth() - 1);
        render();
      });
    if (calendarNext)
      calendarNext.addEventListener('click', () => {
        current.setMonth(current.getMonth() + 1);
        render();
      });
    render();
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

  const visitorsCanvas = document.getElementById('visitorsChart');
  const sourceCanvas = document.getElementById('sourceChart');
  const startInput = document.getElementById('start-date');
  const endInput = document.getElementById('end-date');
  const applyBtn = document.getElementById('apply-range');
  let visitorsChart, sourceChart;
  if (visitorsCanvas && sourceCanvas && window.Chart) {
    visitorsChart = new Chart(visitorsCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Visitors',
          borderColor: '#3498db',
          fill: false,
          data: [5, 7, 6, 4, 3, 2, 8]
        }]
      },
      options: { responsive: true }
    });
    sourceChart = new Chart(sourceCanvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: ['Direct', 'Referral', 'Social'],
        datasets: [{
          backgroundColor: ['#3498db', '#9b59b6', '#e74c3c'],
          data: [50, 30, 20]
        }]
      },
      options: { responsive: true }
    });
  }

  window.updateAnalyticsCharts = function () {
    if (!visitorsChart || !sourceChart) return;
    const start = startInput.value ? new Date(startInput.value) : null;
    const end = endInput.value ? new Date(endInput.value) : null;
    const diff = start && end ? Math.floor((end - start) / 86400000) : 0;
    if (diff >= 30) {
      visitorsChart.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      visitorsChart.data.datasets[0].data = [10, 12, 8, 15];
      sourceChart.data.datasets[0].data = [40, 35, 25];
    } else {
      visitorsChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      visitorsChart.data.datasets[0].data = [5, 7, 6, 4, 3, 2, 8];
      sourceChart.data.datasets[0].data = [50, 30, 20];
    }
    visitorsChart.update();
    sourceChart.update();
  };

  if (applyBtn) {
    applyBtn.addEventListener('click', window.updateAnalyticsCharts);
  }
  applyTheme();

  const notifBadge = document.getElementById('notification-badge');

  window.fetchNotifications = function () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(['Server restarted', 'New user', 'Backup complete']);
      }, 500);
    });
  };

  window.updateNotificationBadge = function () {
    if (!notifBadge) return;
    fetchNotifications().then((list) => {
      notifBadge.textContent = list.length;
      notifBadge.style.display = list.length ? 'inline-block' : 'none';
    });
  };

  updateNotificationBadge();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js');
    });
  }
})();
