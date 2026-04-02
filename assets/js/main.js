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
    profile: '自己紹介',
    reality: 'Reality',
    youtube: 'YouTube',
    minigame: 'Mini Games',
    runner: 'Sky Runner',
    tank: 'Tank Arena',
    pong: 'Pixel Pong',
    gallery: 'ギャラリー',
    photos: '写真',
    fanart: 'ファンアート',
    docs: '資料集',
    news: 'お知らせ',
    links: 'リンク集'
  };

  const headerDescriptions = {
    top: '兄妹で運営する静かな配信拠点',
    profile: '琴音としん、それぞれの役割を紹介',
    reality: '配信の空気感と今の活動をまとめた場所',
    youtube: '動画の見どころと更新方針を案内',
    minigame: '気軽に遊べる寄り道コーナー',
    gallery: '写真・ファンアート・資料集の入口',
    news: '更新情報をまとめて確認',
    links: '外部サービスへ迷わず移動'
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
      <span class="site-brand__title">さんそん兄妹の活動記録</span>
      <span class="site-brand__sub">${headerDescriptions[currentSection] || '静かな配信と創作のためのサイト'}</span>
    </span>
  `;

  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'site-menu-button';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-controls', 'global-nav');
  menuButton.textContent = 'メニュー';

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

  const existingBreadcrumb = main.querySelector('.breadcrumb');
  if (!existingBreadcrumb) {
    const breadcrumb = document.createElement('nav');
    const list = document.createElement('ol');
    let currentPath = siteRoot.href;

    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', 'パンくずリスト');

    appendCrumb(list, labels.top, siteRoot.href, segments.length === 0);

    segments.forEach((segment, index) => {
      currentPath = new URL(`${segment}/`, currentPath).href;
      appendCrumb(
        list,
        labels[segment] || segment,
        currentPath,
        index === segments.length - 1
      );
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
          <h2>さんそん兄妹について</h2>
          <p>琴音は文章と整える役、しんは配信と説明役。ふたりで静かに活動を積み上げるための、見やすく整理された拠点です。</p>
        </section>
        <section>
          <h2>よく見るページ</h2>
          <ul class="footer-links">
            <li><a href="${new URL('gallery/', siteRoot).href}">ギャラリー</a></li>
            <li><a href="${new URL('reality/', siteRoot).href}">Reality</a></li>
            <li><a href="${new URL('youtube/', siteRoot).href}">YouTube</a></li>
            <li><a href="${new URL('links/', siteRoot).href}">リンク集</a></li>
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
