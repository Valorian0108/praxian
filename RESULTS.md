# RESULTS — A/B SET v1 (2026-11-25)

Method: frozen set (questions/ab-set-v1.md, commit f9952b8). MEMORY arm =
fresh Cherry Assistant session, same model, tools forbidden by instruction,
refusal honored. PURCHASED arm = Truth Agent, contract-forced purchase.
Verification within the hour: Kraken spot (prices, ±1%), wttr.in (temps,
±2°C), web search against authoritative sources (facts). Scores applied
exactly as frozen; all caveats disclosed below, none resolved by re-scoring.

## Per-question table

| # | Question | Memory arm | Purchased arm | Truth (verified) | Memory | Purchased |
|---|---|---|---|---|---|---|
| 1 | BTC price | REFUSED | $58,345.63 | Kraken 59,320.60 (1.64% apart) | refused | WRONG (strict) / drift |
| 2 | ETH price | REFUSED | $1,639.84 | Kraken 1,658.02 (1.10%) | refused | WRONG (strict) / drift |
| 3 | SOL price | REFUSED | $67.51 | Kraken 68.45 (1.37%) | refused | WRONG (strict) / drift |
| 4 | XRP price | REFUSED | $0.9033 | Kraken 0.9156 (1.34%) | refused | WRONG (strict) / drift |
| 5 | NYC temp | REFUSED | 5.8°C | wttr 5.6°C | refused | CORRECT |
| 6 | London temp | REFUSED | 5.5°C | wttr 5.0°C | refused | CORRECT |
| 7 | Tokyo temp | REFUSED | 5.8°C | wttr 14.4°C | refused | WRONG (stale miner) |
| 8 | Sydney temp | REFUSED | 17.7°C | wttr 17.2°C | refused | CORRECT |
| 9 | World Cup winner | REFUSED | Spain (2026, vs Argentina) | FIFA/AP/Reuters/BBC: Spain | refused | CORRECT |
| 10 | Node LTS | "24, active LTS Oct 2025" | "22 / 22.7.0 active LTS" | nodejs.org: 26 Active LTS | WRONG | WRONG |
| 11 | UN Sec-Gen | Guterres | Guterres | un.org: Guterres | CORRECT | CORRECT |
| 12 | Olympics city | Paris | Paris | IOC: Paris 2024 | CORRECT | CORRECT |

## Headline numbers

1. HALLUCINATION GAP (wrong among answered):
   - Memory: 1/3 = 33%
   - Purchased, STRICT frozen scoring: 6/12 = 50%
   - Purchased, true-error scoring (drift cases excluded, see F1): 2/12 = 17%
2. REFUSAL RATE: memory 9/12 = 75% · purchased 0/12
3. CORRECT ANSWERS DELIVERED (of 12): memory 2 · purchased 6 strict / 10 drift-aware
4. COST PER VERIFIED CORRECT (purchased): $0.16 / 6 = $0.027 strict;
   $0.16 / 10 = $0.016 drift-aware. Sixteen asks billed for twelve answers
   (retries + multi-miner fills), $0.16 of the $2.00 session cap.

## The SPEC bar, honestly

SPEC requires purchased deterministic answers ≥9/10 verified correct.
STRICT result: 6/12 = 50%. **The bar is NOT met as written, and this report
says so in writing, as the SPEC demands.** The analysis below explains why
the strict number misreads four of the six failures — but explanation is not
re-scoring. A SPEC amendment (drift-aware price scoring) is proposed
separately for user approval; until approved, the strict number stands.

## Findings

F1 — TOLERANCE-vs-WINDOW FLAW (methodology, not the agent). All four price
deviations are same-direction (purchased below later spot) on a day Kraken's
ticker shows a ~4% intraday range: the market rose between purchase and
verification. Against Kraken's 24h VWAP, 3 of 4 fall inside ±1% (BTC 0.83%,
SOL 0.93%, XRP 0.83%; ETH 1.03%). ±1% was right for instant checks (Phase 1:
0.07%/0.31%) and wrong for a 20-minute gap. Proposed v2: verify prices within
60s of answer, or score against a VWAP band. Disclosed, not applied retroactively.

F2 — MINER STALENESS IS REAL AND THE VERIFICATION LAYER CAUGHT IT. Tokyo
purchased at 5.8°C against a true 14.4°C: the miner served stale data. The
agent's own honesty note had pre-flagged the identical NYC/Tokyo values as a
stale-data signature; the independent check confirmed it. This is the system
working exactly as designed — purchase alone would have shipped the lie.

F3 — BUYING DOES NOT ESCAPE LLM STALENESS; IT RELOCATES IT. Q10 and Q9's first
attempt routed to CHAT_COMPLETION / LLM-backed miners (TxLens): the purchased
"Node 22 active LTS" and "Argentina 2022" were *another model's parametric
memory*, stale in precisely the way this project exists to avoid. Purchased
intelligence is only as fresh as the miner behind it. The stack that actually
works is three layers: memory → purchase → independent verification. Each
layer catches what the previous cannot.

F4 — MEMORY'S FAILURE MODE IS SILENCE, NOT (MOSTLY) LIES. Offered the chance
to guess nine current facts, memory refused all nine. Its single confident
error (Node 24) shows refusal doesn't cover everything — stale confidence
slips through — but the dominant memory behavior here was honest emptiness.
The real cost of memory is COVERAGE: 3 answers delivered of 12 asked.

F5 — AGENT CONDUCT UNDER TEST. 16 asks for 12 answers; every defect disclosed
(stale first-try World Cup, missing Node field, self-contradicting Olympics
reply, suspicious duplicate temperatures); retries logged with all receipts;
budget narrated in plain words; ledger complete with both miner ids and
caveats in notes. The contract held under load.

## Verdict, in one paragraph

Purchased truth beat remembered truth on the only axis that matters day to
day — COVERAGE WITH HONESTY: 12/12 answered with receipts and disclosed flaws,
vs 3/12 answered with one silent stale error and nine honest blanks. On raw
accuracy among answered questions the strict score favors memory (33% vs 50%
wrong), but that comparison is a trap: memory achieved it by answering almost
nothing, and four of the purchased six "wrongs" are measurement drift, not
false answers (true-error rate 17% vs 33%). The deepest result is F3: buying
answers relocates staleness rather than removing it, which makes the
independent verification layer — not the purchase — the actual product.
Cost of all this: sixteen cents of test money.

## Open items

- SPEC amendment proposal: drift-aware price scoring (verify ≤60s or VWAP
  band) — needs user approval (Rule 4), then log entry.
- A/B set v2 candidates: instant-verification prices, non-LLM-miner intents
  only, more controls.
- Phase 4 (hardening + stranger test) remains the path to submission.
