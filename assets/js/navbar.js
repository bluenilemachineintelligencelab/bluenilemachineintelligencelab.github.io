window.BNMILNavbar = (function () {
  let toggleButton;
  let nav;
  let navLinks;
  const DESKTOP_BREAKPOINT = 1024;

  const init = () => {
    nav = document.querySelector('.primary-nav');
    toggleButton = document.querySelector('.nav-toggle');
    navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');

    if (!nav || !toggleButton) {
      return;
    }

    // Ensure a clean initial state (prevents stuck scroll-lock after refresh/navigation).
    nav.classList.remove('is-open');
    toggleButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');

    toggleButton.addEventListener('click', toggleMenu);
    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleDocumentClick);
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

  const handleResize = () => {
    // If we cross into desktop sizing, always ensure scroll-lock is removed.
    if (window.innerWidth > DESKTOP_BREAKPOINT) {
      nav.classList.remove('is-open');
      toggleButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  };

  const handleKeydown = (event) => {
    if (event.key !== 'Escape') return;
    closeMenu();
  };

  const handleDocumentClick = (event) => {
    // Close when clicking outside the nav while menu is open (mobile drawer).
    if (!nav.classList.contains('is-open')) return;
    if (nav.contains(event.target)) return;
    closeMenu();
  };

  const handleScroll = () => {
    if (!nav) return;
    const isSticky = window.scrollY > 10;
    nav.classList.toggle('is-sticky', isSticky);
  };

  return { init };
})();
