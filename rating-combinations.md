# Rating input — combining criteria + per-level words

Exploration of how to fuse the two rating ideas that survived earlier rounds:

- **Criteria split** (Airbnb model) — a holistic **Overall** is the score; optional **parts** (taste / texture / value) are rated separately as metadata, never summed into the overall.
- **Words per bucket** — every level on a scale carries a word ("7 = really good, would get again"), which kills the "what does a 7 mean?" problem and adds legibility + a little colour.

Each brings one superpower: criteria gives *structure*, words give *legibility*. This doc records the permutations considered, what we're prototyping, and what we ruled out and why.

## Who this is for (the deciding lens)

The target user is someone who wants a **notes-app level of personal flexibility** for tracking food, and who **skews toward granular numeric ratings** — they *want* a number, and often a fairly fine one. That framing does a lot of the filtering below: we keep a real number at the centre and use words as **anchors on** the number, not as a replacement for it. Anything that hides the number or forces a coarse, word-only choice fights the user we're building for.

## Prototyped (in `add-entry-finalize.html`)

All three keep 6 buckets except where noted, and keep the Overall as a **separate holistic score** (parts never compute it).

| Option | Overall | Parts | Feel |
|---|---|---|---|
| **A — Worded overall, plain parts** | 1–6 buttons; the picked number **reveals its word** underneath | taste/texture/value, plain 1–6, optional | Fast numeric headline that also *means* something; breakdown stays quick |
| **B — Worded parts, gut overall** | plain 1–6 (fast gut call) | each part on its **own** 1–6 worded ladder (value: rip-off→steal) | The breakdown reads like a tasting note; headline stays a clean number |
| **C — Word slider + discrete parts** | **0–10 worded slider** (decimals, word + colour) | quick **1–5** taps, plain | Most granular headline for the number-lovers, with a word anchor; parts stay light |

Two mechanics worth noting: A and B both use **number + word reveal** (tap the number, see the word) rather than replacing numbers with word chips — this preserves the granular-number feel the user wants. B's per-attribute word ladders are the real payoff of fusing the two ideas: words do their work exactly where a bare number is most opaque (the descriptive attributes), and *value* naturally gets its own rip-off→steal axis instead of being mistaken for quality.

> **Open item:** B's attributes and per-attribute word ladders in the prototype are **placeholders** (`PART_WORDS` in the source). Meet to supply the real attribute list + word ladders.

## Considered and ruled out

- **Word-first overall** (pick a phrase like "excellent," number hidden/derived) — **rejected.** It removes the number and caps you at as many levels as there are phrases. Great for a casual thumbs-y app, wrong for a user who leans granular and wants the digit. This was the clearest cut given the deciding lens above.
- **Numbers in → word out** (rate with numbers, app *generates* a phrase describing the result: "crisp but a touch dense — a strong 5") — **parked as a later, AI-generated touch**, not core input. It's a nice summary/receipt on top of whatever input we pick, not a rating mechanism itself.
- **Coarse → fine** (a worded bucket Bad/OK/Good/Great, then a number inside it) — **not pursued** for now; the two-step adds friction without giving the granular user much they don't already get from A or C.
- **Number + word reveal as its own option** — **folded in** rather than shipped standalone; it's the reveal mechanic inside A and B.

## How this sits with earlier decisions

Consistent with `TheProspectProject/THOUGHTS.md`: the Overall stays a separate holistic gut score, the parts are optional sortable metadata (their average is only ever a side readout, never the headline), and **value is its own axis**, not folded into a quality number. See also `docs/rating-system-research.md` for the underlying research.

## Next

Feel A/B/C in `add-entry-finalize.html`, pick a direction (or a hybrid), and swap B's placeholder ladders for the real words. The fully-configurable playground (numbers/stars/slider/criteria, bucket count, size, editable words) lives in `add-entry-lab.html`.
