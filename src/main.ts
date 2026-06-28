// Role Typings
const roles: string[] = [
  "Data Engineer",
  "Java Developer",
  "Problem Solver",
];

class Typer {
  private element: HTMLElement;
  private roles: string[];
  private roleIndex: number = 0;
  private charIndex: number = 0;
  private isDeleting: boolean = false;
  private typingSpeed: number = 100;
  private deletingSpeed: number = 50;
  private delayBetweenRoles: number = 1500;

  constructor(element: HTMLElement, roles: string[]) {
    this.element = element;
    this.roles = roles;
    this.type();
  }

  private type(): void {
    const currentRole = this.roles[this.roleIndex];

    if (!this.isDeleting) {
      this.element.textContent = currentRole.substring(0, this.charIndex + 1);
      this.charIndex++;

      if (this.charIndex === currentRole.length) {
        this.isDeleting = true;
        setTimeout(() => this.type(), this.delayBetweenRoles);
        return;
      }
    } else {
      this.element.textContent = currentRole.substring(0, this.charIndex - 1);
      this.charIndex--;

      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      }
    }

    setTimeout(() => this.type(), this.isDeleting ? this.deletingSpeed : this.typingSpeed);
  }
}

// Initialize all features on DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Typer
  const typingElement = document.querySelector(".typing") as HTMLElement;
  if (typingElement) {
    new Typer(typingElement, roles);
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector(".mobile-toggle") as HTMLButtonElement;
  const navbar = document.querySelector(".navbar") as HTMLElement;
  const navLinks = document.querySelectorAll(".navbar nav a");

  if (mobileToggle && navbar) {
    const icon = mobileToggle.querySelector("i");
    mobileToggle.addEventListener("click", () => {
      navbar.classList.toggle("nav-open");
      
      // Toggle fontawesome icon
      if (icon) {
        if (navbar.classList.contains("nav-open")) {
          icon.className = "fas fa-xmark";
        } else {
          icon.className = "fas fa-bars";
        }
      }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navbar.classList.remove("nav-open");
        if (icon) {
          icon.className = "fas fa-bars";
        }
      });
    });
  }

  // 3. Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  });

  // 4. Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. Active Navbar Link on Scroll
  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", () => {
    let currentSectionId = "";
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute("id") || "";
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  });

  // 6. Project Categories Filter Logic
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card") as NodeListOf<HTMLElement>;

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Toggle active button style
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter") || "all";

      projectCards.forEach(card => {
        const category = card.getAttribute("data-category") || "";

        card.classList.remove("show-animate");

        if (filterValue === "all" || category === filterValue) {
          card.classList.remove("hidden");
          // Re-trigger keyframe fade animation
          void card.offsetWidth; // Force layout reflow
          card.classList.add("show-animate");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // 7. Scroll To Top Logic
  const scrollTopBtn = document.querySelector(".scroll-top") as HTMLButtonElement;
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
