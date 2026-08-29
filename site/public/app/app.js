import { analyze, CATEGORIES } from "./patterns.js";
import { analyzeClarity } from "./clarity.js";
import { buildEditingPrompt } from "./prompt.js";
import { loadDraft, saveDraft, clearDraft } from "./draft.js";

const input = document.getElementById("input");
const backdrop = document.getElementById("backdrop");

const elScore = document.getElementById("stat-score");
const elScoreMeter = document.getElementById("score-meter");
const elScoreLabel = document.getElementById("score-label");
const elTells = document.getElementById("stat-tells");
const elGrade = document.getElementById("stat-grade");
const elGradeLabel = document.getElementById("grade-label");
const elMini = document.getElementById("mini-stats");
const elSignals = document.getElementById("signals");
const elClarity = document.getElementById("clarity-checks");
const elClaritySummary = document.getElementById("clarity-summary");
const elLegend = document.getElementById("legend");
const elIssues = document.getElementById("issues");
const tooltip = document.getElementById("tooltip");
const tabButtons = [...document.querySelectorAll(".sidebar-tab")];
const tabPanels = [...document.querySelectorAll(".sidebar-panel")];
const draftStorage = (() => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
})();

const COLORS = {
  phrase: "#d56bff",
  aiword: "#ff9d3d",
  structure: "#ff5d6c",
  transition: "#8b97a6",
  veryhard: "#f0616d",
  hard: "#e3b341",
  passive: "#3fb6a8",
  adverb: "#5b8def",
  complex: "#a07bff",
};
// Higher number wins when underlines overlap on the same characters.
const WORD_PRIORITY = {
  structure: 7,
  phrase: 6,
  aiword: 5,
  transition: 4,
  complex: 3,
  passive: 2,
  adverb: 1,
};
const SENTENCE_CATS = new Set(["hard", "veryhard"]);

let activeFilter = null;

function activateTab(name, { focus = false } = {}) {
  for (const button of tabButtons) {
    const active = button.dataset.tab === name;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
    if (active && focus) button.focus();
  }
  for (const panel of tabPanels) {
    const active = panel.id === `panel-${name}`;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  }
}

tabButtons.forEach((button, index) => {
  button.addEventListener("click", () => activateTab(button.dataset.tab));
  button.addEventListener("keydown", (event) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabButtons.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabButtons.length) % tabButtons.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabButtons.length - 1;
    else return;
    event.preventDefault();
    activateTab(tabButtons[next].dataset.tab, { focus: true });
  });
});

// ---- Rendering -------------------------------------------------------------

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderBackdrop(text, marks) {
  const n = text.length;
  if (!n) {
    backdrop.innerHTML = "";
    return;
  }
  // Boundary set from every mark edge.
  const bset = new Set([0, n]);
  for (const m of marks) {
    if (m.start >= 0 && m.start <= n) bset.add(m.start);
    if (m.end >= 0 && m.end <= n) bset.add(m.end);
  }
  const bounds = [...bset].sort((a, b) => a - b);

  let html = "";
  for (let i = 0; i < bounds.length - 1; i++) {
    const a = bounds[i];
    const b = bounds[i + 1];
    if (b <= a) continue;
    let sentenceCat = null;
    let wordCat = null;
    let wordPri = -1;
    for (const m of marks) {
      if (m.start <= a && m.end >= b) {
        if (SENTENCE_CATS.has(m.cat)) {
          if (m.cat === "veryhard" || sentenceCat === null) sentenceCat = m.cat;
        } else {
          const p = WORD_PRIORITY[m.cat] ?? 0;
          if (p > wordPri) {
            wordPri = p;
            wordCat = m.cat;
          }
        }
      }
    }
    const chunk = escapeHtml(text.slice(a, b));
    if (sentenceCat || wordCat) {
      const cls = [];
      if (sentenceCat) cls.push(`s-${sentenceCat}`);
      if (wordCat) cls.push(`w-${wordCat}`);
      html += `<mark class="${cls.join(" ")}">${chunk}</mark>`;
    } else {
      html += chunk;
    }
  }
  // Keep a trailing newline visible so backdrop height matches the textarea.
  if (text.endsWith("\n")) html += " ";
  backdrop.innerHTML = html;
}

// ---- Sidebar ---------------------------------------------------------------

function fmtTime(sec) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

function renderStats(stats) {
  elScore.textContent = stats.score;
  elScoreMeter.style.width = `${stats.score}%`;
  elScoreMeter.style.background =
    stats.score < 10 ? "var(--ok)" : stats.score < 30 ? "var(--warn)" : "var(--danger)";
  elScoreLabel.textContent = stats.scoreLabel;
  elTells.textContent = stats.aiTells;
  elGrade.textContent = stats.grade;
  elGradeLabel.textContent = stats.gradeLabel;

  elMini.innerHTML = "";
  const add = (label, val) => {
    const span = document.createElement("span");
    span.innerHTML = `<b>${val}</b> ${label}`;
    elMini.appendChild(span);
  };
  add("words", stats.words);
  add("sentences", stats.sentences);
  add(stats.paragraphs === 1 ? "paragraph" : "paragraphs", stats.paragraphs);
  add("read", fmtTime(stats.readingTimeSec));
}

const SIGNAL_VERDICT = {
  low: { label: "low", cls: "sig-human" },
  review: { label: "review", cls: "sig-mixed" },
  high: { label: "high", cls: "sig-ai" },
  na: { label: "n/a", cls: "sig-na" },
};

function renderSignals(signals) {
  elSignals.innerHTML = "";
  for (const sig of signals || []) {
    const v = SIGNAL_VERDICT[sig.verdict] || SIGNAL_VERDICT.na;
    const row = document.createElement("div");
    row.className = "signal-row " + v.cls;
    row.innerHTML = `
      <span class="signal-name">${sig.label}</span>
      <span class="signal-value">${sig.display}</span>
      <span class="signal-badge">${v.label}</span>`;
    attachTip(row, sig.detail);
    elSignals.appendChild(row);
  }
}

const CLARITY_STATUS = {
  issue: { label: "issue", cls: "clarity-issue" },
  review: { label: "review", cls: "clarity-review" },
  good: { label: "clear", cls: "clarity-good" },
  na: { label: "n/a", cls: "clarity-na" },
};

function renderClarity(result) {
  elClarity.innerHTML = "";
  if (!result.checks.length) {
    elClaritySummary.textContent = "-";
    const p = document.createElement("p");
    p.className = "muted empty-note";
    p.textContent = "Start writing to see Clarity review prompts.";
    elClarity.appendChild(p);
    return;
  }
  elClaritySummary.textContent = result.summary.issues
    ? `${result.summary.issues} issue${result.summary.issues === 1 ? "" : "s"}`
    : "review ready";
  for (const check of result.checks) {
    const status = CLARITY_STATUS[check.status] || CLARITY_STATUS.review;
    const row = document.createElement("details");
    row.className = `clarity-check ${status.cls}`;
    if (check.status === "issue") row.open = true;
    const evidence = check.evidence?.length
      ? `<div class="clarity-evidence">${check.evidence.slice(0, 4).map((x) => `“${escapeHtml(x)}”`).join(" · ")}</div>`
      : "";
    row.innerHTML = `
      <summary>
        <span>${escapeHtml(check.title)}</span>
        <span class="clarity-badge">${status.label}</span>
      </summary>
      <div class="clarity-detail">${escapeHtml(check.detail)}</div>
      ${evidence}`;
    elClarity.appendChild(row);
  }
}

const LEGEND_GROUPS = [
  { title: "AI tells", cats: ["phrase", "aiword", "structure", "transition"] },
  { title: "Readability", cats: ["veryhard", "hard", "passive", "adverb", "complex"] },
];

function renderLegend(counts) {
  elLegend.innerHTML = "";
  for (const group of LEGEND_GROUPS) {
    const title = document.createElement("div");
    title.className = "legend-group-title";
    title.textContent = group.title;
    elLegend.appendChild(title);
    for (const cat of group.cats) {
      const meta = CATEGORIES[cat];
      const count = counts[cat] || 0;
      const row = document.createElement("div");
      row.className = "legend-row" + (count ? "" : " zero") + (activeFilter === cat ? " active" : "");
      row.innerHTML = `
        <span class="swatch" style="background:${COLORS[cat]}"></span>
        <span class="name">${meta.label}</span>
        <span class="count">${count}</span>`;
      row.style.outline = activeFilter === cat ? `1px solid ${COLORS[cat]}` : "";
      row.addEventListener("click", () => {
        activeFilter = activeFilter === cat ? null : cat;
        update();
      });
      attachTip(row, meta.tip);
      elLegend.appendChild(row);
    }
  }
}

function renderIssues(text, marks) {
  const issues = marks
    .filter((m) => !SENTENCE_CATS.has(m.cat) || m.cat === "veryhard" || m.cat === "hard")
    .filter((m) => (activeFilter ? m.cat === activeFilter : true))
    .sort((a, b) => a.start - b.start);

  elIssues.innerHTML = "";
  if (!issues.length) {
    const p = document.createElement("p");
    p.className = "muted empty-note";
    p.textContent = activeFilter
      ? "No instances of this category."
      : text.trim()
        ? "No issues found - nice and clean."
        : "Start typing to see highlights and suggestions.";
    elIssues.appendChild(p);
    return;
  }

  const shown = issues.slice(0, 250);
  for (const m of shown) {
    const meta = CATEGORIES[m.cat];
    const el = document.createElement("div");
    el.className = "issue";
    el.style.borderLeftColor = COLORS[m.cat];
    let quote;
    if (SENTENCE_CATS.has(m.cat)) {
      const t = text.slice(m.start, m.end).trim();
      quote = t.length > 70 ? t.slice(0, 67) + "…" : t;
    } else {
      quote = text.slice(m.start, m.end).trim();
    }
    let tip = m.tip || meta.tip;
    if (m.suggestion) tip = `<span class="arrow">→</span> try “${m.suggestion}”`;
    el.innerHTML = `
      <div class="issue-head">
        <span class="issue-quote">“${escapeHtml(quote)}”</span>
        <span class="issue-cat">${meta.label}</span>
      </div>
      <div class="issue-tip">${tip}</div>`;
    el.addEventListener("click", () => jumpTo(m.start, m.end));
    elIssues.appendChild(el);
  }
  if (issues.length > shown.length) {
    const more = document.createElement("p");
    more.className = "muted empty-note";
    more.textContent = `+ ${issues.length - shown.length} more…`;
    elIssues.appendChild(more);
  }
}

function jumpTo(start, end) {
  input.focus();
  input.setSelectionRange(start, end);
  // Estimate scroll position from the line the match is on.
  const before = input.value.slice(0, start);
  const line = (before.match(/\n/g) || []).length;
  const cs = getComputedStyle(input);
  const lh = parseFloat(cs.lineHeight) || 27;
  input.scrollTop = Math.max(0, line * lh - input.clientHeight / 2);
  syncScroll();
}

// ---- Tooltip ---------------------------------------------------------------

function attachTip(el, text) {
  if (!text) return;
  el.addEventListener("mouseenter", () => {
    tooltip.textContent = text;
    tooltip.classList.add("show");
    const r = el.getBoundingClientRect();
    tooltip.style.left = `${Math.min(r.left, window.innerWidth - 280)}px`;
    tooltip.style.top = `${r.bottom + 6}px`;
  });
  el.addEventListener("mouseleave", () => tooltip.classList.remove("show"));
}

// ---- Main loop -------------------------------------------------------------

function syncScroll() {
  backdrop.scrollTop = input.scrollTop;
  backdrop.scrollLeft = input.scrollLeft;
}

function update() {
  const text = input.value;
  const { marks, stats } = analyze(text);
  const clarity = analyzeClarity(text);
  renderBackdrop(text, marks);
  renderStats(stats);
  renderSignals(stats.signals);
  renderClarity(clarity);
  renderLegend(stats.counts);
  renderIssues(text, marks);
  syncScroll();
}

let timer = null;
input.addEventListener("input", () => {
  clearTimeout(timer);
  const draft = input.value;
  timer = setTimeout(() => {
    saveDraft(draftStorage, draft, SAMPLE);
    update();
  }, 120);
});
input.addEventListener("scroll", syncScroll);
window.addEventListener("pagehide", () => saveDraft(draftStorage, input.value, SAMPLE));

document.getElementById("clear").addEventListener("click", () => {
  clearTimeout(timer);
  input.value = "";
  activeFilter = null;
  clearDraft(draftStorage);
  input.focus();
  update();
});

async function writeClipboard(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      const copied = document.execCommand("copy");
      helper.remove();
      return copied;
    } catch {
      return false;
    }
  }
}

function flashButton(button, message, original) {
  button.textContent = message;
  setTimeout(() => (button.textContent = original), 1200);
}

document.getElementById("copy-prompt").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  if (!input.value.trim()) {
    flashButton(button, "Nothing to copy", "Copy prompt");
    return;
  }
  const copied = await writeClipboard(buildEditingPrompt(input.value));
  flashButton(button, copied ? "Prompt copied!" : "Copy failed", "Copy prompt");
});

document.getElementById("copy").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const copied = await writeClipboard(input.value);
  flashButton(button, copied ? "Copied!" : "Copy failed", "Copy text");
});

const SAMPLE = `In today's fast-paced world, artificial intelligence stands as a testament to human ingenuity, marking a pivotal moment in the evolution of technology. Honestly, it's not just a tool - it's a revolution.

These groundbreaking systems delve into vast datasets, fostering innovation, empowering creators, and unlocking new possibilities. Moreover, they leverage robust, cutting-edge algorithms. Furthermore, they showcase a rich tapestry of capabilities. Additionally, it is worth noting that the technology plays a crucial role across a wide range of industries.

The report was carefully written by the committee, which had been convened under considerable political pressure from numerous competing stakeholders who were attempting to utilize the situation. Ultimately, the future looks bright. I hope this helps! Let me know if you'd like me to expand on any section.`;

document.getElementById("sample").addEventListener("click", () => {
  input.value = SAMPLE;
  activeFilter = null;
  update();
});

input.value = loadDraft(draftStorage, SAMPLE);
update();
