/* ========== Start Navbar JavaScript ========== */
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".pf-nav-links a");
    const menuToggle = document.querySelector(".pf-menu-toggle");
    const menuClose = document.querySelector(".pf-menu-close");
    const sideNav = document.querySelector(".pf-side-nav");
    const menuOverlay = document.querySelector(".pf-menu-overlay");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!sideNav || !menuToggle) return;
    let lastFocus = null;

    function openMenu() {
        lastFocus = document.activeElement;
        sideNav.classList.add("open");
        menuOverlay?.classList.add("active");
        document.body.classList.add("pf-menu-open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close menu");
        menuClose?.focus();
    }

    function closeMenu(restoreFocus = true) {
        sideNav.classList.remove("open");
        menuOverlay?.classList.remove("active");
        document.body.classList.remove("pf-menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
        if (restoreFocus) lastFocus?.focus();
    }

    menuToggle.addEventListener("click", () => {
        sideNav.classList.contains("open") ? closeMenu() : openMenu();
    });
    menuClose?.addEventListener("click", () => closeMenu());
    menuOverlay?.addEventListener("click", () => closeMenu());

    document.addEventListener("keydown", (e) => {
        if (!sideNav.classList.contains("open")) return;
        if (e.key === "Escape") {
            e.preventDefault();
            closeMenu();
            return;
        }
        if (e.key === "Tab") {
            const focusable = [...sideNav.querySelectorAll("a,button")];
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 767 && sideNav.classList.contains("open")) closeMenu(false);
    });

    document.querySelectorAll(".pf-nav-links a,.pf-mobile-brand,.pf-logo").forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href?.startsWith("#")) return;
            const target = document.getElementById(href.slice(1));
            if (!target) return;
            e.preventDefault();
            if (sideNav.classList.contains("open")) closeMenu(false);
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY,
                behavior: reducedMotion ? "auto" : "smooth",
            });
            history.replaceState(null, "", href);
        });
    });

    const sections = [...navLinks]
        .map((link) => {
            const href = link.getAttribute("href");
            return href?.startsWith("#") ? document.getElementById(href.slice(1)) : null;
        })
        .filter(Boolean);

    if (sections.length) {
        let ticking = false;
        function updateActiveNav() {
            const scrollPosition = window.scrollY + window.innerHeight * 0.35;
            let activeId = sections[0].id;
            sections.forEach((section) => {
                const top = section.getBoundingClientRect().top + window.scrollY;
                if (scrollPosition >= top) activeId = section.id;
            });
            navLinks.forEach((link) => {
                const active = link.getAttribute("href") === `#${activeId}`;
                link.classList.toggle("active", active);
                if (active) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
            ticking = false;
        }
        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    ticking = true;
                    requestAnimationFrame(updateActiveNav);
                }
            },
            { passive: true },
        );
        updateActiveNav();
    }
});
/* ========== End Navbar JavaScript ========== */

/* ========== Start Hero Eyes Animation ========== */
document.addEventListener("DOMContentLoaded", () => {
    const eyes = document.querySelectorAll(".pf-eye");
    const pupils = document.querySelectorAll(".pf-pupil");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !window.matchMedia("(pointer:fine)").matches || !eyes.length || !pupils.length) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let animationRunning = false;

    function animateEyes() {
        currentX += (mouseX - currentX) * 0.18;
        currentY += (mouseY - currentY) * 0.18;

        eyes.forEach((eye, index) => {
            if (!pupils[index]) return;
            const rect = eye.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(currentY - centerY, currentX - centerX);
            const distance = Math.min(Math.hypot(currentX - centerX, currentY - centerY) / 100, 1);
            const x = Math.cos(angle) * 5 * distance;
            const y = Math.sin(angle) * 7 * distance;
            pupils[index].style.transform = `translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;
        });

        if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
            requestAnimationFrame(animateEyes);
        } else {
            animationRunning = false;
        }
    }

    window.addEventListener(
        "pointermove",
        (e) => {
            if (e.pointerType === "touch") return;
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!animationRunning) {
                animationRunning = true;
                requestAnimationFrame(animateEyes);
            }
        },
        { passive: true },
    );
});
/* ========== End Hero Eyes Animation ========== */

/* ========== Start Profile Scroll Animation ========== */
document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".pf-profile .pf-reveal");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((el) => el.classList.add("pf-visible"));
        return;
    }
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("pf-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -30px 0px",
        },
    );
    revealElements.forEach((el) => observer.observe(el));
});
/* ========== End Profile Scroll Animation ========== */

/* ========== Start Work Section JavaScript ========== */
document.addEventListener("DOMContentLoaded", () => {
    const workSection = document.querySelector(".pf-work");
    if (!workSection) return;

    const workItems = [...workSection.querySelectorAll(".pf-work-item")];
    const workImage = workSection.querySelector(".pf-work-image");
    const workIndex = workSection.querySelector(".pf-work-image-index");
    const imageLink = workSection.querySelector(".pf-work-image-link");
    const mobileWork = workSection.querySelector(".pf-work-mobile");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!workItems.length) return;

    let requestId = 0;
    let changeTimer;

    /* ========== Start Desktop Work ========== */
    function updateWork(item, index) {
        if (!workImage || !workIndex || !imageLink) return;

        const imageSrc = item.dataset.image;
        const title = item.dataset.title;
        const projectLink = item.dataset.link;
        const currentRequest = ++requestId;

        clearTimeout(changeTimer);
        workImage.classList.remove("is-changing");

        workItems.forEach((btn) => {
            const active = btn === item;
            btn.classList.toggle("active", active);
            btn.setAttribute("aria-pressed", String(active));
        });

        if (projectLink) {
            imageLink.href = projectLink;
        } else {
            imageLink.removeAttribute("href");
        }

        imageLink.setAttribute("aria-label", `View ${title} project`);
        workIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${String(workItems.length).padStart(2, "0")}`;

        const newImage = new Image();

        newImage.onload = () => {
            if (currentRequest !== requestId) return;

            if (!reducedMotion) workImage.classList.add("is-changing");

            changeTimer = setTimeout(
                () => {
                    if (currentRequest !== requestId) return;

                    workImage.src = imageSrc;
                    workImage.alt = `${title} project`;

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            if (currentRequest === requestId) {
                                workImage.classList.remove("is-changing");
                            }
                        });
                    });
                },
                reducedMotion ? 0 : 250,
            );
        };

        newImage.onerror = () => {
            if (currentRequest !== requestId) return;
            workImage.classList.remove("is-changing");
            console.warn("Project image not found:", imageSrc);
        };

        newImage.src = imageSrc;
    }

    workItems.forEach((item, index) => {
        item.setAttribute("aria-pressed", String(item.classList.contains("active")));

        item.addEventListener("click", () => {
            if (item.classList.contains("active")) return;
            updateWork(item, index);
        });
    });

    const initialIndex = workItems.findIndex((item) => item.classList.contains("active"));
    const startIndex = initialIndex >= 0 ? initialIndex : 0;
    updateWork(workItems[startIndex], startIndex);
    /* ========== End Desktop Work ========== */

    /* ========== Start Mobile Work ========== */
    if (mobileWork) {
        const fragment = document.createDocumentFragment();

        workItems.forEach((item, index) => {
            const title = item.dataset.title || "Project";
            const imageSrc = item.dataset.image || "";
            const projectLink = item.dataset.link || "";
            const category = "Creative Campaign";

            const article = document.createElement("article");
            article.className = "pf-mobile-project pf-reveal";

            const link = document.createElement("a");
            link.className = "pf-mobile-project-link";
            if (projectLink) link.href = projectLink;
            link.setAttribute("aria-label", `View ${title} project`);

            const heading = document.createElement("div");
            heading.className = "pf-mobile-project-heading";

            const projectTitle = document.createElement("h3");
            projectTitle.className = "pf-mobile-project-title";
            projectTitle.textContent = title;

            const arrow = document.createElement("span");
            arrow.className = "pf-mobile-project-arrow";
            arrow.setAttribute("aria-hidden", "true");
            arrow.textContent = "↗";

            const projectCategory = document.createElement("span");
            projectCategory.className = "pf-mobile-project-category";
            projectCategory.textContent = category;

            const imageWrap = document.createElement("div");
            imageWrap.className = "pf-mobile-project-image-wrap";

            const image = document.createElement("img");
            image.className = "pf-mobile-project-image";
            image.src = imageSrc;
            image.alt = `${title} project`;
            image.loading = index < 2 ? "eager" : "lazy";
            image.decoding = "async";

            heading.append(projectTitle, arrow);
            imageWrap.appendChild(image);
            link.append(heading, projectCategory, imageWrap);
            article.appendChild(link);
            fragment.appendChild(article);
        });

        mobileWork.appendChild(fragment);

        const revealElements = mobileWork.querySelectorAll(".pf-reveal");

        if (reducedMotion || !("IntersectionObserver" in window)) {
            revealElements.forEach((el) => el.classList.add("pf-visible"));
        } else {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        entry.target.classList.add("pf-visible");
                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.08,
                    rootMargin: "0px 0px -20px 0px",
                },
            );

            revealElements.forEach((el) => observer.observe(el));
        }
    }
    /* ========== End Mobile Work ========== */
});
/* ========== End Work Section JavaScript ========== */

/* ========== Start Footer Animation JavaScript ========== */
document.addEventListener("DOMContentLoaded", () => {
    const footer = document.querySelector(".pf-footer");
    if (!footer) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
        footer.classList.add("pf-footer-visible");
        return;
    }
    const footerObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("pf-footer-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -30px 0px",
        },
    );
    footerObserver.observe(footer);
});
/* ========== End Footer Animation JavaScript ========== */

/* ========== Start Back To Top JavaScript ========== */
document.addEventListener("DOMContentLoaded", () => {
    const backTop = document.querySelector(".pf-back-top");
    if (!backTop) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function toggleBackTop() {
        const visible = window.scrollY > 350;
        backTop.classList.toggle("show", visible);
        backTop.tabIndex = visible ? 0 : -1;
    }
    window.addEventListener("scroll", toggleBackTop, { passive: true });
    toggleBackTop();
    backTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reducedMotion ? "instant" : "smooth",
        });
    });
});
/* ========== End Back To Top JavaScript ========== */
