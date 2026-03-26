document.addEventListener('DOMContentLoaded', () => {

  // ===== Scroll Fade-in =====
  const els = document.querySelectorAll('.anim-fade');
  const reveal = () => {
    els.forEach(el => {
      if (el.classList.contains('visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', reveal, { passive: true });
  window.addEventListener('resize', reveal);
  reveal();
  setTimeout(reveal, 300);

  // ===== Carousel (fade) =====
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track) return;
  const slides = track.querySelectorAll('img');
  if (slides.length === 0) return;

  let current = 0;
  slides[0].classList.add('active');

  if (slides.length > 1) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const goTo = (i) => {
      slides[current].classList.remove('active');
      current = i;
      slides[current].classList.add('active');
      dotsContainer.querySelectorAll('.carousel-dot').forEach((d, j) => {
        d.classList.toggle('active', j === i);
      });
    };

    setInterval(() => goTo((current + 1) % slides.length), 4000);
  }

  // ===== Custom Cursor + Petal Trail (desktop only) =====
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.getElementById('cursor');

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      if (!cursor.classList.contains('visible')) cursor.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    document.addEventListener('mouseenter', () => cursor.classList.add('visible'));

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, .carousel-dot').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // Petal trail
    const colors = ['#8B7355', '#6B7F5E', '#C4956A', '#d4a5b5', '#b8a088'];
    const shapes = [
      'border-radius: 50% 0 50% 50%;',          // petal
      'border-radius: 50%;',                      // circle
      'border-radius: 40% 60% 50% 50%;',         // organic
      'border-radius: 50% 50% 0 50%;',            // petal reversed
    ];
    let lastX = 0, lastY = 0;
    let throttle = 0;

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - throttle < 50) return; // limit to ~20fps
      throttle = now;

      // Only create if mouse moved enough
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) < 8) return;
      lastX = e.clientX;
      lastY = e.clientY;

      const petal = document.createElement('div');
      const size = 4 + Math.random() * 6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const rotation = Math.random() * 360;
      const drift = (Math.random() - 0.5) * 20;

      petal.style.cssText = `
        position: fixed;
        left: ${e.clientX - size / 2}px;
        top: ${e.clientY - size / 2}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        ${shape}
        opacity: 0.5;
        pointer-events: none;
        z-index: 9999;
        transform: rotate(${rotation}deg) scale(1);
        transition: opacity 1.5s ease, transform 1.5s ease;
      `;
      document.body.appendChild(petal);

      requestAnimationFrame(() => {
        petal.style.opacity = '0';
        petal.style.transform = `rotate(${rotation + 60}deg) scale(0.3) translateY(${10 + Math.random() * 15}px) translateX(${drift}px)`;
      });

      setTimeout(() => petal.remove(), 1600);
    });
  }

  // ===== Language Toggle =====
  const langToggle = document.getElementById('langToggle');
  let lang = 'zh';

  langToggle.addEventListener('click', () => {
    lang = lang === 'zh' ? 'ja' : 'zh';
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'ja';

    langToggle.querySelectorAll('.lang-opt').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.lang === lang);
    });

    document.querySelectorAll('[data-zh][data-ja]').forEach(el => {
      el.textContent = el.getAttribute('data-' + lang);
    });
  });

});
