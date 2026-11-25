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

const quoteForm = document.getElementById("quote-form");
if (quoteForm instanceof HTMLFormElement) {
  const steps = Array.from(quoteForm.querySelectorAll(".quote-step"));
  const previousButton = quoteForm.querySelector("[data-previous]");
  const nextButton = quoteForm.querySelector("[data-next]");
  const submitButton = quoteForm.querySelector('button[type="submit"]');
  const progressBar = quoteForm.querySelector(".progress-track");
  const progressFill = quoteForm.querySelector("[data-progress-fill]");
  const progressLabel = quoteForm.querySelector("[data-progress-label]");
  const formMessage = quoteForm.querySelector(".form-message");

  if (
    steps.length === 0 ||
    !(previousButton instanceof HTMLButtonElement) ||
    !(nextButton instanceof HTMLButtonElement) ||
    !(submitButton instanceof HTMLButtonElement) ||
    !(progressBar instanceof HTMLElement) ||
    !(progressFill instanceof HTMLElement) ||
    !(progressLabel instanceof HTMLElement) ||
    !(formMessage instanceof HTMLElement)
  ) {
    throw new Error("The quote form is missing required controls.");
  }

  let currentStep = 0;
  const showStep = (focus = false) => {
    steps.forEach((step, index) => {
      step.hidden = index !== currentStep;
    });
    previousButton.hidden = currentStep === 0;
    nextButton.hidden = currentStep === steps.length - 1;
    submitButton.hidden = currentStep !== steps.length - 1;
    progressBar.setAttribute("aria-valuenow", String(currentStep + 1));
    progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    progressLabel.textContent = `Step ${currentStep + 1} of ${steps.length}`;
    formMessage.textContent = "";

    if (focus) {
      steps[currentStep].querySelector("legend")?.focus();
    }
  };

  nextButton.addEventListener("click", () => {
    const invalidControl = Array.from(
      steps[currentStep].querySelectorAll("input, textarea, select")
    ).find((control) => !control.checkValidity());

    if (invalidControl) {
      invalidControl.reportValidity();
      return;
    }

    currentStep += 1;
    showStep(true);
  });

  previousButton.addEventListener("click", () => {
    currentStep -= 1;
    showStep(true);
  });

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "Online form delivery is not connected yet. Your request was not sent.";
  });
}
