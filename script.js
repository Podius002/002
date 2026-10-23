/* ============================================
   P002 - Script
   ============================================ */

(function () {
  'use strict';

  // ---------- Elementos ----------
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

  let particlesEnabled = true;
  let particles = [];
  let animationId = null;

  // ---------- Navegação entre views ----------
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = link.dataset.mode;

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      views.forEach(v => v.classList.remove('active'));
      const target = document.getElementById(`${mode}-view`);
      if (target) target.classList.add('active');

      // Foco no input correto
      if (mode === 'search') {
        setTimeout(() => searchInput.focus(), 100);
      } else if (mode === 'proxy') {
        setTimeout(() => proxyInput.focus(), 100);
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

  // ---------- Busca principal ----------
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    const engine = document.querySelector('input[name="engine"]:checked').value;
    let url = '';

    switch (engine) {
      case 'duck':
        url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        break;
      case 'bing':
        url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        break;
      default:
        url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  });

  // ---------- Estou com sorte ----------
  luckyBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
      // Se vazio, leva para um site aleatório legal
      const luckys = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://github.com',
        'https://www.reddit.com/r/gaming',
        'https://www.wikipedia.org'
      ];
      window.open(luckys[Math.floor(Math.random() * luckys.length)], '_blank');
      return;
    }
    // Google "I'm Feeling Lucky"
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`,
      '_blank',
      'noopener,noreferrer'
    );
  });

  // ---------- Proxy ----------
  proxyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let url = proxyInput.value.trim();
    if (!url) return;

    // Adiciona https se faltar
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    // Usa um proxy público simples (abre em nova aba)
    // Alternativa: https://corsproxy.io/?  ou outros
    const proxyUrl = `https://www.proxysite.com/process.php?d=${encodeURIComponent(url)}`;
    window.open(proxyUrl, '_blank', 'noopener,noreferrer');
  });

  // Presets do proxy
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      proxyInput.value = btn.dataset.url;
      proxyForm.dispatchEvent(new Event('submit'));
    });
  });

  // ---------- Relógio ----------
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}`;
  }
  updateClock();
  setInterval(updateClock, 10000);

  // ---------- Partículas ----------
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 80);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.6 ? '#00f0ff' : (Math.random() > 0.5 ? '#b000ff' : '#00ff9d')
      });
    }
  }

  function drawParticles() {
    if (!particlesEnabled) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Linhas entre partículas próximas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Partículas
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

  // Toggle efeitos
  themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    particlesEnabled = !particlesEnabled;
    if (particlesEnabled) {
      initParticles();
      themeToggle.textContent = 'Efeitos';
    } else {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      themeToggle.textContent = 'Efeitos Off';
    }
  });

  // Init
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  // Inicia partículas após um pequeno delay
  setTimeout(initParticles, 100);

  // Atalho Enter já está no form
  // Atalho Esc limpa
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      clearBtn.style.display = 'none';
    }
  });
})();
