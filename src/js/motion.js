/* Movimiento progresivo: el contenido siempre queda visible si no hay soporte. */
const preferencia = window.matchMedia('(prefers-reduced-motion: reduce)');
let observer;

export function revelar(contenedor = document) {
  if (preferencia.matches || !('IntersectionObserver' in window)) return;
  observer ||= new IntersectionObserver((entradas) => {
    entradas.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('is-visible');
      observer.unobserve(target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  contenedor.querySelectorAll('[data-reveal]:not(.reveal-ready)').forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${(i % 3) * 75}ms`);
    el.classList.add('reveal-ready');
    observer.observe(el);
  });
}

export function initMovimiento() {
  document.querySelectorAll('main > section:not(:first-child) > div:not(.absolute), main > section:first-child h1').forEach((el) => {
    el.setAttribute('data-reveal', '');
  });
  revelar();
  const header = document.getElementById('header');
  const actualizarHeader = () => header?.classList.toggle('header-scrolled', window.scrollY > 24);
  actualizarHeader();
  window.addEventListener('scroll', actualizarHeader, { passive: true });
  preferencia.addEventListener('change', () => {
    if (preferencia.matches) {
      observer?.disconnect();
      document.querySelectorAll('.reveal-ready').forEach((el) => el.classList.add('is-visible'));
    }
  });
}
