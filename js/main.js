"use strict";

/*==================================================
  DOM READY
==================================================*/

document.addEventListener("DOMContentLoaded", () => {
    initializeLucideIcons();
    initializeScrollProgress();
    initializeStickyHeader();
    initializeMobileNavigation();
    initializeSmoothScrolling();
    initializeActiveNavigation();
    initializeScrollReveal();
    initializeCounters();
    initializeDashboardCounters();
    initializeDashboardChart();
    initializePipelineBars();
    initializeHeroParallax();
    initializeDashboardTilt();
    initializeCardTilt();
    initializeCardGlow();
    initializeCursorGlow();
    initializeContactForm();
    initializeCurrentYear();
});

/*==================================================
  LUCIDE ICONS
==================================================*/

function initializeLucideIcons() {
    if (typeof lucide !== "undefined") {
        lucide.createIcons({
            attrs: {
                "stroke-width": 2
            }
        });
    }
}

/*==================================================
  SCROLL PROGRESS BAR
==================================================*/

function initializeScrollProgress() {
    const progressBar = document.querySelector(".scroll-progress");

    if (!progressBar) return;

    const updateProgress = () => {
        const scrollTop =
            window.scrollY || document.documentElement.scrollTop;

        const scrollHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const scrollPercentage =
            scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        progressBar.style.width = `${scrollPercentage}%`;
    };

    window.addEventListener("scroll", updateProgress, {
        passive: true
    });

    updateProgress();
}

/*==================================================
  STICKY HEADER
==================================================*/

function initializeStickyHeader() {
    const header = document.querySelector(".site-header");

    if (!header) return;

    const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 20);
    };

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();
}

/*==================================================
  MOBILE NAVIGATION
==================================================*/

function initializeMobileNavigation() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");
    const navigationLinks = document.querySelectorAll(".main-nav a");

    if (!menuToggle || !navigation) return;

    const openMenu = () => {
        menuToggle.classList.add("is-active");
        navigation.classList.add("is-open");
        document.body.classList.add("menu-open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    };

    const closeMenu = () => {
        menuToggle.classList.remove("is-active");
        navigation.classList.remove("is-open");
        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    };

    const toggleMenu = () => {
        const isOpen = navigation.classList.contains("is-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    menuToggle.addEventListener("click", toggleMenu);

    navigationLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        const clickedInsideNavigation = navigation.contains(event.target);
        const clickedMenuButton = menuToggle.contains(event.target);

        if (
            navigation.classList.contains("is-open") &&
            !clickedInsideNavigation &&
            !clickedMenuButton
        ) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 992) {
            closeMenu();
        }
    });
}

/*==================================================
  SMOOTH SCROLL
==================================================*/

function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetSection = document.querySelector(targetId);

            if (!targetSection) return;

            event.preventDefault();

            const header = document.querySelector(".site-header");
            const headerHeight = header ? header.offsetHeight : 0;

            const targetPosition =
                targetSection.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });
}

/*==================================================
  ACTIVE NAVIGATION LINK
==================================================*/

function initializeActiveNavigation() {
    const sections = document.querySelectorAll("section[id]");
    const navigationLinks = document.querySelectorAll(
        '.main-nav a[href^="#"]'
    );

    if (!sections.length || !navigationLinks.length) return;

    const updateActiveNavigation = () => {
        const header = document.querySelector(".site-header");
        const headerHeight = header ? header.offsetHeight : 0;

        const scrollPosition =
            window.scrollY + headerHeight + window.innerHeight * 0.25;

        let currentSectionId = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navigationLinks.forEach((link) => {
            const linkTarget = link
                .getAttribute("href")
                .replace("#", "");

            link.classList.toggle(
                "active",
                linkTarget === currentSectionId
            );
        });
    };

    window.addEventListener("scroll", updateActiveNavigation, {
        passive: true
    });

    updateActiveNavigation();
}

/*==================================================
  SCROLL REVEAL
==================================================*/

function initializeScrollReveal() {
    const revealElements = document.querySelectorAll("[data-reveal]");

    if (!revealElements.length) return;

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const element = entry.target;
                const delay = Number(element.dataset.delay || 0);

                window.setTimeout(() => {
                    element.classList.add("is-visible");
                }, delay);

                observer.unobserve(element);
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}

/*==================================================
  GENERAL COUNTERS
==================================================*/

function initializeCounters() {
    const counters = document.querySelectorAll("[data-counter]");

    if (!counters.length) return;

    const animateCounter = (counter) => {
        const target = Number(counter.dataset.counter || 0);
        const duration = Number(counter.dataset.duration || 1800);
        const prefix = counter.dataset.prefix || "";
        const suffix = counter.dataset.suffix || "";

        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(target * easedProgress);

            counter.textContent =
                prefix +
                formatCounterValue(currentValue) +
                suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent =
                    prefix +
                    formatCounterValue(target) +
                    suffix;
            }
        };

        requestAnimationFrame(updateCounter);
    };

    if (!("IntersectionObserver" in window)) {
        counters.forEach(animateCounter);
        return;
    }

    const counterObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.45
        }
    );

    counters.forEach((counter) => {
        counterObserver.observe(counter);
    });
}

function formatCounterValue(value) {
    return new Intl.NumberFormat("en-US").format(value);
}

/*==================================================
  LIVE DASHBOARD COUNTERS
==================================================*/

function initializeDashboardCounters() {
    const dashboard = document.querySelector("[data-dashboard]");

    if (!dashboard) return;

    const liveCounters = dashboard.querySelectorAll(
        "[data-live-counter]"
    );

    if (!liveCounters.length) return;

    liveCounters.forEach((counter) => {
        const minimum = Number(counter.dataset.min || 0);
        const maximum = Number(counter.dataset.max || 100);
        const decimals = Number(counter.dataset.decimals || 0);
        const prefix = counter.dataset.prefix || "";
        const suffix = counter.dataset.suffix || "";

        const updateLiveValue = () => {
            const randomValue =
                Math.random() * (maximum - minimum) + minimum;

            counter.textContent =
                prefix +
                randomValue.toFixed(decimals) +
                suffix;
        };

        updateLiveValue();

        const interval = Number(
            counter.dataset.interval || 3500
        );

        window.setInterval(updateLiveValue, interval);
    });
}

/*==================================================
  DASHBOARD CHART
==================================================*/

function initializeDashboardChart() {
    const chartContainers = document.querySelectorAll(
        "[data-dashboard-chart]"
    );

    if (!chartContainers.length) return;

    chartContainers.forEach((chartContainer) => {
        const chartLine =
            chartContainer.querySelector(".chart-line");

        const chartArea =
            chartContainer.querySelector(".chart-area");

        const chartSelector =
            chartContainer.querySelector(
                "[data-chart-selector]"
            );

        if (!chartLine) return;

        const chartData = {
            week: [
                [0, 145],
                [50, 125],
                [100, 132],
                [150, 92],
                [200, 105],
                [250, 67],
                [300, 79],
                [350, 42],
                [400, 55],
                [450, 28]
            ],

            month: [
                [0, 158],
                [50, 141],
                [100, 118],
                [150, 127],
                [200, 88],
                [250, 98],
                [300, 61],
                [350, 74],
                [400, 38],
                [450, 22]
            ],

            year: [
                [0, 170],
                [50, 151],
                [100, 145],
                [150, 122],
                [200, 116],
                [250, 88],
                [300, 94],
                [350, 58],
                [400, 44],
                [450, 18]
            ]
        };

        const createSmoothPath = (points) => {
            if (!points.length) return "";

            let path = `M ${points[0][0]} ${points[0][1]}`;

            for (let index = 1; index < points.length; index++) {
                const previous = points[index - 1];
                const current = points[index];

                const controlX =
                    (previous[0] + current[0]) / 2;

                path +=
                    ` C ${controlX} ${previous[1]},` +
                    ` ${controlX} ${current[1]},` +
                    ` ${current[0]} ${current[1]}`;
            }

            return path;
        };

        const updateChart = (period) => {
            const points =
                chartData[period] || chartData.month;

            const linePath = createSmoothPath(points);

            chartLine.setAttribute("d", linePath);

            if (chartArea) {
                const finalPoint = points[points.length - 1];
                const areaPath =
                    `${linePath} ` +
                    `L ${finalPoint[0]} 190 ` +
                    `L ${points[0][0]} 190 Z`;

                chartArea.setAttribute("d", areaPath);
            }

            chartLine.style.animation = "none";

            requestAnimationFrame(() => {
                chartLine.style.animation = "";
            });
        };

        if (chartSelector) {
            chartSelector.addEventListener("change", () => {
                updateChart(chartSelector.value);
            });

            updateChart(chartSelector.value);
        }
    });
}

/*==================================================
  PIPELINE PROGRESS BARS
==================================================*/

function initializePipelineBars() {
    const pipelineItems = document.querySelectorAll(
        ".pipeline-item[data-progress]"
    );

    if (!pipelineItems.length) return;

    const animatePipeline = (item) => {
        const fill = item.querySelector(".pipeline-fill");

        if (!fill) return;

        const progress = Math.min(
            Number(item.dataset.progress || 0),
            100
        );

        fill.style.width = `${progress}%`;
    };

    if (!("IntersectionObserver" in window)) {
        pipelineItems.forEach(animatePipeline);
        return;
    }

    const pipelineObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                animatePipeline(entry.target);
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.4
        }
    );

    pipelineItems.forEach((item) => {
        const fill = item.querySelector(".pipeline-fill");

        if (fill) {
            fill.style.width = "0";
        }

        pipelineObserver.observe(item);
    });
}

/*==================================================
  HERO PARALLAX
==================================================*/

function initializeHeroParallax() {
    const hero = document.querySelector(".hero");
    const dashboard = document.querySelector(".hero-dashboard");

    if (!hero || !dashboard) return;

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
    ) {
        return;
    }

    if (window.innerWidth <= 992) return;

    hero.addEventListener("mousemove", (event) => {
        const heroBounds = hero.getBoundingClientRect();

        const mouseX =
            event.clientX - heroBounds.left;

        const mouseY =
            event.clientY - heroBounds.top;

        const centerX = heroBounds.width / 2;
        const centerY = heroBounds.height / 2;

        const moveX = (mouseX - centerX) / 45;
        const moveY = (mouseY - centerY) / 45;

        dashboard.style.transform =
            `translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    hero.addEventListener("mouseleave", () => {
        dashboard.style.transform =
            "translate3d(0, 0, 0)";
    });
}

/*==================================================
  DASHBOARD TILT
==================================================*/

function initializeDashboardTilt() {
    const dashboardPanel = document.querySelector(
        ".dashboard-panel"
    );

    if (!dashboardPanel) return;

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
    ) {
        return;
    }

    if (window.innerWidth <= 992) return;

    dashboardPanel.addEventListener("mousemove", (event) => {
        const bounds =
            dashboardPanel.getBoundingClientRect();

        const mouseX = event.clientX - bounds.left;
        const mouseY = event.clientY - bounds.top;

        const rotateY =
            ((mouseX / bounds.width) - 0.5) * 8;

        const rotateX =
            ((mouseY / bounds.height) - 0.5) * -8;

        dashboardPanel.style.transform =
            `perspective(1400px) ` +
            `rotateX(${rotateX}deg) ` +
            `rotateY(${rotateY}deg) ` +
            `translateY(-6px)`;
    });

    dashboardPanel.addEventListener("mouseleave", () => {
        dashboardPanel.style.transform =
            "rotateX(2deg) rotateY(-3deg)";
    });
}

/*==================================================
  CARD TILT EFFECT
==================================================*/

function initializeCardTilt() {
    const tiltCards = document.querySelectorAll(
        "[data-tilt]"
    );

    if (!tiltCards.length) return;

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
    ) {
        return;
    }

    tiltCards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            if (window.innerWidth <= 992) return;

            const bounds = card.getBoundingClientRect();

            const mouseX =
                event.clientX - bounds.left;

            const mouseY =
                event.clientY - bounds.top;

            const rotateY =
                ((mouseX / bounds.width) - 0.5) * 6;

            const rotateX =
                ((mouseY / bounds.height) - 0.5) * -6;

            card.style.transform =
                `perspective(900px) ` +
                `rotateX(${rotateX}deg) ` +
                `rotateY(${rotateY}deg) ` +
                `translateY(-10px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

/*==================================================
  CARD CURSOR GLOW
==================================================*/

function initializeCardGlow() {
    const glowCards = document.querySelectorAll(
        ".service-card, .industry-card"
    );

    glowCards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const bounds = card.getBoundingClientRect();

            const glowX =
                event.clientX - bounds.left;

            const glowY =
                event.clientY - bounds.top;

            card.style.setProperty(
                "--glow-x",
                `${glowX}px`
            );

            card.style.setProperty(
                "--glow-y",
                `${glowY}px`
            );
        });
    });
}

/*==================================================
  HERO CURSOR GLOW
==================================================*/

function initializeCursorGlow() {
    const hero = document.querySelector(".hero");
    const cursorGlow =
        document.querySelector(".cursor-glow");

    if (!hero || !cursorGlow) return;

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
    ) {
        cursorGlow.style.display = "none";
        return;
    }

    if (window.innerWidth <= 992) {
        cursorGlow.style.display = "none";
        return;
    }

    hero.addEventListener("mousemove", (event) => {
        const heroBounds = hero.getBoundingClientRect();

        const positionX =
            event.clientX - heroBounds.left;

        const positionY =
            event.clientY - heroBounds.top;

        cursorGlow.style.left = `${positionX}px`;
        cursorGlow.style.top = `${positionY}px`;

        cursorGlow.style.transform =
            "translate(-50%, -50%)";

        cursorGlow.style.opacity = "0.75";
    });

    hero.addEventListener("mouseleave", () => {
        cursorGlow.style.opacity = "0";
    });
}

/*==================================================
  CONTACT FORM VALIDATION
==================================================*/

function initializeContactForm() {
    const contactForm = document.querySelector(
        "[data-contact-form]"
    );

    if (!contactForm) return;

    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        clearFormMessages(contactForm);

        const requiredFields =
            contactForm.querySelectorAll("[required]");

        let isValid = true;
        let firstInvalidField = null;

        requiredFields.forEach((field) => {
            const fieldValue = field.value.trim();

            if (!fieldValue) {
                showFieldError(
                    field,
                    "This field is required."
                );

                isValid = false;

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }

                return;
            }

            if (
                field.type === "email" &&
                !isValidEmail(fieldValue)
            ) {
                showFieldError(
                    field,
                    "Please enter a valid email address."
                );

                isValid = false;

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }

            if (
                field.type === "tel" &&
                !isValidPhone(fieldValue)
            ) {
                showFieldError(
                    field,
                    "Please enter a valid phone number."
                );

                isValid = false;

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });

        if (!isValid) {
            firstInvalidField?.focus();
            return;
        }

        const originalButtonContent =
            submitButton?.innerHTML || "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML =
                `<span>Sending...</span>`;
        }

        window.setTimeout(() => {
            showFormSuccess(
                contactForm,
                "Thank you. Your enquiry has been received. Our team will contact you shortly."
            );

            contactForm.reset();

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML =
                    originalButtonContent;
            }

            initializeLucideIcons();
        }, 1200);
    });

    const formFields = contactForm.querySelectorAll(
        "input, textarea, select"
    );

    formFields.forEach((field) => {
        field.addEventListener("input", () => {
            removeFieldError(field);
        });

        field.addEventListener("change", () => {
            removeFieldError(field);
        });
    });
}

function showFieldError(field, message) {
    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");

    const formGroup = field.closest(".form-group");

    if (!formGroup) return;

    const existingError =
        formGroup.querySelector(".field-error");

    if (existingError) {
        existingError.textContent = message;
        return;
    }

    const errorElement =
        document.createElement("span");

    errorElement.className = "field-error";
    errorElement.textContent = message;

    formGroup.appendChild(errorElement);
}

function removeFieldError(field) {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");

    const formGroup = field.closest(".form-group");

    formGroup
        ?.querySelector(".field-error")
        ?.remove();
}

function clearFormMessages(form) {
    form.querySelectorAll(".field-error").forEach(
        (error) => error.remove()
    );

    form.querySelectorAll(".is-invalid").forEach(
        (field) => {
            field.classList.remove("is-invalid");
            field.removeAttribute("aria-invalid");
        }
    );

    form.querySelector(".form-success")?.remove();
}

function showFormSuccess(form, message) {
    const successElement =
        document.createElement("div");

    successElement.className = "form-success";
    successElement.setAttribute("role", "status");

    successElement.innerHTML = `
        <i data-lucide="circle-check"></i>
        <span>${message}</span>
    `;

    form.prepend(successElement);

    initializeLucideIcons();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    const cleanedPhone = phone.replace(
        /[\s()+-]/g,
        ""
    );

    return /^\d{7,15}$/.test(cleanedPhone);
}

/*==================================================
  FOOTER CURRENT YEAR
==================================================*/

function initializeCurrentYear() {
    const yearElements = document.querySelectorAll(
        "[data-current-year]"
    );

    const currentYear =
        new Date().getFullYear();

    yearElements.forEach((element) => {
        element.textContent = currentYear;
    });
}

/*==================================================
  REDUCED MOTION SUPPORT
==================================================*/

const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

if (reducedMotionQuery.matches) {
    document.documentElement.classList.add(
        "reduced-motion"
    );
}