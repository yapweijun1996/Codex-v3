(function () {
  window.buildHeader = function (title, opts = {}) {
    const header = document.createElement('header');
    header.className = 'app-header';
    header.setAttribute('role', 'banner');
    header.innerHTML = `
      <a href="#main" class="skip-link">Skip to content</a>
      <h1 class="app-title">${title}</h1>
      <button class="nav-toggle" aria-label="Open navigation" aria-controls="sidebar"></button>
    `;
    if (opts.themeToggle) {
      const themeBtn = document.createElement('button');
      themeBtn.className = 'theme-toggle';
      themeBtn.setAttribute('aria-label', 'Toggle dark mode');
      themeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 1 0-18z" fill="currentColor"/></svg>`;
      header.appendChild(themeBtn);
    }
    document.body.prepend(header);
  };
})();
