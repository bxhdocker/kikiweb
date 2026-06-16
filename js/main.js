// Theme toggle
(function() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', function() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', function() {
        nav.classList.toggle('open');
      });
    }

    // Gallery lightbox
    const galleryItems = document.querySelectorAll('.gallery-item img');
    if (galleryItems.length > 0) {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = '<button class="lightbox-close">&times;</button>';
      document.body.appendChild(lightbox);

      galleryItems.forEach(function(img) {
        img.addEventListener('click', function(e) {
          e.preventDefault();
          const clone = img.cloneNode(true);
          const existing = lightbox.querySelector('img');
          if (existing) existing.remove();
          lightbox.insertBefore(clone, lightbox.firstChild);
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      });

      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
          lightbox.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          lightbox.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  });
})();
