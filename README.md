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

Five, all of which work on a single item with no rating history required:

1. **1–5 stars** — the familiar control.
2. **1–6 numbers** — even, forced-lean, no decimals.
3. **0–10 slider** — continuous, decimals allowed. The whole-vs-decimal and discrete-vs-continuous axis in one.
4. **0–10 slider, with words** — the same slider, but each spot carries a feeling ("eh, I'd eat it if it was in front of me" … "I'd tell everyone to try this") and the colour shifts red→amber→green as you drag. Tests whether semantic + colour anchors make a scale easier to commit to. The labels live in `CONFIG.feelingLabels` — in the app these could be per-list customizable.
5. **Comparison** — no number up front: answer "better or worse than X?" against a short seeded list of reference foods (binary insertion), and a 0–10 score is interpolated from where it lands. This is the only way to *feel* comparative/pairwise rating with no real history — the seeded foods stand in for a personal list.

All the knobs — slider range, the seeded reference foods, which systems are included — are in the `CONFIG` block at the top of the `<script>` in `index.html`. Change them there.

## Data — where results go

**By default results stay in the tester's own browser** (`localStorage`) and are copied to their clipboard as JSON, so they can paste them back to you. There is no central collection until you turn it on.

**To collect everyone's runs in one Google Sheet you own:** follow the setup in [`apps-script.gs`](apps-script.gs) (make a Sheet → paste the script → deploy as a Web App → copy the URL), then paste that URL into `CONFIG.endpoint` in `index.html`. Every finished run then appends a row to the Sheet — one row per run, one column per system, with the full raw JSON (reactions, feelings, "better system" note) in the last column. The UI stays entirely ours; Apps Script only writes the row.

## Open decisions (tweak before sharing widely)

- **Slider range** — currently `0–10` with decimals (`CONFIG.sliderMax`). Switch to `100` for a more paper-like feel, or add both as two systems.
- **Feeling labels** — the `CONFIG.feelingLabels` copy is a first pass in your voice; reword to taste (index 0 = worst, last = best).
- **Seeded reference foods** — the defaults in `CONFIG.seeds` are generic. Swap in foods your testers will actually recognize, or make them editable in the UI.
- **Collect data or not** — local + clipboard is the default; set `CONFIG.endpoint` (see `apps-script.gs`) if you want a shared Sheet.
- **Another system?** — letter grades (A–F) would be a cheap add if you want a coarser option in the mix.

## Deferred (not built)

- **Test-retest** (rate the same item twice to measure your own consistency) — the rigorous way to answer the decimals question, parked for now.
- **Heavy metrics** (spread, inter-rater agreement) — mostly moot in a one-item, experience-first design; only relevant if this ever grows into a real study.

## Status / milestones

- [x] M1 — static scaffold: start → randomized systems → end card
- [x] M2 — the five systems (stars, 1–6, slider, slider-with-words, seeded comparison)
- [x] M3 — per-system reactions + side-by-side end card + local save
- [x] M4 — Google Sheet data sink (`apps-script.gs`; set `CONFIG.endpoint` to enable)
- [ ] M5 — share with friends/family and gather impressions
