/**
 * MEN'S SALOON - Core Vanilla JavaScript
 * Identity: MEN'S SALOON
 * Description: Interactive features, mobile navigation, category filtering,
 *              lightbox modal, FAQ accordion, scroll-to-top, and appointment validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initActiveNavLink();
  initScrollTop();
  initScrollReveal();
  initServiceFilters();
  initGalleryFeatures();
  initFaqAccordion();
  initBookingForm();
  initPreselectedServiceHandling();
});

/**
 * 1. Sticky Header with scroll detection
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Responsive Mobile Navigation
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (!toggleBtn || !mainNav) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    toggleBtn.classList.toggle('active');
    mainNav.classList.toggle('active');
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  });

  // Close nav on click outside or clicking any nav link
  const navLinks = mainNav.querySelectorAll('.nav-link, .nav-cta a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      mainNav.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/**
 * 3. Highlight current page link based on pathname
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * 4. Scroll To Top Button
 */
function initScrollTop() {
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 5. Subtle Scroll Reveal Animations
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver not available
    elements.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * 6. Service Category Filter (Used on services.html)
 */
function initServiceFilters() {
  const filterButtons = document.querySelectorAll('[data-service-filter]');
  const serviceCards = document.querySelectorAll('[data-service-category]');
  if (!filterButtons.length || !serviceCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-service-filter');

      serviceCards.forEach(card => {
        const categories = card.getAttribute('data-service-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = '';
          setTimeout(() => card.classList.add('revealed'), 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 7. Gallery Category Filters & Lightbox Modal (Used on gallery.html)
 */
function initGalleryFeatures() {
  const filterButtons = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('gallery-lightbox');
  const lightboxPlaceholder = document.getElementById('lightbox-placeholder-container');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close-btn');

  // Filter functionality
  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-gallery-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox functionality
  if (lightboxModal && galleryItems.length) {
    const openLightbox = (item) => {
      const placeholder = item.querySelector('.image-placeholder');
      const title = item.querySelector('.gallery-overlay-title') ? item.querySelector('.gallery-overlay-title').textContent : 'Gallery Image';
      
      if (placeholder && lightboxPlaceholder && lightboxCaption) {
        lightboxPlaceholder.innerHTML = '';
        const clone = placeholder.cloneNode(true);
        lightboxPlaceholder.appendChild(clone);
        lightboxCaption.textContent = title;
      }

      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    };

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    galleryItems.forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
}

/**
 * 8. FAQ Accordion (Used on packages.html & services.html)
 */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');
  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const content = trigger.nextElementSibling;

      // Close other accordions in the same container for clean UX
      const parent = trigger.closest('.faq-accordion');
      if (parent) {
        parent.querySelectorAll('.faq-trigger').forEach(otherTrigger => {
          if (otherTrigger !== trigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherTrigger.nextElementSibling) {
              otherTrigger.nextElementSibling.style.maxHeight = null;
            }
          }
        });
      }

      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        if (content) content.style.maxHeight = null;
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 9. Appointment & Contact Booking Form Validation
 */
function initBookingForm() {
  const bookingForm = document.getElementById('appointment-form');
  if (!bookingForm) return;

  const dateInput = document.getElementById('booking-date');
  const serviceCategorySelect = document.getElementById('service-category');
  const serviceSelect = document.getElementById('service-name');
  const alertSuccess = document.getElementById('form-alert-success');
  const alertError = document.getElementById('form-alert-error');

  // Prevent past dates from being selected
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Dependent dropdown services mapping
  const serviceOptions = {
    haircuts: [
      { name: "Classic Haircut (₹249)", val: "Classic Haircut" },
      { name: "Fade Haircut (₹349)", val: "Fade Haircut" },
      { name: "Taper Haircut (₹299)", val: "Taper Haircut" },
      { name: "Crew Cut (₹249)", val: "Crew Cut" },
      { name: "Buzz Cut (₹199)", val: "Buzz Cut" },
      { name: "Textured Crop (₹349)", val: "Textured Crop" },
      { name: "Pompadour Styling (₹399)", val: "Pompadour" }
    ],
    beard: [
      { name: "Beard Trimming (₹149)", val: "Beard Trimming" },
      { name: "Beard Styling (₹199)", val: "Beard Styling" },
      { name: "Beard Shaping (₹249)", val: "Beard Shaping" },
      { name: "Beard Line-Up (₹149)", val: "Beard Line-Up" },
      { name: "Clean Shave (₹149)", val: "Clean Shave" },
      { name: "Moustache Styling (₹99)", val: "Moustache Styling" }
    ],
    haircare: [
      { name: "Hair Spa (₹799)", val: "Hair Spa" },
      { name: "Hair Wash (₹149)", val: "Hair Wash" },
      { name: "Hair Conditioning (₹299)", val: "Hair Conditioning" },
      { name: "Scalp Care Treatment (₹699)", val: "Scalp Care" }
    ],
    color: [
      { name: "Global Hair Color (₹1,499)", val: "Global Hair Color" },
      { name: "Grey Coverage (₹899)", val: "Grey Coverage" },
      { name: "Root Touch-Up (₹699)", val: "Root Touch-Up" },
      { name: "Fashion Hair Color (₹1,899)", val: "Fashion Hair Color" }
    ],
    facial: [
      { name: "Men's Facial (₹999)", val: "Men's Facial" },
      { name: "Face Cleanup (₹499)", val: "Face Cleanup" },
      { name: "Head Massage (₹299)", val: "Head Massage" },
      { name: "Basic Grooming (₹449)", val: "Basic Grooming" }
    ],
    packages: [
      { name: "Basic Grooming Package (₹499)", val: "Basic Grooming Package" },
      { name: "Premium Grooming Package (₹999)", val: "Premium Grooming Package" },
      { name: "Complete Hair Care Package (₹1,499)", val: "Complete Hair Care Package" },
      { name: "Men's Skin Care Package (₹1,299)", val: "Men's Skin Care Package" },
      { name: "Special Occasion Grooming (₹1,799)", val: "Special Occasion Grooming" }
    ]
  };

  if (serviceCategorySelect && serviceSelect) {
    serviceCategorySelect.addEventListener('change', () => {
      const selectedCategory = serviceCategorySelect.value;
      serviceSelect.innerHTML = '<option value="">Select a specific service</option>';

      if (serviceOptions[selectedCategory]) {
        serviceOptions[selectedCategory].forEach(srv => {
          const opt = document.createElement('option');
          opt.value = srv.val;
          opt.textContent = srv.name;
          serviceSelect.appendChild(opt);
        });
      } else {
        // Populate all services as default
        Object.keys(serviceOptions).forEach(cat => {
          serviceOptions[cat].forEach(srv => {
            const opt = document.createElement('option');
            opt.value = srv.val;
            opt.textContent = srv.name;
            serviceSelect.appendChild(opt);
          });
        });
      }
    });

    // Trigger initial population
    serviceCategorySelect.dispatchEvent(new Event('change'));
  }

  // Form submit handler with validation
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    if (alertSuccess) alertSuccess.style.display = 'none';
    if (alertError) alertError.style.display = 'none';

    // Name validation
    const nameInput = document.getElementById('booking-name');
    const nameError = document.getElementById('name-error');
    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, 'Please enter your full name.');
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // Phone validation
    const phoneInput = document.getElementById('booking-phone');
    const phoneError = document.getElementById('phone-error');
    const phoneRegex = /^[0-9+ -]{8,15}$/;
    if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
      showError(phoneInput, phoneError, 'Please enter a valid phone number.');
      isValid = false;
    } else {
      clearError(phoneInput, phoneError);
    }

    // Email validation
    const emailInput = document.getElementById('booking-email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // Date validation
    const dateError = document.getElementById('date-error');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      if (!dateInput.value) {
        showError(dateInput, dateError, 'Please select a preferred date.');
        isValid = false;
      } else if (dateInput.value < today) {
        showError(dateInput, dateError, 'Appointment date cannot be in the past.');
        isValid = false;
      } else {
        clearError(dateInput, dateError);
      }
    }

    // Time validation
    const timeInput = document.getElementById('booking-time');
    const timeError = document.getElementById('time-error');
    if (timeInput && !timeInput.value) {
      showError(timeInput, timeError, 'Please select a preferred time slot.');
      isValid = false;
    } else if (timeInput) {
      clearError(timeInput, timeError);
    }

    if (!isValid) {
      if (alertError) {
        alertError.textContent = 'Please fill out all required fields correctly before submitting.';
        alertError.style.display = 'block';
      }
      return;
    }

    // Frontend Demonstration Confirmation
    if (alertSuccess) {
      alertSuccess.innerHTML = `<strong>Appointment Enquiry Received (Frontend Demo)!</strong><br>
      Thank you, <em>${escapeHtml(nameInput.value.trim())}</em>. Your demonstration booking request for <em>${escapeHtml(serviceSelect ? serviceSelect.value || 'Grooming Service' : 'Selected Service')}</em> on <em>${escapeHtml(dateInput.value)}</em> has been simulated successfully.`;
      alertSuccess.style.display = 'block';
    }

    bookingForm.reset();

    // Re-initialize dropdown and min-date
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }
    if (serviceCategorySelect) {
      serviceCategorySelect.dispatchEvent(new Event('change'));
    }

    // Scroll to message
    if (alertSuccess) {
      alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  function showError(input, errorSpan, msg) {
    if (input) input.classList.add('error');
    if (errorSpan) {
      errorSpan.textContent = msg;
      errorSpan.classList.add('active');
    }
  }

  function clearError(input, errorSpan) {
    if (input) input.classList.remove('error');
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.classList.remove('active');
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
}

/**
 * 10. Preselected Service from URL parameters (e.g., contact.html?service=Fade%20Haircut&cat=haircuts)
 */
function initPreselectedServiceHandling() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedCat = urlParams.get('cat');
  const requestedService = urlParams.get('service');

  const catSelect = document.getElementById('service-category');
  const serviceSelect = document.getElementById('service-name');

  if (catSelect && requestedCat) {
    catSelect.value = requestedCat;
    catSelect.dispatchEvent(new Event('change'));

    if (serviceSelect && requestedService) {
      // Find matching option or set value
      setTimeout(() => {
        serviceSelect.value = requestedService;
      }, 50);
    }
  }
}
