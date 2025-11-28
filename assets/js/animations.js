window.BNMILAnimations = (function () {
  let observer;

  const init = () => {
    const targets = document.querySelectorAll('[data-animate]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    observer = new IntersectionObserver(onIntersect, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    });

    targets.forEach((el) => observer.observe(el));
  };

  const onIntersect = (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.getAttribute('data-animate-delay');
      if (delay) {
        el.style.transitionDelay = `${delay}ms`;
      }
      el.classList.add('is-visible');
      observer.unobserve(el);
    });
  };

  return { init };
})();
