// Builds the public legal pages from the same source the app shows
// (lib/i18n/index.ts + lib/legal.ts), so the store URL and the in-app text
// can never drift apart.   node scripts/build-legal.mjs   (Node 22.18+)
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { legalDoc } from '../lib/i18n/index.ts';
import { LEGAL } from '../lib/legal.ts';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function markdown(id) {
  return ['el', 'en']
    .map((lang) => {
      const d = legalDoc(id, lang, LEGAL);
      const updated = lang === 'el' ? `Ισχύει από ${LEGAL.effectiveDate}` : `Effective ${LEGAL.effectiveDate}`;
      return [`# ${d.title}`, `_${updated}_`, ...d.sections.map((s) => `## ${s.heading}\n\n${s.body.join('\n\n')}`)].join('\n\n');
    })
    .join('\n\n---\n\n') + '\n';
}

function html(id) {
  const docs = ['el', 'en'].map((lang) => ({ lang, d: legalDoc(id, lang, LEGAL) }));
  const body = docs
    .map(
      ({ lang, d }) => `<article lang="${lang}" id="${lang}">
  <h1>${esc(d.title)}</h1>
  <p class="meta">${lang === 'el' ? 'Ισχύει από' : 'Effective'} ${LEGAL.effectiveDate}</p>
${d.sections.map((s) => `  <h2>${esc(s.heading)}</h2>\n${s.body.map((p) => `  <p>${esc(p)}</p>`).join('\n')}`).join('\n')}
</article>`,
    )
    .join('\n<hr>\n');
  return `<!doctype html>
<html lang="el">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kyklos — ${esc(docs[0].d.title)} / ${esc(docs[1].d.title)}</title>
<style>
  :root { --bg:#F6F3EE; --ink:#161310; --muted:#766F68; --line:#E9E3DA; --accent:#E0592F; color-scheme: light dark; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0E0C0B; --ink:#F7F3EE; --muted:#A0978F; --line:#2B2724; --accent:#FF7043; } }
  body { margin:0; background:var(--bg); color:var(--ink); font:17px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  main { max-width:680px; margin:0 auto; padding:48px 20px 80px; }
  nav { display:flex; gap:16px; margin-bottom:32px; }
  nav a { color:var(--accent); text-decoration:none; font-weight:600; }
  h1 { font-size:32px; letter-spacing:-0.5px; margin:0 0 4px; }
  h2 { font-size:18px; margin:32px 0 8px; }
  p { color:var(--muted); margin:0 0 12px; }
  .meta { font-size:14px; }
  hr { border:0; border-top:1px solid var(--line); margin:56px 0; }
</style>
</head>
<body><main>
<nav><a href="./">← Kyklos</a><a href="#el">Ελληνικά</a><a href="#en">English</a></nav>
${body}
</main></body>
</html>
`;
}

// GitHub Pages serves docs/ from this repo: https://tsvms.github.io/kyklos/
const OUT = 'docs';
const REPO = 'https://github.com/tsvms/kyklos';
mkdirSync(OUT, { recursive: true });
copyFileSync('assets/icon.png', `${OUT}/icon.png`);
writeFileSync(`${OUT}/.nojekyll`, '');
for (const id of ['privacy', 'terms']) {
  writeFileSync(`${OUT}/${id}.html`, html(id));
  console.log(`wrote ${OUT}/${id}.html`);
}

const features = [
  ['🔥', 'Η φωτιά του σερί', 'The streak fire', 'Ανάβει όταν συνεχίζεις, σβήνει γκρι όταν σταματάς.', 'Lights up while you keep going, turns to grey ash when you stop.'],
  ['⬢', 'Βαθμίδες', 'Ranks', 'Από Σπίθα μέχρι Ολύμπια Φλόγα, όσο κρατάς τη φωτιά.', 'From Spark to Olympian, the longer the fire burns.'],
  ['🔔', 'Ήσυχες υπενθυμίσεις', 'Quiet reminders', 'Μία τοπική ειδοποίηση ανά συνήθεια, την ώρα που θες.', 'One local nudge per habit, at the time you pick.'],
  ['🔒', 'Ιδιωτικό', 'Private', 'Χωρίς λογαριασμούς, διαφημίσεις ή tracking. Όλα μένουν στο κινητό.', 'No accounts, ads or tracking. Everything stays on your phone.'],
];

writeFileSync(
  `${OUT}/index.html`,
  `<!doctype html>
<html lang="el">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kyklos — συνήθειες που ανάβουν φωτιά</title>
<meta name="description" content="Kyklos: ένας δωρεάν, ιδιωτικός habit tracker με σερί-φωτιά και βαθμίδες. Free, private habit tracker with streak fire and ranks.">
<link rel="icon" href="icon.png">
<style>
  :root { --bg:#F6F3EE; --card:#FFFFFF; --ink:#161310; --muted:#766F68; --line:#E9E3DA; --accent:#E0592F; --hero:#FFF3E8; color-scheme: light dark; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0E0C0B; --card:#1A1716; --ink:#F7F3EE; --muted:#A0978F; --line:#2B2724; --accent:#FF7043; --hero:#1F1814; } }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font:17px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  main { max-width:760px; margin:0 auto; padding:56px 20px 64px; }
  .hero { text-align:center; padding:48px 24px; border-radius:32px; background:radial-gradient(circle at 30% 0%, rgba(255,122,26,.28), transparent 60%), var(--hero); border:1px solid rgba(224,89,47,.22); }
  .hero img { width:96px; height:96px; border-radius:24px; box-shadow:0 12px 32px rgba(224,89,47,.25); }
  h1 { font-size:clamp(34px, 7vw, 52px); letter-spacing:-1.5px; line-height:1.05; margin:20px 0 12px; }
  .lead { color:var(--muted); font-size:19px; margin:0 auto 28px; max-width:520px; }
  .btn { display:inline-block; background:var(--accent); color:#fff; font-weight:700; text-decoration:none; padding:14px 26px; border-radius:999px; }
  .btn.ghost { background:transparent; color:var(--ink); border:1px solid var(--line); margin-left:8px; }
  .free { display:block; margin-top:14px; font-size:14px; color:var(--muted); }
  .grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin:28px 0; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:22px; padding:20px; }
  .card b { display:block; font-size:17px; margin:6px 0 4px; }
  .card span { color:var(--muted); font-size:15px; }
  .card .en { display:block; margin-top:6px; font-size:13px; opacity:.8; }
  .icon { font-size:26px; color:var(--accent); }
  footer { display:flex; flex-wrap:wrap; gap:18px; justify-content:center; color:var(--muted); font-size:14px; margin-top:32px; }
  footer a { color:var(--accent); text-decoration:none; font-weight:600; }
</style>
</head>
<body><main>
<section class="hero">
  <img src="icon.png" alt="Kyklos">
  <h1>Μικρά βήματα.<br>Μεγάλη φωτιά.</h1>
  <p class="lead">Το Kyklos σε βοηθά να χτίσεις συνήθειες με ένα σερί που καίει κάθε μέρα που συνεχίζεις.<br><em>Build habits with a streak that burns brighter every day.</em></p>
  <a class="btn" href="${REPO}/releases/latest">Λήψη για Android · Download</a><a class="btn ghost" href="${REPO}">GitHub</a>
  <span class="free">Δωρεάν · Χωρίς διαφημίσεις · Free, no ads</span>
</section>
<div class="grid">
${features
  .map(([icon, el, en, bodyEl, bodyEn]) => `  <div class="card"><div class="icon">${icon}</div><b>${esc(el)}</b><span>${esc(bodyEl)}<span class="en">${esc(en)} — ${esc(bodyEn)}</span></span></div>`)
  .join('\n')}
</div>
<footer>
  <a href="privacy.html">Πολιτική απορρήτου · Privacy</a>
  <a href="terms.html">Όροι χρήσης · Terms</a>
  ${LEGAL.contactEmail ? `<span>${esc(LEGAL.contactEmail)}</span>` : ''}
  <span>© ${new Date().getFullYear()} ${esc(LEGAL.publisher)}</span>
</footer>
</main></body>
</html>
`,
);
console.log(`wrote ${OUT}/index.html`);
writeFileSync('PRIVACY.md', markdown('privacy'));
writeFileSync('TERMS.md', markdown('terms'));
console.log('wrote PRIVACY.md, TERMS.md');
