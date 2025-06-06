(function () {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const light = saved === 'light' || (!saved && !prefersDark);
  if (light) document.documentElement.classList.add('light');
})();
