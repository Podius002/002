/* ============================================
   P002 v2 - Script (History 7 days + i18n)
   ============================================ */

(function () {
  'use strict';

  // ---------- Translations ----------
  const translations = {
    pt: {
      nav_search: 'Busca',
      nav_history: 'Histórico',
      nav_proxy: 'Proxy',
      nav_about: 'Sobre',
      tagline: 'Motor de busca gamer • Escuro • Rápido',
      search_placeholder: 'Pesquisar no P002...',
      btn_search: 'Pesquisar no P002',
      btn_lucky: 'Estou com sorte',
      back: '← Voltar',
      history_title: 'Histórico de Pesquisas',
      history_desc: 'Suas pesquisas ficam salvas por 7 dias',
      clear_history: 'Limpar histórico',
      history_empty: 'Nenhuma pesquisa ainda',
      proxy_title: 'Proxy P002',
      proxy_desc: 'Digite a URL que deseja acessar',
      proxy_placeholder: 'https://exemplo.com',
      about_title: 'Sobre o P002',
      about_p1: 'P002 é um motor de busca com interface gamer escura, inspirado no Google.',
      about_p2: 'Histórico de pesquisas salvo por 7 dias + suporte a Português e Inglês.',
      about_li1: 'Busca via Google, DuckDuckGo e Bing',
      about_li2: 'Histórico automático (7 dias)',
      about_li3: 'Troca de idioma PT / EN',
      about_li4: 'Modo Proxy',
      about_li5: 'Design responsivo (iPhone + Desktop)',
      footer_text: 'Motor de busca gamer',
      effects: 'Efeitos'
    },
    en: {
      nav_search: 'Search',
      nav_history: 'History',
      nav_proxy: 'Proxy',
      nav_about: 'About',
      tagline: 'Gamer search engine • Dark • Fast',
      search_placeholder: 'Search on P002...',
      btn_search: 'Search on P002',
      btn_lucky: 'I\'m Feeling Lucky',
      back: '← Back',
      history_title: 'Search History',
      history_desc: 'Your searches are saved for 7 days',
      clear_history: 'Clear history',
      history_empty: 'No searches yet',
      proxy_title: 'P002 Proxy',
      proxy_desc: 'Enter the URL you want to access',
      proxy_placeholder: 'https://example.com',
      about_title: 'About P002',
      about_p1: 'P002 is a search engine with a dark gamer interface, inspired by Google.',
      about_p2: 'Search history saved for 7 days + Portuguese and English support.',
      about_li1: 'Search via Google, DuckDuckGo and Bing',
      about_li2: 'Automatic history (7 days)',
      about_li3: 'Language switch PT / EN',
      about_li4: 'Proxy mode',
      about_li5: 'Responsive design (iPhone + Desktop)',
      footer_text: 'Gamer search engine',
      effects: 'Effects'
    }
  };

  let currentLang = localStorage.getItem('p002_lang') || 'pt';

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('p002_lang', lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) el.textContent = translations[lang][key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang][key]) el.placeholder = translations[lang][key];
    });

    document.getElementById('lang-pt').classList.toggle('active', lang === 'pt');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
  }

  document.getElementById('lang-pt').addEventListener('click', () => setLanguage('pt'));
  document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));

  // ---------- History (7 days) ----------
  const HISTORY_KEY = 'p002_history';
  const MAX_DAYS = 7;

  function getHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      const list = JSON.parse(raw);
      const now = Date.now();
      const filtered = list.filter(item => (now - item.timestamp) < MAX_DAYS * 24 * 60 * 60 * 1000);
      if (filtered.length !== list.length) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
    }
  }

  function saveToHistory(query) {
    if (!query || query.length < 1) return;
    let list = getHistory();
    // Remove duplicates
    list = list.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    list.unshift({ query, timestamp: Date.now() });
    // Keep max 50
    if (list.length > 50) list = list.slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  }

  function renderHistory() {
    const container = document.getElementById('history-list');
    const list = getHistory();

    if (list.length === 0) {
      container.innerHTML = `<div class="history-empty">${translations[currentLang].history_empty}</div>`;
      return;
    }

    container.innerHTML = list.map(item => {
      const date = new Date(item.timestamp);
      const dateStr = date.toLocaleDateString(currentLang === 'pt' ? 'pt-BR' : 'en-US', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      });
      return `
        <div class="history-item" data-query="${item.query.replace(/"/g, '&quot;')}">
          <span class="history-query">${item.query}</span>
          <span class="history-date">${dateStr}</span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.history-item').forEach(el => {
      el.addEventListener('click', () => {
        const q = el.getAttribute('data-query');
        document.getElementById('search-input').value = q;
        // Switch to search view and submit
        document.querySelector('.nav-link[data-mode="search"]').click();
        setTimeout(() => document.getElementById('search-form').dispatchEvent(new Event('submit')), 100);
      });
    });
  }

  document.getElementById('clear-history').addEventListener('click', () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  });

  // ---------- Elements ----------
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-btn');
  const luckyBtn = document.getElementById('lucky-btn');
  const proxyForm = document.getElementById('proxy-form');
  const proxyInput = document.getElementById('proxy-input');
  const navLinks = document.querySelectorAll('.nav-link');
  const views = document.querySelectorAll('.view');
  const clockEl = document.getElementById('clock');
  const themeToggle = document.getElementById('theme-toggle');
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const resultsArea = document.getElementById('results-area');
  const resultsFrame = document.getElementById('results-frame');
  const resultsQuery = document.getElementById('results-query');
  const hero = document.getElementById('hero');
  const backBtn = document.getElementById('back-to-home');

  let particlesEnabled = true;
  let particles = [];
  let animationId = null;

  // ---------- Navigation ----------
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = link.dataset.mode;

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      views.forEach(v => v.classList.remove('active'));
      const target = document.getElementById(`${mode}-view`);
      if (target) target.classList.add('active');

      if (mode === 'search') {
        setTimeout(() => searchInput.focus(), 80);
      } else if (mode === 'history') {
        renderHistory();
      } else if (mode === 'proxy') {
        setTimeout(() => proxyInput.focus(), 80);
      }
    });
  });

  // ---------- Clear button ----------
  searchInput.addEventListener('input', () => {
    clearBtn.style.display = searchInput.value ? 'flex' : 'none';
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
  });

  // ---------- Search ----------
  function doSearch(query, engine) {
    if (!query) return;

    saveToHistory(query);

    let url = '';
    switch (engine) {
      case 'duck':
        url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        break;
      case 'bing':
        url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        break;
      default:
        url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }

    // Show results inside the page when possible (DuckDuckGo HTML works better in iframe)
    if (engine === 'duck') {
      hero.style.display = 'none';
      document.querySelector('.search-form').style.display = 'none';
      document.querySelector('.quick-links').style.display = 'none';
      resultsArea.style.display = 'block';
      resultsQuery.textContent = query;
      resultsFrame.src = url;
    } else {
      // Google and Bing usually block iframe → open new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    const engine = document.querySelector('input[name="engine"]:checked').value;
    doSearch(query, engine);
  });

  luckyBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
      const luckys = [
        'https://www.youtube.com',
        'https://github.com',
        'https://www.reddit.com/r/gaming',
        'https://www.wikipedia.org'
      ];
      window.open(luckys[Math.floor(Math.random() * luckys.length)], '_blank');
      return;
    }
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`, '_blank');
  });

  backBtn.addEventListener('click', () => {
    resultsArea.style.display = 'none';
    resultsFrame.src = '';
    hero.style.display = 'block';
    document.querySelector('.search-form').style.display = 'block';
    document.querySelector('.quick-links').style.display = 'flex';
  });

  // ---------- Proxy ----------
  proxyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let url = proxyInput.value.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    window.open(`https://www.proxysite.com/process.php?d=${encodeURIComponent(url)}`, '_blank');
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      proxyInput.value = btn.dataset.url;
      proxyForm.dispatchEvent(new Event('submit'));
    });
  });

  // ---------- Clock ----------
  function updateClock() {
    const now = new Date();
    clockEl.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  }
  updateClock();
  setInterval(updateClock, 10000);

  // ---------- Particles ----------
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 70);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.6 ? '#00f0ff' : (Math.random() > 0.5 ? '#b000ff' : '#00ff9d')
      });
    }
  }

  function drawParticles() {
    if (!particlesEnabled) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.07 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    animationId = requestAnimationFrame(drawParticles);
  }

  function initParticles() {
    resizeCanvas();
    createParticles();
    if (animationId) cancelAnimationFrame(animationId);
    drawParticles();
  }

  themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    particlesEnabled = !particlesEnabled;
    if (particlesEnabled) {
      initParticles();
      themeToggle.textContent = translations[currentLang].effects;
    } else {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      themeToggle.textContent = translations[currentLang].effects + ' Off';
    }
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  // Init
  setLanguage(currentLang);
  setTimeout(initParticles, 80);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      if (resultsArea.style.display === 'block') backBtn.click();
    }
  });
})();
