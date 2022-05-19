import { satisfies } from 'shared/code'
import { tableToRecord } from 'table-to-record'

type BaseHealth = number | `${number}-${number}` | `>${number}`
const header =
    ['Enemy',        'Level',             'id', 'baseHealth', 'baseAttack', 'baseBlock', 'move1',   'move2',         'move3',                      'move4',          'move5'] as const // prettier-ignore
type Rows =    ReadonlyArray<readonly
    [string,      number | string | null,  string,      BaseHealth,  number,number,Attack|null,    Attack|null,            Attack|null,            Attack|null,      Attack|null ]> // prettier-ignore
const rows = [
    ['Skeleton',              1,         'skeleton1',       18,         4,   7,   'swordWack',        null,                   null,                  'block',          null                      ],
    ['Skeleton',              2,         'skeleton2',       27,         6,   9,   'swordWack',        'rustyPokeLow',         null,                  'block',          null                      ],
    ['Skeleton',              3,         'skeleton3',       36,         8,   12,  'swordWack',        'rustyPokeLow',         'slash',               'block',          null                      ],
    ['Skeleton',              4,         'skeleton4',       50,         11,  16,  'swordWack',        'rustyPokeLow',         'slash',               'block',          null                      ],
    ['Skeleton',              5,         'skeleton5',       65,         14,  19,  'swordWack',        'rustyPokeLow',         'slash',               'block',          null                      ],

    ['Skeleton',              6,         'skeleton6',       87,         17,  22,  'swordWack',        'rustyPokeHigh',        'slash',               'block',          'startlingSpook(1,1)'     ],
    ['Skeleton',              7,         'skeleton7',       101,        20,  25,  'swordWack',        'rustyPokeHigh',        'slash',               'block',          'startlingSpook(2,2)'     ],
    ['Skeleton',              8,         'skeleton8',       121,        23,  28,  'swordWack',        'rustyPokeHigh',        'slash',               'block',          'startlingSpook(2,2)'     ],
    ['Skeleton',              9,         'skeleton9',       135,        26,  31,  'swordWack',        'rustyPokeHigh',        'slash',               'block',          'startlingSpook(3,3)'     ],
    ['Skeleton',              10,        'skeleton10',      150,        29,  34,  'swordWack',        'rustyPokeHigh',        'slash',               'block',          'startlingSpook(3,3)'     ],

    ['Matcha',                1,         'matcha1',         24,         3,   10,  'basicAttack',      null,                   null,                  'block',          null                      ],
    ['Matcha',                2,         'matcha2',         36,         4,   14,  'basicAttack',      'supriseAllergy(1,1)',  null,                  'block',          null                      ],
    ['Matcha',                3,         'matcha3',         55,         6,   17,  'basicAttack',      'supriseAllergy(1,1)',  'itchyOoze(1)',        'block',          null                      ],
    ['Matcha',                4,         'matcha4',         72,         8,   22,  'basicAttack',      'supriseAllergy(2,1)',  'itchyOoze(2)',        'block',          null                      ],
    ['Matcha',                5,         'matcha5',         80,         11,  26,  'basicAttack',      'supriseAllergy(2,1)',  'itchyOozeSpecial',    'block',          null                      ],

    ['Matcha',                6,         'matcha6',         105,        14,  31,  'basicAttack',      'supriseAllergy(3,2)',  'itchyOoze(2)',        'block',          'engulf(50)'              ],
    ['Matcha',                7,         'matcha7',         130,        15,  36,  'basicAttack',      'supriseAllergy(3,2)',  'itchyOoze(2)',        'block',          'engulf(50)'              ],
    ['Matcha',                8,         'matcha8',         160,        19,  41,  'basicAttack',      'supriseAllergy(4,2)',  'itchyOoze(2)',        'block',          'engulf(75)'              ],
    ['Matcha',                9,         'matcha9',         175,        22,  48,  'basicAttack',      'supriseAllergy(4,2)',  'itchyOoze(2)',        'block',          'engulf(75)'              ],
    ['Matcha',                10,        'matcha10',        200,        25,  56,  'basicAttack',      'supriseAllergy(5,2)',  'itchyOoze(2)',        'block',          'engulf(75)'              ],

    ['Orc Warrior',           1,         'orcWarrior1',     15,         3,   6,   'meatyChargy(1)',   null,                   null,                  'block',          null                      ],
    ['Orc Warrior',           2,         'orcWarrior2',     33,         4,   8,   'meatyChargy(1)',   null,                   null,                  'block',          null                      ],
    ['Orc Warrior',           3,         'orcWarrior3',     50,         6,   10,  'meatyChargy(1)',   'slash',                null,                  'block',          null                      ],
    ['Orc Warrior',           4,         'orcWarrior4',     75,         9,   12,  'meatyChargy(1)',   'slash',                'bellowAndSing(1,1)',  'block',          null                      ],
    ['Orc Warrior',           5,         'orcWarrior5',     88,         12,  14,  'meatyChargy(1)',   'slash',                'bellowAndSing(2,2)',  'block',          'screamAndCharge(100,1)'  ],
    ['Orc Warrior',           6,         'orcWarrior6',     103,        14,  16,  'meatyChargy(2)',   'slash',                'bellowAndSing(2,2)',  'block',          'screamAndCharge(100,1)'  ],
    ['Orc Warrior',           7,         'orcWarrior7',     118,        16,  19,  'meatyChargy(2)',   'slash',                'bellowAndSing(2,2)',  'block',          'screamAndCharge(100,2)'  ],
    ['Orc Warrior',           8,         'orcWarrior8',     133,        18,  22,  'meatyChargy(2)',   'slash',                'bellowAndSing(2,2)',  'block',          'screamAndCharge(125,2)'  ],
    ['Orc Warrior',           9,         'orcWarrior9',     148,        20,  25,  'meatyChargy(2)',   'slash',                'bellowAndSing(2,1)',  'block',          'screamAndCharge(125,2)'  ],
    ['Orc Warrior',           10,        'orcWarrior10',    163,        23,  28,  'meatyChargy(2)',   'slash',                'bellowAndSing(2,2)',  'block',          'screamAndCharge(125,2)'  ],

    ['Bosshog Jürgen',       null,       'bosshogJurgen',   190,        30,  30,  'jurgenBellyFlop',  'jurgenRollAround',     'jurgenStampSnort',    'block',          'jurgenSitUpon'           ],

    ['Mimic',                 1,         'mimic1',          39,         3,   8,   'mimicAttack',      'chomp',                'infectiousBite(2)',   'block',          null                      ],
    ['Mimic',                 2,         'mimic2',          66,         4,   12,  'mimicAttack',      'chomp',                'infectiousBite(2)',   'block',          null                      ],
    ['Mimic',                 3,         'mimic3',          103,        6,   16,  'mimicAttack',      'chomp',                'infectiousBite(2)',   'block',          null                      ],
    ['Mimic',                 4,         'mimic4',          129,        8,   20,  'mimicAttack',      'chomp',                'infectiousBite(3)',   'block',          null                      ],
    ['Mimic',                 5,         'mimic5',          155,        12,  24,  'mimicAttack',      'chomp',                'infectiousBite(3)',   'block',          null                      ],
    ['Mimic',                 6,         'mimic6',          172,        14,  28,  'mimicAttack',      'chomp',                'infectiousBite(3)',   'block',          null                      ],
    ['Mimic',                 7,         'mimic7',          205,        16,  32,  'mimicAttack',      'chomp',                'infectiousBite(3)',   'block',          null                      ],
    ['Mimic',                 8,         'mimic8',          222,        18,  35,  'mimicAttack',      'chomp',                'infectiousBite(4)',   'block',          null                      ],
    ['Mimic',                 9,         'mimic9',          245,        20,  38,  'mimicAttack',      'chomp',                'infectiousBite(4)',   'block',          null                      ],
    ['Mimic',                 10,        'mimic10',         264,        22,  42,  'mimicAttack',      'chomp',                'infectiousBite(5)',   'block',          null                      ],

    ['Hans Toadmaw',         null,       'toadmaw',         132,        25,  9,   "hansBuffBlock",    "hansMagicMissile",     "hansGuards",          "hansCurse",      null                      ],
    ['Cultist Guard',        null,       'cultist',         18,         4,   0,   'attack4',          null,                   null,                  null,             null                      ],

    ['Halfdan The Ancient',  null,       'halfdan',         250,        25,  20,  'rest',             'evisceratingSweep',    'passiveBlock',        'ancientStrike', null                       ],

    ['Mega Matcha',          'large',    'matchaLarge',    '200-100',   15,  20,  'matchaMash',       'matchaMadness',        'matchaMeld',          null,             null                      ],
    ['Matcha',               'medium',   'matchaMedium',   '99-30',     10,  10,  null,               null,                   null,                  null,             null                      ],
    ['Matcha',               'small',    'matchaLarge',    '>29',       10,  5,   null,               null,                   null,                  null,             null                      ],
] as const // prettier-ignore
satisfies<Rows>(rows)

// align by regex: ('.*?'|".*?"| \d+|null),

const attacks = {
    swordWack: 'Sword Whack (BA)',
    mimicAttack:
        'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).',
    rustyPokeHigh: 'Rusty Poke (DOT 2, also applies Fatigue 1)',
    rustyPokeLow: 'Rusty Poke (DOT 2)',
    slash: 'Slash (SL)',
    block: 'Block',
    basicAttack: 'Basic Attack',
    chomp: 'Chomp (BA)',
    itchyOozeSpecial:
        'Itchy Ooze (DOT 2, applies Poison 1 if any damage goes unblocked.)',
    jurgenBellyFlop:
        'Belly Flop: Bosshog Jürgen will attempt to attack for 30 damage, but will deal 1 point less for every point of damage he takes.',
    jurgenRollAround: 'Roll Around (same as Belly Flop, but with Slash damage)',
    jurgenStampSnort:
        'Stamp and Snort: Jürgen gets very angry and stamps around in place. He does nothing this turn but doubles his attack damage the following turn.',
    jurgenSitUpon:
        'Sit Upon: Jürgen sits on one of your characters. This attack does 50% of his attack damage and gives Stun (1) to the target.',
    attack4: 'Attack (Attacks for 4)',
    rest: 'Rest (does nothing)',
    matchaMash: 'Matcha Mash: Matcha will deal damage equal to ATK.',
    matchaMadness: 'Matcha Madness: Apply poison 3 to ALL characters.',
    matchaMeld:
        'Matcha Meld: Block equal to DEF and Level 1 and 2 matchas, will attempt to rejoin the matcha with the highest HP. If successful, the lesser Matcha will add their HP to the greater matcha and the lesser Matcha will be removed from the field. The targeted matcha will level up if it exceeds the minimum health threshold for the next level of matcha.',
    evisceratingSweep:
        'Eviscerating Sweep (Deals 100%, Splash Damage) applies vulnerable (3)',
    passiveBlock:
        'Passive block (every time Halfdan rests, generate 20 block). If he is ever stunned or skips his turn for any reason, generate 20 block.',
    ancientStrike:
        'Ancient Strike (Deals 200%) if any damage goes unblocked, the targeted Kaiju is stunned for 1 turn.',
    hansBuffBlock:
        "Buff/Block (Gives +3 damage to all of Hans' Guards and Hans himself till the end of the following turn).",
    hansMagicMissile: 'Magic Missile (attacks for 25)',
    hansGuards: 'Guards!!! (summons up to 2 cultist guards)',
    hansCurse:
        'Blood Moon Curse (all player characters receive fatigue (2), unguarded (2))',
} as const

const _parameterizedAttacks = {
    _startlingSpook: 'Startling Spook (Applies Unguarded x, Fatigue x)',
    _supriseAllergy:
        'Surprise Allergy (Deals 50% of attack damage, applies Poison X if unblocked, Fatigue X)',
    _itchyOoze: 'Itchy Ooze (DOT X)',
    _infectiousBite:
        'Infectious Bite (DOT1, applies poison (X) if 5 or more damage goes unblocked)',
    _engulf:
        'Engulf (Deals X% of attack damage, applies Stun if any damage goes unblocked)',
    _meatyCharge:
        'Meaty Charge (BA, applies bleed (X) if any damage goes unblocked)',
    _bellowAndSing:
        'Bellow and Sing, deals 50% of attack damage, applies fatigue (X) (applies debilatated (X) if any damage goes unblocked)',
    _screamAndCharge:
        'Scream and Charge (Deals X% of attack damage, applies Unguarded (X) after)',
}

type Attack =
    | keyof typeof attacks
    | `startlingSpook(${number},${number})`
    | `supriseAllergy(${number},${number})`
    | `itchyOoze(${number})`
    | `infectiousBite(${number})`
    | `engulf(${number})`
    | `meatyChargy(${number})`
    | `bellowAndSing(${number},${number})`
    | `screamAndCharge(${number},${number})`

export const enemyAttacks = tableToRecord(rows, header, '2')
