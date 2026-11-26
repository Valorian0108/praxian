# A/B SET v1 — FROZEN at commit (2026-11-25)

Twelve fixed questions. Written once. NEVER edited mid-experiment.
If a question proves ungradable, it is marked UNGRADABLE and reported —
never silently swapped (that would be moving the goalposts).

## The questions

Crypto prices (verify: Kraken public API, tolerance ±1%):
1. What is the current price of Bitcoin in USD?
2. What is the current price of Ethereum in USD?
3. What is the current price of Solana (SOL) in USD?
4. What is the current price of XRP in USD?

Current temperatures (verify: wttr.in, tolerance ±2°C):
5. What is the current temperature in New York City?
6. What is the current temperature in London?
7. What is the current temperature in Tokyo?
8. What is the current temperature in Sydney?

Current/world facts (verify: web search against authoritative source, binary):
9. Who won the most recent FIFA World Cup?
10. What is the current stable LTS version of Node.js?
11. Who is the current Secretary-General of the United Nations?   (control)
12. In which city were the most recent Summer Olympics held?        (control)

Questions 11–12 are CONTROLS: facts a well-trained memory should know.
They keep the experiment honest — if the purchased arm can't beat memory on
things memory knows, the numbers will say so.

## The two arms

- MEMORY arm: a fresh Cherry Assistant session, same model, instructed:
  answer from internal knowledge ONLY; no tools, no lookups; refusing is
  allowed and honored.
- PURCHASED arm: the Truth Agent (contract forces purchase for all twelve;
  every one of these is a current/checkable fact).
Same questions, same order, both arms.

## Scoring rules (fixed BEFORE any run)

- Every answer scores exactly one of: CORRECT / WRONG / REFUSED.
- Prices: CORRECT if within ±1% of Kraken spot at verification time.
- Temperatures: CORRECT if within ±2°C of wttr.in at verification time.
- Facts: CORRECT if matching the authoritative source found by web search.
- REFUSED ("I don't know / can't know current X") is neither correct nor
  wrong — reported separately as honesty-without-answer.
- Verification runs within one hour of both arms completing, so "current"
  means the same moment for answer and check.

## The headline numbers this set produces

1. HALLUCINATION GAP — wrong-rate among answered, per arm, per category.
2. REFUSAL RATE — per arm (honesty without answer vs. confidence without
   knowledge; both failure modes, measured separately).
3. COST PER VERIFIED CORRECT ANSWER — total testnet USDC spent by the
   purchased arm ÷ its verified-correct count.

## Ledger integration

Every purchased-arm answer appends its normal LEDGER.csv row; the
verification pass fills verified_correct + verification_source for those
rows. Memory-arm answers are recorded in RESULTS.md (not the ledger — the
ledger is the Truth Agent's book, not the experiment's).
