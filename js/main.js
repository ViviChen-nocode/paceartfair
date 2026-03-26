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
