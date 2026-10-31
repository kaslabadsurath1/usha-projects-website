/* Usha Projects - header, hero, counters and search (plain JavaScript) */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PAGES = [["Field of Operation", "about-field-of-operation.html"], ["Photo Gallery", "about-gallery.html"], ["HSE Policy", "about-hse-policy.html"], ["Mission & Vision", "about-mission-vision.html"], ["Partner with Us", "about-partner-with-us.html"], ["Quality Policy", "about-quality-policy.html"], ["Safety Policy", "about-safety-policy.html"], ["Usha Family", "about-usha-family.html"], ["About Company", "about.html"], ["Corporate Conduct", "career-corporate-conduct.html"], ["Employee Conduct", "career-employee-conduct.html"], ["Recruitment Policy", "career-recruitment-policy.html"], ["Recruitment Procedure", "career-recruitment-procedure.html"], ["Current Openings", "career.html"], ["Client Testimonial", "clients-testimonials.html"], ["Our Clients", "clients.html"], ["Contact Us", "contact.html"], ["Home", "index.html"], ["Projects Completed", "projects-completed.html"], ["Project in Progress", "projects-in-progress.html"], ["Projects Management", "projects-management.html"], ["Projects", "projects.html"], ["Core Services", "services-core-services.html"], ["EPC Services", "services-epc.html"], ["Expertise", "services-expertise.html"], ["Industrial", "services-industrial.html"], ["Metals & Minerals", "services-metals-minerals.html"], ["Oil & Gas", "services-oil-gas.html"], ["Power Services", "services-power.html"], ["Water Services", "services-water.html"], ["Usha Services", "services.html"], ["Construction", "we-execute-construction.html"], ["Engineering", "we-execute-engineering.html"], ["Procurement", "we-execute-procurement.html"], ["Quality Service", "we-execute-quality-service.html"], ["We Execute", "we-execute.html"]];

  /* ---- sticky header shadow ---- */
  var header = $("#ixHeader");
  function onScroll() { if (header) header.classList.toggle("stuck", window.scrollY > 90); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile drawer + accordion ---- */
  var nav = $("#ixNav"), burger = $("#ixBurger"), veil = $("#ixVeil");
  function drawer(open) {
    if (!nav || !burger) return;
    nav.classList.toggle("open", open);
    if (veil) veil.classList.toggle("on", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("ix-lock", open);
  }
  if (burger) burger.addEventListener("click", function () { drawer(!nav.classList.contains("open")); });
  if (veil) veil.addEventListener("click", function () { drawer(false); });
  $$(".ix-tg").forEach(function (b) {
    b.addEventListener("click", function () {
      var li = b.closest(".ix-item"), open = !li.classList.contains("open");
      $$(".ix-item.open").forEach(function (o) { if (o !== li) { o.classList.remove("open"); $(".ix-tg", o).setAttribute("aria-expanded", "false"); } });
      li.classList.toggle("open", open);
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 1180) drawer(false); });

  /* ---- search ---- */
  var sBtn = $("#ixSearchBtn"), sBox = $("#ixSearch"), sIn = $("#ixSearchInput"), sList = $("#ixResults");
  function render(q) {
    q = (q || "").toLowerCase().trim();
    var hits = PAGES.filter(function (p) { return !q || p[0].toLowerCase().indexOf(q) > -1 || p[1].toLowerCase().indexOf(q.replace(/\s+/g, "-")) > -1; }).slice(0, 12);
    sList.innerHTML = "";
    if (!hits.length) { var n = document.createElement("li"); n.className = "none"; n.textContent = "No pages found. Try another word."; sList.appendChild(n); return; }
    hits.forEach(function (p) {
      var li = document.createElement("li"), a = document.createElement("a");
      a.href = p[1]; a.textContent = p[0]; li.appendChild(a); sList.appendChild(li);
    });
  }
  function sOpen(open) {
    if (!sBox) return;
    sBox.hidden = !open;
    document.body.classList.toggle("ix-lock", open);
    if (open) { sIn.value = ""; render(""); sIn.focus(); } else if (sBtn) { sBtn.focus(); }
  }
  if (sBtn && sBox) {
    sBtn.addEventListener("click", function () { drawer(false); sOpen(true); });
    $("#ixSearchX").addEventListener("click", function () { sOpen(false); });
    sBox.addEventListener("click", function (e) { if (e.target === sBox) sOpen(false); });
    sIn.addEventListener("input", function () { render(sIn.value); });
    $("#ixSearchForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var a = $("a", sList); if (a) window.location.href = a.getAttribute("href");
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (sBox && !sBox.hidden) sOpen(false);
    if (nav && nav.classList.contains("open")) { drawer(false); burger.focus(); }
  });

  /* ---- hero slider ---- */
  var hero = $(".hx-hero");
  if (hero) {
    var slides = $$(".hx-slide", hero), dots = $$(".hx-dots button", hero), cur = 0, timer = null, paused = false;
    var go = function (n) {
      cur = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("on", i === cur); s.setAttribute("aria-hidden", i === cur ? "false" : "true"); });
      dots.forEach(function (d, i) { d.classList.toggle("on", i === cur); d.setAttribute("aria-current", i === cur ? "true" : "false"); });
    };
    var lazy = $$("img[loading=lazy]", hero); lazy.forEach(function (i) { i.loading = "eager"; });
    $(".hx-arrow.prev", hero).addEventListener("click", function () { go(cur - 1); });
    $(".hx-arrow.next", hero).addEventListener("click", function () { go(cur + 1); });
    dots.forEach(function (d, i) { d.addEventListener("click", function () { go(i); }); });
    hero.addEventListener("mouseenter", function () { paused = true; });
    hero.addEventListener("mouseleave", function () { paused = false; });
    hero.addEventListener("focusin", function () { paused = true; });
    hero.addEventListener("focusout", function () { paused = false; });
    if (!still) timer = setInterval(function () { if (!paused && !document.hidden) go(cur + 1); }, 7000);
  }

  /* ---- reveal + counters ---- */
  function countUp(el) {
    var to = parseInt(el.getAttribute("data-to"), 10) || 0;
    if (still) { el.textContent = to; return; }
    var t0 = null, dur = 1600;
    (function tick(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }
  var stats = $("#hxStats");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.classList.add("in");
        $$("[data-to]", x.target).forEach(countUp);
        io.unobserve(x.target);
      });
    }, { threshold: 0.18 });
    $$(".hx-rv").forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 90 + "ms"; io.observe(el); });
    if (stats) io.observe(stats);
  } else {
    $$(".hx-rv").forEach(function (el) { el.classList.add("in"); });
    $$("[data-to]").forEach(function (el) { el.textContent = el.getAttribute("data-to"); });
  }

  /* ---- prefill contact form email from footer enquiry box ---- */
  try {
    var m = /[?&]email=([^&]+)/.exec(window.location.search);
    var f = $("form.form input[name=email], form.form input[type=email]");
    if (m && f && !f.value) f.value = decodeURIComponent(m[1].replace(/\+/g, " "));
  } catch (e) { /* ignore */ }
})();
