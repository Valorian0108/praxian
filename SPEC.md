# SPEC — "Truth Agent" (working title)

**Status: APPROVED by user 2026-11-25 ("approve") — Phase 0 gate passed.**
See APPROVAL-LOG.md entry #3. Changes to this spec now require a new approval.

## Customer

People who use personal AI assistants for real questions where being wrong
costs something — starting with the user, personally, as customer #1 and
test pilot.

## What they do today (the alternative)

Trust the assistant's memory (free, silently wrong sometimes) or check
manually (slow, leaves no trail).

## The promise

Every factual answer is either:
- **purchased** — from a ranked provider, shown with its cost and receipt, or
- **labeled** — `[FROM MEMORY — unverified]`.

No third category. Plus an honest ledger (LEDGER.csv) of what correctness
cost and whether purchased answers actually verified correct.

## Measurable results

1. Accuracy purchased-vs-memory on a fixed 12-question set (Phase 3).
2. Cost per verified correct answer (total spent ÷ verified-correct purchases).
3. Labeling compliance: 100% of answers correctly labeled — binary, no partial credit.

## Acceptable error

Purchased deterministic answers must match an independent verification
source at least 9 times out of 10. Below that, the project's premise is in
question and gets said so in writing.

Tolerances — defined BEFORE experiments, never moved mid-experiment:
- Prices: within ±1% of the independent source when verified within 60
  seconds of the answer; when verification comes later, score against the
  source's same-day average band of ±1% and report BOTH the spot verdict and
  the average verdict. (Amendment #2 approved 2026-11-27, log entry #13.)
- Yes/no questions (alerts, availability...): exact match.
- Continuous values (temperature etc.): within ±2°C of an independent
  observation source. (Amendment approved 2026-11-25 — log entry #4.)

Verification sources must sit OUTSIDE the answering miner's declared supply
(Phase 1 finding #1): e.g. verify crypto prices against Kraken — not
CoinGecko/Binance/Coinbase when the miner declares those; verify weather
against wttr.in or NOAA — not Open-Meteo when the miner sources Open-Meteo.

## Acceptable latency

Under 60 seconds per purchased answer (testnet grace).

## Willingness to pay

Honestly marked TBD — a mainnet-era question. Testnet answers cost fake
cents. Revisit at Phase 5c.

## Out of scope (the fence)

Extra Intents beyond the deterministic MVP set, selling skills back to the
network, any UI polish, any real money — all deferred to Phase 5 branches
with separate approvals.
