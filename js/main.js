"use strict";

/* =========================================================
   KRONO IINC — MAIN JAVASCRIPT
   Features:
   1. Mobile navigation
   2. Sticky navbar
   3. Scroll progress bar
   4. Smooth scrolling
   5. Scroll reveal animations
   6. Animated counters
   7. Hero dashboard parallax
   8. Floating cards
   9. Card tilt effect
   10. Dashboard chart animation
   11. Contact form validation
   12. Dynamic footer year
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initCurrentYear();
    initNavbar();
    initScrollProgress();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initHeroParallax();
    initTiltCards();
    initDashboardChart();
    initContactForm();
});

/* =========================================================
   1. CURRENT YEAR
========================================================= */

function initCurrentYear() {
    const yearElements = document.querySelectorAll(
        "#current-year, [data-current-year]"
    );

    yearElements.forEach((element) => {
        element.textContent = new Date().getFullYear();
    });
}

/* =========================================================
   2. NAVBAR AND MOBILE MENU
========================================================= */

function initNavbar() {
    const header = document.querySelector(
        ".site-header, .header, header"
    );

    const menuButton = document.querySelector(
        ".menu-toggle, .mobile-menu-toggle, [data-menu-toggle]"
    );

    const navigation = document.querySelector(
        ".main-nav, .navbar-menu, nav"
    );

    const navigationLinks = document.querySelectorAll(
        '.main-nav a[href^="#"], .navbar-menu a[href^="#"], nav a[href^="#"]'
    );

    if (header) {
        updateHeaderState(header);

        window.addEventListener(
            "scroll",
            () => updateHeaderState(header),
            { passive: true }
        );
    }

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("is-open");

            menuButton.classList.toggle("is-active", isOpen);
            menuButton.setAttribute("aria-expanded", String(isOpen));

            document.body.classList.toggle("menu-open", isOpen);
        });

        navigationLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMobileMenu(menuButton, navigation);
            });
        });

        document.addEventListener("click", (event) => {
            const clickedInsideNavigation = navigation.contains(event.target);
            const clickedMenuButton = menuButton.contains(event.target);

            if (!clickedInsideNavigation && !clickedMenuButton) {
                closeMobileMenu(menuButton, navigation);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMobileMenu(menuButton, navigation);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 992) {
                closeMobileMenu(menuButton, navigation);
            }
        });
    }

    initActiveNavigationLinks(navigationLinks);
}

function updateHeaderState(header) {
    const hasScrolled = window.scrollY > 30;

    header.classList.toggle("is-scrolled", hasScrolled);
}

function closeMobileMenu(menuButton, navigation) {
    navigation.classList.remove("is-open");
    menuButton.classList.remove("is-active");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
}

function initActiveNavigationLinks(navigationLinks) {
    const sections = [...navigationLinks]
        .map((link) => {
            const selector = link.getAttribute("href");

            if (!selector || selector === "#") {
                return null;
            }

            try {
                return document.querySelector(selector);
            } catch {
                return null;
            }
        })
        .filter(Boolean);

    if (!sections.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                navigationLinks.forEach((link) => {
                    const target = link.getAttribute("href");
                    const isActive = target === `#${entry.target.id}`;

                    link.classList.toggle("is-active", isActive);
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => observer.observe(section));
}

/* =========================================================
   3. SCROLL PROGRESS BAR
========================================================= */

function initScrollProgress() {
    const progressBar = document.querySelector(
        ".scroll-progress, [data-scroll-progress]"
    );

    if (!progressBar) {
        return;
    }

    function updateProgress() {
        const documentHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const scrollPercentage =
            documentHeight > 0
                ? (window.scrollY / documentHeight) * 100
                : 0;

        progressBar.style.width = `${scrollPercentage}%`;
    }

    updateProgress();

    window.addEventListener("scroll", updateProgress, {
        passive: true
    });

    window.addEventListener("resize", updateProgress);
}

/* =========================================================
   4. SMOOTH SCROLLING
========================================================= */

function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            let targetElement;

            try {
                targetElement = document.querySelector(targetId);
            } catch {
                return;
            }

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            const header = document.querySelector(
                ".site-header, .header, header"
            );

            const headerHeight = header ? header.offsetHeight : 0;

            const targetPosition =
                targetElement.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                20;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });
}

/* =========================================================
   5. SCROLL REVEAL ANIMATIONS
========================================================= */

function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        ".reveal, [data-reveal], .service-card, .industry-card, .case-study-card, .process-step, .stat-item"
    );

    if (!revealElements.length) {
        return;
    }

    revealElements.forEach((element, index) => {
        if (!element.style.getPropertyValue("--reveal-delay")) {
            const delay = Math.min((index % 6) * 80, 400);
            element.style.setProperty("--reveal-delay", `${delay}ms`);
        }
    });

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -60px 0px"
        }
    );

    revealElements.forEach((element) => observer.observe(element));
}

/* =========================================================
   6. ANIMATED COUNTERS
========================================================= */

function initCounters() {
    const counters = document.querySelectorAll(
        "[data-counter], .counter"
    );

    if (!counters.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                animateCounter(entry.target);
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.5
        }
    );

    counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element) {
    const rawTarget =
        element.dataset.counter ||
        element.dataset.target ||
        element.textContent;

    const target = Number.parseFloat(
        String(rawTarget).replace(/[^\d.-]/g, "")
    );

    if (!Number.isFinite(target)) {
        return;
    }

    const prefix = element.dataset.prefix || "";
    const suffix =
        element.dataset.suffix ||
        extractCounterSuffix(element.textContent);

    const decimals = Number.parseInt(
        element.dataset.decimals || "0",
        10
    );

    const duration = Number.parseInt(
        element.dataset.duration || "1800",
        10
    );

    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = 1 - Math.pow(1 - progress, 4);
        const currentValue = target * easedProgress;

        element.textContent =
            prefix +
            currentValue.toFixed(decimals) +
            suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent =
                prefix +
                target.toFixed(decimals) +
                suffix;
        }
    }

    requestAnimationFrame(updateCounter);
}

function extractCounterSuffix(text) {
    const match = String(text).match(/[^\d.,\s-]+$/);
    return match ? match[0] : "";
}

/* =========================================================
   7. HERO DASHBOARD PARALLAX
========================================================= */

function initHeroParallax() {
    const hero = document.querySelector(
        ".hero, .hero-section, [data-hero]"
    );

    const dashboard = document.querySelector(
        ".hero-dashboard, .dashboard-3d, [data-dashboard]"
    );

    if (!hero || !dashboard) {
        return;
    }

    const floatingElements = dashboard.querySelectorAll(
        ".floating-card, [data-float]"
    );

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const canUsePointerEffects =
        window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion || !canUsePointerEffects) {
        return;
    }

    let frameId = null;

    hero.addEventListener("pointermove", (event) => {
        if (frameId) {
            cancelAnimationFrame(frameId);
        }

        frameId = requestAnimationFrame(() => {
            const bounds = hero.getBoundingClientRect();

            const mouseX =
                (event.clientX - bounds.left) / bounds.width - 0.5;

            const mouseY =
                (event.clientY - bounds.top) / bounds.height - 0.5;

            const rotateY = mouseX * 12;
            const rotateX = mouseY * -10;

            dashboard.style.transform = `
                perspective(1200px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translate3d(${mouseX * 12}px, ${mouseY * 12}px, 0)
            `;

            floatingElements.forEach((element, index) => {
                const depth = Number(
                    element.dataset.depth || index + 1
                );

                const movement = depth * 5;

                element.style.transform = `
                    translate3d(
                        ${mouseX * movement}px,
                        ${mouseY * movement}px,
                        ${depth * 3}px
                    )
                `;
            });
        });
    });

    hero.addEventListener("pointerleave", () => {
        dashboard.style.transform = "";

        floatingElements.forEach((element) => {
            element.style.transform = "";
        });
    });
}

/* =========================================================
   8. 3D CARD TILT EFFECT
========================================================= */

function initTiltCards() {
    const cards = document.querySelectorAll(
        ".tilt-card, [data-tilt], .service-card, .industry-card"
    );

    if (!cards.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const canUsePointerEffects =
        window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion || !canUsePointerEffects) {
        return;
    }

    cards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const bounds = card.getBoundingClientRect();

            const mouseX = event.clientX - bounds.left;
            const mouseY = event.clientY - bounds.top;

            const percentageX = mouseX / bounds.width;
            const percentageY = mouseY / bounds.height;

            const rotateY = (percentageX - 0.5) * 10;
            const rotateX = (0.5 - percentageY) * 10;

            card.style.setProperty(
                "--mouse-x",
                `${percentageX * 100}%`
            );

            card.style.setProperty(
                "--mouse-y",
                `${percentageY * 100}%`
            );

            card.style.transform = `
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-6px)
            `;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });
}

/* =========================================================
   9. DASHBOARD CHART ANIMATION
========================================================= */

function initDashboardChart() {
    const chartPaths = document.querySelectorAll(
        ".chart-line, [data-chart-line]"
    );

    const chartBars = document.querySelectorAll(
        ".chart-bar, [data-chart-bar]"
    );

    const progressElements = document.querySelectorAll(
        "[data-progress]"
    );

    chartPaths.forEach((path) => {
        if (typeof path.getTotalLength !== "function") {
            return;
        }

        const totalLength = path.getTotalLength();

        path.style.strokeDasharray = totalLength;
        path.style.strokeDashoffset = totalLength;

        requestAnimationFrame(() => {
            path.style.transition =
                "stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)";

            path.style.strokeDashoffset = "0";
        });
    });

    chartBars.forEach((bar, index) => {
        const targetHeight =
            bar.dataset.height ||
            bar.dataset.value ||
            bar.style.height ||
            "70%";

        bar.style.height = "0";

        window.setTimeout(() => {
            bar.style.height = targetHeight;
        }, 250 + index * 120);
    });

    progressElements.forEach((element) => {
        const progress = Math.min(
            Number.parseFloat(element.dataset.progress) || 0,
            100
        );

        element.style.setProperty(
            "--progress-value",
            `${progress}%`
        );

        const fill = element.querySelector(
            ".progress-fill, .pipeline-fill"
        );

        if (fill) {
            requestAnimationFrame(() => {
                fill.style.width = `${progress}%`;
            });
        }
    });
}

/* =========================================================
   10. CONTACT FORM
========================================================= */

function initContactForm() {
    const form = document.querySelector(
        "#contact-form, .contact-form, [data-contact-form]"
    );

    if (!form) {
        return;
    }

    const submitButton = form.querySelector(
        'button[type="submit"], input[type="submit"]'
    );

    const statusElement = getOrCreateFormStatus(form);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearFormErrors(form);

        const fields = {
            name: form.querySelector(
                '[name="name"], [name="fullName"]'
            ),
            email: form.querySelector('[name="email"]'),
            phone: form.querySelector('[name="phone"]'),
            message: form.querySelector(
                '[name="message"], textarea'
            )
        };

        const errors = validateContactFields(fields);

        if (errors.length > 0) {
            errors.forEach(({ field, message }) => {
                showFieldError(field, message);
            });

            statusElement.textContent =
                "Please check the highlighted fields.";

            statusElement.className = "form-status is-error";

            errors[0].field.focus();

            return;
        }

        setButtonLoading(submitButton, true);

        statusElement.textContent = "Submitting your enquiry...";
        statusElement.className = "form-status is-loading";

        try {
            /*
              This is currently a frontend demonstration.

              Replace the timeout below with an API request such as:

              const response = await fetch("/api/contact", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                      name: fields.name.value.trim(),
                      email: fields.email.value.trim(),
                      phone: fields.phone?.value.trim() || "",
                      message: fields.message.value.trim()
                  })
              });

              if (!response.ok) {
                  throw new Error("Submission failed");
              }
            */

            await simulateRequest(900);

            statusElement.textContent =
                "Thank you. Your enquiry has been submitted successfully.";

            statusElement.className = "form-status is-success";

            form.reset();
        } catch (error) {
            console.error("Contact form error:", error);

            statusElement.textContent =
                "We could not submit the form. Please try again.";

            statusElement.className = "form-status is-error";
        } finally {
            setButtonLoading(submitButton, false);
        }
    });

    form.addEventListener("input", (event) => {
        const field = event.target;

        if (
            field instanceof HTMLInputElement ||
            field instanceof HTMLTextAreaElement ||
            field instanceof HTMLSelectElement
        ) {
            removeFieldError(field);
        }
    });
}

function validateContactFields(fields) {
    const errors = [];

    if (!fields.name || fields.name.value.trim().length < 2) {
        if (fields.name) {
            errors.push({
                field: fields.name,
                message: "Please enter your full name."
            });
        }
    }

    if (!fields.email || !isValidEmail(fields.email.value.trim())) {
        if (fields.email) {
            errors.push({
                field: fields.email,
                message: "Please enter a valid email address."
            });
        }
    }

    if (
        fields.phone &&
        fields.phone.value.trim() &&
        !isValidPhone(fields.phone.value.trim())
    ) {
        errors.push({
            field: fields.phone,
            message: "Please enter a valid phone number."
        });
    }

    if (
        !fields.message ||
        fields.message.value.trim().length < 10
    ) {
        if (fields.message) {
            errors.push({
                field: fields.message,
                message:
                    "Please enter at least 10 characters in your message."
            });
        }
    }

    return errors;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function isValidPhone(phone) {
    const cleanedPhone = phone.replace(/[\s()+-]/g, "");
    return /^\d{7,15}$/.test(cleanedPhone);
}

function showFieldError(field, message) {
    field.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");

    const wrapper =
        field.closest(".form-group, .input-group") ||
        field.parentElement;

    if (!wrapper) {
        return;
    }

    let errorElement = wrapper.querySelector(".field-error");

    if (!errorElement) {
        errorElement = document.createElement("small");
        errorElement.className = "field-error";
        wrapper.appendChild(errorElement);
    }

    errorElement.textContent = message;
}

function removeFieldError(field) {
    field.classList.remove("has-error");
    field.removeAttribute("aria-invalid");

    const wrapper =
        field.closest(".form-group, .input-group") ||
        field.parentElement;

    const errorElement = wrapper?.querySelector(".field-error");

    if (errorElement) {
        errorElement.remove();
    }
}

function clearFormErrors(form) {
    form.querySelectorAll(".has-error").forEach((field) => {
        field.classList.remove("has-error");
        field.removeAttribute("aria-invalid");
    });

    form.querySelectorAll(".field-error").forEach((element) => {
        element.remove();
    });
}

function getOrCreateFormStatus(form) {
    let statusElement = form.querySelector(
        ".form-status, [data-form-status]"
    );

    if (!statusElement) {
        statusElement = document.createElement("div");
        statusElement.className = "form-status";
        statusElement.setAttribute("aria-live", "polite");
        form.appendChild(statusElement);
    }

    return statusElement;
}

function setButtonLoading(button, isLoading) {
    if (!button) {
        return;
    }

    if (isLoading) {
        button.dataset.originalText =
            button.textContent.trim() || "Submit";

        button.textContent = "Submitting...";
        button.disabled = true;
        button.classList.add("is-loading");
    } else {
        button.textContent =
            button.dataset.originalText || "Submit";

        button.disabled = false;
        button.classList.remove("is-loading");
    }
}

function simulateRequest(delay) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, delay);
    });
}

function initCursorGlow() {
    const hero = document.querySelector(".hero");
    const glow = document.querySelector(".cursor-glow");

    if (!hero || !glow) return;

    hero.addEventListener("pointermove", (event) => {
        const bounds = hero.getBoundingClientRect();

        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        glow.style.opacity = "1";
    });

    hero.addEventListener("pointerleave", () => {
        glow.style.opacity = "0";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initCursorGlow();
});

function initHeroScrollMotion() {
    const dashboard = document.querySelector(".hero-dashboard");
    const heroContent = document.querySelector(".hero-content");

    if (!dashboard || !heroContent) return;

    function updateHeroScroll() {
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / window.innerHeight, 1);

        dashboard.style.translate = `
            0 ${progress * 110}px
        `;

        dashboard.style.scale = `${1 - progress * 0.08}`;

        heroContent.style.transform = `
            translateY(${progress * 45}px)
        `;

        heroContent.style.opacity = `${1 - progress * 0.55}`;
    }

    updateHeroScroll();

    window.addEventListener("scroll", updateHeroScroll, {
        passive: true
    });
}

initHeroScrollMotion();

function initLiveDashboardCounters() {
    const counters = document.querySelectorAll("[data-live-counter]");

    counters.forEach((counter) => {
        const min = Number(counter.dataset.min || 100);
        const max = Number(counter.dataset.max || 500);

        setInterval(() => {
            const nextValue = Math.floor(
                Math.random() * (max - min + 1) + min
            );

            counter.textContent = nextValue.toLocaleString();
        }, 3000);
    });
}

document.querySelectorAll(".service-card").forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

card.style.setProperty(
"--mouse-x",
`${e.clientX-rect.left}px`
);

card.style.setProperty(
"--mouse-y",
`${e.clientY-rect.top}px`
);

});

card.addEventListener("mouseleave",()=>{

card.style.removeProperty("--mouse-x");
card.style.removeProperty("--mouse-y");

});

});


/* =========================================================
   CONTACT FORM
   The contact form remains fixed.
   No movement or 3D tilt.
========================================================= */
/* =========================================================
   INDUSTRY CARD GLOW
   ========================================================= */

(() => {
  const industryCards =
    document.querySelectorAll(".industry-grid article");

  industryCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (
        window.innerWidth <= 768 ||
        event.pointerType === "touch"
      ) {
        return;
      }

      const rect = card.getBoundingClientRect();

      card.style.setProperty(
        "--mouse-x",
        `${event.clientX - rect.left}px`
      );

      card.style.setProperty(
        "--mouse-y",
        `${event.clientY - rect.top}px`
      );
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
    });
  });
})();