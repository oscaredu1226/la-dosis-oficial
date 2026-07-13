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

const videoPlayer = document.querySelector(
  "[data-video-player]"
);

const videoTitle = document.querySelector(
  "[data-video-title]"
);

const youtubeLink = document.querySelector(
  "[data-youtube-link]"
);

const videoButtons = [
  ...document.querySelectorAll(".video-thumb"),
];

const videoPosterImage =
  videoPlayer?.querySelector("img");

function playVideo(videoId, title) {
  if (!videoId) return;

  const watchUrl =
    `https://www.youtube.com/watch?v=${videoId}`;

  if (window.location.protocol === "file:") {
    window.open(
      watchUrl,
      "_blank",
      "noopener,noreferrer"
    );

    return;
  }

  if (!videoFrame) return;

  const iframe = document.createElement("iframe");

  iframe.title =
    title || "Video destacado de La Dosis";

  iframe.src =
    `https://www.youtube-nocookie.com/embed/` +
    `${videoId}?autoplay=1&rel=0`;

  iframe.allow =
    "accelerometer; autoplay; clipboard-write; " +
    "encrypted-media; gyroscope; picture-in-picture; " +
    "web-share";

  iframe.allowFullscreen = true;

  videoFrame.replaceChildren(iframe);
}

videoPlayer?.addEventListener("click", () => {
  playVideo(
    videoPlayer.dataset.videoId,
    videoPlayer.dataset.videoName
  );
});

videoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const videoId = button.dataset.videoId;

    const title =
      button.dataset.videoName ||
      "Video de La Dosis";

    const thumb = button.querySelector("img");

    videoButtons.forEach((item) => {
      item.classList.remove("is-active");
    });

    button.classList.add("is-active");

    if (videoFrame && videoPlayer) {
      videoFrame.replaceChildren(videoPlayer);

      videoPlayer.dataset.videoId =
        videoId || "";

      videoPlayer.dataset.videoName = title;

      videoPlayer.setAttribute(
        "aria-label",
        `Reproducir ${title}`
      );
    }

    if (videoPosterImage && thumb) {
      videoPosterImage.src = thumb.src;
      videoPosterImage.alt = thumb.alt;
    }

    if (videoTitle) {
      videoTitle.textContent = title;
    }

    if (youtubeLink && videoId) {
      youtubeLink.href =
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