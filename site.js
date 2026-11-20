// Nalbaki Games site script. Plain JS, loaded with `defer`. Two jobs:
// 1. Gameplay clips play only while on screen (saves data and battery), never under reduced motion or Save-Data,
//    and every clip gets a pause button.
// 2. The services page fills its prices from pricing.js.
(() => {
  const clips = document.querySelectorAll('video[data-clip]');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData === true;
  if (clips.length && !still && 'IntersectionObserver' in window) {
    const paused = new WeakSet();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target;
          if (e.isIntersecting && !paused.has(v)) v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: 0.35 },
    );
    clips.forEach((v) => {
      v.preload = 'metadata';
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'clip-toggle';
      b.setAttribute('aria-label', 'Pause clip');
      b.textContent = 'Pause';
      b.addEventListener('click', () => {
        if (paused.has(v)) {
          paused.delete(v);
          v.play().catch(() => {});
          b.textContent = 'Pause';
          b.setAttribute('aria-label', 'Pause clip');
        } else {
          paused.add(v);
          v.pause();
          b.textContent = 'Play';
          b.setAttribute('aria-label', 'Play clip');
        }
      });
      v.parentElement.appendChild(b);
      io.observe(v);
    });
  }

  const pricing = window.NALBAKI_PRICING;
  if (pricing) {
    document.querySelectorAll('[data-package]').forEach((el) => {
      const p = pricing.packages[el.dataset.package];
      if (!p) return;
      const price = el.querySelector('[data-price]');
      const days = el.querySelector('[data-days]');
      if (price) {
        if (typeof p.price === 'number') {
          const amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: pricing.currency, maximumFractionDigits: 0 }).format(p.price);
          price.innerHTML = '';
          price.append(amount);
          const small = document.createElement('small');
          small.textContent = p.unit;
          price.append(' ', small);
        } else {
          price.innerHTML = '<span class="tbd">Price TBD</span>';
        }
      }
      if (days && p.days) days.textContent = `${p.days} working days`;
    });
  }
})();
