(function () {
  window.buildHeader = function (title, opts = {}) {
    const header = document.createElement('header');
    header.className = 'app-header';
    header.setAttribute('role', 'banner');
    const menuIcon = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    header.innerHTML = `
      <a href="#main" class="skip-link">Skip to content</a>
      <h1 class="app-title">${title}</h1>
      <button class="nav-toggle" aria-label="Open navigation" aria-controls="sidebar">${menuIcon}</button>
    `;
    if (opts.themeToggle) {
      const themeBtn = document.createElement('button');
      themeBtn.className = 'theme-toggle';
      themeBtn.setAttribute('aria-label', 'Toggle dark mode');
      const isLight = document.documentElement.classList.contains('light');
      themeBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      const sun = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
      const moon = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      themeBtn.innerHTML = isLight ? sun : moon;
      header.appendChild(themeBtn);
    }
    if (opts.notifications) {
      const notifBtn = document.createElement('button');
      notifBtn.className = 'notification-btn';
      notifBtn.setAttribute('aria-label', 'View notifications');
      const bell = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
      notifBtn.innerHTML = bell + '<span id="notification-badge" class="badge"></span>';
      header.appendChild(notifBtn);
    }
    document.body.prepend(header);
  };
})();
