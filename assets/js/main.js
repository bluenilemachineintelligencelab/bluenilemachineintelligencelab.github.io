(function () {
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  };

  const initActiveLinkWatcher = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const activeId = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === activeId);
          });
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  };

  const setCurrentYear = () => {
    const yearTarget = document.getElementById('current-year');
    if (yearTarget) {
      yearTarget.textContent = new Date().getFullYear();
    }
  };

  const initForms = () => {
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.querySelector('.footer-form');

    if (contactForm) {
      contactForm.addEventListener('submit', handleContactSubmit);
    }

    if (newsletterForm) {
      newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Simulate form submission (replace with actual API call)
    try {
      // In a real implementation, you would send this to your backend
      console.log('Contact form submission:', data);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      showFormMessage(form, 'Thank you! Your message has been sent. We will get back to you soon.', 'success');
      form.reset();
    } catch (error) {
      showFormMessage(form, 'Sorry, there was an error sending your message. Please try again later.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    const email = emailInput.value;

    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Subscribing...';

    try {
      // In a real implementation, you would send this to your backend
      console.log('Newsletter subscription:', email);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      showFormMessage(form, 'Thank you for subscribing! We will notify you of updates.', 'success');
      form.reset();
    } catch (error) {
      showFormMessage(form, 'Sorry, there was an error. Please try again later.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  };

  const showFormMessage = (form, message, type) => {
    // Remove existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    messageEl.setAttribute('role', 'alert');

    // Insert message before submit button
    const submitButton = form.querySelector('button[type="submit"]');
    form.insertBefore(messageEl, submitButton);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  };

  const initTeamImages = () => {
    const teamImages = document.querySelectorAll('.team-card img');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

    teamImages.forEach((img) => {
      const originalSrc = img.getAttribute('src');
      const basePath = originalSrc.replace(/\.(jpg|jpeg|png|webp|svg)$/i, '');
      let currentExtensionIndex = 0;

      // Try to load image with fallback extensions
      const tryLoadImage = () => {
        if (currentExtensionIndex >= imageExtensions.length) {
          // All extensions failed - fallback to SVG if original was .jpg/.png
          if (originalSrc.includes('.jpg') || originalSrc.includes('.png')) {
            const svgPath = basePath + '.svg';
            const svgTest = new Image();
            svgTest.onload = () => {
              img.src = svgPath;
            };
            svgTest.onerror = () => {
              img.style.display = 'none';
            };
            svgTest.src = svgPath;
          } else {
            img.style.display = 'none';
          }
          return;
        }

        const testSrc = basePath + imageExtensions[currentExtensionIndex];
        const testImg = new Image();

        testImg.onload = () => {
          img.src = testSrc;
          img.style.display = 'block';
        };

        testImg.onerror = () => {
          currentExtensionIndex++;
          tryLoadImage();
        };

        testImg.src = testSrc;
      };

      // Check if current src fails
      img.addEventListener('error', () => {
        tryLoadImage();
      });

      // Pre-check the image
      const checkImg = new Image();
      checkImg.onerror = () => {
        tryLoadImage();
      };
      checkImg.onload = () => {
        // Image loaded successfully, keep original
      };
      checkImg.src = originalSrc;
    });
  };

  const initEventGallery = () => {
    const cards = document.querySelectorAll('.events-card');
    cards.forEach((card) => {
      const featured = card.querySelector('.featured-image');
      const thumbs = card.querySelectorAll('.thumb-img');
      if (!featured || !thumbs.length) return;

      thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => {
          if (thumb.classList.contains('active')) return;

          // Fade out current
          featured.style.opacity = '0';
          const blurBg = featured.previousElementSibling;
          if (blurBg && blurBg.classList.contains('blur-bg')) {
            blurBg.style.opacity = '0';
          }

          setTimeout(() => {
            featured.src = thumb.src;
            featured.alt = thumb.alt;
            featured.style.opacity = '1';

            if (blurBg && blurBg.classList.contains('blur-bg')) {
              blurBg.style.backgroundImage = `url('${thumb.src}')`;
              blurBg.style.opacity = '1';
            }
          }, 250);

          // Update thumb states
          thumbs.forEach((t) => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });
    });
  };

  const initLightbox = () => {
    let currentGallery = [];
    let currentIndex = 0;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous image">&lt;</button>
        <button class="lightbox-nav lightbox-next" aria-label="Next image">&gt;</button>
        <img class="lightbox-img" src="" alt="Full view">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const lightboxImg = overlay.querySelector('.lightbox-img');
    const lightboxCaption = overlay.querySelector('.lightbox-caption');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');

    const updateLightbox = () => {
      const item = currentGallery[currentIndex];
      lightboxImg.style.opacity = '0';

      // Hide navigation if only one image
      if (currentGallery.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
      }

      setTimeout(() => {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        lightboxCaption.textContent = item.alt;
        lightboxImg.style.opacity = '1';
      }, 150);
    };

    const openLightbox = (images, index) => {
      currentGallery = images;
      currentIndex = index;
      updateLightbox();
      overlay.classList.add('is-active');
      document.body.classList.add('lightbox-open');
    };

    const nextImage = () => {
      currentIndex = (currentIndex + 1) % currentGallery.length;
      updateLightbox();
    };

    const prevImage = () => {
      currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
      updateLightbox();
    };

    const closeLightbox = () => {
      overlay.classList.remove('is-active');
      document.body.classList.remove('lightbox-open');
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === closeBtn) closeLightbox();
      if (e.target === nextBtn) nextImage();
      if (e.target === prevBtn) prevImage();
    });

    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('is-active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });

    // Attach to event cards
    document.querySelectorAll('.events-card').forEach(card => {
      const featured = card.querySelector('.featured-image');
      const thumbs = Array.from(card.querySelectorAll('.thumb-img'));

      if (!featured) return;

      featured.style.cursor = 'zoom-in';
      featured.addEventListener('click', () => {
        let images = [];
        let activeIdx = 0;

        if (thumbs.length > 0) {
          images = thumbs.map(t => ({ src: t.src, alt: t.alt }));
          activeIdx = thumbs.findIndex(t => t.classList.contains('active'));
          if (activeIdx === -1) activeIdx = 0;
        } else {
          images = [{ src: featured.src, alt: featured.alt }];
          activeIdx = 0;
        }

        openLightbox(images, activeIdx);
      });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.BNMILNavbar && window.BNMILNavbar.init();
    window.BNMILAnimations && window.BNMILAnimations.init();
    initSmoothScroll();
    initActiveLinkWatcher();
    setCurrentYear();
    initForms();
    initTeamImages();
    initEventGallery();
    initLightbox();
  });
})();
