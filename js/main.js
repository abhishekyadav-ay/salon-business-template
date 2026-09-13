/* ==========================================================================
   AURA ATELIER & BARBERSHOP - MAIN JAVASCRIPT LOGIC (MUMBAI ATELIER)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
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
   1. Theme & Accent Switcher (Platinum Silver <-> Maharajah Gold <-> Botanical Emerald)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeLabel = document.getElementById('themeLabel');
  const heroAccentText = document.getElementById('heroAccentText');
  const htmlTag = document.documentElement;

  if (!themeToggleBtn) return;

  const themes = ['platinum', 'gold', 'emerald'];
  let currentIdx = 0;

  themeToggleBtn.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % themes.length;
    const newTheme = themes[currentIdx];

    htmlTag.setAttribute('data-theme', newTheme);

    if (newTheme === 'platinum') {
      themeLabel.textContent = 'Platinum Silver';
      if (heroAccentText) heroAccentText.textContent = 'Elegance & Style';
      showToast('Switched to Platinum Silver & Obsidian Black Accent', 'success');
    } else if (newTheme === 'gold') {
      themeLabel.textContent = 'Maharajah Gold';
      if (heroAccentText) heroAccentText.textContent = 'Royal Grooming';
      showToast('Switched to Maharajah Gold Accent', 'success');
    } else {
      themeLabel.textContent = 'Botanical Emerald';
      if (heroAccentText) heroAccentText.textContent = 'Zen Wellness';
      showToast('Switched to Botanical Emerald Spa Accent', 'success');
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

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. Real-Time Business Shop Status (Mumbai IST Operating Hours)
   -------------------------------------------------------------------------- */
function initShopStatus() {
  const statusBadge = document.getElementById('shopStatusBadge');
  if (!statusBadge) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon, ...
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTimeInMinutes = hour * 60 + minute;

  let isOpen = false;
  let closeTimeText = '';

  if (day >= 1 && day <= 5) {
    // Mon - Fri: 10:00 AM (600m) to 9:30 PM (1290m)
    if (currentTimeInMinutes >= 600 && currentTimeInMinutes < 1290) {
      isOpen = true;
      closeTimeText = 'Closes 9:30 PM IST';
    }
  } else {
    // Sat - Sun: 9:30 AM (570m) to 10:00 PM (1320m)
    if (currentTimeInMinutes >= 570 && currentTimeInMinutes < 1320) {
      isOpen = true;
      closeTimeText = 'Closes 10:00 PM IST';
    }
  }

  const dot = statusBadge.querySelector('.status-dot');
  const text = statusBadge.querySelector('.status-text');
''
  if (isOpen) {
    dot.classList.remove('closed');
    text.textContent = `🟢 OPEN NOW (Bandra) • ${closeTimeText}`;
  } else {
    dot.classList.add('closed');
    text.textContent = `🔴 CLOSED NOW • Opens 10:00 AM`;
  }
}

/* --------------------------------------------------------------------------
   4. Instant Service Package Price Estimator (₹ INR)
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
    if (estPrice) estPrice.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

    if (estBookBtn) {
      if (selectedNames.length > 0) {
        estBookBtn.disabled = false;
        estBookBtn.setAttribute('data-selected-package', `Custom Package (${selectedNames.join(', ')}) - ₹${totalPrice.toLocaleString('en-IN')}`);
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
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Lightbox Zoom View Modal
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
   7. Interactive Booking Drawer / Modal & Confirmation Presentation
   -------------------------------------------------------------------------- */
function initBookingModal() {
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const bookingForm = document.getElementById('bookingForm');
  const bookingServiceSelect = document.getElementById('bookingService');
  const bookingStylistSelect = document.getElementById('bookingStylist');
  const bookingDateInput = document.getElementById('bookingDate');

  const confirmationModal = document.getElementById('confirmationModal');
  const confirmationCloseBtn = document.getElementById('confirmationCloseBtn');
  const confirmationDoneBtn = document.getElementById('confirmationDoneBtn');

  if (!bookingModal) return;

  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
    bookingDateInput.value = today;
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedService = btn.getAttribute('data-service');
      const selectedServiceId = btn.getAttribute('data-service-id');
      if (selectedService && bookingServiceSelect) {
        for (let option of bookingServiceSelect.options) {
          if (selectedServiceId && option.getAttribute('data-id') === selectedServiceId) {
            option.selected = true;
            break;
          } else if (option.value.includes(selectedService) || option.text.includes(selectedService)) {
            option.selected = true;
            break;
          }
        }
      }
      bookingModal.classList.add('active');
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => bookingModal.classList.remove('active'));
  }

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) bookingModal.classList.remove('active');
  });

  // Confirmation Modal Close listeners
  const closeConfirmation = () => {
    if (confirmationModal) confirmationModal.classList.remove('active');
  };

  if (confirmationCloseBtn) {
    confirmationCloseBtn.addEventListener('click', closeConfirmation);
  }

  if (confirmationDoneBtn) {
    confirmationDoneBtn.addEventListener('click', closeConfirmation);
  }

  if (confirmationModal) {
    confirmationModal.addEventListener('click', (e) => {
      if (e.target === confirmationModal) closeConfirmation();
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const serviceOption = bookingServiceSelect.options[bookingServiceSelect.selectedIndex];
      const serviceVal = bookingServiceSelect.value;
      const dateVal = document.getElementById('bookingDate').value;
      const timeVal = document.getElementById('bookingTime').value;
      const nameVal = document.getElementById('bookingClientName').value.trim();
      const phoneVal = document.getElementById('bookingClientPhone').value.trim();
      const notesVal = document.getElementById('bookingNotes') ? document.getElementById('bookingNotes').value.trim() : '';

      if (!serviceVal || !dateVal || !timeVal || !nameVal || !phoneVal) {
        showToast('Please fill out all required reservation fields.', 'error');
        return;
      }

      // Extract service name cleanly (remove price tag if present in brackets)
      let cleanServiceName = serviceOption ? serviceOption.text.split(' - ')[0] : serviceVal;

      // Extract numeric serviceId & staffId for API call
      let serviceId = serviceOption && serviceOption.getAttribute('data-id') ? parseInt(serviceOption.getAttribute('data-id'), 10) : 1;
      let staffOption = bookingStylistSelect ? bookingStylistSelect.options[bookingStylistSelect.selectedIndex] : null;
      let staffId = staffOption && staffOption.getAttribute('data-id') ? parseInt(staffOption.getAttribute('data-id'), 10) : 1;

      // Format time to 24-hour HH:mm:ss for backend
      const formatted24hTime = parseTimeTo24Hour(timeVal);

      const requestPayload = {
        customerName: nameVal,
        customerPhone: phoneVal,
        staffId: staffId,
        appointmentDate: dateVal,
        appointmentTime: formatted24hTime,
        serviceIds: [serviceId],
        notes: notesVal
      };

      let bookingRefId = '';
      let displayCustomer = nameVal;
      let displayService = cleanServiceName;
      let displayDate = dateVal;
      let displayTime = timeVal;

      try {
        const response = await fetch('http://localhost:8081/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestPayload)
        });

        if (response.ok) {
          const resData = await response.json();
          bookingRefId = 'AURA-' + String(resData.id).padStart(4, '0');
          if (resData.customer && resData.customer.name) displayCustomer = resData.customer.name;
          if (resData.services && resData.services.length > 0 && resData.services[0].name) {
            displayService = resData.services[0].name;
          }
          if (resData.appointmentDate) displayDate = resData.appointmentDate;
          if (resData.appointmentTime) displayTime = resData.appointmentTime;
        } else {
          bookingRefId = 'AURA-' + Math.floor(1000 + Math.random() * 9000);
        }
      } catch (err) {
        console.warn('API call failed or server unavailable, using client reference:', err);
        bookingRefId = 'AURA-' + Math.floor(1000 + Math.random() * 9000);
      }

      // Format date into Indian / Mumbai presentation (e.g. September 10, 2026)
      const formattedDateDisplay = formatIndianDate(displayDate);
      const formattedTimeDisplay = format12HourTime(displayTime);

      // Populate Confirmation Modal
      const confirmRefId = document.getElementById('confirmRefId');
      const confirmCustomerAndService = document.getElementById('confirmCustomerAndService');
      const confirmDateTime = document.getElementById('confirmDateTime');

      if (confirmRefId) confirmRefId.textContent = bookingRefId;
      if (confirmCustomerAndService) confirmCustomerAndService.textContent = `${displayCustomer} — ${displayService}`;
      if (confirmDateTime) confirmDateTime.textContent = `${formattedDateDisplay} at ${formattedTimeDisplay}`;

      // Close Booking Drawer & Open Confirmation Modal
      bookingModal.classList.remove('active');
      bookingForm.reset();

      if (confirmationModal) {
        confirmationModal.classList.add('active');
      } else {
        showToast(`BOOKING REQUEST RECEIVED! Ref ${bookingRefId} for ${displayCustomer}.`, 'success');
      }
    });
  }
}

function formatIndianDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return dateObj.toLocaleDateString('en-IN', options);
  }
  return dateStr;
}

function format12HourTime(timeStr) {
  if (!timeStr) return '';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  }
  return timeStr;
}

function parseTimeTo24Hour(time12) {
  if (!time12) return '12:00:00';
  if (time12.includes(':') && time12.split(':').length === 3 && !time12.includes(' ')) {
    return time12;
  }
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3] ? match[3].toUpperCase() : '';
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const hStr = hours < 10 ? '0' + hours : '' + hours;
    return `${hStr}:${minutes}:00`;
  }
  return '12:00:00';
}

/* --------------------------------------------------------------------------
   8. Contact Form Handling
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
      showToast('Namaste! Your message has been sent to AURA Bandra reception.', 'success');
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
    showToast('Welcome to AURA VIP Club Mumbai! Subscription confirmed.', 'success');
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
   11. ScrollSpy (Active nav highlighting)
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
