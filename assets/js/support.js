document.addEventListener('DOMContentLoaded', async () => {
  const pointsRoot = document.querySelector('#support-points');
  const catalogRoot = document.querySelector('#support-catalog');

  if (!pointsRoot || !catalogRoot) {
    return;
  }

  try {
    const response = await fetch('../data/support_catalog.csv', { cache: 'no-store' });
    const csv = await response.text();
    const rows = parseCsv(csv);

    const pointRows = rows.filter((row) => row.category === '\u30dd\u30a4\u30f3\u30c8\u7372\u5f97\u65b9\u6cd5');
    const catalogRows = rows.filter((row) => row.category === '\u30b5\u30dd\u8fd4\u3057\u30ab\u30bf\u30ed\u30b0');

    renderGroups(pointsRoot, pointRows, true);
    renderGroups(catalogRoot, catalogRows, false);
  } catch (error) {
    const message = '\u30b5\u30dd\u8fd4\u30ab\u30bf\u30ed\u30b0\u306e\u8aad\u307f\u8fbc\u307f\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002';
    pointsRoot.innerHTML = `<article class="page-card"><h3>${message}</h3></article>`;
    catalogRoot.innerHTML = '';
  }
});

function parseCsv(csv) {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(',');

  return lines
    .filter(Boolean)
    .map((line) => {
      const columns = line.split(',');
      return headers.reduce((row, header, index) => {
        row[header] = columns[index] || '';
        return row;
      }, {});
    });
}

function renderGroups(root, rows, compact) {
  const groupMap = new Map();

  rows.forEach((row) => {
    const key = row.subcategory || '\u305d\u306e\u4ed6';
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key).push(row);
  });

  root.replaceChildren();

  groupMap.forEach((items, subcategory) => {
    const card = document.createElement('article');
    card.className = 'catalog-card';

    const title = document.createElement('h3');
    title.textContent = subcategory;
    card.appendChild(title);

    const list = document.createElement('div');
    list.className = compact ? 'catalog-list compact' : 'catalog-list';

    items.forEach((item) => {
      const entry = document.createElement('section');
      entry.className = 'catalog-entry';

      const header = document.createElement('div');
      header.className = 'catalog-entry__header';

      const name = document.createElement('strong');
      name.textContent = item.item;
      header.appendChild(name);

      const points = document.createElement('span');
      points.className = 'catalog-points';
      points.textContent = `${item.points}pt`;
      header.appendChild(points);

      entry.appendChild(header);

      const meta = [];
      if (item.details) {
        meta.push(item.details);
      }
      if (item.title) {
        meta.push(`\u79f0\u53f7: ${item.title}`);
      }
      if (item.notes) {
        meta.push(item.notes);
      }

      if (meta.length > 0) {
        const description = document.createElement('p');
        description.textContent = meta.join(' / ');
        entry.appendChild(description);
      }

      list.appendChild(entry);
    });

    card.appendChild(list);
    root.appendChild(card);
  });
}
