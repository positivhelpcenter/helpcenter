
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Mobile Navigation
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Menü schließen" : "Menü öffnen"
    );
  });

  $$("#mainNav a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Alltagshilfe-Karten
  const helpContent = {
    stress: {
      title: "Wir machen die Welt kurz kleiner.",
      text: "Stell beide Füße auf den Boden und atme langsam aus. Such dir dann nur eine Sache aus, die als Nächstes dran ist. Alles andere darf kurz warten."
    },
    sad: {
      title: "Du musst dich nicht sofort besser fühlen.",
      text: "Du darfst traurig sein, ohne dich dafür zu rechtfertigen. Vielleicht helfen dir Wasser, eine Decke, Musik oder eine Nachricht an einen Menschen, dem du vertraust. Ein kleiner Trost reicht für den Anfang."
    },
    motivation: {
      title: "Mach die Aufgabe lächerlich klein.",
      text: "Nicht „Zimmer aufräumen“, sondern „drei Dinge wegräumen“. Nicht „alles lernen“, sondern „fünf Minuten anfangen“. Ein Anfang muss nicht beeindruckend sein – nur machbar."
    },
    laugh: {
      title: "Dein Gehirn hat zu viele Tabs offen?",
      text: "Wir schließen erstmal drei. 😄 Du musst heute nicht das Betriebssystem deines ganzen Lebens aktualisieren. Ein Schluck Wasser und ein kleiner Reset sind schon ein Anfang."
    }
  };

  const quickHelp = $("#quickHelp");

  $$(".help-card").forEach(card => {
    card.addEventListener("click", () => {
      const content = helpContent[card.dataset.help];
      if (!content) return;

      $("#quickTitle").textContent = content.title;
      $("#quickText").textContent = content.text;
      quickHelp.hidden = false;
      quickHelp.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  $("#quickClose")?.addEventListener("click", () => {
    quickHelp.hidden = true;
  });

  $("#quickToChat")?.addEventListener("click", () => {
    const input = $("#chatInput");
    if (!input) return;

    input.value = "Ich könnte gerade Unterstützung gebrauchen.";
    $("#mentalchat").scrollIntoView({ behavior: "smooth" });
    input.focus({ preventScroll: true });
  });

  // Positive Sprüche
  const quotes = [
    {
      text: "Du musst nicht den ganzen Weg sehen. Es reicht, den nächsten Schritt zu erkennen.",
      category: "Kleine Schritte"
    },
    {
      text: "Du darfst stolz auf Dinge sein, die niemand sonst bemerkt hat.",
      category: "Selbstvertrauen"
    },
    {
      text: "Pause ist kein Rückschritt. Auch ein Handy muss mal laden.",
      category: "Mit Humor"
    },
    {
      text: "Ein schwieriger Tag ist ein Kapitel – nicht die ganze Geschichte.",
      category: "Zuversicht"
    },
    {
      text: "Du musst nicht perfekt sein, um etwas Gutes in die Welt zu bringen.",
      category: "Du zählst"
    },
    {
      text: "Manchmal ist der mutigste Plan: Wasser trinken, durchatmen und neu anfangen.",
      category: "Für heute"
    },
    {
      text: "Fortschritt kann auch bedeuten, freundlich mit dir selbst umzugehen.",
      category: "Selbstfürsorge"
    },
    {
      text: "Du darfst langsam gehen. Hauptsache, du behandelst dich dabei nicht wie deinen eigenen Feind.",
      category: "Freundlichkeit"
    },
    {
      text: "Nicht jeder Tag muss glänzen. Manchmal reicht es, wenn er einfach vorbeigeht.",
      category: "Gelassenheit"
    }
  ];

  let quoteIndex = 0;

  $("#newQuote")?.addEventListener("click", () => {
    let nextIndex = quoteIndex;

    while (quotes.length > 1 && nextIndex === quoteIndex) {
      nextIndex = Math.floor(Math.random() * quotes.length);
    }

    quoteIndex = nextIndex;
    $("#quoteText").textContent = quotes[quoteIndex].text;
    $("#quoteCategory").textContent = quotes[quoteIndex].category;
  });

  // Mentalchat: vorbereitete Antworten, keine echte KI
  const responseSets = [
    {
      keys: [
        "verzweifelt", "hoffnungslos", "am ende",
        "keinen ausweg", "weiß nicht weiter", "weiss nicht weiter"
      ],
      answer: "Hey, das klingt gerade wirklich schwer. 💚 Du musst das nicht perfekt erklären. Wir müssen nicht dein ganzes Leben auf einmal sortieren. Was ist gerade passiert? Ein Satz reicht."
    },
    {
      keys: [
        "depressiv", "depression", "depri", "deprimiert",
        "leer", "nichts macht spaß", "keine freude"
      ],
      answer: "Das klingt richtig anstrengend. 💚 Du musst dich nicht einfach zusammenreißen oder gute Laune vorspielen. Wenn du magst, erzähl mir, was gerade am meisten drückt. Wenn du dich schon länger so fühlst, wäre es gut, auch mit einer vertrauten Person darüber zu sprechen."
    },
    {
      keys: [
        "hilflos", "hilflosigkeit", "allein damit",
        "schaffe das nicht", "überfordert", "überforderung"
      ],
      answer: "Okay, wir machen den riesigen Problem-Berg erstmal zu einem kleinen Maulwurfshügel. 🐾 Du musst nicht alles sofort lösen. Was ist gerade das eine Ding, das am meisten drückt? Ein Satz reicht völlig."
    },
    {
      keys: [
        "ängstlich", "ängste", "angst", "fürchte",
        "sorge", "sorgen", "panik", "grübel",
        "gedankenkarussell"
      ],
      answer: "Uff, wenn der Kopf Alarm macht, obwohl man gerade einfach nur existieren wollte. 💚 Du musst nicht jede Sorge sofort klären. Schau dich kurz um und atme langsam aus. Wenn du magst: Wovor hast du gerade am meisten Angst?"
    },
    {
      keys: [
        "traurig", "weinen", "einsam", "schlecht",
        "down", "unglücklich", "verletzte gefühle"
      ],
      answer: "Das klingt nach einem miesen Moment. Ich mache jetzt keinen „Denk einfach positiv“-Spruch daraus. 💚 Magst du erzählen, was passiert ist? Wir können danach gemeinsam nach einem kleinen nächsten Schritt suchen."
    },
    {
      keys: [
        "zu viel", "stress", "druck", "keine zeit",
        "alles ist", "gestresst"
      ],
      answer: "Okay, dein Gehirn hat offenbar 37 Tabs offen und irgendwo spielt Musik. 😅 Wir müssen nicht alle gleichzeitig schließen. Was ist gerade am dringendsten? Such nur eine Sache aus."
    },
    {
      keys: [
        "witz", "lachen", "humor", "lustig",
        "gute laune", "scherz"
      ],
      answer: "Warum war der Kalender so gestresst? Seine Tage waren gezählt. 🥁😂 Soll noch ein Witz kommen oder lieber ein bisschen anderer Quatsch?"
    },
    {
      keys: [
        "motivation", "anfangen", "keine lust",
        "antrieb", "aufgabe"
      ],
      answer: "Wir verhandeln mit dem inneren Schweinehund: nur zwei Minuten anfangen, danach darf er wieder bellen. 🐶 Was willst du angehen? Ich helfe dir, es kleiner zu machen."
    },
    {
      keys: [
        "schule", "lernen", "prüfung", "hausaufgaben"
      ],
      answer: "Schule kann sich manchmal anfühlen wie ein Spiel, bei dem das Tutorial fehlt. 😅 Welche Aufgabe steht an? Wir können sie in kleinere Schritte teilen."
    },
    {
      keys: ["danke", "lieb", "nett"],
      answer: "Gern doch. 💚 Kleiner offizieller Bescheid: Du musst nicht erst alles im Griff haben, um freundlich zu dir selbst sein zu dürfen."
    },
    {
      keys: ["hallo", "hi", "hey", "moin", "na du"],
      answer: "Heeey! 😄 Was ist heute angesagt: Kopfchaos sortieren, ein bisschen Motivation oder komplett unnötige, aber wichtige Witze?"
    },
    {
      keys: ["positiv", "spruch", "impuls", "mut"],
      answer: "Mini-Erinnerung: Du musst heute nicht dein ganzes Leben auf die Reihe bekommen. Ein guter nächster Schritt reicht. Der Rest kann kurz in der Warteschlange chillen. 🌱"
    }
  ];

  const fallbackReplies = [
    "Ich bin zwar kein echter KI-Chat, aber ich versuche es mit dem, was ich kenne. 😅 Was meinst du genau? Erzähl es ruhig so, wie es dir einfällt.",
    "Da bin ich mir noch nicht ganz sicher. Geht es um Gefühle, Stress, Schule, jemanden oder brauchst du einfach Ablenkung?",
    "Mein Gedanken-Orakel braucht noch einen Hinweis. 🔮 Was ist der wichtigste Teil deiner Nachricht?"
  ];

  const crisisTerms = [
    "suizid", "umbringen", "nicht mehr leben",
    "mich verletzen", "selbstverletz", "mir etwas antun",
    "nicht mehr da sein"
  ];

  const chatForm = $("#chatForm");
  const chatInput = $("#chatInput");
  const chatMessages = $("#chatMessages");

  function addMessage(text, who) {
    if (!chatMessages) return;

    const wrapper = document.createElement("div");
    wrapper.className = `message message-${who}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;

    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = who === "bot"
      ? "Mentalchat · Demo"
      : "Du · gerade eben";

    wrapper.append(bubble, time);
    chatMessages.append(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getReply(message) {
    const normalized = message
      .toLocaleLowerCase("de-DE")
      .replace(/[.,!?;:()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (crisisTerms.some(term => normalized.includes(term))) {
      return "Es tut mir leid, dass es gerade so schwer ist. Bitte bleib damit nicht allein: Wende dich jetzt an eine vertraute erwachsene Person und sag offen, dass du Unterstützung brauchst. Wenn du unmittelbar in Gefahr bist, ruf in Deutschland 112. Ich bin nur eine Chat-Demo und kann persönliche Hilfe nicht ersetzen.";
    }

    const match = responseSets.find(set =>
      set.keys.some(key => normalized.includes(key))
    );

    return match
      ? match.answer
      : fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  }

  function sendMessage(message) {
    const clean = message.trim();
    if (!clean || !chatMessages || !chatInput) return;

    addMessage(clean, "user");
    chatInput.value = "";

    $$(".suggestions button").forEach(button => {
      button.disabled = true;
    });

    window.setTimeout(() => {
      addMessage(getReply(clean), "bot");

      $$(".suggestions button").forEach(button => {
        button.disabled = false;
      });
    }, 350);
  }

  chatForm?.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(chatInput.value);
  });

  $$(".suggestions button").forEach(button => {
    button.addEventListener("click", () => {
      sendMessage(button.dataset.prompt || "");
    });
  });

  // Jahreszahl im Footer
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
