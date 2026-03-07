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
  { year: 1923, label: 'the founding of the Turkish Republic' },
  { year: 1929, label: 'the Great Depression' },
  { year: 1945, label: 'the end of World War II' },
  { year: 1947, label: 'India\'s independence' },
  { year: 1953, label: 'the Korean War armistice' },
  { year: 1955, label: 'Rosa Parks refusing to give up her seat' },
  { year: 1963, label: 'the assassination of JFK' },
  { year: 1969, label: 'the moon landing' },
  { year: 1989, label: 'the fall of the Berlin Wall' },
  { year: 1989, label: 'the Tiananmen Square protests' },
  { year: 1990, label: 'Nelson Mandela\'s release from prison' },
  { year: 1991, label: 'the dissolution of the Soviet Union' },
  { year: 1994, label: 'Nelson Mandela becoming South Africa\'s president' },
  { year: 2001, label: '9/11' },
  { year: 2004, label: 'the Indian Ocean tsunami' },
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
  1954: { boys: ['Michael','Robert','James'],       girls: ['Mary','Linda','Deborah'] },
  1955: { boys: ['Michael','David','James'],        girls: ['Mary','Deborah','Linda'] },
  1956: { boys: ['Michael','David','James'],        girls: ['Mary','Debra','Linda'] },
  1957: { boys: ['Michael','James','David'],        girls: ['Mary','Susan','Linda'] },
  1958: { boys: ['Michael','David','James'],        girls: ['Mary','Susan','Linda'] },
  1959: { boys: ['Michael','David','James'],        girls: ['Mary','Susan','Linda'] },
  1960: { boys: ['David','Michael','James'],        girls: ['Mary','Susan','Linda'] },
  1961: { boys: ['Michael','David','John'],         girls: ['Mary','Lisa','Susan'] },
  1962: { boys: ['Michael','David','John'],         girls: ['Lisa','Mary','Susan'] },
  1963: { boys: ['Michael','John','David'],         girls: ['Lisa','Mary','Susan'] },
  1964: { boys: ['Michael','John','David'],         girls: ['Lisa','Mary','Susan'] },
  1965: { boys: ['Michael','John','David'],         girls: ['Lisa','Mary','Karen'] },
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
  1998: { boys: ['Michael','Jacob','Matthew'],      girls: ['Emily','Hannah','Samantha'] },
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
  1996: { boys: ['Jack','Daniel','Thomas'],          girls: ['Sophie','Chloe','Emily'] },
  1997: { boys: ['Jack','James','Thomas'],           girls: ['Emily','Charlotte','Sophie'] },
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

// ---------------------------------------------------------------------------
// TIER 2: LOCAL SPORTS CHAMPIONS
// ---------------------------------------------------------------------------

const SPORTS_GB = {
  1950:'Portsmouth',1952:'Manchester United',1954:'Wolverhampton',1955:'Chelsea',
  1956:'Manchester United',1957:'Manchester United',1958:'Wolverhampton',1959:'Wolverhampton',
  1960:'Burnley',1961:'Tottenham Hotspur',1962:'Ipswich Town',1963:'Everton',
  1964:'Liverpool',1965:'Manchester United',1966:'Liverpool',1967:'Manchester United',
  1968:'Manchester City',1969:'Leeds United',1970:'Everton',1971:'Arsenal',
  1972:'Derby County',1973:'Liverpool',1974:'Leeds United',1975:'Derby County',
  1976:'Liverpool',1977:'Liverpool',1978:'Nottingham Forest',1979:'Liverpool',
  1980:'Liverpool',1981:'Aston Villa',1982:'Liverpool',1983:'Liverpool',
  1984:'Liverpool',1985:'Everton',1986:'Liverpool',1987:'Everton',
  1988:'Liverpool',1989:'Arsenal',1990:'Liverpool',1991:'Arsenal',
  1992:'Leeds United',1993:'Manchester United',1994:'Manchester United',
  1995:'Blackburn Rovers',1996:'Manchester United',1997:'Manchester United',
  1998:'Arsenal',1999:'Manchester United',2000:'Manchester United',
  2001:'Manchester United',2002:'Arsenal',2003:'Manchester United',
  2004:'Arsenal',2005:'Chelsea',2006:'Chelsea',2007:'Manchester United',
  2008:'Manchester United',2009:'Manchester United',2010:'Chelsea',
};
const SPORTS_GB_LEAGUE = year => year >= 1993 ? 'Premier League' : 'First Division';

const SPORTS_DE = {
  1950:'VfB Stuttgart',1952:'VfB Stuttgart',1954:'Hannover 96',1955:'Rot-Weiss Essen',
  1956:'Borussia Dortmund',1957:'Borussia Dortmund',1958:'Schalke 04',
  1959:'Eintracht Frankfurt',1960:'Hamburger SV',1961:'1. FC Nurnberg',
  1962:'1. FC Koln',1963:'Borussia Dortmund',1964:'1. FC Koln',1965:'Werder Bremen',
  1966:'TSV 1860 Munich',1967:'Eintracht Braunschweig',1968:'1. FC Nurnberg',
  1969:'Bayern Munich',1970:'Borussia Monchengladbach',1971:'Borussia Monchengladbach',
  1972:'Bayern Munich',1973:'Bayern Munich',1974:'Bayern Munich',
  1975:'Borussia Monchengladbach',1976:'Borussia Monchengladbach',
  1977:'Borussia Monchengladbach',1978:'1. FC Koln',1979:'Hamburger SV',
  1980:'Bayern Munich',1981:'Bayern Munich',1982:'Hamburger SV',1983:'Hamburger SV',
  1984:'VfB Stuttgart',1985:'Bayern Munich',1986:'Bayern Munich',1987:'Bayern Munich',
  1988:'Werder Bremen',1989:'Bayern Munich',1990:'Bayern Munich',
  1991:'1. FC Kaiserslautern',1992:'VfB Stuttgart',1993:'Werder Bremen',
  1994:'Bayern Munich',1995:'Borussia Dortmund',1996:'Borussia Dortmund',
  1997:'Bayern Munich',1998:'1. FC Kaiserslautern',1999:'Bayern Munich',
  2000:'Bayern Munich',2001:'Bayern Munich',2002:'Borussia Dortmund',
  2003:'Bayern Munich',2004:'Werder Bremen',2005:'Bayern Munich',
  2006:'Bayern Munich',2007:'VfB Stuttgart',2008:'Bayern Munich',
  2009:'VfL Wolfsburg',2010:'Bayern Munich',
};
const SPORTS_DE_LEAGUE = year => year >= 1964 ? 'Bundesliga' : 'Oberliga';

const SPORTS_FR = {
  1950:'Bordeaux',1952:'Nice',1954:'Lille',1955:'Reims',1956:'Nice',
  1957:'Saint-Etienne',1958:'Reims',1959:'Nice',1960:'Reims',1961:'Monaco',
  1962:'Reims',1963:'Monaco',1964:'Saint-Etienne',1965:'Nantes',1966:'Nantes',
  1967:'Saint-Etienne',1968:'Saint-Etienne',1969:'Saint-Etienne',1970:'Saint-Etienne',
  1971:'Marseille',1972:'Marseille',1973:'Nantes',1974:'Saint-Etienne',
  1975:'Saint-Etienne',1976:'Saint-Etienne',1977:'Nantes',1978:'Monaco',
  1979:'Strasbourg',1980:'Nantes',1981:'Saint-Etienne',1982:'Monaco',1983:'Nantes',
  1984:'Bordeaux',1985:'Bordeaux',1986:'Paris Saint-Germain',1987:'Bordeaux',
  1988:'Monaco',1989:'Marseille',1990:'Marseille',1991:'Marseille',1992:'Marseille',
  1994:'Paris Saint-Germain',1995:'Nantes',1996:'Auxerre',1997:'Monaco',
  1998:'Lens',1999:'Bordeaux',2000:'Monaco',2001:'Nantes',2002:'Lyon',
  2003:'Lyon',2004:'Lyon',2005:'Lyon',2006:'Lyon',2007:'Lyon',2008:'Lyon',
  2009:'Bordeaux',2010:'Marseille',
};
const SPORTS_FR_LEAGUE = year => year >= 2002 ? 'Ligue 1' : 'Division 1';

const SPORTS_AU = {
  1950:'Essendon',1952:'Geelong',1954:'Footscray',1955:'Melbourne',
  1956:'Melbourne',1957:'Melbourne',1958:'Collingwood',1959:'Melbourne',
  1960:'Melbourne',1961:'Hawthorn',1962:'Essendon',1963:'Geelong',
  1964:'Melbourne',1965:'Essendon',1966:'St Kilda',1967:'Richmond',
  1968:'Carlton',1969:'Richmond',1970:'Carlton',1971:'Hawthorn',
  1972:'Carlton',1973:'Richmond',1974:'Richmond',1975:'North Melbourne',
  1976:'Hawthorn',1977:'North Melbourne',1978:'Hawthorn',1979:'Carlton',
  1980:'Richmond',1981:'Carlton',1982:'Carlton',1983:'Hawthorn',
  1984:'Essendon',1985:'Essendon',1986:'Hawthorn',1987:'Carlton',
  1988:'Hawthorn',1989:'Hawthorn',1990:'Collingwood',1991:'Hawthorn',
  1992:'West Coast Eagles',1993:'Essendon',1994:'West Coast Eagles',
  1995:'Carlton',1996:'North Melbourne',1997:'Adelaide Crows',
  1998:'Adelaide Crows',1999:'North Melbourne',2000:'Essendon',
  2001:'Brisbane Lions',2002:'Brisbane Lions',2003:'Brisbane Lions',
  2004:'Port Adelaide',2005:'Sydney Swans',2006:'West Coast Eagles',
  2007:'Geelong',2008:'Hawthorn',2009:'Geelong',2010:'Collingwood',
};
const SPORTS_AU_LEAGUE = year => year >= 1990 ? 'AFL' : 'VFL';

const SPORTS_JP = {
  1950:'Mainichi Orions',1952:'Yomiuri Giants',1954:'Chunichi Dragons',
  1955:'Yomiuri Giants',1956:'Nishitetsu Lions',1957:'Nishitetsu Lions',
  1958:'Nishitetsu Lions',1959:'Nankai Hawks',1960:'Taiyo Whales',
  1961:'Yomiuri Giants',1962:'Toei Flyers',1963:'Yomiuri Giants',
  1964:'Nankai Hawks',1965:'Yomiuri Giants',1966:'Yomiuri Giants',
  1967:'Yomiuri Giants',1968:'Yomiuri Giants',1969:'Yomiuri Giants',
  1970:'Yomiuri Giants',1971:'Yomiuri Giants',1972:'Yomiuri Giants',
  1973:'Yomiuri Giants',1974:'Lotte Orions',1975:'Hankyu Braves',
  1976:'Hankyu Braves',1977:'Hankyu Braves',1978:'Yakult Swallows',
  1979:'Hiroshima Toyo Carp',1980:'Hiroshima Toyo Carp',1981:'Yomiuri Giants',
  1982:'Seibu Lions',1983:'Seibu Lions',1984:'Hiroshima Toyo Carp',
  1985:'Hanshin Tigers',1986:'Seibu Lions',1987:'Seibu Lions',1988:'Seibu Lions',
  1989:'Yomiuri Giants',1990:'Seibu Lions',1991:'Seibu Lions',1992:'Seibu Lions',
  1993:'Yakult Swallows',1994:'Yomiuri Giants',1995:'Yakult Swallows',
  1996:'Orix BlueWave',1997:'Yakult Swallows',1998:'Yokohama BayStars',
  1999:'Fukuoka Daiei Hawks',2000:'Yomiuri Giants',2001:'Yakult Swallows',
  2002:'Yomiuri Giants',2003:'Fukuoka Daiei Hawks',2004:'Seibu Lions',
  2005:'Chiba Lotte Marines',2006:'Nippon-Ham Fighters',2007:'Chunichi Dragons',
  2008:'Seibu Lions',2009:'Yomiuri Giants',2010:'Chiba Lotte Marines',
};

const SPORTS_CA = {
  1950:'Detroit Red Wings',1952:'Detroit Red Wings',1954:'Detroit Red Wings',
  1955:'Detroit Red Wings',1956:'Montreal Canadiens',1957:'Montreal Canadiens',
  1958:'Montreal Canadiens',1959:'Montreal Canadiens',1960:'Montreal Canadiens',
  1961:'Chicago Blackhawks',1962:'Toronto Maple Leafs',1963:'Toronto Maple Leafs',
  1964:'Toronto Maple Leafs',1965:'Montreal Canadiens',1966:'Montreal Canadiens',
  1967:'Toronto Maple Leafs',1968:'Montreal Canadiens',1969:'Montreal Canadiens',
  1970:'Boston Bruins',1971:'Montreal Canadiens',1972:'Boston Bruins',
  1973:'Montreal Canadiens',1974:'Philadelphia Flyers',1975:'Philadelphia Flyers',
  1976:'Montreal Canadiens',1977:'Montreal Canadiens',1978:'Montreal Canadiens',
  1979:'Montreal Canadiens',1980:'New York Islanders',1981:'New York Islanders',
  1982:'New York Islanders',1983:'New York Islanders',1984:'Edmonton Oilers',
  1985:'Edmonton Oilers',1986:'Montreal Canadiens',1987:'Edmonton Oilers',
  1988:'Edmonton Oilers',1989:'Calgary Flames',1990:'Edmonton Oilers',
  1991:'Pittsburgh Penguins',1992:'Pittsburgh Penguins',1993:'Montreal Canadiens',
  1994:'New York Rangers',1995:'New Jersey Devils',1996:'Colorado Avalanche',
  1997:'Detroit Red Wings',1998:'Detroit Red Wings',1999:'Dallas Stars',
  2000:'New Jersey Devils',2001:'Colorado Avalanche',2002:'Detroit Red Wings',
  2003:'New Jersey Devils',2004:'Tampa Bay Lightning',2005:'Lockout',2006:'Carolina Hurricanes',
  2007:'Anaheim Ducks',2008:'Detroit Red Wings',2009:'Pittsburgh Penguins',
  2010:'Chicago Blackhawks',
};

const SPORTS_BR = {
  1959:'Bahia',1960:'Palmeiras',1961:'Santos',1962:'Santos',1963:'Santos',
  1964:'Santos',1965:'Santos',1966:'Cruzeiro',1967:'Palmeiras',1968:'Botafogo',
  1969:'Palmeiras',1970:'Fluminense',1971:'Atletico Mineiro',1972:'Palmeiras',
  1973:'Palmeiras',1974:'Vasco da Gama',1975:'Internacional',1976:'Internacional',
  1977:'Sao Paulo',1978:'Guarani',1979:'Internacional',1980:'Flamengo',
  1981:'Gremio',1982:'Flamengo',1983:'Flamengo',1984:'Fluminense',
  1985:'Coritiba',1986:'Sao Paulo',1987:'Sport Recife',1988:'Bahia',
  1989:'Vasco da Gama',1990:'Corinthians',1991:'Sao Paulo',1992:'Flamengo',
  1993:'Palmeiras',1994:'Palmeiras',1995:'Botafogo',1996:'Gremio',
  1997:'Vasco da Gama',1998:'Corinthians',1999:'Corinthians',
  2000:'Vasco da Gama',2001:'Atletico Paranaense',2002:'Santos',
  2003:'Cruzeiro',2004:'Santos',2005:'Corinthians',2006:'Sao Paulo',
  2007:'Sao Paulo',2008:'Sao Paulo',2009:'Flamengo',2010:'Fluminense',
};

const SPORTS_RU = {
  1950:'CDKA Moscow',1952:'Spartak Moscow',1954:'Dynamo Moscow',
  1955:'Spartak Moscow',1956:'Spartak Moscow',1957:'Dynamo Moscow',
  1958:'Spartak Moscow',1959:'Spartak Moscow',1960:'Torpedo Moscow',
  1961:'Dynamo Kiev',1962:'Spartak Moscow',1963:'Spartak Moscow',
  1964:'Dynamo Tbilisi',1965:'Torpedo Moscow',1966:'Dynamo Kiev',
  1967:'Dynamo Kiev',1968:'Dynamo Kiev',1969:'Spartak Moscow',
  1970:'CSKA Moscow',1971:'Dynamo Kiev',1972:'Zorya Voroshilovgrad',
  1973:'Ararat Yerevan',1974:'Dynamo Kiev',1975:'Dynamo Kiev',
  1976:'Torpedo Moscow',1977:'Dynamo Kiev',1978:'Dynamo Tbilisi',
  1979:'Spartak Moscow',1980:'Dynamo Kiev',1981:'Dynamo Kiev',
  1982:'Dynamo Minsk',1983:'Dnipro',1984:'Zenit Leningrad',
  1985:'Dynamo Kiev',1986:'Dynamo Kiev',1987:'Spartak Moscow',
  1988:'Dnipro',1989:'Spartak Moscow',1990:'Dynamo Kiev',1991:'CSKA Moscow',
  1992:'Spartak Moscow',1993:'Spartak Moscow',1994:'Spartak Moscow',
  1995:'Spartak-Alania',1996:'Spartak Moscow',1997:'Spartak Moscow',
  1998:'Spartak Moscow',1999:'Spartak Moscow',2000:'Spartak Moscow',
  2001:'Spartak Moscow',2002:'Lokomotiv Moscow',2003:'CSKA Moscow',
  2004:'Lokomotiv Moscow',2005:'CSKA Moscow',2006:'CSKA Moscow',
  2007:'Zenit St. Petersburg',2008:'Rubin Kazan',2009:'Rubin Kazan',
  2010:'Zenit St. Petersburg',
};
const SPORTS_RU_LEAGUE = year => year >= 1992 ? 'Russian League' : 'Soviet League';

const SPORTS_KR = {
  1983:'Hallelujah',1984:'Daewoo Royals',1985:'Lucky-Goldstar',
  1986:'POSCO Atoms',1987:'Daewoo Royals',1988:'POSCO Atoms',
  1989:'Yukong Elephants',1990:'Lucky-Goldstar',1991:'Daewoo Royals',
  1992:'POSCO Atoms',1993:'Ilhwa Chunma',1994:'Ilhwa Chunma',
  1995:'Ilhwa Chunma',1996:'Ulsan Hyundai',1997:'Pusan Daewoo',
  1998:'Suwon Bluewings',1999:'Suwon Bluewings',2000:'Anyang LG Cheetahs',
  2001:'Seongnam Ilhwa',2002:'Seongnam Ilhwa',2003:'Seongnam Ilhwa',
  2004:'Suwon Bluewings',2005:'Ulsan Hyundai',2006:'Seongnam Ilhwa',
  2007:'Pohang Steelers',2008:'Suwon Bluewings',2009:'Jeonbuk Motors',
  2010:'FC Seoul',
};

const SPORTS_MX = {
  1950:'Atlas',1952:'Tampico',1954:'Marte',1955:'Zacatepec',1956:'Leon',
  1957:'Guadalajara',1958:'Zacatepec',1959:'Guadalajara',1960:'Guadalajara',
  1961:'Guadalajara',1962:'Guadalajara',1963:'Oro',1964:'Guadalajara',
  1965:'Guadalajara',1966:'America',1967:'Toluca',1968:'Toluca',
  1969:'Cruz Azul',1970:'Guadalajara',1971:'America',1972:'Cruz Azul',
  1973:'Cruz Azul',1974:'Cruz Azul',1975:'Toluca',1976:'America',
  1977:'UNAM Pumas',1978:'UANL Tigres',1979:'Cruz Azul',1980:'Cruz Azul',
  1981:'UNAM Pumas',1982:'UANL Tigres',1983:'Puebla',1984:'America',
  1985:'America',1986:'Monterrey',1987:'Guadalajara',1988:'America',
  1989:'America',1990:'Puebla',1991:'UNAM Pumas',1992:'Leon',
  1993:'Atlante',1994:'UAG Tecos',1995:'Necaxa',1996:'Santos Laguna',
  1997:'Guadalajara',1998:'Toluca',1999:'Toluca',2000:'Toluca',
  2001:'Santos Laguna',2002:'America',2003:'Monterrey',2004:'UNAM Pumas',
  2005:'America',2006:'Pachuca',2007:'Pachuca',2008:'Santos Laguna',
  2009:'UNAM Pumas',2010:'Toluca',
};

const SPORTS_IE = {
  1950:'Mayo',1952:'Cavan',1954:'Meath',1955:'Kerry',1956:'Galway',
  1957:'Louth',1958:'Dublin',1959:'Kerry',1960:'Down',1961:'Down',
  1962:'Kerry',1963:'Dublin',1964:'Galway',1965:'Galway',1966:'Galway',
  1967:'Meath',1968:'Down',1969:'Kerry',1970:'Kerry',1971:'Offaly',
  1972:'Offaly',1973:'Cork',1974:'Dublin',1975:'Kerry',1976:'Dublin',
  1977:'Dublin',1978:'Kerry',1979:'Kerry',1980:'Kerry',1981:'Kerry',
  1982:'Offaly',1983:'Dublin',1984:'Kerry',1985:'Kerry',1986:'Kerry',
  1987:'Meath',1988:'Meath',1989:'Cork',1990:'Cork',1991:'Down',
  1992:'Donegal',1993:'Derry',1994:'Down',1995:'Dublin',1996:'Meath',
  1997:'Kerry',1998:'Galway',1999:'Meath',2000:'Kerry',2001:'Galway',
  2002:'Armagh',2003:'Tyrone',2004:'Kerry',2005:'Tyrone',2006:'Kerry',
  2007:'Kerry',2008:'Tyrone',2009:'Kerry',2010:'Cork',
};

// Serie A champions (season ending year used as key; 2005 title vacated due to Calciopoli)
const SPORTS_IT = {
  1950:'Juventus',1951:'AC Milan',1952:'Juventus',1953:'Inter Milan',
  1954:'Inter Milan',1955:'AC Milan',1956:'Fiorentina',1957:'AC Milan',
  1958:'Juventus',1959:'AC Milan',1960:'Juventus',1961:'Juventus',
  1962:'AC Milan',1963:'Inter Milan',1964:'Bologna',1965:'Inter Milan',
  1966:'Inter Milan',1967:'Juventus',1968:'AC Milan',1969:'Fiorentina',
  1970:'Cagliari',1971:'Inter Milan',1972:'Juventus',1973:'Juventus',
  1974:'Lazio',1975:'Juventus',1976:'Torino',1977:'Juventus',
  1978:'Juventus',1979:'AC Milan',1980:'Inter Milan',1981:'Juventus',
  1982:'Juventus',1983:'AS Roma',1984:'Juventus',1985:'Hellas Verona',
  1986:'Juventus',1987:'Napoli',1988:'AC Milan',1989:'Inter Milan',
  1990:'Napoli',1991:'Sampdoria',1992:'AC Milan',1993:'AC Milan',
  1994:'AC Milan',1995:'Juventus',1996:'AC Milan',1997:'Juventus',
  1998:'Juventus',1999:'AC Milan',2000:'Lazio',2001:'AS Roma',
  2002:'Juventus',2003:'Juventus',2004:'AC Milan',
  2006:'Inter Milan',2007:'Inter Milan',2008:'Inter Milan',
  2009:'Inter Milan',2010:'AC Milan',
};
const SPORTS_IT_LEAGUE = year => 'Serie A';

// La Liga champions (season ending year used as key)
const SPORTS_ES = {
  1950:'Atletico Madrid',1951:'Atletico Madrid',1952:'Barcelona',
  1953:'Barcelona',1954:'Real Madrid',1955:'Real Madrid',
  1956:'Athletic Bilbao',1957:'Real Madrid',1958:'Real Madrid',
  1959:'Barcelona',1960:'Barcelona',1961:'Real Madrid',1962:'Real Madrid',
  1963:'Real Madrid',1964:'Real Madrid',1965:'Real Madrid',
  1966:'Atletico Madrid',1967:'Real Madrid',1968:'Real Madrid',
  1969:'Real Madrid',1970:'Atletico Madrid',1971:'Valencia',
  1972:'Real Madrid',1973:'Atletico Madrid',1974:'Barcelona',
  1975:'Real Madrid',1976:'Real Madrid',1977:'Atletico Madrid',
  1978:'Real Madrid',1979:'Real Madrid',1980:'Real Madrid',
  1981:'Real Sociedad',1982:'Real Sociedad',1983:'Athletic Bilbao',
  1984:'Athletic Bilbao',1985:'Barcelona',1986:'Real Madrid',
  1987:'Real Madrid',1988:'Real Madrid',1989:'Real Madrid',
  1990:'Real Madrid',1991:'Barcelona',1992:'Barcelona',
  1993:'Barcelona',1994:'Barcelona',1995:'Real Madrid',
  1996:'Atletico Madrid',1997:'Real Madrid',1998:'Barcelona',
  1999:'Barcelona',2000:'Deportivo La Coruna',2001:'Real Madrid',
  2002:'Valencia',2003:'Real Madrid',2004:'Valencia',
  2005:'Barcelona',2006:'Barcelona',2007:'Real Madrid',
  2008:'Real Madrid',2009:'Barcelona',2010:'Barcelona',
};
const SPORTS_ES_LEAGUE = year => 'La Liga';

// Eredivisie champions (season ending year used as key; started 1957)
const SPORTS_NL = {
  1957:'Ajax',1958:'DOS Utrecht',1959:'Sparta Rotterdam',
  1960:'Ajax',1961:'Feyenoord',1962:'Feyenoord',1963:'PSV Eindhoven',
  1964:'DWS Amsterdam',1965:'Feyenoord',1966:'Ajax',1967:'Ajax',
  1968:'Ajax',1969:'Feyenoord',1970:'Ajax',1971:'Feyenoord',
  1972:'Ajax',1973:'Ajax',1974:'Feyenoord',1975:'PSV Eindhoven',
  1976:'PSV Eindhoven',1977:'Ajax',1978:'PSV Eindhoven',
  1979:'Ajax',1980:'Ajax',1981:'AZ Alkmaar',1982:'Ajax',
  1983:'Ajax',1984:'Feyenoord',1985:'Ajax',1986:'PSV Eindhoven',
  1987:'PSV Eindhoven',1988:'PSV Eindhoven',1989:'PSV Eindhoven',
  1990:'Ajax',1991:'PSV Eindhoven',1992:'PSV Eindhoven',
  1993:'Feyenoord',1994:'Ajax',1995:'Ajax',1996:'Ajax',
  1997:'PSV Eindhoven',1998:'Ajax',1999:'Feyenoord',
  2000:'PSV Eindhoven',2001:'PSV Eindhoven',2002:'Ajax',
  2003:'PSV Eindhoven',2004:'Ajax',2005:'PSV Eindhoven',
  2006:'PSV Eindhoven',2007:'PSV Eindhoven',2008:'PSV Eindhoven',
  2009:'AZ Alkmaar',2010:'FC Twente',
};
const SPORTS_NL_LEAGUE = year => 'Eredivisie';

// Argentine Primera Division champions (single champion per year selected)
const SPORTS_AR = {
  1950:'Racing Club',1951:'Racing Club',1952:'River Plate',
  1953:'River Plate',1954:'Boca Juniors',1955:'River Plate',
  1956:'River Plate',1957:'River Plate',1958:'Racing Club',
  1959:'San Lorenzo',1960:'Independiente',1961:'Racing Club',
  1962:'Boca Juniors',1963:'Independiente',1964:'Boca Juniors',
  1965:'Boca Juniors',1966:'Racing Club',1967:'Independiente',
  1968:'Velez Sarsfield',1969:'Boca Juniors',1970:'Boca Juniors',
  1971:'Rosario Central',1972:'San Lorenzo',1973:'Rosario Central',
  1974:'San Lorenzo',1975:'River Plate',1976:'Boca Juniors',
  1977:'Independiente',1978:'Independiente',1979:'River Plate',
  1980:'River Plate',1981:'Boca Juniors',1982:'Estudiantes',
  1983:'Independiente',1984:'Argentinos Juniors',1985:'Argentinos Juniors',
  1986:'River Plate',1987:"Newell's Old Boys",1988:'Independiente',
  1989:'River Plate',1990:"Newell's Old Boys",1991:'River Plate',
  1992:'Boca Juniors',1993:'River Plate',1994:'River Plate',
  1995:'Velez Sarsfield',1996:'River Plate',1997:'River Plate',
  1998:'Boca Juniors',1999:'River Plate',2000:'Boca Juniors',
  2001:'River Plate',2002:'River Plate',2003:'River Plate',
  2004:'River Plate',2005:'Boca Juniors',2006:'Boca Juniors',
  2007:'River Plate',2008:'River Plate',2009:'Banfield',
  2010:'Estudiantes',
};
const SPORTS_AR_LEAGUE = year => 'Primera Division';

// Turkish Super Lig champions (started 1959)
const SPORTS_TR = {
  1959:'Fenerbahce',1960:'Besiktas',1961:'Fenerbahce',1962:'Galatasaray',
  1963:'Galatasaray',1964:'Fenerbahce',1965:'Fenerbahce',1966:'Besiktas',
  1967:'Besiktas',1968:'Fenerbahce',1969:'Galatasaray',1970:'Fenerbahce',
  1971:'Galatasaray',1972:'Galatasaray',1973:'Galatasaray',1974:'Fenerbahce',
  1975:'Fenerbahce',1976:'Trabzonspor',1977:'Trabzonspor',1978:'Trabzonspor',
  1979:'Trabzonspor',1980:'Trabzonspor',1981:'Besiktas',1982:'Fenerbahce',
  1983:'Fenerbahce',1984:'Trabzonspor',1985:'Besiktas',1986:'Besiktas',
  1987:'Galatasaray',1988:'Galatasaray',1989:'Fenerbahce',1990:'Besiktas',
  1991:'Besiktas',1992:'Besiktas',1993:'Galatasaray',1994:'Galatasaray',
  1995:'Besiktas',1996:'Fenerbahce',1997:'Galatasaray',1998:'Galatasaray',
  1999:'Galatasaray',2000:'Galatasaray',2001:'Fenerbahce',2002:'Galatasaray',
  2003:'Besiktas',2004:'Fenerbahce',2005:'Fenerbahce',2006:'Galatasaray',
  2007:'Fenerbahce',2008:'Besiktas',2009:'Galatasaray',2010:'Bursaspor',
};
const SPORTS_TR_LEAGUE = year => 'Super Lig';

// Primeira Liga champions (season ending year used as key)
const SPORTS_PT = {
  1950:'Benfica',1951:'Sporting CP',1952:'Sporting CP',1953:'Sporting CP',
  1954:'Sporting CP',1955:'Benfica',1956:'Porto',1957:'Benfica',
  1958:'Sporting CP',1959:'Porto',1960:'Benfica',1961:'Benfica',
  1962:'Sporting CP',1963:'Benfica',1964:'Benfica',1965:'Benfica',
  1966:'Sporting CP',1967:'Benfica',1968:'Benfica',1969:'Benfica',
  1970:'Sporting CP',1971:'Benfica',1972:'Benfica',1973:'Benfica',
  1974:'Sporting CP',1975:'Benfica',1976:'Benfica',1977:'Benfica',
  1978:'Porto',1979:'Porto',1980:'Sporting CP',1981:'Benfica',
  1982:'Sporting CP',1983:'Benfica',1984:'Benfica',1985:'Porto',
  1986:'Porto',1987:'Benfica',1988:'Porto',1989:'Benfica',
  1990:'Porto',1991:'Benfica',1992:'Porto',1993:'Porto',
  1994:'Benfica',1995:'Porto',1996:'Porto',1997:'Porto',
  1998:'Porto',1999:'Porto',2000:'Sporting CP',2001:'Boavista',
  2002:'Sporting CP',2003:'Porto',2004:'Porto',2005:'Benfica',
  2006:'Porto',2007:'Porto',2008:'Porto',2009:'Porto',2010:'Benfica',
};
const SPORTS_PT_LEAGUE = year => 'Primeira Liga';

// Ekstraklasa champions (season ending year used as key)
const SPORTS_PL = {
  1950:'Wisla Krakow',1951:'Ruch Chorzow',1952:'Ruch Chorzow',
  1953:'Ruch Chorzow',1954:'Polonia Bytom',1955:'Legia Warsaw',
  1956:'Legia Warsaw',1957:'Gornik Zabrze',1958:'LKS Lodz',
  1959:'Gornik Zabrze',1960:'Ruch Chorzow',1961:'Gornik Zabrze',
  1962:'Polonia Bytom',1963:'Gornik Zabrze',1964:'Gornik Zabrze',
  1965:'Gornik Zabrze',1966:'Gornik Zabrze',1967:'Gornik Zabrze',
  1968:'Ruch Chorzow',1969:'Legia Warsaw',1970:'Legia Warsaw',
  1971:'Gornik Zabrze',1972:'Gornik Zabrze',1973:'Stal Mielec',
  1974:'Ruch Chorzow',1975:'Ruch Chorzow',1976:'Stal Mielec',
  1977:'Slask Wroclaw',1978:'Wisla Krakow',1979:'Ruch Chorzow',
  1980:'Szombierki Bytom',1981:'Widzew Lodz',1982:'Widzew Lodz',
  1983:'Lech Poznan',1984:'Lech Poznan',1985:'Gornik Zabrze',
  1986:'Legia Warsaw',1987:'Gornik Zabrze',1988:'Gornik Zabrze',
  1989:'Ruch Chorzow',1990:'Lech Poznan',1991:'Zaglebie Lubin',
  1992:'Lech Poznan',1993:'Lech Poznan',1994:'Legia Warsaw',
  1995:'Legia Warsaw',1996:'Widzew Lodz',1997:'Widzew Lodz',
  1998:'LKS Lodz',1999:'Wisla Krakow',2000:'Polonia Warsaw',
  2001:'Wisla Krakow',2002:'Legia Warsaw',2003:'Wisla Krakow',
  2004:'Wisla Krakow',2005:'Wisla Krakow',2006:'Legia Warsaw',
  2007:'Zaglebie Lubin',2008:'Wisla Krakow',2009:'Wisla Krakow',
  2010:'Lech Poznan',
};
const SPORTS_PL_LEAGUE = year => 'Ekstraklasa';

// Allsvenskan champions (Sweden)
const SPORTS_SE = {
  1950:'Malmo FF',1951:'Malmo FF',1952:'IFK Norrkoping',1953:'Malmo FF',
  1954:'GAIS',1955:'Djurgardens IF',1956:'IFK Norrkoping',1957:'IFK Norrkoping',
  1958:'IFK Goteborg',1959:'Djurgardens IF',1960:'IFK Norrkoping',
  1961:'IF Elfsborg',1962:'IFK Norrkoping',1963:'IFK Norrkoping',
  1964:'Djurgardens IF',1965:'Malmo FF',1966:'Djurgardens IF',
  1967:'Malmo FF',1968:'Osters IF',1969:'IFK Goteborg',
  1970:'Malmo FF',1971:'Malmo FF',1972:'Atvidabergs FF',
  1973:'Atvidabergs FF',1974:'Malmo FF',1975:'Malmo FF',
  1976:'Halmstads BK',1977:'Malmo FF',1978:'Osters IF',
  1979:'Halmstads BK',1980:'Osters IF',1981:'Osters IF',
  1982:'IFK Goteborg',1983:'IFK Goteborg',1984:'IFK Goteborg',
  1985:'Osters IF',1986:'Malmo FF',1987:'IFK Goteborg',
  1988:'Malmo FF',1989:'IFK Norrkoping',1990:'IFK Goteborg',
  1991:'IFK Goteborg',1992:'AIK',1993:'IFK Goteborg',
  1994:'IFK Goteborg',1995:'IFK Goteborg',1996:'IFK Goteborg',
  1997:'Halmstads BK',1998:'AIK',1999:'Helsingborgs IF',
  2000:'Halmstads BK',2001:'Hammarby',2002:'Djurgardens IF',
  2003:'Djurgardens IF',2004:'Malmo FF',2005:'Djurgardens IF',
  2006:'IF Elfsborg',2007:'IFK Goteborg',2008:'Kalmar FF',
  2009:'AIK',2010:'Malmo FF',
};
const SPORTS_SE_LEAGUE = year => 'Allsvenskan';

// Colombian league champions (Liga BetPlay / Primera A)
const SPORTS_CO = {
  1950:'Deportes Caldas',1951:'Millonarios',1952:'Millonarios',
  1953:'Millonarios',1954:'Atletico Nacional',1955:'Independiente Medellin',
  1956:'Atletico Nacional',1957:'Independiente Medellin',
  1958:'Independiente Santa Fe',1959:'Millonarios',1960:'Independiente Santa Fe',
  1961:'Millonarios',1962:'Millonarios',1963:'Millonarios',
  1964:'Millonarios',1965:'Millonarios',1966:'Independiente Santa Fe',
  1967:'Deportivo Cali',1968:'Union Magdalena',1969:'Deportivo Cali',
  1970:'Deportivo Cali',1971:'Independiente Santa Fe',
  1972:'Millonarios',1973:'Atletico Nacional',1974:'Deportivo Cali',
  1975:'Independiente Santa Fe',1976:'Atletico Nacional',
  1977:'Junior Barranquilla',1978:'Millonarios',1979:'America de Cali',
  1980:'Junior Barranquilla',1981:'Atletico Nacional',
  1982:'America de Cali',1983:'America de Cali',1984:'America de Cali',
  1985:'America de Cali',1986:'America de Cali',1987:'Millonarios',
  1988:'Millonarios',1989:'Atletico Nacional',1990:'America de Cali',
  1991:'Atletico Nacional',1992:'America de Cali',1993:'Atletico Junior',
  1994:'Atletico Nacional',1995:'Atletico Junior',1996:'Deportivo Cali',
  1997:'America de Cali',1998:'Deportivo Cali',1999:'Atletico Nacional',
  2000:'America de Cali',2001:'America de Cali',2002:'America de Cali',
  2003:'Deportes Tolima',2004:'Deportivo Cali',2005:'Deportivo Cali',
  2006:'Atletico Nacional',2007:'Atletico Nacional',2008:'Boyaca Chico',
  2009:'Once Caldas',2010:'Junior Barranquilla',
};
const SPORTS_CO_LEAGUE = year => 'Liga Colombiana';

// Chilean Primera Division champions
const SPORTS_CL = {
  1950:'Everton',1951:'Union Espanola',1952:'Everton',
  1953:'Colo-Colo',1954:'Universidad Catolica',1955:'Palestino',
  1956:'Colo-Colo',1957:'Audax Italiano',1958:'Santiago Wanderers',
  1959:'Universidad de Chile',1960:'Colo-Colo',1961:'Universidad Catolica',
  1962:'Universidad de Chile',1963:'Universidad de Chile',
  1964:'Universidad de Chile',1965:'Universidad de Chile',
  1966:'Universidad Catolica',1967:'Universidad de Chile',
  1968:'Santiago Wanderers',1969:'Universidad de Chile',
  1970:'Colo-Colo',1971:'Union San Felipe',1972:'Universidad de Chile',
  1973:'Union Espanola',1974:'Huachipato',1975:'Union Espanola',
  1976:'Everton',1977:'Union Espanola',1978:'Palestino',
  1979:'Colo-Colo',1980:'Cobreloa',1981:'Colo-Colo',
  1982:'Cobreloa',1983:'Colo-Colo',1984:'Universidad Catolica',
  1985:'Cobreloa',1986:'Colo-Colo',1987:'Universidad Catolica',
  1988:'Cobreloa',1989:'Colo-Colo',1990:'Colo-Colo',
  1991:'Colo-Colo',1992:'Cobreloa',1993:'Colo-Colo',
  1994:'Universidad de Chile',1995:'Universidad de Chile',
  1996:'Colo-Colo',1997:'Universidad Catolica',1998:'Colo-Colo',
  1999:'Universidad de Chile',2000:'Universidad de Chile',
  2001:'Santiago Wanderers',2002:'Universidad Catolica',
  2003:'Cobreloa',2004:'Cobreloa',2005:'Universidad Catolica',
  2006:'Colo-Colo',2007:'Colo-Colo',2008:'Colo-Colo',
  2009:'Universidad de Chile',2010:'Universidad Catolica',
};
const SPORTS_CL_LEAGUE = year => 'Primera Division';

// Ranji Trophy champions (India, first-class cricket)
const SPORTS_IN = {
  1950:'Baroda',1952:'Bombay',1954:'Bombay',1955:'Madras',
  1956:'Bombay',1957:'Bombay',1958:'Baroda',1959:'Bombay',
  1960:'Bombay',1961:'Bombay',1962:'Bombay',1963:'Bombay',
  1964:'Bombay',1965:'Bombay',1966:'Bombay',1967:'Bombay',
  1968:'Bombay',1969:'Bombay',1970:'Bombay',1971:'Bombay',
  1972:'Bombay',1973:'Bombay',1974:'Karnataka',1975:'Bombay',
  1976:'Bombay',1977:'Bombay',1978:'Karnataka',1979:'Delhi',
  1980:'Delhi',1981:'Bombay',1982:'Delhi',1983:'Karnataka',
  1984:'Bombay',1985:'Bombay',1986:'Delhi',1987:'Hyderabad',
  1988:'Tamil Nadu',1989:'Delhi',1990:'Bengal',1991:'Haryana',
  1992:'Delhi',1993:'Punjab',1994:'Bombay',1995:'Bombay',
  1996:'Karnataka',1997:'Mumbai',1998:'Karnataka',1999:'Karnataka',
  2000:'Mumbai',2001:'Baroda',2002:'Railways',2003:'Mumbai',
  2004:'Mumbai',2005:'Railways',2006:'Uttar Pradesh',2007:'Mumbai',
  2008:'Delhi',2009:'Mumbai',2010:'Mumbai',
};
const SPORTS_IN_LEAGUE = year => 'Ranji Trophy';

// Quaid-e-Azam Trophy champions (Pakistan, first-class cricket)
const SPORTS_PK = {
  1954:'Bahawalpur',1955:'Karachi',1956:'Punjab',
  1957:'Punjab',1958:'Bahawalpur',1959:'Karachi',
  1962:'Karachi Blues',1963:'Karachi',1964:'Karachi Blues',
  1966:'Karachi',1968:'Karachi',1969:'Lahore',
  1970:'PIA',1971:'Karachi Blues',1972:'Railways',
  1973:'Railways',1974:'Railways',1975:'Punjab',
  1976:'National Bank',1977:'United Bank',1978:'Habib Bank',
  1979:'National Bank',1980:'PIA',1981:'United Bank',
  1982:'National Bank',1983:'United Bank',1984:'National Bank',
  1985:'United Bank',1986:'Karachi',1987:'National Bank',
  1988:'PIA',1989:'ADBP',1990:'PIA',
  1991:'Karachi Whites',1992:'Karachi Whites',1993:'Karachi Whites',
  1994:'Lahore City',1995:'Karachi Blues',1996:'Karachi Blues',
  1997:'Lahore City',1998:'Karachi Blues',1999:'Peshawar',
  2000:'PIA',2001:'Lahore City Blues',2002:'Karachi Whites',
  2003:'PIA',2004:'Faisalabad',2005:'Habib Bank',
  2006:'Sialkot',2007:'Karachi Urban',2008:'Sialkot',
  2009:'Sialkot',2010:'Habib Bank',
};
const SPORTS_PK_LEAGUE = year => 'Quaid-e-Azam Trophy';

// Egyptian Premier League champions
const SPORTS_EG = {
  1950:'Al Ahly',1952:'Al Ahly',1954:'Al Ahly',1955:'Al Ahly',
  1956:'Al Ahly',1957:'Al Ahly',1958:'Al Ahly',1959:'Al Ahly',
  1960:'Zamalek',1961:'Al Ahly',1962:'Al Ahly',1963:'Tersana',
  1964:'Zamalek',1965:'Zamalek',1966:'Olympic',1967:'Ismaily',
  1968:'Al Ahly',1969:'Al Ahly',1970:'Al Ahly',1971:'Al Ahly',
  1972:'Al Ahly',1973:'Al Ahly',1974:'Al Ahly',1975:'Al Ahly',
  1976:'Al Ahly',1977:'Al Ahly',1978:'Zamalek',1979:'Al Ahly',
  1980:'Al Ahly',1981:'Al Ahly',1982:'Al Ahly',1983:'Al Mokawloon',
  1984:'Zamalek',1985:'Al Ahly',1986:'Al Ahly',1987:'Al Ahly',
  1988:'Zamalek',1989:'Al Ahly',1990:'Al Ahly',1991:'Zamalek',
  1992:'Zamalek',1993:'Zamalek',1994:'Al Ahly',1995:'Al Ahly',
  1996:'Al Ahly',1997:'Al Ahly',1998:'Al Ahly',1999:'Al Ahly',
  2000:'Al Ahly',2001:'Zamalek',2002:'Zamalek',2003:'Zamalek',
  2004:'Al Ahly',2005:'Al Ahly',2006:'Al Ahly',2007:'Al Ahly',
  2008:'Al Ahly',2009:'Al Ahly',2010:'Al Ahly',
};
const SPORTS_EG_LEAGUE = year => 'Egyptian Premier League';

// Nigerian Premier League champions (started 1972)
const SPORTS_NG = {
  1972:'Mighty Jets',1973:'Bendel Insurance',1974:'Rangers International',
  1975:'Rangers International',1976:'Shooting Stars',1977:'Rangers International',
  1978:'Racca Rovers',1979:'Bendel Insurance',1980:'Shooting Stars',
  1981:'Rangers International',1982:'Rangers International',
  1983:'Shooting Stars',1984:'Rangers International',1985:'New Nigeria Bank',
  1986:'Leventis United',1987:'Iwuanyanwu Nationale',1988:'Iwuanyanwu Nationale',
  1989:'Iwuanyanwu Nationale',1990:'Iwuanyanwu Nationale',
  1991:'Julius Berger',1992:'Stationery Stores',1993:'Iwuanyanwu Nationale',
  1994:'BCC Lions',1995:'Shooting Stars',1996:'Udoji United',
  1997:'Shooting Stars',1998:'Lobi Stars',1999:'Heartland',
  2000:'Julius Berger',2001:'Enyimba',2002:'Enyimba',
  2003:'Enyimba',2004:'Dolphins',2005:'Enyimba',
  2006:'Ocean Boys',2007:'Enyimba',2008:'Kano Pillars',
  2009:'Kano Pillars',2010:'Enyimba',
};
const SPORTS_NG_LEAGUE = year => 'Nigerian Premier League';

// Saudi Pro League champions (started 1957)
const SPORTS_SA = {
  1957:'Al Ahli',1958:'Al Ahli',1959:'Al Ahli',
  1960:'Al Ittihad',1961:'Al Ittihad',1962:'Al Ittihad',
  1963:'Al Ittihad',1964:'Al Ittihad',1965:'Al Ittihad',
  1966:'Al Wehda',1967:'Al Ahli',1968:'Al Riyadh',
  1969:'Al Ahli',1970:'Al Hilal',1971:'Al Shabab',
  1972:'Al Ahli',1973:'Al Ahli',1974:'Al Riyadh',
  1975:'Al Ahli',1976:'Al Hilal',1977:'Al Hilal',
  1978:'Al Ahli',1979:'Al Hilal',1980:'Al Nassr',
  1981:'Al Nassr',1982:'Al Ittihad',1983:'Al Ahli',
  1984:'Al Ahli',1985:'Al Hilal',1986:'Al Hilal',
  1987:'Al Ahli',1988:'Al Hilal',1989:'Al Nassr',
  1990:'Al Hilal',1991:'Al Shabab',1992:'Al Shabab',
  1993:'Al Shabab',1994:'Al Nassr',1995:'Al Nassr',
  1996:'Al Hilal',1997:'Al Ittihad',1998:'Al Ahli',
  1999:'Al Hilal',2000:'Al Hilal',2001:'Al Ahli',
  2002:'Al Hilal',2003:'Al Ittihad',2004:'Al Ittihad',
  2005:'Al Ittihad',2006:'Al Shabab',2007:'Al Ahli',
  2008:'Al Hilal',2009:'Al Hilal',2010:'Al Hilal',
};
const SPORTS_SA_LEAGUE = year => 'Saudi Pro League';

// Israeli Premier League champions
const SPORTS_IL = {
  1950:'Maccabi Tel Aviv',1952:'Maccabi Tel Aviv',1954:'Maccabi Tel Aviv',
  1955:'Hapoel Petah Tikva',1956:'Hapoel Tel Aviv',1957:'Hapoel Tel Aviv',
  1958:'Maccabi Tel Aviv',1959:'Hapoel Petah Tikva',1960:'Hapoel Petah Tikva',
  1961:'Hapoel Tel Aviv',1962:'Hapoel Tel Aviv',1963:'Hapoel Tel Aviv',
  1964:'Hapoel Tel Aviv',1965:'Maccabi Tel Aviv',1966:'Hapoel Tel Aviv',
  1967:'Maccabi Tel Aviv',1968:'Maccabi Tel Aviv',1969:'Hapoel Tel Aviv',
  1970:'Maccabi Netanya',1971:'Maccabi Netanya',1972:'Maccabi Netanya',
  1973:'Hakoah Ramat Gan',1974:'Hapoel Tel Aviv',1975:'Maccabi Netanya',
  1976:'Hapoel Be\'er Sheva',1977:'Maccabi Tel Aviv',1978:'Maccabi Netanya',
  1979:'Maccabi Tel Aviv',1980:'Maccabi Netanya',1981:'Hapoel Tel Aviv',
  1982:'Hapoel Tel Aviv',1983:'Maccabi Netanya',1984:'Maccabi Haifa',
  1985:'Maccabi Haifa',1986:'Hapoel Tel Aviv',1987:'Maccabi Haifa',
  1988:'Maccabi Haifa',1989:'Maccabi Haifa',
  1990:'Beitar Jerusalem',1991:'Maccabi Haifa',1992:'Maccabi Tel Aviv',
  1993:'Beitar Jerusalem',1994:'Maccabi Haifa',1995:'Maccabi Haifa',
  1996:'Maccabi Tel Aviv',1997:'Beitar Jerusalem',1998:'Beitar Jerusalem',
  1999:'Hapoel Haifa',2000:'Maccabi Tel Aviv',2001:'Maccabi Haifa',
  2002:'Maccabi Haifa',2003:'Maccabi Tel Aviv',2004:'Maccabi Haifa',
  2005:'Maccabi Haifa',2006:'Maccabi Haifa',2007:'Beitar Jerusalem',
  2008:'Beitar Jerusalem',2009:'Maccabi Haifa',2010:'Hapoel Tel Aviv',
};
const SPORTS_IL_LEAGUE = year => 'Israeli Premier League';

// Malaysia Cup champions (the prestigious knockout competition)
const SPORTS_MY = {
  1950:'Singapore',1952:'Singapore',1954:'Perak',1955:'Singapore',
  1956:'Selangor',1957:'Perak',1958:'Penang',1959:'Selangor',
  1960:'Selangor',1961:'Selangor',1962:'Selangor',1963:'Selangor',
  1964:'Singapore',1965:'Singapore',1966:'Selangor',1967:'Perak',
  1968:'Selangor',1969:'Selangor',1970:'Perak',1971:'Selangor',
  1972:'Selangor',1973:'Selangor',1974:'Penang',1975:'Selangor',
  1976:'Selangor',1977:'Singapore',1978:'Selangor',1979:'Selangor',
  1980:'Selangor',1981:'Selangor',1982:'Kuala Lumpur',
  1983:'Selangor',1984:'Selangor',1985:'Kuala Lumpur',
  1986:'Selangor',1987:'Kuala Lumpur',1988:'Johor',
  1989:'Kuala Lumpur',1990:'Kedah',1991:'Johor',
  1992:'Pahang',1993:'Kedah',1994:'Singapore',1995:'Selangor',
  1996:'Selangor',1997:'Selangor',1998:'Perak',1999:'Perak',
  2000:'Perak',2001:'Terengganu',2002:'Selangor',
  2003:'Selangor',2004:'Perlis',2005:'Perlis',
  2006:'Selangor',2007:'Kedah',2008:'Kedah',
  2009:'Selangor',2010:'Kelantan',
};
const SPORTS_MY_LEAGUE = year => 'Malaysia Cup';

// Ghana Premier League champions (started 1956)
const SPORTS_GH = {
  1956:'Hearts of Oak',1957:'Asante Kotoko',1958:'Hearts of Oak',
  1959:'Asante Kotoko',1960:'Asante Kotoko',1961:'Hearts of Oak',
  1962:'Real Republicans',1963:'Real Republicans',1964:'Asante Kotoko',
  1965:'Asante Kotoko',1966:'Asante Kotoko',1967:'Asante Kotoko',
  1968:'Asante Kotoko',1969:'Asante Kotoko',1970:'Great Olympics',
  1971:'Hearts of Oak',1972:'Asante Kotoko',1973:'Hearts of Oak',
  1974:'Great Olympics',1975:'Asante Kotoko',1976:'Hearts of Oak',
  1977:'Hearts of Oak',1978:'Asante Kotoko',1979:'Hearts of Oak',
  1980:'Asante Kotoko',1981:'Asante Kotoko',1982:'Asante Kotoko',
  1983:'Asante Kotoko',1984:'Hearts of Oak',1985:'Hearts of Oak',
  1986:'Asante Kotoko',1987:'Asante Kotoko',1988:'Asante Kotoko',
  1989:'Asante Kotoko',1990:'Hearts of Oak',1991:'Asante Kotoko',
  1992:'Asante Kotoko',1993:'Asante Kotoko',1994:'Goldfields',
  1995:'Goldfields',1996:'Hearts of Oak',1997:'Hearts of Oak',
  1998:'Hearts of Oak',1999:'Hearts of Oak',2000:'Hearts of Oak',
  2001:'Hearts of Oak',2002:'Asante Kotoko',2003:'Asante Kotoko',
  2004:'Hearts of Oak',2005:'Asante Kotoko',2006:'Hearts of Oak',
  2007:'Asante Kotoko',2008:'Asante Kotoko',2009:'Hearts of Oak',
  2010:'Aduana Stars',
};
const SPORTS_GH_LEAGUE = year => 'Ghana Premier League';

// World Series champions (United States, baseball)
const SPORTS_US = {
  1950:'New York Yankees',1952:'New York Yankees',1954:'New York Giants',
  1955:'Brooklyn Dodgers',1956:'New York Yankees',1957:'Milwaukee Braves',
  1958:'New York Yankees',1959:'Los Angeles Dodgers',
  1960:'Pittsburgh Pirates',1961:'New York Yankees',1962:'New York Yankees',
  1963:'Los Angeles Dodgers',1964:'St. Louis Cardinals',
  1965:'Los Angeles Dodgers',1966:'Baltimore Orioles',1967:'St. Louis Cardinals',
  1968:'Detroit Tigers',1969:'New York Mets',1970:'Baltimore Orioles',
  1971:'Pittsburgh Pirates',1972:'Oakland Athletics',1973:'Oakland Athletics',
  1974:'Oakland Athletics',1975:'Cincinnati Reds',1976:'Cincinnati Reds',
  1977:'New York Yankees',1978:'New York Yankees',1979:'Pittsburgh Pirates',
  1980:'Philadelphia Phillies',1981:'Los Angeles Dodgers',
  1982:'St. Louis Cardinals',1983:'Baltimore Orioles',1984:'Detroit Tigers',
  1985:'Kansas City Royals',1986:'New York Mets',1987:'Minnesota Twins',
  1988:'Los Angeles Dodgers',1989:'Oakland Athletics',
  1990:'Cincinnati Reds',1991:'Minnesota Twins',
  1992:'Toronto Blue Jays',1993:'Toronto Blue Jays',
  1995:'Atlanta Braves',1996:'New York Yankees',1997:'Florida Marlins',
  1998:'New York Yankees',1999:'New York Yankees',2000:'New York Yankees',
  2001:'Arizona Diamondbacks',2002:'Anaheim Angels',2003:'Florida Marlins',
  2004:'Boston Red Sox',2005:'Chicago White Sox',
  2006:'St. Louis Cardinals',2007:'Boston Red Sox',
  2008:'Philadelphia Phillies',2009:'New York Yankees',
  2010:'San Francisco Giants',
};

const SPORTS_LOOKUP = {
  GB: { data: SPORTS_GB, league: SPORTS_GB_LEAGUE, sport: 'Football' },
  DE: { data: SPORTS_DE, league: SPORTS_DE_LEAGUE, sport: 'Football' },
  FR: { data: SPORTS_FR, league: SPORTS_FR_LEAGUE, sport: 'Football' },
  AU: { data: SPORTS_AU, league: SPORTS_AU_LEAGUE, sport: 'Aussie Rules' },
  JP: { data: SPORTS_JP, league: () => 'Japan Series', sport: 'Baseball' },
  CA: { data: SPORTS_CA, league: () => 'Stanley Cup', sport: 'Ice Hockey' },
  BR: { data: SPORTS_BR, league: () => 'Brasileiro', sport: 'Football' },
  RU: { data: SPORTS_RU, league: SPORTS_RU_LEAGUE, sport: 'Football' },
  KR: { data: SPORTS_KR, league: () => 'K-League', sport: 'Football' },
  MX: { data: SPORTS_MX, league: () => 'Liga MX', sport: 'Football' },
  IE: { data: SPORTS_IE, league: () => 'All-Ireland SFC', sport: 'GAA Football' },
  IT: { data: SPORTS_IT, league: SPORTS_IT_LEAGUE, sport: 'Football' },
  ES: { data: SPORTS_ES, league: SPORTS_ES_LEAGUE, sport: 'Football' },
  NL: { data: SPORTS_NL, league: SPORTS_NL_LEAGUE, sport: 'Football' },
  AR: { data: SPORTS_AR, league: SPORTS_AR_LEAGUE, sport: 'Football' },
  TR: { data: SPORTS_TR, league: SPORTS_TR_LEAGUE, sport: 'Football' },
  PT: { data: SPORTS_PT, league: SPORTS_PT_LEAGUE, sport: 'Football' },
  PL: { data: SPORTS_PL, league: SPORTS_PL_LEAGUE, sport: 'Football' },
  SE: { data: SPORTS_SE, league: SPORTS_SE_LEAGUE, sport: 'Football' },
  CO: { data: SPORTS_CO, league: SPORTS_CO_LEAGUE, sport: 'Football' },
  CL: { data: SPORTS_CL, league: SPORTS_CL_LEAGUE, sport: 'Football' },
  IN: { data: SPORTS_IN, league: SPORTS_IN_LEAGUE, sport: 'Cricket' },
  PK: { data: SPORTS_PK, league: SPORTS_PK_LEAGUE, sport: 'Cricket' },
  EG: { data: SPORTS_EG, league: SPORTS_EG_LEAGUE, sport: 'Football' },
  NG: { data: SPORTS_NG, league: SPORTS_NG_LEAGUE, sport: 'Football' },
  SA: { data: SPORTS_SA, league: SPORTS_SA_LEAGUE, sport: 'Football' },
  IL: { data: SPORTS_IL, league: SPORTS_IL_LEAGUE, sport: 'Football' },
  MY: { data: SPORTS_MY, league: SPORTS_MY_LEAGUE, sport: 'Football' },
  GH: { data: SPORTS_GH, league: SPORTS_GH_LEAGUE, sport: 'Football' },
  US: { data: SPORTS_US, league: () => 'World Series', sport: 'Baseball' },
};

// ---------------------------------------------------------------------------
// TIER 2: COUNTRY EVENTS (one memorable moment per country per year)
// ---------------------------------------------------------------------------

const COUNTRY_EVENTS = {
  GB: {
    1950:'NHS in first full year, Attlee wins second election',
    1952:'King George VI dies, Elizabeth II becomes Queen',
    1954:'Food rationing ends after 14 years',
    1955:'Winston Churchill retires as PM',
    1956:'Suez Crisis, Britain forced to withdraw',
    1958:'Munich air disaster kills Manchester United players',
    1960:'National Service ends, last conscripts discharged',
    1962:'Beatles release Love Me Do, British pop revolution begins',
    1963:'Profumo scandal, Beatles release first album',
    1964:'Harold Wilson leads Labour to power',
    1966:'England wins FIFA World Cup at Wembley',
    1968:'Enoch Powell gives Rivers of Blood speech',
    1969:'Troops sent to Northern Ireland',
    1971:'Decimal currency introduced on 15 Feb',
    1972:'Bloody Sunday in Derry',
    1973:'UK joins EEC, three-day week amid energy crisis',
    1975:'Margaret Thatcher becomes Conservative leader',
    1977:'Queen Elizabeth II Silver Jubilee',
    1978:'First test-tube baby Louise Brown born in Oldham',
    1979:'Margaret Thatcher becomes first female PM',
    1981:'Prince Charles marries Lady Diana',
    1982:'Falklands War, Britain defeats Argentina',
    1984:'Miners strike, Thatcher breaks unions',
    1986:'Big Bang deregulates the City of London',
    1988:'Lockerbie bombing kills 270',
    1990:'Thatcher ousted by own party, Major becomes PM',
    1992:'Black Wednesday, pound crashes out of ERM',
    1994:'Channel Tunnel opens, first trains run to Paris',
    1996:'Dolly the Sheep cloned in Edinburgh',
    1997:'Tony Blair wins landslide, Diana dies in Paris',
    1998:'Good Friday Agreement signed',
    2000:'Millennium Dome opens in Greenwich',
    2003:'Iraq War begins, million march against it in London',
    2005:'7/7 London bombings kill 52',
    2008:'Financial crisis, UK bails out banks',
    2010:'First hung parliament since 1974, coalition formed',
  },
  DE: {
    1950:'West Germany joins Council of Europe',
    1952:'West Germany signs European Coal and Steel Community treaty',
    1954:'West Germany wins World Cup - the Miracle of Bern',
    1955:'West Germany joins NATO',
    1957:'Treaty of Rome signed, West Germany co-founds EEC',
    1959:'Bundesbank stabilises the Deutsche Mark as Europe\'s anchor currency',
    1961:'Berlin Wall built overnight on 13 August',
    1963:'Adenauer retires after 14 years as Chancellor',
    1966:'Grand coalition formed between CDU and SPD',
    1968:'Student protests peak across West Germany',
    1969:'Willy Brandt becomes Chancellor, Ostpolitik begins',
    1970:'Brandt kneels at Warsaw Ghetto memorial',
    1972:'Munich Olympics massacre, 11 Israeli athletes killed',
    1974:'West Germany wins World Cup at home',
    1976:'Wolf Biermann exiled from East Germany, sparking dissent',
    1977:'German Autumn - RAF terror, Schleyer murdered',
    1980:'Green Party founded',
    1982:'Helmut Kohl becomes Chancellor',
    1984:'East Germans begin seeking refuge in Western embassies',
    1986:'Chernobyl fallout raises nuclear fears across Germany',
    1989:'Berlin Wall falls on 9 November',
    1990:'German reunification on 3 October',
    1992:'Rostock-Lichtenhagen riots against asylum seekers',
    1994:'Last Allied troops leave Berlin after 49 years',
    1996:'Germany wins European Championship in England',
    1998:'Schroeder defeats Kohl after 16 years of CDU',
    2000:'Expo 2000 opens in Hanover',
    2002:'Euro replaces Deutsche Mark',
    2004:'Hartz IV welfare reforms spark major protests',
    2005:'Angela Merkel becomes first female Chancellor',
    2006:'Germany hosts FIFA World Cup',
    2008:'Global financial crisis hits German exports hard',
    2010:'German economy rebounds fastest in Europe',
  },
  FR: {
    1950:'Schuman Declaration proposes European coal and steel union',
    1952:'France joins European Coal and Steel Community',
    1954:'Dien Bien Phu falls, France defeated in Indochina',
    1956:'France grants independence to Morocco and Tunisia',
    1958:'De Gaulle returns to power, Fifth Republic founded',
    1960:'France tests first atomic bomb in Sahara',
    1962:'Algeria gains independence after eight-year war',
    1964:'France recognises the People\'s Republic of China',
    1966:'France withdraws from NATO military command',
    1968:'May 68 student uprising paralyses the nation',
    1969:'De Gaulle resigns after referendum defeat',
    1970:'De Gaulle dies, end of an era in French politics',
    1974:'Giscard d\'Estaing elected, lowers voting age to 18',
    1976:'Concorde begins regular commercial passenger flights',
    1978:'Left alliance narrowly loses legislative elections',
    1981:'Mitterrand elected, Socialists win after 23 years',
    1983:'TGV high-speed rail service launches between Paris and Lyon',
    1985:'Rainbow Warrior sunk by French secret service',
    1989:'Bicentennial of the French Revolution',
    1992:'Maastricht Treaty narrowly approved by French referendum',
    1994:'Channel Tunnel opens linking France to Britain',
    1995:'Chirac elected President, nuclear tests in Pacific draw protests',
    1998:'France hosts and wins FIFA World Cup',
    2000:'35-hour work week law takes effect',
    2002:'Le Pen reaches presidential runoff, France shocked',
    2003:'Deadly heatwave kills 15,000 across France',
    2005:'Banlieues riots, three weeks of unrest',
    2007:'Sarkozy elected President',
    2009:'France rejoins NATO military command after 43 years',
    2010:'Retirement age protests shut France for weeks',
  },
  JP: {
    1950:'Korean War boom revives Japanese industry',
    1952:'Allied occupation ends, Japan regains sovereignty',
    1954:'Godzilla film released, reflecting nuclear anxiety',
    1955:'Liberal Democratic Party founded, begins 38-year rule',
    1956:'Japan joins the United Nations',
    1958:'Tokyo Tower completed',
    1960:'Massive protests erupt against US-Japan security treaty',
    1962:'Japan\'s economy grows at record pace during the miracle years',
    1964:'Tokyo Olympics, bullet train launched same day',
    1966:'Japan\'s population exceeds 100 million',
    1968:'Japan becomes world\'s second largest economy',
    1970:'Osaka World Expo, 64 million visitors',
    1972:'Okinawa returned to Japan after 27 years of US control',
    1974:'PM Tanaka resigns over Lockheed bribery scandal',
    1976:'Lockheed scandal trial shakes Japanese politics',
    1978:'New Tokyo airport opens at Narita after years of violent protest',
    1979:'Sony Walkman launched',
    1982:'Honda opens its first auto plant in the United States',
    1984:'Japanese economy surges, yen internationalised',
    1985:'Plaza Accord causes yen surge, property boom begins',
    1987:'Nippon Telegraph sold in world\'s largest IPO at the time',
    1989:'Emperor Hirohito dies, Heisei era begins',
    1990:'Nikkei crashes 39%, bubble economy bursts',
    1993:'LDP loses power for the first time in 38 years',
    1995:'Kobe earthquake kills 6,434, Aum sarin attack',
    1997:'Asian financial crisis causes major Japanese bank failures',
    1998:'Winter Olympics held in Nagano',
    2000:'PlayStation 2 launches, Japan leads global gaming',
    2002:'Japan co-hosts FIFA World Cup',
    2004:'Niigata earthquake kills 68, derails a bullet train',
    2006:'Shinzo Abe becomes Japan\'s youngest postwar PM',
    2009:'Democratic Party wins landslide, ends LDP era',
    2010:'Japan loses second-economy rank to China',
  },
  IN: {
    1950:'Constitution comes into force, republic declared',
    1952:'First general election, Nehru wins landslide',
    1954:'India and China sign Panchsheel Agreement on peaceful coexistence',
    1956:'States reorganised on linguistic lines across India',
    1958:'Second Five-Year Plan drives heavy industrialisation',
    1960:'Indus Waters Treaty signed with Pakistan',
    1961:'India liberates Goa from Portuguese rule',
    1962:'War with China humiliates India',
    1964:'Nehru dies',
    1966:'Indira Gandhi becomes first female PM',
    1968:'Green Revolution transforms Indian agriculture',
    1969:'ISRO founded, India enters the space age',
    1971:'India-Pakistan war creates Bangladesh',
    1974:'India tests first nuclear device',
    1975:'Indira Gandhi declares Emergency, democracy suspended',
    1977:'First non-Congress government in 30 years',
    1980:'Indira Gandhi returns to power in landslide victory',
    1983:'India wins Cricket World Cup',
    1984:'Golden Temple stormed, Indira Gandhi assassinated',
    1986:'Bhopal gas disaster aftermath continues, consumer protection law passed',
    1989:'V.P. Singh becomes PM, Mandal Commission protests follow',
    1991:'Economic liberalisation opens India\'s economy',
    1992:'Babri Masjid demolished, riots kill thousands',
    1995:'India launches its first commercial internet services',
    1998:'Pokhran nuclear tests, India declared nuclear state',
    2000:'India\'s population crosses one billion',
    2002:'Gujarat riots claim over 1,000 lives',
    2004:'Congress defeats BJP, Manmohan Singh becomes PM',
    2006:'Right to Information Act empowers Indian citizens',
    2008:'Mumbai 26/11 attacks, 166 killed over three days',
    2010:'Commonwealth Games held in Delhi amid controversy',
  },
  AU: {
    1950:'Australia sends troops to fight in Korean War',
    1952:'First British atomic tests held at Monte Bello Islands',
    1954:'Queen Elizabeth II makes first visit by a reigning monarch',
    1956:'Melbourne Olympics, first Games in Australia',
    1958:'Snowy Mountains Hydroelectric Scheme nears completion',
    1960:'Aboriginal rights movement grows, Freedom Rides begin',
    1962:'Aboriginal Australians granted the right to vote federally',
    1964:'National Service reintroduced for Vietnam War',
    1966:'Decimal currency launched, dollar replaces pound',
    1967:'Referendum grants citizenship to Aboriginal Australians',
    1970:'Anti-Vietnam War moratorium marches draw 200,000',
    1972:'Whitlam leads Labor to power after 23 years',
    1973:'Sydney Opera House opens',
    1974:'Cyclone Tracy destroys Darwin on Christmas Day',
    1975:'Whitlam dismissed by Governor-General, constitutional crisis',
    1978:'First Gay and Lesbian Mardi Gras held in Sydney',
    1980:'Baby Azaria Chamberlain disappears at Uluru, gripping the nation',
    1983:'Australia wins America\'s Cup, ending 132-year US winning streak',
    1985:'Uluru handed back to traditional Aboriginal owners',
    1988:'Bicentennial celebrations and Aboriginal protest march in Sydney',
    1990:'Australia enters its worst recession since World War II',
    1992:'Mabo decision overturns terra nullius',
    1994:'Mandatory detention policy for asylum seekers introduced',
    1996:'Port Arthur massacre, gun ban follows',
    1998:'Constitutional Convention debates becoming a republic',
    2000:'Sydney Olympics, Cathy Freeman lights cauldron',
    2002:'Bali bombings kill 88 Australians',
    2004:'Free trade agreement signed with the United States',
    2006:'Cronulla riots expose racial tensions in Sydney',
    2008:'Rudd apology to Aboriginal Australians',
    2009:'Black Saturday bushfires kill 173',
    2010:'Julia Gillard becomes first female PM',
  },
  CA: {
    1950:'Canada sends troops to Korean War',
    1952:'First Canadian-born Governor General, Vincent Massey, appointed',
    1954:'First subway opens in Toronto',
    1956:'Lester Pearson proposes UN peacekeeping force during Suez Crisis',
    1958:'Diefenbaker wins largest majority in Canadian history',
    1960:'Canadian Bill of Rights enacted',
    1962:'Trans-Canada Highway completed coast to coast',
    1964:'Great Canadian Flag Debate, maple leaf design chosen',
    1967:'Canada\'s centennial, Expo 67 in Montreal',
    1968:'Pierre Trudeau becomes PM, Trudeau-mania',
    1970:'October Crisis, War Measures Act invoked',
    1972:'Canada-Soviet hockey Summit Series',
    1976:'Montreal hosts Summer Olympics, Quebec elects PQ',
    1978:'Commonwealth Games held in Edmonton',
    1980:'Quebec sovereignty referendum lost',
    1982:'Charter of Rights and Freedoms comes into effect',
    1984:'Mulroney wins massive majority for Conservatives',
    1986:'Expo 86 held in Vancouver',
    1988:'Calgary Winter Olympics',
    1990:'Meech Lake Accord fails, Oka Crisis erupts',
    1992:'Charlottetown Accord rejected by referendum',
    1993:'Chretien leads Liberals to majority',
    1995:'Quebec referendum, YES loses by 1.2%',
    1997:'Red River flood forces massive evacuation in Manitoba',
    1999:'Nunavut created as Canada\'s newest territory',
    2001:'Canada joins war in Afghanistan after 9/11',
    2003:'Canada refuses to join Iraq War',
    2005:'Same-sex marriage legalised nationwide',
    2008:'Harper leads Conservatives through global financial crisis',
    2010:'Vancouver Winter Olympics, 14 gold medals',
  },
  BR: {
    1950:'Brazil hosts World Cup, loses final to Uruguay',
    1954:'President Vargas takes his own life amid political crisis',
    1956:'Kubitschek elected, announces plan to build new capital',
    1958:'Brazil wins first World Cup, Pele scores aged 17',
    1960:'Capital moved to newly built Brasilia',
    1962:'Brazil wins second consecutive World Cup in Chile',
    1964:'Military coup begins 21-year dictatorship',
    1968:'AI-5 decree tightens military control, repression intensifies',
    1970:'Brazil wins World Cup, greatest team ever',
    1972:'Trans-Amazonian Highway construction begins',
    1974:'Economic miracle slows as oil crisis bites',
    1977:'April Package strengthens military grip on congress',
    1979:'Amnesty law passed, political exiles begin returning',
    1982:'Brazil\'s debt crisis erupts, largest developing-country default',
    1984:'Diretas Ja, millions demand direct elections',
    1985:'Neves elected but dies before taking office, Sarney becomes President',
    1988:'New constitution, redemocratisation complete',
    1990:'Collor freezes bank accounts to fight inflation',
    1992:'Collor impeached for corruption',
    1994:'Real Plan ends hyperinflation',
    1998:'Brazil reaches World Cup final, loses to France',
    2000:'Brazil celebrates 500 years since Portuguese arrival',
    2002:'Lula elected, first working-class President',
    2004:'Bolsa Familia programme launches, largest welfare scheme in Brazil',
    2006:'Lula re-elected despite corruption scandals',
    2008:'Oil discovered in massive pre-salt reserves offshore',
    2010:'Dilma Rousseff elected, first female President',
  },
  RU: {
    1950:'Soviet Union tests its second atomic bomb, arms race accelerates',
    1952:'19th Communist Party Congress, the last held under Stalin',
    1953:'Stalin dies 5 March',
    1954:'Virgin Lands campaign opens vast new farmland in Kazakhstan',
    1956:'Khrushchev denounces Stalin, shocks world',
    1957:'Sputnik launched',
    1959:'Khrushchev visits the United States for the first time',
    1961:'Yuri Gagarin becomes first human in space',
    1962:'Cuban Missile Crisis',
    1964:'Khrushchev ousted, Brezhnev takes power',
    1966:'Luna 9 makes first soft landing on the Moon',
    1968:'Soviet tanks crush Prague Spring',
    1972:'Nixon visits Moscow, detente era begins',
    1974:'Solzhenitsyn expelled from the Soviet Union',
    1976:'Soviet economy stagnates under Brezhnev',
    1979:'Soviet invasion of Afghanistan begins',
    1980:'Moscow Olympics boycotted by Western nations',
    1982:'Brezhnev dies after 18 years in power',
    1985:'Gorbachev becomes leader, glasnost begins',
    1986:'Chernobyl nuclear disaster',
    1988:'Gorbachev announces withdrawal from Afghanistan',
    1989:'First competitive elections in Soviet history held',
    1991:'Soviet Union dissolves 25 December',
    1993:'Yeltsin dissolves parliament, tanks fire on White House',
    1996:'Yeltsin re-elected despite severe health problems',
    1998:'Russia defaults on debt, rouble crisis',
    1999:'Putin becomes PM, Yeltsin resigns',
    2000:'Putin elected President',
    2002:'Moscow theatre hostage crisis kills 130',
    2004:'Beslan school siege, 334 killed including 186 children',
    2006:'Journalist Anna Politkovskaya murdered in Moscow',
    2008:'Russia invades Georgia',
    2010:'Deadly summer wildfires and heatwave grip Moscow region',
  },
  MX: {
    1950:'Mexican economic miracle begins, rapid industrialisation',
    1952:'Adolfo Ruiz Cortines elected President',
    1954:'Mexican women vote for first time federally',
    1956:'Major teachers\' strike challenges the government',
    1958:'Rail workers\' strike suppressed by the army',
    1960:'Nationalisation of the electric industry completed',
    1962:'Mexico hosts Central American and Caribbean Games',
    1964:'Diaz Ordaz becomes President amid growing unrest',
    1966:'Doctors\' strike in Mexico City demands better conditions',
    1968:'Tlatelolco massacre days before Mexico City Olympics',
    1970:'Mexico hosts FIFA World Cup',
    1972:'Echeverria\'s populist spending programme begins',
    1976:'Peso devalued for first time in 22 years',
    1978:'Major oil reserves discovered at Cantarell field',
    1980:'Mexico becomes one of the world\'s top oil exporters',
    1982:'Mexico defaults on foreign debt',
    1985:'Mexico City earthquake kills 10,000',
    1986:'Mexico hosts World Cup, Maradona\'s Hand of God',
    1988:'Carlos Salinas wins disputed election amid fraud claims',
    1990:'Octavio Paz wins Nobel Prize in Literature',
    1993:'NAFTA signed',
    1994:'Zapatista uprising, Colosio assassinated',
    1995:'Peso crisis, Tequila Effect spreads',
    1997:'Opposition wins Mexico City mayor race for first time',
    2000:'Fox wins, ends 71 years of PRI rule',
    2003:'Mexico\'s population passes 100 million',
    2005:'Hurricane Wilma devastates Cancun',
    2007:'Drug war declared, army deployed',
    2009:'Swine flu pandemic begins in Mexico City',
    2010:'Bicentennial of Mexican independence celebrated',
  },
  KR: {
    1950:'Korean War begins June 25',
    1953:'Armistice signed, Korean War ends with peninsula divided',
    1956:'First presidential election under the new constitution',
    1958:'National Assembly elections see growing opposition',
    1960:'April Revolution overthrows Syngman Rhee',
    1961:'Military coup by Park Chung Hee',
    1963:'Park elected President, Third Republic begins',
    1965:'Treaty normalises relations with Japan, sparking protests',
    1967:'South Korea sends troops to fight in Vietnam',
    1970:'Gyeongbu Expressway opens, linking Seoul to Busan',
    1972:'Yushin Constitution gives Park near-absolute power',
    1974:'First Lady killed in assassination attempt on Park',
    1976:'Axe murder incident at Panmunjom raises tensions',
    1979:'Park Chung Hee assassinated',
    1980:'Gwangju Uprising, hundreds killed',
    1983:'Korean Air Lines Flight 007 shot down by Soviet jet',
    1985:'Opposition wins big in parliamentary elections',
    1987:'June Struggle forces democratic transition',
    1988:'Seoul Olympics',
    1990:'South Korea establishes diplomatic ties with the Soviet Union',
    1993:'Kim Young-sam becomes first civilian President in 30 years',
    1996:'Former presidents Chun and Roh convicted of treason',
    1997:'Asian financial crisis, IMF bailout',
    2000:'Inter-Korean summit, Kim Dae-jung wins Nobel',
    2002:'Korea-Japan co-host World Cup, Korea reaches semis',
    2004:'National Assembly votes to impeach President Roh Moo-hyun',
    2006:'North Korea conducts first nuclear test',
    2008:'Lee Myung-bak elected, promises economic revival',
    2010:'ROKS Cheonan sunk, 46 sailors killed',
  },
  IE: {
    1950:'Ireland declares itself a republic, leaves the Commonwealth',
    1952:'Bord Failte established to promote tourism',
    1955:'Ireland joins the United Nations',
    1957:'Economic stagnation drives massive emigration',
    1959:'De Valera elected President, Lemass becomes Taoiseach',
    1961:'RTE television launches its first broadcast',
    1963:'JFK visits Ireland, triumphal homecoming',
    1965:'Anglo-Irish Free Trade Agreement signed with Britain',
    1967:'National Farmers\' Association marches on Dublin',
    1969:'Troubles begin in earnest',
    1972:'Bloody Sunday',
    1973:'Ireland joins EEC',
    1975:'Herrema kidnapping grips the nation',
    1977:'Fianna Fail wins massive majority under Jack Lynch',
    1979:'Pope John Paul II visits, 1.25 million attend',
    1981:'Bobby Sands dies on hunger strike',
    1983:'Eighth Amendment bans abortion by constitutional referendum',
    1985:'Anglo-Irish Agreement gives Dublin a voice on Northern Ireland',
    1987:'Enniskillen Remembrance Day bombing kills 11',
    1990:'Mary Robinson elected first female President',
    1992:'X Case sparks national debate on abortion rights',
    1994:'IRA ceasefire, peace process accelerates',
    1996:'Journalist Veronica Guerin murdered by drug gang',
    1998:'Good Friday Agreement signed',
    1999:'Ireland adopts the Euro, Celtic Tiger at full roar',
    2002:'Nice Treaty ratified on second referendum',
    2004:'Smoking ban in pubs and restaurants, first in Europe',
    2005:'IRA formally ends armed campaign',
    2008:'Banking crisis, Ireland\'s banks collapse',
    2010:'Ireland accepts EU-IMF bailout',
  },
  IT: {
    1950:'Italy rebuilds after the war, Marshall Plan funds flow in',
    1952:'De Gasperi government drives postwar economic recovery',
    1955:'De Gasperi era ends, Christian Democrats dominate',
    1957:'Treaty of Rome signed, Italy co-founds EEC',
    1960:'Rome Olympics, Cassius Clay wins gold',
    1962:'Nationalisation of the electricity industry begins',
    1963:'Economic miracle peaks, Italy booming',
    1965:'Mont Blanc Tunnel opens, connecting Italy and France',
    1966:'Devastating Florence floods damage city',
    1968:'Student protests and worker unrest shake the country',
    1969:'Hot Autumn - mass strikes and factory sit-ins',
    1971:'Divorce legalised despite fierce Church opposition',
    1973:'Historic compromise between DC and Communists',
    1976:'Earthquake kills 1,000 in Friuli',
    1978:'Aldo Moro kidnapped and murdered by Red Brigades',
    1980:'Bologna station bombing kills 85',
    1982:'Italy wins FIFA World Cup in Spain',
    1984:'Craxi becomes Italy\'s longest-serving postwar PM',
    1986:'Mafia maxi-trial begins in Palermo with 475 defendants',
    1988:'Italy becomes the world\'s fifth largest economy',
    1990:'Italy hosts the FIFA World Cup',
    1992:'Mani Pulite - corruption scandal topples parties',
    1994:'Berlusconi wins election, enters politics as PM',
    1996:'Prodi leads centre-left Olive Tree coalition to victory',
    1999:'Italy joins the Euro',
    2001:'Berlusconi wins again, G8 summit in Genoa',
    2003:'Parmalat collapses in Europe\'s biggest corporate fraud',
    2005:'Pope John Paul II dies, Benedict XVI elected',
    2006:'Italy wins fourth World Cup in Germany',
    2008:'Global financial crisis pushes Italy into deep recession',
    2009:'L\'Aquila earthquake kills 309',
  },
  ES: {
    1950:'Spain excluded from Marshall Plan and the United Nations',
    1953:'Spain signs pacts with US, ends isolation',
    1955:'Spain admitted to the United Nations',
    1957:'Opus Dei technocrats join Franco\'s government',
    1959:'Stabilisation plan opens Spain\'s economy',
    1962:'Spain applies for EEC membership, rejected by Brussels',
    1964:'First National Development Plan spurs rapid industrialisation',
    1966:'Press Law eases censorship slightly',
    1968:'ETA carries out its first killing',
    1969:'Franco names Juan Carlos heir to the throne',
    1970:'Burgos trial of ETA members sparks international outcry',
    1973:'PM Carrero Blanco assassinated by ETA',
    1975:'Franco dies, Juan Carlos becomes king',
    1977:'First democratic elections in 41 years',
    1978:'New constitution ratified by referendum',
    1980:'Basque and Catalan autonomy statutes take effect',
    1981:'Failed military coup, democracy survives',
    1982:'PSOE wins landslide, Gonzalez becomes PM',
    1986:'Spain joins EEC and NATO',
    1988:'General strike against labour reforms draws millions',
    1990:'Seville begins preparing for 1992 Expo',
    1992:'Barcelona Olympics and Seville World Expo',
    1996:'Aznar leads PP to victory over Gonzalez',
    1998:'Spain joins the Euro at launch',
    2000:'Aznar wins absolute majority in parliament',
    2002:'Prestige oil tanker sinks, devastating Galician coast',
    2004:'Madrid bombings kill 191, Zapatero wins election',
    2006:'ETA announces permanent ceasefire, later broken',
    2008:'Financial crisis hits Spain, housing bubble bursts',
    2010:'Spain wins World Cup in South Africa',
  },
  NL: {
    1950:'Netherlands sends troops to fight in Korean War',
    1953:'North Sea flood kills 1,836',
    1956:'Natural gas exploration begins in the north',
    1957:'Treaty of Rome signed, Netherlands co-founds EEC',
    1960:'Delta Works massive storm surge barrier project begins',
    1963:'Natural gas discovered at Groningen',
    1965:'Amsterdam Provo movement shakes the city',
    1966:'Princess Beatrix marries German Claus, riots erupt',
    1968:'Student protests sweep Dutch universities',
    1971:'Netherlands decriminalises cannabis in coffee shops',
    1973:'Oil crisis - car-free Sundays declared',
    1975:'Suriname gains independence',
    1977:'South Moluccan hostage crisis on a train, marines storm it',
    1978:'Netherlands reaches World Cup final, loses to Argentina',
    1980:'Queen Beatrix crowned amid Amsterdam riots',
    1982:'Wassenaar Accord launches Dutch polder economic model',
    1985:'Football hooliganism peaks, Feyenoord banned from Europe',
    1988:'Netherlands wins European Championship, first major football trophy',
    1992:'Bijlmermeer air disaster kills 43 in Amsterdam',
    1995:'Major flooding, 250,000 evacuated from rivers',
    1998:'Wim Kok leads Purple Coalition, economy booms',
    2000:'Fireworks factory explosion in Enschede kills 23',
    2002:'Pim Fortuyn assassinated before election',
    2004:'Filmmaker Theo van Gogh murdered',
    2006:'Ayaan Hirsi Ali leaves parliament and the Netherlands',
    2009:'Madurodam attack on Queen Beatrix\'s Day',
    2010:'Netherlands reaches World Cup final',
  },
  ID: {
    1950:'Republic of the United States of Indonesia dissolved, unitary state formed',
    1952:'October 17 Affair, army attempts to dissolve parliament',
    1955:'Bandung Conference, Non-Aligned Movement born',
    1957:'Sukarno declares martial law, nationalises Dutch businesses',
    1958:'Regional rebellions crushed by Jakarta',
    1960:'Sukarno dissolves parliament, guided democracy',
    1962:'West New Guinea campaign, Netherlands agrees to transfer',
    1963:'West New Guinea transferred from Netherlands',
    1965:'Failed coup, Suharto seizes power',
    1966:'Suharto formally takes presidency',
    1969:'West Papua formally integrated into Indonesia',
    1971:'First New Order elections held under Suharto',
    1975:'Indonesia invades East Timor',
    1976:'Free Aceh Movement founded in northern Sumatra',
    1979:'Transmigration programme moves millions',
    1983:'Petrus killings target criminal gangs',
    1986:'Suharto opens economy, deregulation attracts foreign investment',
    1988:'Indonesian economy grows above 7% as Asian tiger',
    1991:'Santa Cruz massacre in East Timor captured on camera',
    1993:'Suharto wins sixth presidential term unopposed',
    1997:'Asian financial crisis devastates economy',
    1998:'Suharto resigns after 32 years in power',
    1999:'East Timor votes for independence',
    2002:'Bali bombings kill 202',
    2004:'Indian Ocean tsunami kills 170,000 in Aceh',
    2005:'Helsinki peace deal ends Aceh conflict',
    2007:'Devastating floods submerge large parts of Jakarta',
    2009:'Yudhoyono wins re-election in landslide victory',
    2010:'Mount Merapi erupts, killing over 350 people',
  },
  TR: {
    1950:'First free elections, Democrat Party wins in landslide',
    1952:'Turkey joins NATO',
    1955:'Istanbul pogrom targets Greek minority',
    1957:'Menderes wins third term, opposition protests grow',
    1960:'Military coup topples Menderes government',
    1961:'Menderes executed by hanging',
    1963:'Ankara Agreement signed with EEC',
    1965:'Demirel becomes PM, Justice Party wins majority',
    1967:'Turkish workers begin large-scale migration to Germany',
    1969:'Student protests and political violence escalate',
    1971:'Military memorandum forces government to resign',
    1974:'Turkish forces invade Cyprus',
    1977:'May Day massacre in Taksim Square kills 34',
    1980:'Military coup, constitution suspended',
    1983:'Civilian rule restored, Ozal becomes PM',
    1984:'PKK insurgency begins in southeast Turkey',
    1987:'Turkey applies for EEC membership',
    1989:'Ozal becomes President, opens economy further',
    1993:'Sivas massacre kills 35 Alevi intellectuals',
    1996:'Susurluk scandal exposes state-mafia links',
    1999:'Ocalan captured, major earthquake kills 17,000',
    2001:'Economic crisis, IMF bailout',
    2002:'AKP wins landslide, Erdogan era begins',
    2004:'EU accession negotiations begin',
    2007:'AKP wins again with increased majority',
    2010:'Constitutional referendum curbs military power',
  },
  NG: {
    1950:'Nigeria\'s first political parties form ahead of independence',
    1952:'First regional elections held under colonial rule',
    1954:'Federal constitution grants more self-governance',
    1956:'Oil discovered in the Niger Delta at Oloibiri',
    1958:'Self-governance granted in Eastern and Western Regions',
    1960:'Nigeria gains independence from Britain',
    1963:'Nigeria becomes a republic',
    1966:'Two military coups in one year',
    1967:'Biafra declares independence, civil war begins',
    1970:'Biafran War ends, one million dead from famine',
    1973:'Oil boom transforms economy, Naira replaces pound',
    1975:'Gowon overthrown, Murtala Mohammed takes power',
    1977:'FESTAC arts and culture festival held in Lagos',
    1979:'Return to civilian rule under Shagari',
    1983:'Military coup removes elected Shagari government',
    1985:'Babangida seizes power in palace coup',
    1987:'Religious riots in northern Nigeria, hundreds killed',
    1991:'Capital officially moved from Lagos to Abuja',
    1993:'Moshood Abiola wins election, result annulled',
    1995:'Ken Saro-Wiwa executed by Abacha regime',
    1998:'Abacha dies suddenly, transition begins',
    1999:'Obasanjo elected, civilian rule restored',
    2001:'Sharia law adopted in several northern states, sparking clashes',
    2003:'Obasanjo re-elected in disputed vote',
    2005:'Nigeria secures debt relief worth $18 billion from Paris Club',
    2007:'Umaru Yar\'Adua wins controversial election',
    2009:'Boko Haram uprising begins in the north',
    2010:'Nigeria celebrates 50th independence anniversary',
  },
  ZA: {
    1950:'Population Registration Act classifies all South Africans by race',
    1952:'Defiance Campaign against apartheid laws',
    1955:'Freedom Charter adopted at Kliptown',
    1958:'Verwoerd becomes PM, architect of grand apartheid',
    1960:'Sharpeville massacre, 69 protesters killed',
    1961:'South Africa leaves Commonwealth, becomes republic',
    1963:'Rivonia Trial, Mandela sentenced to life',
    1966:'PM Verwoerd assassinated in parliament',
    1968:'Basil D\'Oliveira affair, South Africa banned from cricket tour',
    1970:'South Africa expelled from the Olympic movement',
    1973:'Durban strikes, Black workers demand better wages',
    1976:'Soweto uprising, hundreds killed by police',
    1977:'Steve Biko dies in police custody',
    1980:'Zimbabwe gains independence, isolating apartheid South Africa further',
    1982:'Ruth First assassinated by South African parcel bomb in Mozambique',
    1984:'New constitution excludes Blacks, unrest erupts',
    1985:'State of emergency declared',
    1986:'International sanctions intensify, economy suffers',
    1988:'Botha suffers stroke, reform stalls',
    1990:'Mandela freed, ANC unbanned',
    1992:'White referendum endorses negotiations to end apartheid',
    1993:'Nobel Peace Prize awarded to Mandela and de Klerk',
    1994:'First free elections, Mandela becomes President',
    1996:'Truth and Reconciliation Commission begins',
    1999:'Mbeki succeeds Mandela as President',
    2002:'World Summit on Sustainable Development held in Johannesburg',
    2004:'South Africa wins bid to host 2010 World Cup',
    2006:'Zuma acquitted of rape charge, political rise continues',
    2008:'Xenophobic violence kills 62',
    2010:'South Africa hosts FIFA World Cup',
  },
  AR: {
    1950:'Peron consolidates power, Eva campaigns for women\'s suffrage',
    1952:'Evita Peron dies, massive national mourning',
    1955:'Peron overthrown in military coup',
    1958:'Frondizi elected, developmentalism begins',
    1960:'Eichmann captured by Mossad agents in Buenos Aires',
    1962:'Frondizi overthrown by military after allowing Peronists to run',
    1964:'Illia government expands public works and education',
    1966:'General Ongania leads coup',
    1969:'Cordobazo - workers and students revolt',
    1971:'Lanusse opens path for Peron\'s return from exile',
    1973:'Peron returns from exile after 18 years',
    1974:'Peron dies, Isabel Peron takes over',
    1976:'Military junta seizes power, Dirty War begins',
    1978:'Argentina hosts and wins World Cup under junta',
    1980:'Adolfo Perez Esquivel wins Nobel Peace Prize',
    1982:'Falklands War, Argentina defeated by Britain',
    1983:'Return to democracy, Alfonsin elected',
    1985:'Junta leaders convicted for human rights crimes',
    1986:'Maradona leads Argentina to World Cup glory in Mexico',
    1989:'Menem wins election amid hyperinflation',
    1992:'Israeli Embassy in Buenos Aires bombed, 29 killed',
    1994:'New constitution allows Menem\'s re-election',
    1997:'Economic stagnation begins, unemployment rises sharply',
    1999:'De la Rua elected as economy deteriorates',
    2001:'Economic collapse, five presidents in two weeks',
    2003:'Kirchner elected, debt default era begins',
    2005:'Argentina restructures $100 billion in sovereign debt',
    2007:'Cristina Fernandez de Kirchner elected first female President',
    2010:'Argentina celebrates bicentennial of independence',
  },
  PH: {
    1950:'Philippines sends troops to Korean War with UN forces',
    1953:'Magsaysay defeats Quirino in landmark election',
    1955:'Bandung Conference, Philippines joins Non-Aligned gathering',
    1957:'Garcia elected, Filipino First policy',
    1959:'Rizal law mandates teaching of national hero\'s works in schools',
    1961:'Macapagal wins presidency',
    1963:'Sabah claim strains relations with Malaysia',
    1965:'Marcos elected president',
    1967:'ASEAN founded with Philippines as a charter member',
    1969:'Marcos re-elected, First Quarter Storm follows',
    1971:'Plaza Miranda bombing at opposition rally',
    1972:'Marcos declares martial law',
    1973:'New constitution approved, Marcos rules by decree',
    1976:'Mindanao agreement briefly halts Muslim insurgency',
    1978:'Interim National Assembly elections held under martial law',
    1981:'Martial law lifted, Marcos keeps emergency powers',
    1983:'Benigno Aquino assassinated at Manila airport',
    1986:'People Power Revolution ousts Marcos',
    1989:'Multiple coup attempts rock the Aquino government',
    1991:'Mt Pinatubo erupts, massive destruction',
    1992:'Ramos elected, US bases closed',
    1995:'Philippines joins the World Trade Organization',
    1998:'Estrada elected in landslide',
    2000:'Abu Sayyaf kidnappings draw international attention',
    2001:'People Power II ousts Estrada',
    2004:'Arroyo wins disputed election',
    2006:'State of emergency declared after alleged coup plot',
    2009:'Typhoon Ondoy floods Metro Manila',
  },
  EG: {
    1950:'Land reform debated as inequality sparks unrest',
    1952:'Revolution, King Farouk overthrown',
    1954:'Nasser takes power as President',
    1956:'Nasser nationalises Suez Canal, war follows',
    1958:'Egypt and Syria form United Arab Republic',
    1960:'Construction of Aswan High Dam begins with Soviet help',
    1961:'Syria withdraws from UAR, union collapses',
    1963:'Egypt intervenes in Yemen civil war',
    1965:'Muslim Brotherhood crackdown, Sayyid Qutb arrested',
    1967:'Six-Day War, Egypt loses Sinai to Israel',
    1968:'Nasser launches War of Attrition against Israel',
    1970:'Nasser dies, Sadat takes power',
    1971:'Aswan High Dam completed, Lake Nasser fills',
    1973:'Yom Kippur War, Egypt crosses the Suez Canal',
    1975:'Suez Canal reopens after eight years',
    1977:'Bread riots erupt across Egypt over subsidy cuts',
    1978:'Camp David Accords with Israel signed',
    1979:'Peace with Israel, Egypt expelled from Arab League',
    1981:'Sadat assassinated, Mubarak becomes President',
    1986:'Central Security Forces riot over rumoured service extensions',
    1988:'Naguib Mahfouz wins Nobel Prize in Literature, first Arab laureate',
    1990:'Egypt joins Gulf War coalition against Iraq',
    1992:'Cairo earthquake kills 500',
    1995:'Assassination attempt against Mubarak in Addis Ababa',
    1997:'Luxor massacre kills 62 tourists',
    2000:'Egypt hosts African Cup of Nations',
    2002:'Egyptian pound floated, sharp devaluation follows',
    2005:'First multi-candidate presidential election held',
    2008:'Food price crisis sparks strikes across Egypt',
    2010:'Egypt wins third consecutive Africa Cup of Nations',
  },
  PK: {
    1950:'Liaquat Ali Khan leads newly independent Pakistan',
    1952:'Language movement protests demand recognition of Bengali',
    1954:'Pakistan joins SEATO military alliance',
    1956:'Pakistan becomes an Islamic republic',
    1958:'Ayub Khan seizes power in military coup',
    1960:'New capital Islamabad construction begins',
    1962:'New constitution introduced under Ayub Khan',
    1965:'Second war with India over Kashmir',
    1967:'Zulfikar Ali Bhutto founds Pakistan People\'s Party',
    1969:'Ayub Khan resigns, Yahya Khan takes over',
    1971:'Bangladesh breaks away after civil war, Pakistan defeated',
    1973:'New constitution, Bhutto becomes PM',
    1974:'Pakistan hosts Islamic Summit Conference in Lahore',
    1977:'Zia ul-Haq overthrows Bhutto in coup',
    1979:'Bhutto executed, martial law tightens',
    1981:'Pakistan receives massive US military aid during Afghan war',
    1984:'Siachen Glacier conflict with India begins',
    1986:'Benazir Bhutto returns from exile to mass rallies',
    1988:'Zia dies in plane crash, Benazir Bhutto becomes PM',
    1990:'Bhutto dismissed, Nawaz Sharif becomes PM',
    1993:'Political instability, both PM and President resign',
    1996:'Benazir Bhutto dismissed for second time',
    1998:'Pakistan tests nuclear weapons, becomes seventh nuclear state',
    1999:'Musharraf seizes power in military coup',
    2001:'Pakistan joins US war on terror after 9/11',
    2003:'Musharraf survives two assassination attempts',
    2005:'Kashmir earthquake kills 73,000',
    2007:'Benazir Bhutto assassinated at rally',
    2009:'Army launches offensive against Taliban in Swat Valley',
    2010:'Catastrophic floods displace 20 million Pakistanis',
  },
  BD: {
    1952:'Language Movement protests in Dhaka, police kill students',
    1954:'United Front wins East Bengal elections in landslide',
    1956:'Bengali recognised as national language of Pakistan',
    1958:'Martial law imposed across Pakistan, affects East Bengal',
    1962:'Student protests against military rule sweep Dhaka',
    1966:'Six Point Movement demands autonomy for East Pakistan',
    1969:'Mass uprising forces Ayub Khan to resign',
    1971:'Bangladesh declares independence, Liberation War kills millions',
    1972:'Sheikh Mujibur Rahman becomes first PM',
    1974:'Devastating famine kills tens of thousands',
    1975:'Sheikh Mujib assassinated in military coup',
    1977:'Zia ur-Rahman becomes President, founds BNP',
    1979:'First parliamentary elections under Zia\'s government',
    1981:'President Zia assassinated, Ershad takes power',
    1983:'Grameen Bank founded by Muhammad Yunus',
    1985:'Cyclone kills 10,000 along the coast',
    1988:'Worst floods in decades submerge two-thirds of country',
    1990:'Ershad ousted, democracy restored',
    1991:'Cyclone kills 138,000, deadliest in a decade',
    1993:'Garment industry becomes Bangladesh\'s largest export earner',
    1996:'Sheikh Hasina becomes PM, Awami League returns',
    1998:'Floods last three months, 30 million displaced',
    2000:'Arsenic contamination crisis in groundwater wells revealed',
    2002:'Khaleda Zia\'s BNP government wins elections',
    2005:'Series of bombings by militant groups across country',
    2007:'Military-backed caretaker government takes over',
    2009:'Bangladesh Rifles mutiny kills 74 people',
    2010:'International Crimes Tribunal established for 1971 war crimes',
  },
  PL: {
    1950:'Six-Year Plan for rapid industrialisation imposed',
    1952:'Soviet-style constitution imposed',
    1954:'Construction of Nowa Huta steelworks reshapes Krakow',
    1956:'Poznan workers revolt, Gomulka returns to power',
    1958:'Gomulka consolidates power, limits promised reforms',
    1960:'Poland\'s postwar baby boom generation enters schools',
    1962:'Cuban Missile Crisis raises fears across Eastern Europe',
    1964:'Letter of 34 intellectuals protests cultural censorship',
    1966:'Millennium of Polish Christianity celebrations clash with state',
    1968:'Student protests crushed, antisemitic purge follows',
    1970:'Workers shot in Gdansk, Gierek replaces Gomulka',
    1974:'Palace of Culture remains symbol of Soviet influence in Warsaw',
    1976:'Workers\' protests in Radom and Ursus crushed by police',
    1978:'Karol Wojtyla becomes Pope John Paul II',
    1980:'Solidarity trade union founded at Gdansk shipyard',
    1981:'Martial law declared, Solidarity crushed',
    1983:'Lech Walesa wins Nobel Peace Prize',
    1985:'Father Popieluszko murder trial exposes regime brutality',
    1987:'Pope John Paul II visits Poland for third time',
    1989:'Round Table talks, first semi-free elections end communism',
    1990:'Walesa elected President of free Poland',
    1993:'Economic shock therapy continues, new constitution debated',
    1995:'Kwasniewski defeats Walesa in presidential election',
    1997:'Oder River floods devastate southern and western Poland',
    1999:'Poland joins NATO',
    2002:'Poland formally invited to join the European Union',
    2004:'Poland joins the European Union',
    2005:'Lech Kaczynski elected President',
    2007:'Civic Platform wins elections, Tusk becomes PM',
    2010:'President Kaczynski killed in Smolensk air disaster',
  },
  SE: {
    1950:'Sweden builds the welfare state, folkhemmet at its peak',
    1952:'Stockholm hosts Summer Olympics',
    1955:'Compulsory national health insurance introduced',
    1958:'Sweden hosts FIFA World Cup, reaches the final',
    1960:'EFTA formed, Sweden joins as founding member',
    1962:'Sweden\'s social reforms expand childcare and parental leave',
    1964:'Sweden welcomes growing numbers of guest workers',
    1967:'Sweden switches to driving on the right overnight',
    1969:'Olof Palme becomes Prime Minister',
    1971:'Sweden\'s parliament becomes unicameral',
    1973:'Stockholm bank siege coins Stockholm Syndrome',
    1974:'ABBA wins Eurovision with Waterloo',
    1976:'Social Democrats lose power after 44 years',
    1978:'Sweden bans spanking of children, first country in the world',
    1980:'Nuclear power referendum held after Three Mile Island fears',
    1982:'Palme returns as PM, submarine crisis with Soviets',
    1984:'Sweden\'s economy grows strongly under Palme\'s return',
    1986:'Olof Palme assassinated on a Stockholm street',
    1988:'Ingvar Carlsson succeeds Palme as Prime Minister',
    1990:'Sweden applies for European Community membership',
    1992:'Banking crisis, krona floated after peg collapses',
    1994:'MS Estonia ferry disaster kills 852 in Baltic Sea',
    1995:'Sweden joins the European Union',
    1998:'Stockholm named European Capital of Culture',
    2000:'Oresund Bridge opens, linking Sweden and Denmark',
    2003:'Foreign minister Anna Lindh stabbed to death',
    2006:'Centre-right coalition breaks Social Democrat dominance',
    2008:'Global financial crisis causes sharp Swedish economic contraction',
    2010:'Crown Princess Victoria marries Daniel Westling',
  },
  TH: {
    1950:'Thailand sends troops to Korean War with UN forces',
    1952:'Anti-communist laws tighten under military rule',
    1954:'Thailand joins SEATO military alliance',
    1957:'Sarit Thanarat seizes power in military coup',
    1959:'Sarit bans political parties and imposes strict order',
    1963:'Thanom takes over after Sarit dies',
    1965:'Communist insurgency intensifies in the northeast',
    1967:'Thailand is a founding member of ASEAN',
    1969:'Partial elections held under military-drafted constitution',
    1971:'Thanom dissolves parliament, returns to full military rule',
    1973:'Student uprising topples military dictatorship',
    1975:'US forces withdraw from Thai military bases',
    1976:'Thammasat University massacre, military returns',
    1978:'New constitution adopted under General Kriangsak',
    1980:'Prem becomes PM, semi-democracy era begins',
    1985:'Failed coup attempt against Prem government',
    1988:'Chatichai elected, first elected PM in 12 years',
    1990:'Stock market crashes, speculative bubble bursts',
    1992:'Black May - military kills pro-democracy protesters',
    1995:'Banharn elected PM, political instability continues',
    1997:'Asian financial crisis hits, baht collapses',
    1999:'New education reform act restructures Thai schools',
    2001:'Thaksin Shinawatra wins landslide election',
    2003:'War on drugs campaign draws widespread criticism',
    2004:'Indian Ocean tsunami kills 5,400 in Thailand',
    2006:'Military coup ousts Thaksin while he is abroad',
    2008:'Protesters seize Bangkok airports for a week',
    2010:'Red Shirt protests, army crackdown kills 90 in Bangkok',
  },
  VN: {
    1950:'China and Soviet Union recognise Ho Chi Minh\'s government',
    1952:'Land reform campaign begins in North Vietnam',
    1954:'French defeated at Dien Bien Phu, Vietnam divided',
    1955:'Diem becomes President of South Vietnam',
    1957:'Insurgency begins in the South against Diem\'s rule',
    1960:'National Liberation Front formed in the South',
    1962:'Strategic Hamlet programme resettles rural Vietnamese',
    1963:'Buddhist crisis, Diem overthrown and killed',
    1965:'US combat troops arrive, war escalates',
    1967:'North Vietnam withstands massive US bombing campaigns',
    1968:'Tet Offensive shocks the world',
    1969:'Ho Chi Minh dies',
    1971:'South Vietnamese forces invade Laos, operation fails',
    1973:'Paris Peace Accords, US withdraws',
    1975:'Saigon falls, Vietnam reunified under Communist rule',
    1977:'Vietnam joins the United Nations',
    1978:'Vietnam invades Cambodia, ousts Khmer Rouge',
    1979:'China invades northern Vietnam in brief border war',
    1982:'Fifth Party Congress sets direction for economic planning',
    1984:'Border skirmishes with China continue in the north',
    1986:'Doi Moi economic reforms launched',
    1989:'Vietnamese troops withdraw from Cambodia',
    1992:'New constitution permits limited private enterprise',
    1995:'US and Vietnam normalize relations after 20 years',
    1997:'Asian crisis slows but does not halt Vietnamese growth',
    2000:'US President Clinton visits Vietnam',
    2003:'Vietnam\'s economy grows above 7% as exports surge',
    2005:'Prime Minister Phan Van Khai visits the United States',
    2007:'Vietnam joins the World Trade Organization',
    2009:'Vietnam begins construction of its first satellite',
    2010:'Hanoi celebrates 1,000th anniversary of its founding',
  },
  CO: {
    1950:'La Violencia partisan warfare ravages the countryside',
    1953:'Rojas Pinilla seizes power in military coup',
    1955:'Women gain the right to vote in Colombia',
    1957:'National Front agreement, parties alternate in power',
    1960:'Colombia launches agrarian reform programme',
    1962:'Alliance for Progress funds Colombian development',
    1964:'FARC founded in the countryside',
    1966:'ELN guerrilla group emerges',
    1970:'Disputed election, Rojas nearly wins presidency again',
    1974:'National Front era ends, open elections resume',
    1977:'National civic strike paralyses Colombia',
    1980:'M-19 seizes Dominican Republic embassy, holds 57 hostages',
    1983:'Betancur government begins peace talks with guerrillas',
    1985:'M-19 guerrillas storm Palace of Justice, army retakes it',
    1987:'Union Patriotica party members systematically assassinated',
    1989:'Leading presidential candidate Luis Carlos Galan assassinated',
    1991:'New constitution adopted, Pablo Escobar surrenders',
    1993:'Pablo Escobar killed on a Medellin rooftop',
    1995:'Samper accused of taking cartel money for his campaign',
    1998:'Pastrana elected, peace talks with FARC begin',
    1999:'Earthquake in Armenia kills over 1,000',
    2000:'Plan Colombia anti-drug programme launched with US funding',
    2002:'Uribe elected on hardline security platform',
    2004:'Uribe pushes through re-election amendment',
    2006:'Paramilitary demobilisation process advances',
    2008:'Ingrid Betancourt rescued after six years as FARC hostage',
    2010:'Santos elected President, FARC weakened',
  },
  KE: {
    1950:'Colonial government intensifies crackdowns on political organising',
    1952:'Mau Mau uprising against British colonial rule begins',
    1954:'British forces detain tens of thousands in Kenya emergency',
    1957:'First African elected members enter Kenya\'s legislature',
    1960:'Lancaster House conference sets path to independence',
    1963:'Kenya gains independence, Jomo Kenyatta first PM',
    1964:'Kenya becomes a republic, Kenyatta as President',
    1966:'Oginga Odinga forms opposition party, Kenya edges toward one-party rule',
    1969:'Tom Mboya assassinated, political crisis erupts',
    1974:'Kenyatta re-elected, KANU dominance entrenched',
    1977:'East African Community collapses, borders close',
    1978:'Kenyatta dies, Daniel arap Moi becomes President',
    1980:'Norfolk Hotel bombing in Nairobi shocks the capital',
    1982:'Failed air force coup, Moi tightens control',
    1985:'Nairobi hosts UN Women\'s Conference',
    1988:'Queue voting system introduced, criticized as undemocratic',
    1991:'Multi-party politics restored after street protests',
    1992:'Ethnic clashes around first multi-party elections',
    1995:'Wangari Maathai leads democracy and environmental protests',
    1997:'Moi wins disputed re-election, ethnic violence flares',
    1998:'US Embassy in Nairobi bombed, 213 killed',
    2000:'Severe drought causes food crisis across Kenya',
    2002:'Moi steps down, Kibaki wins landslide election',
    2004:'Wangari Maathai wins Nobel Peace Prize',
    2005:'New constitution rejected by referendum',
    2007:'Disputed election triggers ethnic violence, 1,500 killed',
    2008:'Power-sharing deal ends post-election crisis',
    2010:'New constitution approved by referendum',
  },
  SA: {
    1950:'Aramco oil production ramps up, transforming Saudi economy',
    1953:'King Saud succeeds founder Ibn Saud',
    1955:'Saudi Arabia supports Egypt during Suez tensions',
    1957:'King Saud visits the United States',
    1960:'OPEC founded with Saudi Arabia as key member',
    1962:'Slavery abolished in Saudi Arabia',
    1964:'King Faisal takes power, begins modernisation',
    1966:'First Saudi television broadcasts begin',
    1969:'Failed coup attempt by air force officers',
    1973:'Oil embargo after Yom Kippur War, prices quadruple',
    1975:'King Faisal assassinated by his nephew',
    1977:'Saudi Arabia becomes the world\'s largest oil exporter',
    1979:'Siege of Grand Mosque in Mecca, 200 killed',
    1980:'Saudi Arabia takes full control of Aramco from foreign partners',
    1982:'King Fahd begins reign',
    1985:'Oil prices collapse, Saudi revenues drop sharply',
    1987:'Mecca stampede during Hajj kills over 400',
    1990:'Iraq invades Kuwait, US troops deploy to Saudi Arabia',
    1991:'Gulf War, coalition forces launch from Saudi bases',
    1993:'Consultative Assembly (Shura Council) established',
    1996:'Khobar Towers bombing kills 19 US servicemen',
    1999:'First Saudi women attend a cabinet meeting as advisers',
    2001:'Saudi Arabia navigates diplomatic fallout after September 11 attacks',
    2003:'Riyadh compound bombings, war on terror reaches home',
    2005:'King Abdullah begins reign, promises cautious reform',
    2007:'King Abdullah initiates $12.5 billion scholarship programme abroad',
    2009:'King Abdullah University of Science and Technology opens',
    2010:'Saudi economy rebounds as oil prices recover',
  },
  IL: {
    1950:'Law of Return grants every Jew right to immigrate',
    1952:'Reparations agreement signed with West Germany',
    1954:'Lavon Affair, failed covert operation in Egypt exposed',
    1956:'Suez Crisis, Israel captures Sinai',
    1958:'Mass immigration from North Africa transforms Israeli society',
    1960:'Mossad captures Adolf Eichmann in Argentina',
    1961:'Adolf Eichmann trial rivets the world',
    1964:'National Water Carrier completed',
    1966:'Military rule over Arab citizens of Israel ends',
    1967:'Six-Day War, Israel takes control of West Bank, Gaza, Sinai, Golan Heights',
    1969:'Golda Meir becomes Prime Minister',
    1971:'Black Panther protests highlight discrimination against Mizrahi Jews',
    1973:'Yom Kippur War, surprise attack on holiest day',
    1976:'Entebbe raid rescues hostages in Uganda',
    1978:'Camp David Accords signed with Egypt',
    1979:'Israel-Egypt peace treaty signed, Sinai returned',
    1982:'Israel invades Lebanon',
    1984:'Operation Moses airlifts Ethiopian Jews to Israel',
    1987:'First Intifada erupts in occupied territories',
    1989:'Mass Soviet Jewish immigration begins, a million arrive over decade',
    1991:'Gulf War, Iraq fires Scud missiles at Israeli cities',
    1993:'Oslo Accords signed with PLO on White House lawn',
    1995:'PM Yitzhak Rabin assassinated at peace rally',
    1998:'Israel celebrates 50th anniversary of independence',
    2000:'Second Intifada erupts after Camp David fails',
    2003:'Security barrier construction begins in the West Bank',
    2005:'Israel withdraws from Gaza',
    2006:'Second Lebanon War against Hezbollah',
    2008:'Operation Cast Lead in Gaza',
    2010:'Mavi Marmara flotilla incident draws international condemnation',
  },
  PT: {
    1950:'Portugal under Salazar\'s authoritarian Estado Novo regime',
    1953:'First national development plan aims to modernise economy',
    1955:'Portugal joins the United Nations',
    1958:'Humberto Delgado challenges Salazar in rigged election',
    1960:'Opposition suppressed, Delgado\'s supporters silenced',
    1961:'Colonial wars begin in Angola, Goa lost to India',
    1963:'Liberation wars spread to Guinea-Bissau and Mozambique',
    1966:'Salazar Bridge opens in Lisbon',
    1968:'Salazar incapacitated, Caetano takes over',
    1970:'Salazar dies, Caetano continues authoritarian rule',
    1972:'Colonial wars drain Portugal\'s economy and manpower',
    1974:'Carnation Revolution ends 48 years of dictatorship',
    1975:'Decolonisation, independence for African colonies',
    1976:'First free elections, new constitution adopted',
    1978:'Portugal begins long process toward European integration',
    1980:'Centre-right wins elections, Sa Carneiro dies in plane crash',
    1982:'Constitution revised to reduce military influence',
    1984:'Economic austerity under IMF programme',
    1986:'Portugal joins EEC, Soares becomes first civilian President',
    1988:'Chiado fire devastates historic Lisbon district',
    1992:'Portugal takes over European Community presidency',
    1994:'Lisbon named European Capital of Culture',
    1998:'Lisbon hosts Expo 98, Vasco da Gama Bridge opens',
    1999:'Macau returned to China, last European colony in Asia',
    2001:'Porto named European Capital of Culture',
    2004:'Portugal hosts Euro 2004, Greece wins the final',
    2006:'Socrates government launches major infrastructure investment',
    2008:'Global financial crisis hits Portuguese economy',
    2010:'Austerity measures begin as debt crisis hits',
  },
  CL: {
    1952:'Ibanez elected President for second time',
    1955:'Copper miners\' strikes challenge the government',
    1957:'Protests against bus fare hikes rock Santiago',
    1960:'Great Chilean earthquake, strongest ever recorded at 9.5',
    1962:'Chile hosts FIFA World Cup, finishes third',
    1964:'Frei elected, Revolution in Liberty begins',
    1966:'Copper industry partially nationalised under Frei',
    1968:'Agrarian reform intensifies, large estates broken up',
    1970:'Salvador Allende elected, world\'s first Marxist president by vote',
    1972:'Truckers\' strike paralyses the economy',
    1973:'Military coup, Allende dies, Pinochet seizes power',
    1976:'Letelier assassinated in Washington DC car bomb',
    1978:'Chile and Argentina nearly go to war over Beagle Channel',
    1980:'New constitution approved under Pinochet',
    1982:'Economic crisis, banking system collapses',
    1985:'Earthquake kills 177 in central Chile',
    1988:'Plebiscite rejects Pinochet, transition begins',
    1990:'Democracy restored, Aylwin becomes President',
    1994:'Frei Ruiz-Tagle elected, economic growth accelerates',
    1998:'Pinochet arrested in London on human rights charges',
    2000:'Lagos elected, first Socialist President since Allende',
    2003:'Free trade agreement signed with the US',
    2006:'Bachelet becomes first female President of Chile',
    2008:'Chaiten volcano erupts, town evacuated',
    2010:'Earthquake kills 525, miners rescued after 69 days underground',
  },
  MY: {
    1950:'Briggs Plan relocates rural Chinese to combat communist insurgency',
    1952:'First municipal elections held in Kuala Lumpur',
    1955:'Alliance Party wins self-governance elections in landslide',
    1957:'Malaya gains independence from Britain, Merdeka!',
    1960:'Emergency officially ends after 12-year communist insurgency',
    1963:'Malaysia formed with Sabah, Sarawak, and Singapore',
    1965:'Singapore expelled from Malaysia',
    1967:'Malaysia becomes founding member of ASEAN',
    1969:'May 13 racial riots in Kuala Lumpur',
    1970:'New Economic Policy launched to reduce inequality',
    1974:'Kuala Lumpur becomes a federal territory',
    1976:'Hussein Onn becomes PM after Razak\'s death',
    1978:'Vietnamese boat people begin arriving in large numbers',
    1981:'Mahathir becomes PM, begins 22-year tenure',
    1983:'Constitutional crisis between Mahathir and the monarchy',
    1985:'Economic recession, tin crash hits hard',
    1988:'Judicial crisis, Mahathir clashes with judiciary',
    1990:'Mahathir announces Vision 2020 for developed-nation status',
    1993:'Constitutional amendment removes rulers\' legal immunity',
    1996:'Petronas Twin Towers topped out, tallest in the world',
    1997:'Asian financial crisis, ringgit crashes',
    1998:'Anwar Ibrahim sacked and arrested, Reformasi movement',
    2001:'Malaysia weathers global economic slowdown better than neighbours',
    2003:'Mahathir retires after 22 years, Abdullah takes over',
    2004:'Indian Ocean tsunami hits northern Malaysia',
    2006:'Ninth Malaysia Plan focuses on national unity',
    2008:'Opposition wins five states in historic election',
    2010:'Najib launches economic transformation programme',
  },
  UA: {
    1950:'Soviet collectivisation continues to reshape Ukrainian agriculture',
    1953:'Stalin dies, repression eases slightly in Ukraine',
    1954:'Crimea transferred from Russia to Ukraine within USSR',
    1956:'Khrushchev\'s thaw brings limited cultural revival in Ukraine',
    1960:'Rapid industrialisation makes Ukraine a Soviet economic powerhouse',
    1962:'Labour unrest echoes across Soviet Ukraine',
    1964:'Shelest becomes Ukrainian Communist Party leader',
    1966:'Ukrainian dissident intellectuals circulate samizdat literature',
    1970:'Ukrainian population passes 47 million',
    1972:'Shelest purged, Shcherbytsky tightens ideological control',
    1976:'Ukrainian Helsinki Group founded to monitor human rights',
    1978:'Major industrial expansion continues in eastern Ukraine',
    1980:'Ukrainian athletes compete at boycotted Moscow Olympics',
    1983:'Soviet authorities suppress Ukrainian language publications',
    1986:'Chernobyl nuclear disaster, worst in history',
    1988:'Ukrainian cultural and political movements gain momentum',
    1989:'Rukh popular movement founded, miners strike in Donbas',
    1991:'Ukraine declares independence after Soviet collapse',
    1993:'Hyperinflation ravages Ukrainian economy',
    1994:'Budapest Memorandum, Ukraine gives up nuclear weapons',
    1996:'New constitution adopted, hryvnia currency launched',
    1998:'Financial crisis hits Ukraine as Russian rouble collapses',
    2000:'Chernobyl plant finally shut down',
    2001:'Journalist Georgiy Gongadze murdered, Kuchma scandal',
    2002:'Ukraine seeks closer ties with NATO and the EU',
    2004:'Orange Revolution overturns fraudulent election',
    2005:'Yushchenko inaugurated after Orange Revolution',
    2006:'Gas dispute with Russia disrupts European energy supplies',
    2008:'Global financial crisis hits Ukraine hard',
    2010:'Yanukovych elected President, reverses western course',
  },
  GH: {
    1950:'Positive Action campaign demands independence from Britain',
    1952:'Nkrumah becomes leader of government business under colonial rule',
    1954:'Cocoa boycotts and strikes push for better conditions',
    1956:'British Togoland votes to join Gold Coast in plebiscite',
    1957:'Ghana becomes first sub-Saharan African nation to gain independence',
    1960:'Ghana becomes a republic, Nkrumah as President',
    1962:'Nkrumah survives assassination attempt at Kulungugu',
    1964:'Nkrumah declares one-party state',
    1966:'Military coup ousts Nkrumah while abroad',
    1969:'New constitution, civilian rule briefly restored',
    1971:'Busia government devalues cedi, sparks public anger',
    1972:'Military coup by Acheampong',
    1975:'Acheampong\'s economic decline worsens, inflation soars',
    1977:'UNIGOV referendum proposed, opposition mounts',
    1979:'Rawlings leads coup, former leaders executed',
    1981:'Rawlings returns in second coup',
    1983:'Devastating drought and bush fires, million expelled from Nigeria',
    1986:'Economic Recovery Programme begins under IMF guidance',
    1988:'District Assembly elections introduce local government reform',
    1990:'Rawlings government begins structural adjustment',
    1992:'New constitution approved, multi-party democracy returns',
    1996:'Rawlings wins re-election in multi-party vote',
    1998:'Ghana\'s economy stabilises, inflation falls below 20%',
    2000:'Peaceful transfer of power, Kufuor elected',
    2002:'National Reconciliation Commission examines past abuses',
    2004:'Kufuor re-elected as economy strengthens',
    2007:'Oil discovered offshore in Jubilee Field',
    2008:'Ghana reaches World Cup semi-finals as last African team',
    2010:'Ghana starts pumping oil, economy booms',
  },
  PE: {
    1950:'Odria seizes power in military coup',
    1952:'Toquepala copper mine opens, one of the largest in South America',
    1955:'Women gain the right to vote in Peru',
    1957:'Massive rural-to-urban migration swells Lima\'s population',
    1960:'Social unrest grows as rural workers demand land reform',
    1962:'Military annuls election, brief junta rule',
    1964:'Belaunde launches modest land reform and road-building programme',
    1966:'Guerrilla movements emerge in the Andes highlands',
    1968:'Velasco seizes power, radical land reform begins',
    1970:'Earthquake kills 70,000 in Ancash',
    1972:'Velasco nationalises fishmeal industry and foreign oil companies',
    1975:'Morales Bermudez overthrows Velasco in palace coup',
    1978:'Constituent Assembly drafts new constitution',
    1980:'Democracy returns, Shining Path launches insurgency in Ayacucho',
    1982:'El Nino devastates fishing and agriculture',
    1985:'Alan Garcia elected, economy soon spirals',
    1988:'Hyperinflation reaches 7,000%, economy in freefall',
    1990:'Fujimori elected in stunning upset',
    1992:'Fujimori shuts down Congress, Abimael Guzman captured',
    1994:'Privatisation programme sells off state companies',
    1996:'MRTA hostage crisis at Japanese embassy lasts four months',
    1998:'El Nino floods cause widespread destruction',
    2000:'Fujimori flees to Japan amid corruption scandal',
    2001:'Toledo elected, first indigenous President',
    2003:'Truth Commission reports 69,000 killed in the conflict',
    2005:'Peru signs free trade agreement with the United States',
    2007:'Earthquake devastates Pisco, 500 killed',
    2009:'Bagua clashes between indigenous protesters and police kill 34',
    2010:'Mario Vargas Llosa wins Nobel Prize in Literature',
  },
  US: {
    1950:'Korean War begins, US troops sent to defend South Korea',
    1952:'Eisenhower elected president, hydrogen bomb tested',
    1953:'Korean War armistice signed at Panmunjom',
    1954:'Brown v. Board rules school segregation unconstitutional',
    1955:'Rosa Parks refuses to give up her seat, Montgomery Bus Boycott',
    1956:'Interstate Highway System construction begins',
    1957:'Little Rock crisis - Eisenhower sends troops to integrate school',
    1958:'NASA founded in response to Sputnik',
    1959:'Alaska and Hawaii become 49th and 50th states',
    1960:'JFK elected youngest President, first Catholic in the White House',
    1961:'Bay of Pigs invasion fails, Kennedy takes blame',
    1962:'Cuban Missile Crisis brings world to the brink of nuclear war',
    1963:'JFK assassinated in Dallas on 22 November',
    1964:'Civil Rights Act signed, Beatles arrive for first US tour',
    1965:'Medicare created, Voting Rights Act signed, Watts riots',
    1966:'Miranda rights ruling, Black Panther Party founded',
    1967:'Summer of Love in San Francisco, race riots in Detroit',
    1968:'MLK and RFK both assassinated months apart',
    1969:'Neil Armstrong walks on the Moon, 20 July',
    1970:'Kent State shooting - National Guard kills four students',
    1971:'Pentagon Papers published, 26th Amendment lowers voting age to 18',
    1972:'Nixon visits China, Watergate break-in',
    1973:'Roe v. Wade legalizes abortion, Watergate hearings on TV',
    1974:'Nixon resigns over Watergate - first president to do so',
    1975:'Fall of Saigon ends the Vietnam War',
    1976:'US celebrates bicentennial, Carter elected President',
    1977:'Jimmy Carter inaugurated, Elvis Presley dies in Memphis',
    1979:'Three Mile Island nuclear accident, Iran hostage crisis begins',
    1980:'John Lennon shot dead in New York',
    1981:'Reagan survives assassination attempt, IBM PC launches',
    1983:'US invades Grenada, Korean Air Lines 007 shot down',
    1984:'Reagan wins 49 states in re-election landslide',
    1986:'Space Shuttle Challenger explodes 73 seconds after launch',
    1988:'George H.W. Bush elected President',
    1989:'Exxon Valdez oil spill, Panama invasion',
    1990:'Americans with Disabilities Act signed into law',
    1991:'Gulf War - US leads coalition to liberate Kuwait',
    1992:'LA riots after Rodney King verdict, Clinton elected President',
    1993:'World Trade Center bombed, Clinton signs NAFTA',
    1995:'Oklahoma City bombing kills 168',
    1996:'Clinton re-elected, welfare reform signed',
    1998:'Clinton impeached by House over Lewinsky affair',
    1999:'Columbine school shooting shocks the nation',
    2000:'Y2K passes without disaster, Bush v. Gore decides election',
    2001:'9/11 attacks kill nearly 3,000, War on Terror begins',
    2003:'Iraq War begins, Space Shuttle Columbia disintegrates on reentry',
    2004:'Bush re-elected, Facebook launches at Harvard',
    2005:'Hurricane Katrina devastates New Orleans',
    2007:'iPhone launched, Great Recession begins with housing crash',
    2008:'Obama elected first Black president, financial crisis hits',
    2009:'Obama inaugurated, stimulus package fights Great Recession',
    2010:'Deepwater Horizon oil spill, Obamacare signed into law',
  },
  CN: {
    1950:'China enters Korean War, Tibet annexed',
    1952:'Three-anti and Five-anti campaigns target corruption and capitalists',
    1953:'First Five-Year Plan launched, Stalin dies',
    1955:'Agricultural collectivisation accelerates across rural China',
    1956:'Hundred Flowers Campaign - brief period of open criticism',
    1957:'Anti-Rightist Campaign purges 500,000 intellectuals',
    1958:'Great Leap Forward begins, Mao orders backyard steel furnaces',
    1959:'Great Chinese Famine begins - tens of millions will die',
    1960:'Sino-Soviet split, Soviet advisers withdrawn',
    1962:'Sino-Indian War, China seizes Aksai Chin',
    1964:'China tests its first nuclear bomb in Xinjiang desert',
    1966:'Cultural Revolution begins - Red Guards terrorize the country',
    1968:'Millions of urban youth sent down to the countryside',
    1969:'Sino-Soviet border clashes on Ussuri River',
    1971:'Lin Biao dies fleeing to USSR, China joins UN Security Council',
    1972:'Nixon visits Beijing, opens diplomatic relations',
    1974:'Campaign to Criticize Lin Biao and Confucius sweeps the nation',
    1976:'Mao Zedong dies, Gang of Four arrested',
    1978:'Deng Xiaoping launches Reform and Opening Up policy',
    1979:'One-Child Policy introduced, China invades Vietnam briefly',
    1980:'Shenzhen Special Economic Zone established',
    1982:'New constitution adopted, Deng consolidates power',
    1984:'China wins 15 gold medals at Los Angeles Olympics',
    1986:'Compulsory education law passes, student protests begin',
    1988:'Price reform sparks inflation panic and bank runs',
    1989:'Tiananmen Square massacre on 4 June',
    1991:'Severe Yangtze River floods displace millions',
    1992:'Deng Xiaoping Southern Tour relaunches economic reform',
    1994:'Three Gorges Dam construction officially begins',
    1995:'Taiwan Strait crisis as China conducts missile tests',
    1997:'Hong Kong handed back from Britain on 1 July',
    1999:'Macau returned from Portugal, US bombs Chinese embassy in Belgrade',
    2001:'China joins WTO, Beijing wins 2008 Olympic bid',
    2003:'SARS epidemic, Yang Liwei becomes first Chinese astronaut',
    2005:'Anti-Japan protests over history textbooks',
    2006:'Three Gorges Dam completed, world\'s largest hydroelectric project',
    2008:'Beijing Olympics open on 8 August, Sichuan earthquake kills 70,000',
    2010:'China overtakes Japan as world\'s second-largest economy',
  },
};

// ---------------------------------------------------------------------------
// TIER 2: LOCAL MUSIC CHARTS (DE, FR, AU, IT, ES, BR, JP, KR, IN, TR, SE, PT, NL)
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
  1960:{s:'Pyar Hua Ikraar Hua',a:'Lata & Manna Dey (Shree 420)'},
  1965:{s:'Mere Sapno Ki Rani',a:'Kishore Kumar'},
  1971:{s:'Dum Maro Dum',a:'Asha Bhosle (Hare Rama Hare Krishna)'},
  1975:{s:'Sholay Theme - Mehbooba',a:'R.D. Burman (Sholay)'},
  1981:{s:'Om Shanti Om',a:'Kishore Kumar (Karz)'},
  1988:{s:'Ek Do Teen',a:'Alka Yagnik (Tezaab)'},
  1992:{s:'Dhak Dhak Karne Laga',a:'Udit Narayan (Beta)'},
  1995:{s:'Tu Cheez Badi Hai Mast',a:'Udit Narayan (Mohra)'},
  1998:{s:'Chaiyya Chaiyya',a:'Sukhwinder Singh (Dil Se)'},
  1999:{s:'Taal Se Taal Mila',a:'A.R. Rahman (Taal)'},
  2002:{s:'Kal Ho Naa Ho',a:'Sonu Nigam'},
  2004:{s:'Kajra Re',a:'Alisha Chinai (Bunty Aur Babli)'},
  2007:{s:'Jai Ho',a:'A.R. Rahman (Slumdog Millionaire)'},
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

const LOCAL_MUSIC = {
  DE: MUSIC_DE_NO1, FR: MUSIC_FR_NO1, AU: MUSIC_AU_NO1,
  IT: MUSIC_IT_NO1, ES: MUSIC_ES_NO1, BR: MUSIC_BR_NO1,
  JP: MUSIC_JP_NO1, KR: MUSIC_KR_NO1, IN: MUSIC_IN_NO1,
  TR: MUSIC_TR_NO1, SE: MUSIC_SE_NO1, PT: MUSIC_PT_NO1,
  NL: MUSIC_NL_NO1,
};
const LOCAL_MUSIC_LABEL = {
  DE: 'German Chart #1', FR: 'French Chart #1', AU: 'Australian Chart #1',
  IT: 'Italian Chart #1', ES: 'Spanish Chart #1', BR: 'Brazilian Chart #1',
  JP: 'Japanese Oricon #1', KR: 'Korean Chart #1', IN: 'Indian Chart #1',
  TR: 'Turkish Chart #1', SE: 'Swedish Chart #1', PT: 'Portuguese Chart #1',
  NL: 'Dutch Chart #1',
};


// ---------------------------------------------------------------------------
// TIER 2: LOCAL FILM (IN, JP, KR, FR, IT, BR, GB, DE)
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
  1991:{t:'Lamhe',d:'Yash Chopra'},
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

const VOICE_THEN = {
  1950: 'recording your voice meant a reel-to-reel tape recorder',
  1960: 'hearing a new voice meant tuning into the radio',
  1970: 'recording your voice meant pressing play+record on a cassette',
  1980: 'your voice lived on answering machines and camcorder tapes',
  1990: 'capturing your voice meant a voicemail or a camcorder',
  2000: 'recording your voice meant GarageBand or a cheap USB mic',
  2010: 'sharing your voice meant voice notes and YouTube vlogs',
};

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
  { code: 'IT', name: 'Italy',          flag: '🇮🇹' },
  { code: 'ES', name: 'Spain',          flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands',    flag: '🇳🇱' },
  { code: 'ID', name: 'Indonesia',      flag: '🇮🇩' },
  { code: 'TR', name: 'Turkiye',        flag: '🇹🇷' },
  { code: 'NG', name: 'Nigeria',        flag: '🇳🇬' },
  { code: 'ZA', name: 'South Africa',   flag: '🇿🇦' },
  { code: 'AR', name: 'Argentina',      flag: '🇦🇷' },
  { code: 'PH', name: 'Philippines',    flag: '🇵🇭' },
  { code: 'EG', name: 'Egypt',          flag: '🇪🇬' },
  { code: 'PK', name: 'Pakistan',      flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh',    flag: '🇧🇩' },
  { code: 'PL', name: 'Poland',        flag: '🇵🇱' },
  { code: 'SE', name: 'Sweden',        flag: '🇸🇪' },
  { code: 'TH', name: 'Thailand',      flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam',       flag: '🇻🇳' },
  { code: 'CO', name: 'Colombia',      flag: '🇨🇴' },
  { code: 'KE', name: 'Kenya',         flag: '🇰🇪' },
  { code: 'SA', name: 'Saudi Arabia',  flag: '🇸🇦' },
  { code: 'IL', name: 'Israel',        flag: '🇮🇱' },
  { code: 'PT', name: 'Portugal',      flag: '🇵🇹' },
  { code: 'CL', name: 'Chile',         flag: '🇨🇱' },
  { code: 'MY', name: 'Malaysia',      flag: '🇲🇾' },
  { code: 'UA', name: 'Ukraine',       flag: '🇺🇦' },
  { code: 'GH', name: 'Ghana',         flag: '🇬🇭' },
  { code: 'PE', name: 'Peru',          flag: '🇵🇪' },
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

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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
let countUpObs = null;

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
const $saveCardBtn      = document.getElementById('save-card-btn');
const $shareCard        = document.getElementById('share-card');
const $dataError        = document.getElementById('data-error');
const $errorMessage     = document.getElementById('error-message');
const $errorBackBtn     = document.getElementById('error-back-btn');

// Stores last rendered state so share card can access it
let _lastRender = null;

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
      tabindex="-1"
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
  if (e.key === 'Escape') {
    closeDropdown();
    $countryBtn.focus();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    const items = $countryList.querySelectorAll('[data-code]');
    if (items.length > 0) items[0].focus();
  }
});

$countryList.addEventListener('keydown', (e) => {
  const items = Array.from($countryList.querySelectorAll('[data-code]'));
  const idx = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (idx < items.length - 1) items[idx + 1].focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (idx > 0) items[idx - 1].focus();
    else $countrySearch.focus();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (idx >= 0) items[idx].click();
  } else if (e.key === 'Escape') {
    closeDropdown();
    $countryBtn.focus();
  }
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
  _lastRender = { year, countryCode, data };
  const country = COUNTRY_MAP[countryCode] || COUNTRIES[0];
  const name = getUserName();

  // Populate header - personalise with name if provided
  if (name) {
    $headerYear.textContent = `The World When ${name} Was Born`;
  } else {
    $headerYear.textContent = year;
  }
  $headerCountry.innerHTML = `<span class="flag">${country.flag}</span><span class="country-name-full">&nbsp;${displayCountryName(country, year)}</span>`;

  // Build all acts
  $infoContent.innerHTML = [
    renderActI(year, countryCode, data),
    renderActII(year, countryCode, data),
    renderActIII(year, countryCode, data),
    renderActIV(year, data),
    renderActV(year, countryCode, data),
    renderOutro(year, countryCode, data),
    renderVoiceCard(year),
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
// DISPLAY COUNTRY NAME (handles historical names)
// ---------------------------------------------------------------------------

function displayCountryName(country, year) {
  if (country.code === 'DE' && year < 1990) return 'West Germany';
  if (country.code === 'BD' && year < 1971) return 'East Pakistan';
  return country.name;
}

// ---------------------------------------------------------------------------
// ACT I - THE WORLD STAGE
// ---------------------------------------------------------------------------

function renderActI(year, countryCode, data) {
  const pop = data.world?.population_billions;
  const popDiff = pop ? (TODAY.population_billions - pop).toFixed(1) : null;

  const leaderInfo = LEADER_KEYS[countryCode] || LEADER_KEYS.US;
  const countryLeader = data.leaders?.[leaderInfo.key] || data.countries?.[countryCode]?.leader || 'Unknown';
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

  // Tier 2: Country political event
  const countryEvent = countryCode !== 'US' ? COUNTRY_EVENTS[countryCode]?.[year] : null;
  const countryEventCard = countryEvent ? `
    <div class="pattern-a" data-reveal>
      <p class="eyebrow">${country.flag} ${country.name}</p>
      <p class="section-headline">That year in your country</p>
      <p class="country-event-text">${escHtml(countryEvent)}</p>
    </div>` : '';

  // Feature 4: CO2 at birth vs today
  const co2Then = CO2_PPM[year];
  const co2Gain = co2Then ? (CO2_TODAY - co2Then).toFixed(1) : 0;
  const co2Pct = co2Then ? Math.round((co2Gain / co2Then) * 100) : 0;
  const co2Commentary = co2Then
    ? (co2Pct > 30
      ? `The atmosphere has ${co2Pct}% more CO\u2082 than the day you were born. Most of that increase happened in your lifetime.`
      : `CO\u2082 has climbed ${co2Pct}% since your birth. The Keeling Curve has never gone down.`)
    : '';
  const co2Card = co2Then ? patternB({
    eyebrow: 'Atmosphere',
    headline: 'CO\u2082 in the air you first breathed',
    left:  { label: String(year), value: `${co2Then} ppm`, desc: 'CO\u2082 concentration (Keeling Curve)' },
    right: { label: 'Today', labelMuted: true, value: `${CO2_TODAY} ppm`, desc: `+${co2Gain} ppm since your birth` },
    commentary: co2Commentary,
  }) : '';

  // Feature 2: Top baby names (US and GB only)
  const nameData = (countryCode === 'GB' || countryCode === 'US')
    ? (countryCode === 'GB' ? BABY_NAMES_UK : BABY_NAMES_US)[year]
    : null;
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
              label: `${displayCountryName(country, year)} ${data.countries?.[countryCode]?.leader_title || leaderInfo.title}`,
              value: countryLeader,
              sub: data.countries?.[countryCode]?.leader_title || leaderInfo.title,
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

        ${countryEventCard}

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

  const todayTag = isUS ? 'today' : 'US today';
  const prices = [
    { emoji: '⛽', label: 'Gallon of gas',   value: data.prices_us?.gallon_gas_usd,   todayValue: TODAY.prices.gallon_gas_usd,   todayLabel: todayTag },
    { emoji: '🥛', label: 'Gallon of milk',  value: data.prices_us?.gallon_milk_usd,  todayValue: TODAY.prices.gallon_milk_usd,  todayLabel: todayTag },
    { emoji: '🥚', label: 'Dozen eggs',      value: data.prices_us?.dozen_eggs_usd,   todayValue: TODAY.prices.dozen_eggs_usd,   todayLabel: todayTag },
    { emoji: '🍞', label: 'Loaf of bread',   value: data.prices_us?.loaf_bread_usd,   todayValue: TODAY.prices.loaf_bread_usd,   todayLabel: todayTag },
    { emoji: '🎬', label: 'Movie ticket',    value: data.prices_us?.movie_ticket_usd, todayValue: TODAY.prices.movie_ticket_usd, todayLabel: todayTag },
    { emoji: '🍔', label: 'Big Mac',         value: data.prices_us?.big_mac_usd,      todayValue: TODAY.prices.big_mac_usd,      todayLabel: todayTag },
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
    const incomeMultiple = Math.round(usGdp / countryGdp);
    const gdpCommentary = countryGdp < usGdp
      ? (incomeMultiple >= 10
        ? `The average American earned roughly ${incomeMultiple}x more. A reflection of the global economy at the time - not the full story of growing up in ${country.name}.`
        : incomeMultiple >= 3
        ? `Americans earned about ${incomeMultiple}x more on paper, though cost of living differed enormously.`
        : `A meaningful gap, though the numbers don't capture differences in cost of living and quality of life.`)
      : `${country.name} was already among the world's wealthiest nations per person.`;
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
      commentary: gdpCommentary,
    });
  }

  // Life expectancy comparison card (non-US only)
  const countryLifeExp = countryData?.life_expectancy;
  const globalLifeExp  = data.world?.life_expectancy_global;

  let lifeExpCard = '';
  if (!isUS && countryLifeExp && globalLifeExp) {
    const diff = (countryLifeExp - globalLifeExp).toFixed(1);
    const diffAbs = Math.abs(diff);
    const aboveBelow = diff > 0 ? `${diffAbs} years above the global average` : `${diffAbs} years below the global average`;
    const lifeCommentary = diff > 5
      ? `Well above the global average. Healthcare and living standards in ${country.name} were ahead of most of the world.`
      : diff > 0
      ? `Slightly above the world average. Not bad, but far from the longest-living nations.`
      : diff > -5
      ? `Below the global average at the time - but ${country.name} has made real strides since.`
      : `Well below the global average in ${year}. The gains since then tell a story of resilience.`;
    lifeExpCard = patternB({
      eyebrow: 'Health',
      headline: 'How long people lived',
      left: {
        label: `${country.flag} ${country.name}`,
        value: `${countryLifeExp}`,
        desc: 'years life expectancy at birth',
      },
      right: {
        label: '🌍 World Average',
        labelMuted: true,
        value: `${globalLifeExp}`,
        desc: aboveBelow,
      },
      commentary: lifeCommentary,
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
          commentary: incomeAdj > TODAY.us_median_income
            ? 'Your parents\' generation had more buying power on paper. But they didn\'t have smartphones, streaming, or same-day delivery.'
            : 'Wages have grown, but housing, healthcare, and education have grown faster. The math isn\'t in your favor.',
        }) : ''}

        ${!isUS ? gdpCompareCard : ''}

        ${!isUS ? lifeExpCard : ''}

        ${patternE({
          eyebrow: isUS ? 'Everyday Prices' : 'Meanwhile in America',
          headline: isUS ? 'What things cost' : 'What things cost in the US',
          prices,
        })}

        ${isUS && ratioThen ? patternB({
          eyebrow: 'Housing',
          headline: 'Homes vs. salaries - then and now',
          left: {
            label: String(year),
            value: `${ratioThen}×`,
            desc: `Median home cost ${ratioThen}x the average annual salary`,
          },
          right: {
            label: 'Today',
            labelMuted: true,
            value: `${ratioToday}×`,
            desc: `Median home now costs ${ratioToday}x the average annual salary`,
          },
          commentary: parseFloat(ratioToday) > parseFloat(ratioThen)
            ? `Housing has gotten ${(parseFloat(ratioToday) / parseFloat(ratioThen)).toFixed(1)}x harder to afford relative to income. Your parents weren't exaggerating about how cheap houses were.`
            : 'Housing was actually more expensive relative to income back then. One of the rare things that got better.',
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
  const isUS = countryCode === 'US';
  const sportStats = [
    { label: 'FIFA World Cup', value: sports.fifa_world_cup, sub: 'Football' },
    { label: 'F1 Champion', value: sports.f1_champion, sub: 'Formula One' },
    isUS ? { label: 'Super Bowl', value: sports.super_bowl_winner, sub: sports.super_bowl_score || 'Champion' } : null,
    isUS ? { label: 'NBA Champion', value: sports.nba_champion, sub: 'Basketball' } : null,
    { label: "Wimbledon Men's", value: sports.wimbledon_mens, sub: 'Tennis' },
  ].filter(s => s && s.value && s.value !== 'undefined / undefined').slice(0, 3);

  // For GB users, show UK #1 instead of Billboard
  const songTitle  = (countryCode === 'GB' && ukSong) ? ukSong : song;
  const songArtist = (countryCode === 'GB' && ukSong) ? ukArtist : artist;
  const songLabel  = (countryCode === 'GB' && ukSong) ? 'UK Chart #1' : (isUS ? 'Billboard Year-End #1' : 'US Billboard #1');

  // Tier 2: Local music chart (DE, FR, AU)
  const localMusic = LOCAL_MUSIC[countryCode]?.[year];
  const localMusicLabel = LOCAL_MUSIC_LABEL[countryCode] || null;

  // Tier 2: Local film
  const localFilm = LOCAL_FILM[countryCode]?.[year];
  const localFilmLabel = LOCAL_FILM_LABEL[countryCode] || null;

  // Tier 2: Local sports champion
  const sportEntry = SPORTS_LOOKUP[countryCode];
  const localChampion = sportEntry?.data[year];
  const localLeague = localChampion ? sportEntry.league(year) : null;

  return `
    <div class="act" id="act-3">
      <p class="act-label">Act III</p>
      <div class="act-sections">

        ${localMusic && localMusicLabel ? patternC({
          eyebrow: localMusicLabel,
          title: localMusic.s,
          detail: localMusic.a,
        }) : ''}

        ${patternC({
          eyebrow: songLabel,
          title: songTitle,
          detail: songArtist,
        })}

        ${patternC({
          eyebrow: isUS ? 'Oscar Best Picture' : 'At the Oscars',
          title: movie,
          detail: director ? `Directed by ${director}` : '',
        })}

        ${localFilm && localFilmLabel ? patternC({
          eyebrow: localFilmLabel,
          title: localFilm.t,
          detail: localFilm.d ? `Dir. ${localFilm.d}` : '',
        }) : ''}

        ${grammyAlbum ? patternC({
          eyebrow: 'Grammy Album of the Year',
          title: grammyAlbum,
          detail: grammyArtist,
        }) : ''}

        ${premieres.length > 0 ? `
          <div class="pattern-a" data-reveal>
            <p class="eyebrow">${isUS ? 'TV Premieres' : 'On American TV'}</p>
            <p class="section-headline">Shows born the same year as you</p>
            <div class="show-pills">
              ${premieres.map(s => `<span class="show-pill">${escHtml(s)}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${(sportStats.length > 0 || localChampion) ? patternF({
          eyebrow: 'Sports',
          headline: 'Champions of the year',
          stats: [
            localChampion && { label: localLeague, value: localChampion, sub: sportEntry.sport },
            ...sportStats,
          ].filter(Boolean).slice(0, 4),
        }) : ''}

        ${patternF({
          eyebrow: 'Screen & Page',
          headline: 'What everyone was watching and reading',
          stats: [
            { label: isUS ? 'Most-Watched Show' : 'Most-Watched US Show', value: tvShow,   sub: 'Television' },
            { label: isUS ? 'Fiction Bestseller' : 'US Fiction Bestseller', value: book,     sub: bookAuthor || 'Fiction' },
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
          commentary: exoThen === 0
            ? 'When you were born, humanity had no proof that planets existed outside our solar system. Now we know they\'re everywhere.'
            : `We\'ve gone from ${exoThen} to ${EXOPLANETS_TODAY.toLocaleString()}. Most of these worlds were found by a single space telescope called Kepler.`,
        })}

      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// ACT V - YOUR PLACE IN TIME
// ---------------------------------------------------------------------------

function abbreviateNumber(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(1).replace(/\.0$/, '') + ' trillion';
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + ' billion';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + ' million';
  return n.toLocaleString();
}

function renderActV(year, countryCode, data) {
  const countryData = data.countries?.[countryCode] || data.countries?.US || {};
  const country     = COUNTRY_MAP[countryCode] || COUNTRIES[0];
  const name        = getUserName();
  const lifeExpThen = countryData.life_expectancy || data.world?.life_expectancy_global;
  const lifeExpTodayLocal = TODAY.life_expectancy[countryCode] || TODAY.global_life_expectancy;
  const lifeLabel   = displayCountryName(country, year);

  const popMillions = countryData.population_millions;
  const gdpPerCap   = countryData.gdp_per_capita_usd;
  const worldBirths = data.world?.births_millions;

  const births   = (data.notable_births || []).slice(0, 5);
  const doublings  = Math.round((CURRENT_YEAR - year) / 2);
  const multiplierRaw = Math.pow(2, doublings);
  const multiplier = abbreviateNumber(multiplierRaw);

  const popFmt = !popMillions ? null
    : popMillions >= 1000 ? `${(popMillions / 1000).toFixed(1)}B`
    : `${Math.round(popMillions)}M`;

  const gdpFmt = !gdpPerCap ? null
    : gdpPerCap >= 10000 ? `$${Math.round(gdpPerCap / 1000)}k`
    : `$${Math.round(gdpPerCap).toLocaleString()}`;

  const countryStats = [
    popFmt      && { label: 'Population', value: popFmt, sub: `people in ${displayCountryName(country, year)}` },
    gdpFmt      && { label: 'GDP per Capita', value: gdpFmt, sub: 'per person per year' },
    worldBirths && { label: 'Your Birth Cohort', value: `${worldBirths}M`, sub: 'babies born worldwide that year' },
  ].filter(Boolean);

  return `
    <div class="act" id="act-5">
      <p class="act-label">Act V</p>
      <div class="act-sections">

        ${countryStats.length > 0 ? patternF({
          eyebrow: name ? `${name}'s ${country.flag} ${displayCountryName(country, year)}` : `${country.flag} ${displayCountryName(country, year)}`,
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
          commentary: lifeExpThen && lifeExpTodayLocal
            ? (lifeExpTodayLocal - lifeExpThen) > 10
              ? `That's ${(lifeExpTodayLocal - lifeExpThen).toFixed(0)} more years of life gained in a single generation. Vaccines, antibiotics, and cleaner water changed everything.`
              : (lifeExpTodayLocal - lifeExpThen) > 3
              ? `${(lifeExpTodayLocal - lifeExpThen).toFixed(0)} years of progress. Steady gains from better medicine, nutrition, and public health.`
              : 'Progress has slowed in recent decades. The easy wins are behind us.'
            : null,
        })}

        ${births.length > 0 ? `<div class="pattern-a" data-reveal>
          <p class="eyebrow">Notable Births</p>
          <p class="section-headline">Born the same year as you</p>
          <p class="notable-births-list">
            ${births.map((b, i) => {
              const sep = i < births.length - 1 ? '<span class="birth-sep">·</span>' : '';
              return `<span>${escHtml(b.name)}</span>${sep}`;
            }).join('')}
          </p>
        </div>` : ''}

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
  const leader  = data.leaders?.[leaderInfo.key] || data.countries?.[countryCode]?.leader;
  const country = COUNTRY_MAP[countryCode] || COUNTRIES[0];

  let leaderLine = '';
  if (leader && leader !== 'Unknown') {
    const positionMap = {
      US: 'was in the White House',
      GB: 'was in Downing Street',
      IN: 'led India',
      DE: year < 1990 ? 'led West Germany' : 'led Germany',
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
      IT: 'led Italy',
      ES: 'led Spain',
      NL: 'led the Netherlands',
      ID: 'led Indonesia',
      TR: 'led Turkiye',
      NG: 'led Nigeria',
      ZA: 'led South Africa',
      AR: 'led Argentina',
      PH: 'led the Philippines',
      EG: 'led Egypt',
      PK: 'led Pakistan',
      BD: year < 1971 ? 'led East Pakistan' : 'led Bangladesh',
      PL: 'led Poland',
      SE: 'led Sweden',
      TH: 'led Thailand',
      VN: 'led Vietnam',
      CO: 'led Colombia',
      KE: 'led Kenya',
      SA: 'ruled Saudi Arabia',
      IL: 'led Israel',
      PT: 'led Portugal',
      CL: 'led Chile',
      MY: 'led Malaysia',
      UA: 'led Ukraine',
      GH: 'led Ghana',
      PE: 'led Peru',
    };
    const outroLeaderTitle = data.countries?.[countryCode]?.leader_title || leaderInfo.title;
    const position = positionMap[countryCode] || `was ${displayCountryName(country, year)}'s ${outroLeaderTitle}`;
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
// ELEVENLABS CONTEXTUAL CARD
// ---------------------------------------------------------------------------

function renderVoiceCard(year) {
  const decade = Math.floor(year / 10) * 10;
  const then = VOICE_THEN[decade];
  if (!then) return '';

  return `
    <div class="voice-then-now" data-reveal>
      <p class="voice-then">In ${year}, ${then}.</p>
      <p class="voice-now">In 2026, AI turns any text into a human voice in seconds.</p>
      <a href="https://try.elevenlabs.io/pivode" class="voice-cta" target="_blank" rel="noopener">Try ElevenLabs <span class="voice-cta-arrow">\u2192</span></a>
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

function patternE({ eyebrow, headline, prices }) {
  const pillsHtml = prices.map(p => {
    const todayHtml = p.todayValue != null
      ? `<span class="price-pill-today">$${formatPriceValue(p.todayValue)} ${p.todayLabel || 'today'}</span>`
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

  countUpObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      countUpObs.unobserve(el);

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

  document.querySelectorAll('.count-up').forEach(el => countUpObs.observe(el));
}

// ---------------------------------------------------------------------------
// SHARE / NEW YEAR
// ---------------------------------------------------------------------------

$shareBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  $sharePopover.classList.toggle('hidden');
  $shareBtn.setAttribute('aria-expanded', !$sharePopover.classList.contains('hidden'));
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

// ---------------------------------------------------------------------------
// SHARE CARD (Spotify Wrapped-style downloadable image)
// ---------------------------------------------------------------------------

function buildShareCard() {
  if (!_lastRender) return;
  const { year, countryCode, data } = _lastRender;
  const country = COUNTRY_MAP[countryCode] || COUNTRIES[0];
  const name = getUserName();
  const accent = getAccentForYear(year);

  // Gather key facts
  const pop = data.world?.population_billions;
  const leaderInfo = LEADER_KEYS[countryCode] || LEADER_KEYS.US;
  const leader = data.leaders?.[leaderInfo.key] || data.countries?.[countryCode]?.leader || '';
  const song = data.culture?.music?.billboard_no1_song || '';
  const artist = data.culture?.music?.billboard_no1_artist || '';
  const oscar = data.culture?.film?.oscar_best_picture || '';
  const avgGas = data.prices_us?.gallon_gas_usd;
  const lifeExp = data.countries?.[countryCode]?.life_expectancy;
  const worldEvents = (data.world_events || []).slice(0, 2);

  // UK-specific music for GB
  let musicLine = '';
  if (countryCode === 'GB') {
    const ukSong = data.culture?.music?.uk_no1_jan;
    const ukArtist = data.culture?.music?.uk_no1_jan_artist;
    if (ukSong) musicLine = `${ukSong}${ukArtist ? ' - ' + ukArtist : ''}`;
  }
  if (!musicLine && song) musicLine = `${song}${artist ? ' - ' + artist : ''}`;

  const headline = name ? `The World When ${escHtml(name)} Was Born` : `The World in ${year}`;

  // Build stat rows
  const stats = [
    pop && { icon: '\uD83C\uDF0D', label: 'World Population', value: `${pop.toFixed(1)}B` },
    leader && { icon: '\uD83C\uDFDB\uFE0F', label: leaderInfo.title, value: leader },
    musicLine && { icon: '\uD83C\uDFB5', label: '#1 Song', value: musicLine },
    oscar && { icon: '\uD83C\uDFAC', label: 'Best Picture', value: oscar },
    lifeExp && { icon: '\u2764\uFE0F', label: 'Life Expectancy', value: `${lifeExp} years` },
    avgGas && { icon: '\u26FD', label: 'Gas per Gallon', value: `$${avgGas.toFixed(2)}` },
  ].filter(Boolean).slice(0, 5);

  const statsHTML = stats.map(s => `
    <div class="sc-stat">
      <span class="sc-icon">${s.icon}</span>
      <div class="sc-stat-body">
        <span class="sc-stat-label">${escHtml(s.label)}</span>
        <span class="sc-stat-value">${escHtml(s.value)}</span>
      </div>
    </div>
  `).join('');

  const eventsHTML = worldEvents.length ? `
    <div class="sc-events">
      ${worldEvents.map(ev => `<p class="sc-event">${escHtml(ev.event)}</p>`).join('')}
    </div>
  ` : '';

  $shareCard.style.setProperty('--sc-accent', accent);
  $shareCard.innerHTML = `
    <div class="sc-inner">
      <div class="sc-header">
        <p class="sc-flag">${country.flag}</p>
        <p class="sc-year">${year}</p>
        <p class="sc-headline">${headline}</p>
      </div>
      <div class="sc-stats">${statsHTML}</div>
      ${eventsHTML}
      <div class="sc-footer">
        <span class="sc-brand">pivode.github.io/born-in</span>
      </div>
    </div>
  `;
}

async function downloadShareCard() {
  if (typeof html2canvas === 'undefined') {
    showToast('Image library still loading. Try again.');
    return;
  }

  buildShareCard();

  // Temporarily show the card so html2canvas can capture it
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

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) { showToast('Could not generate image.'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const params = getURLParams();
      a.download = `born-in-${params?.year || 'card'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Card saved!');
    }, 'image/png');
  } catch (err) {
    $shareCard.style.display = '';
    showToast('Could not generate image.');
  }
}

$saveCardBtn.addEventListener('click', () => {
  $sharePopover.classList.add('hidden');
  downloadShareCard();
});

$newYearBtn.addEventListener('click', () => resetToLanding());

$errorBackBtn.addEventListener('click', () => resetToLanding());

function resetToLanding() {
  // Disconnect any active observer
  if (observer) { observer.disconnect(); observer = null; }
  if (countUpObs) { countUpObs.disconnect(); countUpObs = null; }

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

  // Reset form (keep selectedCountry - user chose it intentionally)
  $yearInput.value = '';
  $yearError.textContent = '';
  updateCountryDisplay();

  // Reset scroll
  window.scrollTo(0, 0);

  // Restart typewriter
  stopTypewriter();
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
  const rawCountry = params.get('country') || 'US';
  const country = COUNTRY_MAP[rawCountry] ? rawCountry : 'US';
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
  $infoContent.innerHTML = `<div class="loading-state" role="status" aria-label="Loading"><div class="loading-spinner" aria-hidden="true"></div></div>`;
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
