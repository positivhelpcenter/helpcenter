
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  // Mobile navigation
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Menü schließen" : "Menü öffnen"
      );
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Menü öffnen");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Menü öffnen");
      }
    });
  }

  // Help cards
  const helpResponse = document.getElementById("helpResponse");
  const helpResponseText = document.getElementById("helpResponseText");
  const closeHelp = document.getElementById("closeHelp");

  const helpMessages = {
    stress:
      "Mach für einen Moment langsam. Schreib drei Dinge auf, die gerade in deinem Kopf kreisen. Such dir nur eines davon aus, um damit anzufangen.",
    down:
      "Du musst heute nicht alles schaffen. Vielleicht helfen dir ein Glas Wasser, etwas frische Luft oder eine Nachricht an jemanden, dem du vertraust.",
    talk:
      "Du musst deine Gedanken nicht perfekt formulieren. Fang mit einem Satz an: „Gerade beschäftigt mich …“ Du kannst auch den Gedankenraum weiter unten nutzen."
  };

  document.querySelectorAll("[data-help]").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.help;
      if (!helpMessages[key] || !helpResponse || !helpResponseText) return;

      helpResponseText.textContent = helpMessages[key];
      helpResponse.hidden = false;
      helpResponse.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "nearest"
      });
    });
  });

  if (closeHelp && helpResponse) {
    closeHelp.addEventListener("click", () => {
      helpResponse.hidden = true;
    });
  }

  // Thought of the moment
  const quotes = [
    "Du darfst langsam machen.",
    "Nicht jeder Tag muss ein guter Tag sein.",
    "Kleine Schritte sind auch Fortschritt.",
    "Du musst nicht heute alles lösen.",
    "Pausen gehören dazu.",
    "Du darfst Hilfe annehmen.",
    "Ein neuer Versuch ist immer möglich."
  ];

  const quoteText = document.getElementById("quoteText");
  const newQuote = document.getElementById("newQuote");
  let lastQuote = -1;

  function showRandomQuote() {
    if (!quoteText) return;

    if (quotes.length < 2) {
      quoteText.textContent = quotes[0] || "";
      return;
    }

    let index;
    do {
      index = Math.floor(Math.random() * quotes.length);
    } while (index === lastQuote);

    lastQuote = index;
    quoteText.textContent = quotes[index];
  }

  if (newQuote) {
    newQuote.addEventListener("click", showRandomQuote);
  }

  // Simple local chat with prepared responses.
  // Messages are not sent to a server or stored by this script.
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  const chatReplies = [
    {
      keywords: ["stress", "druck", "überfordert", "zu viel", "kopf"],
      reply:
        "Das klingt nach ganz schön viel auf einmal. Was davon fühlt sich gerade am dringendsten an? Du musst nicht alles auf einmal lösen."
    },
    {
      keywords: ["traurig", "traurigkeit", "einsam", "allein", "weinen"],
      reply:
        "Es tut mir leid, dass es sich gerade so schwer anfühlt. Du musst deine Gefühle nicht wegdrücken. Gibt es jemanden, bei dem du dich sicher und verstanden fühlst?"
    },
    {
      keywords: ["angst", "ängste", "sorge", "sorgen", "panik"],
      reply:
        "Angst kann sich sehr überwältigend anfühlen. Versuch, kurz im Hier und Jetzt anzukommen: Schau dich um und benenne drei Dinge, die du sehen kannst. Was macht dir gerade am meisten Sorgen?"
    },
    {
      keywords: ["schule", "noten", "prüfung", "lernen", "lehrer"],
      reply:
        "Schule kann einen ganz schön fordern. Vielleicht hilft es, die Sache in einen kleinen nächsten Schritt aufzuteilen. Was genau steht gerade an?"
    },
    {
      keywords: ["freunde", "freundschaft", "streit", "beziehung", "liebe"],
      reply:
        "Zwischenmenschliche Dinge können ganz schön kompliziert sein. Was ist passiert, und was würdest du dir in dieser Situation wünschen?"
    },
    {
      keywords: ["müde", "erschöpft", "schlafen", "pause", "kraftlos"],
      reply:
        "Vielleicht brauchst du gerade nicht noch mehr von dir selbst, sondern eine Pause. Was wäre eine kleine Sache, die dir jetzt guttun könnte?"
    }
  ];

  function addMessage(text, type) {
    if (!chatMessages) return;

    const message = document.createElement("div");
    message.className = `message ${type === "user" ? "message-user" : "message-bot"}`;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getReply(text) {
    const normalized = text
      .toLocaleLowerCase("de-DE")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const match = chatReplies.find((entry) =>
      entry.keywords.some((word) => normalized.includes(
        word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      ))
    );

    if (match) return match.reply;

    return "Danke, dass du das aufschreibst. Ich kann nicht alles verstehen oder beurteilen, aber ich kann dir helfen, deine Gedanken zu sortieren. Was ist dir daran gerade besonders wichtig?";
  }

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const text = chatInput.value.trim();
      if (!text) return;

      addMessage(text, "user");
      chatInput.value = "";

      addMessage(getReply(text), "bot");
      chatInput.focus();
    });
  }

  // Footer year
  const currentYear = document.getElementById("currentYear");
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }
});
