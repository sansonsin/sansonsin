console.log('Sansonsin site placeholder');

document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  const script =
    document.currentScript ||
    document.querySelector('script[src$="assets/js/main.js"]');
  const headerNav = document.querySelector('header nav');

  if (!main || !script) {
    return;
  }

  const segmentLabels = {
    top: 'TOP',
    profile: '\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb',
    reality: 'Reality',
    youtube: 'YouTube',
    minigame: 'Mini Games',
    runner: 'Sky Runner',
    tank: 'Tank Arena',
    pong: 'Pixel Pong',
    gallery: '\u30ae\u30e3\u30e9\u30ea\u30fc',
    photos: '\u5199\u771f',
    fanart: '\u30d5\u30a1\u30f3\u30a2\u30fc\u30c8',
    docs: '\u8cc7\u6599',
    news: '\u304a\u77e5\u3089\u305b',
    links: '\u30ea\u30f3\u30af\u96c6'
  };

  const scriptUrl = new URL(script.getAttribute('src'), window.location.href);
  const siteRoot = new URL('../../', scriptUrl);
  const currentUrl = new URL(window.location.href);
  const siteRootPath = siteRoot.pathname.endsWith('/')
    ? siteRoot.pathname
    : `${siteRoot.pathname}/`;
  const currentPathname = currentUrl.pathname.replace(/index\.html$/, '');
  const relativePath = currentPathname.startsWith(siteRootPath)
    ? currentPathname.slice(siteRootPath.length)
    : currentPathname.replace(/^\//, '');
  const segments = relativePath.split('/').filter(Boolean);
  const breadcrumb = main.querySelector('.breadcrumb') || document.createElement('nav');
  const list = document.createElement('ol');
  let currentPath = siteRoot.href;
  const currentSection = segments[0] || 'top';

  if (headerNav) {
    const navItems = [
      { key: 'top', href: siteRoot.href, label: 'TOP' },
      { key: 'profile', href: new URL('profile/', siteRoot).href, label: segmentLabels.profile },
      { key: 'reality', href: new URL('reality/', siteRoot).href, label: segmentLabels.reality },
      { key: 'youtube', href: new URL('youtube/', siteRoot).href, label: segmentLabels.youtube },
      { key: 'minigame', href: new URL('minigame/', siteRoot).href, label: segmentLabels.minigame },
      { key: 'gallery', href: new URL('gallery/', siteRoot).href, label: segmentLabels.gallery },
      { key: 'news', href: new URL('news/', siteRoot).href, label: segmentLabels.news },
      { key: 'links', href: new URL('links/', siteRoot).href, label: segmentLabels.links }
    ];

    headerNav.classList.add('site-nav');
    headerNav.replaceChildren();

    navItems.forEach((item) => {
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.label;

      if (item.key === currentSection) {
        link.setAttribute('aria-current', 'page');
      }

      headerNav.appendChild(link);
    });
  }

  if (main.querySelector('.breadcrumb')) {
    return;
  }

  breadcrumb.className = 'breadcrumb';
  breadcrumb.setAttribute('aria-label', '\u30d1\u30f3\u304f\u305a\u30ea\u30b9\u30c8');

  const appendItem = (label, href, isCurrent = false) => {
    const item = document.createElement('li');

    if (isCurrent) {
      const current = document.createElement('span');
      current.textContent = label;
      current.setAttribute('aria-current', 'page');
      item.appendChild(current);
    } else {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      item.appendChild(link);
    }

    list.appendChild(item);
  };

  appendItem('TOP', siteRoot.href);

  segments.forEach((segment, index) => {
    currentPath = new URL(`${segment}/`, currentPath).href;
    const isCurrent = index === segments.length - 1;
    const currentHeading = document.querySelector('h1')?.textContent?.trim();
    const label =
      (isCurrent && currentHeading) || segmentLabels[segment] || segment;

    appendItem(label, currentPath, isCurrent);
  });

  breadcrumb.appendChild(list);
  main.insertBefore(breadcrumb, main.firstChild);
});
