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
    reality: 'REALITY',
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
  top: '\u5144\u59b9\u3067\u904b\u55b6\u3059\u308b\u6d3b\u52d5\u62e0\u70b9',
  profile: '\u7434\u97f3\u3068\u3057\u3093\u306e\u7d39\u4ecb',
  reality: '\u914d\u4fe1\u6d3b\u52d5\u306e\u307e\u3068\u3081',
  youtube: '\u52d5\u753b\u6d3b\u52d5\u306e\u6848\u5185',
  support: '\u30dd\u30a4\u30f3\u30c8\u3068\u7279\u5178\u4e00\u89a7',
  minigame: '\u6c17\u8efd\u306b\u904a\u3079\u308b\u30b3\u30fc\u30ca\u30fc',
  gallery: '\u5199\u771f\u30fbFA\u30fb\u8cc7\u6599\u96c6',
  news: '\u66f4\u65b0\u60c5\u5831\u307e\u3068\u3081',
  links: '\u5916\u90e8\u30ea\u30f3\u30af\u4e00\u89a7'
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
      <img class="site-brand__icon" src="${new URL('favicon.ico', siteRoot).href}" alt="" />
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
  menuButton.setAttribute('aria-label', '\u30e1\u30cb\u30e5\u30fc\u3092\u958b\u304f');
  menuButton.textContent = '\u2630';

  const navBackdrop = document.createElement('button');
  navBackdrop.type = 'button';
  navBackdrop.className = 'site-nav-backdrop';
  navBackdrop.setAttribute('aria-label', '\u30e1\u30cb\u30e5\u30fc\u3092\u9589\u3058\u308b');

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

  const setMenuOpen = (isOpen) => {
    headerNav.classList.toggle('is-open', isOpen);
    navBackdrop.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? '\u30e1\u30cb\u30e5\u30fc\u3092\u9589\u3058\u308b' : '\u30e1\u30cb\u30e5\u30fc\u3092\u958b\u304f');
    menuButton.textContent = isOpen ? '\u00d7' : '\u2630';
  };

  menuButton.addEventListener('click', () => {
    setMenuOpen(!headerNav.classList.contains('is-open'));
  });

  navBackdrop.addEventListener('click', () => {
    setMenuOpen(false);
  });

  headerNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuOpen(false);
    }
  });

  shell.append(brand, menuButton, navBackdrop, headerNav);
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

  document.querySelectorAll('.copy-link-button').forEach((button) => {
    const defaultLabel = button.textContent;

    button.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const url = button.dataset.copyUrl;
      if (!url) {
        return;
      }

      const copied = await copyText(url);
      if (!copied) {
        showCopyToast('\u30b3\u30d4\u30fc\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f');
        return;
      }

      button.textContent = '\u2713';
      button.setAttribute('aria-label', '\u30ea\u30f3\u30af\u3092\u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f');
      button.classList.add('is-copied');
      showCopyToast('\u30ea\u30f3\u30af\u3092\u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f');
      window.setTimeout(() => {
        button.textContent = defaultLabel;
        button.setAttribute('aria-label', button.dataset.copyLabel || '\u30ea\u30f3\u30af\u3092\u30b3\u30d4\u30fc');
        button.classList.remove('is-copied');
      }, 1300);
    });

    button.dataset.copyLabel = button.getAttribute('aria-label') || '\u30ea\u30f3\u30af\u3092\u30b3\u30d4\u30fc';
  });

  document.querySelectorAll('.link-card--service').forEach((card) => {
    const mainLink = card.querySelector('.link-service__main');

    if (!mainLink) {
      return;
    }

    card.addEventListener('click', (event) => {
      if (event.target.closest('.copy-link-button') || event.target.closest('a')) {
        return;
      }

      window.open(mainLink.href, mainLink.target || '_self', 'noopener');
    });
  });

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

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fall through to the textarea fallback for older or restricted browsers.
    }
  }

  return fallbackCopyText(text);
}

function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '1px';
  textarea.style.height = '1px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand('copy');
  } finally {
    textarea.remove();
  }
}

function showCopyToast(message) {
  let toast = document.querySelector('.copy-toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showCopyToast.timer);
  showCopyToast.timer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 1500);
}
