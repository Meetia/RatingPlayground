# Rating Playground

A throwaway toy for **feeling** different rating systems on a real food item — the experiment behind the rating-scale decision for [The Prospect Project](https://github.com/Meetia/TheProspectProject). The research and reasoning live in that repo's `docs/rating-system-research.md`; this repo is just the clickable prototype.

It is **not** part of the app. Plain static HTML/CSS/JS, no build step, no backend.

Pages:
- **`index.html`** — the rating-systems experiment (below).
- **`add-entry-finalize.html`** — a clean mockup of the app's "New entry" screen with the **three finalist rating inputs** selectable (A worded-overall / B worded-parts / C word-slider), for deciding. See `rating-combinations.md` for what each is and what was ruled out.
- **`add-entry-lab.html`** — the fully-configurable version of the same screen: a control tray to swap method (numbers / stars / slider / criteria), change the number and size of the buckets, and edit the slider's words. For open-ended experimentation.
- **`rating-combinations.md`** — the write-up: the criteria + words permutations considered, the three being prototyped, and why the others (word-first overall; numbers-in/word-out) were rejected or parked, framed around the target user.

The add-entry mockups are built from `docs/app-design.md`; the form is fixed and only the Rating field changes. Toggle the iPhone frame on/off. Nothing is stored — purely for feeling the layout.

## What it does

You bring one food you recently ate and have an opinion about. You rate that same item under several rating systems (shown in randomized order), give a quick optional reaction to each, and then see the same gut feeling rendered on every scale side by side — `4/5` stars vs. `7.3/10` on a slider vs. a comparison-derived score. The point is to notice which systems feel good, which annoy, and which let you say what you actually mean.

Design borrowed from Preston & Colman (2000), *Optimal Number of Response Categories* — the constant is the **set of scales**, not the item, and each person rates something from their own experience, in a randomized scale order.

## Run it

Just open `index.html` in a browser — no server needed.

To share with friends/family, enable **GitHub Pages** (Settings → Pages → deploy from the `main` branch, root). The live link becomes `https://<user>.github.io/RatingPlayground/`.

## Systems in this round

Six, all of which work on a single item with no rating history required:

1. **1–5 stars** — the familiar control.
2. **1–6 numbers** — even, forced-lean, no decimals.
3. **0–10 slider** — continuous, decimals allowed. The whole-vs-decimal and discrete-vs-continuous axis in one.
4. **0–10 slider, with words** — the same slider, but each spot carries a feeling ("eh, I'd eat it if it was in front of me" … "I'd tell everyone to try this") and the colour shifts red→amber→green as you drag. Tests whether semantic + colour anchors make a scale easier to commit to. The labels live in `CONFIG.feelingLabels` — in the app these could be per-list customizable.
5. **Comparison** — no number up front: answer "better or worse than X?" against a short seeded list of reference foods (binary insertion), and a 0–10 score is interpolated from where it lands. This is the only way to *feel* comparative/pairwise rating with no real history — the seeded foods stand in for a personal list.
6. **Criteria split** — Airbnb-style: an **Overall** score (1–6) sits at the top and *is* the item's score — a standalone gut call. Below it, the parts (`CONFIG.criteria`, e.g. taste / texture / value) are rated separately on the same 1–6, and their average is shown only as a small side readout, explicitly **not** the overall. Nothing about the parts feeds the headline — that's the whole point (see the research below on why a personal food rating keeps the overall separate rather than summing the parts).

**On "do the parts add up?"** — real multi-attribute systems split two ways. Airbnb keeps the overall a **separate** gut rating (the six categories are collected but explicitly *not* averaged into it). Expert/judging systems **sum** the parts: SCA coffee cupping sums ten attributes to /100; RateBeer sums aroma/10 + appearance/5 + taste/10 + palate/5 + overall/20 → /50 (note it folds a holistic "overall" *into* the sum). For a personal food log we take the Airbnb side: the Overall is its own gut score and the parts are separate metadata whose average never touches it — because in a food context we don't know all the elements of enjoyment, and they and their weights differ per person, so a fixed sum imposes a false rubric.

All the knobs — slider range, the seeded reference foods, the criteria parts, which systems are included — are in the `CONFIG` block at the top of the `<script>` in `index.html`. Change them there.

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
- [x] M2 — the six systems (stars, 1–6, slider, slider-with-words, seeded comparison, criteria split)
- [x] M3 — per-system reactions + side-by-side end card + local save
- [x] M4 — Google Sheet data sink (`apps-script.gs`; set `CONFIG.endpoint` to enable)
- [ ] M5 — share with friends/family and gather impressions
