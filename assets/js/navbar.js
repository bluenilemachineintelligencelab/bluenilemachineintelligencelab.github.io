window.BNMILNavbar = (function () {
  let toggleButton;
  let nav;
  let navLinks;

  const init = () => {
    nav = document.querySelector('.primary-nav');
    toggleButton = document.querySelector('.nav-toggle');
    navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');

    if (!nav || !toggleButton) {
      return;
    }

    toggleButton.addEventListener('click', toggleMenu);
    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  };

  const toggleMenu = () => {
    const expanded = toggleButton.getAttribute('aria-expanded') === 'true';
    toggleButton.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
    document.body.classList.toggle('nav-open');
  };

  const closeMenu = () => {
    if (!nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    toggleButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const handleScroll = () => {
    if (!nav) return;
    const isSticky = window.scrollY > 10;
    nav.classList.toggle('is-sticky', isSticky);
  };

  return { init };
})();
