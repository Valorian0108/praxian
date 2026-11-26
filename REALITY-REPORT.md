# REALITY REPORT — Phase 1 (FINAL DRAFT, 2026-11-25)

**Verdict: GO** — all go/no-go criteria met (pending user confirmation of the gate).
All findings observed live from this machine (Rule 7), reproducible from the
commands and scripts noted (Rule 8).

## Environment (verified)

- Node v24.18.0, npm 11.16.0, git 2.55.0 (Windows)
- Package: `@telegraphprotocol/telegraph-protocol-mcp@2.3.0` (pinned; npm-verified,
  published 2026-11-23; deps legitimate: viem, @x402/*, @modelcontextprotocol/sdk)
- Network: Ethereum Sepolia testnet (chain 11155111) — fake money, by design
- Node: https://devnode.telegraphprotocol.com — reachable, 136 intents
- Escrow contract: 0x72a70e949362670Bf8bceAd24eFC5b8f950aa08b

## Wallet & funding (Rule 6 compliance)

- Address (public): 0xbaE1Cfb67643532858e32a74cD81F8A22129eDD6
- Key file: wallet.json inside the user profile's .telegraph folder — contents never displayed,
  never entered chat
- Backup: a copy kept in a backup directory outside any git repo — same minute as
  creation; both outside any git repo
- Funded: 10 test USDC + 0.05 Sepolia ETH via faucets (user, browser)
- Escrow: 5 USDC deposited (approve+deposit txs: 0x7c9075d6..., 0xdc9de919...)
- After 5 asks: 4.95 spendable + 0.05 unbilled; spent_today 0.05 — exact

## Built-in safety rails (observed)

- max_per_ask_usd 0.50 · daily_usd 5.00 · per-ask budget hold $0.26
- ~$0.01 per miner whose answer is used; settlement batched per epoch (id 55)
- Rule 6's spending-cap requirement is native to the tooling

## MCP surface (8 tools, probed via stdio JSON-RPC)

FREE: find_intents, intent, find_miners, ranking, account, docs
PAID: telegraph_ask (auto-routes to best-ranked live miner),
telegraph_ask_miner (specific miner, no fallback)
Installed into Cherry Studio as server "telegraph" (stdio, pinned) — active.

## Supply depth

136 intents live. Key ones: CRYPTO_PRICE_USD 59 miners (top: CryptoPulse,
score 0.987, median of CoinGecko/Binance/Coinbase), WEATHER_CHECK_TEMPERATURE
35, WEB_SEARCH_GENERAL 30, FACT_CHECK_GENERAL 20, QUESTION_ANSWERING_GENERAL 17.
Top miners ACTIVE with real history (PREFLIGHT: 2,794 requests served).

## THE RECORD TABLE — five paid test queries (2026-11-25)

| # | Question | Intent (resolved) | Miner | Latency | Cost | Receipt hash | Independent check | Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | BTC price now | CRYPTO_PRICE_USD | CryptoPulse (rank 1) | 25.4s | $0.01 | 0x3521b12c… | Kraken: $57,459.10 vs answer $57,418.36 → **0.07% off** | ✓ correct |
| 2 | ETH price now | CRYPTO_PRICE_USD | CryptoPulse (rank 1) | 24.7s | $0.01 | 0x8c091c65… | Kraken: $1,617.60 vs $1,612.59 → **0.31% off** | ✓ correct |
| 3 | NYC temperature | WEATHER_CHECK_TEMPERATURE | PREFLIGHT (rank 2) | 13.6s | $0.01 | 0xe24fe447… | wttr.in: +2°C vs 3.5°C → **Δ1.5°C** | ~ plausible; no tolerance defined in SPEC (see findings) |
| 4 | AI headlines today | NEWS_HEADLINES_GENERAL (auto-resolved) | TxLens | 28.9s | $0.01 | 0x71b5fa9b… | window "22–25 Nov 2026" = current; individual stories not verified | plausible |
| 5 | "Eiffel Tower is in Berlin" | FACT_CHECK_GENERAL (auto-resolved) | TxLens | 35.6s | $0.01 | 0x99e55711… | verdict **False**, reasoning correct (Paris, France) | ✓ correct |

Checks used sources OUTSIDE miners' declared supply (Kraken, wttr.in) per the
circularity finding below. Probe script: session workspace telegraph-probe.js.

## Go/No-Go (criteria fixed in PLAN.md before the test)

- [x] ≥2 deterministic queries returned receipted answers → 3 returned, all receipted
- [x] ≥1 answer verified correct vs reality → 2 prices within 0.31%, fact-check correct
- [x] Latency <60s → range 13.6–35.6s
- **VERDICT: GO** (user confirmation pending — Phase 1 gate)

## Findings that change downstream phases

1. **⚠ Verification circularity (caught pre-test, Phase 3 design changed):**
   top weather miner "Wx Openmeteo" sources Open-Meteo; crypto top miner
   sources CoinGecko/Binance/Coinbase. Phase 3 verification MUST use sources
   outside each miner's declared supply (as done in this report).
2. **SPEC gap exposed:** no tolerance defined for continuous values
   (temperature). Proposal for user approval: ±2°C vs an independent
   observation source. SPEC amendment, needs sign-off (Rule 4).
3. **Intent auto-resolution works:** plain-language questions routed to the
   right intent without specifying it (Q4→NEWS_HEADLINES, Q5→FACT_CHECK).
   The Truth Agent can ask naturally; explicit intent optional.
4. **Routing nuance:** weather was served by the rank-2 miner, not rank-1 —
   "top-ranked" routing has live-status nuances; receipt shows a different
   internal miner id than the display id (5311 vs 20260828). Note for ledger
   design: store BOTH ids.
5. **Latency 14–36s:** fine for a research agent, too slow for chat-flow
   instant answers. Phase 2 UX must set expectations ("purchasing… ~20s").
6. **Partial-fulfillment machinery visible:** `field_status` marked
   `urls`/`sources` as "rejected" — the network grades answer FIELDS, and
   warnings noted non-echo of the question. Cosmetic now; relevant when the
   agent must decide "is this answer complete enough?"
7. **Accounting is exact to the cent** — escrow math matched 5×$0.01
   precisely. The ledger product can trust the receipts as source of truth.

## Phase 2 field notes (wiring, 2026-11-25)

- Agent created: "Truth Agent", id 8deb99a4-e0c1-472a-8254-1373d979f78f,
  contract installed verbatim (approval log entry #5). First-message behavior
  was exemplary: quoted its contract verbatim, called nothing, bought nothing,
  and VOLUNTEERED the no-silent-substitution consequence of its missing tools.
- DISCOVERY — sessions snapshot their tool list at birth. The first wiring-
  check session (created before telegraph was attached to the agent) saw
  zero telegraph tools forever; a fresh session created after the attach
  sees all 8. Attach changes do not reach already-running sessions.
  Operational rule: after attaching/detaching MCP servers, start a NEW
  session before testing.
- Attach path in Cherry Studio UI: chat input's MCP picker → select server →
  scope "Current Agent" → confirm. Global Settings → MCP shows server health
  and per-tool Enable/Auto-Approve toggles but NOT per-agent attachment.
- ⚠ Auto Approve is ON for all 8 telegraph tools — the agent spends without
  per-call human confirmation. Guardrails: $0.50/ask + $5/day tool caps and
  the contract's $2/session budget-stop. ACCEPTABLE ON TESTNET; must be
  revisited before any real money (Phase 5c).
- Non-interactive turns (delivery-triggered) block session_send/session_create
  via hook. Gate demo therefore runs either (a) manually by the user in the
  agent's chat, or (b) programmatically from an interactive turn.

## Field notes (lessons in the wild)

- Setup wizard defeats naive piping (readline event race); `--yes` flag found
  by READING THE PACKAGE SOURCE — the manual inside the machine (lesson #10).
- Git Bash /tmp ≠ Windows C:\tmp — deployment-climate problem (lesson #8)
  reproduced on one machine in one session.
- Project commits so far: e1e688d (Phase 0), bffec01 (interim report), + this.
