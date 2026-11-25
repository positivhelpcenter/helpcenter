
"use strict";

/* =========================================
   POSITIVHELPCENTER – SPIELHALLE
   PC · iPad · Smartphone
========================================= */

const $ = selector => document.querySelector(selector);

const gameGrid = $("#gameGrid");
const gameArea = $("#gameArea");
const gameContent = $("#gameContent");
const gameTitle = $("#activeGameTitle");

$("#year").textContent = new Date().getFullYear();

let activeCategory = "Alle";
let currentGame = null;
let currentGameId = null;
let currentCleanup = null;

const games = {
  memory: ["Memory", startMemory],
  snake: ["Snake", startSnake],
  reaction: ["Reaktionstest", startReaction],
  tictactoe: ["Tic Tac Toe", startTicTacToe],
  number: ["Zahlenraten", startNumber],
  breaker: ["Brick Breaker", startBreaker],
  words: ["Wörtersuche", startWords],
  runner: ["Mini Runner", startRunner]
};

/* =========================================
   SUCHE UND KATEGORIEN
========================================= */

function updateGames() {
  const search = $("#gameSearch").value.toLowerCase();
  let count = 0;

  document.querySelectorAll(".game-card").forEach(card => {
    const visible =
      (activeCategory === "Alle" ||
       card.dataset.category === activeCategory) &&
      card.textContent.toLowerCase().includes(search);

    card.hidden = !visible;

    if (visible) count++;
  });

  $("#gameCount").textContent = count + " SPIELE";
  $("#noGames").hidden = count !== 0;
}

$("#gameSearch").addEventListener("input", updateGames);

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b =>
      b.classList.remove("active")
    );

    button.classList.add("active");
    activeCategory = button.dataset.filter;

    updateGames();
  });
});

/* =========================================
   SPIELVERWALTUNG
========================================= */

function stopGame() {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }
}

function startGame(id) {
  if (!games[id]) return;

  stopGame();

  currentGameId = id;
  currentGame = games[id][1];

  gameTitle.textContent = games[id][0];
  gameArea.hidden = false;

  renderCurrentGame();

  gameArea.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function renderCurrentGame() {
  if (!currentGame) return;

  stopGame();

  const render = currentGame;

  gameContent.replaceChildren();

  let cleanups = [];

  currentCleanup = () => {
    cleanups.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error("Cleanup-Fehler:", error);
      }
    });

    cleanups = [];
  };

  const api = {
    addCleanup(fn) {
      cleanups.push(fn);
    },

    addTimer(fn, delay) {
      const timer = setTimeout(fn, delay);
      cleanups.push(() => clearTimeout(timer));
      return timer;
    },

    addInterval(fn, delay) {
      const timer = setInterval(fn, delay);
      cleanups.push(() => clearInterval(timer));
      return timer;
    },

    addAnimation(fn) {
      let frame = null;
      let active = true;

      function loop() {
        if (!active) return;

        const keepGoing = fn();

        if (keepGoing === false) {
          active = false;
          return;
        }

        frame = requestAnimationFrame(loop);
      }

      frame = requestAnimationFrame(loop);

      cleanups.push(() => {
        active = false;

        if (frame !== null) {
          cancelAnimationFrame(frame);
        }
      });
    },

    listen(target, event, fn, options) {
      target.addEventListener(event, fn, options);

      cleanups.push(() => {
        target.removeEventListener(event, fn, options);
      });
    }
  };

  render(api);
}

gameGrid.addEventListener("click", event => {
  const card = event.target.closest(".game-card");

  if (card) {
    startGame(card.dataset.game);
  }
});

$("#closeGame").addEventListener("click", () => {
  stopGame();

  currentGame = null;
  currentGameId = null;

  gameArea.hidden = true;
  gameContent.replaceChildren();

  gameGrid.scrollIntoView({
    behavior: "smooth"
  });
});

/* =========================================
   ALLGEMEINE SPIEL-HILFSFUNKTIONEN
========================================= */

function element(tag, text, parent = gameContent, className = "") {
  const el = document.createElement(tag);

  if (text !== undefined) {
    el.textContent = text;
  }

  if (className) {
    el.className = className;
  }

  parent.appendChild(el);

  return el;
}

function heading(text) {
  return element("h3", text);
}

function paragraph(text) {
  return element("p", text);
}

function message(text) {
  return element("p", text, gameContent, "game-message");
}

function button(text, action, parent = gameContent) {
  const b = element("button", text, parent, "game-button");

  b.type = "button";
  b.addEventListener("click", action);

  return b;
}

function restartButton() {
  button("↻ Spiel neu starten", renderCurrentGame);
}

function canvas(width, height) {
  const c = element("canvas");

  c.width = width;
  c.height = height;

  c.setAttribute("aria-label", "Spielfeld");

  return c;
}

/* =========================================
   1. MEMORY
========================================= */

function startMemory(api) {
  heading("Memory");
  paragraph("Finde alle Kartenpaare!");

  const info = message("Züge: 0 | Paare: 0");

  const emojis = [
    "🍋", "🐸", "🚀", "🍕",
    "🌈", "🐱", "⭐", "🎈"
  ];

  const cards = [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5);

  const area = element(
    "div",
    undefined,
    gameContent,
    "memory-grid"
  );

  let first = null;
  let locked = false;
  let moves = 0;
  let matched = 0;

  cards.forEach(emoji => {
    const b = button("?", () => {
      if (
        locked ||
        b.disabled ||
        b.classList.contains("revealed")
      ) return;

      b.textContent = emoji;
      b.classList.add("revealed");

      if (!first) {
        first = { button: b, emoji };
        return;
      }

      moves++;

      if (first.emoji === emoji) {
        matched++;

        b.disabled = true;
        first.button.disabled = true;

        first = null;

        info.textContent =
          `Züge: ${moves} | Paare: ${matched}`;

        if (matched === emojis.length) {
          info.textContent += " – Gewonnen! 🎉";
        }

      } else {
        locked = true;

        const previous = first;
        first = null;

        api.addTimer(() => {
          b.textContent = "?";
          previous.button.textContent = "?";

          b.classList.remove("revealed");
          previous.button.classList.remove("revealed");

          locked = false;
        }, 800);

        info.textContent =
          `Züge: ${moves} | Paare: ${matched}`;
      }
    }, area);

    b.classList.add("memory-card");
    b.setAttribute("aria-label", "Verdeckte Karte");
  });

  restartButton();
}

/* =========================================
   2. SNAKE
========================================= */

function startSnake(api) {
  heading("Snake");

  paragraph(
    "PC: Pfeiltasten oder WASD. " +
    "Handy und iPad: Steuerkreuz oder Wischen."
  );

  const c = canvas(400, 400);
  c.classList.add("game-canvas");

  const ctx = c.getContext("2d");
  const cell = 20;

  let snake;
  let food;
  let direction;
  let nextDirection;
  let score;
  let running;

  const info = message("");

  function reset() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    score = 0;
    running = true;

    info.textContent = "Punkte: 0";
  }

  function placeFood() {
    do {
      food = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
      };
    } while (
      snake.some(p =>
        p.x === food.x && p.y === food.y
      )
    );
  }

  function changeDirection(d) {
    if (
      d.x !== -direction.x ||
      d.y !== -direction.y
    ) {
      nextDirection = d;
    }
  }

  const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 }
  };

  api.listen(window, "keydown", e => {
    if (directions[e.key]) {
      e.preventDefault();
      changeDirection(directions[e.key]);
    }
  });

  let touchStart = null;

  api.listen(c, "pointerdown", e => {
    touchStart = {
      x: e.clientX,
      y: e.clientY
    };
  });

  api.listen(c, "pointerup", e => {
    if (!touchStart) return;

    const dx = e.clientX - touchStart.x;
    const dy = e.clientY - touchStart.y;

    touchStart = null;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < 15) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      changeDirection({
        x: Math.sign(dx),
        y: 0
      });
    } else {
      changeDirection({
        x: 0,
        y: Math.sign(dy)
      });
    }
  });

  function tick() {
    if (!running) return;

    direction = nextDirection;

    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };

    const eating =
      head.x === food.x &&
      head.y === food.y;

    const body = eating
      ? snake
      : snake.slice(0, -1);

    if (
      head.x < 0 ||
      head.x >= 20 ||
      head.y < 0 ||
      head.y >= 20 ||
      body.some(p =>
        p.x === head.x && p.y === head.y
      )
    ) {
      running = false;
      info.textContent = `Spiel vorbei! Punkte: ${score}`;
      return;
    }

    snake.unshift(head);

    if (eating) {
      score++;
      placeFood();
      info.textContent = "Punkte: " + score;
    } else {
      snake.pop();
    }

    ctx.fillStyle = "#fff9e9";
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = "#f7cf45";
    ctx.fillRect(
      food.x * cell,
      food.y * cell,
      cell,
      cell
    );

    ctx.fillStyle = "#171717";

    snake.forEach(p => {
      ctx.fillRect(
        p.x * cell + 1,
        p.y * cell + 1,
        18,
        18
      );
    });
  }

  reset();

  api.addInterval(tick, 130);

  const controls = element(
    "div",
    undefined,
    gameContent,
    "snake-controls"
  );

  [
    ["⬆", { x: 0, y: -1 }],
    ["⬅", { x: -1, y: 0 }],
    ["⬇", { x: 0, y: 1 }],
    ["➡", { x: 1, y: 0 }]
  ].forEach(([label, dir]) => {
    button(label, () => changeDirection(dir), controls);
  });

  restartButton();
}

/* =========================================
   3. REAKTIONSTEST
========================================= */

function startReaction(api) {
  heading("Reaktionstest");

  const info = message(
    "Drücke Start und warte auf das grüne Signal."
  );

  const area = element(
    "button",
    "BEREIT?",
    gameContent,
    "reaction-area"
  );

  area.type = "button";

  let state = "idle";
  let startTime = 0;

  button("Start", () => {
    state = "waiting";

    area.className = "reaction-area waiting";
    area.textContent = "Warte auf Grün ...";

    api.addTimer(() => {
      if (state !== "waiting") return;

      state = "go";

      startTime = performance.now();

      area.className = "reaction-area go";
      area.textContent = "JETZT!";
    }, 1500 + Math.random() * 3000);
  });

  area.addEventListener("click", () => {
    if (state === "waiting") {
      state = "idle";
      info.textContent = "Zu früh! Starte noch einmal.";

    } else if (state === "go") {
      const result = Math.round(
        performance.now() - startTime
      );

      state = "idle";

      area.textContent = result + " ms";

      info.textContent =
        `Deine Reaktionszeit: ${result} Millisekunden!`;
    }
  });

  restartButton();
}

/* =========================================
   4. TIC TAC TOE
========================================= */

function startTicTacToe() {
  heading("Tic Tac Toe");

  const status = message(
    "Du bist X. Der Computer ist O."
  );

  const area = element(
    "div",
    undefined,
    gameContent,
    "ttt-grid"
  );

  let board = Array(9).fill("");
  let finished = false;

  function winner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a];
      }
    }

    return board.every(Boolean) ? "draw" : null;
  }

  function findWinningMove(symbol) {
    const empty = board
      .map((v, i) => v ? -1 : i)
      .filter(i => i >= 0);

    for (const index of empty) {
      board[index] = symbol;

      const result = winner();

      board[index] = "";

      if (result === symbol) return index;
    }

    return null;
  }

  function finish(result) {
    finished = true;

    status.textContent =
      result === "X" ? "Du hast gewonnen! 🎉" :
      result === "O" ? "Der Computer gewinnt!" :
      "Unentschieden!";

    render();
  }

  function render() {
    area.replaceChildren();

    board.forEach((value, index) => {
      const b = button(value || " ", () => {
        if (finished || board[index]) return;

        board[index] = "X";

        let result = winner();

        if (result) {
          finish(result);
          return;
        }

        const empty = board
          .map((v, i) => v ? -1 : i)
          .filter(i => i >= 0);

        const move =
          findWinningMove("O") ??
          findWinningMove("X") ??
          empty[Math.floor(Math.random() * empty.length)];

        board[move] = "O";

        result = winner();

        if (result) {
          finish(result);
        } else {
          render();
        }
      }, area);

      b.classList.add("ttt-cell");
      b.disabled = !!value || finished;
    });
  }

  render();
  restartButton();
}

/* =========================================
   5. ZAHLENRATEN
========================================= */

function startNumber() {
  heading("Zahlenraten");

  paragraph(
    "Finde die geheime Zahl zwischen 1 und 100."
  );

  const secret = Math.floor(Math.random() * 100) + 1;
  let tries = 0;

  const input = element(
    "input",
    undefined,
    gameContent,
    "number-input"
  );

  input.type = "number";
  input.min = "1";
  input.max = "100";
  input.placeholder = "Deine Zahl";
  input.setAttribute("aria-label", "Deine Zahl");

  const info = message("Viel Glück!");

  function guess() {
    const value = Number(input.value);

    if (
      !Number.isInteger(value) ||
      value < 1 ||
      value > 100
    ) {
      info.textContent =
        "Bitte eine Zahl von 1 bis 100 eingeben.";
      return;
    }

    tries++;

    if (value === secret) {
      info.textContent =
        `Richtig! 🎉 Du hast ${tries} Versuche gebraucht.`;

      input.disabled = true;

    } else {
      info.textContent = value < secret
        ? "Die gesuchte Zahl ist größer!"
        : "Die gesuchte Zahl ist kleiner!";
    }

    input.value = "";
    input.focus();
  }

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") guess();
  });

  button("Raten", guess);

  restartButton();
}

/* =========================================
   6. BRICK BREAKER
========================================= */

function startBreaker(api) {
  heading("Brick Breaker");

  paragraph(
    "Steuere den Balken mit Maus, Touch oder Pfeiltasten."
  );

  const c = canvas(400, 320);
  const ctx = c.getContext("2d");

  const info = message("Viel Spaß!");

  let x, y, dx, dy, paddle, bricks, running;

  function reset() {
    x = 200;
    y = 260;
    dx = 3;
    dy = -3;
    paddle = 160;
    running = true;

    bricks = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 7; col++) {
        bricks.push({
          x: 10 + col * 55,
          y: 25 + row * 24,
          active: true
        });
      }
    }

    info.textContent = "Los geht's!";
  }

  function pointer(e) {
    const rect = c.getBoundingClientRect();

    paddle = Math.max(
      0,
      Math.min(
        320,
        (e.clientX - rect.left) * 400 / rect.width - 40
      )
    );
  }

  api.listen(c, "pointermove", pointer);

  api.listen(window, "keydown", e => {
    if (e.key === "ArrowLeft") {
      paddle = Math.max(0, paddle - 25);
    }

    if (e.key === "ArrowRight") {
      paddle = Math.min(320, paddle + 25);
    }
  });

  function draw() {
    ctx.clearRect(0, 0, 400, 320);

    ctx.fillStyle = "#f7cf45";

    bricks.forEach(b => {
      if (b.active) {
        ctx.fillRect(b.x, b.y, 49, 15);
      }
    });

    ctx.fillStyle = "#171717";
    ctx.fillRect(paddle, 300, 80, 10);

    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();

    if (!running) return false;

    x += dx;
    y += dy;

    if (x < 7 || x > 393) dx *= -1;
    if (y < 7) dy *= -1;

    if (
      dy > 0 &&
      y + 7 >= 300 &&
      y - 7 <= 310 &&
      x >= paddle &&
      x <= paddle + 80
    ) {
      dy *= -1;
    }

    bricks.forEach(b => {
      if (
        b.active &&
        x > b.x &&
        x < b.x + 49 &&
        y > b.y &&
        y < b.y + 15
      ) {
        b.active = false;
        dy *= -1;
      }
    });

    if (bricks.every(b => !b.active)) {
      running = false;
      info.textContent = "Gewonnen! 🎉";
    }

    if (y > 320) {
      running = false;
      info.textContent =
        "Spiel vorbei! Versuche es noch einmal.";
    }

    return running;
  }

  reset();

  api.addAnimation(draw);

  restartButton();
}

/* =========================================
   7. WÖRTERSUche
========================================= */

function startWords() {
  heading("Wörtersuche");

  const words = ["SONNE", "KATZE", "APFEL"];
  const size = 8;

  const letters = Array.from(
    { length: size * size },
    () => String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )
  );

  words.forEach((word, index) => {
    const row = index * 2;

    for (let i = 0; i < word.length; i++) {
      letters[row * size + i] = word[i];
    }
  });

  paragraph(
    "Finde diese Wörter: " + words.join(", ")
  );

  const area = element(
    "div",
    undefined,
    gameContent,
    "word-grid"
  );

  const info = message(
    "Wähle Buchstaben in einer Reihe aus."
  );

  const selected = [];
  const found = new Set();

  function update() {
    const word = selected
      .map(i => letters[i])
      .join("");

    if (words.includes(word) && !found.has(word)) {
      found.add(word);

      selected.forEach(i => {
        area.children[i].classList.add("found");
        area.children[i].classList.remove("selected");
      });

      selected.length = 0;

      info.textContent =
        `Gefunden: ${[...found].join(", ")}`;

      if (found.size === words.length) {
        info.textContent = "Alle Wörter gefunden! 🎉";
      }

      return;
    }

    if (!words.some(w => w.startsWith(word))) {
      selected.length = 0;

      [...area.children].forEach(b =>
        b.classList.remove("selected")
      );

      info.textContent =
        "Das war noch kein Wort. Versuch es erneut!";

      return;
    }

    info.textContent = "Ausgewählt: " + word;
  }

  letters.forEach((letter, index) => {
    const b = button(letter, () => {
      if (
        b.classList.contains("found") ||
        selected.includes(index)
      ) return;

      if (
        selected.length &&
        Math.floor(index / size) !==
        Math.floor(selected[0] / size)
      ) {
        selected.length = 0;

        [...area.children].forEach(el =>
          el.classList.remove("selected")
        );
      }

      if (
        selected.length &&
        index !== selected[selected.length - 1] + 1
      ) {
        selected.length = 0;

        [...area.children].forEach(el =>
          el.classList.remove("selected")
        );
      }

      selected.push(index);
      b.classList.add("selected");

      update();
    }, area);

    b.classList.add("word-cell");
  });

  restartButton();
}

/* =========================================
   8. MINI RUNNER
========================================= */

function startRunner(api) {
  heading("Mini Runner");

  paragraph(
    "Springe mit Leertaste, Pfeil nach oben oder durch Tippen."
  );

  const c = canvas(500, 250);
  const ctx = c.getContext("2d");

  const info = message("Punkte: 0");

  let playerY;
  let velocity;
  let jumping;
  let obstacleX;
  let score;
  let running;

  function reset() {
    playerY = 180;
    velocity = 0;
    jumping = false;
    obstacleX = 500;
    score = 0;
    running = true;

    info.textContent = "Punkte: 0";
  }

  function jump() {
    if (!jumping && running) {
      velocity = -12;
      jumping = true;
    }
  }

  api.listen(window, "keydown", e => {
    if (
      e.code === "Space" ||
      e.key === "ArrowUp"
    ) {
      e.preventDefault();
      jump();
    }
  });

  api.listen(c, "pointerdown", jump);

  function draw() {
    ctx.clearRect(0, 0, 500, 250);

    ctx.fillStyle = "#171717";
    ctx.fillRect(0, 215, 500, 3);
    ctx.fillRect(55, playerY, 28, 28);

    ctx.fillStyle = "#f7cf45";
    ctx.fillRect(obstacleX, 185, 25, 30);

    if (!running) return false;

    velocity += .55;
    playerY += velocity;

    if (playerY >= 180) {
      playerY = 180;
      velocity = 0;
      jumping = false;
    }

    obstacleX -= 5;

    if (obstacleX < -25) {
      obstacleX = 500 + Math.random() * 150;
      score++;

      info.textContent = "Punkte: " + score;
    }

    if (
      obstacleX < 83 &&
      obstacleX + 25 > 55 &&
      playerY + 28 > 185
    ) {
      running = false;

      info.textContent =
        "Spiel vorbei! Punkte: " + score;
    }

    return running;
  }

  reset();

  api.addAnimation(draw);

  restartButton();
}

/* =========================================
   START
========================================= */

updateGames();
