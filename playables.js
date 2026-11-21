// /playables: puts each playable ad's real build into its phone frame, only when it is wanted.
// - Desktop with a fine pointer: a phone starts by itself once it is on screen.
// - Touch screens, reduced motion and Save-Data: the poster stays until the play button is pressed,
//   so a swipe over a phone never gets caught by a game and nothing moves on its own.
// - A phone scrolled well out of view is put back to its poster, so at most the visible games run.
(() => {
  const phones = document.querySelectorAll('.phone[data-src]');
  if (!phones.length) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;
  const auto = !still && !saveData && matchMedia('(hover: hover) and (pointer: fine)').matches;

  const load = (phone, byUser) => {
    if (phone.querySelector('iframe')) return;
    const frame = document.createElement('iframe');
    frame.src = phone.dataset.src;
    frame.title = phone.dataset.title || 'Playable ad';
    frame.allow = 'autoplay';
    frame.addEventListener(
      'load',
      () => {
        phone.classList.add('is-live');
        if (byUser) frame.focus();
      },
      { once: true },
    );
    phone.querySelector('.phone-screen').append(frame);
  };
  const unload = (phone) => {
    const frame = phone.querySelector('iframe');
    if (!frame) return;
    frame.remove();
    phone.classList.remove('is-live');
  };

  phones.forEach((phone) => {
    phone.querySelector('.phone-play')?.addEventListener('click', () => load(phone, true));
    const stop = phone.querySelector('.phone-stop');
    stop?.addEventListener('click', () => {
      unload(phone);
      phone.querySelector('.phone-play')?.focus();
    });
  });

  if (!('IntersectionObserver' in window)) return;
  const away = new IntersectionObserver(
    (entries) => entries.forEach((e) => !e.isIntersecting && unload(e.target)),
    { rootMargin: '60% 0px' },
  );
  phones.forEach((p) => away.observe(p));
  if (auto) {
    const near = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && load(e.target, false)),
      { threshold: 0.4 },
    );
    phones.forEach((p) => near.observe(p));
  }
})();
