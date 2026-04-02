document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  const script =
    document.currentScript ||
    document.querySelector('script[src$="assets/js/main.js"]');
  const header = document.querySelector('header');
  const headerNav = document.querySelector('header nav');

  if (!main || !script || !header || !headerNav) {
    return;
  }

  const labels = {
    top: 'TOP',
    profile: '\u81ea\u5df1\u7d39\u4ecb',
    reality: 'Reality',
    youtube: 'YouTube',
    support: '\u30b5\u30dd\u8fd4',
    minigame: 'Mini Games',
    runner: 'Sky Runner',
    tank: 'Tank Arena',
    pong: 'Pixel Pong',
    gallery: '\u30ae\u30e3\u30e9\u30ea\u30fc',
    photos: '\u5199\u771f',
    fanart: '\u30d5\u30a1\u30f3\u30a2\u30fc\u30c8',
    docs: '\u8cc7\u6599\u96c6',
    news: '\u304a\u77e5\u3089\u305b',
    links: '\u30ea\u30f3\u30af\u96c6'
  };

  const headerDescriptions = {
    top: '\u5144\u59b9\u3067\u904b\u55b6\u3059\u308b\u9759\u304b\u306a\u6d3b\u52d5\u62e0\u70b9',
    profile: '\u7434\u97f3\u3068\u3057\u3093\u3001\u305d\u308c\u305e\u308c\u306e\u5f79\u5272\u3092\u7d39\u4ecb',
    reality: '\u914d\u4fe1\u306e\u7a7a\u6c17\u611f\u3068\u4eca\u306e\u6d3b\u52d5\u3092\u307e\u3068\u3081\u305f\u5834\u6240',
    youtube: '\u52d5\u753b\u306e\u898b\u3069\u3053\u308d\u3068\u66f4\u65b0\u65b9\u91dd\u3092\u6848\u5185',
    support: '\u30dd\u30a4\u30f3\u30c8\u3068\u30b5\u30dd\u8fd4\u5185\u5bb9\u3092\u4e00\u89a7\u3067\u78ba\u8a8d',
    minigame: '\u6c17\u8efd\u306b\u904a\u3079\u308b\u5bc4\u308a\u9053\u30b3\u30fc\u30ca\u30fc',
    gallery: '\u5199\u771f\u30fb\u30d5\u30a1\u30f3\u30a2\u30fc\u30c8\u30fb\u8cc7\u6599\u96c6\u306e\u5165\u53e3',
    news: '\u66f4\u65b0\u60c5\u5831\u3092\u307e\u3068\u3081\u3066\u78ba\u8a8d',
    links: '\u5916\u90e8\u30b5\u30fc\u30d3\u30b9\u3078\u8ff7\u308f\u305a\u79fb\u52d5'
  };

  const scriptUrl = new URL(script.getAttribute('src'), window.location.href);
  const siteRoot = new URL('../../', scriptUrl);
  const siteRootPath = siteRoot.pathname.endsWith('/')
    ? siteRoot.pathname
    : `${siteRoot.pathname}/`;
  const currentUrl = new URL(window.location.href);
  const currentPathname = currentUrl.pathname.replace(/index\.html$/, '');
  const relativePath = currentPathname.startsWith(siteRootPath)
    ? currentPathname.slice(siteRootPath.length)
    : currentPathname.replace(/^\//, '');
  const segments = relativePath.split('/').filter(Boolean);
  const currentSection = segments[0] || 'top';
  const pageKey = segments[segments.length - 1] || 'top';

  const navItems = [
    { key: 'top', href: siteRoot.href, label: labels.top },
    { key: 'profile', href: new URL('profile/', siteRoot).href, label: labels.profile },
    { key: 'reality', href: new URL('reality/', siteRoot).href, label: labels.reality },
    { key: 'youtube', href: new URL('youtube/', siteRoot).href, label: labels.youtube },
    { key: 'support', href: new URL('support/', siteRoot).href, label: labels.support },
    { key: 'gallery', href: new URL('gallery/', siteRoot).href, label: labels.gallery },
    { key: 'news', href: new URL('news/', siteRoot).href, label: labels.news },
    { key: 'links', href: new URL('links/', siteRoot).href, label: labels.links },
    { key: 'minigame', href: new URL('minigame/', siteRoot).href, label: labels.minigame }
  ];

  header.classList.add('site-header');
  main.classList.add('page-main');

  const shell = document.createElement('div');
  shell.className = 'site-shell';

  const brand = document.createElement('a');
  brand.className = 'site-brand';
  brand.href = siteRoot.href;
  brand.innerHTML = `
    <span class="site-brand__mark" aria-hidden="true">
      <span class="site-brand__core"></span>
    </span>
    <span class="site-brand__text">
      <span class="site-brand__title">\u3055\u3093\u305d\u3093\u5144\u59b9\u306e\u6d3b\u52d5\u8a18\u9332</span>
      <span class="site-brand__sub">${headerDescriptions[currentSection] || '\u9759\u304b\u306a\u914d\u4fe1\u3068\u5275\u4f5c\u306e\u305f\u3081\u306e\u30b5\u30a4\u30c8'}</span>
    </span>
  `;

  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'site-menu-button';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-controls', 'global-nav');
  menuButton.textContent = '\u30e1\u30cb\u30e5\u30fc';

  headerNav.id = 'global-nav';
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

  menuButton.addEventListener('click', () => {
    const isOpen = headerNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  shell.append(brand, menuButton, headerNav);
  header.replaceChildren(shell);

  if (!main.querySelector('.breadcrumb')) {
    const breadcrumb = document.createElement('nav');
    const list = document.createElement('ol');
    let currentPath = siteRoot.href;

    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', '\u30d1\u30f3\u304f\u305a\u30ea\u30b9\u30c8');

    appendCrumb(list, labels.top, siteRoot.href, segments.length === 0);

    segments.forEach((segment, index) => {
      currentPath = new URL(`${segment}/`, currentPath).href;
      appendCrumb(list, labels[segment] || segment, currentPath, index === segments.length - 1);
    });

    breadcrumb.appendChild(list);
    main.prepend(breadcrumb);
  }

  if (!document.querySelector('.site-footer')) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="site-footer__inner">
        <section>
          <h2>\u3055\u3093\u305d\u3093\u5144\u59b9\u306b\u3064\u3044\u3066</h2>
          <p>\u7434\u97f3\u306f\u6587\u7ae0\u3068\u6574\u3048\u308b\u5f79\u3001\u3057\u3093\u306f\u914d\u4fe1\u3068\u8aac\u660e\u5f79\u3002\u3075\u305f\u308a\u3067\u9759\u304b\u306b\u6d3b\u52d5\u3092\u7a4d\u307f\u4e0a\u3052\u308b\u305f\u3081\u306e\u3001\u898b\u3084\u3059\u304f\u6574\u7406\u3055\u308c\u305f\u62e0\u70b9\u3067\u3059\u3002</p>
        </section>
        <section>
          <h2>\u3088\u304f\u898b\u308b\u30da\u30fc\u30b8</h2>
          <ul class="footer-links">
            <li><a href="${new URL('gallery/', siteRoot).href}">\u30ae\u30e3\u30e9\u30ea\u30fc</a></li>
            <li><a href="${new URL('reality/', siteRoot).href}">Reality</a></li>
            <li><a href="${new URL('support/', siteRoot).href}">\u30b5\u30dd\u8fd4</a></li>
            <li><a href="${new URL('links/', siteRoot).href}">\u30ea\u30f3\u30af\u96c6</a></li>
          </ul>
        </section>
      </div>
    `;
    document.body.appendChild(footer);
  }

  document.body.dataset.section = currentSection;
  document.body.dataset.page = pageKey;
});

function appendCrumb(list, label, href, isCurrent) {
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
}
