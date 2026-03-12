/* =========================================================
   COMPARE GENERATIONS - compare.js
   ========================================================= */

'use strict';

// ---------------------------------------------------------------------------
// CONSTANTS (copied from parent app.js)
// ---------------------------------------------------------------------------

const YEAR_MIN = 1930;
const YEAR_MAX = 2010;
const AT18_YEAR_MAX = 2025;
const YEAR_GAPS = new Set([1951, 1953]);

const DECADE_ACCENTS = {
  1930: '#d4a574',
  1940: '#8fae7e',
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
  1930:18.78,1931:20.64,1932:22.9,1933:24.13,1934:23.41,1935:22.9,1936:22.57,
  1937:21.78,1938:22.25,1939:22.57,1940:22.41,1941:21.34,1942:19.24,1943:18.13,
  1944:17.82,1945:17.43,1946:16.09,1947:14.07,1948:13.02,1949:13.18,
  1950:13.02,1951:12.06,1952:11.84,1953:11.75,1954:11.66,1955:11.7,1956:11.53,
  1957:11.16,1958:10.85,1959:10.78,1960:10.6,1961:10.49,1962:10.39,1963:10.25,
  1964:10.12,1965:9.96,1966:9.68,1967:9.39,1968:9.01,1969:8.55,1970:8.08,
  1971:7.75,1972:7.5,1973:7.07,1974:6.36,1975:5.83,1976:5.51,1977:5.18,
  1978:4.81,1979:4.32,1980:3.81,1981:3.45,1982:3.25,1983:3.15,1984:3.02,
  1985:2.92,1986:2.86,1987:2.76,1988:2.65,1989:2.53,1990:2.4,1991:2.3,
  1992:2.24,1993:2.17,1994:2.12,1995:2.06,1996:2.0,1997:1.95,1998:1.92,
  1999:1.88,2000:1.82,2001:1.77,2002:1.74,2003:1.7,2004:1.66,2005:1.61,
  2006:1.56,2007:1.51,2008:1.46,2009:1.46,2010:1.44,
  2011:1.39,2012:1.37,2013:1.35,2014:1.33,2015:1.32,2016:1.31,2017:1.28,
  2018:1.25,2019:1.23,2020:1.21,2021:1.16,2022:1.07,2023:1.03,2024:1.0,2025:0.98,
};

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const VOICE_THEN = {
  1930: 'recording your voice meant a phonograph cylinder or gramophone disc',
  1940: 'recording your voice required a wire recorder or a radio studio',
  1950: 'recording your voice meant a reel-to-reel tape recorder',
  1960: 'hearing a new voice meant tuning into the radio',
  1970: 'recording your voice meant pressing play+record on a cassette',
  1980: 'your voice lived on answering machines and camcorder tapes',
  1990: 'capturing your voice meant a voicemail or a camcorder',
  2000: 'recording your voice meant GarageBand or a cheap USB mic',
  2010: 'sharing your voice meant voice notes and YouTube vlogs',
};

const SHARED = window.BORN_IN_SHARED || {};
const CURRENT_YEAR = SHARED.CURRENT_YEAR || 2026;
const TEMPORAL_ANCHORS = SHARED.TEMPORAL_ANCHORS || [];
const SOCIAL_MEDIA_TIMELINE = SHARED.SOCIAL_MEDIA_TIMELINE || [];
const CO2_PPM = SHARED.CO2_PPM || {};
const CO2_TODAY = SHARED.CO2_TODAY || 422.5;
const EXOPLANETS_BY_YEAR = SHARED.EXOPLANETS_BY_YEAR || {};
const EXOPLANETS_TODAY = SHARED.EXOPLANETS_TODAY || 5800;
const CURATED_WORLD_EVENTS = SHARED.CURATED_WORLD_EVENTS || {};
const COUNTRY_EVENTS = SHARED.COUNTRY_EVENTS || {};
const getWordsAfterYear = SHARED.getWordsAfterYear || function () { return []; };

const DOMESTIC_WORLD_EVENT_PATTERNS = [
  /super bowl/i,
  /world series/i,
  /afl-nfl/i,
  /\bnba\b/i,
  /\bnfl\b/i,
  /\bmlb\b/i,
  /american idol/i,
];

const US_LOCAL_WORLD_EVENT_PATTERNS = [
  /\bDetroit\b/i,
  /\bLos Angeles\b/i,
  /\bNew York\b/i,
  /\bChicago\b/i,
  /\bCalifornia\b/i,
  /\bTexas\b/i,
  /\bFlorida\b/i,
];

const DOMESTIC_POLITICAL_WORLD_EVENT_PATTERNS = [
  /presidential debate/i,
  /\belected\b.*\bpresident\b/i,
  /\bpresident\b.*\bdefeat/i,
  /\bprime minister\b.*\bdefeat/i,
  /\belection\b/i,
  /\bcampaign\b/i,
  /\bparliament\b/i,
  /\bcoalition\b/i,
  /lunch counter/i,
];

const EDITORIAL_WORLD_EVENT_PATTERNS = [
  /landmark in political history/i,
  /one of the closest elections in history/i,
  /exposing disaster preparedness failures/i,
  /in the worst terrorist attack on [^.,;]+/i,
  /at that time$/i,
];

const GLOBAL_WORLD_EVENT_PATTERNS = [
  /\bwar\b/i,
  /treaty|accord|ceasefire|summit|peace/i,
  /independence|declares independence|reunif/i,
  /revolution|coup|uprising|protest|assassinat/i,
  /elected|election|president|prime minister|king/i,
  /earthquake|tsunami|cyclone|hurricane|flood|famine|drought/i,
  /moon|space|satellite|astronaut|transplant/i,
  /nuclear|atomic|reactor/i,
  /financial crisis|crash|recession/i,
  /olympics|world cup/i,
  /\bUN\b|United Nations/i,
];

// ---------------------------------------------------------------------------
// LOCAL MUSIC CHARTS (copied from parent app.js)
// Each entry: {s: 'song', a: 'artist'}
// ---------------------------------------------------------------------------

const MUSIC_DE_NO1 = {
  1968:{s:'Mama',a:'Heintje'},1976:{s:'Fernando',a:'ABBA'},
  1977:{s:'Yes Sir, I Can Boogie',a:'Baccara'},1978:{s:'Rivers of Babylon',a:'Boney M.'},
  1982:{s:'Ein bisschen Frieden',a:'Nicole'},1983:{s:'Flashdance',a:'Irene Cara'},
  1984:{s:'Big in Japan',a:'Alphaville'},1985:{s:'Live Is Life',a:'Opus'},
  1986:{s:'Jeanny',a:'Falco'},1987:{s:'Voyage Voyage',a:'Desireless'},
  1988:{s:'Girl You Know It\'s True',a:'Milli Vanilli'},
  1990:{s:'Verdammt ich lieb\' dich',a:'Matthias Reim'},
  1991:{s:'Wind of Change',a:'Scorpions'},1993:{s:'What Is Love',a:'Haddaway'},
  1996:{s:'Macarena',a:'Los Del Rio'},
  1997:{s:'Time to Say Goodbye',a:'Sarah Brightman & Andrea Bocelli'},
  1998:{s:'My Heart Will Go On',a:'Celine Dion'},
  1999:{s:'Mambo No. 5',a:'Lou Bega'},2001:{s:'Daylight in Your Eyes',a:'No Angels'},
  2004:{s:'Dragostea Din Tei',a:'O-Zone'},2009:{s:'Poker Face',a:'Lady Gaga'},
};

const MUSIC_FR_NO1 = {
  1969:{s:'Je t\'aime... moi non plus',a:'Serge Gainsbourg & Jane Birkin'},
  1987:{s:'Joe le Taxi',a:'Vanessa Paradis'},1989:{s:'Lambada',a:'Kaoma'},
  1995:{s:'Pour que tu m\'aimes encore',a:'Celine Dion'},
  1996:{s:'Macarena',a:'Los Del Rio'},1997:{s:'Candle in the Wind 1997',a:'Elton John'},
  1998:{s:'My Heart Will Go On',a:'Celine Dion'},1999:{s:'Mambo No. 5',a:'Lou Bega'},
  2004:{s:'Dragostea Din Tei',a:'O-Zone'},2009:{s:'Poker Face',a:'Lady Gaga'},
  2010:{s:'Baby',a:'Justin Bieber ft. Ludacris'},
};

const MUSIC_AU_NO1 = {
  1975:{s:'Jive Talkin\'',a:'Bee Gees'},1976:{s:'Fernando',a:'ABBA'},
  1978:{s:'Night Fever',a:'Bee Gees'},1981:{s:'Physical',a:'Olivia Newton-John'},
  1983:{s:'Karma Chameleon',a:'Culture Club'},1986:{s:'You\'re the Voice',a:'John Farnham'},
  1988:{s:'Don\'t Worry Be Happy',a:'Bobby McFerrin'},
  1990:{s:'Nothing Compares 2 U',a:'Sinead O\'Connor'},
  1991:{s:'(Everything I Do) I Do It for You',a:'Bryan Adams'},
  1995:{s:'Gangsta\'s Paradise',a:'Coolio ft. L.V.'},
  1996:{s:'Macarena',a:'Los Del Rio'},1998:{s:'My Heart Will Go On',a:'Celine Dion'},
  1999:{s:'Mambo No. 5',a:'Lou Bega'},2008:{s:'Low',a:'Flo Rida ft. T-Pain'},
  2009:{s:'I Gotta Feeling',a:'Black Eyed Peas'},
  2010:{s:'Love the Way You Lie',a:'Eminem ft. Rihanna'},
};

const MUSIC_IT_NO1 = {
  1958:{s:'Nel blu dipinto di blu (Volare)',a:'Domenico Modugno'},
  1962:{s:'Quando Quando Quando',a:'Tony Renis'},
  1964:{s:'Non ho l\'eta',a:'Gigliola Cinquetti'},
  1968:{s:'Azzurro',a:'Adriano Celentano'},
  1970:{s:'L\'ora dell\'amore',a:'Adriano Celentano'},
  1977:{s:'Ti amo',a:'Umberto Tozzi'},
  1979:{s:'Gloria',a:'Umberto Tozzi'},
  1982:{s:'Felicita',a:'Al Bano & Romina Power'},
  1986:{s:'Adesso tu',a:'Eros Ramazzotti'},
  1990:{s:'Uomini soli',a:'Pooh'},
  1993:{s:'La solitudine',a:'Laura Pausini'},
  1995:{s:'Con te partiro',a:'Andrea Bocelli'},
  1999:{s:'Senza una donna',a:'Zucchero'},
  2001:{s:'Luce (Tramonti a Nord Est)',a:'Elisa'},
  2005:{s:'Angelo',a:'Francesco Renga'},
  2008:{s:'Ti credo',a:'Gianni Morandi'},
};

const MUSIC_ES_NO1 = {
  1956:{s:'Me lo dijo Perez',a:'Gloria Lasso'},
  1962:{s:'El porompompero',a:'Manolo Escobar'},
  1968:{s:'La la la',a:'Massiel'},
  1970:{s:'Gwendolyne',a:'Julio Iglesias'},
  1975:{s:'Eres tu',a:'Mocedades'},
  1981:{s:'Quiereme mucho',a:'Julio Iglesias'},
  1984:{s:'Me cuesta tanto olvidarte',a:'Mecano'},
  1988:{s:'Hijo de la luna',a:'Mecano'},
  1991:{s:'Corazon partio',a:'Alejandro Sanz'},
  1996:{s:'Macarena',a:'Los Del Rio'},
  1999:{s:'Livin\' la Vida Loca',a:'Ricky Martin'},
  2001:{s:'Wherever, Whenever',a:'Shakira'},
  2004:{s:'Tu calorro',a:'Estopa'},
  2006:{s:'Hips Don\'t Lie',a:'Shakira'},
  2008:{s:'Waka Waka',a:'Shakira'},
  2010:{s:'Loca',a:'Shakira ft. El Cata'},
};

const MUSIC_BR_NO1 = {
  1959:{s:'A felicidade',a:'Tom Jobim & Vinicius de Moraes'},
  1962:{s:'Garota de Ipanema',a:'Tom Jobim & Vinicius de Moraes'},
  1967:{s:'Alegria, Alegria',a:'Caetano Veloso'},
  1970:{s:'Detalhes',a:'Roberto Carlos'},
  1973:{s:'Eu te amo',a:'Roberto Carlos'},
  1977:{s:'Exagerado',a:'Cazuza'},
  1980:{s:'Menino do Rio',a:'Baby Consuelo'},
  1984:{s:'Como uma onda',a:'Lulu Santos'},
  1988:{s:'Brasil',a:'Cazuza'},
  1991:{s:'Pais e filhos',a:'Legiao Urbana'},
  1995:{s:'Sera',a:'Legiao Urbana'},
  1997:{s:'Sozinho',a:'Caetano Veloso'},
  2000:{s:'Velha infancia',a:'Tribalistas'},
  2003:{s:'Ainda lembro',a:'Marisa Monte'},
  2005:{s:'Vai chover',a:'Ivete Sangalo'},
  2008:{s:'Balanca Brasil',a:'Ivete Sangalo'},
};

const MUSIC_JP_NO1 = {
  1952:{s:'Ringo Oiwake',a:'Hibari Misora'},
  1956:{s:'Kawa no nagare no you ni',a:'Hibari Misora'},
  1963:{s:'Konnichiwa Akachan',a:'Michiyo Azusa'},
  1970:{s:'Kuroneko no Tango',a:'Minako Yoshida'},
  1975:{s:'Oyoge! Taiyaki-kun',a:'Masato Shimon'},
  1978:{s:'UFO',a:'Pink Lady'},
  1983:{s:'Nagai aida',a:'Kiroro'},
  1985:{s:'Tenshi no You ni',a:'Hideaki Tokunaga'},
  1988:{s:'Paradise Ginga',a:'Hikaru Genji'},
  1991:{s:'Oh! Yeah!',a:'Dreams Come True'},
  1994:{s:'Innocent World',a:'Mr. Children'},
  1998:{s:'Automatic',a:'Utada Hikaru'},
  2000:{s:'Tsunami',a:'Southern All Stars'},
  2003:{s:'Sekai ni Hitotsu Dake no Hana',a:'SMAP'},
  2006:{s:'Real Face',a:'KAT-TUN'},
  2009:{s:'Believe',a:'Arashi'},
};

const MUSIC_KR_NO1 = {
  1961:{s:'Dongbaek Agassi',a:'Lee Mija'},
  1975:{s:'Dora-wa-yo Busan-hang-e',a:'Cho Yong-pil'},
  1980:{s:'Changbakk-eui Yeoja',a:'Cho Yong-pil'},
  1985:{s:'Seoul ui Dal',a:'Lee Moon-sae'},
  1989:{s:'Sarang-eul Wihayeo',a:'Byun Jin-sub'},
  1992:{s:'Nan Arayo',a:'Seo Taiji and Boys'},
  1996:{s:'Couple',a:'SECHSKIES'},
  1998:{s:'Dasi Mannayo',a:'Kim Gun-mo'},
  2000:{s:'ID; Peace B',a:'BoA'},
  2003:{s:'Rising Sun',a:'TVXQ'},
  2005:{s:'Love Love Love',a:'FT Island'},
  2007:{s:'Tell Me',a:'Wonder Girls'},
  2009:{s:'Gee',a:'Girls\' Generation'},
  2010:{s:'Bad Boy',a:'Big Bang'},
};

const MUSIC_IN_NO1 = {
  1951:{s:'Awaara Hoon',a:'Mukesh (Awaara)'},
  1955:{s:'Mera Joota Hai Japani',a:'Mukesh (Shree 420)'},
  1960:{s:'Pyar Kiya To Darna Kya',a:'Lata Mangeshkar (Mughal-e-Azam)'},
  1965:{s:'Aaj Phir Jeene Ki Tamanna Hai',a:'Lata Mangeshkar (Guide)'},
  1971:{s:'Dum Maro Dum',a:'Asha Bhosle (Hare Rama Hare Krishna)'},
  1975:{s:'Sholay Theme - Mehbooba',a:'R.D. Burman (Sholay)'},
  1980:{s:'Om Shanti Om',a:'Kishore Kumar (Karz)'},
  1981:{s:'Dil Cheez Kya Hai',a:'Asha Bhosle (Umrao Jaan)'},
  1988:{s:'Ek Do Teen',a:'Alka Yagnik (Tezaab)'},
  1992:{s:'Dhak Dhak Karne Laga',a:'Udit Narayan (Beta)'},
  1994:{s:'Tu Cheez Badi Hai Mast',a:'Udit Narayan (Mohra)'},
  1995:{s:'Tujhe Dekha To Ye Jaana Sanam',a:'Kumar Sanu & Lata (DDLJ)'},
  1998:{s:'Chaiyya Chaiyya',a:'Sukhwinder Singh (Dil Se)'},
  1999:{s:'Taal Se Taal Mila',a:'A.R. Rahman (Taal)'},
  2002:{s:'Kal Ho Naa Ho',a:'Sonu Nigam'},
  2005:{s:'Kajra Re',a:'Alisha Chinai (Bunty Aur Babli)'},
  2008:{s:'Jashn-e-Bahaaraa',a:'Javed Ali (Jodhaa Akbar)'},
  2009:{s:'Jai Ho',a:'A.R. Rahman (Slumdog Millionaire)'},
  2010:{s:'Munni Badnaam Hui',a:'Mamta Sharma (Dabangg)'},
};

const MUSIC_TR_NO1 = {
  1960:{s:'Yesil Yesil',a:'Zeki Muren'},
  1967:{s:'Yalan Dunya',a:'Orhan Gencebay'},
  1975:{s:'Kara Sevda',a:'Ajda Pekkan'},
  1978:{s:'Petrol',a:'Ajda Pekkan'},
  1982:{s:'Firuze',a:'Sezen Aksu'},
  1985:{s:'Git',a:'Sezen Aksu'},
  1988:{s:'Hadi Bakalim',a:'Sezen Aksu'},
  1992:{s:'Yalnizlik Senfonisi',a:'Ibrahim Tatlises'},
  1995:{s:'Dom Dom Kursunu',a:'Ibrahim Tatlises'},
  1997:{s:'Simarik',a:'Tarkan'},
  1999:{s:'Sikidim',a:'Tarkan'},
  2003:{s:'Dudu',a:'Tarkan'},
  2006:{s:'Sor',a:'Hadise'},
  2008:{s:'Deli',a:'Tarkan'},
  2010:{s:'Isyan',a:'Manga'},
};

const MUSIC_SE_NO1 = {
  1958:{s:'Sommaren ar kort',a:'Anita Lindblom'},
  1966:{s:'Harliga sommardag',a:'Lill-Babs'},
  1974:{s:'Waterloo',a:'ABBA'},
  1976:{s:'Fernando',a:'ABBA'},
  1979:{s:'Gimme! Gimme! Gimme!',a:'ABBA'},
  1982:{s:'Flickan och Kransen',a:'Carola'},
  1986:{s:'The Look',a:'Roxette'},
  1988:{s:'Listen to Your Heart',a:'Roxette'},
  1991:{s:'Joyride',a:'Roxette'},
  1993:{s:'The Sign',a:'Ace of Base'},
  1995:{s:'All That She Wants',a:'Ace of Base'},
  1999:{s:'Livet ar',a:'Markoolio'},
  2004:{s:'Toxic',a:'Britney Spears'},
  2006:{s:'Hej Moansen',a:'Markoolio'},
  2009:{s:'Nar vindarna viskar mitt namn',a:'Lisa Nilsson'},
};

const MUSIC_PT_NO1 = {
  1955:{s:'Uma Casa Portuguesa',a:'Amalia Rodrigues'},
  1959:{s:'Tudo Isto e Fado',a:'Amalia Rodrigues'},
  1965:{s:'Barco Negro',a:'Amalia Rodrigues'},
  1970:{s:'E Depois do Adeus',a:'Paulo de Carvalho'},
  1974:{s:'Grandola, Vila Morena',a:'Zeca Afonso'},
  1980:{s:'Cavaleiro Monge',a:'Carlos Paredes'},
  1985:{s:'O Corpo e que Paga',a:'Rui Veloso'},
  1990:{s:'Lisboa Menina e Moca',a:'Carlos do Carmo'},
  1994:{s:'O Pastor',a:'Madredeus'},
  1998:{s:'Mar Portugues',a:'Dulce Pontes'},
  2001:{s:'Flor de Lis',a:'Da Vinci'},
  2005:{s:'Conquistador',a:'Da Vinci'},
  2008:{s:'Senhora do Mar',a:'Vitorino'},
  2010:{s:'Ha Dias Assim',a:'Mariza'},
};

const MUSIC_NL_NO1 = {
  1960:{s:'Kom van dat dak af',a:'Peter Koelewijn'},
  1966:{s:'Venus',a:'Shocking Blue'},
  1969:{s:'Radar Love',a:'Golden Earring'},
  1973:{s:'Waterloo',a:'Golden Earring'},
  1977:{s:'Ma Belle Amie',a:'Tee Set'},
  1980:{s:'De Vlieger',a:'Andre Hazes'},
  1984:{s:'Zij Gelooft in Mij',a:'Andre Hazes'},
  1987:{s:'Het Land van Maansen en Mansen',a:'Herman van Veen'},
  1989:{s:'Bloed, Zweet en Tranen',a:'Andre Hazes'},
  1993:{s:'Leef',a:'Andre Hazes'},
  1997:{s:'Hoe het danst',a:'Marco Borsato'},
  1999:{s:'Dromen zijn bedrog',a:'Marco Borsato'},
  2002:{s:'Leven zonder jou',a:'Marco Borsato'},
  2005:{s:'Afscheid nemen bestaat niet',a:'Marco Borsato'},
  2007:{s:'Watermensen',a:'Within Temptation'},
  2010:{s:'Drank & Drugs',a:'Lil Kleine & Ronnie Flex'},
};

const MUSIC_GB_NO1 = {
  1952:{s:'Here in My Heart',a:'Al Martino'},
  1955:{s:'Rose Marie',a:'Slim Whitman'},
  1960:{s:'It\'s Now or Never',a:'Elvis Presley'},
  1963:{s:'She Loves You',a:'The Beatles'},
  1965:{s:'Tears',a:'Ken Dodd'},
  1967:{s:'Release Me',a:'Engelbert Humperdinck'},
  1970:{s:'In the Summertime',a:'Mungo Jerry'},
  1975:{s:'Bohemian Rhapsody',a:'Queen'},
  1978:{s:'Rivers of Babylon',a:'Boney M.'},
  1980:{s:'Don\'t Stand So Close to Me',a:'The Police'},
  1983:{s:'Karma Chameleon',a:'Culture Club'},
  1984:{s:'Do They Know It\'s Christmas?',a:'Band Aid'},
  1986:{s:'Every Loser Wins',a:'Nick Berry'},
  1988:{s:'Mistletoe and Wine',a:'Cliff Richard'},
  1990:{s:'Unchained Melody',a:'The Righteous Brothers'},
  1991:{s:'(Everything I Do) I Do It for You',a:'Bryan Adams'},
  1993:{s:'I\'d Do Anything for Love',a:'Meat Loaf'},
  1995:{s:'Unchained Melody',a:'Robson & Jerome'},
  1997:{s:'Candle in the Wind 1997',a:'Elton John'},
  1998:{s:'Believe',a:'Cher'},
  1999:{s:'...Baby One More Time',a:'Britney Spears'},
  2000:{s:'Can We Fix It?',a:'Bob the Builder'},
  2003:{s:'Where Is the Love?',a:'Black Eyed Peas'},
  2005:{s:'Is This the Way to Amarillo',a:'Tony Christie ft. Peter Kay'},
  2007:{s:'Bleeding Love',a:'Leona Lewis'},
  2009:{s:'Killing in the Name',a:'Rage Against the Machine'},
  2010:{s:'Love the Way You Lie',a:'Eminem ft. Rihanna'},
};

const LOCAL_MUSIC = {
  DE: MUSIC_DE_NO1, FR: MUSIC_FR_NO1, AU: MUSIC_AU_NO1,
  IT: MUSIC_IT_NO1, ES: MUSIC_ES_NO1, BR: MUSIC_BR_NO1,
  JP: MUSIC_JP_NO1, KR: MUSIC_KR_NO1, IN: MUSIC_IN_NO1,
  TR: MUSIC_TR_NO1, SE: MUSIC_SE_NO1, PT: MUSIC_PT_NO1,
  NL: MUSIC_NL_NO1, GB: MUSIC_GB_NO1,
};
const LOCAL_MUSIC_LABEL = {
  DE: 'German Chart #1', FR: 'French Chart #1', AU: 'Australian Chart #1',
  IT: 'Italian Chart #1', ES: 'Spanish Chart #1', BR: 'Brazilian Chart #1',
  JP: 'Japanese Oricon #1', KR: 'Korean Chart #1', IN: 'Indian Chart #1',
  TR: 'Turkish Chart #1', SE: 'Swedish Chart #1', PT: 'Portuguese Chart #1',
  NL: 'Dutch Chart #1', GB: 'UK Chart #1',
};

// ---------------------------------------------------------------------------
// LOCAL FILM (copied from parent app.js)
// Each entry: {t: 'title', d: 'director'}
// ---------------------------------------------------------------------------

const FILM_IN_NO1 = {
  1950:{t:'Awaara',d:'Raj Kapoor'},
  1952:{t:'Baiju Bawra',d:'Vijay Bhatt'},
  1954:{t:'Boot Polish',d:'Prakash Arora'},
  1955:{t:'Shree 420',d:'Raj Kapoor'},
  1957:{t:'Mother India',d:'Mehboob Khan'},
  1958:{t:'Chalti Ka Naam Gaadi',d:'Satyen Bose'},
  1960:{t:'Mughal-E-Azam',d:'K. Asif'},
  1962:{t:'Sahib Bibi Aur Ghulam',d:'Abrar Alvi'},
  1964:{t:'Sangam',d:'Raj Kapoor'},
  1966:{t:'Guide',d:'Vijay Anand'},
  1969:{t:'Aradhana',d:'Shakti Samanta'},
  1971:{t:'Hare Rama Hare Krishna',d:'Dev Anand'},
  1973:{t:'Bobby',d:'Raj Kapoor'},
  1975:{t:'Sholay',d:'Ramesh Sippy'},
  1978:{t:'Don',d:'Chandra Barot'},
  1979:{t:'Suhaag',d:'Manmohan Desai'},
  1981:{t:'Naseeb',d:'Manmohan Desai'},
  1983:{t:'Coolie',d:'Manmohan Desai'},
  1986:{t:'Nagina',d:'Harmesh Malhotra'},
  1988:{t:'Tezaab',d:'N. Chandra'},
  1989:{t:'Maine Pyar Kiya',d:'Sooraj Barjatya'},
  1991:{t:'Saajan',d:'Lawrence D\'Souza'},
  1993:{t:'Damini',d:'Rajkumar Santoshi'},
  1994:{t:'Hum Aapke Hain Koun',d:'Sooraj Barjatya'},
  1995:{t:'Dilwale Dulhania Le Jayenge',d:'Aditya Chopra'},
  1997:{t:'Dil To Pagal Hai',d:'Yash Chopra'},
  1998:{t:'Kuch Kuch Hota Hai',d:'Karan Johar'},
  2000:{t:'Mission Kashmir',d:'Vidhu Vinod Chopra'},
  2001:{t:'Lagaan',d:'Ashutosh Gowariker'},
  2002:{t:'Devdas',d:'Sanjay Leela Bhansali'},
  2003:{t:'Kal Ho Naa Ho',d:'Nikkhil Advani'},
  2004:{t:'Veer-Zaara',d:'Yash Chopra'},
  2006:{t:'Rang De Basanti',d:'Rakeysh Omprakash Mehra'},
  2007:{t:'Om Shanti Om',d:'Farah Khan'},
  2008:{t:'Ghajini',d:'A.R. Murugadoss'},
  2009:{t:'3 Idiots',d:'Rajkumar Hirani'},
  2010:{t:'Dabangg',d:'Abhinav Kashyap'},
};

const FILM_JP_NO1 = {
  1950:{t:'Rashomon',d:'Akira Kurosawa'},
  1952:{t:'Ikiru',d:'Akira Kurosawa'},
  1954:{t:'Seven Samurai',d:'Akira Kurosawa'},
  1956:{t:'The Burmese Harp',d:'Kon Ichikawa'},
  1958:{t:'The Hidden Fortress',d:'Akira Kurosawa'},
  1960:{t:'Yojimbo',d:'Akira Kurosawa'},
  1962:{t:'Harakiri',d:'Masaki Kobayashi'},
  1964:{t:'Woman in the Dunes',d:'Hiroshi Teshigahara'},
  1966:{t:'The Face of Another',d:'Hiroshi Teshigahara'},
  1969:{t:'Boy',d:'Nagisa Oshima'},
  1971:{t:'The Ceremony',d:'Nagisa Oshima'},
  1974:{t:'Sandakan No. 8',d:'Kei Kumai'},
  1976:{t:'In the Realm of the Senses',d:'Nagisa Oshima'},
  1980:{t:'Kagemusha',d:'Akira Kurosawa'},
  1983:{t:'The Ballad of Narayama',d:'Shohei Imamura'},
  1985:{t:'Ran',d:'Akira Kurosawa'},
  1987:{t:'The Funeral',d:'Juzo Itami'},
  1991:{t:'A Scene at the Sea',d:'Takeshi Kitano'},
  1993:{t:'Sonatine',d:'Takeshi Kitano'},
  1995:{t:'Maborosi',d:'Hirokazu Kore-eda'},
  1997:{t:'Hana-bi',d:'Takeshi Kitano'},
  1998:{t:'Ring',d:'Hideo Nakata'},
  2001:{t:'Spirited Away',d:'Hayao Miyazaki'},
  2002:{t:'The Twilight Samurai',d:'Yoji Yamada'},
  2004:{t:'Nobody Knows',d:'Hirokazu Kore-eda'},
  2007:{t:'Always: Sunset on Third Street 2',d:'Takashi Yamazaki'},
  2008:{t:'Departures',d:'Yojiro Takita'},
  2009:{t:'Air Doll',d:'Hirokazu Kore-eda'},
  2010:{t:'Confessions',d:'Tetsuya Nakashima'},
};

const FILM_KR_NO1 = {
  1961:{t:'Obaltan',d:'Yoo Hyun-mok'},
  1967:{t:'The Merciless',d:'Im Kwon-taek'},
  1971:{t:'Hwannyeo',d:'Kim Ki-young'},
  1982:{t:'Madame Aema',d:'Jung In-yeop'},
  1987:{t:'Surrogate Mother',d:'Im Kwon-taek'},
  1989:{t:'Why Has Bodhi-Dharma Left for the East?',d:'Bae Yong-kyun'},
  1993:{t:'Sopyonje',d:'Im Kwon-taek'},
  1998:{t:'The Contact',d:'Chang Youn-hyun'},
  1999:{t:'Shiri',d:'Kang Je-gyu'},
  2000:{t:'Joint Security Area',d:'Park Chan-wook'},
  2001:{t:'Friend',d:'Kwak Kyung-taek'},
  2002:{t:'Oasis',d:'Lee Chang-dong'},
  2003:{t:'Oldboy',d:'Park Chan-wook'},
  2004:{t:'A Tale of Two Sisters',d:'Kim Jee-woon'},
  2005:{t:'Welcome to Dongmakgol',d:'Park Kwang-hyun'},
  2006:{t:'The Host',d:'Bong Joon-ho'},
  2007:{t:'Secret Sunshine',d:'Lee Chang-dong'},
  2008:{t:'The Good, the Bad, the Weird',d:'Kim Jee-woon'},
  2009:{t:'Mother',d:'Bong Joon-ho'},
  2010:{t:'I Saw the Devil',d:'Kim Jee-woon'},
};

const FILM_FR_NO1 = {
  1950:{t:'Justice est faite',d:'Andre Cayatte'},
  1952:{t:'Fanfan la Tulipe',d:'Christian-Jaque'},
  1954:{t:'Gervaise',d:'Rene Clement'},
  1956:{t:'And God Created Woman',d:'Roger Vadim'},
  1958:{t:'Mon oncle',d:'Jacques Tati'},
  1959:{t:'The 400 Blows',d:'Francois Truffaut'},
  1960:{t:'Breathless',d:'Jean-Luc Godard'},
  1961:{t:'Leon Morin, Priest',d:'Jean-Pierre Melville'},
  1963:{t:'Le Mepris',d:'Jean-Luc Godard'},
  1964:{t:'The Umbrellas of Cherbourg',d:'Jacques Demy'},
  1966:{t:'A Man and a Woman',d:'Claude Lelouch'},
  1969:{t:'Z',d:'Costa-Gavras'},
  1970:{t:'Le Cercle rouge',d:'Jean-Pierre Melville'},
  1974:{t:'The Clockmaker of Saint-Paul',d:'Bertrand Tavernier'},
  1975:{t:'The Judge and the Assassin',d:'Bertrand Tavernier'},
  1978:{t:'Get Out Your Handkerchiefs',d:'Bertrand Blier'},
  1980:{t:'The Last Metro',d:'Francois Truffaut'},
  1981:{t:'Diva',d:'Jean-Jacques Beineix'},
  1983:{t:'Entre nous',d:'Diane Kurys'},
  1985:{t:'Three Men and a Cradle',d:'Coline Serreau'},
  1986:{t:'Betty Blue',d:'Jean-Jacques Beineix'},
  1988:{t:'Au revoir les enfants',d:'Louis Malle'},
  1990:{t:'Cyrano de Bergerac',d:'Jean-Paul Rappeneau'},
  1992:{t:'Un coeur en hiver',d:'Claude Sautet'},
  1994:{t:'The Wild Reeds',d:'Andre Techine'},
  1995:{t:'La Haine',d:'Mathieu Kassovitz'},
  1996:{t:'Ridicule',d:'Patrice Leconte'},
  1997:{t:'The Fifth Element',d:'Luc Besson'},
  1999:{t:'The Dreamlife of Angels',d:'Erick Zonca'},
  2000:{t:'The Taste of Others',d:'Agnes Jaoui'},
  2001:{t:'Amelie',d:'Jean-Pierre Jeunet'},
  2002:{t:'The Piano Teacher',d:'Michael Haneke'},
  2003:{t:'Swimming Pool',d:'Francois Ozon'},
  2004:{t:'The Chorus',d:'Christophe Barratier'},
  2005:{t:'Cache',d:'Michael Haneke'},
  2006:{t:'The Science of Sleep',d:'Michel Gondry'},
  2007:{t:'The Diving Bell and the Butterfly',d:'Julian Schnabel'},
  2008:{t:'The Class',d:'Laurent Cantet'},
  2009:{t:'A Prophet',d:'Jacques Audiard'},
  2010:{t:'Of Gods and Men',d:'Xavier Beauvois'},
};

const FILM_IT_NO1 = {
  1950:{t:'Bitter Rice',d:'Giuseppe De Santis'},
  1952:{t:'Umberto D.',d:'Vittorio De Sica'},
  1954:{t:'La Strada',d:'Federico Fellini'},
  1957:{t:'Nights of Cabiria',d:'Federico Fellini'},
  1959:{t:'Big Deal on Madonna Street',d:'Mario Monicelli'},
  1960:{t:'La Dolce Vita',d:'Federico Fellini'},
  1961:{t:'Divorce Italian Style',d:'Pietro Germi'},
  1963:{t:'8 1/2',d:'Federico Fellini'},
  1965:{t:'For a Few Dollars More',d:'Sergio Leone'},
  1966:{t:'The Good, the Bad and the Ugly',d:'Sergio Leone'},
  1968:{t:'Once Upon a Time in the West',d:'Sergio Leone'},
  1970:{t:'The Bird with the Crystal Plumage',d:'Dario Argento'},
  1972:{t:'The Working Class Goes to Heaven',d:'Elio Petri'},
  1974:{t:'Amarcord',d:'Federico Fellini'},
  1976:{t:'The Innocent',d:'Luchino Visconti'},
  1978:{t:'The Tree of Wooden Clogs',d:'Ermanno Olmi'},
  1980:{t:'La Terrazza',d:'Ettore Scola'},
  1982:{t:'The Night of the Shooting Stars',d:'Paolo & Vittorio Taviani'},
  1984:{t:'Once Upon a Time in America',d:'Sergio Leone'},
  1986:{t:'The Name of the Rose',d:'Jean-Jacques Annaud'},
  1988:{t:'Cinema Paradiso',d:'Giuseppe Tornatore'},
  1990:{t:'The Postman',d:'Michael Radford'},
  1992:{t:'The Stolen Children',d:'Gianni Amelio'},
  1994:{t:'Caro Diario',d:'Nanni Moretti'},
  1997:{t:'Life is Beautiful',d:'Roberto Benigni'},
  2000:{t:'Malena',d:'Giuseppe Tornatore'},
  2001:{t:"The Son's Room",d:'Nanni Moretti'},
  2003:{t:'The Best of Youth',d:'Marco Tullio Giordana'},
  2006:{t:'Caos calmo',d:'Antonello Grimaldi'},
  2008:{t:'Gomorra',d:'Matteo Garrone'},
  2009:{t:'Il Divo',d:'Paolo Sorrentino'},
  2010:{t:'The Great Beauty',d:'Paolo Sorrentino'},
};

const FILM_BR_NO1 = {
  1962:{t:'Barravento',d:'Glauber Rocha'},
  1964:{t:'Black God, White Devil',d:'Glauber Rocha'},
  1967:{t:'Land in Anguish',d:'Glauber Rocha'},
  1969:{t:'Macunaima',d:'Joaquim Pedro de Andrade'},
  1971:{t:'Como era gostoso o meu frances',d:'Nelson Pereira dos Santos'},
  1976:{t:'Bye Bye Brasil',d:'Carlos Diegues'},
  1981:{t:'Pixote',d:'Hector Babenco'},
  1984:{t:'Quilombo',d:'Carlos Diegues'},
  1986:{t:'A hora da estrela',d:'Suzana Amaral'},
  1991:{t:'O que e isso, companheiro?',d:'Bruno Barreto'},
  1995:{t:'Carlota Joaquina',d:'Carla Camurati'},
  1998:{t:'Central Station',d:'Walter Salles'},
  2000:{t:'Behind the Sun',d:'Walter Salles'},
  2002:{t:'City of God',d:'Fernando Meirelles'},
  2004:{t:'The Motorcycle Diaries',d:'Walter Salles'},
  2006:{t:'The Year My Parents Went on Vacation',d:'Cao Hamburger'},
  2007:{t:'Elite Squad',d:'Jose Padilha'},
  2008:{t:'Blindness',d:'Fernando Meirelles'},
  2010:{t:'Elite Squad: The Enemy Within',d:'Jose Padilha'},
};

const FILM_GB_NO1 = {
  1950:{t:'The Blue Lamp',d:'Basil Dearden'},
  1952:{t:'The Importance of Being Earnest',d:'Anthony Asquith'},
  1955:{t:'The Ladykillers',d:'Alexander Mackendrick'},
  1957:{t:'The Bridge on the River Kwai',d:'David Lean'},
  1959:{t:'Room at the Top',d:'Jack Clayton'},
  1960:{t:'Saturday Night and Sunday Morning',d:'Karel Reisz'},
  1962:{t:'Lawrence of Arabia',d:'David Lean'},
  1963:{t:'Tom Jones',d:'Tony Richardson'},
  1965:{t:'The Knack ...and How to Get It',d:'Richard Lester'},
  1966:{t:'Alfie',d:'Lewis Gilbert'},
  1968:{t:'If....',d:'Lindsay Anderson'},
  1969:{t:'Kes',d:'Ken Loach'},
  1971:{t:'A Clockwork Orange',d:'Stanley Kubrick'},
  1976:{t:'The Man Who Fell to Earth',d:'Nicolas Roeg'},
  1981:{t:'Chariots of Fire',d:'Hugh Hudson'},
  1984:{t:'Another Country',d:'Marek Kanievska'},
  1985:{t:'My Beautiful Laundrette',d:'Stephen Frears'},
  1987:{t:'Full Metal Jacket',d:'Stanley Kubrick'},
  1988:{t:'A Fish Called Wanda',d:'Charles Crichton'},
  1990:{t:'The Krays',d:'Peter Medak'},
  1992:{t:'Howards End',d:'James Ivory'},
  1994:{t:'Four Weddings and a Funeral',d:'Mike Newell'},
  1995:{t:'Sense and Sensibility',d:'Ang Lee'},
  1996:{t:'Trainspotting',d:'Danny Boyle'},
  1997:{t:'The Full Monty',d:'Peter Cattaneo'},
  1999:{t:'Notting Hill',d:'Roger Michell'},
  2000:{t:'Billy Elliot',d:'Stephen Daldry'},
  2001:{t:'Gosford Park',d:'Robert Altman'},
  2002:{t:'28 Days Later',d:'Danny Boyle'},
  2003:{t:'Love Actually',d:'Richard Curtis'},
  2004:{t:'Vera Drake',d:'Mike Leigh'},
  2005:{t:'Pride and Prejudice',d:'Joe Wright'},
  2006:{t:'The Queen',d:'Stephen Frears'},
  2007:{t:'Atonement',d:'Joe Wright'},
  2008:{t:'Slumdog Millionaire',d:'Danny Boyle'},
  2009:{t:'In the Loop',d:'Armando Iannucci'},
  2010:{t:"The King's Speech",d:'Tom Hooper'},
};

const FILM_DE_NO1 = {
  1951:{t:'Der Hauptmann von Koepenick',d:'Helmut Kautner'},
  1954:{t:'The Last Bridge',d:'Helmut Kautner'},
  1959:{t:'The Bridge',d:'Bernhard Wicki'},
  1966:{t:'Abschied von gestern',d:'Alexander Kluge'},
  1968:{t:'Artists at the Top of the Big Top',d:'Alexander Kluge'},
  1971:{t:'Beware of a Holy Whore',d:'Rainer Werner Fassbinder'},
  1972:{t:'The Bitter Tears of Petra von Kant',d:'Rainer Werner Fassbinder'},
  1975:{t:'Fear of Fear',d:'Rainer Werner Fassbinder'},
  1978:{t:'The Marriage of Maria Braun',d:'Rainer Werner Fassbinder'},
  1979:{t:'The Tin Drum',d:'Volker Schlondorff'},
  1981:{t:'Das Boot',d:'Wolfgang Petersen'},
  1982:{t:'Fitzcarraldo',d:'Werner Herzog'},
  1984:{t:'Paris, Texas',d:'Wim Wenders'},
  1987:{t:'Wings of Desire',d:'Wim Wenders'},
  1992:{t:'Schtonk!',d:'Helmut Dietl'},
  1998:{t:'Run Lola Run',d:'Tom Tykwer'},
  1999:{t:'Sonnenallee',d:'Leander Haussmann'},
  2003:{t:'Good Bye, Lenin!',d:'Wolfgang Becker'},
  2004:{t:'Der Untergang',d:'Oliver Hirschbiegel'},
  2006:{t:'The Lives of Others',d:'Florian Henckel von Donnersmarck'},
  2007:{t:'The Counterfeiters',d:'Stefan Ruzowitzky'},
  2009:{t:'The White Ribbon',d:'Michael Haneke'},
  2010:{t:'Soul Kitchen',d:'Fatih Akin'},
};

const LOCAL_FILM = {
  IN: FILM_IN_NO1, JP: FILM_JP_NO1, KR: FILM_KR_NO1,
  FR: FILM_FR_NO1, IT: FILM_IT_NO1, BR: FILM_BR_NO1,
  GB: FILM_GB_NO1, DE: FILM_DE_NO1,
};
const LOCAL_FILM_LABEL = {
  IN: 'Bollywood Hit',
  JP: 'Japanese Cinema',
  KR: 'Korean Cinema',
  FR: 'French Cinema',
  IT: 'Italian Cinema',
  BR: 'Brazilian Cinema',
  GB: 'British Cinema',
  DE: 'German Cinema',
};

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

let selectedParentCountry = COUNTRIES[0]; // default US
let selectedChildCountry  = COUNTRIES[0]; // default US
let revealObserver = null;
let _hasExplicitCountries = true;
let _lastCompare = null; // { parentYear, childYear, parentCountryCode, childCountryCode, parentData, childData }

// ---------------------------------------------------------------------------
// DOM REFS
// ---------------------------------------------------------------------------

const $landing              = document.getElementById('cmp-landing');
const $form                 = document.getElementById('cmp-form');
const $parentYearInput      = document.getElementById('parent-year-input');
const $childYearInput       = document.getElementById('child-year-input');
const $parentYearError      = document.getElementById('parent-year-error');
const $childYearError       = document.getElementById('child-year-error');
// Parent country dropdown refs
const $parentCountryBtn      = document.getElementById('parent-country-btn');
const $parentCountryDropdown = document.getElementById('parent-country-dropdown');
const $parentCountrySearch   = document.getElementById('parent-country-search');
const $parentCountryList     = document.getElementById('parent-country-list');
const $parentCountryDisplay  = document.getElementById('parent-country-display');
// Child country dropdown refs
const $childCountryBtn       = document.getElementById('child-country-btn');
const $childCountryDropdown  = document.getElementById('child-country-dropdown');
const $childCountrySearch    = document.getElementById('child-country-search');
const $childCountryList      = document.getElementById('child-country-list');
const $childCountryDisplay   = document.getElementById('child-country-display');
const $result               = document.getElementById('cmp-result');
const $headerLabel          = document.getElementById('cmp-header-label');
const $headerCountries      = document.getElementById('cmp-header-countries');
const $shareBtn             = document.getElementById('cmp-share-btn');
const $sharePopover         = document.getElementById('cmp-share-popover');
const $copyLinkBtn          = document.getElementById('cmp-copy-link-btn');
const $tweetBtn             = document.getElementById('cmp-tweet-btn');
const $saveCardBtn          = document.getElementById('cmp-save-card-btn');
const $shareCard            = document.getElementById('cmp-share-card');
const $content              = document.getElementById('cmp-content');
const $newBtn               = document.getElementById('cmp-new-btn');
const $bottomNewBtn         = document.getElementById('cmp-bottom-new-btn');
const $errorPanel           = document.getElementById('cmp-error');
const $errorMessage         = document.getElementById('cmp-error-message');
const $errorBackBtn         = document.getElementById('cmp-error-back-btn');

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

function formatPopulationValue(popMillions) {
  if (popMillions == null) return null;
  const num = parseFloat(popMillions);
  if (isNaN(num)) return null;
  if (num >= 1000) {
    return (num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'B';
  }
  return Math.round(num).toLocaleString() + 'M';
}

function countrySnapshotLine(countryCode, year, countryData) {
  if (!countryCode || !countryData) return null;

  const population = formatPopulationValue(countryData.population_millions);
  const lifeExpectancy = countryData.life_expectancy
    ? String(countryData.life_expectancy).replace(/\.0$/, '') + ' years'
    : null;

  if (!population && !lifeExpectancy) return null;

  const country = COUNTRY_MAP[countryCode] || { code: countryCode, name: countryCode };
  const countryName = displayCountryName(country, year);

  if (population && lifeExpectancy) {
    return countryName + ' had ' + population + ' people and life expectancy of ' + lifeExpectancy;
  }
  if (population) {
    return countryName + ' had ' + population + ' people';
  }
  return countryName + ' had life expectancy of ' + lifeExpectancy;
}

function findTemporalAnchor(year) {
  const yearsToToday = CURRENT_YEAR - year;
  let bestAnchor = null;
  let bestSurplus = -Infinity;

  for (const anchor of TEMPORAL_ANCHORS) {
    const distToAnchor = Math.abs(year - anchor.year);
    if (distToAnchor < yearsToToday) {
      const surplus = yearsToToday - distToAnchor;
      if (surplus > bestSurplus) {
        bestSurplus = surplus;
        bestAnchor = { ...anchor, distance: distToAnchor, yearsToToday };
      }
    }
  }

  return bestAnchor;
}

function temporalShockLine(year) {
  const anchor = findTemporalAnchor(year);
  if (!anchor) return null;
  return 'Your birth year is closer to ' + anchor.label + ' than to today.';
}

function summarizeWords(year) {
  if (year >= 2005) return null;
  const words = getWordsAfterYear(year);
  if (!words || words.length < 3) return null;

  const shown = words.slice(0, 3);
  const extra = words.length - shown.length;

  return {
    value: shown.join(', '),
    desc: extra > 0
      ? extra + ' more common digital terms were still in the future'
      : 'common digital words that did not exist yet',
  };
}

function summarizeSocialTimeline(year) {
  const afterBirth = SOCIAL_MEDIA_TIMELINE.filter(item => item.year > year);
  if (afterBirth.length === 0) return null;

  const selected = year >= 2000
    ? afterBirth.slice().sort((a, b) => a.year - b.year).slice(0, 3)
    : afterBirth.slice(0, 3);

  const primary = selected[0];
  const rest = selected.slice(1)
    .map(item => item.name + ' at ' + (item.year - year))
    .join(' · ');

  return {
    value: primary.name + ' at ' + (primary.year - year),
    desc: rest || 'still had not launched yet',
  };
}

function sanitizeWorldEventText(text) {
  if (!text) return '';

  let cleaned = String(text).trim();

  cleaned = cleaned
    .replace(/\b(?:far-)?right-wing\b/gi, '')
    .replace(/\b(?:far-)?left-wing\b/gi, '')
    .replace(/\bdomestic\b/gi, '')
    .replace(/\ba\s+Israeli extremist\b/gi, 'an Israeli extremist')
    .replace(/\ba\s+extremist\b/gi, 'an extremist');

  EDITORIAL_WORLD_EVENT_PATTERNS.forEach((pattern) => {
    cleaned = cleaned.replace(new RegExp(`,?\\s*${pattern.source}`, pattern.flags), '');
  });

  return cleaned
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();
}

function normalizeComparableText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(the|a|an|and|or|of|to|in|on|at|for|from|with|by|after|before|into|over|under|across)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function eventIsDistinct(text, otherText) {
  const left = normalizeComparableText(text);
  const right = normalizeComparableText(otherText);

  if (!left || !right) return true;
  if (left === right) return false;
  if (left.includes(right) || right.includes(left)) return false;

  const leftTokens = new Set(left.split(' ').filter(token => token.length > 3));
  const rightTokens = new Set(right.split(' ').filter(token => token.length > 3));
  let overlap = 0;

  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) overlap += 1;
  });

  return overlap < 2;
}

function filterDistinctEvents(events, avoidTexts) {
  const blocked = (avoidTexts || []).filter(Boolean);
  const selected = [];

  (events || []).forEach((entry) => {
    const eventText = sanitizeWorldEventText(entry && entry.event);
    if (!eventText) return;
    if (blocked.some(text => !eventIsDistinct(eventText, text))) return;
    if (selected.some(existing => !eventIsDistinct(eventText, existing.event))) return;
    selected.push({
      ...entry,
      event: eventText,
    });
  });

  return selected;
}

function curatedWorldEvents(year, limit, avoidTexts) {
  const curated = CURATED_WORLD_EVENTS[year] || [];
  return filterDistinctEvents(curated, avoidTexts).slice(0, limit);
}

function worldEventCategory(text) {
  if (!text) return 'other';
  if (/earthquake|tsunami|cyclone|hurricane|flood|volcano|erupts|famine|drought/i.test(text)) return 'disaster';
  if (/treaty|accord|ceasefire|summit|peace|independence|founded|joins|federation|union/i.test(text)) return 'diplomacy';
  if (/space|moon|satellite|astronaut|transplant|internet|computer|windows|iphone|opec|oil production/i.test(text)) return 'science';
  if (/elected|election|president|prime minister|parliament|debate|campaign|cabinet/i.test(text)) return 'politics';
  if (/war|bombing|attack|hijack|assassinat|u-2|sarin|uprising|protest/i.test(text)) return 'conflict';
  if (/olympics|world cup|film|music|chart|tv|television/i.test(text)) return 'culture';
  return 'other';
}

function scoreWorldEvent(entry, countryCode) {
  const text = sanitizeWorldEventText((entry && entry.event) || '');
  if (!text) return -Infinity;

  let score = 0;
  const category = worldEventCategory(text);

  DOMESTIC_WORLD_EVENT_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) score -= 8;
  });

  US_LOCAL_WORLD_EVENT_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) score -= countryCode === 'US' ? 1.5 : 3;
  });

  GLOBAL_WORLD_EVENT_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) score += 3;
  });

  DOMESTIC_POLITICAL_WORLD_EVENT_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) score -= 4;
  });

  if (/\bworld\b|\bglobal\b|\binternational\b/i.test(text)) score += 1;
  if (/killed|dies|assassinated|launch|erupts|summit|agreement|independence|crisis/i.test(text)) score += 0.75;
  if (text.length >= 90) score += 0.5;
  if (/album|film|movie|tv|television|chart/i.test(text)) score -= 1;
  if (/in US history|on Japan's soil/i.test(text)) score -= 1.5;
  if (category === 'politics') score -= 1.5;
  if (category === 'science' || category === 'disaster' || category === 'diplomacy') score += 1.25;

  return score;
}

function selectWorldEvents(year, events, countryCode, limit, options) {
  const avoidTexts = options?.avoidTexts || [];
  const curated = curatedWorldEvents(year, limit, avoidTexts);
  if (curated.length > 0) return curated;

  const normalizedSeen = new Set();
  const scored = (events || [])
    .map((entry, index) => ({
      entry: {
        ...entry,
        event: sanitizeWorldEventText(entry && entry.event),
      },
      index,
      score: scoreWorldEvent(entry, countryCode),
      category: worldEventCategory(sanitizeWorldEventText(entry && entry.event)),
    }))
    .filter(item => item.entry.event && item.score > -6)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const selected = [];
  const categoryCounts = Object.create(null);

  function categoryCap(category) {
    if (category === 'politics') return 1;
    if (category === 'conflict') return Math.min(2, limit);
    return limit;
  }

  function tryPush(item, minScore) {
    if (selected.length >= limit || item.score < minScore) return;
    const key = String(item.entry.event || '').toLowerCase().replace(/\s+/g, ' ').trim();
    if (!key || normalizedSeen.has(key)) return;
    if (avoidTexts.some(text => !eventIsDistinct(item.entry.event, text))) return;
    if (selected.some(existing => !eventIsDistinct(item.entry.event, existing.event))) return;
    if ((categoryCounts[item.category] || 0) >= categoryCap(item.category)) return;
    normalizedSeen.add(key);
    selected.push(item.entry);
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  }

  scored.filter(item => item.category !== 'politics').forEach(item => tryPush(item, 1));
  scored.filter(item => item.category === 'politics').forEach(item => tryPush(item, 2));
  scored.forEach(item => tryPush(item, 0));
  scored.forEach(item => tryPush(item, -1));

  return selected
    .slice(0, limit)
    .sort((a, b) => (a.month || 99) - (b.month || 99));
}

function textTimelineCard({ eyebrow, headline, parentYear, childYear, parentText, childText }) {
  return dualTimeline({
    eyebrow,
    headline,
    parentYear,
    childYear,
    parentEvents: parentText ? [{ event: parentText }] : [],
    childEvents: childText ? [{ event: childText }] : [],
  });
}

function localMusicSelection(year, countryCode, data) {
  if (!data) return null;

  const localData = countryCode ? LOCAL_MUSIC[countryCode] : null;
  const music = data.culture?.music;

  if (localData && localData[year]) {
    return {
      label: LOCAL_MUSIC_LABEL[countryCode] || 'Local Chart #1',
      rowLabel: '#1 Song',
      title: localData[year].s,
      detail: localData[year].a || '',
    };
  }

  if (countryCode === 'GB' && (music?.uk_no1_jan || music?.billboard_no1_song)) {
    return {
      label: 'UK Chart #1',
      rowLabel: 'UK #1 Song',
      title: music?.uk_no1_jan || music?.billboard_no1_song,
      detail: music?.uk_no1_jan_artist || music?.billboard_no1_artist || '',
    };
  }

  if (countryCode === 'US' && (music?.billboard_no1_song || music?.uk_no1_jan)) {
    return {
      label: 'Billboard #1 Song',
      rowLabel: 'Billboard #1',
      title: music?.billboard_no1_song || music?.uk_no1_jan,
      detail: music?.billboard_no1_artist || music?.uk_no1_jan_artist || '',
    };
  }

  if (music?.uk_no1_jan || music?.billboard_no1_song) {
    const useUk = Boolean(music?.uk_no1_jan) && countryCode !== 'US';
    return {
      label: useUk ? 'Chart-Topping Song' : 'Global Hit',
      rowLabel: 'Hit Song',
      title: useUk ? music.uk_no1_jan : music.billboard_no1_song || music.uk_no1_jan,
      detail: useUk
        ? (music.uk_no1_jan_artist || music.billboard_no1_artist || '')
        : (music.billboard_no1_artist || music.uk_no1_jan_artist || ''),
    };
  }

  if (music?.grammy_record) {
    return {
      label: 'Award-Winning Song',
      rowLabel: 'Hit Song',
      title: music.grammy_record,
      detail: music.grammy_record_artist || '',
    };
  }

  return null;
}

function localFilmSelection(year, countryCode, data) {
  if (!data) return null;

  const localData = countryCode ? LOCAL_FILM[countryCode] : null;
  const film = data.culture?.film;

  if (localData && localData[year]) {
    return {
      label: LOCAL_FILM_LABEL[countryCode] || 'Local Film',
      rowLabel: 'Biggest Film',
      title: localData[year].t,
      detail: localData[year].d ? 'dir. ' + localData[year].d : '',
    };
  }

  if (countryCode === 'US' && (film?.box_office_no1 || film?.oscar_best_picture)) {
    return {
      label: film?.box_office_no1 ? 'Box Office #1' : 'Oscar Best Picture',
      rowLabel: film?.box_office_no1 ? 'Box Office #1' : 'Best Picture',
      title: film?.box_office_no1 || film?.oscar_best_picture,
      detail: '',
    };
  }

  if (film?.box_office_no1 || film?.oscar_best_picture) {
    return {
      label: film?.box_office_no1 ? 'Global Blockbuster' : 'Award-Winning Film',
      rowLabel: 'Biggest Film',
      title: film?.box_office_no1 || film?.oscar_best_picture,
      detail: '',
    };
  }

  return null;
}

function birthLotterySnapshot(year, data, selectedCountryCode) {
  const countryEntries = Object.entries(data?.countries || {})
    .filter(([, info]) => info && info.life_expectancy)
    .map(([code, info]) => ({
      code,
      lifeExpectancy: info.life_expectancy,
      country: COUNTRY_MAP[code] || null,
    }))
    .filter(item => item.country);

  if (countryEntries.length < 2) return null;

  countryEntries.sort((a, b) => b.lifeExpectancy - a.lifeExpectancy);
  const highest = countryEntries[0];
  const lowest = countryEntries[countryEntries.length - 1];
  const gap = +(highest.lifeExpectancy - lowest.lifeExpectancy).toFixed(1);

  let commentary = 'A birth-year lottery decided by geography alone.';
  if (selectedCountryCode === highest.code) {
    commentary = 'This country sat at the top of the life-expectancy table that year.';
  } else if (selectedCountryCode === lowest.code) {
    commentary = 'This country sat at the bottom of the life-expectancy table that year.';
  }

  return {
    gap,
    highest,
    lowest,
    commentary,
  };
}

// ---------------------------------------------------------------------------
// INLINE SVG CHART GENERATORS
// ---------------------------------------------------------------------------

// Life expectancy horizontal bar chart
// Three bars: parent country LE, child country LE, today's LE
function svgLifeExpChart(parentLE, childLE, todayLE, parentYear, childYear, accentParent, accentChild) {
  const mobile = window.innerWidth <= 640;
  const W = mobile ? 380 : 600;
  const scale = W / 600;
  const H = 220;
  const padL = Math.round(20 * scale);
  const padR = Math.round(116 * scale);
  const padT = 32;
  const padB = 20;
  const barH = 32;
  const gap  = 22;
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
  <text x="${padL}" y="${y0 - 8}" font-family="Inter,system-ui,sans-serif" font-size="14" fill="${labelColor}" letter-spacing="0.08em" text-transform="uppercase">THEIR BIRTH YEAR (${parentYear})</text>
  <rect x="${padL}" y="${y0}" width="${bw0}" height="${barH}" rx="4" fill="${accentParent}" opacity="0.85"/>
  <text x="${padL + bw0 + 8}" y="${y0 + barH / 2 + 5}" font-family="Inter,system-ui,sans-serif" font-size="17" font-weight="600" fill="${textColor}">${parentLE} yrs</text>

  <text x="${padL}" y="${y1 - 8}" font-family="Inter,system-ui,sans-serif" font-size="14" fill="${labelColor}" letter-spacing="0.08em">YOUR BIRTH YEAR (${childYear})</text>
  <rect x="${padL}" y="${y1}" width="${bw1}" height="${barH}" rx="4" fill="${accentChild}" opacity="0.85"/>
  <text x="${padL + bw1 + 8}" y="${y1 + barH / 2 + 5}" font-family="Inter,system-ui,sans-serif" font-size="17" font-weight="600" fill="${textColor}">${childLE} yrs</text>

  <text x="${padL}" y="${y2 - 8}" font-family="Inter,system-ui,sans-serif" font-size="14" fill="${labelColor}" letter-spacing="0.08em">TODAY (2024)</text>
  <rect x="${padL}" y="${y2}" width="${bw2}" height="${barH}" rx="4" fill="${neutralColor}" opacity="0.7"/>
  <text x="${padL + bw2 + 8}" y="${y2 + barH / 2 + 5}" font-family="Inter,system-ui,sans-serif" font-size="17" font-weight="600" fill="${textColor}">${todayLE} yrs</text>
</svg>`;
}

// Price comparison grouped bar chart
// For each item: two bars side by side (parent year vs child year), inflation-adjusted
function svgPriceChart(priceItems, accentParent, accentChild) {
  if (!priceItems || priceItems.length === 0) return '';

  const mobile = window.innerWidth <= 640;
  const W = mobile ? 380 : 600;
  const scale = W / 600;

  const itemCount = priceItems.length;
  const groupH = 56;
  const padT   = 12;
  const padB   = 30;
  const padL   = Math.round(130 * scale);
  const padR   = Math.round(20 * scale);
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
  <text x="${padL - 8}" y="${yBase + barH + barGap / 2 + 4}" font-family="Inter,system-ui,sans-serif" font-size="14" fill="${labelColor}" text-anchor="end">${labelText}</text>
  <rect x="${padL}" y="${yP}" width="${wP}" height="${barH}" rx="3" fill="${accentParent}" opacity="0.8"/>
  <text x="${padL + wP + 5}" y="${yP + barH - 4}" font-family="Inter,system-ui,sans-serif" font-size="13" fill="${textColor}">${valLabelP}</text>
  <rect x="${padL}" y="${yC}" width="${wC}" height="${barH}" rx="3" fill="${accentChild}" opacity="0.8"/>
  <text x="${padL + wC + 5}" y="${yC + barH - 4}" font-family="Inter,system-ui,sans-serif" font-size="13" fill="${textColor}">${valLabelC}</text>`;
  });

  // Legend at bottom - second legend item offset scaled proportionally from original 130px gap
  const legendGap = Math.round(130 * scale);
  const legendY = padT + itemCount * groupH + 8;
  const legend  = `
  <rect x="${padL}" y="${legendY}" width="10" height="10" rx="2" fill="${accentParent}" opacity="0.8"/>
  <text x="${padL + 14}" y="${legendY + 9}" font-family="Inter,system-ui,sans-serif" font-size="13" fill="${labelColor}">Their generation</text>
  <rect x="${padL + legendGap}" y="${legendY}" width="10" height="10" rx="2" fill="${accentChild}" opacity="0.8"/>
  <text x="${padL + legendGap + 14}" y="${legendY + 9}" font-family="Inter,system-ui,sans-serif" font-size="13" fill="${labelColor}">Your generation</text>`;

  return `<svg viewBox="0 0 ${W} ${H + 20}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;">${bars}${legend}
</svg>`;
}

// Population timeline: 3 points on a simple line
function svgPopulationChart(parentPop, childPop, todayPop, parentYear, childYear) {
  const mobile = window.innerWidth <= 640;
  const W   = mobile ? 380 : 600;
  const scale = W / 600;
  const H   = 180;
  const padL = Math.round(72 * scale);
  const padR = Math.round(72 * scale);
  const padT = 44;
  const padB = 36;

  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxPop = Math.max(parentPop, childPop, todayPop) * 1.15;
  const minPop = Math.min(parentPop, childPop, todayPop) * 0.85;
  const range  = maxPop - minPop || 1; // Fix 5: guard against division by zero when all values equal

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
    const labelY = ys[i] > padT + 25 ? ys[i] - 12 : ys[i] + 24;
    dotsSvg += `
  <circle cx="${xs[i]}" cy="${ys[i]}" r="5" fill="${dotColor}"/>
  <text x="${xs[i]}" y="${labelY}" font-family="Inter,system-ui,sans-serif" font-size="16" font-weight="600" fill="${textColor}" text-anchor="middle">${p.label}</text>
  <text x="${xs[i]}" y="${padT + chartH + 18}" font-family="Inter,system-ui,sans-serif" font-size="14" fill="${labelColor}" text-anchor="middle">${p.year}</text>`;
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
  const mobile = window.innerWidth <= 640;
  const W    = mobile ? 380 : 600;
  const scale = W / 600;
  const H    = 180;
  const padL = Math.round(40 * scale);
  const padR = Math.round(40 * scale);
  const padT = 18;
  const padB = 42;

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
  <text x="${xP + barW / 2}" y="${yP - 8}" font-family="Inter,system-ui,sans-serif" font-size="17" font-weight="600" fill="${textColor}" text-anchor="middle">${valP}</text>
  <text x="${xP + barW / 2}" y="${yBL + 18}" font-family="Inter,system-ui,sans-serif" font-size="14" fill="${labelColor}" text-anchor="middle">${parentYear}</text>

  <rect x="${xC}" y="${yC}" width="${barW}" height="${hC}" rx="4" fill="${accentChild}" opacity="0.85"/>
  <text x="${xC + barW / 2}" y="${yC - 8}" font-family="Inter,system-ui,sans-serif" font-size="17" font-weight="600" fill="${textColor}" text-anchor="middle">${valC}</text>
  <text x="${xC + barW / 2}" y="${yBL + 18}" font-family="Inter,system-ui,sans-serif" font-size="14" fill="${labelColor}" text-anchor="middle">${childYear}</text>

  <line x1="${padL}" y1="${yBL}" x2="${W - padR}" y2="${yBL}" stroke="#2d2d40" stroke-width="1"/>
  <text x="${W / 2}" y="${yBL + 36}" font-family="Inter,system-ui,sans-serif" font-size="13" fill="${labelColor}" text-anchor="middle">GDP per capita - inflation-adjusted to 2024 dollars</text>
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
    if (!events || events.length === 0) return '<p class="timeline-empty">A quieter year in the history books.</p>';
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
  const results = await Promise.allSettled([
    fetch('../data/' + parentYear + '.json').then(r => {
      if (!r.ok) throw new Error('No data for ' + parentYear);
      return r.json();
    }),
    fetch('../data/' + childYear + '.json').then(r => {
      if (!r.ok) throw new Error('No data for ' + childYear);
      return r.json();
    }),
  ]);
  if (results[0].status === 'rejected') throw new Error(results[0].reason.message);
  if (results[1].status === 'rejected') throw new Error(results[1].reason.message);
  return { parentData: results[0].value, childData: results[1].value };
}

// ---------------------------------------------------------------------------
// MAIN RENDER FUNCTION
// ---------------------------------------------------------------------------

function renderComparison(parentYear, childYear, parentCountryCode, childCountryCode, parentData, childData) {
  const parentCountry = COUNTRY_MAP[parentCountryCode] || COUNTRIES[0];
  const childCountry  = COUNTRY_MAP[childCountryCode]  || COUNTRIES[0];
  const explicitCountries = _hasExplicitCountries;
  const cpiP = CPI_TO_2024[parentYear] || 1;
  const cpiC = CPI_TO_2024[childYear] || 1;

  const parentCountryData = parentData.countries?.[parentCountryCode] || {};
  const childCountryData  = childData.countries?.[childCountryCode]   || {};

  const accentP = getAccentForYear(parentYear);
  const accentC = getAccentForYear(childYear);

  const sections = [];
  const countryDisplayP = displayCountryName(parentCountry, parentYear);
  const countryDisplayC = displayCountryName(childCountry, childYear);
  const sameCountry = parentCountryCode === childCountryCode;
  const filteredWorldEventsP = selectWorldEvents(parentYear, parentData.world_events || [], parentCountryCode, 3);
  const filteredWorldEventsC = selectWorldEvents(childYear, childData.world_events || [], childCountryCode, 3);

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

  if (explicitCountries) {
    const countryPopP = parentCountryData.population_millions;
    const countryPopC = childCountryData.population_millions;

    if (countryPopP && countryPopC) {
      sections.push(compareCard({
        eyebrow: sameCountry
          ? parentCountry.flag + ' Country Population'
          : parentCountry.flag + ' / ' + childCountry.flag + ' Country Population',
        headline: 'How large the selected country was',
        parent: {
          label: String(parentYear),
          value: formatPopulationValue(countryPopP),
          desc: 'people in ' + countryDisplayP,
        },
        child: {
          label: String(childYear),
          value: formatPopulationValue(countryPopC),
          desc: 'people in ' + countryDisplayC,
        },
        delta: sameCountry
          ? {
              text: signedPct(((countryPopC - countryPopP) / countryPopP) * 100) + ' population growth between generations',
              type: 'neutral',
            }
          : null,
        commentary: sameCountry
          ? 'This shows how much the country itself grew between the two generations.'
          : 'Two different national stories, shown side by side without pretending they are the same trajectory.',
      }));
    }

    const countryEventP = COUNTRY_EVENTS[parentCountryCode]?.[parentYear] || null;
    const countryEventC = COUNTRY_EVENTS[childCountryCode]?.[childYear] || null;

    if (countryEventP || countryEventC) {
      sections.push(textTimelineCard({
        eyebrow: sameCountry
          ? parentCountry.flag + ' ' + countryDisplayP
          : parentCountry.flag + ' ' + countryDisplayP + ' / ' + childCountry.flag + ' ' + countryDisplayC,
        headline: sameCountry ? 'That year in the country' : 'What was happening in each selected country',
        parentYear,
        childYear,
        parentText: countryEventP,
        childText: countryEventC,
      }));
    }

    // -----------------------------------------------------------------------
    // SECTION 2: COUNTRY LEADERS - each side uses its own country
    // -----------------------------------------------------------------------

    let parentLeaderInfo = LEADER_KEYS[parentCountryCode] || LEADER_KEYS.US;
    let childLeaderInfo  = LEADER_KEYS[childCountryCode]  || LEADER_KEYS.US;

    const leaderP = parentData.leaders?.[parentLeaderInfo.key]
      || parentCountryData.leader
      || null;
    const leaderC = childData.leaders?.[childLeaderInfo.key]
      || childCountryData.leader
      || null;

    const leaderEyebrow = parentCountryCode === childCountryCode
      ? parentCountry.flag + ' ' + countryDisplayP + ' Leadership'
      : parentCountry.flag + ' ' + countryDisplayP + ' / ' + childCountry.flag + ' ' + countryDisplayC + ' Leadership';

    if (leaderP && leaderC) {
      sections.push(compareCard({
        eyebrow: leaderEyebrow,
        headline: 'Who was in charge',
        parent: {
          label: String(parentYear),
          value: leaderP,
          desc: parentLeaderInfo.title + ' of ' + countryDisplayP,
        },
        child: {
          label: String(childYear),
          value: leaderC,
          desc: childLeaderInfo.title + ' of ' + countryDisplayC,
        },
      }));
    }

    // -----------------------------------------------------------------------
    // SECTION 3: LIFE EXPECTANCY - each side uses its own country
    // Do not fall back to world average - it would be presented as country-specific data
    // -----------------------------------------------------------------------

    const lifeP = parentCountryData.life_expectancy || null;
    const lifeC = childCountryData.life_expectancy  || null;

    const sameCountryLE = (parentCountryCode === childCountryCode);

    if (lifeP && lifeC) {
    // Birth lottery: highest vs lowest country gap (always useful regardless of country comparison)
    const allCountries = Object.keys(parentData.countries || {});
    const lifeValsP = allCountries.map(k => parentData.countries[k].life_expectancy).filter(Boolean);
    const lifeValsC = allCountries.map(k => childData.countries?.[k]?.life_expectancy).filter(Boolean);
    const gapP = lifeValsP.length >= 2 ? (Math.max(...lifeValsP) - Math.min(...lifeValsP)).toFixed(1) : null;
    const gapC = lifeValsC.length >= 2 ? (Math.max(...lifeValsC) - Math.min(...lifeValsC)).toFixed(1) : null;

    // Only compute a "generational change" delta when both sides represent the same country
    // Cross-country LE difference is a geography gap, not a generational improvement/decline
    let lifeDeltaObj = null;
    let commentary = '';

    if (sameCountryLE) {
      const lifeDelta = (lifeC - lifeP).toFixed(1);
      const betterOrWorse = parseFloat(lifeDelta) >= 0 ? 'longer' : 'shorter';
      const absLifeDelta = Math.abs(parseFloat(lifeDelta));

      commentary = absLifeDelta > 0
        ? 'Your generation can expect ' + absLifeDelta + ' years ' + betterOrWorse + ' on average than the previous one.'
        : 'Life expectancy stayed roughly flat between these generations.';

      lifeDeltaObj = {
        text: signedRaw(parseFloat(lifeDelta)) + ' years between generations',
        type: parseFloat(lifeDelta) >= 0 ? 'positive' : 'negative',
      };
    } else {
      // Cross-country: describe each country's figure independently, no delta language
      commentary = countryDisplayP + ' life expectancy at birth in ' + parentYear + ' was ' + lifeP + ' years. ' + countryDisplayC + ' life expectancy at birth in ' + childYear + ' was ' + lifeC + ' years. These reflect different countries, not generational change.';
    }

    if (gapP && gapC) {
      const gapChange = (parseFloat(gapC) - parseFloat(gapP)).toFixed(1);
      const gapDir = parseFloat(gapChange) < 0 ? 'narrowed' : 'widened';
      commentary += ' The gap between the longest- and shortest-lived countries ' + gapDir + ' from ' + gapP + ' years to ' + gapC + ' years.';
    }

    const lifeEyebrow = sameCountryLE
      ? parentCountry.flag + ' Life Expectancy'
      : parentCountry.flag + ' / ' + childCountry.flag + ' Life Expectancy';

    sections.push(compareCard({
      eyebrow: lifeEyebrow,
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
      delta: lifeDeltaObj,
      commentary,
    }));

    // Life expectancy SVG chart - use each country's today value separately
    const todayLEC = TODAY.life_expectancy[childCountryCode]  || TODAY.global_life_expectancy;
    // Chart uses child today LE as the "today" bar for reference
    sections.push(`<div class="chart-container" data-reveal>${svgLifeExpChart(lifeP, lifeC, todayLEC, parentYear, childYear, accentP, accentC)}</div>`);
  }

  // -----------------------------------------------------------------------
  // SECTION 4: THE ECONOMY (all inflation-adjusted)
  // -----------------------------------------------------------------------

  // GDP per capita - each side uses its own country's data only (no US fallback for non-US countries)
  // gdpRawP/C are null if the country has no data (e.g. pre-independence Bangladesh) - do not silently fall back to US GDP
  const gdpRawP = parentCountryData.gdp_per_capita_usd != null
    ? parentCountryData.gdp_per_capita_usd
    : (parentCountryCode === 'US' ? parentData.economy?.us_gdp_per_capita_usd : null);
  const gdpRawC = childCountryData.gdp_per_capita_usd != null
    ? childCountryData.gdp_per_capita_usd
    : (childCountryCode === 'US' ? childData.economy?.us_gdp_per_capita_usd : null);

  // Only show GDP section when both sides have real data
  const sameCountryGdp = (parentCountryCode === childCountryCode);

  if (gdpRawP && gdpRawC) {
    const gdpP = Math.round(gdpRawP * cpiP);
    const gdpC = Math.round(gdpRawC * cpiC);

    // Only compute and show a delta when both sides represent the same country
    // Cross-country GDP comparison is meaningless (different countries have different baselines)
    const gdpDelta = sameCountryGdp
      ? (() => {
          const pct = ((gdpC - gdpP) / gdpP * 100).toFixed(1);
          const betterOrWorse = parseFloat(pct) >= 0 ? 'richer' : 'poorer';
          return {
            text: signedPct(parseFloat(pct)) + ' real change - your generation was born into a ' + betterOrWorse + ' economy',
            type: parseFloat(pct) >= 0 ? 'positive' : 'negative',
          };
        })()
      : null; // no cross-country delta

    const gdpEyebrow = sameCountryGdp
      ? parentCountry.flag + ' Economy - GDP Per Capita'
      : parentCountry.flag + ' / ' + childCountry.flag + ' Economy - GDP Per Capita';

    sections.push(compareCard({
      eyebrow: gdpEyebrow,
      headline: 'Real purchasing power at birth',
      parent: {
        label: String(parentYear),
        value: '$' + Math.round(gdpP).toLocaleString(),
        desc: countryDisplayP + ' - in today\'s dollars',
      },
      child: {
        label: String(childYear),
        value: '$' + Math.round(gdpC).toLocaleString(),
        desc: countryDisplayC + ' - in today\'s dollars',
      },
      delta: gdpDelta,
      commentary: sameCountryGdp
        ? 'All figures adjusted to 2024 dollars. A positive shift means real economic growth, not just inflation.'
        : 'Figures adjusted to 2024 dollars. Each country\'s GDP shown independently - cross-country comparison reflects different economies, not generational change.',
    }));

    // GDP SVG chart
    sections.push(`<div class="chart-container" data-reveal>${svgGdpChart(gdpP, gdpC, parentYear, childYear, accentP, accentC)}</div>`);
  } else if (gdpRawP || gdpRawC) {
    // One side has GDP data, the other doesn't (e.g. pre-independence country)
    const availableGdpRaw = gdpRawP || gdpRawC;
    const availableGdp = Math.round(availableGdpRaw * (gdpRawP ? cpiP : cpiC));
    const availableYear = gdpRawP ? parentYear : childYear;
    const availableCountry = gdpRawP ? countryDisplayP : countryDisplayC;
    const unavailableCountry = gdpRawP ? countryDisplayC : countryDisplayP;
    const unavailableYear = gdpRawP ? childYear : parentYear;

    sections.push(`
      <div class="compare-card" data-reveal>
        <p class="eyebrow">${escHtml((gdpRawP ? parentCountry.flag : childCountry.flag) + ' Economy - GDP Per Capita')}</p>
        <p class="section-headline">Real purchasing power at birth</p>
        <div class="two-up">
          <div class="two-up-card">
            <span class="two-up-label">${escHtml(String(availableYear))}</span>
            <span class="two-up-value">$${Math.round(availableGdp).toLocaleString()}</span>
            <p class="two-up-desc">${escHtml(availableCountry + ' - in today\'s dollars')}</p>
          </div>
          <div class="two-up-card">
            <span class="two-up-label muted">${escHtml(String(unavailableYear))}</span>
            <span class="two-up-value" style="color:#666">N/A</span>
            <p class="two-up-desc">${escHtml('GDP data not available for ' + unavailableCountry + ' in this period')}</p>
          </div>
        </div>
      </div>
    `);
  }

  // US median household income (only when both sides are US)
  if (parentCountryCode === 'US' && childCountryCode === 'US') {
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

    // Housing affordability ratio (US only when both sides are US)
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

  // Price comparison grid (inflation-adjusted, US prices only)
  // Only show when both selected countries are US. Otherwise it becomes misleading.
  const bothAreUS  = (parentCountryCode === 'US' && childCountryCode === 'US');
  const pricesP = parentData.prices_us;
  const pricesC = childData.prices_us;

  if (bothAreUS && pricesP && pricesC) {
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
        eyebrow: 'Everyday Prices (US)',
        headline: 'What things cost then vs now',
        items: gridItems,
        note: 'All prices adjusted to 2024 dollars. This section stays US-only until equivalent local price series exist for other countries.',
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
  // SECTION 5: CULTURE - each side uses its own country
  // -----------------------------------------------------------------------

  const musicP = localMusicSelection(parentYear, parentCountryCode, parentData);
  const musicC = localMusicSelection(childYear, childCountryCode, childData);
  if (musicP && musicC) {
    const sameMusicLabel = musicP.label === musicC.label;
    sections.push(compareCard({
      eyebrow: '\uD83C\uDFB5 Music',
      headline: sameMusicLabel ? musicP.label : 'The song each generation grew up with',
      parent: {
        label: sameMusicLabel ? String(parentYear) : String(parentYear) + ' \u00B7 ' + musicP.label,
        value: musicP.title,
        desc: musicP.detail || '',
      },
      child: {
        label: sameMusicLabel ? String(childYear) : String(childYear) + ' \u00B7 ' + musicC.label,
        value: musicC.title,
        desc: musicC.detail || '',
      },
    }));
  }

  const filmP = localFilmSelection(parentYear, parentCountryCode, parentData);
  const filmC = localFilmSelection(childYear, childCountryCode, childData);
  if (filmP && filmC) {
    const sameFilmLabel = filmP.label === filmC.label;
    sections.push(compareCard({
      eyebrow: '\uD83C\uDFC6 Film',
      headline: sameFilmLabel ? filmP.label : 'The film that defined each generation',
      parent: {
        label: sameFilmLabel ? String(parentYear) : String(parentYear) + ' \u00B7 ' + filmP.label,
        value: filmP.title,
        desc: filmP.detail || '',
      },
      child: {
        label: sameFilmLabel ? String(childYear) : String(childYear) + ' \u00B7 ' + filmC.label,
        value: filmC.title,
        desc: filmC.detail || '',
      },
    }));
  }

  if (parentCountryCode === 'US' && childCountryCode === 'US') {
    const tvP = parentData.culture?.television?.most_watched_show;
    const tvC = childData.culture?.television?.most_watched_show;

    if (tvP && tvC) {
      sections.push(compareCard({
        eyebrow: '\uD83D\uDCFA Television (US)',
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
  }

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
        value: techP?.top_computer || '-',
        desc: techP?.milestone ? techP.milestone.slice(0, 80) + (techP.milestone.length > 80 ? '...' : '') : '',
      },
      child: {
        label: String(childYear),
        value: techC?.top_computer || '-',
        desc: techC?.milestone ? techC.milestone.slice(0, 80) + (techC.milestone.length > 80 ? '...' : '') : '',
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
  // VOICE THEN vs NOW (ElevenLabs affiliate)
  // -----------------------------------------------------------------------

  const decadeP = Math.floor(parentYear / 10) * 10;
  const decadeC = Math.floor(childYear / 10) * 10;
  const voiceP = VOICE_THEN[decadeP];
  const voiceC = VOICE_THEN[decadeC];

  if (voiceP || voiceC) {
    sections.push(`
      <div class="voice-then-now" data-reveal>
        ${voiceP ? `<p class="voice-then">In ${parentYear}, ${voiceP}.</p>` : ''}
        ${voiceC ? `<p class="voice-then">In ${childYear}, ${voiceC}.</p>` : ''}
        <p class="voice-now">Today, AI can recreate anyone's voice from a few minutes of audio, including yours.</p>
        <a href="https://try.elevenlabs.io/pivode" class="voice-cta" target="_blank" rel="noopener">Try it with ElevenLabs <span class="voice-cta-arrow">\u2192</span></a>
      </div>
    `);
  }

  // -----------------------------------------------------------------------
  // SECTION 7: WORLD EVENTS
  // -----------------------------------------------------------------------

  if (filteredWorldEventsP.length > 0 || filteredWorldEventsC.length > 0) {
    sections.push(dualTimeline({
      eyebrow: '\uD83C\uDF0D World Context',
      headline: 'What was happening when each generation arrived',
      parentYear,
      childYear,
      parentEvents: filteredWorldEventsP,
      childEvents: filteredWorldEventsC,
    }));
  }

  // -----------------------------------------------------------------------
  // SECTION 8: WOW FACTS
  // -----------------------------------------------------------------------

  const temporalP = findTemporalAnchor(parentYear);
  const temporalC = findTemporalAnchor(childYear);

  if (temporalP && temporalC) {
    sections.push(compareCard({
      eyebrow: '\u23F3 Time Shift',
      headline: 'What felt closer than the present',
      parent: {
        label: String(parentYear),
        value: temporalP.label,
        desc: temporalP.distance + ' years away when they were born',
      },
      child: {
        label: String(childYear),
        value: temporalC.label,
        desc: temporalC.distance + ' years away when you were born',
      },
      commentary: temporalShockLine(parentYear) + ' ' + temporalShockLine(childYear),
    }));
  }

  const socialP = summarizeSocialTimeline(parentYear);
  const socialC = summarizeSocialTimeline(childYear);
  if (socialP && socialC) {
    sections.push(compareCard({
      eyebrow: 'Social Media Timeline',
      headline: 'How old each generation was when the platform era arrived',
      parent: {
        label: String(parentYear),
        value: socialP.value,
        desc: socialP.desc,
      },
      child: {
        label: String(childYear),
        value: socialC.value,
        desc: socialC.desc,
      },
      commentary: 'The internet age did not arrive all at once. Different birth years experienced it at radically different ages.',
    }));
  }

  const wordsP = summarizeWords(parentYear) || {
    value: 'Almost none',
    desc: 'most everyday digital words already existed',
  };
  const wordsC = summarizeWords(childYear) || {
    value: 'Almost none',
    desc: 'most everyday digital words already existed',
  };

  sections.push(compareCard({
    eyebrow: 'Language',
    headline: 'Words that did not exist yet',
    parent: {
      label: String(parentYear),
      value: wordsP.value,
      desc: wordsP.desc,
    },
    child: {
      label: String(childYear),
      value: wordsC.value,
      desc: wordsC.desc,
    },
    commentary: 'The vocabulary of modern life arrived in waves. A birth year changes which ideas were not even nameable yet.',
  }));

  const lotteryP = birthLotterySnapshot(parentYear, parentData, explicitCountries ? parentCountryCode : null);
  const lotteryC = birthLotterySnapshot(childYear, childData, explicitCountries ? childCountryCode : null);

  if (lotteryP && lotteryC) {
    sections.push(compareCard({
      eyebrow: 'The Birth Lottery',
      headline: 'How much birthplace alone changed life expectancy',
      parent: {
        label: String(parentYear),
        value: lotteryP.gap + ' yrs',
        desc: displayCountryName(lotteryP.highest.country, parentYear) + ' vs ' + displayCountryName(lotteryP.lowest.country, parentYear),
      },
      child: {
        label: String(childYear),
        value: lotteryC.gap + ' yrs',
        desc: displayCountryName(lotteryC.highest.country, childYear) + ' vs ' + displayCountryName(lotteryC.lowest.country, childYear),
      },
      delta: {
        text: signedRaw(lotteryC.gap - lotteryP.gap, 1) + ' years in the global life-expectancy gap',
        type: lotteryC.gap <= lotteryP.gap ? 'positive' : 'negative',
      },
      commentary: 'Same planet, same birth year, completely different odds depending on where you arrived.',
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

  renderAt18Section(parentYear, childYear, parentCountryCode, childCountryCode, accentP, accentC, explicitCountries);
}

// ---------------------------------------------------------------------------
// WHEN YOU WERE 18 - async section
// ---------------------------------------------------------------------------

async function renderAt18Section(parentYear, childYear, parentCountryCode, childCountryCode, accentP, accentC, explicitCountries) {
  const parentAt18 = parentYear + 18;
  const childAt18  = childYear  + 18;

  // Only show the section when both sides have data - asymmetric cards look bad
  const parentAt18Valid = parentAt18 >= YEAR_MIN && parentAt18 <= AT18_YEAR_MAX && !YEAR_GAPS.has(parentAt18);
  const childAt18Valid  = childAt18  >= YEAR_MIN && childAt18  <= AT18_YEAR_MAX && !YEAR_GAPS.has(childAt18);
  if (!parentAt18Valid || !childAt18Valid) return;

  let parentAt18Data = null, childAt18Data = null;
  const fetches = [];
  if (parentAt18Valid) fetches.push(fetch('../data/' + parentAt18 + '.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }));
  else fetches.push(Promise.resolve(null));
  if (childAt18Valid) fetches.push(fetch('../data/' + childAt18 + '.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }));
  else fetches.push(Promise.resolve(null));
  const results = await Promise.allSettled(fetches);
  parentAt18Data = results[0].status === 'fulfilled' ? results[0].value : null;
  childAt18Data  = results[1].status === 'fulfilled' ? results[1].value : null;

  const cpiP18 = CPI_TO_2024[parentAt18] || 1;
  const cpiC18 = CPI_TO_2024[childAt18]  || 1;

  function at18Card(year, data, cpiYear, accentColor, pillClass, pillLabel, isValid, countryCode, useCountryContext, isChild) {
    if (!isValid || !data) {
      const currentYear = new Date().getFullYear();
      const fallbackText = isChild
        ? (year > currentYear
          ? 'You\'ll turn 18 in ' + year + '.'
          : 'You turned 18 in ' + year + ' - a year you know well.')
        : (year > currentYear
          ? 'They\'ll turn 18 in ' + year + '.'
          : 'They turned 18 in ' + year + ' - a formative year from another era.');
      return `<div class="at18-col">
      <div class="at18-col-header">
        <span class="gen-pill ${pillClass}">${escHtml(pillLabel)}</span>
        <p class="at18-year" style="color:${accentColor}">${year}</p>
        <p class="at18-age-caption">${isChild ? 'When you turned 18' : 'When they turned 18'}</p>
      </div>
      <div class="at18-rows"><div class="at18-row" style="display:block"><span class="at18-row-value" style="color:#888;font-style:italic">${fallbackText}</span></div></div>
    </div>`;
    }

    const tv      = data.culture?.television;
    const tech    = data.technology;
    const effectiveCountryCode = useCountryContext ? countryCode : null;
    const countryD = effectiveCountryCode ? (data.countries?.[effectiveCountryCode] || {}) : {};

    // Leader: check country-level first, then leaders lookup (skip if unknown)
    const leaderInfo = effectiveCountryCode ? (LEADER_KEYS[effectiveCountryCode] || LEADER_KEYS.US) : null;
    const leader = leaderInfo ? (data.leaders?.[leaderInfo.key] || countryD.leader || null) : null;

    // Gas price inflation-adjusted to 2024 dollars
    const gasRaw   = data.prices_us?.gallon_gas_usd;
    const gasFinal = (effectiveCountryCode === 'US' && gasRaw) ? ('$' + (gasRaw * cpiYear).toFixed(2)) : null;

    const musicSelection = localMusicSelection(year, effectiveCountryCode, data);
    const filmSelection = localFilmSelection(year, effectiveCountryCode, data);
    const countryEvent = effectiveCountryCode ? (COUNTRY_EVENTS[effectiveCountryCode]?.[year] || null) : null;
    const countrySnapshot = effectiveCountryCode && !countryEvent
      ? countrySnapshotLine(effectiveCountryCode, year, countryD)
      : null;

    // TV data is US-only; only show it for US cards
    const tvShow  = (effectiveCountryCode === 'US') ? tv?.most_watched_show : null;
    const techMil = tech?.milestone;
    const events  = selectWorldEvents(year, data.world_events || [], effectiveCountryCode || '', 2, {
      avoidTexts: [techMil, countryEvent],
    });

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

    const songDisplay = musicSelection
      ? musicSelection.title + (musicSelection.detail ? ' - ' + musicSelection.detail : '')
      : null;
    const movieDisplay = filmSelection
      ? filmSelection.title + (filmSelection.detail ? ' (' + filmSelection.detail + ')' : '')
      : null;

    const rows = [
      row('\uD83C\uDFB5', musicSelection?.rowLabel || '#1 Song', songDisplay),
      row('\uD83C\uDFAC', filmSelection?.rowLabel || 'Biggest Film', movieDisplay),
      row('\uD83D\uDCFA', 'Top TV Show',  tvShow),
      row('\uD83C\uDFF3\uFE0F', 'Country Event', countryEvent),
      row('\uD83D\uDCCD', 'Country Context', countrySnapshot),
      row('\uD83D\uDCBB', 'Technology',   techMil || null),
      row('\uD83C\uDF0D', 'Global Event', countryEvent ? null : bigEvent),
      row('\u26FD',       'Gas (2024$)',  gasFinal),
      row('\uD83D\uDC64', leaderInfo ? leaderInfo.title : '', leader),
    ].filter(Boolean).join('');

    return `<div class="at18-col">
      <div class="at18-col-header">
        <span class="gen-pill ${pillClass}">${escHtml(pillLabel)}</span>
        <p class="at18-year" style="color:${accentColor}">${year}</p>
        <p class="at18-age-caption">${isChild ? 'When you turned 18' : 'When they turned 18'}</p>
      </div>
      <div class="at18-rows">${rows}</div>
    </div>`;
  }

  const parentCard = at18Card(parentAt18, parentAt18Data, cpiP18, accentP, 'gen-pill--parent', 'Their 18th', parentAt18Valid, parentCountryCode, explicitCountries, false);
  const childCard  = at18Card(childAt18,  childAt18Data,  cpiC18, accentC, 'gen-pill--child',  'Your 18th',  childAt18Valid,  childCountryCode, explicitCountries, true);

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
  const { parentYear, childYear, parentCountryCode, childCountryCode, parentData, childData, hasExplicitCountries } = _lastCompare;

  const parentCountry = COUNTRY_MAP[parentCountryCode] || COUNTRIES[0];
  const childCountry  = COUNTRY_MAP[childCountryCode]  || COUNTRIES[0];
  const accentP = getAccentForYear(parentYear);
  const accentC = getAccentForYear(childYear);
  const cpiP = CPI_TO_2024[parentYear] || 1;
  const cpiC = CPI_TO_2024[childYear] || 1;

  // Life expectancy delta - each side uses its own country (no world avg fallback)
  const parentCountryData = parentData.countries?.[parentCountryCode] || {};
  const childCountryData  = childData.countries?.[childCountryCode]   || {};
  const lifeP = parentCountryData.life_expectancy || null;
  const lifeC = childCountryData.life_expectancy  || null;
  const lifeDelta = (lifeP && lifeC) ? (lifeC - lifeP).toFixed(1) : null;

  // GDP real change - no US fallback for non-US countries; no cross-country delta
  const shareGdpRawP = parentCountryData.gdp_per_capita_usd != null
    ? parentCountryData.gdp_per_capita_usd
    : (parentCountryCode === 'US' ? parentData.economy?.us_gdp_per_capita_usd : null);
  const shareGdpRawC = childCountryData.gdp_per_capita_usd != null
    ? childCountryData.gdp_per_capita_usd
    : (childCountryCode === 'US' ? childData.economy?.us_gdp_per_capita_usd : null);
  const sameCountryShare = (parentCountryCode === childCountryCode);
  // Only show a GDP delta stat when same country (cross-country is not a generational comparison)
  const gdpChangePct = (shareGdpRawP && shareGdpRawC && sameCountryShare)
    ? (((shareGdpRawC * cpiC) - (shareGdpRawP * cpiP)) / (shareGdpRawP * cpiP) * 100).toFixed(1)
    : null;

  // Life expectancy delta only meaningful within the same country
  const lifeDeltaForShare = (lifeP && lifeC && sameCountryShare) ? lifeDelta : null;

  // Population change (world-level, same for both)
  const popP = parentData.world?.population_billions;
  const popC = childData.world?.population_billions;
  const popChangePct = (popP && popC) ? ((popC - popP) / popP * 100).toFixed(1) : null;
  const co2P = CO2_PPM[parentYear];
  const co2C = CO2_PPM[childYear];

  const stats = [
    hasExplicitCountries && lifeP && lifeC && lifeDeltaForShare && { icon: '\u2764\uFE0F', label: 'Life expectancy', value: signedRaw(parseFloat(lifeDeltaForShare)) + ' yrs between generations' },
    hasExplicitCountries && shareGdpRawP && shareGdpRawC && gdpChangePct && { icon: '\uD83D\uDCB0', label: 'GDP per capita (real)', value: signedPct(parseFloat(gdpChangePct)) + ' change (2024 dollars)' },
    popP     && popC     && { icon: '\uD83C\uDF0D', label: 'World population',       value: popP.toFixed(2) + 'B to ' + popC.toFixed(2) + 'B (' + signedPct(parseFloat(popChangePct)) + ')' },
    !hasExplicitCountries && co2P && co2C && { icon: '\u2601\uFE0F', label: 'Atmosphere', value: co2P + ' ppm to ' + co2C + ' ppm' },
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

  // Show both flags; if same country, show once
  const flagDisplay = !hasExplicitCountries
    ? '\uD83C\uDF0D'
    : (parentCountryCode === childCountryCode
      ? parentCountry.flag
      : parentCountry.flag + ' ' + childCountry.flag);

  $shareCard.style.setProperty('--sc-accent', accentP);
  $shareCard.style.setProperty('--sc-accent-child', accentC);
  $shareCard.innerHTML = `
    <div class="sc-inner">
      <div class="sc-header">
        <p class="sc-flag">${flagDisplay}</p>
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
// COUNTRY SELECTORS (parent and child, independent)
// ---------------------------------------------------------------------------

function buildCountryListHTML(selectedCode, filter) {
  const filtered = filter
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
    : COUNTRIES;

  return filtered.map(c => `
    <li role="option"
        class="country-option${c.code === selectedCode ? ' selected' : ''}"
        aria-selected="${c.code === selectedCode ? 'true' : 'false'}"
        data-code="${escHtml(c.code)}">
      <span class="flag">${c.flag}</span>
      <span class="country-name">${escHtml(c.name)}</span>
    </li>
  `).join('');
}

function setCountryDisplay(displayEl, country) {
  displayEl.innerHTML = `
    <span class="flag">${country.flag}</span>
    <span class="country-name">${escHtml(country.name)}</span>
  `;
}

// Update directory links when country selection changes
function updateCompareDirectoryLinks() {
  const dir = document.getElementById('compare-directory');
  if (!dir) return;
  const bothUS = selectedParentCountry.code === 'US' && selectedChildCountry.code === 'US';
  const useStaticCompareLinks = !_hasExplicitCountries && bothUS;
  dir.querySelectorAll('.directory-links a').forEach(a => {
    const text = a.textContent.trim();
    // Compare links: "YYYY vs YYYY"
    const cmpMatch = text.match(/^(\d{4})\s+vs\s+(\d{4})$/);
    if (cmpMatch) {
      if (useStaticCompareLinks) {
        a.href = `/born-in/compare/${cmpMatch[1]}-vs-${cmpMatch[2]}/`;
      } else {
        a.href = `/born-in/compare/?parent=${cmpMatch[1]}&child=${cmpMatch[2]}&pcountry=${selectedParentCountry.code}&ccountry=${selectedChildCountry.code}`;
      }
      return;
    }
    // Individual year links: "YYYY"
    const yrMatch = text.match(/^(\d{4})$/);
    if (yrMatch) {
      if (selectedChildCountry.code === 'US') {
        a.href = `/born-in/${yrMatch[1]}/`;
      } else {
        a.href = `/born-in/?year=${yrMatch[1]}&country=${selectedChildCountry.code}`;
      }
    }
  });
}

// Parent dropdown
function openParentCountryDropdown() {
  $parentCountryDropdown.classList.remove('hidden');
  $parentCountryBtn.setAttribute('aria-expanded', 'true');
  $parentCountryList.innerHTML = buildCountryListHTML(selectedParentCountry.code, '');
  const rect = $parentCountryBtn.getBoundingClientRect();
  const dropdownHeight = Math.min(300, window.innerHeight * 0.5);
  const spaceBelow = window.innerHeight - rect.bottom;
  if (spaceBelow < dropdownHeight) {
    $parentCountryDropdown.classList.add('dropdown-flip');
  } else {
    $parentCountryDropdown.classList.remove('dropdown-flip');
  }
  $parentCountrySearch.focus();
}

function closeParentCountryDropdown() {
  $parentCountryDropdown.classList.add('hidden');
  $parentCountryDropdown.classList.remove('dropdown-flip');
  $parentCountryBtn.setAttribute('aria-expanded', 'false');
  $parentCountrySearch.value = '';
}

$parentCountryBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  // Close child dropdown if open
  closeChildCountryDropdown();
  if ($parentCountryDropdown.classList.contains('hidden')) {
    openParentCountryDropdown();
  } else {
    closeParentCountryDropdown();
  }
});

$parentCountrySearch.addEventListener('input', () => {
  $parentCountryList.innerHTML = buildCountryListHTML(selectedParentCountry.code, $parentCountrySearch.value);
});

$parentCountryList.addEventListener('click', (e) => {
  const li = e.target.closest('.country-option');
  if (!li) return;
  const code = li.dataset.code;
  const match = COUNTRY_MAP[code];
  if (match) {
    selectedParentCountry = match;
    _hasExplicitCountries = true;
    setCountryDisplay($parentCountryDisplay, match);
    closeParentCountryDropdown();
    updateCompareDirectoryLinks();
  }
});

// Child dropdown
function openChildCountryDropdown() {
  $childCountryDropdown.classList.remove('hidden');
  $childCountryBtn.setAttribute('aria-expanded', 'true');
  $childCountryList.innerHTML = buildCountryListHTML(selectedChildCountry.code, '');
  const rect = $childCountryBtn.getBoundingClientRect();
  const dropdownHeight = Math.min(300, window.innerHeight * 0.5);
  const spaceBelow = window.innerHeight - rect.bottom;
  if (spaceBelow < dropdownHeight) {
    $childCountryDropdown.classList.add('dropdown-flip');
  } else {
    $childCountryDropdown.classList.remove('dropdown-flip');
  }
  $childCountrySearch.focus();
}

function closeChildCountryDropdown() {
  $childCountryDropdown.classList.add('hidden');
  $childCountryDropdown.classList.remove('dropdown-flip');
  $childCountryBtn.setAttribute('aria-expanded', 'false');
  $childCountrySearch.value = '';
}

$childCountryBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  // Close parent dropdown if open
  closeParentCountryDropdown();
  if ($childCountryDropdown.classList.contains('hidden')) {
    openChildCountryDropdown();
  } else {
    closeChildCountryDropdown();
  }
});

$childCountrySearch.addEventListener('input', () => {
  $childCountryList.innerHTML = buildCountryListHTML(selectedChildCountry.code, $childCountrySearch.value);
});

$childCountryList.addEventListener('click', (e) => {
  const li = e.target.closest('.country-option');
  if (!li) return;
  const code = li.dataset.code;
  const match = COUNTRY_MAP[code];
  if (match) {
    selectedChildCountry = match;
    _hasExplicitCountries = true;
    setCountryDisplay($childCountryDisplay, match);
    closeChildCountryDropdown();
    updateCompareDirectoryLinks();
  }
});

// Click-outside closes whichever dropdown is open
document.addEventListener('click', (e) => {
  if (!$parentCountryDropdown.classList.contains('hidden') &&
      !$parentCountryBtn.contains(e.target) &&
      !$parentCountryDropdown.contains(e.target)) {
    closeParentCountryDropdown();
  }
  if (!$childCountryDropdown.classList.contains('hidden') &&
      !$childCountryBtn.contains(e.target) &&
      !$childCountryDropdown.contains(e.target)) {
    closeChildCountryDropdown();
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

function showResult(parentYear, childYear, parentCountryCode, childCountryCode, parentData, childData) {
  _lastCompare = { parentYear, childYear, parentCountryCode, childCountryCode, parentData, childData, hasExplicitCountries: _hasExplicitCountries };

  applyAccents(parentYear, childYear);

  $landing.classList.add('hidden');
  $errorPanel.classList.add('hidden');

  const parentCountry = COUNTRY_MAP[parentCountryCode] || COUNTRIES[0];
  const childCountry  = COUNTRY_MAP[childCountryCode]  || COUNTRIES[0];
  $headerLabel.innerHTML = '<span class="cmp-header-parent">' + escHtml(String(parentYear)) + '</span> vs <span class="cmp-header-child">' + escHtml(String(childYear)) + '</span>';

  if (!_hasExplicitCountries) {
    $headerCountries.innerHTML = '\uD83C\uDF0D <span class="country-name">Global context</span>';
  } else if (parentCountryCode === childCountryCode) {
    $headerCountries.innerHTML = parentCountry.flag + ' <span class="country-name">' + escHtml(parentCountry.name) + '</span>';
  } else {
    $headerCountries.innerHTML = parentCountry.flag + ' <span class="country-name">' + escHtml(parentCountry.name) + '</span>' +
      ' / ' + childCountry.flag + ' <span class="country-name">' + escHtml(childCountry.name) + '</span>';
  }

  renderComparison(parentYear, childYear, parentCountryCode, childCountryCode, parentData, childData);

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

  const needsSwap = parentYear > childYear;
  const [py, cy] = needsSwap ? [childYear, parentYear] : [parentYear, childYear];
  const pCountry = needsSwap ? selectedChildCountry : selectedParentCountry;
  const cCountry = needsSwap ? selectedParentCountry : selectedChildCountry;

  const submitBtn = document.getElementById('cmp-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.querySelector('.submit-text').textContent = 'Loading...';
  }

  try {
    const { parentData, childData } = await loadBothYears(py, cy);
    _hasExplicitCountries = true;
    updateUrl(py, cy, pCountry.code, cCountry.code);
    showResult(py, cy, pCountry.code, cCountry.code, parentData, childData);
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

function updateUrl(parentYear, childYear, parentCountryCode, childCountryCode) {
  const params = new URLSearchParams({
    parent: parentYear,
    child: childYear,
    pcountry: parentCountryCode,
    ccountry: childCountryCode,
  });
  const newUrl = window.location.pathname + '?' + params.toString();
  history.pushState({ parent: parentYear, child: childYear, pcountry: parentCountryCode, ccountry: childCountryCode }, '', newUrl);
  // Track SPA page view in GoatCounter
  if (window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({ path: newUrl, event: false });
  }
}

async function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const parentParam   = params.get('parent');
  const childParam    = params.get('child');
  const pcountryParam = params.get('pcountry');
  const ccountryParam = params.get('ccountry');
  // Also support legacy single ?country= param
  const legacyCountry = params.get('country');

  if (!parentParam || !childParam) return;

  const py = parseInt(parentParam, 10);
  const cy = parseInt(childParam, 10);

  if (isNaN(py) || isNaN(cy)) return;
  if (py < YEAR_MIN || py > YEAR_MAX || cy < YEAR_MIN || cy > YEAR_MAX) return;
  if (YEAR_GAPS.has(py) || YEAR_GAPS.has(cy)) return;
  if (Math.abs(cy - py) < 15) return;

  _hasExplicitCountries = Boolean(pcountryParam || ccountryParam || legacyCountry);

  // Resolve parent country
  const resolvedPCountry = (pcountryParam && COUNTRY_MAP[pcountryParam])
    ? COUNTRY_MAP[pcountryParam]
    : (legacyCountry && COUNTRY_MAP[legacyCountry]) ? COUNTRY_MAP[legacyCountry] : COUNTRIES[0];

  // Resolve child country
  const resolvedCCountry = (ccountryParam && COUNTRY_MAP[ccountryParam])
    ? COUNTRY_MAP[ccountryParam]
    : (legacyCountry && COUNTRY_MAP[legacyCountry]) ? COUNTRY_MAP[legacyCountry] : COUNTRIES[0];

  const needsSwap = py > cy;
  const [parentYear, childYear] = needsSwap ? [cy, py] : [py, cy];
  if (needsSwap) {
    // Swap the resolved countries too
    selectedParentCountry = resolvedCCountry;
    selectedChildCountry  = resolvedPCountry;
  } else {
    selectedParentCountry = resolvedPCountry;
    selectedChildCountry  = resolvedCCountry;
  }
  setCountryDisplay($parentCountryDisplay, selectedParentCountry);
  setCountryDisplay($childCountryDisplay,  selectedChildCountry);
  updateCompareDirectoryLinks();

  try {
    const { parentData, childData } = await loadBothYears(parentYear, childYear);
    showResult(parentYear, childYear, selectedParentCountry.code, selectedChildCountry.code, parentData, childData);
  } catch (err) {
    console.warn('Failed to load data from URL params:', err);
    showLanding();
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
  let tweetHook = '';
  if (_lastCompare && _lastCompare.parentData && _lastCompare.childData) {
    const pLE = _lastCompare.parentData.countries?.[_lastCompare.parentCountryCode]?.life_expectancy;
    const cLE = _lastCompare.childData.countries?.[_lastCompare.childCountryCode]?.life_expectancy;
    if (pLE && cLE && _lastCompare.parentCountryCode === _lastCompare.childCountryCode) {
      const delta = Math.abs(cLE - pLE).toFixed(1);
      const dir = cLE > pLE ? 'up' : 'down';
      tweetHook = ' Life expectancy went ' + dir + ' ' + delta + ' years between these generations.';
    }
  }
  const text = 'Born in ' + parentYear + ' vs ' + childYear + '.' + tweetHook + ' What changed?';
  const url  = window.location.href;
  window.open('https://x.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank', 'noopener');
  $sharePopover.classList.add('hidden');
});

$saveCardBtn.addEventListener('click', () => {
  $sharePopover.classList.add('hidden');
  downloadShareCard();
});

function handleNew() {
  _hasExplicitCountries = true;
  showLanding();
  $parentYearInput.value = '';
  $childYearInput.value = '';
  $parentYearError.textContent = '';
  $childYearError.textContent = '';
  closeParentCountryDropdown();
  closeChildCountryDropdown();
  history.pushState(null, '', window.location.pathname);
}

$newBtn.addEventListener('click', handleNew);
$bottomNewBtn.addEventListener('click', handleNew);
$errorBackBtn.addEventListener('click', handleNew);

// ---------------------------------------------------------------------------
// BROWSER BACK/FORWARD
// ---------------------------------------------------------------------------

window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search);
  if (!params.get('parent') || !params.get('child')) {
    handleNew();
    return;
  }
  readUrlParams();
});

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------

setCountryDisplay($parentCountryDisplay, selectedParentCountry);
setCountryDisplay($childCountryDisplay,  selectedChildCountry);
updateCompareDirectoryLinks();

// Directory toggle
const $dirToggle = document.getElementById('directory-toggle');
const $dirNav = document.getElementById('compare-directory');
if ($dirToggle && $dirNav) {
  $dirToggle.addEventListener('click', () => {
    const expanded = $dirNav.classList.toggle('expanded');
    $dirToggle.setAttribute('aria-expanded', expanded);
  });
}

readUrlParams();
