// Safe DOMContentLoaded wrapper
(function() {
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function() {
    // Pricing modal handlers
    var bookBtn = document.getElementById('bookNowBtn');
    var modal = document.getElementById('pricingModal');
    var closeBtn = modal ? modal.querySelector('.modal-close') : null;

    function openModal() {
      if (!modal) return;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (bookBtn) {
      bookBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
      });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href').slice(1);
        var target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Mobile nav toggle
    var menuToggle = document.getElementById('menuToggle');
    var primaryNav = document.getElementById('primaryNav');
    function closeMenu() {
      if (!primaryNav) return;
      primaryNav.classList.remove('open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
    function toggleMenu() {
      if (!primaryNav) return;
      var willOpen = !primaryNav.classList.contains('open');
      primaryNav.classList.toggle('open', willOpen);
      if (menuToggle) menuToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    }
    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (primaryNav) primaryNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });
    window.addEventListener('resize', function() {
      if (window.innerWidth > 800) closeMenu();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Pricing tabs (both in page and inside modal)
    function initPricingTabs(root) {
      var container = root || document;
      var groups = container.querySelectorAll('.pricing-groups');
      groups.forEach(function(groupContainer) {
        var tabs = groupContainer.parentElement.querySelectorAll('.pricing-tabs .tab-button');
        var panes = groupContainer.querySelectorAll('.pricing-group');

        function activate(range) {
          panes.forEach(function(pane) {
            pane.classList.toggle('active', pane.getAttribute('data-range') === range);
          });
          tabs.forEach(function(tab) {
            var isActive = tab.getAttribute('data-range') === range;
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
          });
        }

        // default to first tab
        if (tabs.length && panes.length) {
          activate(tabs[0].getAttribute('data-range'));
        }

        tabs.forEach(function(tab) {
          tab.addEventListener('click', function() {
            activate(tab.getAttribute('data-range'));
          });
        });
      });
    }

    initPricingTabs(document);
    if (modal) {
      // ensure tabs initialize when modal opens (content is present already)
      modal.addEventListener('transitionend', function() {
        if (modal.classList.contains('open')) initPricingTabs(modal);
      });
    }


    // Itinerary stepper section


    var steps = [
      {
        title: 'Day 1: Arrival & Colombo City Tour',
        desc: 'Welcome to Sri Lanka. Explore Colombo’s colonial charm, vibrant markets, and seaside promenade.',
        img: 'images/temple.jpg'
      },
      {
        title: 'Day 2: Colombo → Chilaw → Trincomalee',
        desc: 'Visit Munneswaram and Manavari temples in Chilaw, then head to coastal Trincomalee.',
        img: 'images/temple.jpg'
      },
      {
        title: 'Day 3: Trincomalee → Kandy',
        desc: 'Morning by the bay, then travel to Kandy to see the Temple of the Tooth.',
        img: 'images/stupa.jpg'
      },
      {
        title: 'Day 4: Kandy → Nuwara Eliya',
        desc: 'Scenic hill-country drive, tea plantations, and cool-climate vistas.',
        img: 'images/reflection.jpg'
      },
      {
        title: 'Day 5: Nuwara Eliya → Kataragama',
        desc: 'Descend to the south to visit sacred Kataragama, a multi-religious pilgrimage site.',
        img: 'images/temple.jpg'
      },
      {
        title: 'Day 6: Kataragama → Colombo Departure',
        desc: 'Return to Colombo for departure with unforgettable Ramayana memories.',
        img: 'images/hero.jpg'
      }
    ];

    var stepNodes = document.querySelectorAll('.step-node');
    var titleEl = document.getElementById('itineraryTitle');
    var descEl = document.getElementById('itineraryDesc');
    var imgEl = document.getElementById('itineraryImage');
    var prevBtn = document.getElementById('prevStep');
    var nextBtn = document.getElementById('nextStep');
    var current = 0;

    function renderStep(index) {
      if (!titleEl || !descEl || !imgEl) return;
      current = Math.max(0, Math.min(index, steps.length - 1));
      var data = steps[current];
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      imgEl.src = data.img;
      stepNodes.forEach(function(node, i) {
        node.classList.toggle('active', i === current);
        node.setAttribute('aria-current', i === current ? 'step' : 'false');
      });
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === steps.length - 1;
    }

    if (stepNodes.length) {
      stepNodes.forEach(function(node, i) {
        node.addEventListener('click', function() { renderStep(i); });
      });
    }
    if (prevBtn) prevBtn.addEventListener('click', function() { renderStep(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { renderStep(current + 1); });
    renderStep(0);

    
    // Detailed Schedule accordion (toggle one at a time)

    var toggles = document.querySelectorAll('.schedule-toggle');
    var panels = document.querySelectorAll('.schedule-panel');
    function closeAllPanels() {
      panels.forEach(function(panel) {
        panel.style.maxHeight = '0px';
        panel.classList.remove('open');
      });
      toggles.forEach(function(btn) { btn.setAttribute('aria-expanded', 'false'); });
    }
    function openPanel(btn, panel) {
      btn.setAttribute('aria-expanded', 'true');
      panel.classList.add('open');
      // Set a large max-height to allow content to show
      panel.style.maxHeight = '2000px';
    }
    // Initialize all panels as closed
    closeAllPanels();
    
    toggles.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var targetId = btn.getAttribute('aria-controls');
        var panel = document.getElementById(targetId);
        if (!panel) return;
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        closeAllPanels();
        if (!isOpen) openPanel(btn, panel);
      });
    });
  });
})();
