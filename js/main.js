/* ==========================================================================
   AURA ATELIER & BARBERSHOP - MAIN JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initNavbar();
  initThemeToggle();
  initShopStatus();
  initServiceEstimator();
  initGalleryFilter();
  initLightbox();
  initBookingModal();
  initContactForm();
  initNewsletterForm();
  initWhatsAppWidget();
  initScrollSpy();
});

/* --------------------------------------------------------------------------
   1. Theme & UI Switcher (Royal Gold <-> Botanical Emerald)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeLabel = document.getElementById('themeLabel');
  const heroAccentText = document.getElementById('heroAccentText');
  const htmlTag = document.documentElement;

  if (!themeToggleBtn) return;

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme') || 'gold';
    const newTheme = currentTheme === 'gold' ? 'emerald' : 'gold';

    htmlTag.setAttribute('data-theme', newTheme);

    if (newTheme === 'emerald') {
      themeLabel.textContent = 'UI 2: Botanical Spa';
      if (heroAccentText) heroAccentText.textContent = 'Wellness & Elegance';
      showToast('Switched to UI 2: Emerald Botanical Spa Theme', 'success');
    } else {
      themeLabel.textContent = 'UI 1: Royal Gold';
      if (heroAccentText) heroAccentText.textContent = 'Grooming & Elegance';
      showToast('Switched to UI 1: Royal Black & Gold Theme', 'success');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Sticky Navigation Bar & Mobile Hamburger Drawer
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header background shift on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Hamburger Toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu on clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. Real-Time Business Shop Status (Open/Closed Calculation)
   -------------------------------------------------------------------------- */
function initShopStatus() {
  const statusBadge = document.getElementById('shopStatusBadge');
  if (!statusBadge) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTimeInMinutes = hour * 60 + minute;

  let isOpen = false;
  let closeTimeText = '';

  if (day >= 1 && day <= 5) {
    // Monday - Friday: 9:00 AM (540m) to 9:00 PM (1260m)
    if (currentTimeInMinutes >= 540 && currentTimeInMinutes < 1260) {
      isOpen = true;
      closeTimeText = 'Closes 9:00 PM';
    }
  } else if (day === 6) {
    // Saturday: 9:00 AM (540m) to 8:00 PM (1200m)
    if (currentTimeInMinutes >= 540 && currentTimeInMinutes < 1200) {
      isOpen = true;
      closeTimeText = 'Closes 8:00 PM';
    }
  } else if (day === 0) {
    // Sunday: 10:00 AM (600m) to 6:00 PM (1080m)
    if (currentTimeInMinutes >= 600 && currentTimeInMinutes < 1080) {
      isOpen = true;
      closeTimeText = 'Closes 6:00 PM';
    }
  }

  const dot = statusBadge.querySelector('.status-dot');
  const text = statusBadge.querySelector('.status-text');

  if (isOpen) {
    dot.classList.remove('closed');
    text.textContent = `🟢 OPEN NOW • ${closeTimeText}`;
  } else {
    dot.classList.add('closed');
    text.textContent = `🔴 CLOSED NOW • Opens 9:00 AM`;
  }
}

/* --------------------------------------------------------------------------
   4. Instant Package Price Estimator
   -------------------------------------------------------------------------- */
function initServiceEstimator() {
  const checkboxes = document.querySelectorAll('.estimator-checkbox');
  const estTime = document.getElementById('estTime');
  const estPrice = document.getElementById('estPrice');
  const estBookBtn = document.getElementById('estBookBtn');

  if (!checkboxes.length) return;

  function calculateTotal() {
    let totalTime = 0;
    let totalPrice = 0;
    let selectedNames = [];

    checkboxes.forEach(cb => {
      if (cb.checked) {
        totalPrice += parseInt(cb.getAttribute('data-price') || 0);
        totalTime += parseInt(cb.getAttribute('data-time') || 0);
        selectedNames.push(cb.getAttribute('data-name'));
      }
    });

    if (estTime) estTime.textContent = `${totalTime} Mins`;
    if (estPrice) estPrice.textContent = `$${totalPrice}`;

    if (estBookBtn) {
      if (selectedNames.length > 0) {
        estBookBtn.disabled = false;
        estBookBtn.setAttribute('data-selected-package', `Custom Package (${selectedNames.join(', ')}) - $${totalPrice}`);
      } else {
        estBookBtn.disabled = true;
      }
    }
  }

  checkboxes.forEach(cb => cb.addEventListener('change', calculateTotal));

  if (estBookBtn) {
    estBookBtn.addEventListener('click', () => {
      const packageDetail = estBookBtn.getAttribute('data-selected-package');
      openModalWithService(packageDetail);
    });
  }
}

/* --------------------------------------------------------------------------
   5. Filterable Portfolio Gallery
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Gallery Lightbox Modal
   -------------------------------------------------------------------------- */
function initLightbox() {
  const zoomBtns = document.querySelectorAll('.gallery-zoom-btn');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightboxModal) return;

  zoomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = btn.getAttribute('data-src');
      const caption = btn.getAttribute('data-caption');
      lightboxImg.src = src;
      lightboxCaption.textContent = caption;
      lightboxModal.classList.add('active');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => lightboxModal.classList.remove('active'));
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) lightboxModal.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      lightboxModal.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   7. Interactive Booking Drawer / Modal
   -------------------------------------------------------------------------- */
function initBookingModal() {
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const bookingForm = document.getElementById('bookingForm');
  const bookingServiceSelect = document.getElementById('bookingService');
  const bookingDateInput = document.getElementById('bookingDate');

  if (!bookingModal) return;

  // Set minimum date to today
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
    bookingDateInput.value = today;
  }

  // Open modal handlers
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedService = btn.getAttribute('data-service');
      if (selectedService && bookingServiceSelect) {
        for (let option of bookingServiceSelect.options) {
          if (option.value.includes(selectedService) || option.text.includes(selectedService)) {
            option.selected = true;
            break;
          }
        }
      }
      bookingModal.classList.add('active');
    });
  });

  // Close modal handler
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => bookingModal.classList.remove('active'));
  }

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) bookingModal.classList.remove('active');
  });

  // Form submit handler
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const service = bookingServiceSelect.value;
      const date = document.getElementById('bookingDate').value;
      const time = document.getElementById('bookingTime').value;
      const name = document.getElementById('bookingClientName').value;
      const phone = document.getElementById('bookingClientPhone').value;

      if (!service || !date || !time || !name || !phone) {
        showToast('Please fill out all required reservation fields.', 'error');
        return;
      }

      // Generate booking reference number
      const refId = 'AURA-' + Math.floor(1000 + Math.random() * 9000);

      bookingModal.classList.remove('active');
      bookingForm.reset();

      // Show success modal/toast notification
      showToast(`Reservation Confirmed! Ref #${refId} for ${name} on ${date} at ${time}.`, 'success');
    });
  }
}

function openModalWithService(serviceText) {
  const bookingModal = document.getElementById('bookingModal');
  const bookingServiceSelect = document.getElementById('bookingService');
  if (bookingModal && bookingServiceSelect) {
    bookingModal.classList.add('active');
  }
}

/* --------------------------------------------------------------------------
   8. Contact Form Handling & Direct Validation
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');

    let isValid = true;

    // Reset error states
    document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('error'));

    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (isValid) {
      showToast('Thank you! Your message has been sent to our VIP reception.', 'success');
      contactForm.reset();
    }
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/* --------------------------------------------------------------------------
   9. Newsletter Subscription Form
   -------------------------------------------------------------------------- */
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Welcome to the AURA VIP Club! Subscription confirmed.', 'success');
    newsletterForm.reset();
  });
}

/* --------------------------------------------------------------------------
   10. WhatsApp Widget Drawer Toggle
   -------------------------------------------------------------------------- */
function initWhatsAppWidget() {
  const waFloatBtn = document.getElementById('waFloatBtn');
  const waPopover = document.getElementById('waPopover');
  const waCloseBtn = document.getElementById('waCloseBtn');

  if (!waFloatBtn || !waPopover) return;

  waFloatBtn.addEventListener('click', () => {
    waPopover.classList.toggle('active');
  });

  if (waCloseBtn) {
    waCloseBtn.addEventListener('click', () => {
      waPopover.classList.remove('active');
    });
  }
}

/* --------------------------------------------------------------------------
   11. ScrollSpy (Highlight active navbar links based on scroll position)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   12. Dynamic Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-100%)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
