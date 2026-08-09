---
name: portfolio-review
description: Review or build Carmen's portfolio through the lens of a senior/consultant product design hiring manager. Use when working on index.html, any case-study*.html, portfolio copy, case study structure, or when asked "would this get me an interview", "review my portfolio", "is this good enough", or to build/restructure a case study.
---

# Portfolio review — senior & consultant product design hiring lens

Two modes. Ask which if ambiguous, otherwise infer:

- **Review** — audit what exists, report findings ranked by what actually costs interviews.
- **Build** — write or restructure a case study / section, applying the same standard as you go.

---

## Who is actually reading this

The realistic reviewer chain for a senior or consultant PD role:

1. **Recruiter / talent partner** (30–60s, often mobile) — can they tell what she does, at what level, in what domain? If not, it dies here.
2. **Hiring manager / Head of Design** (2–5 min, skims one case study) — looking for judgment, scope of ownership, and whether the thinking survives scrutiny.
3. **Panel** (reads properly, pre-interview) — hunting for specific things to probe. Anything vague or unsupported becomes an interrogation.

Design for reader 1 to *not bounce* and reader 2 to *find the substance fast*. Reader 3 is why nothing may be fabricated.

**Consultant-specific:** the buyer is asking "can this person parachute into ambiguity, own it end-to-end, and handle my stakeholders?" Range, autonomy, and speed-to-value matter more than for an in-house role. Evidence of working across constraints (compliance, risk, commercial) is a strong signal.

---

## Review rubric

Score each case study on these. Anything failing is a finding.

### 1. Legibility in 10 seconds
- [ ] Title explains what the thing **is** — no internal codenames or unexplained product names. (A product called "Flex" means nothing externally; say "a new funding product".)
- [ ] Chips/tags land domain + scope (e.g. Fintech, 0→1, platform).
- [ ] A hero visual shows the actual product, not an abstract graphic.
- [ ] Role is explicit and unambiguous — on team projects, exactly what *she* owned.

### 2. Problem framing
- [ ] The problem is a **user/business** problem, not a task ("agents couldn't X mid-conversation", not "we needed to design a form").
- [ ] Constraints are named (dependencies, compliance, tech, commercial).
- [ ] It's clear why this was *hard*. If it sounds easy, it reads as junior work.

### 3. Judgment on display (the senior differentiator)
- [ ] Decisions are stated with reasoning: chose X **over Y** because **Z**.
- [ ] At least one real tradeoff or thing that didn't work.
- [ ] Evidence of iteration driven by real signal, not preference.
- [ ] Shows influence beyond the pixels where true (shaped scope, pushed back, changed the model).

### 4. Evidence & honesty
- [ ] Shipped vs. concept vs. not-live is stated plainly, never blurred.
- [ ] No invented metrics, uplift %, participant counts, or dates. **Ever.**
- [ ] Research claims are proportionate to what was actually done.
- [ ] No confidential/internal content: prototype links, passwords, participant names, internal URLs, commercially sensitive figures.

### 5. Scannability
- [ ] Works with zero hover — all key info readable on touch devices.
- [ ] No wall of text: prose broken by visuals, callouts, or pull quotes every ~2 paragraphs.
- [ ] Section headings tell the story on their own if you read only them.
- [ ] Reads top-to-bottom in one column; no scattered card-soup.

### 6. Craft signals
- [ ] Alignment is exact — mixed widths read as sloppiness and undercut a *design* portfolio badly.
- [ ] Both light and dark themes verified.
- [ ] Real screenshots framed in device mockups, not floating raw crops.
- [ ] Responsive down to ~360px.

---

## Red flags that actively cost interviews

Rank findings by these first:

1. **Fabricated or unsupportable claims** — one "increased conversion 40%" that can't be defended ends the interview. Highest severity, always.
2. **Unexplained jargon / codenames** — reader 1 bounces.
3. **Ambiguous ownership** — "we" everywhere on a team project reads as hiding.
4. **Process theatre** — every wireframe shown, no insight extracted. Signals junior.
5. **Hover-gated information** — invisible on mobile, which is a large share of first views.
6. **All-success narrative** — no tradeoffs reads as either shallow or dishonest.
7. **Placeholder text left live** — `[Month YYYY]`, lorem ipsum, `[PM, engineers]`. Instantly fatal to credibility.

Always grep for leftover placeholders before declaring anything done:
```
grep -rn "cs-fill\|\[Month\|Lorem\|TODO\|\[N\]" --include="*.html" .
```

---

## Project context

**Structure**
- `index.html` — homepage. Work cards render from JS, not hardcoded.
- `js/content.js` — the `PROJECTS` array. Single source of truth for cards (title, tags, role, description, image/video/poster, link). `FLAGSHIP_COUNT` controls how many show on the homepage.
- `js/main.js` — `renderProjects()` builds card markup.
- `case-study-flex.html` — current best-practice template (TL;DR / Detailed toggle).
- `case-study.html` — Multi-product. **Still on the older template**; structurally inconsistent with Flex.
- `case-study.css` — all `.cs-*` components. `styles.css` — global tokens, nav, footer, cards.
- `images/flex/` — Flex assets incl. compressed demo video + poster.

**Design system**
- Tokens in `styles.css` `:root` / `[data-theme="light"]`. Always use `var(--text)`, `var(--accent)`, `var(--bento-border)` etc. Never hardcode colours.
- Serif = `--font-serif` (Playfair) for titles; sans = `--font-sans` (Inter) for everything else.
- Accent pink `--accent` for labels, headings in TL;DR, emphasis `<em>` in titles.
- Glass surfaces: `rgba(17,17,26,0.45)` + `backdrop-filter: blur(16px)`, with a `[data-theme="light"]` counterpart. **Glassmorphism needs something behind it** — on a flat background add a subtle gradient wash or it renders as flat opaque fill.

**Content width — read this before touching layout**
`.cs-hero-inner`, `.cs-cover`, `.cs-article`, `.cs-wide-block` are `max-width: 860px` **including** their own `48px` side padding, so their *visible* content spans **764px**.

Any element with a **visible border/background** (e.g. `.cs-meta-panel`) must be `max-width: 764px` to align with them. Using 860px there makes it overhang — this caused several rounds of "the card is too wide".

---

## Known gotchas (all hit for real; don't rediscover)

- **Grid overflow:** `1fr` columns won't shrink below content size. Long unbroken text silently forces the whole container wider. Use `minmax(0, 1fr)` and `min-width: 0` on children.
- **CSS source order:** equal-specificity rules — later wins. A modifier placed *above* the base rule silently loses. Bump specificity (`.cs-article.cs-article--tldr h2`) rather than relying on order.
- **Unscoped `!important` overrides:** `styles.css` has late "restore desktop layout" rules that were overriding mobile breakpoints. Scope them in `@media (min-width: …)`.
- **Headless Chrome floors narrow widths at ~500px.** Requesting `--window-size=390` still lays out at 500 and crops the screenshot — text looks clipped when it isn't. Don't report layout bugs from narrow headless shots without measuring `getBoundingClientRect` first.
- **Entrance animations** need `--virtual-time-budget=6000`+ or screenshots catch mid-animation state and look broken.
- **`loading="lazy"` iframes inside hidden panels** may not load when revealed. Omit it for the journey diagram.
- `.cs-progress` (side nav dots) is hidden below 1140px viewport by design — not a bug.

---

## Verification workflow

Never declare visual work done without looking at it.

```bash
# serve (PowerShell script; real Python is NOT installed, only Store stubs)
powershell -ExecutionPolicy Bypass -File <scratchpad>/serve.ps1   # → localhost:8000
```

Screenshot via headless Chrome against `localhost` (not `file://` — MIME types matter for video/iframes):
```
chrome --headless=new --disable-gpu --hide-scrollbars --window-size=1400,1500 \
  --screenshot=out.png --virtual-time-budget=7000 \
  --autoplay-policy=no-user-gesture-required http://localhost:8000/<page>.html
```

Check: **dark theme, light theme, ~500px width**. To test light theme or a toggle state, copy the page to a temp file at project root, `sed` the default theme or append an auto-click script, screenshot, then delete it.

**Always delete temp/QA files afterwards** — never leave `_qa-*.png` or `_temp-*.html` in `images/` or the repo root.

---

## Hard rules

- **Never invent** metrics, percentages, participant counts, timelines, team composition, or outcomes. If a fact isn't in the source material or from Carmen, mark it `<span class="cs-fill">[like this]</span>` and tell her it needs filling — don't quietly guess.
- **Never describe unshipped work as live.** The Flex funding-assessment redesign is designed, not yet shipped; it must always read that way.
- **Never leak** prototype links, passwords, participant names, or internal URLs from research source files.
- Reuse existing `.cs-*` components before inventing new ones.
- When giving a recommendation, give **one** with reasoning — not a menu — unless the choice is genuinely hers (naming, personal voice, factual detail only she knows).
