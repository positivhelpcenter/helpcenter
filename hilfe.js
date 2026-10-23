
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

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
      });
    });
  }

  const searchForm = document.getElementById("articleSearchForm");
  const searchInput = document.getElementById("articleSearch");
  const resultsBox = document.getElementById("searchResults");
  const resultList = document.getElementById("searchResultList");
  const articles = [...document.querySelectorAll(".help-article")];

  function normalize(value) {
    return value
      .toLocaleLowerCase("de-DE")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const ignoredWords = new Set([
    "aber", "als", "also", "am", "an", "auch", "auf", "aus",
    "bei", "bin", "bis", "bitte", "das", "dass", "dass", "dein",
    "deine", "dem", "den", "der", "des", "die", "dies", "doch",
    "du", "ein", "eine", "einem", "einen", "einer", "eines",
    "er", "es", "etwas", "für", "hat", "habe", "haben", "hier",
    "ich", "im", "in", "ist", "ja", "kann", "kein", "keine",
    "mit", "mir", "mich", "nach", "nicht", "noch", "oder", "sehr",
    "sie", "sind", "so", "und", "uns", "unsere", "vom", "von",
    "war", "was", "wie", "wir", "zu", "zum", "zur"
  ]);

  function getWords(value) {
    return normalize(value)
      .split(" ")
      .filter((word) => word.length > 2 && !ignoredWords.has(word));
  }

  function scoreArticle(article, queryWords, normalizedQuery) {
    const title = normalize(article.dataset.title || "");
    const keywords = normalize(article.dataset.keywords || "");
    const body = normalize(article.innerText || "");
    const allText = `${title} ${keywords} ${body}`;
    let score = 0;

    for (const word of queryWords) {
      if (title.split(" ").includes(word)) score += 8;
      else if (title.includes(word)) score += 5;

      if (keywords.split(" ").includes(word)) score += 6;
      else if (keywords.includes(word)) score += 3;

      if (body.split(" ").includes(word)) score += 2;
      else if (body.includes(word)) score += 1;
    }

    if (normalizedQuery.length >= 5 && title.includes(normalizedQuery)) {
      score += 12;
    }

    // Wenn fast der ganze Suchtext im Artikel vorkommt,
    // ist das ein besonders starker Treffer.
    const matchedWords = queryWords.filter((word) =>
      allText.includes(word)
    ).length;

    if (queryWords.length > 1) {
      score += Math.round((matchedWords / queryWords.length) * 5);
    }

    return score;
  }

  function showResults(query) {
    const normalizedQuery = normalize(query);
    const queryWords = [...new Set(getWords(query))];

    resultList.replaceChildren();
    resultsBox.hidden = false;

    if (!queryWords.length) {
      resultList.textContent =
        "Gib bitte ein Thema oder ein paar beschreibende Wörter ein.";
      return;
    }

    const ranked = articles
      .map((article) => ({
        article,
        score: scoreArticle(article, queryWords, normalizedQuery)
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (!ranked.length) {
      const message = document.createElement("p");
      message.textContent =
        "Ich habe keinen eindeutigen Treffer gefunden. Probiere ein anderes Wort oder wähle unten ein Thema. Wenn du dich akut unsicher fühlst, hole bitte direkt Unterstützung.";
      resultList.appendChild(message);
      return;
    }

    const bestScore = ranked[0].score;
    const bestMatches = ranked.filter(
      (item) => item.score === bestScore
    );

    const intro = document.createElement("p");
    intro.className = "search-match-note";
    intro.textContent =
      bestMatches.length === 1
        ? "Dieser Artikel passt am besten zu deinen Suchbegriffen."
        : "Diese Artikel passen am besten zu deinen Suchbegriffen.";
    resultList.appendChild(intro);

    // Den stärksten Treffer zeigen wir zuerst.
    // Bei Gleichstand erscheinen mehrere passende Artikel.
    ranked.slice(0, 3).forEach(({ article, score }, index) => {
      const link = document.createElement("a");
      link.className = "search-result-card";
      link.href = `#${article.id}`;

      const label = document.createElement("span");
      label.className = "search-result-index";
      label.textContent = index === 0 ? "BESTER TREFFER" : "WEITERER TREFFER";

      const title = document.createElement("strong");
      title.textContent = article.dataset.title || "Hilfe-Artikel";

      const description = document.createElement("span");
      description.textContent =
        article.querySelector(":scope > p:not(.eyebrow)")?.textContent || "";

      link.append(label, title, description);
      resultList.appendChild(link);

      if (index === 0 || score === bestScore) {
        article.classList.add("article-match");
      } else {
        article.classList.remove("article-match");
      }
    });

    articles.forEach((article) => {
      if (!ranked.some((item) => item.article === article)) {
        article.classList.remove("article-match");
      }
    });
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      showResults(searchInput.value);
    });
  }

  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      const topic = button.dataset.topic;
      const article = articles.find(
        (item) => item.dataset.article === topic
      );

      if (article) {
        searchInput.value =
          `${article.dataset.title || ""} ${article.dataset.keywords || ""}`;
        showResults(searchInput.value);
        resultsBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  document.querySelectorAll(".article-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const article = button.closest(".help-article");
      if (!article) return;

      const isOpen = article.classList.toggle("is-expanded");
      button.setAttribute("aria-expanded", String(isOpen));
      button.textContent = isOpen ? "Artikel schließen ↑" : "Artikel öffnen ↓";
    });
  });

  const year = document.getElementById("currentYear");
  if (year) year.textContent = String(new Date().getFullYear());
});
