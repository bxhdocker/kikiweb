// Theme toggle
(function() {
  var saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      });
    }

    // Mobile menu
    var menuToggle = document.getElementById('menuToggle');
    var nav = document.querySelector('.nav');
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', function() {
        nav.classList.toggle('open');
      });
    }

    // Gallery lightbox
    var galleryItems = document.querySelectorAll('.gallery-item img');
    if (galleryItems.length > 0) {
      var lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = '<button class="lightbox-close">&times;</button>';
      document.body.appendChild(lightbox);

      galleryItems.forEach(function(img) {
        img.addEventListener('click', function(e) {
          e.preventDefault();
          var clone = img.cloneNode(true);
          var existing = lightbox.querySelector('img');
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

    // Reading progress bar
    var progressBar = document.getElementById('readingProgress');
    if (progressBar) {
      window.addEventListener('scroll', function() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
        progressBar.style.width = pct + '%';
      }, { passive: true });
    }

    // Timeline bounce-in via IntersectionObserver
    var timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
          }
        });
      }, { threshold: 0.15 });
      timelineItems.forEach(function(item) { observer.observe(item); });
    }
  });
})();
