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

// Helper to format bot markdown text to clean HTML
function formatBotResponse(text: string): string {
  if (!text) return "";

  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/`(.*?)`/g, "<code>$1</code>");

  const lines = formatted.split("\n");
  let inList = false;
  const resultLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      if (!inList) {
        inList = true;
        resultLines.push("<ul class='bot-list'>");
      }
      resultLines.push(`<li>${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        inList = false;
        resultLines.push("</ul>");
      }
      if (trimmed.length > 0) {
        resultLines.push(`<p>${trimmed}</p>`);
      }
    }
  }
  if (inList) {
    resultLines.push("</ul>");
  }

  return resultLines.join("");
}

// Initialize all features on DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Typer
  const typingElement = document.querySelector(".typing") as HTMLElement;
  if (typingElement) {
    new Typer(typingElement, roles);
  }

  // 2. Mobile Menu Toggle & Smooth Nav Scrolling
  const mobileToggle = document.querySelector(".mobile-toggle") as HTMLButtonElement;
  const navbar = document.querySelector(".navbar") as HTMLElement;
  const navLinks = document.querySelectorAll(".navbar nav a");

  if (mobileToggle && navbar) {
    const icon = mobileToggle.querySelector("i");
    mobileToggle.addEventListener("click", () => {
      navbar.classList.toggle("nav-open");

      if (icon) {
        if (navbar.classList.contains("nav-open")) {
          icon.className = "fas fa-xmark";
        } else {
          icon.className = "fas fa-bars";
        }
      }
    });

    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        navbar.classList.remove("nav-open");
        if (icon) {
          icon.className = "fas fa-bars";
        }

        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const targetSection = document.querySelector(href);
          if (targetSection) {
            e.preventDefault();
            const targetOffset = targetSection.getBoundingClientRect().top + window.scrollY - 75;
            window.scrollTo({
              top: targetOffset,
              behavior: "smooth"
            });
          }
        }
      });
    });
  }

  // 3. Scroll Reveal Intersection Observer (Efficient rendering)
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Active Navbar Link Observer (Zero Layout Thrashing!)
  const sections = document.querySelectorAll("section[id]");
  const navLinkMap = new Map<string, Element>();
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      navLinkMap.set(href.substring(1), link);
    }
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        if (id && navLinkMap.has(id)) {
          navLinks.forEach(l => l.classList.remove("active"));
          navLinkMap.get(id)?.classList.add("active");
        }
      }
    });
  }, {
    rootMargin: "-25% 0px -65% 0px",
    threshold: 0
  });

  sections.forEach(sec => sectionObserver.observe(sec));

  // 5. Throttled Scroll Handlers for Navbar and Scroll-Top Button (Passive Listener)
  const scrollTopBtn = document.querySelector(".scroll-top") as HTMLButtonElement;
  let isTicking = false;

  const onScroll = () => {
    if (!isTicking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (navbar) {
          if (scrollY > 50) {
            navbar.classList.add("scrolled");
          } else {
            navbar.classList.remove("scrolled");
          }
        }
        if (scrollTopBtn) {
          if (scrollY > 400) {
            scrollTopBtn.classList.add("visible");
          } else {
            scrollTopBtn.classList.remove("visible");
          }
        }
        isTicking = false;
      });
      isTicking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 6. Project Categories Filter Logic
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card") as NodeListOf<HTMLElement>;

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter") || "all";

      projectCards.forEach(card => {
        const category = card.getAttribute("data-category") || "";

        card.classList.remove("show-animate");

        if (filterValue === "all" || category === filterValue) {
          card.classList.remove("hidden");
          void card.offsetWidth; // Force layout reflow for animation
          card.classList.add("show-animate");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // 7. Resume AI Chatbot Logic
  const chatForm = document.querySelector("#chat-form") as HTMLFormElement | null;
  const chatInput = document.querySelector("#chat-input") as HTMLInputElement | null;
  const chatMessages = document.querySelector("#chat-messages") as HTMLElement | null;
  const chatChips = document.querySelectorAll<HTMLButtonElement>(".chat-chip");

  const chatbotApiUrl = "https://portfolio-chatbot-api-9cle.onrender.com/chat";

  if (chatForm && chatInput && chatMessages) {
    const scrollToBottom = (): void => {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: "smooth"
      });
    };

    const addChatMessage = (sender: "You" | "Assistant", text: string, className: string): HTMLElement => {
      const messageContainer = document.createElement("div");
      messageContainer.className = `chat-message ${className}`;

      const avatar = document.createElement("div");
      avatar.className = "message-avatar";
      avatar.innerHTML = sender === "You" 
        ? '<i class="fas fa-user"></i>' 
        : '<i class="fas fa-robot"></i>';

      const contentDiv = document.createElement("div");
      contentDiv.className = "message-content";

      if (sender === "You") {
        const p = document.createElement("p");
        p.textContent = text;
        contentDiv.appendChild(p);
      } else {
        contentDiv.innerHTML = formatBotResponse(text);
      }

      messageContainer.appendChild(avatar);
      messageContainer.appendChild(contentDiv);
      chatMessages.appendChild(messageContainer);

      scrollToBottom();
      return messageContainer;
    };

    const showTypingIndicator = (): HTMLElement => {
      const typingContainer = document.createElement("div");
      typingContainer.className = "chat-message assistant-message typing-indicator";
      typingContainer.id = "chat-typing-loader";

      const avatar = document.createElement("div");
      avatar.className = "message-avatar";
      avatar.innerHTML = '<i class="fas fa-robot"></i>';

      const content = document.createElement("div");
      content.className = "message-content";
      content.innerHTML = `
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;

      typingContainer.appendChild(avatar);
      typingContainer.appendChild(content);
      chatMessages.appendChild(typingContainer);

      scrollToBottom();
      return typingContainer;
    };

    // Handle Quick Suggestion Chip Clicks
    chatChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const prompt = chip.getAttribute("data-prompt");
        if (prompt && chatInput) {
          chatInput.value = prompt;
          chatForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      });
    });

    chatForm.addEventListener("submit", async (event: SubmitEvent) => {
      event.preventDefault();

      const question = chatInput.value.trim();
      if (!question) return;

      addChatMessage("You", question, "user-message");
      chatInput.value = "";
      chatInput.disabled = true;

      const loader = showTypingIndicator();

      try {
        const response = await fetch(chatbotApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ question })
        });

        loader.remove();

        if (!response.ok) {
          throw new Error(`Chatbot request failed with status ${response.status}`);
        }

        const data: { answer?: string } = await response.json();
        addChatMessage(
          "Assistant",
          data.answer || "I could not generate an answer.",
          "assistant-message"
        );
      } catch (error) {
        console.error("Chatbot error:", error);
        loader.remove();
        addChatMessage(
          "Assistant",
          "Sorry, the chatbot is temporarily unavailable. Please make sure the backend service is reachable.",
          "assistant-message"
        );
      } finally {
        chatInput.disabled = false;
        chatInput.focus();
      }
    });
  }
});
