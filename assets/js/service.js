/* ========== Start KFC Inner Page JavaScript ========== */
document.addEventListener("DOMContentLoaded", () => {
    const casePage = document.querySelector(".pf-case-page");
    if (!casePage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = casePage.querySelectorAll(".pf-reveal");

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
                rootMargin: "0px 0px -35px 0px",
            },
        );

        revealElements.forEach((el) => observer.observe(el));
    }
});
/* ========== End KFC Inner Page JavaScript ========== */

/* Start Image Lightbox Section */
const pfLightbox = document.getElementById("pfLightbox");
const pfLightboxImg = document.getElementById("pfLightboxImg");
document.querySelectorAll(".pf-case-hero-image img,.pf-case-gallery-image img").forEach((img) => {
    img.addEventListener("click", () => {
        pfLightboxImg.src = img.currentSrc || img.src;
        pfLightboxImg.alt = img.alt;
        pfLightboxImg.classList.remove("zoomed");
        pfLightbox.classList.add("active");
        document.body.classList.add("pf-lightbox-open");
    });
});
function closePfLightbox() {
    pfLightbox.classList.remove("active");
    pfLightboxImg.classList.remove("zoomed");
    document.body.classList.remove("pf-lightbox-open");
}
document.querySelector(".pf-lightbox-close").addEventListener("click", closePfLightbox);
pfLightbox.addEventListener("click", (e) => {
    if (e.target === pfLightbox || e.target.classList.contains("pf-lightbox-content")) closePfLightbox();
});
pfLightboxImg.addEventListener("click", () => {
    pfLightboxImg.classList.toggle("zoomed");
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pfLightbox.classList.contains("active")) closePfLightbox();
});
/* End Image Lightbox Section */
