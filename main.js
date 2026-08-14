/* ==========================================================================
   FEBA RAGHU — INTERACTIVE JAVASCRIPT ENGINE
   Custom Mouse Follower, Card Spotlight Glow, 3D Tilt, Scroll Progress Animation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. CUSTOM GLOWING MOUSE FOLLOWERS
  const cursorDot = document.getElementById('custom-cursor');
  const cursorFollower = document.getElementById('cursor-follower');
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  if (window.innerWidth > 1024 && cursorDot && cursorFollower) {
    cursorDot.classList.add('active');
    cursorFollower.classList.add('active');

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth RequestAnimationFrame tracking for outer ring follower
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;

      requestAnimationFrame(animateFollower);
    }
    requestAnimationFrame(animateFollower);

    // Hover Scaling for Interactive Elements
    const interactiveElements = document.querySelectorAll('a, button, .tilt-card, .skill-pill, .lang-item, input');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorFollower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorFollower.classList.remove('hovering');
      });
    });
  }

  // 2. SPOTLIGHT RADIAL GLOW & 3D CARD TILT PERSPECTIVE
  const glowCards = document.querySelectorAll('.glow-card');
  glowCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D Perspective Tilt calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6; // max 6deg
      const rotateY = ((x - centerX) / centerX) * 6;  // max 6deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 3. TYPEWRITER EFFECT IN HERO SECTION
  const typedOutput = document.getElementById('typed-output');
  if (typedOutput) {
    const roles = [
      'Civil CADD Engineer @ ISON Academy',
      'Civil CADD & BIM Trainer',
      'Civil Engineering Professional',
      'AutoCAD & Revit Specialist'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typedOutput.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedOutput.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2200; // Pause at end of text
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400; // Pause before typing next role
      }

      setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
  }

  // 4. STICKY HEADER & SCROLL SPY ACTIVE NAV
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const scrollToTopBtn = document.getElementById('scroll-to-top');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll to Top Button Visibility
    if (scrollToTopBtn) {
      if (window.scrollY > 400) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }

    // Scroll Spy for nav links
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 5. FLOATING SCROLL-TO-TOP BUTTON CLICK
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // 7. ANIMATED PROGRESS BARS & COUNTERS ON SCROLL DOWN
  const progressCards = document.querySelectorAll('.progress-card');
  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const progressBar = card.querySelector('.progress-bar');
        const pctText = card.querySelector('.progress-pct');
        const targetPct = parseInt(card.getAttribute('data-pct') || '90', 10);

        if (progressBar) {
          setTimeout(() => {
            progressBar.style.width = `${targetPct}%`;
          }, 150);
        }

        if (pctText) {
          let currentVal = 0;
          const duration = 1400; // Total animation duration in ms
          const stepTime = Math.max(Math.floor(duration / targetPct), 12);
          const timer = setInterval(() => {
            currentVal++;
            pctText.textContent = `${currentVal}%`;
            if (currentVal >= targetPct) {
              clearInterval(timer);
              pctText.textContent = `${targetPct}%`;
            }
          }, stepTime);
        }

        observer.unobserve(card);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
  });

  progressCards.forEach((card) => progressObserver.observe(card));

  // 8. MOBILE MENU DRAWER TOGGLE
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
});
