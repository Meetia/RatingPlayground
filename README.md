# Rating Playground

A throwaway toy for **feeling** different rating systems on a real food item — the experiment behind the rating-scale decision for [The Prospect Project](https://github.com/Meetia/TheProspectProject). The research and reasoning live in that repo's `docs/rating-system-research.md`; this repo is just the clickable prototype.

It is **not** part of the app. Plain static HTML/CSS/JS, one file, no build step, no backend.

## What it does

You bring one food you recently ate and have an opinion about. You rate that same item under several rating systems (shown in randomized order), give a quick optional reaction to each, and then see the same gut feeling rendered on every scale side by side — `4/5` stars vs. `7.3/10` on a slider vs. a comparison-derived score. The point is to notice which systems feel good, which annoy, and which let you say what you actually mean.

Design borrowed from Preston & Colman (2000), *Optimal Number of Response Categories* — the constant is the **set of scales**, not the item, and each person rates something from their own experience, in a randomized scale order.

## Run it

Just open `index.html` in a browser — no server needed.

To share with friends/family, enable **GitHub Pages** (Settings → Pages → deploy from the `main` branch, root). The live link becomes `https://<user>.github.io/RatingPlayground/`.

## Systems in this round

Four, all of which work on a single item with no rating history required:

1. **1–5 stars** — the familiar control.
2. **1–6 numbers** — what the app ships today (even, forced-lean, no decimals).
3. **0–10 slider** — continuous, decimals allowed. The whole-vs-decimal and discrete-vs-continuous axis in one.
4. **Comparison** — no number up front: answer "better or worse than X?" against a short seeded list of reference foods (binary insertion), and a 0–10 score is interpolated from where it lands. This is the only way to *feel* comparative/pairwise rating with no real history — the seeded foods stand in for a personal list.

All the knobs — slider range, the seeded reference foods, which systems are included — are in the `CONFIG` block at the top of the `<script>` in `index.html`. Change them there.

## Data

By default **nothing leaves the page.** Each finished run is saved to the browser's `localStorage` and copied to the clipboard as JSON (so a tester can paste it back to you). That's plenty for a handful of people.

If you later want everyone's runs collected in one place, wire a **Google Apps Script Web App** as a data sink — there's a commented-out `fetch()` stub in `saveResult()`. The UI stays entirely ours; Apps Script only appends a row to a Sheet. (Post the body as `text/plain` to dodge the CORS preflight — the stub already does.)

## Open decisions (tweak before sharing widely)

- **Slider range** — currently `0–10` with decimals (`CONFIG.sliderMax`). Switch to `100` for a more paper-like feel, or add both as two systems.
- **A fifth system?** — letter grades (A–F) or an anchored scale (each number carries a word). Cheap to add; left out to keep a run under ~3 minutes.
- **Seeded reference foods** — the defaults in `CONFIG.seeds` are generic. Swap in foods your testers will actually recognize, or make them editable in the UI.
- **Collect data or not** — on-screen + clipboard is the default; uncomment the Apps Script stub if you want a shared Sheet.

## Deferred (not built)

- **Test-retest** (rate the same item twice to measure your own consistency) — the rigorous way to answer the decimals question, parked for now.
- **Heavy metrics** (spread, inter-rater agreement) — mostly moot in a one-item, experience-first design; only relevant if this ever grows into a real study.

## Status / milestones

- [x] M1 — static scaffold: start → randomized systems → end card
- [x] M2 — the four systems (stars, 1–6, slider, seeded comparison)
- [x] M3 — per-system reactions + side-by-side end card + local save
- [ ] M4 — (optional) Google Sheet data sink
- [ ] M5 — share with friends/family and gather impressions
