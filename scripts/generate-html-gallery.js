const fs = require("fs");
const path = require("path");

const SRC_PATH = path.join(__dirname, "../src/iconsMap.ts");
const OUT_HTML = path.join(__dirname, "../docs/index.html");
const OUT_CSS  = path.join(__dirname, "../docs/styles.css");

// ── Parse icons ──────────────────────────────────────────────────────
const src = fs.readFileSync(SRC_PATH, "utf8");
const re  = /(["']?)([\w$-]+)\1\s*:\s*require\(["']\.\.\/icons\/128\/([\w$-]+)\.png["']\)/g;
const entries = [];
let m;
while ((m = re.exec(src))) entries.push([m[2], "icons/128/" + m[3] + ".png"]);
entries.sort(([a], [b]) => a.localeCompare(b));

const N     = entries.length;
const year  = new Date().getFullYear();
const PKG   = "@vnaidin/react-native-cryptocurrency-icons";
const REPO  = "https://github.com/vnaidin/react-native-cryptocurrency-icons";

const letters = [
  ...new Set(entries.map(([s]) => /^[a-z]/i.test(s[0]) ? s[0].toUpperCase() : "#")),
].sort();

// ── HTML fragments ───────────────────────────────────────────────────
const iconsHtml = entries.map(([sym, img]) =>
  '<div class="ic" data-s="' + sym + '">' +
  '<div class="iw"><img src="' + img + '" alt="' + sym + '" loading="lazy"></div>' +
  '<span>' + sym + '</span></div>'
).join("");

const alphaHtml = letters
  .map((l) => '<button class="ab" data-l="' + l + '">' + l + "</button>")
  .join("");

// ── SVG icons ────────────────────────────────────────────────────────
const svgGh   = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3C5.37.3 0 5.67 0 12.3c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 22.1 24 17.6 24 12.3 24 5.67 18.63.3 12 .3z"/></svg>';
const svgSun  = '<svg class="i-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
const svgMoon = '<svg class="i-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const svgSearch = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
const svgX    = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
const svgGrid = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>';
const svgNores = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';

// ── Inline JS (no template literals → no escaping issues) ────────────
const js = [
  "(function () {",
  "var root = document.documentElement;",
  "var toast = document.getElementById('toast');",
  "var search = document.getElementById('search');",
  "var clrBtn = document.getElementById('clrBtn');",
  "var slider = document.getElementById('slider');",
  "var sizeVal = document.getElementById('sizeVal');",
  "var countEl = document.getElementById('count');",
  "var noRes = document.getElementById('noRes');",
  "var noResQ = document.getElementById('noResQ');",
  "var grid = document.getElementById('grid');",
  "var items = Array.from(grid.querySelectorAll('.ic'));",
  "var total = items.length;",
  "var toastTimer; var activeAlpha = null;",

  // Theme — respect system preference on first visit
  "var saved = localStorage.getItem('theme') ||",
  "  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');",
  "root.setAttribute('data-theme', saved);",
  "document.getElementById('thBtn').addEventListener('click', function () {",
  "  var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';",
  "  root.setAttribute('data-theme', next);",
  "  localStorage.setItem('theme', next);",
  "});",

  // Copy util + toast
  "function copy(text) {",
  "  if (navigator.clipboard) { navigator.clipboard.writeText(text); }",
  "  else {",
  "    var ta = document.createElement('textarea');",
  "    ta.value = text; ta.style.position = 'fixed';",
  "    document.body.appendChild(ta); ta.select();",
  "    document.execCommand('copy'); document.body.removeChild(ta);",
  "  }",
  "  clearTimeout(toastTimer);",
  "  toast.classList.add('show');",
  "  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);",
  "}",

  // Copy buttons (install command)
  "document.querySelectorAll('[data-copy]').forEach(function (btn) {",
  "  btn.addEventListener('click', function () { copy(btn.getAttribute('data-copy')); });",
  "});",

  // Size slider
  "function applySize(v) {",
  "  root.style.setProperty('--isz', v + 'px');",
  "  sizeVal.textContent = v + 'px';",
  "}",
  "slider.addEventListener('input', function () { applySize(this.value); });",
  "applySize(slider.value);",

  // Filter (search + alpha)
  "function filter() {",
  "  var q = search.value.trim().toLowerCase();",
  "  var al = activeAlpha;",
  "  clrBtn.style.display = q ? 'flex' : 'none';",
  "  var vis = 0;",
  "  items.forEach(function (item) {",
  "    var s = item.getAttribute('data-s');",
  "    var mq = !q || s.indexOf(q) !== -1;",
  "    var ma = !al || (al === '#' ? !/^[a-z]/i.test(s[0]) : s[0].toUpperCase() === al);",
  "    var show = mq && ma;",
  "    item.style.display = show ? '' : 'none';",
  "    if (show) vis++;",
  "  });",
  "  countEl.textContent = (q || al) ? (vis + ' of ' + total + ' icons') : (total + ' icons');",
  "  noRes.style.display = vis === 0 ? 'block' : 'none';",
  "  if (vis === 0) noResQ.textContent = '\"' + (q || al) + '\"';",
  "}",

  "search.addEventListener('input', filter);",
  "clrBtn.addEventListener('click', function () {",
  "  search.value = ''; filter(); search.focus();",
  "});",

  // Grid click → copy snippet
  "grid.addEventListener('click', function (e) {",
  "  var ic = e.target.closest('.ic');",
  "  if (!ic) return;",
  "  copy('<CryptoIcon symbol=\"' + ic.getAttribute('data-s') + '\" size={' + slider.value + '} />');",
  "});",

  // Alpha bar — toggle; clicking active letter clears it
  "document.getElementById('alpha').addEventListener('click', function (e) {",
  "  var btn = e.target.closest('.ab');",
  "  if (!btn) return;",
  "  var l = btn.getAttribute('data-l');",
  "  document.querySelectorAll('.ab').forEach(function (b) { b.classList.remove('on'); });",
  "  if (activeAlpha === l) { activeAlpha = null; }",
  "  else { activeAlpha = l; btn.classList.add('on'); }",
  "  filter();",
  "  if (activeAlpha) {",
  "    var first = items.find(function (item) {",
  "      var s = item.getAttribute('data-s');",
  "      return activeAlpha === '#' ? !/^[a-z]/i.test(s[0]) : s[0].toUpperCase() === activeAlpha;",
  "    });",
  "    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });",
  "  }",
  "});",

  // Keyboard shortcuts
  "document.addEventListener('keydown', function (e) {",
  "  if (e.key === '/' && document.activeElement !== search && document.activeElement.tagName !== 'INPUT') {",
  "    e.preventDefault(); search.focus();",
  "  }",
  "  if (e.key === 'Escape') {",
  "    search.value = ''; activeAlpha = null;",
  "    document.querySelectorAll('.ab').forEach(function (b) { b.classList.remove('on'); });",
  "    filter();",
  "    if (document.activeElement === search) search.blur();",
  "  }",
  "});",

  "}());",
].join("\n");

// ── CSS ──────────────────────────────────────────────────────────────
const css = `/* Generated by scripts/generate-html-gallery.js — do not edit manually */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root {
  --bg:     #f8fafc;
  --surf:   #ffffff;
  --surf2:  #f1f5f9;
  --brd:    #e2e8f0;
  --tx:     #0f172a;
  --tx2:    #64748b;
  --acc:    #6366f1;
  --acc-s:  #eef2ff;
  --sh:     0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04);
  --sh-md:  0 4px 16px rgba(0,0,0,.10), 0 2px 6px rgba(0,0,0,.06);
  --r:      12px;
  --isz:    48px;
  --hdr-h:  54px;
  --bar-h:  56px;
}
[data-theme=dark] {
  --bg:    #0f172a;
  --surf:  #1e293b;
  --surf2: #162032;
  --brd:   #2d3f55;
  --tx:    #f1f5f9;
  --tx2:   #94a3b8;
  --acc-s: #1e1b4b;
}

html { scroll-behavior: smooth }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  background: var(--bg); color: var(--tx); line-height: 1.5;
  transition: background .2s, color .2s;
}
a { color: var(--acc); text-decoration: none }
a:hover { text-decoration: underline }

/* ── Header ─────────────────────────────────────────── */
.hdr {
  position: sticky; top: 0; z-index: 200;
  height: var(--hdr-h);
  background: rgba(var(--surf), .9);
  background-color: var(--surf);
  border-bottom: 1px solid var(--brd);
  backdrop-filter: blur(12px);
  transition: background .2s, border-color .2s;
}
.hdr-in {
  max-width: 1400px; margin: 0 auto; padding: 0 24px;
  height: 100%; display: flex; align-items: center; justify-content: space-between;
}
.logo {
  display: flex; align-items: center; gap: 10px;
  font-weight: 700; font-size: .95rem; color: var(--tx);
}
.logo img { width: 28px; height: 28px; border-radius: 6px }
.logo span { color: var(--tx2); font-weight: 400 }
.hdr-r { display: flex; align-items: center; gap: 8px }
.gh-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 8px;
  border: 1px solid var(--brd); background: var(--surf2);
  color: var(--tx); font-size: .83rem; font-weight: 500; cursor: pointer;
  transition: background .15s, border-color .15s;
  text-decoration: none;
}
.gh-btn:hover { background: var(--brd); text-decoration: none }
.th-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 8px;
  border: 1px solid var(--brd); background: var(--surf2);
  color: var(--tx2); cursor: pointer; transition: background .15s;
}
.th-btn:hover { background: var(--brd); color: var(--tx) }
[data-theme=light] .i-moon { display: none }
[data-theme=dark]  .i-sun  { display: none }

/* ── Hero ───────────────────────────────────────────── */
.hero {
  max-width: 720px; margin: 72px auto 0; padding: 0 24px; text-align: center;
}
.hero h1 {
  font-size: clamp(2rem, 5vw, 3rem); font-weight: 800;
  letter-spacing: -.03em; line-height: 1.1; margin-bottom: 14px;
}
.hero h1 span { color: var(--acc) }
.hero-sub { color: var(--tx2); font-size: 1rem; margin-bottom: 28px }
.badges {
  display: flex; gap: 6px; justify-content: center;
  flex-wrap: wrap; margin-bottom: 28px;
}
.badges img { height: 20px; border-radius: 4px }
.install {
  display: inline-flex; align-items: stretch;
  background: var(--surf2); border: 1px solid var(--brd); border-radius: 10px;
  overflow: hidden; margin-bottom: 16px; max-width: 100%;
}
.install code {
  padding: 11px 16px; font-family: 'SF Mono', Consolas, 'Courier New', monospace;
  font-size: .88rem; color: var(--tx); white-space: nowrap; overflow-x: auto;
}
.install .cp {
  padding: 0 16px; border: none; border-left: 1px solid var(--brd);
  background: transparent; color: var(--tx2);
  font-size: .8rem; font-weight: 600; cursor: pointer; white-space: nowrap;
  transition: background .15s, color .15s; letter-spacing: .02em;
}
.install .cp:hover { background: var(--acc); color: #fff; border-color: var(--acc) }
.usage {
  background: var(--surf2); border: 1px solid var(--brd); border-radius: 10px;
  padding: 16px 20px; text-align: left; overflow-x: auto; margin-bottom: 72px;
}
.usage code {
  font-family: 'SF Mono', Consolas, 'Courier New', monospace;
  font-size: .85rem; line-height: 1.8; color: var(--tx); white-space: pre;
}

/* ── Toolbar ────────────────────────────────────────── */
.toolbar {
  position: sticky; top: var(--hdr-h); z-index: 190;
  background: var(--bg); border-bottom: 1px solid var(--brd);
  padding: 10px 24px;
  transition: background .2s;
}
.tbr {
  max-width: 1400px; margin: 0 auto;
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.srch {
  flex: 1; min-width: 180px;
  display: flex; align-items: center; gap: 8px;
  background: var(--surf); border: 1.5px solid var(--brd);
  border-radius: 10px; padding: 8px 12px;
  transition: border-color .15s;
}
.srch:focus-within { border-color: var(--acc) }
.srch svg { color: var(--tx2); flex-shrink: 0 }
.srch input {
  flex: 1; border: none; background: transparent;
  color: var(--tx); font-size: .93rem; outline: none; min-width: 0;
}
.srch input::placeholder { color: var(--tx2) }
.clr {
  display: none; align-items: center; justify-content: center;
  background: none; border: none; color: var(--tx2);
  cursor: pointer; padding: 2px; border-radius: 4px;
}
.clr:hover { color: var(--tx) }
.sld {
  display: flex; align-items: center; gap: 10px;
  color: var(--tx2); font-size: .83rem; white-space: nowrap;
}
.sld input[type=range] {
  width: 90px; accent-color: var(--acc); cursor: pointer;
}
.sv { min-width: 34px; text-align: right; font-variant-numeric: tabular-nums; color: var(--tx) }
.cnt { font-size: .83rem; color: var(--tx2); white-space: nowrap; margin-left: auto }

/* ── Alpha bar ──────────────────────────────────────── */
.alpha {
  max-width: 1400px; margin: 14px auto 0; padding: 0 24px;
  display: flex; flex-wrap: wrap; gap: 4px;
}
.ab {
  padding: 3px 9px; border: 1px solid var(--brd); border-radius: 6px;
  background: var(--surf); color: var(--tx2);
  font-size: .78rem; font-weight: 600; cursor: pointer;
  transition: background .1s, color .1s, border-color .1s;
}
.ab:hover { background: var(--acc-s); color: var(--acc); border-color: var(--acc) }
.ab.on  { background: var(--acc); color: #fff; border-color: var(--acc) }

/* ── Icons grid ─────────────────────────────────────── */
.grid {
  max-width: 1400px; margin: 14px auto 64px; padding: 0 24px;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 6px;
}
.ic {
  display: flex; flex-direction: column; align-items: center; gap: 7px;
  padding: 14px 8px; border-radius: 10px; cursor: pointer;
  border: 1.5px solid transparent;
  transition: background .15s, transform .12s, box-shadow .15s, border-color .15s;
  scroll-margin-top: calc(var(--hdr-h) + var(--bar-h) + 16px);
}
.ic:hover {
  background: var(--surf); box-shadow: var(--sh-md);
  transform: translateY(-3px); border-color: var(--brd);
}
.ic:active { transform: translateY(0); box-shadow: var(--sh) }
.iw {
  width: var(--isz); height: var(--isz);
  display: flex; align-items: center; justify-content: center;
  transition: width .15s, height .15s;
}
.iw img {
  width: var(--isz); height: var(--isz);
  object-fit: contain; border-radius: 4px;
  transition: width .15s, height .15s;
}
.ic span {
  font-size: .73rem; color: var(--tx2); text-align: center;
  word-break: break-all; max-width: 82px; line-height: 1.25;
}
.ic:hover span { color: var(--tx) }

/* ── No results ─────────────────────────────────────── */
.nores {
  display: none; text-align: center; padding: 80px 24px; color: var(--tx2);
}
.nores svg { margin-bottom: 20px; opacity: .35 }
.nores p { margin-bottom: 12px; font-size: 1rem }
.nores strong { color: var(--tx) }
.nores a { font-size: .9rem }

/* ── Toast ──────────────────────────────────────────── */
.toast {
  position: fixed; bottom: 32px; left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: #1e293b; color: #f1f5f9;
  padding: 10px 22px; border-radius: 100px;
  font-size: .85rem; font-weight: 500;
  pointer-events: none; opacity: 0;
  transition: opacity .2s, transform .2s;
  z-index: 9999; box-shadow: 0 4px 16px rgba(0,0,0,.25);
  white-space: nowrap;
}
[data-theme=dark] .toast { background: #f1f5f9; color: #1e293b }
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0) }

/* ── Footer ─────────────────────────────────────────── */
footer {
  border-top: 1px solid var(--brd); padding: 28px 24px;
  text-align: center; color: var(--tx2); font-size: .83rem;
}
footer a { color: var(--tx2) }
footer a:hover { color: var(--acc); text-decoration: none }

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 640px) {
  .hero { margin-top: 48px }
  .hero h1 { font-size: 1.8rem }
  .sld input[type=range] { width: 64px }
  .cnt { display: none }
  .grid { grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)) }
}
`;

// ── HTML ─────────────────────────────────────────────────────────────
const html = "<!DOCTYPE html>\n" +
'<html lang="en" data-theme="light">\n' +
"<head>\n" +
'  <meta charset="UTF-8">\n' +
'  <meta name="viewport" content="width=device-width,initial-scale=1">\n' +
"  <title>React Native Cryptocurrency Icons</title>\n" +
'  <meta name="description" content="Gallery of ' + N + ' cryptocurrency icons for React Native. Browse, search, and copy component snippets.">\n' +
'  <meta name="keywords" content="cryptocurrency,icons,react native,crypto,bitcoin,ethereum">\n' +
'  <meta property="og:title" content="React Native Cryptocurrency Icons">\n' +
'  <meta property="og:description" content="' + N + ' PNG icons for React Native &amp; Expo. Zero dependencies.">\n' +
'  <link rel="icon" href="icons/128/btc.png">\n' +
'  <link rel="stylesheet" href="styles.css">\n' +
"</head>\n" +
"<body>\n\n" +

'<header class="hdr">\n' +
'  <div class="hdr-in">\n' +
'    <a class="logo" href=".">\n' +
'      <img src="icons/128/btc.png" alt="">\n' +
'      crypto<span>icons</span>\n' +
"    </a>\n" +
'    <div class="hdr-r">\n' +
'      <a class="gh-btn" href="' + REPO + '" target="_blank" rel="noopener">' + svgGh + ' GitHub</a>\n' +
'      <button class="th-btn" id="thBtn" title="Toggle dark mode" aria-label="Toggle dark mode">' + svgSun + svgMoon + "</button>\n" +
"    </div>\n" +
"  </div>\n" +
"</header>\n\n" +

'<section class="hero">\n' +
"  <h1>React Native<br><span>Cryptocurrency Icons</span></h1>\n" +
'  <p class="hero-sub">' + N + ' icons &middot; PNG &middot; Zero dependencies &middot; Expo &amp; bare RN</p>\n' +
'  <div class="badges">\n' +
'    <img src="https://img.shields.io/npm/v/' + PKG + '?style=flat-square&color=6366f1" alt="npm version">\n' +
'    <img src="https://img.shields.io/npm/dm/' + PKG + '?style=flat-square&color=6366f1" alt="downloads">\n' +
'    <img src="https://img.shields.io/github/license/vnaidin/react-native-cryptocurrency-icons?style=flat-square&color=6366f1" alt="license">\n' +
"  </div>\n" +
'  <div class="install">\n' +
'    <code>npm install ' + PKG + '</code>\n' +
'    <button class="cp" data-copy="npm install ' + PKG + '" title="Copy">Copy</button>\n' +
"  </div>\n" +
'  <div class="usage"><code>' +
"import { CryptoIcon } from '" + PKG + "';\n" +
"\n" +
"&lt;CryptoIcon\n" +
"  symbol=\"btc\"\n" +
"  size={32}\n" +
"/&gt;" +
"</code></div>\n" +
"</section>\n\n" +

'<div class="toolbar">\n' +
'  <div class="tbr">\n' +
'    <div class="srch">' + svgSearch + '\n' +
'      <input id="search" type="text" placeholder="Search symbols\u2026 (press / to focus)" autocomplete="off" spellcheck="false">\n' +
'      <button class="clr" id="clrBtn" title="Clear search" aria-label="Clear">' + svgX + "</button>\n" +
"    </div>\n" +
'    <div class="sld">' + svgGrid + '\n' +
'      <input type="range" id="slider" min="24" max="96" value="48" step="4" aria-label="Preview size">\n' +
'      <span class="sv" id="sizeVal">48px</span>\n' +
"    </div>\n" +
'    <span class="cnt" id="count">' + N + " icons</span>\n" +
"  </div>\n" +
"</div>\n\n" +

'<div class="alpha" id="alpha">' + alphaHtml + "</div>\n\n" +

'<main class="grid" id="grid">\n' + iconsHtml + "\n</main>\n\n" +

'<div class="nores" id="noRes">\n' +
"  " + svgNores + "\n" +
'  <p>No icons found for <strong id="noResQ"></strong></p>\n' +
'  <a href="' + REPO + '/issues/new?title=Icon+request&body=Please+add+symbol:" target="_blank" rel="noopener">Request this icon \u2192</a>\n' +
"</div>\n\n" +

"<footer>\n" +
"  <p>&copy; " + year + " react-native-cryptocurrency-icons &middot;\n" +
'    <a href="' + REPO + '" target="_blank" rel="noopener">GitHub</a> &middot;\n' +
'    <a href="https://www.npmjs.com/package/' + PKG + '" target="_blank" rel="noopener">npm</a>\n' +
"  </p>\n</footer>\n\n" +

'<div class="toast" id="toast">Copied to clipboard!</div>\n\n' +
"<script>\n" + js + "\n</script>\n" +
"</body>\n</html>\n";

// ── Write ─────────────────────────────────────────────────────────────
fs.writeFileSync(OUT_CSS, css);
fs.writeFileSync(OUT_HTML, html);
console.log("Generated gallery: " + N + " icons \u2192 docs/index.html");
