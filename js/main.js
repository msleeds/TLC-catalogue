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

  // Current year in footer
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
