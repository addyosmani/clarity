import { useEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  Clipboard,
  Copy,
  FileText,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { analyze, CATEGORIES } from "@/lib/editor/patterns.js"
import { analyzeClarity } from "@/lib/editor/clarity.js"
import { buildEditingPrompt } from "@/lib/editor/prompt.js"
import { clearDraft, loadDraft, saveDraft } from "@/lib/editor/draft.js"
import { cn } from "@/lib/utils"

const SAMPLE = `In today's fast-paced world, artificial intelligence stands as a testament to human ingenuity, marking a pivotal moment in the evolution of technology. Honestly, it's not just a tool - it's a revolution.

These groundbreaking systems delve into vast datasets, fostering innovation, empowering creators, and unlocking new possibilities. Moreover, they leverage robust, cutting-edge algorithms. Furthermore, they showcase a rich tapestry of capabilities. Additionally, it is worth noting that the technology plays a crucial role across a wide range of industries.

The report was carefully written by the committee, which had been convened under considerable political pressure from numerous competing stakeholders who were attempting to utilize the situation. Ultimately, the future looks bright. I hope this helps! Let me know if you'd like me to expand on any section.`

const COLORS: Record<string, string> = {
  phrase: "#c026d3",
  aiword: "#ea580c",
  structure: "#e11d48",
  transition: "#64748b",
  veryhard: "#dc2626",
  hard: "#ca8a04",
  passive: "#0d9488",
  adverb: "#2563eb",
  complex: "#7c3aed",
}

const WORD_PRIORITY: Record<string, number> = {
  structure: 7,
  phrase: 6,
  aiword: 5,
  transition: 4,
  complex: 3,
  passive: 2,
  adverb: 1,
}

const SENTENCE_CATS = new Set(["hard", "veryhard"])
const CATEGORY_META = CATEGORIES as Record<string, { label: string; kind: string; tip: string }>

const LEGEND_GROUPS = [
  { title: "AI tells", cats: ["phrase", "aiword", "structure", "transition"] },
  { title: "Readability", cats: ["veryhard", "hard", "passive", "adverb", "complex"] },
]

const SIGNAL_VERDICT: Record<string, { label: string; className: string }> = {
  low: { label: "low", className: "status-good" },
  review: { label: "review", className: "status-review" },
  high: { label: "high", className: "status-issue" },
  na: { label: "n/a", className: "status-neutral" },
}

const CLARITY_STATUS: Record<string, { label: string; className: string }> = {
  issue: { label: "issue", className: "status-issue" },
  review: { label: "review", className: "status-review" },
  good: { label: "clear", className: "status-good" },
  na: { label: "n/a", className: "status-neutral" },
}

type Mark = {
  start: number
  end: number
  cat: string
  tip?: string
  suggestion?: string
}

type HighlightSegment = {
  text: string
  sentenceCat: string | null
  wordCat: string | null
}

function highlightSegments(text: string, marks: Mark[]): HighlightSegment[] {
  if (!text) return []

  const boundaries = new Set([0, text.length])
  for (const mark of marks) {
    if (mark.start >= 0 && mark.start <= text.length) boundaries.add(mark.start)
    if (mark.end >= 0 && mark.end <= text.length) boundaries.add(mark.end)
  }

  const sorted = [...boundaries].sort((a, b) => a - b)
  const segments: HighlightSegment[] = []

  for (let index = 0; index < sorted.length - 1; index++) {
    const start = sorted[index]
    const end = sorted[index + 1]
    if (end <= start) continue

    let sentenceCat: string | null = null
    let wordCat: string | null = null
    let wordPriority = -1

    for (const mark of marks) {
      if (mark.start > start || mark.end < end) continue
      if (SENTENCE_CATS.has(mark.cat)) {
        if (mark.cat === "veryhard" || sentenceCat === null) sentenceCat = mark.cat
      } else {
        const priority = WORD_PRIORITY[mark.cat] ?? 0
        if (priority > wordPriority) {
          wordPriority = priority
          wordCat = mark.cat
        }
      }
    }

    segments.push({ text: text.slice(start, end), sentenceCat, wordCat })
  }

  if (text.endsWith("\n")) segments.push({ text: " ", sentenceCat: null, wordCat: null })
  return segments
}

function formatTime(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return remainder ? `${minutes}m ${remainder}s` : `${minutes}m`
}

async function writeClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    try {
      const helper = document.createElement("textarea")
      helper.value = value
      helper.style.position = "fixed"
      helper.style.opacity = "0"
      document.body.appendChild(helper)
      helper.select()
      const copied = document.execCommand("copy")
      helper.remove()
      return copied
    } catch {
      return false
    }
  }
}

function StatCard({ value, label, detail }: { value: string | number; label: string; detail?: string }) {
  return (
    <Card size="sm" className="stat-card">
      <CardContent className="px-3">
        <div className="stat-value">{value}</div>
        <div className="stat-name">{label}</div>
        {detail ? <div className="stat-detail">{detail}</div> : null}
      </CardContent>
    </Card>
  )
}

export default function EditorApp() {
  const [text, setText] = useState("")
  const [analysisText, setAnalysisText] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<{ target: "prompt" | "text"; label: string } | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const currentTextRef = useRef("")

  useEffect(() => {
    let restored = ""
    try {
      restored = loadDraft(window.localStorage, SAMPLE)
    } catch {
      restored = ""
    }
    currentTextRef.current = restored
    setText(restored)
    setAnalysisText(restored)
  }, [])

  useEffect(() => {
    currentTextRef.current = text
    const timer = window.setTimeout(() => {
      setAnalysisText(text)
      try {
        saveDraft(window.localStorage, text, SAMPLE)
      } catch {
        // Private browsing and blocked storage should not interrupt editing.
      }
    }, 120)
    return () => window.clearTimeout(timer)
  }, [text])

  useEffect(() => {
    const persist = () => {
      try {
        saveDraft(window.localStorage, currentTextRef.current, SAMPLE)
      } catch {
        // Ignore unavailable storage.
      }
    }
    window.addEventListener("pagehide", persist)
    return () => window.removeEventListener("pagehide", persist)
  }, [])

  const analysis = useMemo(() => analyze(analysisText), [analysisText])
  const clarity = useMemo(() => analyzeClarity(analysisText), [analysisText])
  const segments = useMemo(
    () => highlightSegments(analysisText, analysis.marks),
    [analysisText, analysis.marks],
  )

  const issues = useMemo(
    () =>
      analysis.marks
        .filter((mark: Mark) => !activeFilter || mark.cat === activeFilter)
        .sort((a: Mark, b: Mark) => a.start - b.start),
    [activeFilter, analysis.marks],
  )

  const syncScroll = () => {
    if (!inputRef.current || !backdropRef.current) return
    backdropRef.current.scrollTop = inputRef.current.scrollTop
    backdropRef.current.scrollLeft = inputRef.current.scrollLeft
  }

  const replaceText = (value: string, clearStored = false) => {
    currentTextRef.current = value
    setText(value)
    setAnalysisText(value)
    setActiveFilter(null)
    if (clearStored) {
      try {
        clearDraft(window.localStorage)
      } catch {
        // Ignore unavailable storage.
      }
    }
    window.requestAnimationFrame(() => {
      inputRef.current?.focus()
      syncScroll()
    })
  }

  const jumpTo = (start: number, end: number) => {
    const input = inputRef.current
    if (!input) return
    input.focus()
    input.setSelectionRange(start, end)
    const line = (input.value.slice(0, start).match(/\n/g) || []).length
    const lineHeight = Number.parseFloat(getComputedStyle(input).lineHeight) || 27
    input.scrollTop = Math.max(0, line * lineHeight - input.clientHeight / 2)
    syncScroll()
  }

  const flashCopyState = (target: "prompt" | "text", label: string) => {
    setCopyState({ target, label })
    window.setTimeout(() => setCopyState(null), 1200)
  }

  const copyPrompt = async () => {
    if (!text.trim()) {
      flashCopyState("prompt", "Nothing to copy")
      return
    }
    const copied = await writeClipboard(buildEditingPrompt(text))
    flashCopyState("prompt", copied ? "Prompt copied" : "Copy failed")
  }

  const copyText = async () => {
    const copied = await writeClipboard(text)
    flashCopyState("text", copied ? "Text copied" : "Copy failed")
  }

  const { stats } = analysis
  const counts = stats.counts as Record<string, number>
  const scoreTone = stats.score < 10 ? "score-good" : stats.score < 30 ? "score-review" : "score-issue"
  const claritySummary = clarity.summary.issues
    ? `${clarity.summary.issues} issue${clarity.summary.issues === 1 ? "" : "s"}`
    : clarity.checks.length
      ? "review ready"
      : "-"

  return (
    <TooltipProvider delayDuration={300}>
      <div className="editor-app">
        <header className="topbar">
          <a className="brand-lockup" href="/" aria-label="Clarity home">
            <span className="brand-mark" aria-hidden="true"><Sparkles /></span>
            <span>Clarity</span>
            <span className="brand-product">Writing Editor</span>
          </a>
          <div className="topbar-meta">
            <span className="privacy-note"><span className="privacy-dot" /> Private in your browser</span>
          </div>
        </header>

        <main className="workspace">
          <aside className="workspace-panel overview-panel" aria-label="Overview">
            <ScrollArea className="panel-scroll">
              <div className="panel-inner">
                <div className="panel-eyebrow">Overview</div>
                <Card size="sm" className="score-card">
                  <CardHeader className="px-3 pb-0">
                    <div className="score-row">
                      <div>
                        <div className="stat-value">{stats.score}</div>
                        <div className="stat-name">Surface-pattern score</div>
                      </div>
                      <Badge variant="outline" className={cn("score-badge", scoreTone)}>{stats.scoreLabel}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3">
                    <Progress value={stats.score} className={cn("score-progress", scoreTone)} />
                  </CardContent>
                </Card>
                <div className="stat-grid">
                  <StatCard value={stats.aiTells} label="Flagged patterns" />
                  <StatCard value={stats.grade} label="Readability grade" detail={stats.gradeLabel} />
                </div>
                <Card size="sm" className="document-card">
                  <CardContent className="document-stats px-3">
                    <div><strong>{stats.words}</strong><span>Words</span></div>
                    <div><strong>{stats.sentences}</strong><span>Sentences</span></div>
                    <div><strong>{stats.paragraphs}</strong><span>Paragraphs</span></div>
                    <div><strong>{formatTime(stats.readingTimeSec)}</strong><span>Read time</span></div>
                  </CardContent>
                </Card>
                <div className="overview-help">
                  <FileText aria-hidden="true" />
                  <p>Scores describe visible patterns. Use the review panels for context and editorial judgment.</p>
                </div>
              </div>
            </ScrollArea>
          </aside>

          <section className="editor-column" aria-label="Editor">
            <div className="document-shell">
              <div className="document-toolbar">
                <div>
                  <span className="save-state"><Check /> Saved locally</span>
                </div>
                <span className="document-count">{stats.words} words</span>
              </div>
              <Separator />
              <div className="highlight-wrap">
                <div ref={backdropRef} className="highlight-backdrop" aria-hidden="true">
                  {segments.map((segment, index) =>
                    segment.sentenceCat || segment.wordCat ? (
                      <mark
                        key={index}
                        className={cn(
                          segment.sentenceCat && `s-${segment.sentenceCat}`,
                          segment.wordCat && `w-${segment.wordCat}`,
                        )}
                      >
                        {segment.text}
                      </mark>
                    ) : (
                      <span key={index}>{segment.text}</span>
                    ),
                  )}
                </div>
                <textarea
                  ref={inputRef}
                  className="editor-input"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  onScroll={syncScroll}
                  spellCheck={false}
                  aria-label="Writing editor"
                  placeholder="Paste or write your text here..."
                />
              </div>
            </div>

            <div className="actionbar" aria-label="Editor actions">
              <div className="action-group">
                <Button variant="ghost" size="sm" onClick={() => replaceText(SAMPLE)}>
                  <RotateCcw data-icon="inline-start" /> Load example
                </Button>
                <Button variant="ghost" size="sm" onClick={() => replaceText("", true)}>
                  <Trash2 data-icon="inline-start" /> Clear
                </Button>
              </div>
              <div className="action-group">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={copyPrompt}>
                      <Clipboard data-icon="inline-start" />
                      {copyState?.target === "prompt" ? copyState.label : "Copy prompt"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={8}>Copy the text and its line-specific findings for an editing agent.</TooltipContent>
                </Tooltip>
                <Button size="sm" onClick={copyText}>
                  <Copy data-icon="inline-start" />
                  {copyState?.target === "text" ? copyState.label : "Copy text"}
                </Button>
              </div>
              <span className="sr-only" aria-live="polite">{copyState?.label}</span>
            </div>
          </section>

          <aside className="workspace-panel review-panel" aria-label="Writing analysis">
            <Tabs defaultValue="tells" className="review-tabs">
              <div className="review-tabs-header">
                <TabsList className="review-tabs-list">
                  <TabsTrigger value="tells">Tells <span>{stats.aiTells}</span></TabsTrigger>
                  <TabsTrigger value="clarity">Clarity <span>{clarity.summary.issues}</span></TabsTrigger>
                  <TabsTrigger value="signals">Signals</TabsTrigger>
                </TabsList>
              </div>
              <ScrollArea className="review-scroll">
                <TabsContent value="tells" className="review-content">
                  {LEGEND_GROUPS.map((group) => (
                    <section className="legend-group" key={group.title}>
                      <h2>{group.title}</h2>
                      <div className="legend-list">
                        {group.cats.map((cat) => {
                          const meta = CATEGORY_META[cat]
                          const count = counts[cat] || 0
                          return (
                            <Tooltip key={cat}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className={cn("legend-item", count === 0 && "is-zero", activeFilter === cat && "is-active")}
                                  aria-pressed={activeFilter === cat}
                                  onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
                                >
                                  <span className="legend-swatch" style={{ background: COLORS[cat] }} />
                                  <span>{meta.label}</span>
                                  <span className="legend-count">{count}</span>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="left" sideOffset={8}>{meta.tip}</TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </section>
                  ))}

                  <Separator className="review-separator" />
                  <section className="issues-section">
                    <div className="section-heading">
                      <h2>Findings</h2>
                      {activeFilter ? <Button variant="ghost" size="xs" onClick={() => setActiveFilter(null)}>Clear filter</Button> : null}
                    </div>
                    {!issues.length ? (
                      <p className="empty-state">
                        {activeFilter
                          ? "No instances of this category."
                          : analysisText.trim()
                            ? "No issues found. Nice and clean."
                            : "Start typing to see highlights and suggestions."}
                      </p>
                    ) : (
                      <div className="issue-list">
                        {issues.slice(0, 250).map((mark: Mark, index: number) => {
                          const meta = CATEGORY_META[mark.cat]
                          const rawQuote = analysisText.slice(mark.start, mark.end).trim()
                          const quote = rawQuote.length > 70 ? `${rawQuote.slice(0, 67)}...` : rawQuote
                          return (
                            <button
                              type="button"
                              className="issue-item"
                              style={{ "--issue-color": COLORS[mark.cat] } as React.CSSProperties}
                              onClick={() => jumpTo(mark.start, mark.end)}
                              key={`${mark.start}-${mark.end}-${mark.cat}-${index}`}
                            >
                              <span className="issue-topline"><span className="issue-quote">“{quote}”</span><Badge variant="outline">{meta.label}</Badge></span>
                              <span className="issue-guidance">
                                {mark.suggestion ? `Try “${mark.suggestion}” if it preserves the meaning.` : mark.tip || meta.tip}
                              </span>
                            </button>
                          )
                        })}
                        {issues.length > 250 ? <p className="empty-state">{issues.length - 250} more findings</p> : null}
                      </div>
                    )}
                  </section>
                </TabsContent>

                <TabsContent value="clarity" className="review-content">
                  <div className="section-intro">
                    <div><h2>Clarity review</h2><Badge variant="outline">{claritySummary}</Badge></div>
                    <p>Observable risks plus judgment prompts, not a quality or authorship score.</p>
                  </div>
                  {!clarity.checks.length ? (
                    <p className="empty-state">Start writing to see Clarity review prompts.</p>
                  ) : (
                    <div className="clarity-list">
                      {clarity.checks.map((check: any) => {
                        const status = CLARITY_STATUS[check.status] || CLARITY_STATUS.review
                        return (
                          <details className="clarity-item" open={check.status === "issue"} key={check.id}>
                            <summary><span>{check.title}</span><Badge variant="outline" className={status.className}>{status.label}</Badge></summary>
                            <p>{check.detail}</p>
                            {check.evidence?.length ? (
                              <div className="clarity-evidence">{check.evidence.slice(0, 4).map((item: string) => `“${item}”`).join(" · ")}</div>
                            ) : null}
                          </details>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="signals" className="review-content">
                  <div className="section-intro">
                    <div><h2>Descriptive signals</h2></div>
                    <p>Document-wide observations that do not change the surface-pattern score.</p>
                  </div>
                  <div className="signal-list">
                    {stats.signals.map((signal: any) => {
                      const verdict = SIGNAL_VERDICT[signal.verdict] || SIGNAL_VERDICT.na
                      return (
                        <Tooltip key={signal.key}>
                          <TooltipTrigger asChild>
                            <div className="signal-item" tabIndex={0}>
                              <div><span>{signal.label}</span><code>{signal.display}</code></div>
                              <Badge variant="outline" className={verdict.className}>{verdict.label}</Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left" sideOffset={8}>{signal.detail}</TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </aside>
        </main>

        <footer className="app-footer">
          <span>Built by <a href="https://addyosmani.com">Addy Osmani</a> as part of the <a href="https://clarity.addy.ie">Clarity project</a>.</span>
        </footer>
      </div>
    </TooltipProvider>
  )
}
