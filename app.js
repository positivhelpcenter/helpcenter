
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Jahr im Footer
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobiles Navigationsmenü
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
      menuToggle.textContent = isOpen ? "×" : "☰";
    });

    $$("#mainNav a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Menü öffnen");
        menuToggle.textContent = "☰";
      });
    });
  }

  // Alltagshilfe-Karten
  const helpContent = {
    stress: {
      title: "Du musst nicht alles auf einmal lösen.",
      text: "Such dir eine einzige Sache aus, die jetzt wichtig ist. Der Rest darf kurz warten. Atme einmal langsam aus und fang mit dem kleinstmöglichen Schritt an."
    },
    sad: {
      title: "Du darfst dich gerade so fühlen.",
      text: "Du musst nicht sofort gute Laune haben oder so tun, als wäre alles okay. Vielleicht hilft es, etwas Wasser zu trinken, dich gemütlich hinzusetzen oder jemandem zu sagen, wie es dir geht."
    },
    motivation: {
      title: "Mach den Anfang winzig.",
      text: "Statt die ganze Aufgabe zu erledigen, probier nur zwei Minuten. Du darfst danach neu entscheiden. Ein kleiner Anfang ist auch ein Anfang."
    },
    laugh: {
      title: "Eine Mini-Portion Quatsch gefällig?",
      text: "Warum können Geister so schlecht lügen? Weil man durch sie hindurchsieht. Zugegeben: Der Witz ist transparent. 😄"
    }
  };

  const quickHelp = $("#quickHelp");
  const quickTitle = $("#quickTitle");
  const quickText = $("#quickText");

  $$(".help-card").forEach(card => {
    card.addEventListener("click", () => {
      const item = helpContent[card.dataset.help];
      if (!item || !quickHelp || !quickTitle || !quickText) return;

      quickTitle.textContent = item.title;
      quickText.textContent = item.text;
      quickHelp.hidden = false;
      quickHelp.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  const quickClose = $("#quickClose");
  if (quickClose && quickHelp) {
    quickClose.addEventListener("click", () => {
      quickHelp.hidden = true;
    });
  }

  const quickToChat = $("#quickToChat");
  if (quickToChat) {
    quickToChat.addEventListener("click", () => {
      const input = $("#chatInput");
      $("#mentalchat")?.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => input?.focus(), 350);
    });
  }

  // Positiv-Sprüche
  const quotes = [
    { text: "Du musst nicht den ganzen Weg sehen. Es reicht, den nächsten Schritt zu erkennen.", category: "Kleine Schritte" },
    { text: "Auch ein langsamer Tag ist ein Tag, an dem du da bist und weitermachst.", category: "Geduld" },
    { text: "Du darfst neu anfangen, auch mitten am Tag.", category: "Neuanfang" },
    { text: "Nicht jeder Gedanke muss geglaubt und nicht jedes Problem sofort gelöst werden.", category: "Gelassenheit" },
    { text: "Fortschritt ist manchmal einfach, freundlich zu sich selbst zu bleiben.", category: "Selbstfreundlichkeit" },
    { text: "Du bist ein Mensch und keine To-do-Liste.", category: "Pause machen" },
    { text: "Kleine gute Momente müssen nicht perfekt sein, um echt zu sein.", category: "Gute Momente" },
    { text: "Es ist okay, Hilfe anzunehmen. Du musst nicht alles allein schaffen.", category: "Zusammenhalt" }
  ];

  const newQuote = $("#newQuote");
  let lastQuote = 0;

  if (newQuote) {
    newQuote.addEventListener("click", () => {
      let next = Math.floor(Math.random() * quotes.length);
      if (quotes.length > 1 && next === lastQuote) {
        next = (next + 1) % quotes.length;
      }
      lastQuote = next;
      const quote = quotes[next];
      const quoteText = $("#quoteText");
      const quoteCategory = $("#quoteCategory");
      if (quoteText) quoteText.textContent = quote.text;
      if (quoteCategory) quoteCategory.textContent = quote.category;
    });
  }

  // Mentalchat – lokale Demo mit vorbereiteten Antworten
  const chatWindow = $("#chatWindow");
  const fullscreenToggle = $("#chatFullscreenToggle");
  const chatMessages = $("#chatMessages");
  const chatForm = $("#chatForm");
  const chatInput = $("#chatInput");
  const suggestions = $("#suggestions");

  function setFullscreen(active) {
    if (!chatWindow || !fullscreenToggle) return;

    chatWindow.classList.toggle("chat-is-fullscreen", active);
    document.body.classList.toggle("chat-fullscreen-active", active);
    fullscreenToggle.setAttribute("aria-pressed", String(active));
    fullscreenToggle.setAttribute("aria-label", active ? "Vollbild schließen" : "Vollbild öffnen");
    fullscreenToggle.title = active ? "Vollbild schließen" : "Vollbild öffnen";
    fullscreenToggle.textContent = active ? "✕" : "⛶";

    if (active) chatInput?.focus();
  }

  if (fullscreenToggle && chatWindow) {
    fullscreenToggle.addEventListener("click", () => {
      setFullscreen(!chatWindow.classList.contains("chat-is-fullscreen"));
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && chatWindow.classList.contains("chat-is-fullscreen")) {
        setFullscreen(false);
        fullscreenToggle.focus();
      }
    });
  }

  function addMessage(text, type) {
    if (!chatMessages) return;

    const message = document.createElement("div");
    message.className = `message message-${type}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;

    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = type === "user" ? "Du · gerade eben" : "Mentalchat · gerade eben";

    message.append(bubble, time);
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  const responseGroups = [
    {
      keys: ["traurig", "weine", "weinen", "einsam", "allein", "schlecht", "unglücklich"],
      answers: [
        "Das klingt gerade echt schwer. Du musst deine Gefühle nicht wegdrücken oder sofort eine Lösung finden. Magst du erzählen, was dich gerade am meisten beschäftigt?",
        "Es tut mir leid, dass es sich gerade so anfühlt. Du musst nicht so tun, als wäre alles okay. Vielleicht hilft es, einen kleinen Moment nach dem anderen zu nehmen.",
        "Ich hör dir zu. Auch wenn ich eine Demo bin und nicht alles verstehen kann: Du musst deine Gefühle nicht kleinreden."
      ]
    },
    {
      keys: ["angst", "ängstlich", "sorge", "sorgen", "panik", "nervös"],
      answers: [
        "Angst kann sich ziemlich überwältigend anfühlen. Versuch, deine Füße auf dem Boden zu spüren und langsam auszuatmen. Was macht dir gerade am meisten Sorgen?",
        "Lass uns einen Schritt zurückgehen: Was weißt du gerade sicher, und was befürchtest du nur? Du musst nicht alles sofort klären.",
        "Du musst nicht alle Unsicherheit auf einmal beseitigen. Schau erstmal, was dir genau in diesem Moment helfen könnte."
      ]
    },
    {
      keys: ["stress", "überfordert", "zu viel", "schaffe", "schaffen", "druck"],
      answers: [
        "Okay, einmal kurz sortieren. Was ist die eine Sache, die jetzt wirklich zuerst dran ist? Der Rest muss nicht gleichzeitig passieren.",
        "Wenn alles dringend wirkt, wird der Kopf schnell voll. Such dir nur den nächsten kleinen Schritt aus. Nicht den ganzen Berg.",
        "Du musst heute nicht alles perfekt erledigen. Was wäre eine kleine Sache, die du in den nächsten fünf Minuten schaffen könntest?"
      ]
    },
    {
      keys: ["freund", "freundin", "streit", "familie", "eltern", "beziehung", "liebe"],
      answers: [
        "Zwischenmenschliche Dinge können einen ganz schön beschäftigen. Was ist passiert, und was daran macht dir gerade am meisten zu schaffen?",
        "Es ist okay, wenn du erstmal deine Gedanken sortieren musst. Du musst nicht sofort die perfekte Antwort oder Lösung haben.",
        "Manchmal hilft es, zu trennen, was du fühlst, was du weißt und was du dir wünschst. Welcher Teil ist gerade am stärksten?"
      ]
    },
    {
      keys: ["schule", "arbeit", "prüfung", "lernen", "hausaufgabe", "note"],
      answers: [
        "Schulstress kann sich schnell nach viel zu viel anfühlen. Such dir ein Thema oder eine Aufgabe aus und arbeite erstmal nur daran.",
        "Du musst nicht alles in einem Rutsch lernen. Eine kurze Pause und danach ein kleiner, konkreter Abschnitt sind oft übersichtlicher.",
        "Was ist die nächste Abgabe oder Aufgabe? Wir können sie gedanklich in kleinere Schritte aufteilen."
      ]
    },
    {
      keys: ["müde", "erschöpft", "schlafen", "pause", "energie"],
      answers: [
        "Vielleicht brauchst du gerade nicht mehr Druck, sondern eine echte Pause. Wasser trinken, kurz weg vom Bildschirm und einmal locker die Schultern bewegen könnte ein Anfang sein.",
        "Du darfst eine Pause machen, ohne sie dir erst verdienen zu müssen. Was würde dir gerade ein bisschen Erholung geben?",
        "Nicht jeder Tag ist ein Hochleistungstag. Manchmal ist es genug, das Nötige zu tun und freundlich mit sich zu bleiben."
      ]
    },
    {
      keys: ["witz", "lachen", "humor", "lustig", "witzig"],
      answers: [
        "Warum nehmen Skelette nie an Streitgesprächen teil? Sie haben einfach nicht den Mumm dazu. 💀",
        "Was macht ein Keks unter einem Baum? Krümelschatten. 🍪",
        "Ich wollte einen Witz über Zeitreisen erzählen … aber den fandest du gestern schon schlecht. 😄"
      ]
    },
    {
      keys: ["positiv", "spruch", "motivation", "mut", "hoffnung", "impuls"],
      answers: [
        "Ein kleiner Schritt ist immer noch Bewegung. Du musst nicht schon wissen, wie der ganze Weg aussieht.",
        "Du darfst stolz auf Dinge sein, die niemand sonst bemerkt. Du weißt, was sie dich gekostet haben.",
        "Vielleicht muss heute nicht alles gut werden. Vielleicht reicht es, wenn ein einziger Moment ein kleines bisschen leichter wird."
      ]
    },
    {
      keys: ["danke", "dankeschön"],
      answers: [
        "Gern. ❤️ Sei ein bisschen nachsichtig mit dir. Du musst nicht alles auf einmal schaffen.",
        "Immer gern! Und denk dran: Du darfst dir auch selbst etwas Freundlichkeit entgegenbringen.",
        "Gerne. Ein kleiner Schritt reicht für den Anfang."
      ]
    },
    {
      keys: ["hallo", "hi", "hey", "moin", "guten morgen", "guten abend"],
      answers: [
        "Hey! ❤️ Schön, dass du da bist. Wie geht's dir gerade – ehrlich gesagt?",
        "Hallöchen! Was liegt dir heute auf dem Herzen?",
        "Hey du! Möchtest du reden, einen Impuls hören oder lieber einen kleinen Witz?"
      ]
    }
  ];

  const fallbackAnswers = [
    "Ich möchte dich nicht mit einer zufälligen Antwort abspeisen. Kannst du mir etwas genauer sagen, was du damit meinst?",
    "Ich bin eine kleine Chat-Demo und verstehe nicht alles. Erzähl mir gern noch ein bisschen mehr dazu.",
    "Hm, ich bin mir nicht ganz sicher, wie ich darauf antworten soll. Was ist dir an der Sache besonders wichtig?",
    "Ich möchte nicht einfach irgendetwas behaupten. Magst du erklären, was gerade passiert ist oder was du dir wünschst?"
  ];

  function chooseRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function getResponse(text) {
    const normalized = text.toLocaleLowerCase("de").replace(/[.,!?;:()[\]"]/g, " ");
    for (const group of responseGroups) {
      if (group.keys.some(key => normalized.includes(key))) {
        return chooseRandom(group.answers);
      }
    }
    return chooseRandom(fallbackAnswers);
  }

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || !chatMessages) return;

    addMessage(trimmed, "user");
    if (chatInput) chatInput.value = "";

    const response = getResponse(trimmed);
    window.setTimeout(() => addMessage(response, "bot"), 250);
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", event => {
      event.preventDefault();
      sendMessage(chatInput.value);
    });
  }

  if (suggestions) {
    suggestions.addEventListener("click", event => {
      const button = event.target.closest("button[data-prompt]");
      if (button) sendMessage(button.dataset.prompt || "");
    });
  }
});
