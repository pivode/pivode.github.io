#!/usr/bin/env python3
"""Fix confirmed data errors in born-in JSON files."""

import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

# ---------------------------------------------------------------------------
# South Korea GDP per capita corrections (World Bank current USD)
# Previous values were ~2-8x inflated - likely PPP or constant dollars
# ---------------------------------------------------------------------------
KR_GDP_CORRECT = {
    1950: 80,
    1952: 90,
    1954: 120,
    1955: 130,
    1956: 140,
    1957: 145,
    1958: 150,
    1959: 153,
    1960: 158,
    1961: 171,
    1962: 110,
    1963: 130,
    1964: 147,
    1965: 200,
    1966: 205,
    1967: 230,
    1968: 255,
    1969: 270,
    1970: 279,
    1971: 325,
    1972: 360,
    1973: 430,
    1974: 560,
    1975: 621,
    1976: 820,
    1977: 1050,
    1978: 1400,
    1979: 1680,
    1980: 1715,
    1981: 1800,
    1982: 1870,
    1983: 2015,
    1984: 2360,
    1985: 2513,
    1986: 2803,
    1987: 3421,
    1988: 4570,
    1989: 5418,
    1990: 6147,
    1991: 7523,
    1992: 8263,
    1993: 8874,
    1994: 10074,
    1995: 12565,
    1996: 13372,
    1997: 12267,
    1998: 8193,
    1999: 10507,
    2000: 11948,
    2001: 11253,
    2002: 12937,
    2003: 14038,
    2004: 15900,
    2005: 18641,
    2006: 20459,
    2007: 23074,
    2008: 20474,
    2009: 18339,
    2010: 22151,
}

# ---------------------------------------------------------------------------
# Per-year targeted fixes
# Each entry: {year: {path.to.field: new_value}}
# ---------------------------------------------------------------------------
FIXES = {
    # Brazil 2010: Dilma not inaugurated until Jan 1 2011
    2010: {
        'leaders.brazil_president': 'Luiz Inácio Lula da Silva',
        'countries.BR.leader': 'Luiz Inácio Lula da Silva',
    },

    # Germany 2005: Merkel only from Nov 22 - Schröder for most of the year
    2005: {
        'leaders.germany_chancellor': 'Gerhard Schröder',
        'countries.DE.leader': 'Gerhard Schröder',
    },

    # Mexico 2000: Vicente Fox only from Dec 1 - Zedillo for 11 months
    2000: {
        'leaders.mexico_president': 'Ernesto Zedillo',
        'countries.MX.leader': 'Ernesto Zedillo',
    },

    # Mexico 1994: Zedillo only from Dec 1 - Salinas for most of year
    1994: {
        'leaders.mexico_president': 'Carlos Salinas de Gortari',
        'countries.MX.leader': 'Carlos Salinas de Gortari',
    },

    # Ireland 1994: Bruton only from Dec 15 - Reynolds for most of year
    # (Fixes only the Ireland-specific fields; ireland_taoiseach key was set by add_countries.py)
    # Note: leaders.ireland_taoiseach was set to "John Bruton" - should be Albert Reynolds
    # countries.IE.leader likewise

    # Music 1980: uk_no1_jan was Christmas 1980 #1, not January 1980
    1980: {
        'culture.music.uk_no1_jan': 'Brass in Pocket',
        'culture.music.uk_no1_artist': 'The Pretenders',
        'leaders.ireland_taoiseach': 'Charles Haughey',   # already correct, no-op
        'economy.oil_barrel_usd': 35.69,  # 1980 annual average WTI (correct)
    },

    # Music 1990: uk_no1_jan wrong
    1990: {
        'culture.music.uk_no1_jan': 'Do They Know It\'s Christmas?',
        'culture.music.uk_no1_artist': 'Band Aid II',
    },

    # Music 1995: uk_no1_jan wrong
    1995: {
        'culture.music.uk_no1_jan': 'Stay Another Day',
        'culture.music.uk_no1_artist': 'East 17',
    },

    # Billboard 2000: Breathe (Faith Hill) had 4 weeks; Maria Maria had 10
    # (mexico fix also applies to 2000 - handled above)

    # Music 2010: uk_no1_jan wrong - Rage vs Machine won the internet campaign
    2010: {
        'culture.music.uk_no1_jan': 'Killing in the Name',
        'culture.music.uk_no1_artist': 'Rage Against the Machine',
    },

    # Oil 2008: $61.95 is wrong - annual avg was ~$99.67
    2008: {
        'economy.oil_barrel_usd': 99.67,
    },
}

# Billboard 2000 fix (separate because music block structure varies)
BILLBOARD_2000 = {
    'song': 'Maria Maria',
    'artist': 'Santana',
}

# Ireland 1994 fix
IRELAND_1994_LEADER = 'Albert Reynolds'

# Mexico 2000 fix for countries.MX - handled in FIXES above


def set_nested(d, path, value):
    """Set a nested dict value given a dot-separated path."""
    keys = path.split('.')
    for k in keys[:-1]:
        d = d[k]
    d[keys[-1]] = value


def get_nested(d, path, default=None):
    """Get a nested dict value given a dot-separated path."""
    keys = path.split('.')
    try:
        for k in keys:
            d = d[k]
        return d
    except (KeyError, TypeError):
        return default


years = [
    1950, 1952, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963,
    1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975,
    1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987,
    1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
    2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010
]

total_changes = 0

for year in years:
    path = os.path.join(DATA_DIR, f'{year}.json')
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    changes = []

    # --- South Korea GDP fix (all years) ---
    if year in KR_GDP_CORRECT and 'countries' in data and 'KR' in data['countries']:
        old = data['countries']['KR']['gdp_per_capita_usd']
        new = KR_GDP_CORRECT[year]
        if old != new:
            data['countries']['KR']['gdp_per_capita_usd'] = new
            changes.append(f'KR.gdp_per_capita_usd: {old} -> {new}')

    # --- Ireland 1994 leader fix ---
    if year == 1994:
        if data.get('leaders', {}).get('ireland_taoiseach') == 'John Bruton':
            data['leaders']['ireland_taoiseach'] = IRELAND_1994_LEADER
            changes.append(f'leaders.ireland_taoiseach: John Bruton -> {IRELAND_1994_LEADER}')
        if data.get('countries', {}).get('IE', {}).get('leader') == 'John Bruton':
            data['countries']['IE']['leader'] = IRELAND_1994_LEADER
            changes.append(f'countries.IE.leader: John Bruton -> {IRELAND_1994_LEADER}')

    # --- Billboard 2000 ---
    if year == 2000:
        music = data.get('culture', {}).get('music', {})
        if music.get('billboard_no1_song') == 'Breathe' or music.get('billboard_no1_artist') == 'Faith Hill':
            old_song = music.get('billboard_no1_song')
            old_artist = music.get('billboard_no1_artist')
            data['culture']['music']['billboard_no1_song'] = 'Maria Maria'
            data['culture']['music']['billboard_no1_artist'] = 'Santana'
            changes.append(f'billboard: {old_song}/{old_artist} -> Maria Maria/Santana')

    # --- Per-year targeted fixes ---
    if year in FIXES:
        for field_path, new_value in FIXES[year].items():
            try:
                old_value = get_nested(data, field_path)
                if old_value != new_value:
                    set_nested(data, field_path, new_value)
                    changes.append(f'{field_path}: {old_value!r} -> {new_value!r}')
            except (KeyError, TypeError):
                pass  # field doesn't exist in this file

    if changes:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write('\n')
        total_changes += len(changes)
        print(f'\n{year}.json:')
        for c in changes:
            print(f'  {c}')
    else:
        print(f'{year}.json: OK')

print(f'\nTotal changes: {total_changes}')
