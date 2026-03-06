/* =========================================================
   THE WORLD WHEN YOU WERE BORN — app.js
   ========================================================= */

'use strict';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const YEAR_MIN = 1950;
const YEAR_MAX = 2010;
// Years with no data (gaps): 1951, 1953
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
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'IN', name: 'India',          flag: '🇮🇳' },
  { code: 'DE', name: 'Germany',        flag: '🇩🇪' },
  { code: 'JP', name: 'Japan',          flag: '🇯🇵' },
  { code: 'FR', name: 'France',         flag: '🇫🇷' },
  { code: 'BR', name: 'Brazil',         flag: '🇧🇷' },
  { code: 'CN', name: 'China',          flag: '🇨🇳' },
  { code: 'AU', name: 'Australia',      flag: '🇦🇺' },
  { code: 'CA', name: 'Canada',         flag: '🇨🇦' },
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
};

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Hardcoded "today" comparison values
const TODAY = {
  population_billions: 8.2,
  us_median_income: 80000,
  us_median_home: 420000,
  global_life_expectancy: 72.3,
  us_life_expectancy: 78.5,
  home_salary_ratio: (420000 / 80000).toFixed(1),
};

// CPI multipliers to convert historical salary to 2024 dollars
// Source: US BLS CPI-U annual averages, base year 2024 (~314.5)
const CPI_TO_2024 = {
  1950:10.28,1951:9.53,1952:9.34,1953:9.24,1954:9.20,1955:9.24,1956:9.09,
  1957:8.79,1958:8.57,1959:8.50,1960:8.37,1961:8.28,1962:8.19,1963:8.09,
  1964:7.97,1965:7.85,1966:7.63,1967:7.42,1968:7.12,1969:6.76,1970:6.39,
  1971:6.13,1972:5.95,1973:5.60,1974:5.04,1975:4.63,1976:4.37,1977:4.11,
  1978:3.83,1979:3.44,1980:3.04,1981:2.75,1982:2.59,1983:2.51,1984:2.41,
  1985:2.33,1986:2.28,1987:2.20,1988:2.11,1989:2.02,1990:1.91,1991:1.83,
  1992:1.78,1993:1.73,1994:1.69,1995:1.64,1996:1.59,1997:1.56,1998:1.54,
  1999:1.50,2000:1.45,2001:1.41,2002:1.39,2003:1.35,2004:1.31,2005:1.27,
  2006:1.23,2007:1.20,2008:1.16,2009:1.16,2010:1.14,
};

// Typewriter phrases
const TYPEWRITER_PHRASES = [
  'The world the day you arrived.',
  'What was playing when you were born?',
  'How much did a house cost that year?',
  'Who was in charge? What was #1?',
];

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

let selectedCountry = COUNTRIES[0]; // default US
let typewriterTimer = null;
let typewriterIndex = 0;
let observer = null;

// ---------------------------------------------------------------------------
// DOM REFS
// ---------------------------------------------------------------------------

const $landing          = document.getElementById('landing');
const $inputForm        = document.getElementById('input-form');
const $yearInput        = document.getElementById('year-input');
const $yearError        = document.getElementById('year-error');
const $countryBtn       = document.getElementById('country-btn');
const $countryDropdown  = document.getElementById('country-dropdown');
const $countrySearch    = document.getElementById('country-search');
const $countryList      = document.getElementById('country-list');
const $typewriter       = document.getElementById('typewriter');
const $revealOverlay    = document.getElementById('reveal-overlay');
const $revealYear       = document.getElementById('reveal-year');
const $revealSub        = document.getElementById('reveal-sub');
const $infographic      = document.getElementById('infographic');
const $infoHeader       = document.getElementById('info-header');
const $headerYear       = document.getElementById('header-year');
const $headerCountry    = document.getElementById('header-country');
const $infoContent      = document.getElementById('info-content');
const $shareBtn         = document.getElementById('share-btn');
const $sharePopover     = document.getElementById('share-popover');
const $copyLinkBtn      = document.getElementById('copy-link-btn');
const $tweetBtn         = document.getElementById('tweet-btn');
const $newYearBtn       = document.getElementById('new-year-btn');
const $dataError        = document.getElementById('data-error');
const $errorMessage     = document.getElementById('error-message');
const $errorBackBtn     = document.getElementById('error-back-btn');

// ---------------------------------------------------------------------------
// ACCENT COLOR
// ---------------------------------------------------------------------------

function getAccentForYear(year) {
  const decade = Math.floor(year / 10) * 10;
  return DECADE_ACCENTS[decade] || '#a78bfa';
}

function applyAccent(year) {
  document.documentElement.style.setProperty('--accent', getAccentForYear(year));
}

// ---------------------------------------------------------------------------
// TYPEWRITER
// ---------------------------------------------------------------------------

function startTypewriter() {
  $typewriter.textContent = TYPEWRITER_PHRASES[0];

  typewriterTimer = setInterval(() => {
    $typewriter.classList.add('fading');
    setTimeout(() => {
      typewriterIndex = (typewriterIndex + 1) % TYPEWRITER_PHRASES.length;
      $typewriter.textContent = TYPEWRITER_PHRASES[typewriterIndex];
      $typewriter.classList.remove('fading');
    }, 300);
  }, 3000);
}

function stopTypewriter() {
  clearInterval(typewriterTimer);
}

// ---------------------------------------------------------------------------
// COUNTRY DROPDOWN
// ---------------------------------------------------------------------------

function renderCountryList(filter = '') {
  const lc = filter.toLowerCase();
  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(lc) || c.code.toLowerCase().includes(lc)
  );

  $countryList.innerHTML = filtered.map(c => `
    <li
      class="country-option"
      role="option"
      data-code="${c.code}"
      aria-selected="${c.code === selectedCountry.code}"
    >
      <span class="flag">${c.flag}</span>
      <span>${c.name}</span>
    </li>
  `).join('');
}

function updateCountryDisplay() {
  document.getElementById('country-display').innerHTML = `
    <span class="flag">${selectedCountry.flag}</span>
    <span class="country-name">${selectedCountry.name}</span>
  `;
}

function openDropdown() {
  $countryDropdown.classList.remove('hidden');
  $countryBtn.setAttribute('aria-expanded', 'true');
  $countrySearch.value = '';
  renderCountryList();
  setTimeout(() => $countrySearch.focus(), 50);
}

function closeDropdown() {
  $countryDropdown.classList.add('hidden');
  $countryBtn.setAttribute('aria-expanded', 'false');
}

$countryBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if ($countryDropdown.classList.contains('hidden')) {
    openDropdown();
  } else {
    closeDropdown();
  }
});

$countrySearch.addEventListener('input', () => {
  renderCountryList($countrySearch.value);
});

$countryList.addEventListener('click', (e) => {
  const option = e.target.closest('[data-code]');
  if (!option) return;
  selectedCountry = COUNTRY_MAP[option.dataset.code];
  updateCountryDisplay();
  closeDropdown();
  $yearInput.focus();
});

document.addEventListener('click', (e) => {
  if (!$countryBtn.contains(e.target) && !$countryDropdown.contains(e.target)) {
    closeDropdown();
  }
});

$countrySearch.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDropdown();
});

// ---------------------------------------------------------------------------
// VALIDATION
// ---------------------------------------------------------------------------

function validateYear(raw) {
  const year = parseInt(raw, 10);
  if (!raw || isNaN(year)) return { valid: false, error: 'Please enter a year.' };
  if (year < YEAR_MIN) return { valid: false, error: `Data starts from ${YEAR_MIN}.` };
  if (year > YEAR_MAX) return { valid: false, error: `Data available up to ${YEAR_MAX}.` };
  if (YEAR_GAPS.has(year)) return { valid: false, error: `Try ${year - 1} or ${year + 1} - we're missing data for ${year}.` };
  return { valid: true, year };
}

// ---------------------------------------------------------------------------
// FORM SUBMIT
// ---------------------------------------------------------------------------

$inputForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const { valid, year, error } = validateYear($yearInput.value.trim());
  if (!valid) {
    $yearError.textContent = error;
    $yearInput.focus();
    return;
  }
  $yearError.textContent = '';
  initiateReveal(year, selectedCountry.code);
});

$yearInput.addEventListener('input', () => {
  $yearError.textContent = '';
});

// ---------------------------------------------------------------------------
// REVEAL SEQUENCE
// ---------------------------------------------------------------------------

function initiateReveal(year, countryCode) {
  stopTypewriter();
  applyAccent(year);

  // 1. Collapse inputs
  $landing.classList.add('collapsing');

  setTimeout(() => {
    $landing.classList.add('hidden');

    // 2. Show overlay with giant year
    $revealYear.textContent = year;
    $revealSub.textContent = `The world in ${year}`;
    $revealOverlay.classList.add('active');

    // 3. After 900ms, start loading data + transition to infographic
    setTimeout(() => {
      loadAndRender(year, countryCode);
    }, 900);

  }, 200);
}

// ---------------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------------

async function loadAndRender(year, countryCode) {
  const url = `/born-in/data/${year}.json`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('not_found');
    const data = await resp.json();
    renderInfograpic(year, countryCode, data);
    updateURL(year, countryCode);
  } catch (err) {
    $revealOverlay.classList.remove('active');
    $dataError.classList.remove('hidden');
    $errorMessage.textContent = err.message === 'not_found'
      ? `We don't have data for ${year} yet. Try a year between 1950 and 2010.`
      : `Something went wrong loading ${year}. Try again?`;
  }
}

// ---------------------------------------------------------------------------
// RENDER INFOGRAPHIC
// ---------------------------------------------------------------------------

function renderInfograpic(year, countryCode, data) {
  const country = COUNTRY_MAP[countryCode] || COUNTRIES[0];

  // Populate header
  $headerYear.textContent = year;
  $headerCountry.innerHTML = `<span class="flag">${country.flag}</span><span class="country-name-full">&nbsp;${country.name}</span>`;

  // Build all acts
  $infoContent.innerHTML = [
    renderActI(year, countryCode, data),
    renderActII(year, data),
    renderActIII(year, countryCode, data),
    renderActIV(data),
    renderActV(year, countryCode, data),
  ].join('');

  // Transition: shrink overlay, show infographic
  $revealOverlay.style.transition = 'opacity 400ms ease-in';

  setTimeout(() => {
    $revealOverlay.classList.remove('active');
    $infographic.classList.remove('hidden');
    window.scrollTo(0, 0);

    setTimeout(() => {
      $revealOverlay.style.transition = '';
      initRevealObserver();
      initCountUpObserver();
    }, 100);
  }, 200);
}

// ---------------------------------------------------------------------------
// ACT I — THE WORLD STAGE
// ---------------------------------------------------------------------------

function renderActI(year, countryCode, data) {
  const pop = data.world?.population_billions;
  const popDiff = pop ? (TODAY.population_billions - pop).toFixed(1) : null;

  const leaderInfo = LEADER_KEYS[countryCode] || LEADER_KEYS.US;
  const countryLeader = data.leaders?.[leaderInfo.key] || 'Unknown';
  const usPresident  = data.leaders?.us_president || 'Unknown';
  const unSec        = data.leaders?.un_secretary || 'Unknown';
  const ukPm         = data.leaders?.uk_pm || 'Unknown';
  const country      = COUNTRY_MAP[countryCode];

  // When US is selected, the country leader IS the US president — show UK PM instead to avoid duplicate
  const secondStat = countryCode === 'US'
    ? { label: 'UK Prime Minister', value: ukPm, sub: 'Prime Minister' }
    : { label: 'US President', value: usPresident, sub: 'President' };

  const events = (data.world_events || []).slice(0, 5);

  return `
    <div class="act" id="act-1">
      <p class="act-label">Act I</p>
      <div class="act-sections">

        ${patternA({
          eyebrow: 'World Population',
          headline: 'How many people shared the planet',
          number: pop ? pop.toFixed(1) : '—',
          unit: 'billion people',
          context: popDiff ? `The world has grown by ${popDiff} billion since then.` : '',
          comparison: `Today: ${TODAY.population_billions}B`,
          countUp: pop,
          countUpDecimals: 1,
        })}

        ${patternF({
          eyebrow: 'World Leaders',
          headline: 'Who held the reins',
          stats: [
            {
              label: `${country.name} ${leaderInfo.title}`,
              value: countryLeader,
              sub: leaderInfo.title,
            },
            secondStat,
            {
              label: 'UN Secretary-General',
              value: unSec,
              sub: 'United Nations',
            },
          ],
        })}

        ${patternD({
          eyebrow: 'World Events',
          headline: `Defining moments of ${year}`,
          items: events.map(e => ({
            month: formatMonth(e.month),
            event: e.event,
          })),
        })}

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// ACT II — THE ECONOMY
// ---------------------------------------------------------------------------

function renderActII(year, data) {
  const income      = data.economy?.us_median_household_income_usd;
  const homePrice   = data.prices_us?.median_home_usd;
  const ratioThen   = (income && homePrice) ? (homePrice / income).toFixed(1) : null;
  const ratioToday  = TODAY.home_salary_ratio;

  // Inflation-adjusted salary (CPI-U, base 2024)
  const cpiMult     = CPI_TO_2024[year] || 1;
  const incomeAdj   = income ? Math.round(income * cpiMult) : null;
  const incomeAdjK  = incomeAdj ? Math.round(incomeAdj / 1000) : null;
  const todayK      = Math.round(TODAY.us_median_income / 1000);

  // Verdict: how does adjusted ${year} salary compare to today?
  let verdictDesc = `Current US median household income`;
  if (incomeAdj) {
    const diff = incomeAdj - TODAY.us_median_income;
    const pct  = Math.abs(Math.round((diff / TODAY.us_median_income) * 100));
    verdictDesc = diff > 0
      ? `${pct}% more purchasing power than today's median`
      : `${pct}% less purchasing power than today's median`;
  }

  const prices = [
    { emoji: '⛽', label: 'Gallon of gas',   value: data.prices_us?.gallon_gas_usd },
    { emoji: '🥛', label: 'Gallon of milk',  value: data.prices_us?.gallon_milk_usd },
    { emoji: '🥚', label: 'Dozen eggs',      value: data.prices_us?.dozen_eggs_usd },
    { emoji: '🍞', label: 'Loaf of bread',   value: data.prices_us?.loaf_bread_usd },
    { emoji: '🎬', label: 'Movie ticket',    value: data.prices_us?.movie_ticket_usd },
    { emoji: '🍔', label: 'Big Mac',         value: data.prices_us?.big_mac_usd },
  ].filter(p => p.value != null);

  return `
    <div class="act" id="act-2">
      <p class="act-label">Act II</p>
      <div class="act-sections">

        ${patternA({
          eyebrow: 'Average Annual Salary',
          headline: 'What workers took home',
          number: income ? formatCurrency(income) : '—',
          unit: 'US median household income',
          context: incomeAdj ? `Adjusted for inflation, that's worth about $${incomeAdjK.toLocaleString()}k in today's dollars.` : '',
          comparison: `Today: $${todayK}k`,
          countUp: income,
          countUpPrefix: '$',
          countUpAbbrev: true,
        })}

        ${incomeAdj ? patternB({
          eyebrow: 'Purchasing Power',
          headline: 'Are we actually better off today?',
          left: {
            label: `${year} in today's $`,
            value: `$${incomeAdjK.toLocaleString()}k`,
            desc: `What $${Math.round(income / 1000)}k in ${year} is worth right now`,
          },
          right: {
            label: 'Today',
            labelMuted: true,
            value: `$${todayK}k`,
            desc: verdictDesc,
          },
        }) : ''}

        ${patternE({
          eyebrow: 'Everyday Prices',
          headline: 'What things cost in the US',
          prices,
        })}

        ${patternB({
          eyebrow: 'Housing',
          headline: 'Homes vs. salaries - then and now',
          left: {
            label: String(year),
            value: ratioThen ? `${ratioThen}×` : '—',
            desc: ratioThen ? `Median home cost ${ratioThen}x the average annual salary` : 'Data unavailable',
          },
          right: {
            label: 'Today',
            labelMuted: true,
            value: `${ratioToday}×`,
            desc: `Median home now costs ${ratioToday}x the average annual salary`,
          },
        })}

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// ACT III — CULTURE
// ---------------------------------------------------------------------------

function renderActIII(year, countryCode, data) {
  const song       = data.culture?.music?.billboard_no1_song || 'Unknown';
  const artist     = data.culture?.music?.billboard_no1_artist || '';
  const ukSong     = data.culture?.music?.uk_no1_jan;
  const ukArtist   = data.culture?.music?.uk_no1_jan_artist || '';
  const grammyAlbum  = data.culture?.music?.grammy_album;
  const grammyArtist = data.culture?.music?.grammy_album_artist || '';

  const movie    = data.culture?.film?.oscar_best_picture || 'Unknown';
  const director = data.culture?.film?.oscar_best_director_name || '';
  const tvShow   = data.culture?.television?.most_watched_show || 'Unknown';
  const book     = data.culture?.books?.fiction_bestseller || 'Unknown';
  const bookAuthor = data.culture?.books?.fiction_bestseller_author || '';

  const premieres = (data.culture?.television?.notable_premieres || []).slice(0, 5);

  const sports = data.culture?.sports || {};
  const sportStats = [
    sports.fifa_world_cup    && { label: 'FIFA World Cup',  value: sports.fifa_world_cup, sub: 'Football' },
    sports.f1_champion       && { label: 'F1 Champion',     value: sports.f1_champion, sub: 'Formula One' },
    sports.super_bowl_winner && { label: 'Super Bowl',      value: sports.super_bowl_winner, sub: sports.super_bowl_score || 'Champion' },
    sports.nba_champion      && { label: 'NBA Champion',    value: sports.nba_champion, sub: 'Basketball' },
    sports.wimbledon_mens    && { label: "Wimbledon Men's", value: sports.wimbledon_mens, sub: 'Tennis' },
  ].filter(Boolean).slice(0, 3);

  // For GB users, show UK #1 instead of Billboard
  const songTitle  = (countryCode === 'GB' && ukSong) ? ukSong : song;
  const songArtist = (countryCode === 'GB' && ukSong) ? ukArtist : artist;
  const songLabel  = (countryCode === 'GB' && ukSong) ? 'UK Chart #1' : 'Billboard Year-End #1';

  return `
    <div class="act" id="act-3">
      <p class="act-label">Act III</p>
      <div class="act-sections">

        ${patternC({
          eyebrow: songLabel,
          title: songTitle,
          detail: songArtist,
        })}

        ${patternC({
          eyebrow: 'Oscar Best Picture',
          title: movie,
          detail: director ? `Directed by ${director}` : '',
        })}

        ${grammyAlbum ? patternC({
          eyebrow: 'Grammy Album of the Year',
          title: grammyAlbum,
          detail: grammyArtist,
        }) : ''}

        ${premieres.length > 0 ? `
          <div class="pattern-a" data-reveal>
            <p class="eyebrow">TV Premieres</p>
            <p class="section-headline">Shows born the same year as you</p>
            <div class="show-pills">
              ${premieres.map(s => `<span class="show-pill">${escHtml(s)}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${sportStats.length > 0 ? patternF({
          eyebrow: 'Sports',
          headline: 'Champions of the year',
          stats: sportStats,
        }) : ''}

        ${patternF({
          eyebrow: 'Screen & Page',
          headline: 'What everyone was watching and reading',
          stats: [
            { label: 'Most-Watched Show', value: tvShow,   sub: 'Television' },
            { label: 'Fiction Bestseller', value: book,     sub: bookAuthor || 'Fiction' },
            { label: 'Box Office #1',      value: data.culture?.film?.box_office_no1 || '—', sub: 'Film' },
          ],
        })}

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// ACT IV — TECHNOLOGY
// ---------------------------------------------------------------------------

function renderActIV(data) {
  const milestone = data.technology?.milestone || 'Technology was advancing rapidly.';
  const releases  = (data.technology?.notable_releases || []).slice(0, 4);

  return `
    <div class="act" id="act-4">
      <p class="act-label">Act IV</p>
      <div class="act-sections">

        <div class="pattern-a" data-reveal>
          <p class="eyebrow">Technology Milestone</p>
          <p class="section-headline">State of the machine</p>
          <p class="focal-context" style="font-size:17px; color: var(--text-primary); max-width:600px; line-height:1.6;">${escHtml(milestone)}</p>
        </div>

        ${patternD({
          eyebrow: 'Notable Tech Releases',
          headline: 'What launched that year',
          items: releases.map(r => ({
            month: r.month ? formatMonth(r.month) : '—',
            event: r.name || r,
          })),
        })}

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// ACT V — YOUR PLACE IN TIME
// ---------------------------------------------------------------------------

function renderActV(year, countryCode, data) {
  const countryData = data.countries?.[countryCode] || data.countries?.US || {};
  const country     = COUNTRY_MAP[countryCode] || COUNTRIES[0];
  const lifeExpThen = countryData.life_expectancy || data.world?.life_expectancy_global;
  const lifeExpTodayLocal = countryCode === 'US' ? TODAY.us_life_expectancy : TODAY.global_life_expectancy;
  const lifeLabel   = countryCode === 'US' ? 'US' : 'Global avg';

  const popMillions = countryData.population_millions;
  const gdpPerCap   = countryData.gdp_per_capita_usd;
  const worldBirths = data.world?.births_millions;

  const births   = (data.notable_births || []).slice(0, 5);
  const doublings  = Math.round((2024 - year) / 2);
  const multiplier = Math.pow(2, doublings).toLocaleString();

  const popFmt = !popMillions ? null
    : popMillions >= 1000 ? `${(popMillions / 1000).toFixed(1)}B`
    : `${Math.round(popMillions)}M`;

  const gdpFmt = !gdpPerCap ? null
    : gdpPerCap >= 10000 ? `$${Math.round(gdpPerCap / 1000)}k`
    : `$${Math.round(gdpPerCap).toLocaleString()}`;

  const countryStats = [
    popFmt      && { label: 'Population', value: popFmt, sub: `people in ${country.name}` },
    gdpFmt      && { label: 'GDP per Capita', value: gdpFmt, sub: 'per person per year' },
    worldBirths && { label: 'Your Birth Cohort', value: `${worldBirths}M`, sub: 'babies born worldwide that year' },
  ].filter(Boolean);

  return `
    <div class="act" id="act-5">
      <p class="act-label">Act V</p>
      <div class="act-sections">

        ${countryStats.length > 0 ? patternF({
          eyebrow: `${country.flag} ${country.name}`,
          headline: `Your country the year you arrived`,
          stats: countryStats,
        }) : ''}

        ${patternB({
          eyebrow: 'Life Expectancy',
          headline: 'Have we made progress?',
          left: {
            label: String(year),
            value: lifeExpThen ? `${lifeExpThen} yrs` : '—',
            desc: `${lifeLabel} life expectancy at birth`,
          },
          right: {
            label: 'Today',
            labelMuted: true,
            value: `${lifeExpTodayLocal} yrs`,
            desc: `${lifeLabel} life expectancy today`,
          },
        })}

        <div class="pattern-a" data-reveal>
          <p class="eyebrow">Notable Births</p>
          <p class="section-headline">Born the same year as you</p>
          <p class="notable-births-list">
            ${births.map((b, i) => {
              const sep = i < births.length - 1 ? '<span class="birth-sep">·</span>' : '';
              return `<span>${escHtml(b.name)}</span>${sep}`;
            }).join('')}
          </p>
        </div>

        ${patternA({
          eyebrow: 'Computing Power',
          headline: 'The machines have come a long way',
          number: multiplier,
          unit: 'times more powerful',
          context: `In your lifetime, computing power has multiplied by ${multiplier}× — roughly doubling every 2 years (Moore's Law).`,
          comparison: `${doublings} doublings since ${year}`,
          countUp: null,
        })}

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// VISUAL PATTERN RENDERERS
// ---------------------------------------------------------------------------

function patternA({ eyebrow, headline, number, unit, context, comparison, countUp, countUpDecimals = 0, countUpPrefix = '', countUpAbbrev = false }) {
  const numDisplay = (countUp != null)
    ? `<span class="focal-number count-up" data-target="${countUp}" data-decimals="${countUpDecimals}" data-prefix="${countUpPrefix}" data-abbrev="${countUpAbbrev}">0</span>`
    : `<span class="focal-number">${escHtml(String(number))}</span>`;

  return `
    <div class="pattern-a" data-reveal>
      ${eyebrow ? `<p class="eyebrow">${escHtml(eyebrow)}</p>` : ''}
      ${headline ? `<p class="section-headline">${escHtml(headline)}</p>` : ''}
      ${numDisplay}
      ${unit   ? `<span class="focal-unit">${escHtml(unit)}</span>` : ''}
      ${context ? `<p class="focal-context">${escHtml(context)}</p>` : ''}
      ${comparison ? `<span class="comparison-pill">${escHtml(comparison)}</span>` : ''}
    </div>
  `;
}

function patternB({ eyebrow, headline, left, right }) {
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

function patternE({ eyebrow, headline, prices }) {
  const pillsHtml = prices.map(p => `
    <div class="price-pill">
      <span class="price-pill-emoji">${p.emoji}</span>
      <span class="price-pill-value">$${formatPriceValue(p.value)}</span>
      <span class="price-pill-label">${escHtml(p.label)}</span>
    </div>
  `).join('');

  return `
    <div class="pattern-e" data-reveal>
      ${eyebrow  ? `<p class="eyebrow">${escHtml(eyebrow)}</p>` : ''}
      ${headline ? `<p class="section-headline">${escHtml(headline)}</p>` : ''}
      <div class="price-grid">${pillsHtml}</div>
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
// INTERSECTION OBSERVER — REVEAL
// ---------------------------------------------------------------------------

function initRevealObserver() {
  if (observer) observer.disconnect();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    return;
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

// ---------------------------------------------------------------------------
// COUNT-UP ANIMATION
// ---------------------------------------------------------------------------

function initCountUpObserver() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const countUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      countUpObserver.unobserve(el);

      const target   = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const prefix   = el.dataset.prefix || '';
      const abbrev   = el.dataset.abbrev === 'true';
      const duration = 1200;

      if (prefersReduced || isNaN(target)) {
        el.textContent = prefix + formatCountValue(target, decimals, abbrev);
        return;
      }

      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = prefix + formatCountValue(current, decimals, abbrev);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.count-up').forEach(el => countUpObserver.observe(el));
}

// ---------------------------------------------------------------------------
// SHARE / NEW YEAR
// ---------------------------------------------------------------------------

$shareBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  $sharePopover.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!$shareBtn.contains(e.target) && !$sharePopover.contains(e.target)) {
    $sharePopover.classList.add('hidden');
  }
});

$copyLinkBtn.addEventListener('click', () => {
  const url = buildShareURL();
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link copied!');
    $sharePopover.classList.add('hidden');
  }).catch(() => {
    prompt('Copy this link:', url);
  });
});

$tweetBtn.addEventListener('click', () => {
  const params = getURLParams();
  if (!params) return;
  const text = `The world the year I was born — ${params.year}. pivode.github.io/born-in?year=${params.year}&country=${params.country}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  $sharePopover.classList.add('hidden');
});

$newYearBtn.addEventListener('click', () => resetToLanding());

$errorBackBtn.addEventListener('click', () => resetToLanding());

function resetToLanding() {
  // Disconnect any active observer
  if (observer) { observer.disconnect(); observer = null; }

  // Hide infographic, error state
  $infographic.classList.add('hidden');
  $dataError.classList.add('hidden');
  $sharePopover.classList.add('hidden');

  // Clear infographic content to free memory
  $infoContent.innerHTML = '';

  // Reset reveal overlay
  $revealOverlay.classList.remove('active');
  $revealOverlay.style.transition = '';

  // Reset accent
  document.documentElement.style.setProperty('--accent', '#a78bfa');

  // Show landing
  $landing.classList.remove('hidden', 'collapsing');

  // Reset form
  $yearInput.value = '';
  $yearError.textContent = '';
  selectedCountry = COUNTRIES[0];
  updateCountryDisplay();

  // Reset scroll
  window.scrollTo(0, 0);

  // Restart typewriter
  typewriterIndex = 0;
  $typewriter.textContent = TYPEWRITER_PHRASES[0];
  $typewriter.classList.remove('fading');
  startTypewriter();

  // Clear URL params
  history.pushState({}, '', '/born-in');
}

// ---------------------------------------------------------------------------
// URL PARAMS
// ---------------------------------------------------------------------------

function updateURL(year, countryCode) {
  history.pushState({ year, country: countryCode }, '', `/born-in?year=${year}&country=${countryCode}`);
}

function buildShareURL() {
  const params = getURLParams();
  if (!params) return 'https://pivode.github.io/born-in';
  return `https://pivode.github.io/born-in?year=${params.year}&country=${params.country}`;
}

function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  const year    = parseInt(params.get('year'), 10);
  const country = params.get('country') || 'US';
  if (!isNaN(year) && year >= YEAR_MIN && year <= YEAR_MAX && !YEAR_GAPS.has(year)) {
    return { year, country };
  }
  return null;
}

function checkURLOnLoad() {
  const params = getURLParams();
  if (!params) return;

  const country = COUNTRY_MAP[params.country] || COUNTRIES[0];
  selectedCountry = country;
  updateCountryDisplay();
  $yearInput.value = params.year;

  // Skip reveal sequence for direct URL loads
  applyAccent(params.year);
  stopTypewriter();
  $landing.classList.add('hidden');

  // Show loading state while fetching
  $infographic.classList.remove('hidden');
  $infoContent.innerHTML = `<div class="loading-state"><div class="loading-spinner"></div></div>`;
  $headerYear.textContent = params.year;
  $headerCountry.innerHTML = `<span class="flag">${country.flag}</span><span class="country-name-full">&nbsp;${country.name}</span>`;

  loadAndRender(params.year, country.code);
}

// ---------------------------------------------------------------------------
// TOAST
// ---------------------------------------------------------------------------

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

function formatMonth(raw) {
  if (!raw) return '—';
  // Accept numeric 1-12 or string month names
  const n = parseInt(raw, 10);
  if (!isNaN(n) && n >= 1 && n <= 12) return MONTH_ABBR[n - 1];
  // Truncate string month names to 3 chars
  return String(raw).slice(0, 3);
}

function formatCurrency(n) {
  if (n >= 1000) {
    return '$' + Math.round(n / 1000).toLocaleString() + 'k';
  }
  return '$' + Math.round(n).toLocaleString();
}

function formatPriceValue(n) {
  if (n == null) return '—';
  const num = parseFloat(n);
  if (isNaN(num)) return '—';
  return num < 10 ? num.toFixed(2) : Math.round(num).toLocaleString();
}

function formatCountValue(n, decimals, abbrev) {
  if (abbrev) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(1) + 'k';
  }
  return decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString();
}

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------

function init() {
  renderCountryList();
  startTypewriter();
  checkURLOnLoad();
}

document.addEventListener('DOMContentLoaded', init);
