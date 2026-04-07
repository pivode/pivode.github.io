#!/usr/bin/env node

/**
 * generate-static.mjs
 *
 * Pre-renders born-in year pages and compare pages to static HTML
 * using Playwright. This creates ~180 indexable pages for SEO.
 *
 * Usage: node generate-static.mjs
 */

import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8765;
const BASE = `http://localhost:${PORT}`;
const SITE = 'https://pivode.github.io';
const CONCURRENCY = 4;
const DATA_DIR = path.join(__dirname, 'born-in', 'data');
const OUT_DIR = path.join(__dirname, 'born-in');

// ─── Decade theming (mirrors app.js / compare.js) ───────────────────────────

const DECADE_ACCENTS = {
  1930: '#d4a574', 1940: '#8fae7e', 1950: '#e8b86d', 1960: '#7ec8e3',
  1970: '#c4a882', 1980: '#ff6b9d', 1990: '#00d4aa', 2000: '#6c8ebf',
  2010: '#a78bfa',
};

function getAccent(year) {
  return DECADE_ACCENTS[Math.floor(year / 10) * 10] || '#a78bfa';
}

function getEraClass(year) {
  const map = { 1950: 'era-50s', 1960: 'era-60s', 1970: 'era-70s', 1980: 'era-80s', 1990: 'era-90s', 2000: 'era-00s' };
  return map[Math.floor(year / 10) * 10] || '';
}

// ─── Data helpers ────────────────────────────────────────────────────────────

function loadIndex() {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'index.json'), 'utf8'));
}

function loadYearData(year) {
  const fp = path.join(DATA_DIR, `${year}.json`);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function hasDataFile(year) {
  return fs.existsSync(path.join(DATA_DIR, `${year}.json`));
}

// ─── Compare pairs ──────────────────────────────────────────────────────────

function computeComparePairs() {
  const milestones = [];
  for (let y = 1930; y <= 2010; y += 5) milestones.push(y);

  const seen = new Set();
  const pairs = [];

  function add(p, c) {
    const key = `${p}-${c}`;
    if (seen.has(key)) return;
    if (!hasDataFile(p) || !hasDataFile(c)) return;
    seen.add(key);
    pairs.push([p, c]);
  }

  // All milestone pairs with gap >= 20
  for (const p of milestones) {
    for (const c of milestones) {
      if (c - p >= 20) add(p, c);
    }
  }

  // Curated pairs: generation boundaries + even-year 30-year gaps
  const curated = [
    [1946,1970],[1946,1975],[1946,1980],[1946,1985],[1946,1990],
    [1946,1995],[1946,2000],[1946,2005],[1946,2010],
    [1964,1985],[1964,1990],[1964,1995],[1964,2000],[1964,2005],[1964,2010],
    [1981,2005],[1981,2010],
    [1946,1981],[1946,1997],[1964,1997],
    [1932,1962],[1938,1968],[1942,1972],[1948,1978],
    [1952,1982],[1958,1988],[1962,1992],[1968,1998],
    [1972,2002],[1978,2008],
  ];
  for (const [p, c] of curated) add(p, c);

  return pairs;
}

// ─── Internal linking ────────────────────────────────────────────────────────

const POPULAR_YEARS = [1960, 1970, 1975, 1980, 1985, 1990, 1995, 2000];
const POPULAR_COMPARISONS = [
  [1950, 1980], [1960, 1990], [1970, 2000], [1950, 2000], [1980, 2010],
];

function nearbyYearsLinks(year, allYears) {
  const idx = allYears.indexOf(year);
  if (idx < 0) return [];
  const start = Math.max(0, idx - 5);
  const end = Math.min(allYears.length, idx + 6);
  return allYears.slice(start, end).filter(y => y !== year);
}

function compareLinksForYear(year, allPairs) {
  // Direct matches first (pairs that include this exact year)
  const direct = allPairs.filter(([p, c]) => p === year || c === year);
  if (direct.length >= 3) return direct.slice(0, 5);

  // If not enough direct matches, find pairs involving nearby years
  const nearby = allPairs
    .map(([p, c]) => {
      const dist = Math.min(Math.abs(p - year), Math.abs(c - year));
      return { pair: [p, c], dist };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 5)
    .map(x => x.pair);

  // Merge direct + nearby, deduped
  const seen = new Set(direct.map(([p, c]) => `${p}-${c}`));
  const result = [...direct];
  for (const pair of nearby) {
    const key = `${pair[0]}-${pair[1]}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(pair);
    }
    if (result.length >= 5) break;
  }
  return result;
}

function relatedComparisons(parent, child, allPairs) {
  return allPairs
    .filter(([p, c]) => {
      if (p === parent && c === child) return false;
      return p === parent || p === child || c === parent || c === child;
    })
    .slice(0, 5);
}

// ─── Meta descriptions ──────────────────────────────────────────────────────

function bornInMeta(year, data) {
  const pop = data.world?.population_billions;
  const gas = data.prices_us?.gallon_gas_usd;
  const song = data.culture?.music?.billboard_no1_song;
  const artist = data.culture?.music?.billboard_no1_artist;
  const parts = [`In ${year}`];
  if (pop) parts.push(`the world had ${pop}B people`);
  if (gas) parts.push(`gas cost $${gas.toFixed(2)}`);
  if (song && artist) parts.push(`and "${song}" by ${artist} topped the charts`);
  return parts.join(', ') + '. See what life was like.';
}

function compareMeta(pYear, cYear, pData, cData) {
  const pop1 = pData.world?.population_billions;
  const pop2 = cData.world?.population_billions;
  const le1 = pData.world?.life_expectancy_global;
  const le2 = cData.world?.life_expectancy_global;
  let desc = `Between ${pYear} and ${cYear}`;
  if (pop1 && pop2) desc += `, world population grew from ${pop1}B to ${pop2}B`;
  if (le1 && le2) {
    const delta = Math.abs(le2 - le1).toFixed(1);
    desc += ` and life expectancy ${le2 > le1 ? 'jumped' : 'shifted'} ${delta} years`;
  }
  return desc + '. See the full comparison.';
}

// ─── HTML escaping ───────────────────────────────────────────────────────────

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// (Country data removed - static pages use a subtle "change country" link instead)

// ─── Shared HTML fragments ──────────────────────────────────────────────────

const SHARE_SVG = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M10 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm-7.5 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM10 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 7.5L10 4M3.5 7.5L10 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;

const INTERACTIVE_SVG = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3.5 7.5h8M8 4l3.5 3.5L8 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function sharePopoverHTML() {
  return `<div id="share-popover" class="share-popover hidden" role="dialog" aria-label="Share options">
  <button id="copy-link-btn" class="share-option">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
    Copy link
  </button>
  <button id="tweet-btn" class="share-option">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.6 1h2.4l-5.2 5.9L16 15h-4.8l-3.7-4.9L3 15H.6l5.5-6.3L0 1h4.9l3.4 4.4L12.6 1zm-.8 12.6h1.3L4.3 2.3H2.9l8.9 11.3z"/></svg>
    Share on X
  </button>
</div>`;
}

function exploreCardsHTML(variant) {
  const first = variant === 'compare'
    ? `<a href="/born-in/" class="explore-card">
        <span class="explore-card-icon">🎂</span>
        <span class="explore-card-text">
          <span class="explore-card-title">The World When You Were Born</span>
          <span class="explore-card-sub">A deep dive into everything that happened the year you were born</span>
        </span>
        <span class="explore-card-arrow">&rarr;</span>
      </a>`
    : `<a href="/born-in/compare/" class="explore-card">
        <span class="explore-card-icon">👨‍👧</span>
        <span class="explore-card-text">
          <span class="explore-card-title">Compare Generations</span>
          <span class="explore-card-sub">How did the world change between your birth year and your parents'?</span>
        </span>
        <span class="explore-card-arrow">&rarr;</span>
      </a>`;

  return `<div class="explore-more">
  <p class="explore-more-label">keep exploring</p>
  <div class="explore-cards">
    ${first}
    <a href="https://runpod.io?ref=f5ifklhp" class="explore-card" target="_blank" rel="noopener">
      <span class="explore-card-icon">🚀</span>
      <span class="explore-card-text">
        <span class="explore-card-title">RunPod - GPU Cloud</span>
        <span class="explore-card-sub">The GPUs powering this project. Up to $500 free credits on signup.</span>
      </span>
      <span class="explore-card-arrow">&rarr;</span>
    </a>
  </div>
</div>`;
}

function adUnitHTML() {
  return `<div style="max-width:860px;margin:0 auto;padding:0 24px 32px">
  <ins class="adsbygoogle" style="display:block;text-align:center" data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-2357143123208840" data-ad-slot="7444143923"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>`;
}

function footerHTML() {
  return `<footer class="site-footer">
  <div class="footer-inner">
    <p class="footer-brand">pivode</p>
    <p class="footer-copy">Data compiled and maintained by Pivode.</p>
    <p class="footer-disclosure">Some links are affiliate links. We may earn a small commission at no extra cost to you.</p>
    <a href="/privacy.html" style="font-size:13px;color:#7a7a92;text-decoration:none">Privacy Policy</a>
  </div>
</footer>`;
}

// ─── Born-in page template ───────────────────────────────────────────────────

function bornInPageHTML(year, contentHTML, yearData, allYears, comparePairs) {
  const accent = getAccent(year);
  const era = getEraClass(year);
  const title = `The World in ${year} - What Life Was Like | Pivode`;
  const desc = bornInMeta(year, yearData);
  const canonical = `${SITE}/born-in/${year}/`;

  const nearby = nearbyYearsLinks(year, allYears);
  const compLinks = compareLinksForYear(year, comparePairs);
  const popular = POPULAR_YEARS.filter(y => y !== year);

  const internalLinks = `
  <nav class="internal-links">
    <h2>Nearby Years</h2>
    <div class="internal-links-list">
      ${nearby.map(y => `<a href="/born-in/${y}/">${y}</a>`).join('\n      ')}
    </div>
    <h2>Compare Generations</h2>
    <div class="internal-links-list">
      ${compLinks.map(([p, c]) => `<a href="/born-in/compare/${p}-vs-${c}/">${p} vs ${c}</a>`).join('\n      ')}
    </div>
    <h2>Popular Years</h2>
    <div class="internal-links-list">
      ${popular.map(y => `<a href="/born-in/${y}/">${y}</a>`).join('\n      ')}
    </div>
  </nav>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2357143123208840" crossorigin="anonymous"></script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta property="og:image" content="${SITE}/born-in/og/born-in-og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:image" content="${SITE}/born-in/og/born-in-og.png">
  <meta name="theme-color" content="#080810">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${canonical}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="../static-page.css">
  <script data-goatcounter="https://pivode.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
  <noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${esc(`The World in ${year} - What Life Was Like`)}",
    "url": "${canonical}",
    "description": "${esc(desc)}",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Pivode",
      "url": "${SITE}"
    }
  }
  </script>
</head>
<body class="${era}" style="--accent: ${accent}">

  <h1 class="sr-only">The World in ${year} - What Life Was Like</h1>

  <section class="screen-infographic">

    <header class="info-header">
      <div class="header-left">
        <span class="header-year">${year}</span>
        <span class="header-sep">&middot;</span>
        <a href="/born-in/?year=${year}" class="header-country header-country-link">🇺🇸 United States <span class="change-country">Change</span></a>
      </div>
      <div class="header-right">
        <button id="share-btn" class="header-btn" aria-label="Share" aria-expanded="false">
          ${SHARE_SVG}
          <span>Share</span>
        </button>
        <a href="/born-in/?year=${year}&amp;country=US" class="header-btn">
          ${INTERACTIVE_SVG}
          <span>Interactive version</span>
        </a>
      </div>
      ${sharePopoverHTML()}
    </header>

    <div id="info-content" class="info-content">
${contentHTML}
    </div>

    <button class="directory-toggle internal-links-toggle" id="links-toggle" aria-expanded="false" aria-controls="internal-links">
      More years &amp; comparisons
      <svg class="directory-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div id="internal-links" class="directory-collapsed">
    ${internalLinks}
    </div>

    ${exploreCardsHTML('born-in')}

    <div class="explore-more" style="text-align:center">
      <a href="/born-in/?year=${year}&amp;country=US" class="bottom-cta" style="display:inline-block;text-decoration:none">Customize this year</a>
    </div>

    ${adUnitHTML()}
    ${footerHTML()}

  </section>

  <div id="copy-toast" class="copy-toast" aria-live="polite"></div>
  <script src="../static-page.js" defer></script>
</body>
</html>`;
}

// ─── Compare page template ───────────────────────────────────────────────────

function comparePageHTML(parentYear, childYear, contentHTML, comparePairs, allBornInYears) {
  const accent = getAccent(childYear);
  const pData = loadYearData(parentYear);
  const cData = loadYearData(childYear);
  const title = `${parentYear} vs ${childYear} - How the World Changed | Pivode`;
  const desc = compareMeta(parentYear, childYear, pData, cData);
  const canonical = `${SITE}/born-in/compare/${parentYear}-vs-${childYear}/`;

  // Internal links: both year pages (if static exists), related comparisons, popular comparisons
  const yearLinks = [parentYear, childYear].filter(y => allBornInYears.includes(y));
  const related = relatedComparisons(parentYear, childYear, comparePairs);
  const popular = POPULAR_COMPARISONS.filter(([p, c]) => !(p === parentYear && c === childYear));

  // Ensure at least 7 related comparisons for link density
  const extraRelated = related.length < 7
    ? comparePairs
        .filter(([p, c]) => {
          if (p === parentYear && c === childYear) return false;
          if (related.some(([rp, rc]) => rp === p && rc === c)) return false;
          return true;
        })
        .slice(0, 7 - related.length)
    : [];
  const allRelated = [...related, ...extraRelated];

  const internalLinks = `
  <nav class="internal-links">
    ${yearLinks.length ? `<h2>Explore Each Year</h2>
    <div class="internal-links-list">
      ${yearLinks.map(y => `<a href="/born-in/${y}/">The World in ${y}</a>`).join('\n      ')}
    </div>` : ''}
    ${allRelated.length ? `<h2>Related Comparisons</h2>
    <div class="internal-links-list">
      ${allRelated.map(([p, c]) => `<a href="/born-in/compare/${p}-vs-${c}/">${p} vs ${c}</a>`).join('\n      ')}
    </div>` : ''}
    <h2>Popular Comparisons</h2>
    <div class="internal-links-list">
      ${popular.map(([p, c]) => `<a href="/born-in/compare/${p}-vs-${c}/">${p} vs ${c}</a>`).join('\n      ')}
    </div>
    <h2>Browse More</h2>
    <div class="internal-links-list">
      <a href="/born-in/">The World When You Were Born</a>
      <a href="/born-in/compare/">Compare Generations</a>
    </div>
  </nav>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2357143123208840" crossorigin="anonymous"></script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta property="og:image" content="${SITE}/born-in/og/compare-og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:image" content="${SITE}/born-in/og/compare-og.png">
  <meta name="theme-color" content="#080810">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${canonical}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../compare.css">
  <link rel="stylesheet" href="../../static-page.css">
  <script data-goatcounter="https://pivode.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
  <noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${esc(`${parentYear} vs ${childYear} - How the World Changed`)}",
    "url": "${canonical}",
    "description": "${esc(desc)}",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Pivode",
      "url": "${SITE}"
    }
  }
  </script>
</head>
<body style="--accent: ${accent}; --accent-parent: ${getAccent(parentYear)}; --accent-child: ${getAccent(childYear)}">

  <h1 class="sr-only">${parentYear} vs ${childYear} - How the World Changed</h1>

  <section class="screen-infographic">

    <header class="info-header cmp-header">
      <div class="header-left">
        <span class="cmp-header-label">${parentYear} vs ${childYear}</span>
        <span class="header-sep">&middot;</span>
        <a href="/born-in/compare/?parent=${parentYear}&amp;child=${childYear}&amp;pcountry=US&amp;ccountry=US" class="header-country header-country-link">🇺🇸 United States <span class="change-country">Change</span></a>
      </div>
      <div class="header-right">
        <button id="share-btn" class="header-btn" aria-label="Share" aria-expanded="false">
          ${SHARE_SVG}
          <span>Share</span>
        </button>
        <a href="/born-in/compare/?parent=${parentYear}&amp;child=${childYear}&amp;pcountry=US&amp;ccountry=US" class="header-btn">
          ${INTERACTIVE_SVG}
          <span>Interactive version</span>
        </a>
      </div>
      ${sharePopoverHTML()}
    </header>

    <div id="cmp-content" class="info-content cmp-content">
${contentHTML}
    </div>

    <button class="directory-toggle internal-links-toggle" id="links-toggle" aria-expanded="false" aria-controls="internal-links">
      More comparisons &amp; years
      <svg class="directory-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div id="internal-links" class="directory-collapsed">
    ${internalLinks}
    </div>

    ${exploreCardsHTML('compare')}

    <div class="explore-more" style="text-align:center">
      <a href="/born-in/compare/?parent=${parentYear}&amp;child=${childYear}&amp;pcountry=US&amp;ccountry=US" class="bottom-cta" style="display:inline-block;text-decoration:none">Customize this comparison</a>
    </div>

    ${adUnitHTML()}
    ${footerHTML()}

  </section>

  <div id="copy-toast" class="copy-toast" aria-live="polite"></div>
  <script src="../../static-page.js" defer></script>
</body>
</html>`;
}

// ─── Static file server ──────────────────────────────────────────────────────

const MIME = {
  '.html': 'text/html',       '.css': 'text/css',
  '.js': 'text/javascript',   '.json': 'application/json',
  '.svg': 'image/svg+xml',    '.png': 'image/png',
  '.jpg': 'image/jpeg',       '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',     '.woff2': 'font/woff2',
  '.woff': 'font/woff',       '.ttf': 'font/ttf',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent(new URL(req.url, BASE).pathname);

      // Serve index.html for directory requests
      if (urlPath.endsWith('/')) urlPath += 'index.html';

      const filePath = path.join(__dirname, urlPath);
      const ext = path.extname(filePath).toLowerCase();

      fs.readFile(filePath, (err, data) => {
        if (err) {
          // Try with .html extension
          fs.readFile(filePath + '.html', (err2, data2) => {
            if (err2) {
              res.writeHead(404);
              res.end('Not found');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data2);
          });
          return;
        }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`Server running on ${BASE}`);
      resolve(server);
    });
  });
}

// ─── Playwright extraction ───────────────────────────────────────────────────

async function extractBornInPage(browser, year) {
  const page = await browser.newPage();
  try {
    await page.goto(`${BASE}/born-in/?year=${year}&country=US`, { waitUntil: 'domcontentloaded' });

    // Wait for content to render
    await page.waitForFunction(
      () => document.querySelector('#info-content') && document.querySelector('#info-content').children.length > 0,
      { timeout: 15000 }
    );

    // Extra wait for async sections to load
    await page.waitForTimeout(2000);

    // Finalize: reveal all, set count-up values
    const contentHTML = await page.evaluate(() => {
      // Force all reveals
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));

      // Force count-up elements to final values
      document.querySelectorAll('.count-up').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const prefix = el.dataset.prefix || '';
        const abbrev = el.dataset.abbrev === 'true';

        function fmt(n, dec, ab) {
          if (ab) {
            if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
            if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
          }
          return dec > 0 ? n.toFixed(dec) : Math.round(n).toLocaleString();
        }

        if (!isNaN(target)) {
          el.textContent = prefix + fmt(target, decimals, abbrev);
        }
      });

      return document.querySelector('#info-content').innerHTML;
    });

    return contentHTML;
  } finally {
    await page.close();
  }
}

async function extractComparePage(browser, parentYear, childYear) {
  const page = await browser.newPage();
  try {
    const url = `${BASE}/born-in/compare/?parent=${parentYear}&child=${childYear}&pcountry=US&ccountry=US`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for compare content
    await page.waitForFunction(
      () => document.querySelector('#cmp-content') && document.querySelector('#cmp-content').children.length > 0,
      { timeout: 15000 }
    );

    // Wait for at-18 section (loads async) - up to 5s
    try {
      await page.waitForSelector('.at18-section', { timeout: 5000 });
    } catch {
      // at-18 section may not exist for all pairs
    }

    // Extra settle time
    await page.waitForTimeout(1500);

    // Finalize
    const contentHTML = await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));

      document.querySelectorAll('.count-up').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const prefix = el.dataset.prefix || '';
        const abbrev = el.dataset.abbrev === 'true';

        function fmt(n, dec, ab) {
          if (ab) {
            if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
            if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
          }
          return dec > 0 ? n.toFixed(dec) : Math.round(n).toLocaleString();
        }

        if (!isNaN(target)) {
          el.textContent = prefix + fmt(target, decimals, abbrev);
        }
      });

      return document.querySelector('#cmp-content').innerHTML;
    });

    return contentHTML;
  } finally {
    await page.close();
  }
}

// ─── Parallel runner ─────────────────────────────────────────────────────────

async function runInPool(tasks, concurrency) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      try {
        results[i] = await tasks[i]();
      } catch (err) {
        results[i] = err;
        console.error(`  Task ${i} failed:`, err.message);
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ─── Sitemap generation ──────────────────────────────────────────────────────

function generateSitemap(allYears, comparePairs) {
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE}/born-in/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE}/born-in/compare/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Static born-in year pages
  for (const y of allYears) {
    xml += `
  <url>
    <loc>${SITE}/born-in/${y}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  // Static compare pages
  for (const [p, c] of comparePairs) {
    xml += `
  <url>
    <loc>${SITE}/born-in/compare/${p}-vs-${c}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }

  // Other existing pages
  xml += `
  <url>
    <loc>${SITE}/datasets/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE}/games/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE}/privacy.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
`;

  return xml;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Starting static page generator...\n');

  // Load available years (born-in tool supports 1950-2010 only)
  const index = loadIndex();
  const allYears = index.available_years.filter(y => y >= 1950 && y <= 2010);
  console.log(`Born-in years: ${allYears.length}`);

  // Compute compare pairs
  const comparePairs = computeComparePairs();
  console.log(`Compare pairs: ${comparePairs.length}`);
  console.log(`Total pages to generate: ${allYears.length + comparePairs.length}\n`);

  // Start server
  const server = await startServer();

  // Launch browser
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  // ─── Generate born-in pages ──────────────────────────────────────────
  console.log(`\nGenerating ${allYears.length} born-in pages...`);
  let bornInDone = 0;

  const bornInTasks = allYears.map(year => async () => {
    const contentHTML = await extractBornInPage(browser, year);
    const yearData = loadYearData(year);

    // Create output directory
    const outDir = path.join(OUT_DIR, String(year));
    fs.mkdirSync(outDir, { recursive: true });

    // Write HTML
    const html = bornInPageHTML(year, contentHTML, yearData, allYears, comparePairs);
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');

    bornInDone++;
    process.stdout.write(`\r  Born-in: ${bornInDone}/${allYears.length}`);
  });

  await runInPool(bornInTasks, CONCURRENCY);
  console.log('  Done.');

  // ─── Generate compare pages ──────────────────────────────────────────
  console.log(`\nGenerating ${comparePairs.length} compare pages...`);
  let compareDone = 0;

  const compareTasks = comparePairs.map(([pYear, cYear]) => async () => {
    const contentHTML = await extractComparePage(browser, pYear, cYear);

    // Create output directory
    const outDir = path.join(OUT_DIR, 'compare', `${pYear}-vs-${cYear}`);
    fs.mkdirSync(outDir, { recursive: true });

    // Write HTML
    const html = comparePageHTML(pYear, cYear, contentHTML, comparePairs, allYears);
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');

    compareDone++;
    process.stdout.write(`\r  Compare: ${compareDone}/${comparePairs.length}`);
  });

  await runInPool(compareTasks, CONCURRENCY);
  console.log('  Done.');

  // ─── Generate sitemap ────────────────────────────────────────────────
  console.log('\nGenerating sitemap.xml...');
  const sitemap = generateSitemap(allYears, comparePairs);
  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf8');
  console.log('  Done.');

  // ─── Cleanup ─────────────────────────────────────────────────────────
  await browser.close();
  server.close();

  console.log(`\nAll done! Generated ${allYears.length} born-in + ${comparePairs.length} compare = ${allYears.length + comparePairs.length} static pages.`);
}

main().catch(err => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
