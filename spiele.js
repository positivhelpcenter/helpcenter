
const $ = (selector) => document.querySelector(selector);

const grid = $("#gameGrid");
const gameArea = $("#gameArea");
const gameContent = $("#gameContent");
const gameTitle = $("#activeGameTitle");

$("#year").textContent = new Date().getFullYear();

let activeCategory = "Alle";

function updateGames() {
  const search = $("#gameSearch").value.toLowerCase();
  let visible = 0;

  document.querySelectorAll(".game-card").forEach(card => {
    const matchesSearch = card.textContent.toLowerCase().includes(search);
    const matchesCategory = activeCategory === "Alle" ||
      card.dataset.category === activeCategory;

    card.hidden = !(matchesSearch && matchesCategory);
    if (!card.hidden) visible++;
  });

  $("#gameCount").textContent = visible + " SPIELE";
  $("#noGames").hidden = visible !== 0;
}

$("#gameSearch").addEventListener("input", updateGames);

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.filter;
    updateGames();
  });
});

let cleanupGame = null;

function openGame(name, title, render) {
  if (cleanupGame) cleanupGame();

  gameTitle.textContent = title;
  gameContent.innerHTML = "";
  gameArea.hidden = false;

  render();

  gameArea.scrollIntoView({ behavior: "smooth", block: "start" });
}

function message(text) {
  const p = document.createElement("p");
  p.className = "game-message";
  p.textContent = text;
  gameContent.appendChild(p);
  return p;
}

function button(text, action) {
  const b = document.createElement("button");
  b.className = "game-button";
  b.textContent = text;
  b.addEventListener("click", action);
  gameContent.appendChild(b);
  return b;
}

function heading(text) {
  const h = document.createElement("h3");
  h.textContent = text;
  gameContent.appendChild(h);
  return h;
}

function paragraph(text) {
  const p = document.createElement("p");
  p.textContent = text;
  gameContent.appendChild(p);
  return p;
}

$("#closeGame").addEventListener("click", () => {
  if (cleanupGame) cleanupGame();
  cleanupGame = null;
  gameArea.hidden = true;
  gameContent.innerHTML = "";
  grid.scrollIntoView({ behavior: "smooth" });
});

grid.addEventListener("click", event => {
  const card = event.target.closest(".game-card");
  if (!card) return;

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

  const game = games[card.dataset.game];
  if (game) openGame(card.dataset.game, game[0], game[1]);
});

/* 1. MEMORY */

function startMemory() {
  const emojis = ["🍋","🐸","🚀","🍕","🌈","🐱","⭐","🎈"];
  const cards = [...emojis, ...emojis].sort(() => Math.random() - .5);

  let first = null;
  let locked = false;
  let matched = 0;
  let moves = 0;

  const info = paragraph("Züge: 0 | Gefundene Paare: 0");
  const area = document.createElement("div");
  area.className = "memory-grid";
  gameContent.appendChild(area);

  cards.forEach((emoji, index) => {
    const b = document.createElement("button");
    b.className = "memory-card";
    b.textContent = "?";
    b.setAttribute("aria-label", "Verdeckte Karte");

    b.addEventListener("click", () => {
      if (locked || b.classList.contains("revealed") || b.disabled) return;

      b.textContent = emoji;
      b.classList.add("revealed");
      b.setAttribute("aria-label", emoji);

      if (!first) {
        first = { b, emoji };
        return;
      }

      moves++;

      if (first.emoji === emoji) {
        matched += 2;
        b.disabled = true;
        first.b.disabled = true;
        first = null;
        info.textContent = `Züge: ${moves} | Gefundene Paare: ${matched / 2}`;

        if (matched === cards.length) {
          info.textContent += " – Gewonnen! 🎉";
        }
      } else {
        locked = true;
        const previous = first;
        first = null;

        setTimeout(() => {
          b.textContent = "?";
          previous.b.textContent = "?";
          b.classList.remove("revealed");
          previous.b.classList.remove("revealed");
          b.setAttribute("aria-label", "Verdeckte Karte");
          previous.b.setAttribute("aria-label", "Verdeckte Karte");
          locked = false;
        }, 800);

        info.textContent = `Züge: ${moves} | Gefundene Paare: ${matched / 2}`;
      }
    });

    area.appendChild(b);
  });

  button("Neu starten", () => startMemory());
}

/* 2. SNAKE */

function startSnake() {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 320;
  gameContent.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const cell = 16;
  let snake = [{x: 10, y: 10}];
  let food = {x: 5, y: 5};
  let direction = {x: 1, y: 0};
  let next = direction;
  let score = 0;
  let running = true;
  const info = message("Punkte: 0");
  const placeFood = () => {
    food = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20)
    };
  };

  function key(e) {
    const keys = {
      ArrowUp: {x: 0, y: -1},
      ArrowDown: {x: 0, y: 1},
      ArrowLeft: {x: -1, y: 0},
      ArrowRight: {x: 1, y: 0},
      w: {x: 0, y: -1},
      s: {x: 0, y: 1},
      a: {x: -1, y: 0},
      d: {x: 1, y: 0}
    };

    if (keys[e.key]) {
      e.preventDefault();
      const d = keys[e.key];
      if (d.x !== -direction.x || d.y !== -direction.y) next = d;
    }
  }

  window.addEventListener("keydown", key);

  function tick() {
    if (!running) return;

    direction = next;
    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };

    if (
      head.x < 0 || head.x >= 20 ||
      head.y < 0 || head.y >= 20 ||
      snake.some(p => p.x === head.x && p.y === head.y)
    ) {
      running = false;
      info.textContent = `Spiel vorbei! Punkte: ${score}`;
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      info.textContent = `Punkte: ${score}`;
      placeFood();
    } else {
      snake.pop();
    }

    ctx.fillStyle = "#fff9e9";
    ctx.fillRect(0, 0, 320, 320);
    ctx.fillStyle = "#f7cf45";
    ctx.fillRect(food.x * cell, food.y * cell, cell, cell);
    ctx.fillStyle = "#171717";

    snake.forEach(p => {
      ctx.fillRect(p.x * cell + 1, p.y * cell + 1, 14, 14);
    });
  }

  const timer = setInterval(tick, 130);
  cleanupGame = () => {
    running = false;
    clearInterval(timer);
    window.removeEventListener("keydown", key);
  };

  paragraph("Steuerung: Pfeiltasten oder WASD. Auf dem Handy die Steuerung unten nutzen.");

  ["⬆","⬅","⬇","➡"].forEach((label, i) => {
    button(label, () => {
      const directions = [
        {x: 0, y: -1},
        {x: -1, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 0}
      ];
      const d = directions[i];
      if (d.x !== -direction.x || d.y !== -direction.y) next = d;
    });
  });

  button("Neu starten", () => startSnake());
}

/* 3. REAKTIONSTEST */

function startReaction() {
  heading("Teste deine Reaktionszeit!");
  const info = paragraph("Drücke Start und warte auf Grün.");
  let timeout;
  let startTime = 0;
  let state = "idle";

  const area = document.createElement("div");
  area.style.cssText = "padding:55px 15px;text-align:center;border-radius:12px;background:#eee8d8;font-size:24px;font-weight:bold;";
  area.textContent = "Bereit?";
  gameContent.appendChild(area);

  button("Start", () => {
    clearTimeout(timeout);
    state = "waiting";
    area.style.background = "#e5a3a3";
    area.textContent = "Warte ...";

    timeout = setTimeout(() => {
      state = "go";
      startTime = performance.now();
      area.style.background = "#a8dfad";
      area.textContent = "JETZT KLICKEN!";
    }, 1500 + Math.random() * 3000);
  });

  area.addEventListener("click", () => {
    if (state === "waiting") {
      clearTimeout(timeout);
      state = "idle";
      info.textContent = "Zu früh! Versuch es noch einmal.";
    } else if (state === "go") {
      const time = Math.round(performance.now() - startTime);
      state = "idle";
      area.textContent = time + " ms";
      info.textContent = `Deine Reaktionszeit: ${time} Millisekunden!`;
    }
  });

  cleanupGame = () => clearTimeout(timeout);
}

/* 4. TIC TAC TOE */

function startTicTacToe() {
  let board = Array(9).fill("");
  let finished = false;

  const status = message("Du bist X. Der Computer ist O.");
  const area = document.createElement("div");
  area.className = "ttt-grid";
  gameContent.appendChild(area);

  function winner(b) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (const [a,b1,c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return b.every(Boolean) ? "draw" : null;
  }

  function render() {
    area.innerHTML = "";

    board.forEach((value, index) => {
      const b = document.createElement("button");
      b.className = "ttt-cell";
      b.textContent = value;
      b.addEventListener("click", () => {
        if (finished || board[index]) return;

        board[index] = "X";
        const result = winner(board);

        if (result) {
          end(result);
          return;
        }

        const empty = board.map((v,i) => v ? -1 : i).filter(i => i >= 0);
        const move = empty[Math.floor(Math.random() * empty.length)];
        board[move] = "O";

        const after = winner(board);
        if (after) end(after);
        else render();
      });

      area.appendChild(b);
    });
  }

  function end(result) {
    finished = true;
    status.textContent = result === "X" ? "Du hast gewonnen! 🎉" :
      result === "O" ? "Der Computer gewinnt!" : "Unentschieden!";
    render();
  }

  render();
  button("Neu starten", () => startTicTacToe());
}

/* 5. ZAHLENRATEN */

function startNumber() {
  const secret = Math.floor(Math.random() * 100) + 1;
  let tries = 0;

  heading("Ich denke an eine Zahl zwischen 1 und 100.");
  const input = document.createElement("input");
  input.type = "number";
  input.min = "1";
  input.max = "100";
  input.placeholder = "Deine Zahl";
  input.className = "number-input";
  gameContent.appendChild(input);

  const info = message("Viel Glück!");

  function guess() {
    const value = Number(input.value);
    if (!Number.isInteger(value) || value < 1 || value > 100) {
      info.textContent = "Bitte eine Zahl zwischen 1 und 100 eingeben.";
      return;
    }

    tries++;

    if (value === secret) {
      info.textContent = `Richtig! 🎉 Du hast ${tries} Versuche gebraucht.`;
    } else if (value < secret) {
      info.textContent = "Die gesuchte Zahl ist größer!";
    } else {
      info.textContent = "Die gesuchte Zahl ist kleiner!";
    }

    input.value = "";
    input.focus();
  }

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") guess();
  });

  button("Raten", guess);
  button("Neu starten", () => startNumber());
}

/* 6. BRICK BREAKER */

function startBreaker() {
  const canvas = document.createElement("canvas");
  canvas.width = 360;
  canvas.height = 300;
  gameContent.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let x = 180, y = 240, dx = 3, dy = -3;
  let paddle = 140;
  const bricks = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      bricks.push({
        x: 10 + col * 49,
        y: 20 + row * 23,
        active: true
      });
    }
  }

  let running = true;
  const info = message("Bewege den Balken mit der Maus oder den Pfeiltasten.");

  function move(e) {
    const rect = canvas.getBoundingClientRect();
    paddle = Math.max(0, Math.min(300,
      (e.clientX - rect.left) * canvas.width / rect.width - 30));
  }

  function key(e) {
    if (e.key === "ArrowLeft") paddle = Math.max(0, paddle - 25);
    if (e.key === "ArrowRight") paddle = Math.min(300, paddle + 25);
  }

  canvas.addEventListener("pointermove", move);
  window.addEventListener("keydown", key);

  function draw() {
    if (!running) return;

    ctx.clearRect(0, 0, 360, 300);
    ctx.fillStyle = "#f7cf45";

    bricks.forEach(b => {
      if (b.active) ctx.fillRect(b.x, b.y, 43, 15);
    });

    ctx.fillStyle = "#171717";
    ctx.fillRect(paddle, 280, 60, 9);
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    x += dx;
    y += dy;

    if (x < 6 || x > 354) dx *= -1;
    if (y < 6) dy *= -1;

    if (y > 270 && y < 290 && x > paddle && x < paddle + 60) dy *= -1;

    if (y > 300) {
      running = false;
      info.textContent = "Spiel vorbei! Versuche es erneut.";
      return;
    }

    bricks.forEach(b => {
      if (b.active && x > b.x && x < b.x + 43 && y > b.y && y < b.y + 15) {
        b.active = false;
        dy *= -1;
      }
    });

    if (bricks.every(b => !b.active)) {
      running = false;
      info.textContent = "Gewonnen! Alle Steine zerstört! 🎉";
      return;
    }

    frame = requestAnimationFrame(draw);
  }

  let frame = requestAnimationFrame(draw);

  cleanupGame = () => {
    running = false;
    cancelAnimationFrame(frame);
    canvas.removeEventListener("pointermove", move);
    window.removeEventListener("keydown", key);
  };

  button("Neu starten", () => startBreaker());
}

/* 7. WÖRTERSUche */

function startWords() {
  const words = ["SONNE", "KATZE", "APFEL"];
  const size = 8;
  const letters = Array.from({length: size * size}, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)));

  words.forEach((word, index) => {
    const row = index * 2;
    for (let i = 0; i < word.length; i++) {
      letters[row * size + i] = word[i];
    }
  });

  heading("Finde die versteckten Wörter!");
  paragraph("Gesucht: " + words.join(", "));

  const found = [];
  const area = document.createElement("div");
  area.className = "word-grid";
  gameContent.appendChild(area);

  letters.forEach((letter, index) => {
    const b = document.createElement("button");
    b.className = "word-cell";
    b.textContent = letter;
    b.addEventListener("click", () => {
      b.classList.toggle("selected");
      check();
    });
    area.appendChild(b);
  });

  const info = message("Markiere die Buchstaben eines Wortes von links nach rechts.");

  function check() {
    const selected = [...area.children]
      .filter(b => b.classList.contains("selected"))
      .map(b => b.textContent).join("");

    if (words.includes(selected) && !found.includes(selected)) {
      found.push(selected);
      info.textContent = `Gefunden: ${found.join(", ")}`;

      if (found.length === words.length) {
        info.textContent = "Alle Wörter gefunden! 🎉";
      }
    }
  }

  button("Neu starten", () => startWords());
}

/* 8. MINI RUNNER */

function startRunner() {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 220;
  gameContent.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let playerY = 165;
  let velocity = 0;
  let jumping = false;
  let obstacleX = 400;
  let score = 0;
  let running = true;

  const info = message("Punkte: 0");

  function jump() {
    if (!jumping && running) {
      velocity = -11;
      jumping = true;
    }
  }

  function key(e) {
    if (e.code === "Space" || e.key === "ArrowUp") {
      e.preventDefault();
      jump();
    }
  }

  window.addEventListener("keydown", key);
  canvas.addEventListener("pointerdown", jump);

  function draw() {
    if (!running) return;

    ctx.clearRect(0, 0, 400, 220);

    velocity += .5;
    playerY += velocity;

    if (playerY >= 165) {
      playerY = 165;
      velocity = 0;
      jumping = false;
    }

    obstacleX -= 5;

    if (obstacleX < -20) {
      obstacleX = 400 + Math.random() * 100;
      score++;
      info.textContent = "Punkte: " + score;
    }

    ctx.fillStyle = "#171717";
    ctx.fillRect(0, 190, 400, 3);
    ctx.fillRect(45, playerY, 25, 25);
    ctx.fillStyle = "#f7cf45";
    ctx.fillRect(obstacleX, 165, 22, 25);

    if (
      obstacleX < 70 && obstacleX + 22 > 45 &&
      playerY + 25 > 165
    ) {
      running = false;
      info.textContent = `Spiel vorbei! Dein Ergebnis: ${score}`;
      return;
    }

    frame = requestAnimationFrame(draw);
  }

  let frame = requestAnimationFrame(draw);

  cleanupGame = () => {
    running = false;
    cancelAnimationFrame(frame);
    window.removeEventListener("keydown", key);
  };

  paragraph("Leertaste, Pfeil nach oben oder tippen zum Springen.");

  button("Neu starten", () => startRunner());
}
