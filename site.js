document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
document.querySelectorAll('.nav-links').forEach(nav=>{if(!nav.querySelector('[href="rankings.html"]')){const link=document.createElement('a');link.href='rankings.html';link.textContent='랭킹';const about=nav.querySelector('[href="about.html"]');nav.insertBefore(link,about)}});
