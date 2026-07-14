document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const body = document.body;
const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuBackdrop = document.querySelector(
  "[data-menu-backdrop]"
);

const navLinks = [
  ...document.querySelectorAll(".nav-link"),
];

const sections = [
  ...document.querySelectorAll("[data-section]"),
];

/* ==================================================
   MENÚ MÓVIL
================================================== */

function setMenuState(isOpen) {
  if (!menu || !menuToggle) return;

  menu.classList.toggle("is-open", isOpen);

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Cerrar menú" : "Abrir menú"
  );

  body.classList.toggle("menu-open", isOpen);

  if (menuBackdrop) {
    menuBackdrop.hidden = !isOpen;
  }
}

function closeMenu() {
  setMenuState(false);
}

function toggleMenu() {
  const isOpen = !menu?.classList.contains("is-open");
  setMenuState(isOpen);
}

menuToggle?.addEventListener("click", toggleMenu);
menuBackdrop?.addEventListener("click", closeMenu);

window.addEventListener("resize", () => {
  if (window.innerWidth > 920) {
    closeMenu();
  }
});

/* ==================================================
   NAVEGACIÓN INTERNA
================================================== */

document.addEventListener("click", (event) => {
  const clickedLink = event.target.closest(
    'a[href^="#"]'
  );

  if (!clickedLink) return;

  const targetId = clickedLink.getAttribute("href");

  if (!targetId || targetId === "#") return;

  const target = document.querySelector(targetId);

  if (!target) return;

  event.preventDefault();

  closeMenu();

  target.scrollIntoView({
    behavior: prefersReducedMotion
      ? "auto"
      : "smooth",
    block: "start",
  });
});

/* ==================================================
   HEADER AL HACER SCROLL
================================================== */

function updateHeader() {
  header?.classList.toggle(
    "is-scrolled",
    window.scrollY > 20
  );
}

updateHeader();

window.addEventListener("scroll", updateHeader, {
  passive: true,
});

/* ==================================================
   CARRUSEL DE INTEGRANTES
================================================== */

const membersTrack = document.querySelector(
  "[data-members-track]"
);
const membersPrev = document.querySelector(
  "[data-members-prev]"
);
const membersNext = document.querySelector(
  "[data-members-next]"
);

function scrollMembers(direction) {
  if (!membersTrack) return;

  const firstCard = membersTrack.querySelector(".member");
  const cardWidth = firstCard
    ? firstCard.getBoundingClientRect().width
    : 180;
  const gap = 22;

  membersTrack.scrollBy({
    left: direction * (cardWidth + gap) * 2,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

membersPrev?.addEventListener("click", () =>
  scrollMembers(-1)
);
membersNext?.addEventListener("click", () =>
  scrollMembers(1)
);

/* ==================================================
   NAVEGACIÓN ACTIVA Y ANIMACIONES
================================================== */

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (first, second) =>
            second.intersectionRatio -
            first.intersectionRatio
        );

      const current = visibleEntries[0];

      if (!current) return;

      const id = current.target.id;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${id}`
        );
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: [0, 0.15, 0.35],
    }
  );

  sections.forEach((section) => {
    navObserver.observe(section);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
    }
  );

  document
    .querySelectorAll(".reveal")
    .forEach((element) => {
      revealObserver.observe(element);
    });
} else {
  document
    .querySelectorAll(".reveal")
    .forEach((element) => {
      element.classList.add("is-visible");
    });
}

/* ==================================================
   AÑO DEL FOOTER
================================================== */

const yearElement = document.querySelector(
  "[data-year]"
);

if (yearElement) {
  yearElement.textContent = String(
    new Date().getFullYear()
  );
}

/* ==================================================
   VIDEOS
================================================== */

const videoFrame = document.querySelector(
  "[data-video-frame]"
);

const videoTitle = document.querySelector(
  "[data-video-title]"
);

const youtubeLink = document.querySelector(
  "[data-youtube-link]"
);

const initialVideoFrame = document.querySelector(
  "[data-video-embed-frame]"
);

const videoButtons = [
  ...document.querySelectorAll(".video-thumb"),
];

function withYouTubeOrigin(url) {
  if (!url) return "";

  try {
    const embedUrl = new URL(url);

    if (
      window.location.protocol === "http:" ||
      window.location.protocol === "https:"
    ) {
      embedUrl.searchParams.set(
        "origin",
        window.location.origin
      );
    }

    return embedUrl.toString();
  } catch {
    return url;
  }
}

if (initialVideoFrame?.src) {
  initialVideoFrame.src = withYouTubeOrigin(
    initialVideoFrame.src
  );
}

function renderVideo(videoId, title, autoplay = false, embedUrl = "") {
  if (!videoId && !embedUrl) return;

  if (!videoFrame) return;

  const iframe = document.createElement("iframe");

  iframe.title =
    title || "Video destacado de La Dosis";

  const separator = embedUrl.includes("?") ? "&" : "?";

  const src = embedUrl
    ? `${embedUrl}${autoplay ? `${separator}autoplay=1` : ""}`
    : `https://www.youtube.com/embed/${videoId}?rel=0${autoplay ? "&autoplay=1" : ""}`;

  iframe.src = withYouTubeOrigin(src);

  iframe.allow =
    "accelerometer; autoplay; clipboard-write; " +
    "encrypted-media; gyroscope; picture-in-picture; " +
    "web-share";

  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;

  videoFrame.replaceChildren(iframe);
}

videoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const videoId = button.dataset.videoId;
    const videoUrl = button.dataset.videoUrl;
    const videoEmbed = button.dataset.videoEmbed;

    const title =
      button.dataset.videoName ||
      "Video de La Dosis";

    videoButtons.forEach((item) => {
      item.classList.remove("is-active");
    });

    button.classList.add("is-active");

    renderVideo(videoId, title, true, videoEmbed);

    if (videoTitle) {
      videoTitle.textContent = title;
    }

    if (youtubeLink && (videoId || videoUrl)) {
      youtubeLink.href =
        videoUrl ||
        `https://www.youtube.com/watch?v=${videoId}`;
    }
  });
});

/* ==================================================
   GALERÍA
================================================== */

const galleryItems = [
  ...document.querySelectorAll(".gallery-item"),
];

const galleryTrack = document.querySelector(
  "[data-gallery-track]"
);
const galleryPrev = document.querySelector(
  "[data-gallery-prev]"
);
const galleryNext = document.querySelector(
  "[data-gallery-next]"
);

const lightbox = document.querySelector(
  "[data-lightbox]"
);

const lightboxImage = document.querySelector(
  "[data-lightbox-image]"
);

const lightboxCaption = document.querySelector(
  "[data-lightbox-caption]"
);

const lightboxClose = document.querySelector(
  "[data-lightbox-close]"
);

const lightboxPrev = document.querySelector(
  "[data-lightbox-prev]"
);

const lightboxNext = document.querySelector(
  "[data-lightbox-next]"
);

let activeImageIndex = 0;
let lastFocusedElement = null;
let galleryAutoTimer = null;

function scrollGallery(direction = 1) {
  if (!galleryTrack) return;

  const firstItem = galleryTrack.querySelector(".gallery-item");
  const itemWidth = firstItem
    ? firstItem.getBoundingClientRect().width
    : 220;
  const gap = 16;
  const maxScroll =
    galleryTrack.scrollWidth - galleryTrack.clientWidth;

  if (
    direction > 0 &&
    galleryTrack.scrollLeft >= maxScroll - 4
  ) {
    galleryTrack.scrollTo({
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    return;
  }

  if (direction < 0 && galleryTrack.scrollLeft <= 4) {
    galleryTrack.scrollTo({
      left: maxScroll,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    return;
  }

  galleryTrack.scrollBy({
    left: direction * (itemWidth + gap) * 2,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

function stopGalleryAuto() {
  if (!galleryAutoTimer) return;
  window.clearInterval(galleryAutoTimer);
  galleryAutoTimer = null;
}

function startGalleryAuto() {
  if (
    prefersReducedMotion ||
    !galleryTrack ||
    galleryAutoTimer
  ) {
    return;
  }

  galleryAutoTimer = window.setInterval(() => {
    scrollGallery(1);
  }, 3600);
}

galleryPrev?.addEventListener("click", () => {
  stopGalleryAuto();
  scrollGallery(-1);
});

galleryNext?.addEventListener("click", () => {
  stopGalleryAuto();
  scrollGallery(1);
});

galleryTrack?.addEventListener("pointerdown", stopGalleryAuto);
galleryTrack?.addEventListener("focusin", stopGalleryAuto);
startGalleryAuto();

function renderLightboxImage() {
  const item = galleryItems[activeImageIndex];

  if (
    !item ||
    !lightboxImage ||
    !lightboxCaption
  ) {
    return;
  }

  lightboxImage.src =
    item.dataset.full || "";

  lightboxImage.alt =
    item.dataset.alt || "Imagen de La Dosis";

  lightboxCaption.textContent =
    item.dataset.alt || "";
}

function openLightbox(index) {
  if (!lightbox || !lightboxClose) return;

  stopGalleryAuto();
  activeImageIndex = index;
  lastFocusedElement = document.activeElement;

  renderLightboxImage();

  lightbox.hidden = false;
  body.classList.add("menu-open");

  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;

  lightbox.hidden = true;
  body.classList.remove("menu-open");

  lightboxImage.removeAttribute("src");

  lastFocusedElement?.focus();
}

function showNextImage(direction) {
  if (!galleryItems.length) return;

  activeImageIndex =
    (
      activeImageIndex +
      direction +
      galleryItems.length
    ) % galleryItems.length;

  renderLightboxImage();
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    openLightbox(index);
  });
});

lightboxClose?.addEventListener(
  "click",
  closeLightbox
);

lightboxPrev?.addEventListener("click", () => {
  showNextImage(-1);
});

lightboxNext?.addEventListener("click", () => {
  showNextImage(1);
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (lightbox?.hidden === false) {
    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showNextImage(-1);
    }

    if (event.key === "ArrowRight") {
      showNextImage(1);
    }
  }

  if (
    event.key === "Escape" &&
    menu?.classList.contains("is-open")
  ) {
    closeMenu();
    menuToggle?.focus();
  }
});

/* ==================================================
   FORMULARIO
================================================== */

const contactForm = document.querySelector(
  "[data-contact-form]"
);

const formStatus = document.querySelector(
  "[data-form-status]"
);

function setError(field, message) {
  const error = document.querySelector(
    `#error-${field.id}`
  );

  field.setAttribute(
    "aria-invalid",
    message ? "true" : "false"
  );

  if (error) {
    field.setAttribute(
      "aria-describedby",
      error.id
    );

    error.textContent = message;
  }
}

function validateField(field) {
  const value = field.value.trim();

  if (!value) {
    setError(
      field,
      "Este campo es obligatorio."
    );

    return false;
  }

  if (
    field.type === "email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ) {
    setError(
      field,
      "Ingresa un correo válido."
    );

    return false;
  }

  if (
    field.name === "mensaje" &&
    value.length < 10
  ) {
    setError(
      field,
      "Escribe un mensaje de al menos 10 caracteres."
    );

    return false;
  }

  setError(field, "");

  return true;
}

if (contactForm) {
  const fields = [
    ...contactForm.querySelectorAll(
      "input, select, textarea"
    ),
  ];

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      validateField(field);
    });

    field.addEventListener("input", () => {
      if (
        field.getAttribute("aria-invalid") ===
        "true"
      ) {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const validationResults = fields.map(
        (field) => validateField(field)
      );

      const isValid =
        validationResults.every(Boolean);

      if (!isValid) {
        if (formStatus) {
          formStatus.textContent =
            "Revisa los campos marcados antes de continuar.";
        }

        fields
          .find(
            (field) =>
              field.getAttribute(
                "aria-invalid"
              ) === "true"
          )
          ?.focus();

        return;
      }

      if (formStatus) {
        formStatus.textContent =
          "Mensaje preparado correctamente. " +
          "Conecta este formulario a un servicio " +
          "para enviarlo.";
      }

      contactForm.reset();

      fields.forEach((field) => {
        field.setAttribute(
          "aria-invalid",
          "false"
        );

        setError(field, "");
      });
    }
  );
}
