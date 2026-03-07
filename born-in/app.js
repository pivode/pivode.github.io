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
    1988:'Lockerbie bombing kills 270',
    1990:'Thatcher ousted by own party, Major becomes PM',
    1997:'Tony Blair wins landslide, Diana dies in Paris',
    1998:'Good Friday Agreement signed',
    2003:'Iraq War begins, million march against it in London',
    2005:'7/7 London bombings kill 52',
    2008:'Financial crisis, UK bails out banks',
    2010:'First hung parliament since 1974, coalition formed',
  },
  DE: {
    1954:'West Germany wins World Cup - the Miracle of Bern',
    1955:'West Germany joins NATO',
    1961:'Berlin Wall built overnight on 13 August',
    1963:'Adenauer retires after 14 years as Chancellor',
    1968:'Student protests peak across West Germany',
    1969:'Willy Brandt becomes Chancellor, Ostpolitik begins',
    1970:'Brandt kneels at Warsaw Ghetto memorial',
    1972:'Munich Olympics massacre, 11 Israeli athletes killed',
    1974:'West Germany wins World Cup at home',
    1977:'German Autumn - RAF terror, Schleyer murdered',
    1980:'Green Party founded',
    1982:'Helmut Kohl becomes Chancellor',
    1989:'Berlin Wall falls on 9 November',
    1990:'German reunification on 3 October',
    1998:'Schroeder defeats Kohl after 16 years of CDU',
    2002:'Euro replaces Deutsche Mark',
    2005:'Angela Merkel becomes first female Chancellor',
    2006:'Germany hosts FIFA World Cup',
    2010:'German economy rebounds fastest in Europe',
  },
  FR: {
    1954:'Dien Bien Phu falls, France defeated in Indochina',
    1958:'De Gaulle returns to power, Fifth Republic founded',
    1960:'France tests first atomic bomb in Sahara',
    1962:'Algeria gains independence after eight-year war',
    1968:'May 68 student uprising paralyses the nation',
    1969:'De Gaulle resigns after referendum defeat',
    1981:'Mitterrand elected, Socialists win after 23 years',
    1985:'Rainbow Warrior sunk by French secret service',
    1989:'Bicentennial of the French Revolution',
    1994:'Channel Tunnel opens linking France to Britain',
    1998:'France hosts and wins FIFA World Cup',
    2002:'Le Pen reaches presidential runoff, France shocked',
    2005:'Banlieues riots, three weeks of unrest',
    2007:'Sarkozy elected President',
    2010:'Retirement age protests shut France for weeks',
  },
  JP: {
    1952:'Allied occupation ends, Japan regains sovereignty',
    1955:'Liberal Democratic Party founded, begins 38-year rule',
    1958:'Tokyo Tower completed',
    1964:'Tokyo Olympics, bullet train launched same day',
    1968:'Japan becomes world\'s second largest economy',
    1970:'Osaka World Expo, 64 million visitors',
    1979:'Sony Walkman launched',
    1985:'Plaza Accord causes yen surge, property boom begins',
    1989:'Emperor Hirohito dies, Heisei era begins',
    1990:'Nikkei crashes 39%, bubble economy bursts',
    1995:'Kobe earthquake kills 6,434, Aum sarin attack',
    2002:'Japan co-hosts FIFA World Cup',
    2009:'Democratic Party wins landslide, ends LDP era',
    2010:'Japan loses second-economy rank to China',
  },
  IN: {
    1950:'Constitution comes into force, republic declared',
    1952:'First general election, Nehru wins landslide',
    1961:'India liberates Goa from Portuguese rule',
    1962:'War with China humiliates India',
    1964:'Nehru dies',
    1966:'Indira Gandhi becomes first female PM',
    1971:'India-Pakistan war creates Bangladesh',
    1974:'India tests first nuclear device',
    1975:'Indira Gandhi declares Emergency, democracy suspended',
    1977:'First non-Congress government in 30 years',
    1983:'India wins Cricket World Cup',
    1984:'Golden Temple stormed, Indira Gandhi assassinated',
    1991:'Economic liberalisation opens India\'s economy',
    1992:'Babri Masjid demolished, riots kill thousands',
    1998:'Pokhran nuclear tests, India declared nuclear state',
    2000:'India\'s population crosses one billion',
    2004:'Congress defeats BJP, Manmohan Singh becomes PM',
    2008:'Mumbai 26/11 attacks, 166 killed over three days',
  },
  AU: {
    1956:'Melbourne Olympics, first Games in Australia',
    1966:'Decimal currency launched, dollar replaces pound',
    1967:'Referendum grants citizenship to Aboriginal Australians',
    1972:'Whitlam leads Labor to power after 23 years',
    1973:'Sydney Opera House opens',
    1974:'Cyclone Tracy destroys Darwin on Christmas Day',
    1975:'Whitlam dismissed by Governor-General, constitutional crisis',
    1992:'Mabo decision overturns terra nullius',
    1996:'Port Arthur massacre, gun ban follows',
    2000:'Sydney Olympics, Cathy Freeman lights cauldron',
    2002:'Bali bombings kill 88 Australians',
    2008:'Rudd apology to Aboriginal Australians',
    2009:'Black Saturday bushfires kill 173',
    2010:'Julia Gillard becomes first female PM',
  },
  CA: {
    1967:'Canada\'s centennial, Expo 67 in Montreal',
    1968:'Pierre Trudeau becomes PM, Trudeau-mania',
    1970:'October Crisis, War Measures Act invoked',
    1972:'Canada-Soviet hockey Summit Series',
    1980:'Quebec sovereignty referendum lost',
    1982:'Charter of Rights and Freedoms comes into effect',
    1988:'Calgary Winter Olympics',
    1993:'Chretien leads Liberals to majority',
    1995:'Quebec referendum, YES loses by 1.2%',
    2003:'Canada refuses to join Iraq War',
    2005:'Same-sex marriage legalised nationwide',
    2010:'Vancouver Winter Olympics, 14 gold medals',
  },
  BR: {
    1950:'Brazil hosts World Cup, loses final to Uruguay',
    1958:'Brazil wins first World Cup, Pele scores aged 17',
    1960:'Capital moved to newly built Brasilia',
    1964:'Military coup begins 21-year dictatorship',
    1970:'Brazil wins World Cup, greatest team ever',
    1984:'Diretas Ja, millions demand direct elections',
    1988:'New constitution, redemocratisation complete',
    1992:'Collor impeached for corruption',
    1994:'Real Plan ends hyperinflation',
    2002:'Lula elected, first working-class President',
    2010:'Dilma Rousseff elected, first female President',
  },
  RU: {
    1953:'Stalin dies 5 March',
    1956:'Khrushchev denounces Stalin, shocks world',
    1957:'Sputnik launched',
    1961:'Yuri Gagarin becomes first human in space',
    1962:'Cuban Missile Crisis',
    1968:'Soviet tanks crush Prague Spring',
    1979:'Soviet invasion of Afghanistan begins',
    1985:'Gorbachev becomes leader, glasnost begins',
    1986:'Chernobyl nuclear disaster',
    1991:'Soviet Union dissolves 25 December',
    1993:'Yeltsin dissolves parliament, tanks fire on White House',
    1998:'Russia defaults on debt, rouble crisis',
    1999:'Putin becomes PM, Yeltsin resigns',
    2000:'Putin elected President',
    2008:'Russia invades Georgia',
  },
  MX: {
    1954:'Mexican women vote for first time federally',
    1968:'Tlatelolco massacre days before Olympics',
    1970:'Mexico hosts FIFA World Cup',
    1982:'Mexico defaults on foreign debt',
    1985:'Mexico City earthquake kills 10,000',
    1986:'Mexico hosts World Cup, Maradona\'s Hand of God',
    1993:'NAFTA signed',
    1994:'Zapatista uprising, Colosio assassinated',
    1995:'Peso crisis, Tequila Effect spreads',
    2000:'Fox wins, ends 71 years of PRI rule',
    2007:'Drug war declared, army deployed',
    2009:'Swine flu pandemic begins in Mexico City',
  },
  KR: {
    1950:'Korean War begins June 25',
    1960:'April Revolution overthrows Syngman Rhee',
    1961:'Military coup by Park Chung Hee',
    1979:'Park Chung Hee assassinated',
    1980:'Gwangju Uprising, hundreds killed',
    1987:'June Struggle forces democratic transition',
    1988:'Seoul Olympics',
    1997:'Asian financial crisis, IMF bailout',
    2000:'Inter-Korean summit, Kim Dae-jung wins Nobel',
    2002:'Korea-Japan co-host World Cup, Korea reaches semis',
    2006:'North Korea conducts first nuclear test',
    2010:'ROKS Cheonan sunk, 46 sailors killed',
  },
  IE: {
    1955:'Ireland joins the United Nations',
    1963:'JFK visits Ireland, triumphal homecoming',
    1969:'Troubles begin in earnest',
    1972:'Bloody Sunday',
    1973:'Ireland joins EEC',
    1979:'Pope John Paul II visits, 1.25 million attend',
    1981:'Bobby Sands dies on hunger strike',
    1990:'Mary Robinson elected first female President',
    1994:'IRA ceasefire, peace process accelerates',
    1998:'Good Friday Agreement signed',
    1999:'Ireland adopts the Euro, Celtic Tiger at full roar',
    2005:'IRA formally ends armed campaign',
    2008:'Banking crisis, Ireland\'s banks collapse',
    2010:'Ireland accepts EU-IMF bailout',
  },
  IT: {
    1955:'De Gasperi era ends, Christian Democrats dominate',
    1957:'Treaty of Rome signed, Italy co-founds EEC',
    1960:'Rome Olympics, Cassius Clay wins gold',
    1963:'Economic miracle peaks, Italy booming',
    1966:'Devastating Florence floods damage city',
    1969:'Hot Autumn - mass strikes and factory sit-ins',
    1973:'Historic compromise between DC and Communists',
    1976:'Earthquake kills 1,000 in Friuli',
    1978:'Aldo Moro kidnapped and murdered by Red Brigades',
    1980:'Bologna station bombing kills 85',
    1982:'Italy wins FIFA World Cup in Spain',
    1984:'Craxi becomes Italy\'s longest-serving postwar PM',
    1992:'Mani Pulite - corruption scandal topples parties',
    1994:'Berlusconi wins election, enters politics as PM',
    1999:'Italy joins the Euro',
    2001:'Berlusconi wins again, G8 summit in Genoa',
    2006:'Italy wins fourth World Cup in Germany',
    2009:'L\'Aquila earthquake kills 309',
  },
  ES: {
    1953:'Spain signs pacts with US, ends isolation',
    1959:'Stabilisation plan opens Spain\'s economy',
    1966:'Press Law eases censorship slightly',
    1969:'Franco names Juan Carlos heir to the throne',
    1973:'PM Carrero Blanco assassinated by ETA',
    1975:'Franco dies, Juan Carlos becomes king',
    1977:'First democratic elections in 41 years',
    1978:'New constitution ratified by referendum',
    1981:'Failed military coup, democracy survives',
    1982:'PSOE wins landslide, Gonzalez becomes PM',
    1986:'Spain joins EEC and NATO',
    1992:'Barcelona Olympics and Seville World Expo',
    1996:'Aznar leads PP to victory over Gonzalez',
    2004:'Madrid bombings kill 191, Zapatero wins election',
    2008:'Financial crisis hits Spain, housing bubble bursts',
    2010:'Spain wins World Cup in South Africa',
  },
  NL: {
    1953:'North Sea flood kills 1,836',
    1963:'Natural gas discovered at Groningen',
    1965:'Amsterdam Provo movement shakes the city',
    1966:'Princess Beatrix marries German Claus, riots erupt',
    1973:'Oil crisis - car-free Sundays declared',
    1975:'Suriname gains independence',
    1980:'Queen Beatrix crowned amid Amsterdam riots',
    1992:'Bijlmermeer air disaster kills 43 in Amsterdam',
    1995:'Major flooding, 250,000 evacuated from rivers',
    2002:'Pim Fortuyn assassinated before election',
    2004:'Filmmaker Theo van Gogh murdered',
    2009:'Madurodam attack on Queen Beatrix\'s Day',
    2010:'Netherlands reaches World Cup final',
  },
  ID: {
    1955:'Bandung Conference, Non-Aligned Movement born',
    1958:'Regional rebellions crushed by Jakarta',
    1960:'Sukarno dissolves parliament, guided democracy',
    1963:'West New Guinea transferred from Netherlands',
    1965:'Failed coup, Suharto seizes power',
    1966:'Suharto formally takes presidency',
    1969:'West Papua formally integrated into Indonesia',
    1975:'Indonesia invades East Timor',
    1979:'Transmigration programme moves millions',
    1983:'Petrus killings target criminal gangs',
    1997:'Asian financial crisis devastates economy',
    1998:'Suharto resigns after 32 years in power',
    1999:'East Timor votes for independence',
    2002:'Bali bombings kill 202',
    2004:'Indian Ocean tsunami kills 170,000 in Aceh',
    2005:'Helsinki peace deal ends Aceh conflict',
  },
  TR: {
    1952:'Turkey joins NATO',
    1955:'Istanbul pogrom targets Greek minority',
    1960:'Military coup topples Menderes government',
    1961:'Menderes executed by hanging',
    1963:'Ankara Agreement signed with EEC',
    1971:'Military memorandum forces government to resign',
    1974:'Turkish forces invade Cyprus',
    1980:'Military coup, constitution suspended',
    1983:'Civilian rule restored, Ozal becomes PM',
    1984:'PKK insurgency begins in southeast Turkey',
    1993:'Sivas massacre kills 35 Alevi intellectuals',
    1996:'Susurluk scandal exposes state-mafia links',
    1999:'Ocalan captured, major earthquake kills 17,000',
    2001:'Economic crisis, IMF bailout',
    2002:'AKP wins landslide, Erdogan era begins',
    2004:'EU accession negotiations begin',
    2010:'Constitutional referendum curbs military power',
  },
  NG: {
    1960:'Nigeria gains independence from Britain',
    1963:'Nigeria becomes a republic',
    1966:'Two military coups in one year',
    1967:'Biafra declares independence, civil war begins',
    1970:'Biafran War ends, one million dead from famine',
    1979:'Return to civilian rule under Shagari',
    1983:'Military coup removes elected Shagari government',
    1985:'Babangida seizes power in palace coup',
    1993:'Moshood Abiola wins election, result annulled',
    1995:'Ken Saro-Wiwa executed by Abacha regime',
    1998:'Abacha dies suddenly, transition begins',
    1999:'Obasanjo elected, civilian rule restored',
    2003:'Obasanjo re-elected in disputed vote',
    2007:'Umaru Yar\'Adua wins controversial election',
    2009:'Boko Haram uprising begins in the north',
  },
  ZA: {
    1952:'Defiance Campaign against apartheid laws',
    1955:'Freedom Charter adopted at Kliptown',
    1960:'Sharpeville massacre, 69 protesters killed',
    1961:'South Africa leaves Commonwealth, becomes republic',
    1963:'Rivonia Trial, Mandela sentenced to life',
    1966:'PM Verwoerd assassinated in parliament',
    1976:'Soweto uprising, hundreds killed by police',
    1977:'Steve Biko dies in police custody',
    1984:'New constitution excludes Blacks, unrest erupts',
    1985:'State of emergency declared',
    1988:'Botha suffers stroke, reform stalls',
    1990:'Mandela freed, ANC unbanned',
    1993:'Nobel Peace Prize awarded to Mandela and de Klerk',
    1994:'First free elections, Mandela becomes President',
    1996:'Truth and Reconciliation Commission begins',
    1999:'Mbeki succeeds Mandela as President',
    2008:'Xenophobic violence kills 62',
    2010:'South Africa hosts FIFA World Cup',
  },
  AR: {
    1952:'Evita Peron dies, massive national mourning',
    1955:'Peron overthrown in military coup',
    1958:'Frondizi elected, developmentalism begins',
    1966:'General Ongania leads coup',
    1969:'Cordobazo - workers and students revolt',
    1973:'Peron returns from exile after 18 years',
    1974:'Peron dies, Isabel Peron takes over',
    1976:'Military junta seizes power, Dirty War begins',
    1978:'Argentina hosts and wins World Cup under junta',
    1982:'Falklands War, Argentina defeated by Britain',
    1983:'Return to democracy, Alfonsin elected',
    1985:'Junta leaders convicted for human rights crimes',
    1989:'Menem wins election amid hyperinflation',
    1994:'New constitution allows Menem\'s re-election',
    2001:'Economic collapse, five presidents in two weeks',
    2003:'Kirchner elected, debt default era begins',
    2010:'Argentina celebrates bicentennial of independence',
  },
  PH: {
    1953:'Magsaysay defeats Quirino in landmark election',
    1957:'Garcia elected, Filipino First policy',
    1961:'Macapagal wins presidency',
    1965:'Marcos elected president',
    1969:'Marcos re-elected, First Quarter Storm follows',
    1971:'Plaza Miranda bombing at opposition rally',
    1972:'Marcos declares martial law',
    1973:'New constitution approved, Marcos rules by decree',
    1976:'Mindanao agreement briefly halts Muslim insurgency',
    1981:'Martial law lifted, Marcos keeps emergency powers',
    1983:'Benigno Aquino assassinated at Manila airport',
    1986:'People Power Revolution ousts Marcos',
    1991:'Mt Pinatubo erupts, massive destruction',
    1992:'Ramos elected, US bases closed',
    1998:'Estrada elected in landslide',
    2001:'People Power II ousts Estrada',
    2004:'Arroyo wins disputed election',
    2009:'Typhoon Ondoy floods Metro Manila',
  },
  EG: {
    1952:'Revolution, King Farouk overthrown',
    1954:'Nasser takes power as President',
    1956:'Nasser nationalises Suez Canal, war follows',
    1958:'Egypt and Syria form United Arab Republic',
    1961:'Syria withdraws from UAR, union collapses',
    1967:'Six-Day War, Egypt loses Sinai to Israel',
    1970:'Nasser dies, Sadat takes power',
    1973:'Yom Kippur War, Egypt crosses the Suez Canal',
    1975:'Suez Canal reopens after eight years',
    1978:'Camp David Accords with Israel signed',
    1979:'Peace with Israel, Egypt expelled from Arab League',
    1981:'Sadat assassinated, Mubarak becomes President',
    1990:'Egypt joins Gulf War coalition against Iraq',
    1992:'Cairo earthquake kills 500',
    1997:'Luxor massacre kills 62 tourists',
    2005:'First multi-candidate presidential election held',
  },
};

// ---------------------------------------------------------------------------
// TIER 2: LOCAL MUSIC CHARTS (Germany, France, Australia)
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

const LOCAL_MUSIC = { DE: MUSIC_DE_NO1, FR: MUSIC_FR_NO1, AU: MUSIC_AU_NO1 };
const LOCAL_MUSIC_LABEL = { DE: 'German Chart #1', FR: 'French Chart #1', AU: 'Australian Chart #1' };

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
  { code: 'TR', name: 'Turkey',         flag: '🇹🇷' },
  { code: 'NG', name: 'Nigeria',        flag: '🇳🇬' },
  { code: 'ZA', name: 'South Africa',   flag: '🇿🇦' },
  { code: 'AR', name: 'Argentina',      flag: '🇦🇷' },
  { code: 'PH', name: 'Philippines',    flag: '🇵🇭' },
  { code: 'EG', name: 'Egypt',          flag: '🇪🇬' },
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
        ? `The average American earned roughly ${incomeMultiple}x more. These gaps defined the world you grew up in.`
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
      ? `Just below the global average. Millions of people in ${country.name} never saw their grandchildren grow up.`
      : `Far below the global average. Poverty, conflict, and disease cut lives tragically short.`;
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

  // Tier 2: Local music chart (DE, FR, AU)
  const localMusic = LOCAL_MUSIC[countryCode]?.[year];
  const localMusicLabel = LOCAL_MUSIC_LABEL[countryCode] || null;

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

function renderActV(year, countryCode, data) {
  const countryData = data.countries?.[countryCode] || data.countries?.US || {};
  const country     = COUNTRY_MAP[countryCode] || COUNTRIES[0];
  const name        = getUserName();
  const lifeExpThen = countryData.life_expectancy || data.world?.life_expectancy_global;
  const lifeExpTodayLocal = TODAY.life_expectancy[countryCode] || TODAY.global_life_expectancy;
  const lifeLabel   = country.name;

  const popMillions = countryData.population_millions;
  const gdpPerCap   = countryData.gdp_per_capita_usd;
  const worldBirths = data.world?.births_millions;

  const births   = (data.notable_births || []).slice(0, 5);
  const doublings  = Math.round((CURRENT_YEAR - year) / 2);
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
          commentary: lifeExpThen && lifeExpTodayLocal
            ? (lifeExpTodayLocal - lifeExpThen) > 10
              ? `That's ${(lifeExpTodayLocal - lifeExpThen).toFixed(0)} more years of life gained in a single generation. Vaccines, antibiotics, and cleaner water changed everything.`
              : (lifeExpTodayLocal - lifeExpThen) > 3
              ? `${(lifeExpTodayLocal - lifeExpThen).toFixed(0)} years of progress. Steady gains from better medicine, nutrition, and public health.`
              : 'Progress has slowed in recent decades. The easy wins are behind us.'
            : null,
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
  const leader  = data.leaders?.[leaderInfo.key] || data.countries?.[countryCode]?.leader;
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
      IT: 'led Italy',
      ES: 'led Spain',
      NL: 'led the Netherlands',
      ID: 'led Indonesia',
      TR: 'led Turkey',
      NG: 'led Nigeria',
      ZA: 'led South Africa',
      AR: 'led Argentina',
      PH: 'led the Philippines',
      EG: 'led Egypt',
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
  const leader = data.leaders?.[leaderInfo.key] || '';
  const song = data.culture?.music?.billboard_no1_song || '';
  const artist = data.culture?.music?.billboard_no1_artist || '';
  const oscar = data.culture?.movies?.best_picture || '';
  const avgGas = data.economy?.us_prices?.gas_gallon;
  const lifeExp = data.country_stats?.life_expectancy;
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
      ${worldEvents.map(ev => `<p class="sc-event">${escHtml(ev)}</p>`).join('')}
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

  // Reset form
  $yearInput.value = '';
  $yearError.textContent = '';
  selectedCountry = COUNTRIES[0];
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
