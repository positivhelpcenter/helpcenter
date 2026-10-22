(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Mobile navigation
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
  });
  $$("#mainNav a").forEach(link => link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }));

  // Small, practical support cards
  const helpContent = {
    stress: {
      title: "Wir machen die Welt kurz kleiner.",
      text: "Stell beide Füße auf den Boden. Atme langsam aus. Such dir dann nur eine Sache aus, die wirklich als Nächstes dran ist. Alles andere darf für einen Moment warten."
    },
    sad: {
      title: "Du musst dich nicht sofort besser fühlen.",
      text: "Gib deinem Gefühl einen Namen, ohne dich dafür zu verurteilen. Vielleicht hilft Wasser, eine Decke, Musik oder eine Nachricht an einen Menschen, dem du vertraust. Ein kleiner Trost reicht für den Anfang."
    },
    motivation: {
      title: "Mach die Aufgabe lächerlich klein.",
      text: "Nicht „Zimmer aufräumen“, sondern „drei Dinge wegräumen“. Nicht „alles lernen“, sondern „fünf Minuten anfangen“. Ein Anfang muss nicht beeindruckend sein – nur machbar."
    },
    laugh: {
      title: "Dein Gehirn hat zu viele Tabs offen?",
      text: "Wir schließen jetzt erstmal drei. 😄 Du musst heute nicht das Betriebssystem deines ganzen Lebens aktualisieren. Ein Schluck Wasser und ein kleiner Reset sind schon ein Anfang."
    }
  };
  const quickHelp = $("#quickHelp");
  $$(".help-card").forEach(card => card.addEventListener("click", () => {
    const content = helpContent[card.dataset.help];
    if (!content) return;
    $("#quickTitle").textContent = content.title;
    $("#quickText").textContent = content.text;
    quickHelp.hidden = false;
    quickHelp.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));
  $("#quickClose")?.addEventListener("click", () => { quickHelp.hidden = true; });
  $("#quickToChat")?.addEventListener("click", () => {
    const input = $("#chatInput");
    input.value = "Ich könnte gerade Unterstützung gebrauchen.";
    $("#mentalchat").scrollIntoView({ behavior: "smooth" });
    input.focus({ preventScroll: true });
  });

  // Positive daily-style prompts
  const quotes = [
    { text: "Du musst nicht den ganzen Weg sehen. Es reicht, den nächsten Schritt zu erkennen.", category: "Kleine Schritte" },
    { text: "Du darfst stolz auf Dinge sein, die niemand sonst bemerkt hat.", category: "Selbstvertrauen" },
    { text: "Pause ist kein Rückschritt. Auch ein Handy muss mal laden.", category: "Mit Humor" },
    { text: "Ein schwieriger Tag ist nur ein Kapitel – nicht die ganze Geschichte.", category: "Zuversicht" },
    { text: "Du musst nicht perfekt sein, um etwas Gutes in die Welt zu bringen.", category: "Du zählst" },
    { text: "Manchmal ist der mutigste Plan: Wasser trinken, durchatmen und neu anfangen.", category: "Für heute" },
    { text: "Fortschritt kann auch bedeuten, dass du freundlich mit dir selbst umgehst.", category: "Selbstfürsorge" }
  ];
  let quoteIndex = 0;
  $("#newQuote")?.addEventListener("click", () => {
    let next = quoteIndex;
    if (quotes.length > 1) while (next === quoteIndex) next = Math.floor(Math.random() * quotes.length);
    quoteIndex = next;
    $("#quoteText").textContent = quotes[quoteIndex].text;
    $("#quoteCategory").textContent = quotes[quoteIndex].category;
  });

  // This is deliberately a local demo, not an AI or mental-health service.
  const responseSets = [
    { keys: ["zu viel", "überfordert", "stress", "druck", "panik", "alles ist"], answer: "Okay. Erstmal: Du musst nicht alles auf einmal lösen. 🌱\n\nLass uns die Welt kurz kleiner machen: Was ist EINE Sache, die gerade am dringendsten ist? Wenn selbst das zu viel ist, atme einmal langsam aus. Das zählt schon als Anfang." },
    { keys: ["traurig", "weinen", "einsam", "schlecht", "down", "unglücklich"], answer: "Oh, das klingt gerade schwer. 💚 Du musst nicht so tun, als wäre alles okay. Gefühle dürfen da sein, ohne dass sie für immer bleiben.\n\nGibt es jemanden, bei dem du dich sicher fühlst und dem du schreiben könntest? Ich kann dir auch helfen, einen kleinen nächsten Schritt zu finden." },
    { keys: ["witz", "lachen", "humor", "lustig", "gute laune"], answer: "Was sagt ein überforderter Kalender? „Meine Tage sind gezählt.“ 😭😂\n\nUnd jetzt die wichtige Erinnerung: Du musst nicht jeden Tag produktiv sein. Sogar Pflanzen wachsen nicht schneller, wenn man sie anschreit." },
    { keys: ["spiegel", "schönste", "kompliment", "hübsch", "wert"], answer: "Weißt du, was das Schönste an dir ist? 👀\n\nSchau in den Spiegel: Da steht jemand, der schon mehr geschafft hat, als ihm an manchen Tagen bewusst ist. Und ja, der Spiegel darf das ruhig bestätigen. 💚" },
    { keys: ["motivation", "anfangen", "keine lust", "antrieb", "aufgabe"], answer: "Wir tricksen den inneren Schweinehund freundlich aus. 🐾 Mach nur zwei Minuten. Wirklich nur zwei. Danach darfst du neu entscheiden.\n\nDein Ziel ist nicht, alles zu erledigen. Dein Ziel ist erstmal, anzufangen." },
    { keys: ["schule", "arbeit", "lernen", "prüfung", "hausaufgaben"], answer: "Der Berg sieht von unten immer riesig aus. 🏔️ Such dir einen einzigen Abschnitt aus: fünf Minuten lernen, eine Aufgabe öffnen oder deine Sachen bereitlegen.\n\nDu musst nicht alles heute können. Du darfst lernen, Schritt für Schritt." },
    { keys: ["angst", "sorge", "sorgen", "gedanken", "grübeln"], answer: "Wenn die Gedanken im Kreis laufen, fühlt sich das oft sehr anstrengend an. Du musst sie nicht mit Gewalt wegdrücken. Versuch mal: „Ich merke gerade, dass ich mir Sorgen mache.“ Dann richte deine Aufmerksamkeit auf drei Dinge, die du sehen kannst.\n\nWenn dich das häufig belastet, erzähl bitte auch einem vertrauten Menschen davon." },
    { keys: ["danke", "lieb", "nett"], answer: "Sehr gern. 💚 Und ganz offiziell: Du darfst dir selbst auch ein bisschen Freundlichkeit geben. Du bist schließlich rund um die Uhr mit dir unterwegs – da lohnt sich ein netter Umgang." },
    { keys: ["hallo", "hi", "hey", "moin"], answer: "Hallöchen! 🌱 Schön, dass du da bist. Was brauchst du gerade eher: einen kleinen Motivationsschubs, einen lustigen Spruch oder jemanden, der dir beim Sortieren hilft?" },
    { keys: ["positiv", "spruch", "impuls", "mut"], answer: "Ein kleiner Impuls für dich: Du musst nicht warten, bis du dich bereit fühlst. Manchmal kommt das Vertrauen erst, nachdem du den ersten kleinen Schritt gemacht hast. ✨" }
  ];
  const fallbackReplies = [
    "Ich höre raus, dass dich etwas beschäftigt. 💚 Ich bin zwar nur eine Demo und verstehe nicht jede Nachricht, aber wir können es klein anfangen: Was wäre gerade eine Sache, die dir ein bisschen helfen könnte?",
    "Wenn dein Kopf gerade ein ganzes Meeting ohne Tagesordnung veranstaltet: Du darfst kurz Pause drücken. 🌿 Magst du mir sagen, ob du eher Trost, einen konkreten Tipp oder etwas Humor brauchst?",
    "Das kann ich nicht ganz sicher einordnen – ich bin noch eine vorbereitete Chat-Demo. Aber du musst nicht alles in einem Satz erklären. Was ist gerade der wichtigste Teil davon?"
  ];
  const crisisTerms = ["suizid", "umbringen", "nicht mehr leben", "mich verletzen", "selbstverletz", "mir etwas antun", "nicht mehr da sein"];
  const chatForm = $("#chatForm");
  const chatInput = $("#chatInput");
  const chatMessages = $("#chatMessages");

  function addMessage(text, who) {
    const wrapper = document.createElement("div");
    wrapper.className = `message message-${who}`;
    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;
    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = who === "bot" ? "Mentalchat · Demo" : "Du · gerade eben";
    wrapper.append(bubble, time);
    chatMessages.append(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function getReply(message) {
    const normalized = message.toLocaleLowerCase("de-DE");
    if (crisisTerms.some(term => normalized.includes(term))) {
      return "Es tut mir leid, dass es sich gerade so schwer anfühlt. Du musst damit nicht allein bleiben. Bitte wende dich jetzt an eine vertraute Person in deiner Nähe und sag ihr direkt, dass du Unterstützung brauchst. Wenn unmittelbare Gefahr besteht, ruf den örtlichen Notruf (in Deutschland 112) oder geh zu einer erwachsenen Vertrauensperson. Ich bin nur eine Demo und kann in einer Krise keine sichere persönliche Hilfe leisten.";
    }
    const match = responseSets.find(set => set.keys.some(key => normalized.includes(key)));
    return match ? match.answer : fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  }
  function sendMessage(message) {
    const clean = message.trim();
    if (!clean) return;
    addMessage(clean, "user");
    chatInput.value = "";
    $$(".suggestions button").forEach(button => button.disabled = true);
    window.setTimeout(() => {
      addMessage(getReply(clean), "bot");
      $$(".suggestions button").forEach(button => button.disabled = false);
    }, 350);
  }
  chatForm?.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(chatInput.value);
  });
  $$(".suggestions button").forEach(button => button.addEventListener("click", () => sendMessage(button.dataset.prompt || "")));

  $("#year").textContent = new Date().getFullYear();
})();