# PROJECT PLAN — "Truth Agent" (working title, rename pending)

**Status:** APPROVED by user 2026-11-25 ("ok approve an log it") — see APPROVAL-LOG.md entry #2.
**Current phase:** COMPLETE as of 2026-11-27, maintenance mode. Phases 0-4
all closed: spec, reality check, live agent, gate demo, A/B experiment with
honest results, stranger manual, all four failure drills tested across two
bodies (Cherry Studio and an OpenCode clone of the public repo), stranger
certification passed, license MIT, amendments and manual fixes applied.
Queue empty per APPROVAL-LOG entry #14. Remaining items live outside this
plan: the F-ESCROW-1 disclosure send and the live-agent contract paste are
the owner's hands; the Praxis showroom is a separate future project.
Everything below is kept as the historical record.
**Pace:** own-pace, no deadlines. Roughly one phase per session.

## What this project is

A personal agent (inside Cherry Studio) that refuses to answer current-facts
questions from memory. It buys verified answers through the Telegraph Protocol
testnet (ranked providers, x402 micropayments, receipts), logs every purchase
in LEDGER.csv, labels every memory answer as unverified, and independently
checks purchased answers against free public sources.

**The product is the behavior + the ledger — not new plumbing.**

Fuses two official hackathon mission routes (Season II, telegraphprotocol):
- Mission 09 "Personal Agent", Route 1: ranked queries in a real agent loop
  with wallet budget, logging and limits. Intents: WEB_SEARCH,
  QUESTION_ANSWERING, WEATHER_CHECK, CRYPTO_PRICE.
  (github.com/telegraphprotocol/bounties/issues/197)
- Mission 10 "Model Economy", Route 1: cost per verified correct answer with
  independent verification. (github.com/telegraphprotocol/bounties/issues/198)

## Key facts (verified 2026-11-25 — re-verify at use time, Rule 7)

- MCP server: npm `@telegraphprotocol/telegraph-protocol-mcp` v2.3.0, real on
  registry, last published 2026-11-23. Deps legitimate (viem, @x402/*,
  @modelcontextprotocol/sdk). Requires Node 20+ (this machine: Node v24.18.0).
- Setup: `npx -y @telegraphprotocol/telegraph-protocol-mcp setup` creates
  wallet at `~/.telegraph/wallet.json` (ONLY copy — back it up), moves chosen
  USDC into escrow. Commands: `setup`, `fund`, `status`, `withdraw`.
  Escrow = prepaid envelope; payments automatic; no keys/signatures in agent.
- Fallback Path A: Anjoman skill — API key only, no wallet, spend cap,
  traces, receipts. (`npx skills add telegraphprotocol/telegraph-mcp --skill anjoman`)
- Testnet USDC faucet: anjoman.ai/dashboard/faucet (needs account sign-up).
- Network state: TESTNET. Mainnet planned Jan 2027. Team ~5 people,
  Copenhagen. All testnet money is fake — the risk is habits, not losses.
- Live Intent catalog (134 Intents) is behind JS dashboards — confirming what
  actually answers is a Phase 1 task, NOT assumed.

## Folder structure

    projects/truth-agent/
    ├── PLAN.md            ← this file
    ├── SPEC.md            ← Phase 0 output (draft, pending approval)
    ├── REALITY-REPORT.md  ← Phase 1 output
    ├── LEDGER.csv         ← the living product artifact (Phase 2)
    ├── questions/ab-set-v1.md ← Phase 3 fixed test set
    └── README.md          ← Phase 4 stranger test

Git: initialized at end of Phase 0; commit at every green state (lesson 11).
Approval log stays central: ../../APPROVAL-LOG.md (Rule 4).

## PHASE 0 — The Spec (one conversation, zero code)

Do: review SPEC.md word-by-word; approve or reshape.
Gate: user approves SPEC.md. → logged.

## PHASE 1 — Touch (reality check, one afternoon)

Steps, in order:
1. Create a backup directory outside the project and outside any git repo (
   outside project). Wallet copy goes there the moment it exists (Rule 6).
2. Run MCP `setup` (assistant runs, user approves escrow prompt — or user
   runs it themselves; user's comfort call). Package pinned v2.3.0.
3. Faucet: user signs up at anjoman.ai, gets testnet USDC (human-hands step).
4. Escrow ~5–10 testnet USDC (an envelope, not a bank account).
5. Install MCP server into Cherry Studio (assistant's MCP manager; exact
   stdio config confirmed live from current README — never from memory).
6. Five test queries, filling the record table:
   - BTC price now (CRYPTO_PRICE)
   - ETH price now (same Intent — consistency check)
   - Weather for user's actual city (WEATHER_CHECK)
   - One QUESTION_ANSWERING / WEB_SEARCH query about something recent
   - One wildcard from the live tool list (e.g. AI-text/deepfake detection)
7. Record columns: Intent · tool name · latency · cost · providers competing ·
   rank used · receipt visible? · matched reality? (manual check vs public source)
8. Write REALITY-REPORT.md, including the live Intent catalog.

Go/No-Go (fixed NOW, not negotiable later):
- GO: ≥2 deterministic queries return receipted answers, ≥1 verified correct
  against reality, latency <60s.
- PIVOT: MCP fails on Windows → Path A (Anjoman API key + small script).
- PAUSE: no live providers answering → shelf with logged note, revisit near
  mainnet. Idea right, network not ready.

Gate: report decides, user confirms. → logged.

## PHASE 2 — Walking Skeleton (MVP, 2–3 sessions)

Build:
1. Custom Cherry Studio agent, system prompt v1:
   "You are the Truth Agent. Any question depending on current or checkable
   facts — prices, weather, recent events, verifiable claims — MUST be
   answered by purchasing through Telegraph tools, never from memory. Every
   purchased answer must be shown with its cost and receipt, and a row
   appended to LEDGER.csv. Any answer from memory must be labeled
   [FROM MEMORY — unverified] and also logged. If a purchase would exceed the
   spend cap, stop and ask the user."
2. LEDGER.csv columns: date · question · answer_source (memory|purchased) ·
   intent · provider_id · rank · cost_usdc · receipt_ref ·
   verified_correct (yes|no|pending) · verification_source · notes
3. Spend cap: 2 testnet USDC per session, enforced by prompt + escrow.
4. `git init`, commit every green state (first real repo, coached live).
5. Gate demo script — 3 runs: (a) BTC price → must buy; (b) "explain what an
   API is" → must answer from memory, correctly labeled (tests the rule in
   the negative direction); (c) city weather → must buy. 3/3 with ledger rows.

Scope fence (NOT in this phase): extra Intents, selling skills back, any UI,
automated verification (Phase 3's job).

Gate: demo passes 3/3 with output shown (Rule 8). → logged.

## PHASE 3 — Verification Layer (2 sessions — the product becomes the product)

1. Write questions/ab-set-v1.md: 12 fixed questions — 4 crypto prices,
   4 weather/city facts, 4 recent events. Written once, never edited
   mid-experiment, disclosed (Mission 10 language).
2. A/B run: each question answered twice — plain fresh Cherry session without
   Telegraph (memory) vs Truth Agent (purchased). Both logged.
3. Independent verification, automated where possible: prices vs Kraken
   public API (no key), weather vs wttr.in or NOAA (no key), events vs web
   search — every source OUTSIDE the answering miner's declared supply
   (Phase 1 finding #1). Tolerances per SPEC.md: prices ±1%, temperature
   ±2°C, yes/no exact, events binary. The checking script gets committed
   and its output shown (Rule 8).
4. Headline numbers: (a) hallucination gap — memory-wrong vs purchased-wrong
   on the same 12; (b) cost per verified correct answer — total spent ÷
   verified-correct purchases.
5. All ledger rows: verified_correct + verification_source filled. No "pending".

Gate: numbers written down HONESTLY even if they embarrass the idea.
"Memory was right anyway" = PASS of this phase + SPEC.md conversation. → logged.

## PHASE 4 — Hardening & Stranger Test (1–2 sessions)

1. README.md structured as the five acceptance verbs: RUN it · CHECK it ·
   INSPECT it · BREAK it · REPRODUCE it.
2. Three documented break cases: (a) escrow emptied → refuse gracefully,
   say why; (b) Intent with no provider → labeled memory fallback, no hang;
   (c) wrong endpoint → fail loudly, never silently. Behaviors written into
   the system prompt and tested.
3. Stranger test: a FRESH Cherry session, blank memory, given only the
   README, attempts the demo. Where it gets confused, README gets fixed.

Gate: stranger succeeds. Not "I think it's clear" — a stranger succeeded. → logged.

## PHASE 5 — The Fork (optional, each branch separately approved)

- 5a Bounty/challenge: check December challenges + funded bounty Issues AT
  THAT TIME (re-verify rules, never assume); submit Phase 4 package if eligible.
- 5b Act two: register one of the agent's capabilities as a Miner
  (Mission 09 Route 2) — buyer AND seller.
- 5c Mainnet readiness (Jan 2027+): fresh Paranoia Pass for real-money
  conditions — real escrow, real caps, key handling, fate of testnet work.
- 5d Spinoff: ledger + verification script as a standalone tool for any
  agent user.

Gate: explicit user pick, or deliberate "none for now". → logged.

## Standing rules (all phases, no exceptions)

- Rule 6 secrets: throwaway wallet only, backed up before use, never reused
  for anything real, never in chat/code/git.
- Rule 4: every gate decision → entry in ../../APPROVAL-LOG.md.
- Rule 7: every new package/endpoint verified live at use time; versions pinned.
- Rule 8: gates pass on SHOWN OUTPUT only, never claims.
- Git commit every green state.
- Platform-churn defense: keep the Telegraph layer thin and swappable;
  expect API changes before mainnet.

## Open items

- Project name: decided 2026-11-26 as **Praxian**, from praxis, "an agentic
  personnel". The folder keeps its historical name truth-agent; brand and
  contract say Praxian. Two user UI tasks remain: rename the Cherry Studio
  agent display name, and paste the new contract opening line (both quoted
  in APPROVAL-LOG entry #9).
- Rule 10 amendment ("log lessons only when user says 'log this'") — proposed,
  user has not answered. LESSONS.md logging paused until decided.

## PARKING NOTE (2026-11-25, SUPERSEDED 2026-11-27: unparked, Phase 4 completed, queue emptied; kept as history)

Parked by user at Phase 4, mid-Job-2. State at parking:

DONE: Phases 0–3 in full (spec, reality check, live agent, gate demo 3/3,
A/B experiment with honest results); Phase 4 Job 1 (README stranger manual,
verify/check.js); Break Drill B — which became a deeper pass than designed:
the agent REFUSED a paid call authorized only by a peer session (permission-
laundering defense), disclosed, labeled, logged. The drill's error path went
untested because the drill itself was misdesigned (category-2 question paired
with a fake intent); logged honestly in entry #8.

OPEN ON RESUME, in suggested order (updated 2026-11-26):
0. User UI tasks: rename the Cherry Studio agent display name to Praxian, and
   paste the new contract opening line into its instructions (both quoted in
   log entry #9).
1. Break Drill B2 (optional): error path via one user-authorized fake-intent
   call; authorization text quoted in log entry #8.
2. Detach drill: user detaches telegraph MCP, fresh session, price question;
   expect disclosure + labeled fallback + ledger row; re-attach after.
3. Job 3, the stranger test: blank coding-agent or chat session, README only,
   must reach a working demo cold.
4. Escrow-drain drill LAST (withdraw, observe, then re-fund).
5. Decisions parked with user: LICENSE (MIT recommended), SPEC amendment #2
   (drift-aware price scoring), Rule 10 amendment scope.
6. Contract amendment candidate #3 (from Drill B2 finding, 2026-11-26): add a
   degraded-purchase clause, disclosing as degraded any purchase whose
   resolved intent differs from what the question needed or whose required
   fields come back missing, quoting the network warning. Awaits user
   approval alongside amendment #2.

DONE 2026-11-26 WHILE PARKED: README BREAK overclaim reworded to honest
per-item test statuses; README restyled to flowing prose with no em dashes;
AGENTS.md and CLAUDE.md wrappers added so coding agents auto-load the
contract on clone; README setup re-centered on coding agents with Cherry
Studio as one tested alternative; project renamed Praxian. All in log #9.

WALLET AT PARKING: ~4.7–4.8 test USDC spendable in escrow, ~5 in wallet;
backup intact in the out-of-repo backup directory; no real money ever
touched. Testnet; mainnet is Jan 2027 — the door stays open as long as the
network does.

FIRST STEP ON RESUME: read this file + RESULTS.md; pick any open item above.
Everything needed lives in this folder; nothing lives only in anyone's head.
