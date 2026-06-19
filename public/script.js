(function () {
  'use strict';

  /* Evita duplicação caso o script.js seja carregado duas vezes no HTML */
  if (window.__RANCHO_TUCUNARE_SCRIPT_LOADED__) return;
  window.__RANCHO_TUCUNARE_SCRIPT_LOADED__ = true;

  document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initFormHelpers();
    initLiquidGlass();
    initBackToTop();
    initSmoothNavigation();
    initActiveMenuOnScroll();
    initSectionReveal();
    initFAQ();
    initGalleryCarousel();
    initRippleEffect();
    initAuthTabs();
    initParallax();
  });

  function initPreloader() {
    var preloader = document.getElementById('preloader');

    if (!preloader) return;

    function hidePreloader() {
      setTimeout(function () {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        preloader.style.pointerEvents = 'none';
      }, 800);
    }

    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader, { once: true });
    }
  }

  function initFormHelpers() {
    var birthDate = document.getElementById('data-nascimento');
    var year = document.getElementById('year');

    if (birthDate) {
      birthDate.max = new Date().toISOString().split('T')[0];
    }

    if (year) {
      year.textContent = new Date().getFullYear();
    }
  }

  function initLiquidGlass() {
    var glassSelectors = [
      '.liquid-glass',
      '.glass-box',
      '.gallery-glass-container',
      '.about-glass-container',
      '.reserva-box',
      '.box-glass',
      '.faq-section',
      '.card',
      '.reviews-box',
      '.auth-box',
      '.testimonials-glass'
    ].join(',');

    var glassElements = Array.prototype.slice.call(
      document.querySelectorAll(glassSelectors)
    );

    if (!glassElements.length) return;

    glassElements.forEach(function (element) {
      element.classList.add('liquid-glass');
    });

    var ticking = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function updateGlass() {
      var viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      glassElements.forEach(function (element) {
        var rect = element.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var progress = clamp(center / viewportHeight, 0, 1);
        var distanceFromCenter = Math.abs(progress - 0.5) * 2;

        var glassX = 50 + (progress - 0.5) * 34;
        var glassY = 8 + progress * 84;
        var opacity = 0.22 + (1 - distanceFromCenter) * 0.28;
        var shift = (progress - 0.5) * 22;

        element.style.setProperty('--glass-x', glassX.toFixed(2) + '%');
        element.style.setProperty('--glass-y', glassY.toFixed(2) + '%');
        element.style.setProperty('--reflect-x', glassX.toFixed(2) + '%');
        element.style.setProperty('--reflect-y', glassY.toFixed(2) + '%');
        element.style.setProperty('--glass-opacity', opacity.toFixed(2));
        element.style.setProperty('--glass-scroll', shift.toFixed(2));
        element.style.setProperty('--glass-shift', shift.toFixed(2) + 'px');
      });

      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        window.requestAnimationFrame(updateGlass);
        ticking = true;
      }
    }

    updateGlass();

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  function initBackToTop() {
    var button = document.getElementById('back-to-top');

    if (!button) return;

    function toggleButton() {
      if (window.scrollY > 300) {
        button.classList.add('show');
        button.style.opacity = '1';
        button.style.visibility = 'visible';
        button.style.pointerEvents = 'auto';
      } else {
        button.classList.remove('show');
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
        button.style.pointerEvents = 'none';
      }
    }

    button.addEventListener('click', function (event) {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    toggleButton();

    window.addEventListener('scroll', toggleButton, { passive: true });
  }

  function initSmoothNavigation() {
    var links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener('click', function (event) {
        var href = link.getAttribute('href');

        if (!href || href === '#') return;

        var target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }

  function initActiveMenuOnScroll() {
    var navLinks = Array.prototype.slice.call(
      document.querySelectorAll('.nav a[href^="#"]')
    );

    var sections = navLinks
      .map(function (link) {
        var href = link.getAttribute('href');
        var section = href ? document.querySelector(href) : null;

        return section
          ? {
              link: link,
              section: section
            }
          : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    function updateActiveLink() {
      var currentId = '';
      var offset = 120;

      sections.forEach(function (item) {
        var rect = item.section.getBoundingClientRect();

        if (rect.top <= offset && rect.bottom >= offset) {
          currentId = item.section.id;
        }
      });

      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        var isActive = href === '#' + currentId;

        link.classList.toggle('active', isActive);
      });
    }

    updateActiveLink();

    window.addEventListener('scroll', updateActiveLink, { passive: true });
  }

  function initSectionReveal() {
    var sections = document.querySelectorAll(
      'section, .word-image-container, [data-parallax]'
    );

    if (!sections.length) return;

    if (!('IntersectionObserver' in window)) {
      sections.forEach(function (section) {
        section.classList.add('visible');
      });

      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    sections.forEach(function (section, index) {
      if (section.tagName && section.tagName.toLowerCase() === 'section') {
        if (
          !section.classList.contains('from-left') &&
          !section.classList.contains('from-right')
        ) {
          section.classList.add(index % 2 === 0 ? 'from-left' : 'from-right');
        }
      }

      observer.observe(section);
    });
  }

  function initFAQ() {
    var questions = document.querySelectorAll('.faq-question');

    if (!questions.length) return;

    function closeItem(item) {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');

      item.classList.remove('active');

      if (question) {
        question.setAttribute('aria-expanded', 'false');
      }

      if (answer) {
        if (answer.style.maxHeight === 'none') {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.offsetHeight;
        }

        answer.style.maxHeight = '0px';
        answer.style.opacity = '0';
      }
    }

    function openItem(item) {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');

      item.classList.add('active');

      if (question) {
        question.setAttribute('aria-expanded', 'true');
      }

      if (answer) {
        answer.style.display = 'block';
        answer.style.opacity = '1';
        answer.style.maxHeight = answer.scrollHeight + 80 + 'px';
      }
    }

    questions.forEach(function (question) {
      question.setAttribute('type', 'button');
      question.setAttribute('aria-expanded', 'false');

      var item = question.closest('.faq-item');
      var answer = item ? item.querySelector('.faq-answer') : null;

      if (answer) {
        answer.style.display = 'block';
        answer.style.maxHeight = '0px';
        answer.style.opacity = '0';
        answer.style.overflow = 'hidden';
      }

      question.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var currentItem = question.closest('.faq-item');

        if (!currentItem) return;

        var isOpen = currentItem.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(function (itemToClose) {
          if (itemToClose !== currentItem) {
            closeItem(itemToClose);
          }
        });

        if (isOpen) {
          closeItem(currentItem);
        } else {
          openItem(currentItem);
        }
      });
    });
  }

function initGalleryCarousel() {
  var carousel = document.getElementById('carousel');
  var carouselImage = document.getElementById('carousel-img');
  var closeButton = carousel ? carousel.querySelector('.close') : null;
  var prevButton = document.getElementById('carousel-prev');
  var nextButton = document.getElementById('carousel-next');

  if (!carousel || !carouselImage) return;

  var galleryImages = Array.prototype.slice.call(
    document.querySelectorAll('#gallery .grid-gallery img')
  );

  var roomImages = Array.prototype.slice.call(
    document.querySelectorAll('#rooms .room-grid img')
  );

  var activeImages = [];
  var currentIndex = 0;

  function showImage(index) {
    if (!activeImages.length) return;

    if (index < 0) {
      currentIndex = activeImages.length - 1;
    } else if (index >= activeImages.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    var selectedImage = activeImages[currentIndex];

    carouselImage.style.opacity = '0';

    setTimeout(function () {
      carouselImage.src = selectedImage.src;
      carouselImage.alt = selectedImage.alt || 'Imagem ampliada';
      carouselImage.style.opacity = '1';
    }, 120);
  }

  function openCarousel(imagesGroup, index) {
    activeImages = imagesGroup;
    currentIndex = index;

    showImage(currentIndex);

    carousel.style.display = 'flex';
    carousel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCarousel() {
    carousel.style.display = 'none';
    carousel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeImages = [];
    currentIndex = 0;
  }

  function showPrevious() {
    showImage(currentIndex - 1);
  }

  function showNext() {
    showImage(currentIndex + 1);
  }

  galleryImages.forEach(function (image, index) {
    image.style.cursor = 'pointer';

    image.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      openCarousel(galleryImages, index);
    });
  });

  roomImages.forEach(function (image, index) {
    image.style.cursor = 'pointer';

    image.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      openCarousel(roomImages, index);
    });
  });

  if (prevButton) {
    prevButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      showPrevious();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      showNext();
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeCarousel();
    });
  }

  carousel.addEventListener('click', function (event) {
    if (event.target === carousel) {
      closeCarousel();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (carousel.style.display !== 'flex') return;

    if (event.key === 'Escape') {
      closeCarousel();
    }

    if (event.key === 'ArrowLeft') {
      showPrevious();
    }

    if (event.key === 'ArrowRight') {
      showNext();
    }
  });
}

  function initRippleEffect() {
    var container = document.getElementById('ripple-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'ripple-container';
      document.body.appendChild(container);
    }

    document.addEventListener('click', function (event) {
      var target = event.target;

      if (
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('#carousel') ||
        target.closest('.lightbox')
      ) {
        return;
      }

      var ripple = document.createElement('span');

      ripple.className = 'ripple';
      ripple.style.left = event.clientX + 'px';
      ripple.style.top = event.clientY + 'px';

      container.appendChild(ripple);

      setTimeout(function () {
        ripple.remove();
      }, 1000);
    });
  }

  function initAuthTabs() {
    var tabs = document.querySelectorAll('.auth-tab');
    var contents = document.querySelectorAll('.auth-content');

    if (!tabs.length || !contents.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetId =
          tab.getAttribute('data-tab') || tab.getAttribute('data-target');

        tabs.forEach(function (item) {
          item.classList.remove('active');
        });

        contents.forEach(function (content) {
          content.classList.remove('active');
        });

        tab.classList.add('active');

        if (targetId) {
          var target =
            document.getElementById(targetId) ||
            document.querySelector(targetId);

          if (target) {
            target.classList.add('active');
          }
        }
      });
    });
  }

  function initParallax() {
    var parallaxItems = document.querySelectorAll('[data-parallax]');

    if (!parallaxItems.length) return;

    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY || window.pageYOffset;

      parallaxItems.forEach(function (item) {
        var speed = parseFloat(item.getAttribute('data-parallax')) || 0.12;
        var movement = scrollY * speed;

        item.style.transform = 'translateY(' + movement.toFixed(2) + 'px)';
      });

      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    updateParallax();

    window.addEventListener('scroll', requestUpdate, { passive: true });
  }
})();