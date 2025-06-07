import { openModal, closeModal } from './js/modal.js';
import { debounce, filterTableRows, initPagination } from './js/table-utils.js';
import { initReportChart, initAnalyticsCharts, updateAnalyticsCharts } from './js/charts.js';

const toggle = document.querySelector('.nav-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const themeToggle = document.querySelector('.theme-toggle');
const closeBtn = document.getElementById('sidebar-close');
const pageLoader = document.getElementById('page-loader');
const firstLink = sidebar ? sidebar.querySelector('a') : null;
let initialLoad = true;
const tableSkeleton = document.querySelector('.table__skeleton');
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

export function showLoader() { if (pageLoader) pageLoader.classList.add('visible'); }
export function hideLoader() { if (pageLoader) pageLoader.classList.remove('visible'); }
hideLoader();

const sunIcon = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
const moonIcon = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

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
    toggle.setAttribute('aria-label', 'Close navigation');
    toggle.setAttribute('aria-expanded', 'true');
    overlay.classList.add('visible');
    localStorage.setItem('sidebarOpen', 'true');
    if (!initialLoad && firstLink) firstLink.focus();
  } else {
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

if (localStorage.getItem('sidebarOpen') === 'true') {
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

const fetchUsers = () => new Promise((resolve) => setTimeout(resolve, 1000));

function initTable() {
  if (!userTable) return;
  const tbody = userTable.querySelector('tbody');
  let rows = Array.from(tbody.querySelectorAll('tr'));
  const pager = initPagination(userTable);
  const updateRows = () => {
    rows = Array.from(tbody.querySelectorAll('tr'));
    pager.update();
  };
  const filterCols = filterInput && filterInput.dataset.columns ? filterInput.dataset.columns.split(',').map(Number) : null;
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
  if (filterInput) filterInput.addEventListener('input', debounce(filterRows, 200));
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
        const html = `<form id="edit-user-form"><h3 id="edit-user-title">Edit User</h3><label>Username<input id="edit-username" type="text" value="${username}" required /></label><label>Status<select id="edit-status"><option value="Active"${status === 'Active' ? ' selected' : ''}>Active</option><option value="Suspended"${status === 'Suspended' ? ' selected' : ''}>Suspended</option></select></label><div class="modal-actions"><button type="submit" class="btn">Save</button><button type="button" class="btn" id="cancel-edit">Cancel</button></div></form>`;
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
        cancel.addEventListener('click', closeModal);
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
      const html = `<form id="add-user-form"><h3 id="add-user-title">Add User</h3><label>Username<input id="new-username" type="text" required /></label><label>Status<select id="new-status"><option value="Active">Active</option><option value="Suspended">Suspended</option></select></label><div class="modal-actions"><button type="submit" class="btn">Add</button><button type="button" class="btn" id="cancel-add">Cancel</button></div></form>`;
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
      cancel.addEventListener('click', closeModal);
    });
  }
}

function initTasks() {
  if (!taskTable) return;
  const tbody = taskTable.querySelector('tbody');
  const pager = initPagination(taskTable);
  const attachHandlers = (row) => {
    const edit = row.querySelector('.edit-task-btn');
    if (edit) {
      edit.addEventListener('click', () => {
        const current = row.children[0].textContent.trim();
        const html = `<form id="edit-task-form"><h3 id="edit-task-title">Edit Task</h3><input id="edit-task-input" type="text" value="${current}" required /><div class="modal-actions"><button type="submit" class="btn">Save</button><button type="button" class="btn" id="cancel-edit-task">Cancel</button></div></form>`;
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
}

function initCalendar() {
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
  if (calendarPrev) calendarPrev.addEventListener('click', () => { current.setMonth(current.getMonth() - 1); render(); });
  if (calendarNext) calendarNext.addEventListener('click', () => { current.setMonth(current.getMonth() + 1); render(); });
  render();
}

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

if (tableSkeleton && userTable) {
  fetchUsers().then(() => {
    tableSkeleton.remove();
    userTable.hidden = false;
    initTable();
  });
}
if (taskTable) initTasks();
if (calendarTable) initCalendar();
if (form) form.addEventListener('submit', (e) => { e.preventDefault(); showToast('Settings saved'); });
if (profileForm) {
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const html = `<h3 id="profile-dialog-title">Save Changes</h3><p>Save profile changes?</p><div class="modal-actions"><button id="confirm-profile" class="btn">Yes</button><button id="cancel-profile" class="btn">Cancel</button></div>`;
    openModal(html, 'profile-dialog-title');
    const confirmBtn = document.getElementById('confirm-profile');
    const cancelBtn = document.getElementById('cancel-profile');
    confirmBtn.addEventListener('click', () => { closeModal(); showToast('Profile updated'); });
    cancelBtn.addEventListener('click', closeModal);
  });
}

initReportChart(chartCanvas, document.getElementById('report-range'));
const visitorsCanvas = document.getElementById('visitorsChart');
const sourceCanvas = document.getElementById('sourceChart');
const startInput = document.getElementById('start-date');
const endInput = document.getElementById('end-date');
const applyBtn = document.getElementById('apply-range');
initAnalyticsCharts(visitorsCanvas, sourceCanvas);
if (applyBtn) applyBtn.addEventListener('click', () => updateAnalyticsCharts(startInput, endInput));
applyTheme();

const notifBadge = document.getElementById('notification-badge');
function fetchNotifications() {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(['Server restarted', 'New user', 'Backup complete']); }, 500);
  });
}
function updateNotificationBadge() {
  if (!notifBadge) return;
  fetchNotifications().then((list) => {
    notifBadge.textContent = list.length;
    notifBadge.style.display = list.length ? 'inline-block' : 'none';
  });
}
updateNotificationBadge();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}
