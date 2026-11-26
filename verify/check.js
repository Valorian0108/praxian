// Independent checker for Truth Agent purchased answers.
// Usage:
//   node verify/check.js price BTC <claimed_usd>
//   node verify/check.js temp "New York" <claimed_celsius>
// Verdicts against frozen tolerances: prices ±1% of Kraken spot, temps ±2°C
// of wttr.in. Run price checks within a minute of the answer, or compare
// against the day's average instead (RESULTS.md finding F1).
const [,, kind, target, claimedRaw] = process.argv;
const claimed = parseFloat(claimedRaw);

function fail(msg) { console.log('CHECK ERROR: ' + msg); process.exit(2); }
if (!kind || target === undefined || isNaN(claimed)) {
  fail('usage: node verify/check.js price BTC <claimed> | temp "New York" <claimed>');
}

async function getJson(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'truth-agent-checker/1.0' } });
  if (!r.ok) fail('fetch failed ' + url + ' -> ' + r.status);
  return r.text();
}

(async () => {
  if (kind === 'price') {
    const pair = { BTC: 'XBTUSD', ETH: 'ETHUSD', SOL: 'SOLUSD', XRP: 'XRPUSD' }[target.toUpperCase()];
    if (!pair) fail('unsupported symbol ' + target + ' (try BTC ETH SOL XRP)');
    const body = JSON.parse(await getJson('https://api.kraken.com/0/public/Ticker?pair=' + pair));
    const key = Object.keys(body.result)[0];
    const spot = parseFloat(body.result[key].c[0]);
    const diffPct = Math.abs(spot - claimed) / spot * 100;
    console.log('kraken spot: ' + spot + ' | claimed: ' + claimed + ' | diff: ' + diffPct.toFixed(2) + '%');
    console.log(diffPct <= 1 ? 'VERDICT: CORRECT (within ±1%)' : 'VERDICT: OUTSIDE ±1% — see RESULTS.md F1 before calling this a lie');
  } else if (kind === 'temp') {
    const txt = (await getJson('https://wttr.in/' + encodeURIComponent(target) + '?format=%t')).trim();
    const m = txt.match(/([+-]?\d+(?:\.\d+)?)\s*°([CF])/);
    if (!m) fail('unparseable wttr.in reply: ' + txt);
    let obs = parseFloat(m[1]);
    if (m[2] === 'F') obs = (obs - 32) * 5 / 9;
    const diff = Math.abs(obs - claimed);
    console.log('wttr.in observed: ' + obs.toFixed(1) + '°C | claimed: ' + claimed + '°C | diff: ' + diff.toFixed(1) + '°C');
    console.log(diff <= 2 ? 'VERDICT: CORRECT (within ±2°C)' : 'VERDICT: WRONG (outside ±2°C)');
  } else {
    fail('unknown kind ' + kind);
  }
})().catch((e) => fail(String(e && e.message || e)));
