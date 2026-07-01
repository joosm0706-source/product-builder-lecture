document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

if (!document.querySelector('link[href="arcade.css"]')) {
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = 'arcade.css';
  document.head.appendChild(styles);
}

if (!document.querySelector('link[href="new-games.css"]')) {
  const gameStyles = document.createElement('link');
  gameStyles.rel = 'stylesheet';
  gameStyles.href = 'new-games.css';
  document.head.appendChild(gameStyles);
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

const fullscreenTarget = document.querySelector('.game-wrap, .blocks-stage, .mines-frame');
if (fullscreenTarget) {
  const fullscreenStyles = document.createElement('style');
  fullscreenStyles.textContent = `
    .fullscreen-button{position:absolute;right:14px;bottom:14px;z-index:12;min-height:38px;padding:0 12px;background:rgba(8,12,17,.88)!important;color:var(--text)!important}
    .game-wrap:fullscreen,.blocks-stage:fullscreen,.mines-frame:fullscreen{width:100vw;height:100vh;max-width:none;max-height:none;border:0;border-radius:0;background:#070b12}
    .game-wrap:fullscreen canvas,.blocks-stage:fullscreen canvas{width:100%;height:100%;object-fit:contain}
  `;
  document.head.appendChild(fullscreenStyles);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button ghost fullscreen-button';
  button.textContent = '전체화면';
  button.setAttribute('aria-label', '게임 전체화면으로 보기');
  fullscreenTarget.appendChild(button);

  const updateFullscreenButton = () => {
    const active = document.fullscreenElement === fullscreenTarget;
    button.textContent = active ? '전체화면 종료' : '전체화면';
    button.setAttribute('aria-label', active ? '전체화면 종료' : '게임 전체화면으로 보기');
  };

  button.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (fullscreenTarget.requestFullscreen) await fullscreenTarget.requestFullscreen();
      else alert('이 브라우저는 전체화면 기능을 지원하지 않습니다.');
    } catch (error) {
      alert('전체화면을 시작할 수 없습니다. 브라우저 설정을 확인해 주세요.');
    }
  });
  document.addEventListener('fullscreenchange', updateFullscreenButton);
}
