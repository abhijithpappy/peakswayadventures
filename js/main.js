// Peaksway Adventures Banasura — site interactions
document.documentElement.classList.remove("no-js");
(function () {
  var WHATSAPP_NUMBER = "916235717272";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  // Solid header after scrolling past the top of the hero
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  function setMenu(open) {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(!document.body.classList.contains("nav-open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  // Reveal-on-scroll animations
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // "Enquire" buttons on trek cards pre-select that trek in the form
  var form = document.getElementById("enquiry-form");
  document.querySelectorAll("[data-trek]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      form.elements.trek.value = btn.getAttribute("data-trek");
    });
  });

  // Enquiry form -> WhatsApp message
  var errorEl = form.querySelector(".form-error");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    var name = f.name.value.trim();
    var phone = f.phone.value.trim();
    if (!name || !phone) {
      errorEl.hidden = false;
      (name ? f.phone : f.name).focus();
      return;
    }
    errorEl.hidden = true;

    var lines = [
      "Hi Peaksway Adventures! I'd like to enquire about a trek.",
      "",
      "Name: " + name,
      "Phone: " + phone,
      "Trek: " + f.trek.value,
      "People: " + (f.people.value || "-"),
      "Preferred date: " + (f.date.value || "Flexible")
    ];
    if (f.message.value.trim()) lines.push("Message: " + f.message.value.trim());

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });

  // Gallery lightbox
  var items = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  var current = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    var img = items[current].querySelector("img");
    lbImg.src = items[current].getAttribute("href");
    lbImg.alt = img.alt;
  }
  function openLb(i) {
    show(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = "";
  }

  items.forEach(function (item, i) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      openLb(i);
    });
  });
  lb.querySelector(".lb-close").addEventListener("click", closeLb);
  lb.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // Sunrise background video: load only when the section is near the screen,
  // play while visible, and skip it for people who prefer reduced motion
  var bandVideo = document.querySelector(".band-video");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (bandVideo && !reduceMotion && "IntersectionObserver" in window) {
    var videoIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!bandVideo.dataset.loaded) {
            bandVideo.querySelectorAll("source").forEach(function (s) { s.src = s.getAttribute("data-src"); });
            bandVideo.dataset.loaded = "1";
            bandVideo.load();
          }
          var p = bandVideo.play();
          if (p && p.catch) p.catch(function () {});
        } else if (bandVideo.dataset.loaded) {
          bandVideo.pause();
        }
      });
    }, { rootMargin: "200px 0px" });
    videoIo.observe(bandVideo);
  }

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();
})();
