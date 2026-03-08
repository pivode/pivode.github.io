/* =========================================================
   COMPARE GENERATIONS - compare.js
   ========================================================= */

'use strict';

// ---------------------------------------------------------------------------
// CONSTANTS (copied from parent app.js)
// ---------------------------------------------------------------------------

const YEAR_MIN = 1950;
const YEAR_MAX = 2010;
const YEAR_GAPS = new Set([1951, 1953]);

const DECADE_ACCENTS = {
  1950: '#e8b86d',
  1960: '#7ec8e3',
  1970: '#c4a882',
  1980: '#ff6b9d',
  1990: '#00d4aa',
  2000: '#6c8ebf',
  2010: '#a78bfa',
  2020: '#4ade80',
};

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '\uD83C\uDDFA\uD83C\uDDF8' },
  { code: 'GB', name: 'United Kingdom', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
  { code: 'IN', name: 'India',          flag: '\uD83C\uDDEE\uD83C\uDDF3' },
  { code: 'DE', name: 'Germany',        flag: '\uD83C\uDDE9\uD83C\uDDEA' },
  { code: 'JP', name: 'Japan',          flag: '\uD83C\uDDEF\uD83C\uDDF5' },
  { code: 'FR', name: 'France',         flag: '\uD83C\uDDEB\uD83C\uDDF7' },
  { code: 'BR', name: 'Brazil',         flag: '\uD83C\uDDE7\uD83C\uDDF7' },
  { code: 'CN', name: 'China',          flag: '\uD83C\uDDE8\uD83C\uDDF3' },
  { code: 'AU', name: 'Australia',      flag: '\uD83C\uDDE6\uD83C\uDDFA' },
  { code: 'CA', name: 'Canada',         flag: '\uD83C\uDDE8\uD83C\uDDE6' },
  { code: 'RU', name: 'Russia',         flag: '\uD83C\uDDF7\uD83C\uDDFA' },
  { code: 'MX', name: 'Mexico',         flag: '\uD83C\uDDF2\uD83C\uDDFD' },
  { code: 'KR', name: 'South Korea',    flag: '\uD83C\uDDF0\uD83C\uDDF7' },
  { code: 'IE', name: 'Ireland',        flag: '\uD83C\uDDEE\uD83C\uDDEA' },
  { code: 'IT', name: 'Italy',          flag: '\uD83C\uDDEE\uD83C\uDDF9' },
  { code: 'ES', name: 'Spain',          flag: '\uD83C\uDDEA\uD83C\uDDF8' },
  { code: 'NL', name: 'Netherlands',    flag: '\uD83C\uDDF3\uD83C\uDDF1' },
  { code: 'ID', name: 'Indonesia',      flag: '\uD83C\uDDEE\uD83C\uDDE9' },
  { code: 'TR', name: 'Turkiye',        flag: '\uD83C\uDDF9\uD83C\uDDF7' },
  { code: 'NG', name: 'Nigeria',        flag: '\uD83C\uDDF3\uD83C\uDDEC' },
  { code: 'ZA', name: 'South Africa',   flag: '\uD83C\uDDFF\uD83C\uDDE6' },
  { code: 'AR', name: 'Argentina',      flag: '\uD83C\uDDE6\uD83C\uDDF7' },
  { code: 'PH', name: 'Philippines',    flag: '\uD83C\uDDF5\uD83C\uDDED' },
  { code: 'EG', name: 'Egypt',          flag: '\uD83C\uDDEA\uD83C\uDDEC' },
  { code: 'PK', name: 'Pakistan',      flag: '\uD83C\uDDF5\uD83C\uDDF0' },
  { code: 'BD', name: 'Bangladesh',    flag: '\uD83C\uDDE7\uD83C\uDDE9' },
  { code: 'PL', name: 'Poland',        flag: '\uD83C\uDDF5\uD83C\uDDF1' },
  { code: 'SE', name: 'Sweden',        flag: '\uD83C\uDDF8\uD83C\uDDEA' },
  { code: 'TH', name: 'Thailand',      flag: '\uD83C\uDDF9\uD83C\uDDED' },
  { code: 'VN', name: 'Vietnam',       flag: '\uD83C\uDDFB\uD83C\uDDF3' },
  { code: 'CO', name: 'Colombia',      flag: '\uD83C\uDDE8\uD83C\uDDF4' },
  { code: 'KE', name: 'Kenya',         flag: '\uD83C\uDDF0\uD83C\uDDEA' },
  { code: 'SA', name: 'Saudi Arabia',  flag: '\uD83C\uDDF8\uD83C\uDDE6' },
  { code: 'IL', name: 'Israel',        flag: '\uD83C\uDDEE\uD83C\uDDF1' },
  { code: 'PT', name: 'Portugal',      flag: '\uD83C\uDDF5\uD83C\uDDF9' },
  { code: 'CL', name: 'Chile',         flag: '\uD83C\uDDE8\uD83C\uDDF1' },
  { code: 'MY', name: 'Malaysia',      flag: '\uD83C\uDDF2\uD83C\uDDFE' },
  { code: 'UA', name: 'Ukraine',       flag: '\uD83C\uDDFA\uD83C\uDDE6' },
  { code: 'GH', name: 'Ghana',         flag: '\uD83C\uDDEC\uD83C\uDDED' },
  { code: 'PE', name: 'Peru',          flag: '\uD83C\uDDF5\uD83C\uDDEA' },
];

const COUNTRY_MAP = Object.fromEntries(COUNTRIES.map(c => [c.code, c]));

const LEADER_KEYS = {
  US: { key: 'us_president',       title: 'President' },
  GB: { key: 'uk_pm',              title: 'Prime Minister' },
  IN: { key: 'india_pm',           title: 'Prime Minister' },
  DE: { key: 'germany_chancellor', title: 'Chancellor' },
  JP: { key: 'japan_pm',           title: 'Prime Minister' },
  FR: { key: 'france_president',   title: 'President' },
  BR: { key: 'brazil_president',   title: 'President' },
  CN: { key: 'china_leader',       title: 'Leader' },
  AU: { key: 'australia_pm',       title: 'Prime Minister' },
  CA: { key: 'canada_pm',          title: 'Prime Minister' },
  RU: { key: 'russia_leader',         title: 'Leader' },
  MX: { key: 'mexico_president',      title: 'President' },
  KR: { key: 'south_korea_president', title: 'President' },
  IE: { key: 'ireland_taoiseach',     title: 'Taoiseach' },
  IT: { key: 'italy_pm',              title: 'Prime Minister' },
  ES: { key: 'spain_leader',          title: 'Head of State' },
  NL: { key: 'netherlands_pm',        title: 'Prime Minister' },
  ID: { key: 'indonesia_president',   title: 'President' },
  TR: { key: 'turkey_pm',             title: 'Prime Minister' },
  NG: { key: 'nigeria_leader',        title: 'Head of State' },
  ZA: { key: 'south_africa_leader',   title: 'Leader' },
  AR: { key: 'argentina_president',   title: 'President' },
  PH: { key: 'philippines_president', title: 'President' },
  EG: { key: 'egypt_president',       title: 'President' },
  PK: { key: 'pakistan_pm',            title: 'Prime Minister' },
  BD: { key: 'bangladesh_pm',         title: 'Prime Minister' },
  PL: { key: 'poland_president',      title: 'President' },
  SE: { key: 'sweden_pm',             title: 'Prime Minister' },
  TH: { key: 'thailand_pm',           title: 'Prime Minister' },
  VN: { key: 'vietnam_leader',        title: 'Leader' },
  CO: { key: 'colombia_president',    title: 'President' },
  KE: { key: 'kenya_president',       title: 'President' },
  SA: { key: 'saudi_king',            title: 'King' },
  IL: { key: 'israel_pm',             title: 'Prime Minister' },
  PT: { key: 'portugal_pm',           title: 'Prime Minister' },
  CL: { key: 'chile_president',       title: 'President' },
  MY: { key: 'malaysia_pm',           title: 'Prime Minister' },
  UA: { key: 'ukraine_president',     title: 'President' },
  GH: { key: 'ghana_president',       title: 'President' },
  PE: { key: 'peru_president',        title: 'President' },
};

// Hardcoded "today" comparison values
const TODAY = {
  population_billions: 8.2,
  us_median_income: 80000,
  us_median_home: 420000,
  global_life_expectancy: 72.3,
  us_life_expectancy: 78.5,
  life_expectancy: {
    US:78.5, GB:81.2, IN:70.8, DE:81.0, JP:84.6, FR:82.5, BR:75.5,
    CN:78.2, AU:83.3, CA:82.7, RU:73.4, MX:75.0, KR:83.7, IE:82.0,
    IT:83.5, ES:83.2, NL:82.0, ID:71.8, TR:76.0, NG:53.9,
    ZA:64.1, AR:76.5, PH:71.4, EG:72.0,
    PK:67.3, BD:72.4, PL:77.5, SE:83.1, TH:78.7, VN:75.4, CO:77.3, KE:61.4,
    SA:77.6, IL:82.6, PT:81.1, CL:80.2, MY:76.2, UA:73.6, GH:64.1, PE:76.5,
  },
  gdp_per_capita: {
    US:85810, GB:52637, IN:2697, DE:55800, JP:32476, FR:46150, BR:10280,
    CN:13303, AU:64407, CA:54283, RU:14889, MX:14158, KR:36239, IE:107316,
    IT:40226, ES:35297, NL:68219, ID:4925, TR:15473, NG:1084,
    ZA:6253, AR:13858, PH:3985, EG:3338,
    PK:1485, BD:2593, PL:25023, SE:57723, TH:7345, VN:4717, CO:7914, KE:2206,
    SA:35057, IL:54177, PT:28844, CL:16710, MY:11867, UA:5389, GH:2406, PE:8452,
  },
  home_salary_ratio: (420000 / 80000).toFixed(1),
  prices: {
    gallon_gas_usd:    3.31,
    gallon_milk_usd:   4.15,
    dozen_eggs_usd:    4.99,
    loaf_bread_usd:    3.99,
    movie_ticket_usd: 13.50,
    big_mac_usd:       5.29,
    new_car_avg_usd:  48000,
    median_home_usd: 420000,
    first_class_stamp_cents: 73,
  },
};

// CPI multipliers to convert historical prices to 2024 dollars
// Source: US BLS CPI-U annual averages, base year 2024 (313.689)
// Formula: multiplier = 313.689 / CPI_year
const CPI_TO_2024 = {
  1950:13.02,1951:12.06,1952:11.84,1953:11.75,1954:11.66,1955:11.7,1956:11.53,
  1957:11.16,1958:10.85,1959:10.78,1960:10.6,1961:10.49,1962:10.39,1963:10.25,
  1964:10.12,1965:9.96,1966:9.68,1967:9.39,1968:9.01,1969:8.55,1970:8.08,
  1971:7.75,1972:7.5,1973:7.07,1974:6.36,1975:5.83,1976:5.51,1977:5.18,
  1978:4.81,1979:4.32,1980:3.81,1981:3.45,1982:3.25,1983:3.15,1984:3.02,
  1985:2.92,1986:2.86,1987:2.76,1988:2.65,1989:2.53,1990:2.4,1991:2.3,
  1992:2.24,1993:2.17,1994:2.12,1995:2.06,1996:2.0,1997:1.95,1998:1.92,
  1999:1.88,2000:1.82,2001:1.77,2002:1.74,2003:1.7,2004:1.66,2005:1.61,
  2006:1.56,2007:1.51,2008:1.46,2009:1.46,2010:1.44,
};

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

let selectedCountry = COUNTRIES[0]; // default US
let revealObserver = null;
let _lastCompare = null; // { parentYear, childYear, countryCode, parentData, childData }

// ---------------------------------------------------------------------------
// DOM REFS
// ---------------------------------------------------------------------------

const $landing         = document.getElementById('cmp-landing');
const $form            = document.getElementById('cmp-form');
const $parentYearInput = document.getElementById('parent-year-input');
const $childYearInput  = document.getElementById('child-year-input');
const $parentYearError = document.getElementById('parent-year-error');
const $childYearError  = document.getElementById('child-year-error');
const $countryBtn      = document.getElementById('cmp-country-btn');
const $countryDropdown = document.getElementById('cmp-country-dropdown');
const $countrySearch   = document.getElementById('cmp-country-search');
const $countryList     = document.getElementById('cmp-country-list');
const $countryDisplay  = document.getElementById('cmp-country-display');
const $result          = document.getElementById('cmp-result');
const $headerLabel     = document.getElementById('cmp-header-label');
const $headerCountry   = document.getElementById('cmp-header-country');
const $shareBtn        = document.getElementById('cmp-share-btn');
const $sharePopover    = document.getElementById('cmp-share-popover');
const $copyLinkBtn     = document.getElementById('cmp-copy-link-btn');
const $tweetBtn        = document.getElementById('cmp-tweet-btn');
const $saveCardBtn     = document.getElementById('cmp-save-card-btn');
const $shareCard       = document.getElementById('cmp-share-card');
const $content         = document.getElementById('cmp-content');
const $newBtn          = document.getElementById('cmp-new-btn');
const $bottomNewBtn    = document.getElementById('cmp-bottom-new-btn');
const $errorPanel      = document.getElementById('cmp-error');
const $errorMessage    = document.getElementById('cmp-error-message');
const $errorBackBtn    = document.getElementById('cmp-error-back-btn');

// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function formatCurrency(n) {
  if (n >= 1000) {
    return '$' + Math.round(n / 1000).toLocaleString() + 'k';
  }
  return '$' + Math.round(n).toLocaleString();
}

function formatPriceValue(n) {
  if (n == null) return '-';
  const num = parseFloat(n);
  if (isNaN(num)) return '-';
  return num < 10 ? num.toFixed(2) : Math.round(num).toLocaleString();
}

function abbreviateNumber(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(1).replace(/\.0$/, '') + ' trillion';
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + ' billion';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + ' million';
  return n.toLocaleString();
}

function showToast(message) {
  let toast = document.querySelector('.copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2200);
}

function displayCountryName(country, year) {
  if (country.code === 'DE' && year < 1990) return 'West Germany';
  if (country.code === 'BD' && year < 1971) return 'East Pakistan';
  return country.name;
}

function getAccentForYear(year) {
  const decade = Math.floor(year / 10) * 10;
  return DECADE_ACCENTS[decade] || '#a78bfa';
}

function signedPct(val) {
  if (val > 0) return '+' + val.toFixed(1) + '%';
  return val.toFixed(1) + '%';
}

function signedRaw(val, decimals) {
  const d = decimals != null ? decimals : 1;
  if (val > 0) return '+' + val.toFixed(d);
  return val.toFixed(d);
}

// ---------------------------------------------------------------------------
// INLINE SVG CHART GENERATORS
// ---------------------------------------------------------------------------

// Life expectancy horizontal bar chart
// Three bars: parent country LE, child country LE, today's LE
function svgLifeExpChart(parentLE, childLE, todayLE, parentYear, childYear, accentParent, accentChild) {
  const W = 600;
  const H = 200;
  const padL = 20;
  const padR = 110; // room for value labels
  const padT = 28;
  const padB = 20;
  const barH = 32;
  const gap  = 18;
  const chartW = W - padL - padR;

  const maxVal = Math.max(parentLE, childLE, todayLE) * 1.12;

  function barWidth(val) { return Math.round((val / maxVal) * chartW); }

  const y0 = padT;
  const y1 = padT + barH + gap;
  const y2 = padT + (barH + gap) * 2;

  const bw0 = barWidth(parentLE);
  const bw1 = barWidth(childLE);
  const bw2 = barWidth(todayLE);

  const neutralColor = '#6b7280';
  const textColor    = '#e8e5e0';
  const labelColor   = '#9898b0';

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;">
  <text x="${padL}" y="${y0 - 8}" font-family="Inter,system-ui,sans-serif" font-size="11" fill="${labelColor}" letter-spacing="0.08em" text-transform="uppercase">THEIR BIRTH YEAR (${parentYear})</text>
  <rect x="${padL}" y="${y0}" width="${bw0}" height="${barH}" rx="4" fill="${accentParent}" opacity="0.85"/>
  <text x="${padL + bw0 + 8}" y="${y0 + barH / 2 + 5}" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="600" fill="${textColor}">${parentLE} yrs</text>

  <text x="${padL}" y="${y1 - 8}" font-family="Inter,system-ui,sans-serif" font-size="11" fill="${labelColor}" letter-spacing="0.08em">YOUR BIRTH YEAR (${childYear})</text>
  <rect x="${padL}" y="${y1}" width="${bw1}" height="${barH}" rx="4" fill="${accentChild}" opacity="0.85"/>
  <text x="${padL + bw1 + 8}" y="${y1 + barH / 2 + 5}" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="600" fill="${textColor}">${childLE} yrs</text>

  <text x="${padL}" y="${y2 - 8}" font-family="Inter,system-ui,sans-serif" font-size="11" fill="${labelColor}" letter-spacing="0.08em">TODAY (2024)</text>
  <rect x="${padL}" y="${y2}" width="${bw2}" height="${barH}" rx="4" fill="${neutralColor}" opacity="0.7"/>
  <text x="${padL + bw2 + 8}" y="${y2 + barH / 2 + 5}" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="600" fill="${textColor}">${todayLE} yrs</text>
</svg>`;
}

// Price comparison grouped bar chart
// For each item: two bars side by side (parent year vs child year), inflation-adjusted
function svgPriceChart(priceItems, accentParent, accentChild) {
  if (!priceItems || priceItems.length === 0) return '';

  const itemCount = priceItems.length;
  const W = 600;
  const groupH = 54;
  const padT   = 12;
  const padB   = 24;
  const padL   = 108; // label column
  const padR   = 16;
  const H = padT + itemCount * groupH + padB;

  const chartW = W - padL - padR;
  const barH   = 18;
  const barGap = 4;

  const allVals = priceItems.flatMap(it => [it.parentAdj, it.childAdj]).filter(v => v > 0);
  const maxVal  = Math.max(...allVals) * 1.18;

  const textColor  = '#e8e5e0';
  const labelColor = '#9898b0';

  let bars = '';
  priceItems.forEach((item, i) => {
    const yBase = padT + i * groupH;
    const yP    = yBase + 2;
    const yC    = yBase + 2 + barH + barGap;

    const wP = item.parentAdj > 0 ? Math.max(2, Math.round((item.parentAdj / maxVal) * chartW)) : 2;
    const wC = item.childAdj  > 0 ? Math.max(2, Math.round((item.childAdj  / maxVal) * chartW)) : 2;

    const valLabelP = '$' + (item.parentAdj < 10 ? item.parentAdj.toFixed(2) : Math.round(item.parentAdj).toLocaleString());
    const valLabelC = '$' + (item.childAdj  < 10 ? item.childAdj.toFixed(2)  : Math.round(item.childAdj).toLocaleString());

    // Label truncation: max 14 chars
    const labelText = item.label.length > 14 ? item.label.slice(0, 13) + '.' : item.label;

    bars += `
  <text x="${padL - 8}" y="${yBase + barH + barGap / 2 + 4}" font-family="Inter,system-ui,sans-serif" font-size="12" fill="${labelColor}" text-anchor="end">${labelText}</text>
  <rect x="${padL}" y="${yP}" width="${wP}" height="${barH}" rx="3" fill="${accentParent}" opacity="0.8"/>
  <text x="${padL + wP + 5}" y="${yP + barH - 4}" font-family="Inter,system-ui,sans-serif" font-size="11" fill="${textColor}">${valLabelP}</text>
  <rect x="${padL}" y="${yC}" width="${wC}" height="${barH}" rx="3" fill="${accentChild}" opacity="0.8"/>
  <text x="${padL + wC + 5}" y="${yC + barH - 4}" font-family="Inter,system-ui,sans-serif" font-size="11" fill="${textColor}">${valLabelC}</text>`;
  });

  // Legend at bottom
  const legendY = padT + itemCount * groupH + 8;
  const legend  = `
  <rect x="${padL}" y="${legendY}" width="10" height="10" rx="2" fill="${accentParent}" opacity="0.8"/>
  <text x="${padL + 14}" y="${legendY + 9}" font-family="Inter,system-ui,sans-serif" font-size="11" fill="${labelColor}">Their generation</text>
  <rect x="${padL + 120}" y="${legendY}" width="10" height="10" rx="2" fill="${accentChild}" opacity="0.8"/>
  <text x="${padL + 134}" y="${legendY + 9}" font-family="Inter,system-ui,sans-serif" font-size="11" fill="${labelColor}">Your generation</text>`;

  return `<svg viewBox="0 0 ${W} ${H + 20}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;">${bars}${legend}
</svg>`;
}

// Population timeline: 3 points on a simple line
function svgPopulationChart(parentPop, childPop, todayPop, parentYear, childYear) {
  const W   = 600;
  const H   = 160;
  const padL = 60;
  const padR = 60;
  const padT = 40;
  const padB = 30;

  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxPop = Math.max(parentPop, childPop, todayPop) * 1.15;
  const minPop = Math.min(parentPop, childPop, todayPop) * 0.85;
  const range  = maxPop - minPop;

  function xPos(idx) { return padL + Math.round((idx / 2) * chartW); }
  function yPos(val) { return padT + Math.round(((maxPop - val) / range) * chartH); }

  const points = [
    { val: parentPop, year: parentYear, label: parentPop.toFixed(1) + 'B' },
    { val: childPop,  year: childYear,  label: childPop.toFixed(1) + 'B' },
    { val: todayPop,  year: 2024,        label: todayPop.toFixed(1) + 'B' },
  ];

  const xs = [0, 1, 2].map(xPos);
  const ys = points.map(p => yPos(p.val));

  const textColor  = '#e8e5e0';
  const labelColor = '#9898b0';
  const lineColor  = '#4b5563';
  const dotColor   = '#a78bfa';

  // Smooth path via quadratic bezier
  const mx1 = Math.round((xs[0] + xs[1]) / 2);
  const mx2 = Math.round((xs[1] + xs[2]) / 2);
  const pathD = `M ${xs[0]} ${ys[0]} Q ${mx1} ${ys[0]} ${xs[1]} ${ys[1]} Q ${mx2} ${ys[1]} ${xs[2]} ${ys[2]}`;

  // Area fill
  const areaD = `${pathD} L ${xs[2]} ${padT + chartH} L ${xs[0]} ${padT + chartH} Z`;

  let dotsSvg = '';
  points.forEach((p, i) => {
    const labelY = ys[i] > padT + 20 ? ys[i] - 10 : ys[i] + 20;
    dotsSvg += `
  <circle cx="${xs[i]}" cy="${ys[i]}" r="5" fill="${dotColor}"/>
  <text x="${xs[i]}" y="${labelY}" font-family="Inter,system-ui,sans-serif" font-size="13" font-weight="600" fill="${textColor}" text-anchor="middle">${p.label}</text>
  <text x="${xs[i]}" y="${padT + chartH + 18}" font-family="Inter,system-ui,sans-serif" font-size="11" fill="${labelColor}" text-anchor="middle">${p.year}</text>`;
  });

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;">
  <defs>
    <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${dotColor}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${dotColor}" stop-opacity="0.01"/>
    </linearGradient>
  </defs>
  <path d="${areaD}" fill="url(#popGrad)"/>
  <path d="${pathD}" stroke="${dotColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
  ${dotsSvg}
</svg>`;
}

// GDP growth two-bar chart
function svgGdpChart(parentGdpAdj, childGdpAdj, parentYear, childYear, accentParent, accentChild) {
  const W    = 600;
  const H    = 160;
  const padL = 32;
  const padR = 32;
  const padT = 16;
  const padB = 36;

  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barW   = Math.round(chartW * 0.28);
  const gap    = Math.round(chartW * 0.08);
  const totalTwoBars = barW * 2 + gap;
  const startX = padL + Math.round((chartW - totalTwoBars) / 2);

  const maxGdp = Math.max(parentGdpAdj, childGdpAdj) * 1.2;

  function barH(val) { return Math.max(4, Math.round((val / maxGdp) * chartH)); }

  const hP = barH(parentGdpAdj);
  const hC = barH(childGdpAdj);

  const xP  = startX;
  const xC  = startX + barW + gap;
  const yP  = padT + chartH - hP;
  const yC  = padT + chartH - hC;
  const yBL = padT + chartH;

  const valP = '$' + Math.round(parentGdpAdj / 1000) + 'k';
  const valC = '$' + Math.round(childGdpAdj  / 1000) + 'k';
  const textColor  = '#e8e5e0';
  const labelColor = '#9898b0';

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;">
  <rect x="${xP}" y="${yP}" width="${barW}" height="${hP}" rx="4" fill="${accentParent}" opacity="0.85"/>
  <text x="${xP + barW / 2}" y="${yP - 6}" font-family="Inter,system-ui,sans-serif" font-size="15" font-weight="600" fill="${textColor}" text-anchor="middle">${valP}</text>
  <text x="${xP + barW / 2}" y="${yBL + 18}" font-family="Inter,system-ui,sans-serif" font-size="12" fill="${labelColor}" text-anchor="middle">${parentYear}</text>

  <rect x="${xC}" y="${yC}" width="${barW}" height="${hC}" rx="4" fill="${accentChild}" opacity="0.85"/>
  <text x="${xC + barW / 2}" y="${yC - 6}" font-family="Inter,system-ui,sans-serif" font-size="15" font-weight="600" fill="${textColor}" text-anchor="middle">${valC}</text>
  <text x="${xC + barW / 2}" y="${yBL + 18}" font-family="Inter,system-ui,sans-serif" font-size="12" fill="${labelColor}" text-anchor="middle">${childYear}</text>

  <line x1="${padL}" y1="${yBL}" x2="${W - padR}" y2="${yBL}" stroke="#2d2d40" stroke-width="1"/>
  <text x="${W / 2}" y="${yBL + 33}" font-family="Inter,system-ui,sans-serif" font-size="11" fill="${labelColor}" text-anchor="middle">GDP per capita - inflation-adjusted to 2024 dollars</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// PATTERN RENDERERS (copied from parent app.js)
// ---------------------------------------------------------------------------

function patternB({ eyebrow, headline, left, right, commentary }) {
  return `
    <div class="pattern-b" data-reveal>
      ${eyebrow  ? `<p class="eyebrow">${escHtml(eyebrow)}</p>` : ''}
      ${headline ? `<p class="section-headline">${escHtml(headline)}</p>` : ''}
      <div class="two-up">
        <div class="two-up-card">
          <span class="two-up-label">${escHtml(left.label)}</span>
          <span class="two-up-value">${escHtml(String(left.value))}</span>
          <p class="two-up-desc">${escHtml(left.desc)}</p>
        </div>
        <div class="two-up-card">
          <span class="two-up-label ${right.labelMuted ? 'muted' : ''}">${escHtml(right.label)}</span>
          <span class="two-up-value">${escHtml(String(right.value))}</span>
          <p class="two-up-desc">${escHtml(right.desc)}</p>
        </div>
      </div>
      ${commentary ? `<p class="two-up-commentary">${escHtml(commentary)}</p>` : ''}
    </div>
  `;
}

function patternC({ eyebrow, title, detail }) {
  return `
    <div class="pattern-c" data-reveal>
      <div class="billboard-card">
        ${eyebrow ? `<p class="eyebrow">${escHtml(eyebrow)}</p>` : ''}
        <p class="billboard-title">${escHtml(title)}</p>
        ${detail ? `<p class="billboard-detail">${escHtml(detail)}</p>` : ''}
      </div>
    </div>
  `;
}

function patternD({ eyebrow, headline, items }) {
  if (!items || items.length === 0) return '';

  const itemsHtml = items.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot-col">
        <div class="timeline-dot"></div>
        <div class="timeline-line"></div>
      </div>
      <span class="timeline-month">${escHtml(item.month)}</span>
      <p class="timeline-event">${escHtml(item.event)}</p>
    </div>
  `).join('');

  return `
    <div class="pattern-d" data-reveal>
      ${eyebrow  ? `<p class="eyebrow">${escHtml(eyebrow)}</p>` : ''}
      ${headline ? `<p class="section-headline">${escHtml(headline)}</p>` : ''}
      <div class="timeline">${itemsHtml}</div>
    </div>
  `;
}

function patternF({ eyebrow, headline, stats }) {
  const statsHtml = stats.map(s => `
    <div class="stat-item">
      <p class="stat-label">${escHtml(s.label)}</p>
      <p class="stat-value">${escHtml(s.value)}</p>
      <p class="stat-sub">${escHtml(s.sub || '')}</p>
    </div>
  `).join('');

  return `
    <div class="pattern-f" data-reveal>
      ${eyebrow  ? `<p class="eyebrow">${escHtml(eyebrow)}</p>` : ''}
      ${headline ? `<p class="section-headline">${escHtml(headline)}</p>` : ''}
      <div class="stat-trio">${statsHtml}</div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// COMPARE CARD - side-by-side generation comparison
// ---------------------------------------------------------------------------

function compareCard({ eyebrow, headline, parent, child, delta, commentary }) {
  // parent: { label, value, desc }
  // child: { label, value, desc }
  // delta: { text, type: 'positive'|'negative'|'neutral' } (optional)
  const deltaHtml = delta ? `
    <div class="compare-delta compare-delta--${escHtml(delta.type || 'neutral')}">
      ${escHtml(delta.text)}
    </div>
  ` : '';

  return `
    <div class="compare-card" data-reveal>
      ${eyebrow  ? `<p class="eyebrow">${escHtml(eyebrow)}</p>` : ''}
      ${headline ? `<p class="section-headline">${escHtml(headline)}</p>` : ''}
      <div class="two-up">
        <div class="two-up-card two-up-card--parent">
          <span class="two-up-label">${escHtml(parent.label)}</span>
          <span class="two-up-value">${escHtml(String(parent.value))}</span>
          <p class="two-up-desc">${escHtml(parent.desc)}</p>
        </div>
        <div class="two-up-card two-up-card--child">
          <span class="two-up-label">${escHtml(child.label)}</span>
          <span class="two-up-value">${escHtml(String(child.value))}</span>
          <p class="two-up-desc">${escHtml(child.desc)}</p>
        </div>
      </div>
      ${deltaHtml}
      ${commentary ? `<p class="two-up-commentary">${escHtml(commentary)}</p>` : ''}
    </div>
  `;
}

// Price comparison grid for inflation-adjusted prices
function priceCompareGrid({ eyebrow, headline, items, note }) {
  // items: [{ emoji, label, parentVal, childVal, deltaText, deltaType }]
  const rowsHtml = items.map(item => {
    const deltaClass = item.deltaType ? `price-cmp-delta--${item.deltaType}` : '';
    return `
      <div class="price-cmp-row">
        <span class="price-cmp-emoji">${item.emoji}</span>
        <span class="price-cmp-label">${escHtml(item.label)}</span>
        <span class="price-cmp-val price-cmp-val--parent">${escHtml(item.parentVal)}</span>
        <span class="price-cmp-arrow">&#8594;</span>
        <span class="price-cmp-val price-cmp-val--child">${escHtml(item.childVal)}</span>
        ${item.deltaText ? `<span class="price-cmp-delta ${deltaClass}">${escHtml(item.deltaText)}</span>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="pattern-b" data-reveal>
      ${eyebrow  ? `<p class="eyebrow">${escHtml(eyebrow)}</p>` : ''}
      ${headline ? `<p class="section-headline">${escHtml(headline)}</p>` : ''}
      <div class="price-cmp-grid">${rowsHtml}</div>
      ${note ? `<p class="price-cmp-note">${escHtml(note)}</p>` : ''}
    </div>
  `;
}

// Dual-column event timeline
function dualTimeline({ eyebrow, headline, parentYear, childYear, parentEvents, childEvents }) {
  function eventsHtml(events, cssClass) {
    if (!events || events.length === 0) return '<p class="timeline-empty">No major events recorded</p>';
    return events.map(ev => {
      const month = ev.month ? MONTH_ABBR[(ev.month - 1)] || ev.month : '';
      return `
        <div class="timeline-item ${cssClass}">
          <div class="timeline-dot-col">
            <div class="timeline-dot"></div>
            <div class="timeline-line"></div>
          </div>
          ${month ? `<span class="timeline-month">${escHtml(month)}</span>` : ''}
          <p class="timeline-event">${escHtml(ev.event)}</p>
        </div>
      `;
    }).join('');
  }

  return `
    <div class="pattern-d" data-reveal>
      ${eyebrow  ? `<p class="eyebrow">${escHtml(eyebrow)}</p>` : ''}
      ${headline ? `<p class="section-headline">${escHtml(headline)}</p>` : ''}
      <div class="dual-timeline">
        <div class="dual-timeline-col">
          <p class="dual-timeline-year dual-timeline-year--parent">${parentYear}</p>
          <div class="timeline">${eventsHtml(parentEvents, 'timeline-item--parent')}</div>
        </div>
        <div class="dual-timeline-col">
          <p class="dual-timeline-year dual-timeline-year--child">${childYear}</p>
          <div class="timeline">${eventsHtml(childEvents, 'timeline-item--child')}</div>
        </div>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------------

async function loadBothYears(parentYear, childYear) {
  const [p, c] = await Promise.all([
    fetch('../data/' + parentYear + '.json').then(r => {
      if (!r.ok) throw new Error('No data for ' + parentYear);
      return r.json();
    }),
    fetch('../data/' + childYear + '.json').then(r => {
      if (!r.ok) throw new Error('No data for ' + childYear);
      return r.json();
    }),
  ]);
  return { parentData: p, childData: c };
}

// ---------------------------------------------------------------------------
// MAIN RENDER FUNCTION
// ---------------------------------------------------------------------------

function renderComparison(parentYear, childYear, countryCode, parentData, childData) {
  const country = COUNTRY_MAP[countryCode] || COUNTRIES[0];
  const countryFlag = country.flag;
  const cpiP = CPI_TO_2024[parentYear] || 1;
  const cpiC = CPI_TO_2024[childYear] || 1;

  const parentCountryData = parentData.countries?.[countryCode] || {};
  const childCountryData  = childData.countries?.[countryCode]  || {};

  const accentP = getAccentForYear(parentYear);
  const accentC = getAccentForYear(childYear);

  const sections = [];

  // -----------------------------------------------------------------------
  // SECTION 1: POPULATION
  // -----------------------------------------------------------------------

  const popP = parentData.world?.population_billions;
  const popC = childData.world?.population_billions;
  const popToday = TODAY.population_billions;

  if (popP && popC) {
    const popGrowthPct = ((popC - popP) / popP * 100).toFixed(1);
    const growthToToday = (popToday - popC).toFixed(1);
    const commentary = popC > popP
      ? 'By the time your generation arrived, the world had gained ' + (popC - popP).toFixed(2) + ' billion more people. Today it stands at ' + popToday.toFixed(1) + 'B - ' + growthToToday + 'B more since you were born.'
      : 'The world population barely moved between these two generations.';

    sections.push(compareCard({
      eyebrow: 'World Population',
      headline: 'How many people shared the planet',
      parent: {
        label: String(parentYear),
        value: popP.toFixed(2) + 'B',
        desc: 'people on Earth when they were born',
      },
      child: {
        label: String(childYear),
        value: popC.toFixed(2) + 'B',
        desc: 'people on Earth when you were born',
      },
      delta: {
        text: signedPct(parseFloat(popGrowthPct)) + ' more people between generations',
        type: 'neutral',
      },
      commentary,
    }));

    // Population timeline SVG chart
    sections.push(`<div class="chart-container" data-reveal>${svgPopulationChart(popP, popC, popToday, parentYear, childYear)}</div>`);
  }

  // -----------------------------------------------------------------------
  // SECTION 2: COUNTRY LEADERS
  // -----------------------------------------------------------------------

  const leaderInfo = LEADER_KEYS[countryCode] || LEADER_KEYS.US;
  const leaderP = parentData.leaders?.[leaderInfo.key]
    || parentCountryData.leader
    || 'Unknown';
  const leaderC = childData.leaders?.[leaderInfo.key]
    || childCountryData.leader
    || 'Unknown';
  const countryDisplayP = displayCountryName(country, parentYear);
  const countryDisplayC = displayCountryName(country, childYear);

  sections.push(compareCard({
    eyebrow: countryFlag + ' ' + country.name + ' Leadership',
    headline: 'Who was in charge',
    parent: {
      label: String(parentYear),
      value: leaderP,
      desc: leaderInfo.title + ' of ' + countryDisplayP,
    },
    child: {
      label: String(childYear),
      value: leaderC,
      desc: leaderInfo.title + ' of ' + countryDisplayC,
    },
  }));

  // -----------------------------------------------------------------------
  // SECTION 3: LIFE EXPECTANCY
  // -----------------------------------------------------------------------

  const lifeP = parentCountryData.life_expectancy || parentData.world?.life_expectancy_global;
  const lifeC = childCountryData.life_expectancy  || childData.world?.life_expectancy_global;

  if (lifeP && lifeC) {
    const lifeDelta = (lifeC - lifeP).toFixed(1);
    const betterOrWorse = parseFloat(lifeDelta) >= 0 ? 'longer' : 'shorter';
    const absLifeDelta = Math.abs(parseFloat(lifeDelta));

    // Birth lottery: highest vs lowest country gap
    const allCountries = Object.keys(parentData.countries || {});
    const lifeValsP = allCountries.map(k => parentData.countries[k].life_expectancy).filter(Boolean);
    const lifeValsC = allCountries.map(k => childData.countries?.[k]?.life_expectancy).filter(Boolean);
    const gapP = lifeValsP.length >= 2 ? (Math.max(...lifeValsP) - Math.min(...lifeValsP)).toFixed(1) : null;
    const gapC = lifeValsC.length >= 2 ? (Math.max(...lifeValsC) - Math.min(...lifeValsC)).toFixed(1) : null;

    let commentary = absLifeDelta > 0
      ? 'Your generation can expect ' + absLifeDelta + ' years ' + betterOrWorse + ' on average than the previous one.'
      : 'Life expectancy stayed roughly flat between these generations.';

    if (gapP && gapC) {
      const gapChange = (parseFloat(gapC) - parseFloat(gapP)).toFixed(1);
      const gapDir = parseFloat(gapChange) < 0 ? 'narrowed' : 'widened';
      commentary += ' The gap between the longest- and shortest-lived countries ' + gapDir + ' from ' + gapP + ' years to ' + gapC + ' years.';
    }

    sections.push(compareCard({
      eyebrow: countryFlag + ' Life Expectancy',
      headline: 'How long a generation could expect to live',
      parent: {
        label: String(parentYear),
        value: lifeP + ' yrs',
        desc: 'at birth in ' + countryDisplayP,
      },
      child: {
        label: String(childYear),
        value: lifeC + ' yrs',
        desc: 'at birth in ' + countryDisplayC,
      },
      delta: {
        text: signedRaw(parseFloat(lifeDelta)) + ' years between generations',
        type: parseFloat(lifeDelta) >= 0 ? 'positive' : 'negative',
      },
      commentary,
    }));

    // Life expectancy SVG chart
    const todayLE = TODAY.life_expectancy[countryCode] || TODAY.global_life_expectancy;
    sections.push(`<div class="chart-container" data-reveal>${svgLifeExpChart(lifeP, lifeC, todayLE, parentYear, childYear, accentP, accentC)}</div>`);
  }

  // -----------------------------------------------------------------------
  // SECTION 4: THE ECONOMY (all inflation-adjusted)
  // -----------------------------------------------------------------------

  // GDP per capita
  const gdpRawP = parentCountryData.gdp_per_capita_usd || parentData.economy?.us_gdp_per_capita_usd;
  const gdpRawC = childCountryData.gdp_per_capita_usd  || childData.economy?.us_gdp_per_capita_usd;

  if (gdpRawP && gdpRawC) {
    const gdpP = Math.round(gdpRawP * cpiP);
    const gdpC = Math.round(gdpRawC * cpiC);
    const gdpChangePct = ((gdpC - gdpP) / gdpP * 100).toFixed(1);
    const betterOrWorse = parseFloat(gdpChangePct) >= 0 ? 'richer' : 'poorer';

    sections.push(compareCard({
      eyebrow: 'Economy - GDP Per Capita',
      headline: 'Real purchasing power across generations',
      parent: {
        label: String(parentYear),
        value: '$' + Math.round(gdpP).toLocaleString(),
        desc: 'in today\'s dollars',
      },
      child: {
        label: String(childYear),
        value: '$' + Math.round(gdpC).toLocaleString(),
        desc: 'in today\'s dollars',
      },
      delta: {
        text: signedPct(parseFloat(gdpChangePct)) + ' real change - your generation was born into a ' + betterOrWorse + ' economy',
        type: parseFloat(gdpChangePct) >= 0 ? 'positive' : 'negative',
      },
      commentary: 'All figures adjusted to 2024 dollars. A positive shift means real economic growth, not just inflation.',
    }));

    // GDP SVG chart
    sections.push(`<div class="chart-container" data-reveal>${svgGdpChart(gdpP, gdpC, parentYear, childYear, accentP, accentC)}</div>`);
  }

  // US median household income (only for US)
  if (countryCode === 'US') {
    const incRawP = parentData.economy?.us_median_household_income_usd;
    const incRawC = childData.economy?.us_median_household_income_usd;

    if (incRawP && incRawC) {
      const incP = Math.round(incRawP * cpiP);
      const incC = Math.round(incRawC * cpiC);
      const incChangePct = ((incC - incP) / incP * 100).toFixed(1);

      sections.push(compareCard({
        eyebrow: 'Economy - Median Household Income (US)',
        headline: 'What a typical family earned',
        parent: {
          label: String(parentYear),
          value: '$' + Math.round(incP).toLocaleString(),
          desc: 'median household income in today\'s dollars',
        },
        child: {
          label: String(childYear),
          value: '$' + Math.round(incC).toLocaleString(),
          desc: 'median household income in today\'s dollars',
        },
        delta: {
          text: signedPct(parseFloat(incChangePct)) + ' real change in household income',
          type: parseFloat(incChangePct) >= 0 ? 'positive' : 'negative',
        },
        commentary: 'Figures are in 2024 dollars. This shows whether typical families actually got ahead - adjusted for inflation.',
      }));
    }

    // Housing affordability ratio
    const homeRawP = parentData.prices_us?.median_home_usd;
    const homeRawC = childData.prices_us?.median_home_usd;
    const incomeRawP = parentData.economy?.us_median_household_income_usd;
    const incomeRawC = childData.economy?.us_median_household_income_usd;

    if (homeRawP && homeRawC && incomeRawP && incomeRawC) {
      // Ratio uses nominal prices (housing affordability is a nominal comparison)
      const ratioP = (homeRawP / incomeRawP).toFixed(1);
      const ratioC = (homeRawC / incomeRawC).toFixed(1);
      const ratioDelta = (parseFloat(ratioC) - parseFloat(ratioP)).toFixed(1);
      const affordability = parseFloat(ratioDelta) > 0 ? 'harder to afford' : 'easier to afford';

      sections.push(compareCard({
        eyebrow: 'Housing Affordability (US)',
        headline: 'How many years of income to buy a home',
        parent: {
          label: String(parentYear),
          value: ratioP + 'x',
          desc: 'years of median income to buy median home',
        },
        child: {
          label: String(childYear),
          value: ratioC + 'x',
          desc: 'years of median income to buy median home',
        },
        delta: {
          text: 'Homes became ' + affordability + ' - ratio shifted by ' + signedRaw(parseFloat(ratioDelta)) + 'x',
          type: parseFloat(ratioDelta) > 0 ? 'negative' : 'positive',
        },
        commentary: 'Lower ratio means more affordable. A ratio of 3 means a median home cost 3 years of median salary.',
      }));
    }
  }

  // Price comparison grid (inflation-adjusted, US prices)
  const pricesP = parentData.prices_us;
  const pricesC = childData.prices_us;

  if (pricesP && pricesC) {
    const priceItems = [
      { emoji: '\u26FD', label: 'Gallon of gas',   keyP: 'gallon_gas_usd',    keyC: 'gallon_gas_usd' },
      { emoji: '\uD83E\uDD5B', label: 'Gallon of milk',  keyP: 'gallon_milk_usd',   keyC: 'gallon_milk_usd' },
      { emoji: '\uD83E\uDD5A', label: 'Dozen eggs',       keyP: 'dozen_eggs_usd',    keyC: 'dozen_eggs_usd' },
      { emoji: '\uD83E\uDE84', label: 'Loaf of bread',   keyP: 'loaf_bread_usd',    keyC: 'loaf_bread_usd' },
      { emoji: '\uD83C\uDFAC', label: 'Movie ticket',     keyP: 'movie_ticket_usd',  keyC: 'movie_ticket_usd' },
      { emoji: '\uD83C\uDF54', label: 'Big Mac',          keyP: 'big_mac_usd',       keyC: 'big_mac_usd' },
    ];

    const gridItems = priceItems
      .map(item => {
        const rawP = pricesP[item.keyP];
        const rawC = pricesC[item.keyC];
        if (!rawP || !rawC) return null;

        const adjP = rawP * cpiP;
        const adjC = rawC * cpiC;
        const pct = ((adjC - adjP) / adjP * 100).toFixed(1);
        const cheaper = parseFloat(pct) <= 0;

        return {
          emoji: item.emoji,
          label: item.label,
          parentVal: '$' + formatPriceValue(adjP),
          childVal:  '$' + formatPriceValue(adjC),
          deltaText: signedPct(parseFloat(pct)),
          deltaType: cheaper ? 'positive' : 'negative',
        };
      })
      .filter(Boolean);

    if (gridItems.length > 0) {
      sections.push(priceCompareGrid({
        eyebrow: 'Everyday Prices',
        headline: 'What things cost - in today\'s dollars',
        items: gridItems,
        note: 'All prices adjusted to 2024 dollars. A negative change means something got cheaper in real terms.',
      }));

      // Price SVG chart - same items mapped for chart function
      const chartPriceItems = priceItems
        .map(item => {
          const rawP = pricesP[item.keyP];
          const rawC = pricesC[item.keyC];
          if (!rawP || !rawC) return null;
          return { label: item.label, parentAdj: rawP * cpiP, childAdj: rawC * cpiC };
        })
        .filter(Boolean);

      if (chartPriceItems.length > 0) {
        sections.push(`<div class="chart-container" data-reveal>${svgPriceChart(chartPriceItems, accentP, accentC)}</div>`);
      }
    }
  }

  // -----------------------------------------------------------------------
  // SECTION 5: CULTURE
  // -----------------------------------------------------------------------

  const musicP = parentData.culture?.music;
  const musicC = childData.culture?.music;
  const songP = musicP?.billboard_no1_song || musicP?.uk_no1_jan;
  const songC = musicC?.billboard_no1_song || musicC?.uk_no1_jan;
  const artistP = musicP?.billboard_no1_artist || musicP?.uk_no1_jan_artist;
  const artistC = musicC?.billboard_no1_artist || musicC?.uk_no1_jan_artist;

  if (songP && songC) {
    sections.push(compareCard({
      eyebrow: '\uD83C\uDFB5 Music',
      headline: 'Billboard #1 that year',
      parent: {
        label: String(parentYear),
        value: songP,
        desc: artistP ? 'by ' + artistP : '',
      },
      child: {
        label: String(childYear),
        value: songC,
        desc: artistC ? 'by ' + artistC : '',
      },
    }));
  }

  const oscarP = parentData.culture?.film?.oscar_best_picture;
  const oscarC = childData.culture?.film?.oscar_best_picture;

  if (oscarP && oscarC) {
    sections.push(compareCard({
      eyebrow: '\uD83C\uDFC6 Film',
      headline: 'Oscar Best Picture',
      parent: {
        label: String(parentYear),
        value: oscarP,
        desc: parentData.culture?.film?.oscar_best_director_name ? 'dir. ' + parentData.culture.film.oscar_best_director_name : '',
      },
      child: {
        label: String(childYear),
        value: oscarC,
        desc: childData.culture?.film?.oscar_best_director_name ? 'dir. ' + childData.culture.film.oscar_best_director_name : '',
      },
    }));
  }

  const tvP = parentData.culture?.television?.most_watched_show;
  const tvC = childData.culture?.television?.most_watched_show;

  if (tvP && tvC) {
    sections.push(compareCard({
      eyebrow: '\uD83D\uDCFA Television',
      headline: 'Most-watched TV show',
      parent: {
        label: String(parentYear),
        value: tvP,
        desc: parentData.culture?.television?.most_watched_network || '',
      },
      child: {
        label: String(childYear),
        value: tvC,
        desc: childData.culture?.television?.most_watched_network || '',
      },
    }));
  }

  // -----------------------------------------------------------------------
  // SECTION 6: TECHNOLOGY
  // -----------------------------------------------------------------------

  const techP = parentData.technology;
  const techC = childData.technology;

  if (techP?.milestone || techC?.milestone) {
    sections.push(compareCard({
      eyebrow: '\uD83D\uDCBB Technology',
      headline: 'The defining tech moment',
      parent: {
        label: String(parentYear),
        value: techP?.top_computer || 'See below',
        desc: techP?.milestone ? techP.milestone.slice(0, 80) + (techP.milestone.length > 80 ? '...' : '') : 'No milestone recorded',
      },
      child: {
        label: String(childYear),
        value: techC?.top_computer || 'See below',
        desc: techC?.milestone ? techC.milestone.slice(0, 80) + (techC.milestone.length > 80 ? '...' : '') : 'No milestone recorded',
      },
    }));
  }

  // Computing power (hard drive size or mobile subscribers)
  const hdP = techP?.avg_hard_drive_mb;
  const hdC = techC?.avg_hard_drive_mb;

  if (hdP != null && hdC != null && (hdP > 0 || hdC > 0)) {
    const hdValP = hdP >= 1000 ? (hdP / 1000).toFixed(1) + ' GB' : (hdP > 0 ? hdP + ' MB' : 'None');
    const hdValC = hdC >= 1000 ? (hdC / 1000).toFixed(1) + ' GB' : (hdC > 0 ? hdC + ' MB' : 'None');

    sections.push(compareCard({
      eyebrow: '\uD83D\uDCBE Storage',
      headline: 'Average hard drive capacity',
      parent: {
        label: String(parentYear),
        value: hdValP,
        desc: 'typical computer storage',
      },
      child: {
        label: String(childYear),
        value: hdValC,
        desc: 'typical computer storage',
      },
    }));
  }

  const mobileP = techP?.mobile_subscribers_millions;
  const mobileC = techC?.mobile_subscribers_millions;

  if (mobileP != null && mobileC != null) {
    sections.push(compareCard({
      eyebrow: '\uD83D\uDCF1 Mobile',
      headline: 'Mobile phone subscribers worldwide',
      parent: {
        label: String(parentYear),
        value: mobileP > 0 ? abbreviateNumber(mobileP * 1e6) : 'None',
        desc: 'subscribers globally',
      },
      child: {
        label: String(childYear),
        value: mobileC > 0 ? abbreviateNumber(mobileC * 1e6) : 'None',
        desc: 'subscribers globally',
      },
    }));
  }

  // -----------------------------------------------------------------------
  // SECTION 7: WORLD EVENTS
  // -----------------------------------------------------------------------

  const eventsP = (parentData.world_events || []).slice(0, 4);
  const eventsC = (childData.world_events || []).slice(0, 4);

  if (eventsP.length > 0 || eventsC.length > 0) {
    sections.push(dualTimeline({
      eyebrow: '\uD83C\uDF0D World Events',
      headline: 'What was happening when each generation arrived',
      parentYear,
      childYear,
      parentEvents: eventsP,
      childEvents: eventsC,
    }));
  }

  // -----------------------------------------------------------------------
  // RENDER TO DOM (first pass - everything except "at 18")
  // -----------------------------------------------------------------------

  $content.innerHTML = sections.join('');
  initRevealObserver();

  // -----------------------------------------------------------------------
  // "WHEN YOU WERE 18" - async section appended after initial render
  // -----------------------------------------------------------------------

  renderAt18Section(parentYear, childYear, countryCode, accentP, accentC);
}

// ---------------------------------------------------------------------------
// WHEN YOU WERE 18 - async section
// ---------------------------------------------------------------------------

async function renderAt18Section(parentYear, childYear, countryCode, accentP, accentC) {
  const parentAt18 = parentYear + 18;
  const childAt18  = childYear  + 18;

  // Both years must fall within data range and not be in gaps
  if (
    parentAt18 < YEAR_MIN || parentAt18 > YEAR_MAX || YEAR_GAPS.has(parentAt18) ||
    childAt18  < YEAR_MIN || childAt18  > YEAR_MAX || YEAR_GAPS.has(childAt18)
  ) {
    return; // Skip gracefully if outside range
  }

  let parentAt18Data, childAt18Data;
  try {
    [parentAt18Data, childAt18Data] = await Promise.all([
      fetch('../data/' + parentAt18 + '.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch('../data/' + childAt18  + '.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
    ]);
  } catch (_) {
    return; // Silently skip if data unavailable
  }

  const country = COUNTRY_MAP[countryCode] || COUNTRIES[0];
  const cpiP18  = CPI_TO_2024[parentAt18] || 1;
  const cpiC18  = CPI_TO_2024[childAt18]  || 1;

  function at18Card(year, data, cpiYear, accentColor, pillClass, pillLabel) {
    const music   = data.culture?.music;
    const film    = data.culture?.film;
    const tv      = data.culture?.television;
    const tech    = data.technology;
    const events  = data.world_events || [];
    const countryD = data.countries?.[countryCode] || {};

    // Leader: check country-level first, then leaders lookup
    const leaderInfo = LEADER_KEYS[countryCode] || LEADER_KEYS.US;
    const leader = data.leaders?.[leaderInfo.key] || countryD.leader || 'Unknown';

    // Gas price inflation-adjusted to 2024 dollars
    const gasRaw   = data.prices_us?.gallon_gas_usd;
    const gasFinal = gasRaw ? ('$' + (gasRaw * cpiYear).toFixed(2)) : null;

    const song    = music?.billboard_no1_song  || music?.uk_no1_jan;
    const artist  = music?.billboard_no1_artist || music?.uk_no1_jan_artist;
    const movie   = film?.box_office_no1        || film?.oscar_best_picture;
    const tvShow  = tv?.most_watched_show;
    const techMil = tech?.milestone;

    // Pick one notable world event
    const bigEvent = events.length > 0 ? events[0].event : null;

    function row(icon, label, value) {
      if (!value) return '';
      return `<div class="at18-row">
        <span class="at18-row-icon">${icon}</span>
        <span class="at18-row-label">${escHtml(label)}</span>
        <span class="at18-row-value">${escHtml(value)}</span>
      </div>`;
    }

    const rows = [
      row('\uD83C\uDFB5', '#1 Song',      song   ? song + (artist ? ' - ' + artist : '') : null),
      row('\uD83C\uDFAC', 'Biggest Film', movie),
      row('\uD83D\uDCFA', 'Top TV Show',  tvShow),
      row('\uD83D\uDCBB', 'Technology',   techMil ? techMil.slice(0, 90) + (techMil.length > 90 ? '...' : '') : null),
      row('\uD83C\uDF0D', 'World Event',  bigEvent ? bigEvent.slice(0, 100) + (bigEvent.length > 100 ? '...' : '') : null),
      row('\u26FD',       'Gas (2024$)',  gasFinal),
      row('\uD83C\uDFF3\uFE0F', leaderInfo.title, leader),
    ].filter(Boolean).join('');

    return `<div class="at18-col">
      <div class="at18-col-header">
        <span class="gen-pill ${pillClass}">${escHtml(pillLabel)}</span>
        <p class="at18-year" style="color:${accentColor}">${year}</p>
        <p class="at18-age-caption">When they turned 18</p>
      </div>
      <div class="at18-rows">${rows}</div>
    </div>`;
  }

  const parentCard = at18Card(parentAt18, parentAt18Data, cpiP18, accentP, 'gen-pill--parent', 'Their 18th');
  const childCard  = at18Card(childAt18,  childAt18Data,  cpiC18, accentC, 'gen-pill--child',  'Your 18th');

  const sectionHtml = `
    <div class="at18-section" data-reveal>
      <div class="cmp-section-header">
        <p class="cmp-section-label">The Year That Shaped You</p>
        <h2 class="cmp-section-title">When you turned 18 vs when your parent turned 18</h2>
        <p class="at18-subhead">The music, movies, and events of your coming-of-age year hit differently. This is the world each generation stepped into as adults.</p>
      </div>
      <div class="at18-grid">
        ${parentCard}
        ${childCard}
      </div>
    </div>
  `;

  // Append after existing content
  $content.insertAdjacentHTML('beforeend', sectionHtml);

  // Observe new reveal elements
  if (revealObserver) {
    $content.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => revealObserver.observe(el));
  }
}

// ---------------------------------------------------------------------------
// SHARE CARD BUILDER
// ---------------------------------------------------------------------------

function buildCompareShareCard() {
  if (!_lastCompare) return;
  const { parentYear, childYear, countryCode, parentData, childData } = _lastCompare;

  const country = COUNTRY_MAP[countryCode] || COUNTRIES[0];
  const accentP = getAccentForYear(parentYear);
  const accentC = getAccentForYear(childYear);
  const cpiP = CPI_TO_2024[parentYear] || 1;
  const cpiC = CPI_TO_2024[childYear] || 1;

  // Life expectancy delta
  const parentCountryData = parentData.countries?.[countryCode] || {};
  const childCountryData  = childData.countries?.[countryCode]  || {};
  const lifeP = parentCountryData.life_expectancy || parentData.world?.life_expectancy_global;
  const lifeC = childCountryData.life_expectancy  || childData.world?.life_expectancy_global;
  const lifeDelta = (lifeP && lifeC) ? (lifeC - lifeP).toFixed(1) : null;

  // GDP real change
  const gdpRawP = parentCountryData.gdp_per_capita_usd || parentData.economy?.us_gdp_per_capita_usd;
  const gdpRawC = childCountryData.gdp_per_capita_usd  || childData.economy?.us_gdp_per_capita_usd;
  const gdpChangePct = (gdpRawP && gdpRawC)
    ? (((gdpRawC * cpiC) - (gdpRawP * cpiP)) / (gdpRawP * cpiP) * 100).toFixed(1)
    : null;

  // Population change
  const popP = parentData.world?.population_billions;
  const popC = childData.world?.population_billions;
  const popChangePct = (popP && popC) ? ((popC - popP) / popP * 100).toFixed(1) : null;

  const stats = [
    lifeP    && lifeC    && { icon: '\u2764\uFE0F', label: 'Life expectancy',        value: signedRaw(parseFloat(lifeDelta)) + ' yrs between generations' },
    gdpRawP  && gdpRawC  && { icon: '\uD83D\uDCB0', label: 'GDP per capita (real)',  value: signedPct(parseFloat(gdpChangePct)) + ' change (2024 dollars)' },
    popP     && popC     && { icon: '\uD83C\uDF0D', label: 'World population',       value: popP.toFixed(2) + 'B to ' + popC.toFixed(2) + 'B (' + signedPct(parseFloat(popChangePct)) + ')' },
  ].filter(Boolean);

  const statsHTML = stats.map(s => `
    <div class="sc-stat">
      <span class="sc-icon">${s.icon}</span>
      <div class="sc-stat-body">
        <span class="sc-stat-label">${escHtml(s.label)}</span>
        <span class="sc-stat-value">${escHtml(s.value)}</span>
      </div>
    </div>
  `).join('');

  $shareCard.style.setProperty('--sc-accent', accentP);
  $shareCard.style.setProperty('--sc-accent-child', accentC);
  $shareCard.innerHTML = `
    <div class="sc-inner">
      <div class="sc-header">
        <p class="sc-flag">${country.flag}</p>
        <p class="sc-year" style="color:${accentP}">${parentYear}</p>
        <p class="sc-vs">vs</p>
        <p class="sc-year" style="color:${accentC}">${childYear}</p>
        <p class="sc-headline">How the world changed between two generations</p>
      </div>
      <div class="sc-stats">${statsHTML}</div>
      <div class="sc-footer">
        <span class="sc-brand">pivode.github.io/born-in/compare</span>
      </div>
    </div>
  `;
}

async function downloadShareCard() {
  if (typeof html2canvas === 'undefined') {
    showToast('Image library still loading. Try again.');
    return;
  }

  buildCompareShareCard();
  $shareCard.style.display = 'block';

  try {
    const canvas = await html2canvas($shareCard, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
      logging: false,
      width: 540,
      height: $shareCard.offsetHeight,
    });

    $shareCard.style.display = '';

    canvas.toBlob((blob) => {
      if (!blob) { showToast('Could not generate image.'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compare-' + (_lastCompare?.parentYear || '') + '-vs-' + (_lastCompare?.childYear || '') + '.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (err) {
    $shareCard.style.display = '';
    showToast('Could not generate image.');
  }
}

// ---------------------------------------------------------------------------
// SCROLL REVEAL
// ---------------------------------------------------------------------------

function initRevealObserver() {
  if (revealObserver) revealObserver.disconnect();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}

// ---------------------------------------------------------------------------
// TWO-ACCENT THEMING
// ---------------------------------------------------------------------------

function applyAccents(parentYear, childYear) {
  const accentP = getAccentForYear(parentYear);
  const accentC = getAccentForYear(childYear);
  document.documentElement.style.setProperty('--accent-parent', accentP);
  document.documentElement.style.setProperty('--accent-child', accentC);
  document.documentElement.style.setProperty('--accent', accentP);
}

// ---------------------------------------------------------------------------
// COUNTRY SELECTOR
// ---------------------------------------------------------------------------

function renderCountryList(filter) {
  const filtered = filter
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
    : COUNTRIES;

  $countryList.innerHTML = filtered.map(c => `
    <li role="option"
        class="country-option${c.code === selectedCountry.code ? ' selected' : ''}"
        data-code="${escHtml(c.code)}">
      <span class="flag">${c.flag}</span>
      <span class="country-name">${escHtml(c.name)}</span>
    </li>
  `).join('');
}

function updateCountryDisplay(country) {
  $countryDisplay.innerHTML = `
    <span class="flag">${country.flag}</span>
    <span class="country-name">${escHtml(country.name)}</span>
  `;
}

function openCountryDropdown() {
  $countryDropdown.classList.remove('hidden');
  $countryBtn.setAttribute('aria-expanded', 'true');
  renderCountryList('');
  $countrySearch.focus();
}

function closeCountryDropdown() {
  $countryDropdown.classList.add('hidden');
  $countryBtn.setAttribute('aria-expanded', 'false');
  $countrySearch.value = '';
}

$countryBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if ($countryDropdown.classList.contains('hidden')) {
    openCountryDropdown();
  } else {
    closeCountryDropdown();
  }
});

$countrySearch.addEventListener('input', () => {
  renderCountryList($countrySearch.value);
});

$countryList.addEventListener('click', (e) => {
  const li = e.target.closest('.country-option');
  if (!li) return;
  const code = li.dataset.code;
  const match = COUNTRY_MAP[code];
  if (match) {
    selectedCountry = match;
    updateCountryDisplay(match);
    closeCountryDropdown();
  }
});

document.addEventListener('click', (e) => {
  if (!$countryDropdown.classList.contains('hidden') &&
      !$countryBtn.contains(e.target) &&
      !$countryDropdown.contains(e.target)) {
    closeCountryDropdown();
  }
});

// ---------------------------------------------------------------------------
// VALIDATION
// ---------------------------------------------------------------------------

function validateYear(raw, errorEl, label) {
  const val = parseInt(raw, 10);
  errorEl.textContent = '';

  if (!raw || isNaN(val)) {
    errorEl.textContent = 'Please enter a year';
    return null;
  }
  if (YEAR_GAPS.has(val)) {
    errorEl.textContent = 'No data for ' + val + '. Try an adjacent year.';
    return null;
  }
  if (val < YEAR_MIN || val > YEAR_MAX) {
    errorEl.textContent = label + ' must be between ' + YEAR_MIN + ' and ' + YEAR_MAX;
    return null;
  }
  return val;
}

// ---------------------------------------------------------------------------
// SHOW / HIDE SCREENS
// ---------------------------------------------------------------------------

function showResult(parentYear, childYear, countryCode, parentData, childData) {
  _lastCompare = { parentYear, childYear, countryCode, parentData, childData };

  applyAccents(parentYear, childYear);

  $landing.classList.add('hidden');
  $errorPanel.classList.add('hidden');

  const country = COUNTRY_MAP[countryCode] || COUNTRIES[0];
  $headerLabel.textContent = parentYear + ' vs ' + childYear;
  $headerCountry.textContent = country.flag + ' ' + country.name;

  renderComparison(parentYear, childYear, countryCode, parentData, childData);

  $result.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function showLanding() {
  $result.classList.add('hidden');
  $errorPanel.classList.add('hidden');
  $landing.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
  // Reset accents
  document.documentElement.style.removeProperty('--accent-parent');
  document.documentElement.style.removeProperty('--accent-child');
  document.documentElement.style.removeProperty('--accent');
}

function showError(msg) {
  $landing.classList.add('hidden');
  $result.classList.add('hidden');
  $errorMessage.textContent = msg;
  $errorPanel.classList.remove('hidden');
}

// ---------------------------------------------------------------------------
// FORM SUBMISSION
// ---------------------------------------------------------------------------

$form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const parentYear = validateYear($parentYearInput.value.trim(), $parentYearError, 'Parent year');
  const childYear  = validateYear($childYearInput.value.trim(),  $childYearError,  'Your year');

  if (!parentYear || !childYear) return;

  if (Math.abs(childYear - parentYear) < 15) {
    $childYearError.textContent = 'Years must be at least 15 apart';
    return;
  }

  const [py, cy] = parentYear < childYear ? [parentYear, childYear] : [childYear, parentYear];

  const submitBtn = document.getElementById('cmp-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.querySelector('.submit-text').textContent = 'Loading...';
  }

  try {
    const { parentData, childData } = await loadBothYears(py, cy);
    updateUrl(py, cy, selectedCountry.code);
    showResult(py, cy, selectedCountry.code, parentData, childData);
  } catch (err) {
    showError('Could not load data. ' + (err.message || 'Please try again.'));
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.querySelector('.submit-text').textContent = 'Compare';
    }
  }
});

// ---------------------------------------------------------------------------
// URL DEEP LINKING
// ---------------------------------------------------------------------------

function updateUrl(parentYear, childYear, countryCode) {
  const params = new URLSearchParams({ parent: parentYear, child: childYear, country: countryCode });
  const newUrl = window.location.pathname + '?' + params.toString();
  history.replaceState(null, '', newUrl);
}

async function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const parentParam  = params.get('parent');
  const childParam   = params.get('child');
  const countryParam = params.get('country');

  if (!parentParam || !childParam) return;

  const py = parseInt(parentParam, 10);
  const cy = parseInt(childParam, 10);

  if (isNaN(py) || isNaN(cy)) return;
  if (py < YEAR_MIN || py > YEAR_MAX || cy < YEAR_MIN || cy > YEAR_MAX) return;
  if (Math.abs(cy - py) < 15) return;

  if (countryParam && COUNTRY_MAP[countryParam]) {
    selectedCountry = COUNTRY_MAP[countryParam];
    updateCountryDisplay(selectedCountry);
  }

  const [parentYear, childYear] = py < cy ? [py, cy] : [cy, py];

  try {
    const { parentData, childData } = await loadBothYears(parentYear, childYear);
    showResult(parentYear, childYear, selectedCountry.code, parentData, childData);
  } catch (err) {
    // Silently fail on URL params - just show landing
  }
}

// ---------------------------------------------------------------------------
// SHARE / NEW BUTTONS
// ---------------------------------------------------------------------------

$shareBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = !$sharePopover.classList.contains('hidden');
  if (isOpen) {
    $sharePopover.classList.add('hidden');
    $shareBtn.setAttribute('aria-expanded', 'false');
  } else {
    $sharePopover.classList.remove('hidden');
    $shareBtn.setAttribute('aria-expanded', 'true');
  }
});

document.addEventListener('click', (e) => {
  if (!$sharePopover.classList.contains('hidden') &&
      !$shareBtn.contains(e.target) &&
      !$sharePopover.contains(e.target)) {
    $sharePopover.classList.add('hidden');
    $shareBtn.setAttribute('aria-expanded', 'false');
  }
});

$copyLinkBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('Link copied!');
  }).catch(() => {
    showToast('Could not copy link.');
  });
  $sharePopover.classList.add('hidden');
});

$tweetBtn.addEventListener('click', () => {
  if (!_lastCompare) return;
  const { parentYear, childYear } = _lastCompare;
  const text = 'How different was the world between ' + parentYear + ' and ' + childYear + '? I compared two generations with this tool.';
  const url  = window.location.href;
  window.open('https://x.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank', 'noopener');
  $sharePopover.classList.add('hidden');
});

$saveCardBtn.addEventListener('click', () => {
  $sharePopover.classList.add('hidden');
  downloadShareCard();
});

function handleNew() {
  showLanding();
  $parentYearInput.value = '';
  $childYearInput.value = '';
  $parentYearError.textContent = '';
  $childYearError.textContent = '';
  history.replaceState(null, '', window.location.pathname);
}

$newBtn.addEventListener('click', handleNew);
$bottomNewBtn.addEventListener('click', handleNew);
$errorBackBtn.addEventListener('click', handleNew);

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------

updateCountryDisplay(selectedCountry);
renderCountryList('');
readUrlParams();
