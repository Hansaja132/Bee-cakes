const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const backToTop = document.querySelector("[data-back-to-top]");

function updateChrome() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 500);
}

window.addEventListener("scroll", updateChrome);
updateChrome();

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        activeObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

if (backToTop) {
  backToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
}

document.querySelectorAll("[data-lightbox]").forEach((item) => {
  item.addEventListener("click", () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const image = item.querySelector("img");
    lightboxImage.src = item.dataset.lightbox;
    lightboxImage.alt = image
      ? image.alt
      : item.dataset.caption || "Cake preview";
    lightboxCaption.textContent = item.dataset.caption || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

if (lightbox)
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

document.querySelectorAll("[data-slider]").forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll("[data-slide]"));
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");
  let index = Math.max(
    0,
    slides.findIndex((slide) => slide.classList.contains("active")),
  );

  function showSlide(nextIndex) {
    slides[index].classList.remove("active");
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add("active");
  }

  if (prev) prev.addEventListener("click", () => showSlide(index - 1));
  if (next) next.addEventListener("click", () => showSlide(index + 1));
});

const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  const success = contactForm.querySelector("[data-form-success]");
  const fields = {
    name: contactForm.elements.name,
    phone: contactForm.elements.phone,
    email: contactForm.elements.email,
    cakeType: contactForm.elements.cakeType,
    message: contactForm.elements.message,
  };
  const validators = {
    name: (value) => value.trim().length >= 2 || "Please enter your name.",
    phone: (value) =>
      /^[+\-()\d\s]{7,}$/.test(value.trim()) ||
      "Please enter a valid phone number.",
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
      "Please enter a valid email address.",
    cakeType: (value) => value.trim() !== "" || "Please choose a cake type.",
    message: (value) =>
      value.trim().length >= 10 ||
      "Please share a few details about your cake.",
  };

  function setError(name, message) {
    const error = contactForm.querySelector(`[data-error-for="${name}"]`);
    if (!error) return;
    error.textContent = message || "";
    fields[name].setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(name) {
    const result = validators[name](fields[name].value);
    setError(name, result === true ? "" : result);
    return result === true;
  }

  Object.keys(fields).forEach((name) => {
    fields[name].addEventListener("input", () => validateField(name));
    fields[name].addEventListener("blur", () => validateField(name));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = Object.keys(fields).every(validateField);
    if (!valid) {
      if (success) success.textContent = "";
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    if (success) success.textContent = "Sending...";

    (async () => {
      try {
        // Endpoint should be provided by `js/config.js` as `window.FORMSPREE_ENDPOINT`.
        const endpoint = (typeof window !== 'undefined' && window.FORMSPREE_ENDPOINT) || 'https://formspree.io/f/your-id';
        if (!endpoint || endpoint.includes('your-id')) {
          console.warn('Formspree endpoint is not configured. See js/config.example.js or .env.example.');
        }

        const formData = new FormData(contactForm);
        const resp = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (resp.ok) {
          contactForm.reset();
          Object.keys(fields).forEach((name) => setError(name, ""));
          if (success)
            success.textContent =
              "Thank you. Your cake inquiry is ready for Bee Cakes to review.";
        } else {
          const data = await resp.json().catch(() => ({}));
          throw new Error(data.error || 'Submission failed.');
        }
      } catch (err) {
        if (success) success.textContent = "Sorry — something went wrong. Try again.";
        console.error('Contact submit error:', err);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    })();
  });
}
