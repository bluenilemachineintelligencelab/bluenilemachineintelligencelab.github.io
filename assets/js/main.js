(function () {
  const initSmoothScroll = () => {
    const nav = document.querySelector('.primary-nav');
    const navHeight = nav ? nav.offsetHeight : 0;
    const scrollOffset = navHeight + 20; // Add 20px padding

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        event.preventDefault();
        
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  };

  const initActiveLinkWatcher = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const nav = document.querySelector('.primary-nav');
    const navHeight = nav ? nav.offsetHeight : 0;
    const scrollOffset = navHeight + 100; // Offset for better detection

    const updateActiveLink = () => {
      let current = '';
      const scrollPosition = window.scrollY + scrollOffset;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = `#${section.id}`;
        }
      });

      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === current);
      });
    };

    // Use IntersectionObserver for better performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateActiveLink();
          }
        });
      },
      { 
        rootMargin: `-${scrollOffset}px 0px -60% 0px`,
        threshold: 0.1
      }
    );

    sections.forEach((section) => observer.observe(section));
    
    // Also update on scroll for better accuracy
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial update
    updateActiveLink();
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

  document.addEventListener('DOMContentLoaded', () => {
    window.BNMILNavbar && window.BNMILNavbar.init();
    window.BNMILAnimations && window.BNMILAnimations.init();
    initSmoothScroll();
    initActiveLinkWatcher();
    setCurrentYear();
    initForms();
    initTeamImages();
  });
})();
