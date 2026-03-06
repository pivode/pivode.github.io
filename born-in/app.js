/* =========================================================
   THE WORLD WHEN YOU WERE BORN - app.js
   ========================================================= */

'use strict';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const YEAR_MIN = 1950;
const YEAR_MAX = 2010;
// Years with no data (gaps): 1951, 1953
const YEAR_GAPS = new Set([1951, 1953]);

// Feature 1 + 6: Temporal shock anchors
const TEMPORAL_ANCHORS = [
  { year: 1903, label: 'the Wright Brothers\' first flight' },
  { year: 1914, label: 'the start of World War I' },
  { year: 1929, label: 'the Great Depression' },
  { year: 1945, label: 'the end of World War II' },
  { year: 1955, label: 'Rosa Parks refusing to give up her seat' },
  { year: 1963, label: 'the assassination of JFK' },
  { year: 1969, label: 'the moon landing' },
  { year: 1989, label: 'the fall of the Berlin Wall' },
  { year: 1991, label: 'the dissolution of the Soviet Union' },
  { year: 1994, label: 'Nelson Mandela becoming South Africa\'s president' },
  { year: 2001, label: '9/11' },
  { year: 2007, label: 'the launch of the iPhone' },
];
const CURRENT_YEAR = 2026;

// Feature 4: Social media launch timeline
const SOCIAL_MEDIA_TIMELINE = [
  { name: 'Facebook',  year: 2004 },
  { name: 'YouTube',   year: 2005 },
  { name: 'Twitter',   year: 2006 },
  { name: 'iPhone',    year: 2007 },
  { name: 'Instagram', year: 2010 },
  { name: 'Snapchat',  year: 2011 },
  { name: 'TikTok',    year: 2016 },
];

// Feature 2: Top baby names (SSA data for US, ONS data for UK)
const BABY_NAMES_US = {
  1950: { boys: ['James','Robert','John'],          girls: ['Linda','Mary','Patricia'] },
  1952: { boys: ['James','Robert','John'],          girls: ['Linda','Mary','Patricia'] },
  1954: { boys: ['Michael','Robert','James'],       girls: ['Mary','Linda','Patricia'] },
  1955: { boys: ['Michael','David','James'],        girls: ['Mary','Linda','Patricia'] },
  1956: { boys: ['Michael','David','James'],        girls: ['Mary','Linda','Patricia'] },
  1957: { boys: ['Michael','David','Robert'],       girls: ['Mary','Linda','Patricia'] },
  1958: { boys: ['Michael','David','Robert'],       girls: ['Mary','Linda','Patricia'] },
  1959: { boys: ['Michael','David','Robert'],       girls: ['Mary','Linda','Susan'] },
  1960: { boys: ['David','Michael','James'],        girls: ['Mary','Susan','Linda'] },
  1961: { boys: ['Michael','David','James'],        girls: ['Mary','Susan','Lisa'] },
  1962: { boys: ['Michael','David','James'],        girls: ['Lisa','Mary','Susan'] },
  1963: { boys: ['Michael','David','James'],        girls: ['Lisa','Mary','Karen'] },
  1964: { boys: ['Michael','David','James'],        girls: ['Lisa','Mary','Karen'] },
  1965: { boys: ['Michael','David','James'],        girls: ['Lisa','Sandra','Mary'] },
  1966: { boys: ['Michael','David','James'],        girls: ['Lisa','Kimberly','Karen'] },
  1967: { boys: ['Michael','David','James'],        girls: ['Lisa','Kimberly','Karen'] },
  1968: { boys: ['Michael','David','James'],        girls: ['Lisa','Michelle','Kimberly'] },
  1969: { boys: ['Michael','David','James'],        girls: ['Lisa','Michelle','Jennifer'] },
  1970: { boys: ['Michael','James','David'],        girls: ['Jennifer','Lisa','Kimberly'] },
  1971: { boys: ['Michael','James','David'],        girls: ['Jennifer','Lisa','Kimberly'] },
  1972: { boys: ['Michael','Christopher','James'],  girls: ['Jennifer','Lisa','Kimberly'] },
  1973: { boys: ['Michael','Christopher','Jason'],  girls: ['Jennifer','Amy','Melissa'] },
  1974: { boys: ['Michael','Jason','Christopher'],  girls: ['Jennifer','Amy','Michelle'] },
  1975: { boys: ['Michael','Jason','Christopher'],  girls: ['Jennifer','Amy','Heather'] },
  1976: { boys: ['Michael','Jason','Christopher'],  girls: ['Jennifer','Amy','Melissa'] },
  1977: { boys: ['Michael','Jason','Christopher'],  girls: ['Jennifer','Melissa','Amy'] },
  1978: { boys: ['Michael','Jason','Christopher'],  girls: ['Jennifer','Melissa','Jessica'] },
  1979: { boys: ['Michael','Christopher','Jason'],  girls: ['Jennifer','Jessica','Melissa'] },
  1980: { boys: ['Michael','Christopher','Jason'],  girls: ['Jennifer','Jessica','Amanda'] },
  1981: { boys: ['Michael','Christopher','Jason'],  girls: ['Jennifer','Jessica','Amanda'] },
  1982: { boys: ['Michael','Christopher','Matthew'],girls: ['Jennifer','Jessica','Amanda'] },
  1983: { boys: ['Michael','Christopher','Matthew'],girls: ['Jennifer','Jessica','Amanda'] },
  1984: { boys: ['Michael','Christopher','Matthew'],girls: ['Jennifer','Ashley','Jessica'] },
  1985: { boys: ['Michael','Christopher','Matthew'],girls: ['Jessica','Jennifer','Ashley'] },
  1986: { boys: ['Michael','Christopher','Matthew'],girls: ['Jessica','Ashley','Amanda'] },
  1987: { boys: ['Michael','Christopher','Matthew'],girls: ['Jessica','Ashley','Amanda'] },
  1988: { boys: ['Michael','Christopher','Matthew'],girls: ['Jessica','Ashley','Amanda'] },
  1989: { boys: ['Michael','Christopher','Matthew'],girls: ['Jessica','Ashley','Brittany'] },
  1990: { boys: ['Michael','Christopher','Matthew'],girls: ['Jessica','Ashley','Brittany'] },
  1991: { boys: ['Michael','Christopher','Joshua'], girls: ['Ashley','Jessica','Brittany'] },
  1992: { boys: ['Michael','Christopher','Joshua'], girls: ['Ashley','Jessica','Amanda'] },
  1993: { boys: ['Michael','Christopher','Matthew'],girls: ['Jessica','Ashley','Sarah'] },
  1994: { boys: ['Michael','Joshua','Christopher'], girls: ['Jessica','Ashley','Emily'] },
  1995: { boys: ['Michael','Matthew','Tyler'],      girls: ['Jessica','Ashley','Emily'] },
  1996: { boys: ['Michael','Matthew','Tyler'],      girls: ['Emily','Jessica','Ashley'] },
  1997: { boys: ['Michael','Tyler','Matthew'],      girls: ['Emily','Jessica','Sarah'] },
  1998: { boys: ['Michael','Jacob','Matthew'],      girls: ['Emily','Hannah','Alexis'] },
  1999: { boys: ['Jacob','Michael','Matthew'],      girls: ['Emily','Sarah','Hannah'] },
  2000: { boys: ['Jacob','Michael','Matthew'],      girls: ['Emily','Hannah','Madison'] },
  2001: { boys: ['Jacob','Michael','Matthew'],      girls: ['Emily','Madison','Hannah'] },
  2002: { boys: ['Jacob','Michael','Joshua'],       girls: ['Emily','Madison','Hannah'] },
  2003: { boys: ['Jacob','Ethan','Joshua'],         girls: ['Emily','Emma','Madison'] },
  2004: { boys: ['Jacob','Joshua','Ethan'],         girls: ['Emily','Emma','Madison'] },
  2005: { boys: ['Jacob','Michael','Joshua'],       girls: ['Emily','Emma','Madison'] },
  2006: { boys: ['Jacob','Michael','Joshua'],       girls: ['Emily','Emma','Madison'] },
  2007: { boys: ['Jacob','Michael','Ethan'],        girls: ['Emily','Isabella','Emma'] },
  2008: { boys: ['Jacob','Michael','Ethan'],        girls: ['Emma','Isabella','Emily'] },
  2009: { boys: ['Jacob','Ethan','Michael'],        girls: ['Isabella','Emma','Olivia'] },
  2010: { boys: ['Jacob','Ethan','Michael'],        girls: ['Isabella','Sophia','Emma'] },
};

const BABY_NAMES_UK = {
  1950: { boys: ['John','David','Peter'],            girls: ['Susan','Linda','Christine'] },
  1952: { boys: ['David','John','Peter'],            girls: ['Susan','Linda','Christine'] },
  1954: { boys: ['David','John','Peter'],            girls: ['Susan','Linda','Mary'] },
  1955: { boys: ['David','John','Peter'],            girls: ['Susan','Janet','Mary'] },
  1956: { boys: ['David','John','Peter'],            girls: ['Susan','Janet','Mary'] },
  1957: { boys: ['David','John','Peter'],            girls: ['Susan','Janet','Christine'] },
  1958: { boys: ['David','John','Peter'],            girls: ['Susan','Christine','Margaret'] },
  1959: { boys: ['David','John','Stephen'],          girls: ['Susan','Christine','Margaret'] },
  1960: { boys: ['David','John','Stephen'],          girls: ['Susan','Christine','Margaret'] },
  1961: { boys: ['David','John','Stephen'],          girls: ['Susan','Christine','Margaret'] },
  1962: { boys: ['David','John','Stephen'],          girls: ['Susan','Julie','Karen'] },
  1963: { boys: ['David','John','Paul'],             girls: ['Susan','Julie','Karen'] },
  1964: { boys: ['David','John','Paul'],             girls: ['Susan','Julie','Karen'] },
  1965: { boys: ['Stephen','Mark','Paul'],           girls: ['Susan','Julie','Karen'] },
  1966: { boys: ['Mark','Paul','Andrew'],            girls: ['Susan','Julie','Tracy'] },
  1967: { boys: ['Mark','Paul','Andrew'],            girls: ['Tracy','Susan','Karen'] },
  1968: { boys: ['Paul','Mark','Andrew'],            girls: ['Tracy','Karen','Julie'] },
  1969: { boys: ['Paul','Mark','Andrew'],            girls: ['Tracy','Karen','Susan'] },
  1970: { boys: ['Paul','Mark','Andrew'],            girls: ['Tracy','Karen','Helen'] },
  1971: { boys: ['Mark','Paul','Andrew'],            girls: ['Tracy','Joanne','Sharon'] },
  1972: { boys: ['Mark','Paul','Andrew'],            girls: ['Claire','Tracey','Joanne'] },
  1973: { boys: ['Mark','Paul','Andrew'],            girls: ['Claire','Sarah','Nicola'] },
  1974: { boys: ['Paul','Mark','Andrew'],            girls: ['Sarah','Claire','Nicola'] },
  1975: { boys: ['Stephen','Mark','Paul'],           girls: ['Sarah','Claire','Nicola'] },
  1976: { boys: ['Daniel','Christopher','Matthew'],  girls: ['Sarah','Claire','Nicola'] },
  1977: { boys: ['Daniel','Christopher','Matthew'],  girls: ['Sarah','Claire','Nicola'] },
  1978: { boys: ['Christopher','Daniel','Andrew'],   girls: ['Sarah','Claire','Emma'] },
  1979: { boys: ['Christopher','Daniel','James'],    girls: ['Sarah','Claire','Emma'] },
  1980: { boys: ['Christopher','James','David'],     girls: ['Sarah','Claire','Emma'] },
  1981: { boys: ['Christopher','James','David'],     girls: ['Sarah','Emma','Claire'] },
  1982: { boys: ['Christopher','James','Matthew'],   girls: ['Sarah','Emma','Claire'] },
  1983: { boys: ['Christopher','James','Matthew'],   girls: ['Sarah','Emma','Gemma'] },
  1984: { boys: ['Christopher','James','Andrew'],    girls: ['Sarah','Emma','Laura'] },
  1985: { boys: ['Christopher','James','David'],     girls: ['Sarah','Emma','Laura'] },
  1986: { boys: ['Daniel','Christopher','James'],    girls: ['Sarah','Rebecca','Emma'] },
  1987: { boys: ['Daniel','Christopher','James'],    girls: ['Rebecca','Sarah','Emma'] },
  1988: { boys: ['Daniel','Christopher','James'],    girls: ['Rebecca','Sarah','Lauren'] },
  1989: { boys: ['Daniel','Christopher','James'],    girls: ['Rebecca','Sarah','Lauren'] },
  1990: { boys: ['Daniel','Christopher','Michael'],  girls: ['Rebecca','Lauren','Charlotte'] },
  1991: { boys: ['Daniel','Thomas','Matthew'],       girls: ['Rebecca','Lauren','Amy'] },
  1992: { boys: ['Daniel','Thomas','Matthew'],       girls: ['Rebecca','Lauren','Amy'] },
  1993: { boys: ['Thomas','Daniel','Matthew'],       girls: ['Rebecca','Lauren','Amy'] },
  1994: { boys: ['Thomas','Daniel','Matthew'],       girls: ['Rebecca','Lauren','Sophie'] },
  1995: { boys: ['Thomas','James','Jack'],           girls: ['Rebecca','Lauren','Charlotte'] },
  1996: { boys: ['Jack','Thomas','James'],           girls: ['Sophie','Charlotte','Emily'] },
  1997: { boys: ['Jack','Thomas','James'],           girls: ['Emily','Charlotte','Sophie'] },
  1998: { boys: ['Jack','Thomas','James'],           girls: ['Emily','Charlotte','Chloe'] },
  1999: { boys: ['Jack','Thomas','James'],           girls: ['Emily','Chloe','Megan'] },
  2000: { boys: ['Jack','Thomas','Joshua'],          girls: ['Emily','Chloe','Megan'] },
  2001: { boys: ['Jack','Thomas','Joshua'],          girls: ['Emily','Chloe','Jessica'] },
  2002: { boys: ['Jack','Joshua','Thomas'],          girls: ['Emily','Ellie','Chloe'] },
  2003: { boys: ['Jack','Joshua','Thomas'],          girls: ['Emily','Ellie','Chloe'] },
  2004: { boys: ['Jack','Joshua','Thomas'],          girls: ['Emily','Ellie','Jessica'] },
  2005: { boys: ['Jack','Joshua','Thomas'],          girls: ['Emily','Ellie','Jessica'] },
  2006: { boys: ['Jack','Joshua','Thomas'],          girls: ['Olivia','Grace','Emily'] },
  2007: { boys: ['Jack','Oliver','Thomas'],          girls: ['Grace','Olivia','Jessica'] },
  2008: { boys: ['Jack','Oliver','Thomas'],          girls: ['Grace','Olivia','Ruby'] },
  2009: { boys: ['Oliver','Jack','Thomas'],          girls: ['Olivia','Ruby','Emily'] },
  2010: { boys: ['Oliver','Jack','Harry'],           girls: ['Olivia','Sophie','Emily'] },
};

// Feature 4: CO2 concentration (Keeling Curve / Mauna Loa, ppm annual mean)
// 1950-1957: ice core estimates; 1958+: direct NOAA measurements
const CO2_PPM = {
  1950: 310.5, 1952: 311.0, 1954: 312.0, 1955: 312.5, 1956: 313.0, 1957: 313.5,
  1958: 315.3,  1959: 315.97, 1960: 316.91, 1961: 317.64, 1962: 318.45, 1963: 318.99,
  1964: 319.62, 1965: 320.04, 1966: 321.38, 1967: 322.16, 1968: 323.04, 1969: 324.62,
  1970: 325.68, 1971: 326.32, 1972: 327.46, 1973: 329.68, 1974: 330.19, 1975: 331.12,
  1976: 332.03, 1977: 333.84, 1978: 335.41, 1979: 336.84, 1980: 338.75, 1981: 340.11,
  1982: 341.45, 1983: 343.15, 1984: 344.97, 1985: 346.12, 1986: 347.42, 1987: 349.19,
  1988: 351.57, 1989: 353.12, 1990: 354.39, 1991: 355.59, 1992: 356.38, 1993: 357.07,
  1994: 358.83, 1995: 360.82, 1996: 362.61, 1997: 363.73, 1998: 366.70, 1999: 368.38,
  2000: 369.55, 2001: 371.14, 2002: 373.28, 2003: 375.80, 2004: 377.52, 2005: 379.80,
  2006: 381.90, 2007: 383.79, 2008: 385.60, 2009: 387.43, 2010: 389.90,
};
const CO2_TODAY = 422.5; // 2024 NOAA annual average

// Feature 3: Confirmed exoplanets (NASA Exoplanet Archive, cumulative by year-end)
const EXOPLANETS_BY_YEAR = {
  1950: 0, 1952: 0, 1954: 0, 1955: 0, 1956: 0, 1957: 0, 1958: 0, 1959: 0,
  1960: 0, 1961: 0, 1962: 0, 1963: 0, 1964: 0, 1965: 0, 1966: 0, 1967: 0,
  1968: 0, 1969: 0, 1970: 0, 1971: 0, 1972: 0, 1973: 0, 1974: 0, 1975: 0,
  1976: 0, 1977: 0, 1978: 0, 1979: 0, 1980: 0, 1981: 0, 1982: 0, 1983: 0,
  1984: 0, 1985: 0, 1986: 0, 1987: 0, 1988: 0, 1989: 0, 1990: 0, 1991: 0,
  1992: 2,   1993: 3,   1994: 4,   1995: 8,   1996: 17,  1997: 22,  1998: 37,  1999: 53,
  2000: 85,  2001: 109, 2002: 134, 2003: 147, 2004: 156, 2005: 176,
  2006: 205, 2007: 236, 2008: 292, 2009: 374, 2010: 519,
};
const EXOPLANETS_TODAY = 5800;

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
  { code: 'RU', name: 'Russia',         flag: '🇷🇺' },
  { code: 'MX', name: 'Mexico',         flag: '🇲🇽' },
  { code: 'KR', name: 'South Korea',    flag: '🇰🇷' },
  { code: 'IE', name: 'Ireland',        flag: '🇮🇪' },
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
  // Current US prices (2024 averages, BLS/USDA/industry sources)
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
const $nameInput        = document.getElementById('name-input');
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
// DECADE THEME
// Applies a subtle era-appropriate CSS class to body that overrides mood
// variables (bg tints, border color, accent, border-radius character).
// The accent set here is the CSS-variable fallback; applyAccent() sets the
// inline style which takes precedence during the reveal overlay phase, so
// both are aligned to the same decade color.
// ---------------------------------------------------------------------------

const ERA_CLASSES = ['era-50s', 'era-60s', 'era-70s', 'era-80s', 'era-90s', 'era-00s'];

function applyDecadeTheme(year) {
  // Remove any previously applied era class
  document.body.classList.remove(...ERA_CLASSES);

  const decade = Math.floor(year / 10) * 10;
  switch (decade) {
    case 1950: document.body.classList.add('era-50s'); break;
    case 1960: document.body.classList.add('era-60s'); break;
    case 1970: document.body.classList.add('era-70s'); break;
    case 1980: document.body.classList.add('era-80s'); break;
    case 1990: document.body.classList.add('era-90s'); break;
    case 2000: document.body.classList.add('era-00s'); break;
    default:   break; // 2010+ keeps base theme
  }
}

// ---------------------------------------------------------------------------
// NAME - localStorage persistence
// ---------------------------------------------------------------------------

function getUserName() {
  return ($nameInput?.value?.trim()) || null;
}

let _nameDebounceTimer = null;

function initNameField() {
  const saved = localStorage.getItem('born_in_name');
  if (saved && $nameInput) {
    $nameInput.value = saved;
  }

  if ($nameInput) {
    $nameInput.addEventListener('input', () => {
      clearTimeout(_nameDebounceTimer);
      _nameDebounceTimer = setTimeout(() => {
        const val = $nameInput.value.trim();
        if (val) {
          localStorage.setItem('born_in_name', val);
        } else {
          localStorage.removeItem('born_in_name');
        }
      }, 300);
    });
  }
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
  const name = getUserName();

  // Populate header - personalise with name if provided
  if (name) {
    $headerYear.textContent = `The World When ${name} Was Born`;
  } else {
    $headerYear.textContent = year;
  }
  $headerCountry.innerHTML = `<span class="flag">${country.flag}</span><span class="country-name-full">&nbsp;${country.name}</span>`;

  // Build all acts
  $infoContent.innerHTML = [
    renderActI(year, countryCode, data),
    renderActII(year, countryCode, data),
    renderActIII(year, countryCode, data),
    renderActIV(year, data),
    renderActV(year, countryCode, data),
    renderOutro(year, countryCode, data),
  ].join('');

  // Apply era-mode aesthetics before infographic becomes visible
  applyDecadeTheme(year);

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
// ACT I - THE WORLD STAGE
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
  const name         = getUserName();

  // When US is selected, the country leader IS the US president - show UK PM instead to avoid duplicate
  const secondStat = countryCode === 'US'
    ? { label: 'UK Prime Minister', value: ukPm, sub: 'Prime Minister' }
    : { label: 'US President', value: usPresident, sub: 'President' };

  const events = (data.world_events || []).slice(0, 5);

  // Feature 4: CO2 at birth vs today
  const co2Then = CO2_PPM[year];
  const co2Card = co2Then ? patternB({
    eyebrow: 'Atmosphere',
    headline: 'CO\u2082 in the air you first breathed',
    left:  { label: String(year), value: `${co2Then} ppm`, desc: 'CO\u2082 concentration (Keeling Curve)' },
    right: { label: 'Today', labelMuted: true, value: `${CO2_TODAY} ppm`, desc: `+${(CO2_TODAY - co2Then).toFixed(1)} ppm since your birth` },
  }) : '';

  // Feature 2: Top baby names
  const nameData  = (countryCode === 'GB' ? BABY_NAMES_UK : BABY_NAMES_US)[year];
  const nameLabel = countryCode === 'GB' ? 'UK' : 'US';
  const namesCard = nameData ? `
    <div class="pattern-a" data-reveal>
      <p class="eyebrow">Baby Names</p>
      <p class="section-headline">Most popular names in ${year} (${nameLabel})</p>
      <div class="baby-names-grid">
        <div class="baby-names-group"><p class="baby-names-label">Boys</p><p class="baby-names-list">${nameData.boys.join(', ')}</p></div>
        <div class="baby-names-group"><p class="baby-names-label">Girls</p><p class="baby-names-list">${nameData.girls.join(', ')}</p></div>
      </div>
    </div>` : '';

  // Feature 3: 1-in-X cohort stat
  const birthsMil = data.world?.births_millions;
  const oneInX = birthsMil ? Math.round(8_200_000_000 / (birthsMil * 1_000_000)) : null;
  const cohortCallout = oneInX
    ? `<p class="birth-cohort-callout">1 in ${oneInX.toLocaleString()} people alive today was born in ${year}.</p>`
    : '';

  const popEyebrow = name ? `${name}'s birth year` : 'World Population';

  return `
    <div class="act" id="act-1">
      <p class="act-label">Act I</p>
      <div class="act-sections">

        <div>
          ${patternA({
            eyebrow: popEyebrow,
            headline: 'How many people shared the planet',
            number: pop ? pop.toFixed(1) : '-',
            unit: 'billion people',
            context: popDiff ? `The world has grown by ${popDiff} billion since then.` : '',
            comparison: `Today: ${TODAY.population_billions}B`,
            countUp: pop,
            countUpDecimals: 1,
          })}
          ${cohortCallout}
        </div>

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

        ${namesCard}

        ${co2Card}

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// ACT II - THE ECONOMY
// ---------------------------------------------------------------------------

function renderActII(year, countryCode, data) {
  const isUS        = countryCode === 'US';
  const country     = COUNTRY_MAP[countryCode] || COUNTRIES[0];
  const countryData = data.countries?.[countryCode];

  // US-specific data
  const income      = data.economy?.us_median_household_income_usd;
  const homePrice   = data.prices_us?.median_home_usd;
  const ratioThen   = (income && homePrice) ? (homePrice / income).toFixed(1) : null;
  const ratioToday  = TODAY.home_salary_ratio;

  // Inflation-adjusted salary (CPI-U, base 2024) - US only
  const cpiMult     = CPI_TO_2024[year] || 1;
  const incomeAdj   = income ? Math.round(income * cpiMult) : null;
  const incomeAdjK  = incomeAdj ? Math.round(incomeAdj / 1000) : null;
  const todayK      = Math.round(TODAY.us_median_income / 1000);

  let verdictDesc = `Current US median household income`;
  if (incomeAdj) {
    const diff = incomeAdj - TODAY.us_median_income;
    const pct  = Math.abs(Math.round((diff / TODAY.us_median_income) * 100));
    verdictDesc = diff > 0
      ? `${pct}% more purchasing power than today's median`
      : `${pct}% less purchasing power than today's median`;
  }

  const prices = [
    { emoji: '⛽', label: 'Gallon of gas',   value: data.prices_us?.gallon_gas_usd,   todayValue: TODAY.prices.gallon_gas_usd },
    { emoji: '🥛', label: 'Gallon of milk',  value: data.prices_us?.gallon_milk_usd,  todayValue: TODAY.prices.gallon_milk_usd },
    { emoji: '🥚', label: 'Dozen eggs',      value: data.prices_us?.dozen_eggs_usd,   todayValue: TODAY.prices.dozen_eggs_usd },
    { emoji: '🍞', label: 'Loaf of bread',   value: data.prices_us?.loaf_bread_usd,   todayValue: TODAY.prices.loaf_bread_usd },
    { emoji: '🎬', label: 'Movie ticket',    value: data.prices_us?.movie_ticket_usd, todayValue: TODAY.prices.movie_ticket_usd },
    { emoji: '🍔', label: 'Big Mac',         value: data.prices_us?.big_mac_usd,      todayValue: TODAY.prices.big_mac_usd },
  ].filter(p => p.value != null);

  // Country GDP per capita (for non-US)
  const countryGdp    = countryData?.gdp_per_capita_usd;
  const usGdp         = data.economy?.us_gdp_per_capita_usd;

  // Cross-country comparison card
  let gdpCompareCard = '';
  if (!isUS && countryGdp && usGdp) {
    const ratio = (countryGdp / usGdp * 100).toFixed(0);
    const compDesc = countryGdp < usGdp
      ? `${country.name} GDP per capita was ${(100 - ratio)}% below the US in ${year}`
      : `${country.name} GDP per capita was ${(ratio - 100)}% above the US in ${year}`;
    gdpCompareCard = patternB({
      eyebrow: 'Economic Comparison',
      headline: `${country.name} vs. the United States`,
      left: {
        label: `${country.flag} ${country.name}`,
        value: formatCurrency(countryGdp),
        desc: `GDP per capita in ${year}`,
      },
      right: {
        label: '🇺🇸 United States',
        labelMuted: true,
        value: formatCurrency(usGdp),
        desc: compDesc,
      },
    });
  }

  return `
    <div class="act" id="act-2">
      <p class="act-label">Act II</p>
      <div class="act-sections">

        ${isUS ? patternA({
          eyebrow: 'Average Annual Salary',
          headline: 'What workers took home',
          number: income ? formatCurrency(income) : '-',
          unit: 'US median household income',
          context: incomeAdj ? `Adjusted for inflation, that's worth about $${incomeAdjK.toLocaleString()}k in today's dollars.` : '',
          comparison: `Today: $${todayK}k`,
          countUp: income,
          countUpPrefix: '$',
          countUpAbbrev: true,
        }) : patternA({
          eyebrow: `${country.name} Economy`,
          headline: `What the economy looked like`,
          number: countryGdp ? formatCurrency(countryGdp) : '-',
          unit: `${country.name} GDP per capita`,
          context: `The US was at ${usGdp ? formatCurrency(usGdp) : '-'} the same year.`,
          countUp: countryGdp,
          countUpPrefix: '$',
          countUpAbbrev: true,
        })}

        ${isUS && incomeAdj ? patternB({
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

        ${!isUS ? gdpCompareCard : ''}

        ${patternE({
          eyebrow: isUS ? 'Everyday Prices' : 'Everyday Prices in the US',
          headline: isUS ? 'What things cost' : 'What things cost in America',
          prices,
        })}

        ${isUS ? patternB({
          eyebrow: 'Housing',
          headline: 'Homes vs. salaries - then and now',
          left: {
            label: String(year),
            value: ratioThen ? `${ratioThen}×` : '-',
            desc: ratioThen ? `Median home cost ${ratioThen}x the average annual salary` : 'Data unavailable',
          },
          right: {
            label: 'Today',
            labelMuted: true,
            value: `${ratioToday}×`,
            desc: `Median home now costs ${ratioToday}x the average annual salary`,
          },
        }) : ''}

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// ACT III - CULTURE
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
            { label: 'Box Office #1',      value: data.culture?.film?.box_office_no1 || '-', sub: 'Film' },
          ],
        })}

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// ACT IV - TECHNOLOGY
// ---------------------------------------------------------------------------

function renderActIV(year, data) {
  const milestone = data.technology?.milestone || 'Technology was advancing rapidly.';
  const releases  = (data.technology?.notable_releases || []).slice(0, 4);
  const exoThen   = EXOPLANETS_BY_YEAR[year] ?? 0;

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
            month: r.month ? formatMonth(r.month) : '-',
            event: r.name || r,
          })),
        })}

        ${socialMediaSection(year)}

        ${patternB({
          eyebrow: 'The Universe',
          headline: 'Worlds discovered beyond our solar system',
          left:  { label: String(year), value: exoThen > 0 ? String(exoThen) : 'None', desc: exoThen === 0 ? 'No exoplanets confirmed yet' : 'confirmed exoplanets' },
          right: { label: 'Today', labelMuted: true, value: `${EXOPLANETS_TODAY.toLocaleString()}+`, desc: 'confirmed and counting' },
        })}

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// ACT V - YOUR PLACE IN TIME
// ---------------------------------------------------------------------------

function renderActV(year, countryCode, data) {
  const countryData = data.countries?.[countryCode] || data.countries?.US || {};
  const country     = COUNTRY_MAP[countryCode] || COUNTRIES[0];
  const name        = getUserName();
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
          eyebrow: name ? `${name}'s ${country.flag} ${country.name}` : `${country.flag} ${country.name}`,
          headline: `Your country the year you arrived`,
          stats: countryStats,
        }) : ''}

        ${patternB({
          eyebrow: 'Life Expectancy',
          headline: 'Have we made progress?',
          left: {
            label: String(year),
            value: lifeExpThen ? `${lifeExpThen} yrs` : '-',
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
          context: `In your lifetime, computing power has multiplied by ${multiplier}× - roughly doubling every 2 years (Moore's Law).`,
          comparison: `${doublings} doublings since ${year}`,
          countUp: null,
        })}

        ${patternMilestones(year)}

        ${temporalShockLine(year) ? `<p class="temporal-shock">${escHtml(temporalShockLine(year))}</p>` : ''}

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// FEATURE 1 + 6: TEMPORAL SHOCK LINE
// ---------------------------------------------------------------------------

function temporalShockLine(year) {
  const yearsToToday = CURRENT_YEAR - year;
  let bestAnchor = null;
  let bestSurplus = -Infinity;

  for (const anchor of TEMPORAL_ANCHORS) {
    const distToAnchor = Math.abs(year - anchor.year);
    // Only qualify if birth year is closer to anchor than to today
    if (distToAnchor < yearsToToday) {
      const surplus = yearsToToday - distToAnchor;
      if (surplus > bestSurplus) {
        bestSurplus = surplus;
        bestAnchor = anchor;
      }
    }
  }

  if (!bestAnchor) return null;
  return `Your birth year is closer to ${bestAnchor.label} than to today.`;
}

// ---------------------------------------------------------------------------
// FEATURE 2: MILESTONE AGE CALCULATOR
// ---------------------------------------------------------------------------

function patternMilestones(year) {
  const milestones = [
    { age: 18,  label: '18' },
    { age: 40,  label: '40' },
    { age: 65,  label: '65' },
    { age: 100, label: '100' },
  ];

  const future = milestones.filter(m => (year + m.age) >= CURRENT_YEAR);

  if (future.length === 0) return '';

  const parts = future.map(m => `You turn ${m.label} in <strong>${year + m.age}</strong>`).join(' &nbsp;&middot;&nbsp; ');

  return `
    <div class="pattern-a" data-reveal>
      <p class="eyebrow">Milestone Years</p>
      <p class="section-headline">Dates to look forward to</p>
      <p class="milestone-ages">${parts}</p>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// FEATURE 4: SOCIAL MEDIA AGE CONTEXT
// ---------------------------------------------------------------------------

function socialMediaSection(year) {
  // Only show platforms that launched after the birth year
  const afterBirth = SOCIAL_MEDIA_TIMELINE.filter(p => p.year > year);

  if (afterBirth.length === 0) return '';

  // If born 2000+, sort by age ascending (smallest = most personal)
  // Otherwise take first 4 chronologically
  let selected;
  if (year >= 2000) {
    selected = afterBirth.slice().sort((a, b) => a.year - b.year).slice(0, 4);
  } else {
    selected = afterBirth.slice(0, 4);
  }

  const rows = selected.map(p => {
    const age = p.year - year;
    return `
      <div class="social-item">
        <span class="social-item-name">${escHtml(p.name)}</span>
        <span>launched when you were ${age}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="pattern-a" data-reveal>
      <p class="eyebrow">Social Media Timeline</p>
      <p class="section-headline">The platforms that defined the internet, relative to you</p>
      <div class="social-timeline">${rows}</div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// FEATURE 5: SYNTHESIS PARAGRAPH (OUTRO)
// ---------------------------------------------------------------------------

function renderOutro(year, countryCode, data) {
  const pop    = data.world?.population_billions;
  const popStr = pop ? `${pop.toFixed(1)} billion people` : 'a rapidly growing world';

  // Song line
  const song     = data.culture?.music?.billboard_no1_song;
  const artist   = data.culture?.music?.billboard_no1_artist;
  const ukSong   = data.culture?.music?.uk_no1_jan;
  const ukArtist = data.culture?.music?.uk_no1_jan_artist;

  let songLine = '';
  if (countryCode === 'GB' && ukSong) {
    songLine = ` ${escHtml(ukSong)}${ukArtist ? ' by ' + escHtml(ukArtist) : ''} was on the radio.`;
  } else if (song) {
    songLine = ` ${escHtml(song)}${artist ? ' by ' + escHtml(artist) : ''} was on the radio.`;
  }

  // Leader line
  const leaderInfo = LEADER_KEYS[countryCode] || LEADER_KEYS.US;
  const leader  = data.leaders?.[leaderInfo.key];
  const country = COUNTRY_MAP[countryCode] || COUNTRIES[0];

  let leaderLine = '';
  if (leader && leader !== 'Unknown') {
    const positionMap = {
      US: 'was in the White House',
      GB: 'was in Downing Street',
      IN: 'led India',
      DE: 'led Germany',
      JP: 'led Japan',
      FR: 'was at the Elysee',
      BR: 'led Brazil',
      CN: 'led China',
      AU: 'led Australia',
      CA: 'led Canada',
      RU: 'led Russia',
      MX: 'led Mexico',
      KR: 'led South Korea',
      IE: 'led Ireland',
    };
    const position = positionMap[countryCode] || `was ${country.name}'s ${leaderInfo.title}`;
    leaderLine = ` ${escHtml(leader)} ${position}.`;
  }

  // Closing line by decade
  const decade = Math.floor(year / 10) * 10;
  const closingLines = {
    1950: "You've witnessed more change than almost any generation in human history.",
    1960: "You've witnessed more change than almost any generation in human history.",
    1970: "You grew up as the world shifted from analogue certainty to digital possibility.",
    1980: "You're part of the last generation that remembers a world without the internet.",
    1990: "You came of age as the internet rewired everything - and you were young enough to adapt.",
    2000: "You've never known a world without Google. The smartphone arrived in your childhood.",
    2010: "You've never known a world without smartphones. You and the internet grew up together.",
  };
  const closing = closingLines[decade] || "You've seen the world change in ways few generations could have imagined.";

  const openLine = `You arrived in a world of ${popStr}.`;

  return `
    <div class="infographic-outro" data-reveal>
      <p class="outro-text">${openLine}${leaderLine}${songLine} ${escHtml(closing)}</p>
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
  const pillsHtml = prices.map(p => {
    const todayHtml = p.todayValue != null
      ? `<span class="price-pill-today">$${formatPriceValue(p.todayValue)} today</span>`
      : '';
    return `
    <div class="price-pill">
      <span class="price-pill-emoji">${p.emoji}</span>
      <span class="price-pill-value">$${formatPriceValue(p.value)}</span>
      ${todayHtml}
      <span class="price-pill-label">${escHtml(p.label)}</span>
    </div>
  `;
  }).join('');

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
// INTERSECTION OBSERVER - REVEAL
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
  const text = `The world the year I was born - ${params.year}. pivode.github.io/born-in?year=${params.year}&country=${params.country}`;
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

  // Reset accent and era theme
  document.documentElement.style.setProperty('--accent', '#a78bfa');
  document.body.classList.remove(...ERA_CLASSES);

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
  applyDecadeTheme(params.year);
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
  if (!raw) return '-';
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
  if (n == null) return '-';
  const num = parseFloat(n);
  if (isNaN(num)) return '-';
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
  initNameField();
  startTypewriter();
  checkURLOnLoad();
}

document.addEventListener('DOMContentLoaded', init);
