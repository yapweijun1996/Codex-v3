export function debounce(fn, delay = 300) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function filterTableRows(rows, term, columns) {
  const search = term.toLowerCase();
  rows.forEach((row) => {
    const cells = columns
      ? columns.map((i) => row.children[i]).filter(Boolean)
      : Array.from(row.children);
    const match = cells.some((c) => c.textContent.toLowerCase().includes(search));
    row.hidden = !match;
  });
}

export function initPagination(table, perPage = 5) {
  const tbody = table.querySelector('tbody');
  const container = table.parentElement.querySelector('.table__pagination');
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
    const rows = Array.from(tbody.querySelectorAll('tr')).filter((r) => !r.hidden);
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
  prev.addEventListener('click', () => {
    if (page > 1) {
      page--;
      update();
    }
  });
  next.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr')).filter((r) => !r.hidden);
    const pages = Math.max(1, Math.ceil(rows.length / perPage));
    if (page < pages) {
      page++;
      update();
    }
  });
  update();
  return { update };
}
