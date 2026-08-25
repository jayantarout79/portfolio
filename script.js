"use strict";

/* ==========================================================
   DOM REFERENCES
========================================================== */

const header = document.getElementById("site-header");
const mobileMenuButton = document.getElementById("mobile-menu-button");
const navigation = document.getElementById("main-navigation");
const navigationLinks = navigation.querySelectorAll("a");
const currentYear = document.getElementById("current-year");


/* ==========================================================
   CURRENT YEAR
========================================================== */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* ==========================================================
   HEADER SCROLL STATE
========================================================== */

function updateHeaderState() {
    if (window.scrollY > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

updateHeaderState();

window.addEventListener(
    "scroll",
    updateHeaderState,
    { passive: true }
);


/* ==========================================================
   MOBILE NAVIGATION
========================================================== */

function openMobileMenu() {
    navigation.classList.add("open");
    mobileMenuButton.classList.add("active");

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "true"
    );

    mobileMenuButton.setAttribute(
        "aria-label",
        "Close navigation menu"
    );

    document.body.classList.add("menu-open");
}


function closeMobileMenu() {
    navigation.classList.remove("open");
    mobileMenuButton.classList.remove("active");

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    mobileMenuButton.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    document.body.classList.remove("menu-open");
}


function toggleMobileMenu() {
    const isOpen = navigation.classList.contains("open");

    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}


mobileMenuButton.addEventListener(
    "click",
    toggleMobileMenu
);


navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMobileMenu();
    });
});


document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        navigation.classList.contains("open")
    ) {
        closeMobileMenu();
        mobileMenuButton.focus();
    }
});


document.addEventListener("click", (event) => {
    const clickedInsideNavigation =
        navigation.contains(event.target);

    const clickedMenuButton =
        mobileMenuButton.contains(event.target);

    if (
        navigation.classList.contains("open") &&
        !clickedInsideNavigation &&
        !clickedMenuButton
    ) {
        closeMobileMenu();
    }
});


window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
        closeMobileMenu();
    }
});


/* ==========================================================
   SCROLL REVEAL
========================================================== */

const revealElements = document.querySelectorAll(".reveal");

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (prefersReducedMotion) {

    revealElements.forEach((element) => {
        element.classList.add("visible");
    });

} else {

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            root: null,
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );


    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

}


/* ==========================================================
   ACTIVE NAVIGATION SECTION
========================================================== */

const pageSections =
    document.querySelectorAll("main section[id]");

const sectionLinks = new Map();


navigationLinks.forEach((link) => {

    const href = link.getAttribute("href");

    if (
        href &&
        href.startsWith("#") &&
        href !== "#"
    ) {
        sectionLinks.set(
            href.substring(1),
            link
        );
    }

});


const sectionObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            navigationLinks.forEach((link) => {
                link.removeAttribute("aria-current");
            });


            const activeLink =
                sectionLinks.get(entry.target.id);


            if (activeLink) {
                activeLink.setAttribute(
                    "aria-current",
                    "page"
                );
            }

        });

    },

    {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
    }

);


pageSections.forEach((section) => {
    sectionObserver.observe(section);
});