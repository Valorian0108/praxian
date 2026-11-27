# Praxian

Praxian is an agent configuration whose single job is honesty about where its answers come from. Ask it anything about the present moment, a price, a temperature, today's news, and it buys the answer from the Telegraph network for about a cent and shows you the receipt. Ask it anything timeless and it answers from its own memory while wearing a label that says so. Every answer of both kinds lands as a row in a ledger you can audit at any time. The name comes from praxis, the old word for theory turned into action, because Praxian is defined by what it does and logs rather than by what it claims.

This repository holds the contract that makes the agent behave, the ledger design, the frozen experiment that tested it, an independent checker, and this manual. It also holds our honest results, including the accuracy bar the project set for itself and missed, since a honesty project that hides its misses would be a walking contradiction. Read RESULTS.md before trusting anything here.

## What you are actually installing

Four owners meet inside a running Praxian, and knowing them keeps the whole thing intelligible. The Telegraph network, its miners and its escrow contracts belong to Telegraph Protocol, as does the telegraph MCP server you fetch from public npm, which acts as the hand that holds your wallet and pays. The agent application, whether a coding agent like Claude Code, Codex or OpenCode, or a chat host like Cherry Studio, supplies the body. This repository supplies the creation, meaning the contract, the ledger discipline and the verification habit. Everything remaining, the wallet, the escrow balance, the machine and the running instance, belongs to you alone.

## Prerequisites

You need Node 20 or newer, any agent that speaks MCP and can write files, about fifteen minutes, and testnet funds from free faucets. The money is play money throughout; the habits are the real product.

## Setup, zero to working

Clone this repository first, because everything below assumes you are standing inside it.

Create your wallet with `npx -y @telegraphprotocol/telegraph-protocol-mcp@2.3.0 setup`, adding `--yes` if you want non-interactive defaults, and back up the wallet file it names the moment it exists, since that file is the only copy of your key. Fund it next: the Anjoman dashboard faucet sends test USDC to your wallet address, and any public Sepolia faucet supplies the dust of ETH that gas costs require. Move about five test dollars into escrow with `npx -y @telegraphprotocol/telegraph-protocol-mcp@2.3.0 fund 5`, which buys hundreds of one-cent answers.

Now attach the telegraph MCP server to your agent, and this is the one step that differs per host:

| Host | How the contract arrives | How the MCP server attaches |
|---|---|---|
| Claude Code | automatically, from CLAUDE.md when the folder opens | `claude mcp add telegraph -- npx -y @telegraphprotocol/telegraph-protocol-mcp@2.3.0`, or the project `.mcp.json` |
| Codex, OpenCode and other AGENTS.md readers | automatically, from AGENTS.md when the folder opens | the host's MCP config file, command `npx`, args `-y @telegraphprotocol/telegraph-protocol-mcp@2.3.0` |
| Cherry Studio (our tested host) | paste the contract below into a new agent's system prompt | Settings, MCP, add a stdio server with the same command, then scope it to the agent from the chat's MCP picker |

One rule governs every host: start a fresh session after attaching, because sessions snapshot their tool list at birth and never see servers attached later.

Coding agents need no further step, since the AGENTS.md and CLAUDE.md files in this repository install the contract the moment the folder opens. Chat hosts need the contract pasted once, and it is printed in full below. For the ledger, coding agents write to the LEDGER.csv file at the root of the clone exactly as the contract states, while chat hosts substitute their own absolute path for `<YOUR_LEDGER_PATH>`.

## The contract, verbatim

    You are Praxian, an agentic personnel born of praxis: theory that clocks
    in. Your entire purpose is one rule: the user must never wonder whether
    your answer was remembered or purchased.

    THE TWO-CATEGORY RULE (absolute, there is no third category):
    1. CURRENT OR CHECKABLE FACTS, meaning prices, exchange rates, weather,
       sports scores, recent events and "is X true" claims, you MUST buy
       through the Telegraph network using the telegraph_ask tool. NEVER
       answer these from memory.
    2. EVERYTHING ELSE, meaning timeless knowledge, explanations, opinions
       and creative work, you may answer from memory, but the answer MUST
       begin with the label: [FROM MEMORY - unverified]

    PURCHASED ANSWERS: show the answer together with the resolved intent, the
    miner that served it, the cost in USDC and the receipt hash. Purchases
    take roughly 15 to 40 seconds, so tell the user you are purchasing BEFORE
    calling the tool.

    THE LEDGER (mandatory, every answer, both categories): append one row to
    <YOUR_LEDGER_PATH>, which for coding agents working inside this
    repository means the LEDGER.csv file at the repository root.
    Columns: date,question,answer_source,intent,provider_id,receipt_provider_id,
    rank,cost_usdc,receipt_hash,verified_correct,verification_source,notes
    - answer_source: purchased | memory
    - memory answers: cost_usdc=0, receipt fields empty, intent=none
    - verified_correct: write "pending", a later process fills it
    - quote any field containing commas

    SPENDING DISCIPLINE:
    - One ask never exceeds $0.50, which the tooling enforces; never attempt
      to bypass it.
    - Session budget: $2.00 test USDC. Track cumulative spend through the
      ledger rows you have written this session, and if the next purchase
      would exceed the budget, STOP and ask the user.
    - If the Telegraph tools are unavailable, error, or the escrow is empty:
      say so explicitly, naming which. Only then may you offer a memory
      answer labeled [FALLBACK - MEMORY, NOT PURCHASED] and log it as such.
      NEVER silently substitute memory for a purchase, and never hang: fail
      into a labeled answer or a clean stop within the same reply.

    SECRETS: never ask for, display or handle wallet private keys. The
    tooling handles the wallet; that is not your job.

    HONESTY: if a purchase returns partially, with rejected fields or
    warnings, report exactly which parts came back and which did not.

## The five verbs

**Run it.** Ask any current-fact question, for example the current price of Bitcoin in US dollars. Expect a purchasing notice, fifteen to forty seconds of patience, then the answer accompanied by its intent, miner, cost and receipt hash, with a matching row appearing in the ledger.

**Check it.** Ask something timeless, for example what an API is. Expect no purchase at all, an answer opening with [FROM MEMORY - unverified], and a ledger row recording zero cost. The pair of tests together proves the rule works in both directions, buying when it must and refraining when it must not.

**Inspect it.** Open the ledger and take any receipt hash from it, then confirm the escrow arithmetic with `npx -y @telegraphprotocol/telegraph-protocol-mcp@2.3.0 status`, whose spent_today figure should equal the sum of your purchased rows. The receipts themselves are public data, so this inspection works from any browser too.

**Break it.** Break Praxian on purpose and watch it fail the way the contract orders it to. Four failure modes are documented with their required behaviors, and each carries an honest test status that we update whenever a drill actually runs. With the telegraph server absent or detached and a fresh session asked for a price, the agent must disclose that its tools are unavailable, then fall back to a labeled memory answer and a ledger row, never silently substituting memory for a purchase; status: tested 2026-11-26 in the OpenCode body, where disclosure, fallback and row all appeared as promised and the agent went further by flagging its own stale citation as unfit for decisions. With the escrow emptied through `withdraw` and the same question asked, it must name the empty escrow explicitly before the same labeled fallback; status: tested 2026-11-27 with an unexpected outcome, because the network served a billed ask despite zero spendable and a pending withdrawal, so no error occurred and the designed disclosure path never triggered. The agent behaved correctly given that reality, reporting a successful purchase with receipt and contemporaneous verification. The finding sits with the network: a pending withdrawal does not freeze spending straight away, an accounting edge recorded in APPROVAL-LOG entry 12 and queued for upstream disclosure by the owner. With a clean tool error, it must disclose and fall back within the same family; status: tested 2026-11-26 in the OpenCode body via a nonexistent miner id, producing a hard 404 with no charge, followed by disclosure, labeled fallback and row. With a bogus intent, the network's real behavior proved to be a finding of its own: instead of erroring it silently reroutes to a general intent and bills, returning partial fields plus its own non-responsive warning; status: tested 2026-11-26 as Drill B2 with the finding recorded, and this silent reroute-and-bill is a fourth failure mode the contract's failure clause does not yet name, for which a degraded-purchase disclosure amendment is queued for approval. A wrong server endpoint should fail loudly at connect time with no silent success, and we flag that expectation as untested rather than claim otherwise.

**Reproduce it.** Run the three customers in questions/gate-demo.md, being a must-buy price question, a must-label timeless question and a must-buy weather question, then cross-check any purchased price or temperature row with `node verify/check.js price BTC <claimed>` or `node verify/check.js temp "New York" <claimed>`. Tolerances are plus or minus one percent for prices, verified within a minute of the answer or compared against the day's average per RESULTS.md finding F1, and plus or minus two degrees Celsius for temperatures.

## What to expect

Purchases take fifteen to forty seconds each and cost one to three cents, since a question whose first answer is incomplete may consult a second miner at a cent apiece. The tooling enforces caps of fifty cents per ask and five dollars per day, and the contract adds a two dollar session stop on top. Everything runs on testnet, so the money is fake while the discipline is the product, and because the network is pre-mainnet you should pin the package version above and expect APIs to move before January 2027.

## Honest boundaries, from our own evaluation

Purchased answers can still be stale, either because a miner served old data or because the miner is itself a language model answering from its own memory, which our findings F2 and F3 document in RESULTS.md. Buying therefore relocates staleness rather than removing it, and only independent verification removes it, which is why the checker in verify/ is part of the product rather than an extra. Our SPEC set a bar of nine verified-correct answers in ten, and strict scoring reached fifty percent, so the bar was missed and RESULTS.md says so in writing; the drift-aware reading gives a seventeen percent true-error rate, and both numbers live there side by side. Reporting misses in writing is the point of the ledger culture, not a failure of it.

## Files in this repository

PLAN.md carries the phases and gates, SPEC.md the promises and rulers, RESULTS.md the experiment and its findings, REALITY-REPORT.md the supply research and field notes, LEDGER.csv the schema plus our own rows as worked examples, the questions folder the frozen A/B set and the gate demo, verify/check.js the independent checker, and AGENTS.md plus CLAUDE.md the auto-loading contract for coding agents.

## License

Pending the owner's choice, recorded in APPROVAL-LOG.md when decided.
