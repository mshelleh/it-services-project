document.documentElement.classList.add("js-enabled");

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
}

const servicesButton = document.querySelector('.button-primary[href="#services"]');
const servicesSection = document.getElementById("services");

if (servicesButton && servicesSection) {
  let animationFrame = 0;
  let previousScrollBehavior = "";

  servicesButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      animationFrame = 0;
    }

    if (window.location.hash !== "#services") {
      window.history.pushState(null, "", "#services");
    }

    const root = document.documentElement;
    const scrollPadding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    const startY = window.scrollY;
    const targetY = Math.max(0, startY + servicesSection.getBoundingClientRect().top - scrollPadding);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, targetY);
      return;
    }

    const duration = 420;
    let startTime;
    previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const animateScroll = (time) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      window.scrollTo(0, startY + (targetY - startY) * easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateScroll);
      } else {
        animationFrame = 0;
        root.style.scrollBehavior = previousScrollBehavior;
      }
    };

    animationFrame = requestAnimationFrame(animateScroll);
  });
}
