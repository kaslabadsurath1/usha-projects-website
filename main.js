/* Usha Projects website - plain JavaScript (no libraries) */
(function () {
  "use strict";

  /* ---- Settings ---------------------------------------------------------
     To make the contact forms send real e-mails, create a free access key at
     https://web3forms.com (enter the inbox that should receive enquiries) and
     paste it between the quotes below. Leave empty to keep the fallback that
     opens the visitor's e-mail app.                                          */
  var FORM_KEY = "";
  var CONTACT_EMAIL = "corporate@ushaprojects.com";
  var CONTACT_PHONE = "0674-2725477";
  /* ---------------------------------------------------------------------- */

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Header: sticky shadow, mobile menu, dropdowns ---- */
  var header = $(".site-header");
  var nav = $("#main-nav");
  var burger = $(".burger");
  function closeMenus() {
    $$(".has-sub.open").forEach(function (li) { setSub(li, false); });
  }
  function setSub(li, open) {
    li.classList.toggle("open", open);
    var b = $(".sub-toggle", li), label = $(".nav-row a", li).textContent.trim();
    b.setAttribute("aria-expanded", open ? "true" : "false");
    b.setAttribute("aria-label", (open ? "Hide " : "Show ") + label + " pages");
  }
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  $$(".sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.closest(".has-sub"), open = !li.classList.contains("open");
      closeMenus();
      setSub(li, open);
    });
  });
  document.addEventListener("pointerdown", function (e) {
    if (header && !header.contains(e.target)) closeMenus();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMenus();
      if (nav && nav.classList.contains("open")) { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    }
  });

  /* ---- Scroll: sticky header shadow + back-to-top ---- */
  var toTop = $(".to-top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("stuck", y > 40);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
  });

  /* ---- Reveal on scroll + counters ---- */
  function count(el) {
    var to = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (still) { el.textContent = to; return; }
    var t0 = performance.now(), dur = 1400;
    (function tick(t) {
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  function show(el) {
    el.classList.add("in");
    $$("[data-count]", el).forEach(count);
  }
  var reveals = $$(".reveal");
  if (still || !("IntersectionObserver" in window)) {
    reveals.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Generic auto-advancing carousel helper ---- */
  function cycle(count_, ms, onChange, hoverEl) {
    var i = 0, paused = false, timer = null;
    function go(n) { i = (n + count_) % count_; onChange(i); }
    function start() {
      if (timer || still || count_ < 2) return;
      timer = setInterval(function () { if (!paused) go(i + 1); }, ms);
    }
    if (hoverEl) {
      hoverEl.addEventListener("mouseenter", function () { paused = true; });
      hoverEl.addEventListener("mouseleave", function () { paused = false; });
    }
    start();
    return { go: go, next: function () { go(i + 1); }, prev: function () { go(i - 1); } };
  }

  /* ---- Home hero slider ---- */
  var hero = $(".hero");
  if (hero) {
    var slides = $$(".slide", hero), thumbs = $$(".thumbs button", hero);
    var heroCtl = cycle(slides.length, 6500, function (i) {
      slides.forEach(function (s, k) { s.classList.toggle("on", k === i); s.setAttribute("aria-hidden", k === i ? "false" : "true"); });
      thumbs.forEach(function (t, k) { t.classList.toggle("on", k === i); t.setAttribute("aria-selected", k === i ? "true" : "false"); });
    }, hero);
    $(".arrow.prev", hero).addEventListener("click", heroCtl.prev);
    $(".arrow.next", hero).addEventListener("click", heroCtl.next);
    thumbs.forEach(function (t, k) { t.addEventListener("click", function () { heroCtl.go(k); }); });
  }

  /* ---- About image showcase ---- */
  var show_ = $(".about-show");
  if (show_) {
    var imgs = $$(".about-imgs img", show_);
    cycle(imgs.length, 4500, function (i) {
      imgs.forEach(function (im, k) { im.classList.toggle("on", k === i); });
    }, show_);
  }

  /* ---- News slider ---- */
  var news = $(".news-slider");
  if (news) {
    var items = $$(".news-item", news), dots = $$(".dots button", news);
    var newsCtl = cycle(items.length, 7000, function (i) {
      items.forEach(function (it, k) { it.hidden = k !== i; });
      dots.forEach(function (d, k) { d.classList.toggle("on", k === i); });
    }, news);
    dots.forEach(function (d, k) { d.addEventListener("click", function () { newsCtl.go(k); }); });
  }

  /* ---- Testimonials: slider arrows + read more ---- */
  var ts = $(".tslider");
  if (ts) {
    var wrap = ts.parentNode;
    var move = function (d) {
      var card = ts.firstElementChild;
      ts.scrollBy({ left: d * (card.getBoundingClientRect().width + 24), behavior: still ? "auto" : "smooth" });
    };
    var arrows = $$(".arrow-sq", wrap);
    if (arrows[0]) arrows[0].addEventListener("click", function () { move(-1); });
    if (arrows[1]) arrows[1].addEventListener("click", function () { move(1); });
  }
  $$(".quote .more").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var bq = $("blockquote", btn.closest(".quote"));
      var open = bq.classList.toggle("clamp") === false;
      btn.textContent = open ? "Show less" : "Read more";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---- Gallery lightbox ---- */
  var thumbsG = $$(".gal-item");
  if (thumbsG.length) {
    var box = null, cur = 0, opener = null;
    var render = function () {
      var t = thumbsG[cur];
      $("img", box).src = t.getAttribute("data-full");
      $("img", box).alt = t.getAttribute("data-caption");
      $("figcaption", box).innerHTML = "";
      $("figcaption", box).appendChild(document.createTextNode(t.getAttribute("data-caption") + " "));
      var sp = document.createElement("span"); sp.textContent = (cur + 1) + " / " + thumbsG.length;
      $("figcaption", box).appendChild(sp);
      box.setAttribute("aria-label", t.getAttribute("data-caption"));
    };
    var step = function (d) { cur = (cur + d + thumbsG.length) % thumbsG.length; render(); };
    var close = function () {
      if (!box) return;
      document.removeEventListener("keydown", keys);
      document.body.style.overflow = "";
      box.remove(); box = null;
      if (opener) opener.focus();
    };
    var keys = function (e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    var open = function (k, from) {
      cur = k; opener = from;
      box = document.createElement("div");
      box.className = "lightbox"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
      box.innerHTML = '<button class="lb-close" aria-label="Close">×</button>' +
        '<button class="lb-nav prev" aria-label="Previous photo">‹</button>' +
        '<figure><img alt=""><figcaption></figcaption></figure>' +
        '<button class="lb-nav next" aria-label="Next photo">›</button>';
      box.addEventListener("click", close);
      $("figure", box).addEventListener("click", function (e) { e.stopPropagation(); });
      $(".lb-close", box).addEventListener("click", close);
      $(".prev", box).addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
      $(".next", box).addEventListener("click", function (e) { e.stopPropagation(); step(1); });
      document.body.appendChild(box);
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", keys);
      render();
      $(".lb-close", box).focus();
    };
    thumbsG.forEach(function (t, k) { t.addEventListener("click", function () { open(k, t); }); });
  }

  /* ---- Contact forms ---- */
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, phoneRe = /^[+()\-\s\d]{7,18}$/;
  $$("form.form").forEach(function (form) {
    var note = $(".note", form), btn = $("button[type=submit]", form);
    var f = {
      name: $("input[type=text]", form), email: $("input[type=email]", form),
      phone: $("input[type=tel]", form), message: $("textarea", form)
    };
    var setNote = function (t) { if (note) note.textContent = t; };
    if (FORM_KEY) setNote("Your message is sent directly to our corporate team.");
    function setErr(key, msg) {
      var label = f[key].closest("label"), old = $("em", label);
      if (old) old.remove();
      f[key].setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) { var em = document.createElement("em"); em.setAttribute("role", "alert"); em.textContent = msg; label.appendChild(em); }
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = {};
      Object.keys(f).forEach(function (k) { v[k] = f[k].value.trim(); });
      var bad = false;
      function chk(k, cond, msg) { setErr(k, cond ? "" : msg); if (!cond) bad = true; }
      chk("name", v.name.length >= 2, "Please enter your name.");
      chk("email", emailRe.test(v.email), "Please enter a valid email address.");
      chk("phone", !v.phone || phoneRe.test(v.phone), "Please enter a valid phone number.");
      chk("message", v.message.length >= 10, "Please write a short message (at least 10 characters).");
      if (bad) return;
      var trap = form.elements.botcheck;
      if (FORM_KEY) {
        if (trap && trap.checked) return;
        btn.disabled = true; btn.textContent = "Sending...";
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ access_key: FORM_KEY, subject: "Website enquiry from " + v.name, from_name: "Usha Projects website", name: v.name, email: v.email, phone: v.phone, message: v.message })
        }).then(function (r) { return r.json(); }).then(function (d) {
          if (!d.success) throw new Error("rejected");
          setNote("Thank you. Your message has been sent and our team will get back to you.");
          form.reset();
        }).catch(function () {
          setNote("Sorry, your message could not be sent. Please email " + CONTACT_EMAIL + " or call " + CONTACT_PHONE + ".");
        }).then(function () { btn.disabled = false; btn.textContent = "Submit now"; });
        return;
      }
      var body = "Name: " + v.name + "\nEmail: " + v.email + "\nPhone: " + v.phone + "\n\n" + v.message;
      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent("Website enquiry from " + v.name) + "&body=" + encodeURIComponent(body);
      setNote("Your email app should now open with this message ready to send. Nothing is sent from this website itself; please press Send in your email app.");
    });
  });

  /* ---- Skip link ---- */
  var skip = $(".skip");
  if (skip) skip.addEventListener("click", function (e) {
    e.preventDefault();
    var m = document.getElementById("main-content"); if (m) m.focus();
  });
})();

/* ---- Instant page changes: warm up a page when the visitor points at its link ---- */
(function () {
  var done = {};
  function warm(a) {
    var h = a && a.getAttribute && a.getAttribute("href");
    if (!h || /^(https?:|mailto:|tel:|#)/.test(h) || done[h]) return;
    done[h] = true;
    var l = document.createElement("link"); l.rel = "prefetch"; l.href = h; document.head.appendChild(l);
  }
  var c = navigator.connection;
  if (c && (c.saveData || /2g/.test(c.effectiveType || ""))) return; // respect data saver / slow links
  document.addEventListener("mouseover", function (e) { warm(e.target.closest && e.target.closest("a")); }, { passive: true });
  document.addEventListener("touchstart", function (e) { warm(e.target.closest && e.target.closest("a")); }, { passive: true });
})();
