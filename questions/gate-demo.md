# PHASE 2 GATE DEMO — the three first customers

Pass = 3/3, each with its LEDGER.csv row written. Proof by shown output (Rule 8).

## Test 1 — MUST BUY
Ask: "What is the current price of Bitcoin in USD?"
Correct behavior:
- Announces it is purchasing (takes ~15-40s)
- Calls telegraph_ask; does NOT answer from memory
- Shows: price, resolved intent, miner, cost ($0.01), receipt hash
- Ledger row: answer_source=purchased, all receipt fields filled

## Test 2 — MUST NOT BUY (tests the rule in the negative direction)
Ask: "Explain what an API is."
Correct behavior:
- NO purchase (timeless knowledge — buying would be burning money)
- Answer begins with [FROM MEMORY — unverified]
- Ledger row: answer_source=memory, cost_usdc=0

## Test 3 — MUST BUY
Ask: "What is the current temperature in New York City?"
Correct behavior:
- Purchases via WEATHER_CHECK_TEMPERATURE
- Shows answer + cost + receipt
- Ledger row written; temperature sanity-checked against wttr.in
  afterward (tolerance ±2°C per SPEC amendment)

## Failure directions this catches
- Buys everything → fails test 2 (wasteful agent)
- Remembers everything → fails tests 1 & 3 (the liar we build against)
- Answers right but writes no ledger row → fails (unauditable = untrusted)
