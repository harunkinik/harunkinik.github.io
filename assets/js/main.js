/* ==========================================================================
   Op. Dr. Abdullah Harun Kınık — paylaşılan site davranışları.
   Bağımlılıksız, sade JavaScript (build adımı gerektirmez).
   ========================================================================== */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Tema (koyu/açık mod) ---------- */
  var themeToggle = document.querySelector("[data-theme-toggle]");
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("hk-theme", theme); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#181A18" : "#FAFAF7");
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------- Scroll progress çubuğu ---------- */
  var progress = document.querySelector(".scroll-progress");
  function updateProgress() {
    if (!progress) return;
    var h = document.documentElement;
    var scrollTop = h.scrollTop || document.body.scrollTop;
    var height = h.scrollHeight - h.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    progress.style.width = pct + "%";
  }

  /* ---------- Navbar kayma efekti ---------- */
  var navbar = document.querySelector(".navbar");
  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 24) navbar.classList.add("is-scrolled");
    else navbar.classList.remove("is-scrolled");
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  updateProgress();
  updateNavbar();

  /* ---------- Mobil tam ekran menü ---------- */
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var menuClose = document.querySelector("[data-menu-close]");

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("is-open");
    document.body.classList.add("menu-open");
    menuToggle && menuToggle.setAttribute("aria-expanded", "true");
    var firstLink = mobileMenu.querySelector("a");
    if (firstLink) firstLink.focus();
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle && menuToggle.setAttribute("aria-expanded", "false");
    menuToggle && menuToggle.focus();
  }
  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) closeMenu();
    });
  }

  /* ---------- Aktif menü linki ---------- */
  var here = location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
  document.querySelectorAll("[data-nav-link]").forEach(function (link) {
    var target = link.getAttribute("href");
    if (!target) return;
    var norm = target.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
    if (norm === here || (norm !== "/" && here.indexOf(norm) === 0)) {
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Scroll ile görünür olma (reveal) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Sayaçlar (viewport'a girince bir kez) ---------- */
  var counters = document.querySelectorAll("[data-counter]");
  if (counters.length && "IntersectionObserver" in window) {
    var counterIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-counter"), 10) || 0;
        counterIo.unobserve(el);
        if (prefersReducedMotion) { el.textContent = target; return; }
        var start = 0;
        var duration = 1100;
        var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var p = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(start + (target - start) * eased);
          if (p < 1) window.requestAnimationFrame(step);
          else el.textContent = target;
        }
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterIo.observe(el); });
  }

  /* ---------- Filtre çipleri (yayınlar / medya / blog) ---------- */
  function initFilterGroup(groupSelector, itemSelector) {
    var group = document.querySelector(groupSelector);
    if (!group) return;
    var items = document.querySelectorAll(itemSelector);
    group.querySelectorAll("[data-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        group.querySelectorAll("[data-filter]").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        var value = chip.getAttribute("data-filter");
        var visibleCount = 0;
        items.forEach(function (item) {
          var cats = (item.getAttribute("data-category") || "").split(",");
          var show = value === "all" || cats.indexOf(value) !== -1;
          item.style.display = show ? "" : "none";
          if (show) visibleCount++;
        });
        var emptyMsg = document.querySelector(groupSelector + " ~ .empty-state, [data-empty-for='" + groupSelector.replace(/[\[\]"'.]/g, "") + "']");
        var emptyState = document.querySelector("[data-filter-empty]");
        if (emptyState) emptyState.style.display = visibleCount === 0 ? "block" : "none";
      });
    });
  }
  initFilterGroup("[data-filter-group='publications']", "[data-pub-item]");
  initFilterGroup("[data-filter-group='media']", "[data-media-item]");
  initFilterGroup("[data-filter-group='blog']", "[data-blog-item]");

  /* ---------- Yayın özet aç/kapa ---------- */
  document.querySelectorAll("[data-pub-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".pub-card");
      if (!card) return;
      var isOpen = card.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  /* ---------- Blog arama ---------- */
  var blogSearch = document.querySelector("[data-blog-search]");
  if (blogSearch) {
    blogSearch.addEventListener("input", function () {
      var q = blogSearch.value.trim().toLocaleLowerCase("tr");
      var items = document.querySelectorAll("[data-blog-item]");
      var visibleCount = 0;
      items.forEach(function (item) {
        var text = (item.getAttribute("data-search") || "").toLocaleLowerCase("tr");
        var show = q === "" || text.indexOf(q) !== -1;
        item.style.display = show ? "" : "none";
        if (show) visibleCount++;
      });
      var emptyState = document.querySelector("[data-filter-empty]");
      if (emptyState) emptyState.style.display = visibleCount === 0 ? "block" : "none";
    });
  }

  /* ---------- Lightbox (medya galerisi) ---------- */
  var lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector("figcaption");
    var galleryItems = Array.prototype.slice.call(document.querySelectorAll("[data-gallery-full]"));
    var currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      var item = galleryItems[currentIndex];
      if (!item) return;
      lbImg.src = item.getAttribute("data-gallery-full");
      lbImg.alt = item.getAttribute("data-gallery-alt") || "";
      lbCaption.textContent = item.getAttribute("data-gallery-caption") || "";
      lightbox.classList.add("is-open");
      document.body.classList.add("menu-open");
      lightbox.querySelector(".lightbox-close").focus();
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }
    function showRelative(delta) {
      currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
      openLightbox(currentIndex);
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener("click", function () { openLightbox(index); });
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(index); }
      });
    });

    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", function () { showRelative(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { showRelative(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showRelative(1);
      if (e.key === "ArrowLeft") showRelative(-1);
    });
  }

  /* ---------- İletişim formu ---------- */
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    var endpoint = (window.SITE_CONFIG && window.SITE_CONFIG.formspreeEndpoint) || "";
    var isConfigured = endpoint && endpoint.indexOf("YOUR_FORM_ID") === -1;
    var submitBtn = contactForm.querySelector("[type='submit']");
    var devNote = contactForm.querySelector("[data-form-dev-note]");
    var successBox = contactForm.querySelector("[data-form-success]");

    if (!isConfigured) {
      if (submitBtn) submitBtn.setAttribute("disabled", "disabled");
      if (devNote) devNote.style.display = "block";
    }

    function validateField(field) {
      var wrap = field.closest(".form-field");
      if (!wrap) return true;
      var valid = field.checkValidity();
      wrap.classList.toggle("has-error", !valid);
      return valid;
    }

    contactForm.querySelectorAll("input[required], textarea[required]").forEach(function (field) {
      field.addEventListener("blur", function () { validateField(field); });
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!isConfigured) return;

      var valid = true;
      contactForm.querySelectorAll("input[required], textarea[required]").forEach(function (field) {
        if (!validateField(field)) valid = false;
      });
      var consent = contactForm.querySelector("#kvkk-consent");
      if (consent && !consent.checked) {
        valid = false;
        var consentWrap = consent.closest(".checkbox-field");
        if (consentWrap) consentWrap.classList.add("has-error");
      }
      if (!valid) return;

      if (submitBtn) { submitBtn.setAttribute("disabled", "disabled"); submitBtn.textContent = "Gönderiliyor…"; }

      fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(contactForm)
      }).then(function (response) {
        if (response.ok) {
          contactForm.reset();
          if (successBox) successBox.classList.add("is-visible");
        } else {
          alert("Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin ya da doğrudan e-posta gönderin.");
        }
      }).catch(function () {
        alert("Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin ya da doğrudan e-posta gönderin.");
      }).finally(function () {
        if (submitBtn) { submitBtn.removeAttribute("disabled"); submitBtn.textContent = "Mesajı Gönder"; }
      });
    });
  }

  /* ---------- İçindekiler (TOC) scroll-spy ---------- */
  var tocLinks = document.querySelectorAll("[data-toc] a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var headingMap = {};
    tocLinks.forEach(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      var heading = document.getElementById(id);
      if (heading) headingMap[id] = link;
    });
    var tocIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = headingMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(headingMap).forEach(function (id) { tocIo.observe(document.getElementById(id)); });
  }

  /* ---------- Yıl damgası (footer) ---------- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
