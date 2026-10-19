// MS LEEDS STUDIO / BUGALUGS — shared site behaviour
document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Enquiry forms: client-side only until a form backend (e.g. Formspree,
  // Netlify Forms) endpoint is wired into the <form action="..."> attribute.
  document.querySelectorAll("form[data-enquiry-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var success = form.parentElement.querySelector(".form-success");
      form.style.display = "none";
      if (success) success.classList.add("visible");
    });
  });

  // Prefill the contact form's subject from ?service= or ?print= links
  var params = new URLSearchParams(window.location.search);
  var serviceField = document.getElementById("service");
  if (serviceField && params.get("service")) serviceField.value = params.get("service");
  var detailField = document.getElementById("detail");
  if (detailField && params.get("print")) {
    detailField.value = params.get("print");
    if (serviceField) serviceField.value = "prints";
  }

  // Simple filters (Work, Prints): buttons carry data-filter, items data-cat
  document.querySelectorAll(".filter-row").forEach(function (row) {
    var grid = document.getElementById(row.getAttribute("data-target"));
    if (!grid) return;
    row.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        row.querySelectorAll("button").forEach(function (b) {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        var f = btn.getAttribute("data-filter");
        grid.querySelectorAll("[data-cat]").forEach(function (item) {
          item.style.display = f === "all" || item.getAttribute("data-cat") === f ? "" : "none";
        });
      });
    });
  });

  // First-visit studio chooser: "Are you looking for MLS or Bugalugs by MLS?"
  // Slides in from the right once per browser; the choice (or a dismissal)
  // is remembered so returning visitors aren't interrupted again.
  var CHOICE_KEY = "mls-studio-choice";
  var onBugalugs = document.body.classList.contains("bugalugs");
  var root = onBugalugs ? "../" : "";
  var chooser, scrim, lastFocus, memoryChoice = null;

  function readChoice() {
    try { return localStorage.getItem(CHOICE_KEY); } catch (e) { return memoryChoice; }
  }
  function saveChoice(value) {
    memoryChoice = value;
    try { localStorage.setItem(CHOICE_KEY, value); } catch (e) {}
  }

  function optionHTML(key, isCurrent) {
    var mls = key === "mls";
    var href = mls ? root + "index.html" : root + "bugalugs/index.html";
    var cta = isCurrent ? "Continue here" : (mls ? "Switch to the Studio" : "Switch to Bugalugs");
    return '<a class="chooser-option ' + (mls ? "opt-mls" : "opt-bug") + '" href="' + href + '" data-choice="' + key + '"' + (isCurrent ? ' data-current' : '') + '>' +
      '<span class="monogram" aria-hidden="true">' + (mls ? "MS" : "B") + '</span>' +
      '<span class="chooser-name">' + (mls ? "MS Leeds Studio" : "Bugalugs by MLS") + '</span>' +
      '<span class="chooser-desc">' + (mls
        ? "Communication design, laser cutting and photography prints."
        : "Event portrait + print studio. Weddings, formals, ag shows, races and balls across South-West &amp; Western Queensland.") + '</span>' +
      '<span class="chooser-cta">' + cta + ' &rarr;</span></a>';
  }

  function buildChooser() {
    scrim = document.createElement("div");
    scrim.className = "chooser-scrim";
    scrim.hidden = true;
    chooser = document.createElement("div");
    chooser.className = "brand-chooser";
    chooser.setAttribute("role", "dialog");
    chooser.setAttribute("aria-modal", "true");
    chooser.setAttribute("aria-labelledby", "chooser-title");
    chooser.hidden = true;
    chooser.innerHTML =
      '<button type="button" class="chooser-close" aria-label="Close">&times;</button>' +
      '<span class="eyebrow">Welcome</span>' +
      '<h2 id="chooser-title" tabindex="-1">Are you looking for MLS or Bugalugs by MLS?</h2>' +
      '<p>Two studios, one maker, based in Charleville. Pick where you\'d like to go.</p>' +
      optionHTML("mls", !onBugalugs) + optionHTML("bugalugs", onBugalugs) +
      '<p class="chooser-foot"><span class="script">Glad you made it, bugalugs.</span>You can switch any time from the menu.</p>';
    document.body.appendChild(scrim);
    document.body.appendChild(chooser);

    chooser.querySelector(".chooser-close").addEventListener("click", function () {
      saveChoice("dismissed");
      closeChooser();
    });
    scrim.addEventListener("click", function () {
      saveChoice("dismissed");
      closeChooser();
    });
    chooser.querySelectorAll(".chooser-option").forEach(function (opt) {
      opt.addEventListener("click", function (e) {
        saveChoice(opt.getAttribute("data-choice"));
        if (opt.hasAttribute("data-current")) {
          e.preventDefault();
          closeChooser();
        }
      });
    });
    chooser.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        saveChoice("dismissed");
        closeChooser();
      } else if (e.key === "Tab") {
        var items = chooser.querySelectorAll("button, a[href]");
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function openChooser() {
    if (!chooser) buildChooser();
    lastFocus = document.activeElement;
    scrim.hidden = false;
    chooser.hidden = false;
    // Next frame so the hidden -> visible change can transition
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        scrim.classList.add("is-open");
        chooser.classList.add("is-open");
        chooser.querySelector("#chooser-title").focus({ preventScroll: true });
      });
    });
  }

  function closeChooser() {
    if (!chooser) return;
    scrim.classList.remove("is-open");
    chooser.classList.remove("is-open");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(function () {
      scrim.hidden = true;
      chooser.hidden = true;
    }, reduce ? 0 : 600);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  document.querySelectorAll("[data-open-chooser]").forEach(function (btn) {
    btn.addEventListener("click", openChooser);
  });
  // Short delay so the page itself registers before the panel arrives
  if (!readChoice()) setTimeout(openChooser, 900);

  // Current year in footer
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
