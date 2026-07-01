document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

if (!document.querySelector('link[href="arcade.css"]')) {
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = 'arcade.css';
  document.head.appendChild(styles);
}

document.querySelectorAll('.brand').forEach(brand => {
  brand.innerHTML = '게임<span>세상</span>';
  brand.setAttribute('aria-label', '게임세상 홈');
});

document.querySelectorAll('.footer-inner > div:first-child > strong').forEach(el => el.textContent = '게임세상');

document.querySelectorAll('.nav-links').forEach(nav => {
  const home = nav.querySelector('[href="index.html"]');
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  if (!nav.querySelector('[href="games.html"]')) {
    const games = document.createElement('a');
    games.href = 'games.html';
    games.textContent = '게임 목록';
    home?.insertAdjacentElement('afterend', games);
  }
  const originalGame = nav.querySelector('[href="game.html"]');
  if (originalGame) originalGame.textContent = '던전 브레이커';
  if (!nav.querySelector('[href="rankings.html"]')) {
    const link = document.createElement('a');
    link.href = 'rankings.html';
    link.textContent = '랭킹';
    nav.querySelector('[href="about.html"]')?.insertAdjacentElement('beforebegin', link);
  }
  nav.querySelectorAll('a').forEach(link => {
    if (link.getAttribute('href') === currentPath) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
});
