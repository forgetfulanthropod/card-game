import { satisfies } from 'shared/code'

// align by regex: (, )|:|\[
export const enemyAttacks = {
    skeleton1    : {displayName: 'Skeleton'           , level : 1       ,  id : 'skeleton1'    ,  baseHealth : 18       ,  baseAttack : 4  , baseBlock : 7  , moves: ['swordWack'       ,  null                 ,  null                ,  'block'         ,  null                      ]},
    skeleton2    : {displayName: 'Skeleton'           , level : 2       ,  id : 'skeleton2'    ,  baseHealth : 27       ,  baseAttack : 6  , baseBlock : 9  , moves: ['swordWack'       ,  'rustyPokeLow'       ,  null                ,  'block'         ,  null                      ]},
    skeleton3    : {displayName: 'Skeleton'           , level : 3       ,  id : 'skeleton3'    ,  baseHealth : 36       ,  baseAttack : 8  , baseBlock : 12 , moves: ['swordWack'       ,  'rustyPokeLow'       ,  'slash'             ,  'block'         ,  null                      ]},
    skeleton4    : {displayName: 'Skeleton'           , level : 4       ,  id : 'skeleton4'    ,  baseHealth : 50       ,  baseAttack : 11 , baseBlock : 16 , moves: ['swordWack'       ,  'rustyPokeLow'       ,  'slash'             ,  'block'         ,  null                      ]},
    skeleton5    : {displayName: 'Skeleton'           , level : 5       ,  id : 'skeleton5'    ,  baseHealth : 65       ,  baseAttack : 14 , baseBlock : 19 , moves: ['swordWack'       ,  'rustyPokeLow'       ,  'slash'             ,  'block'         ,  null                      ]},
    skeleton6    : {displayName: 'Skeleton'           , level : 6       ,  id : 'skeleton6'    ,  baseHealth : 87       ,  baseAttack : 17 , baseBlock : 22 , moves: ['swordWack'       ,  'rustyPokeHigh'      ,  'slash'             ,  'block'         ,  'startlingSpook(1,1)'     ]},
    skeleton7    : {displayName: 'Skeleton'           , level : 7       ,  id : 'skeleton7'    ,  baseHealth : 101      ,  baseAttack : 20 , baseBlock : 25 , moves: ['swordWack'       ,  'rustyPokeHigh'      ,  'slash'             ,  'block'         ,  'startlingSpook(2,2)'     ]},
    skeleton8    : {displayName: 'Skeleton'           , level : 8       ,  id : 'skeleton8'    ,  baseHealth : 121      ,  baseAttack : 23 , baseBlock : 28 , moves: ['swordWack'       ,  'rustyPokeHigh'      ,  'slash'             ,  'block'         ,  'startlingSpook(2,2)'     ]},
    skeleton9    : {displayName: 'Skeleton'           , level : 9       ,  id : 'skeleton9'    ,  baseHealth : 135      ,  baseAttack : 26 , baseBlock : 31 , moves: ['swordWack'       ,  'rustyPokeHigh'      ,  'slash'             ,  'block'         ,  'startlingSpook(3,3)'     ]},
    skeleton10   : {displayName: 'Skeleton'           , level : 10      ,  id : 'skeleton10'   ,  baseHealth : 150      ,  baseAttack : 29 , baseBlock : 34 , moves: ['swordWack'       ,  'rustyPokeHigh'      ,  'slash'             ,  'block'         ,  'startlingSpook(3,3)'     ]},
    matcha1      : {displayName: 'Matcha'             , level : 1       ,  id : 'matcha1'      ,  baseHealth : 24       ,  baseAttack : 3  , baseBlock : 10 , moves: ['basicAttack'     ,  null                 ,  null                ,  'block'         ,  null                      ]},
    matcha2      : {displayName: 'Matcha'             , level : 2       ,  id : 'matcha2'      ,  baseHealth : 36       ,  baseAttack : 4  , baseBlock : 14 , moves: ['basicAttack'     ,  'supriseAllergy(1,1)',  null                ,  'block'         ,  null                      ]},
    matcha3      : {displayName: 'Matcha'             , level : 3       ,  id : 'matcha3'      ,  baseHealth : 55       ,  baseAttack : 6  , baseBlock : 17 , moves: ['basicAttack'     ,  'supriseAllergy(1,1)',  'itchyOoze(1)'      ,  'block'         ,  null                      ]},
    matcha4      : {displayName: 'Matcha'             , level : 4       ,  id : 'matcha4'      ,  baseHealth : 72       ,  baseAttack : 8  , baseBlock : 22 , moves: ['basicAttack'     ,  'supriseAllergy(2,1)',  'itchyOoze(2)'      ,  'block'         ,  null                      ]},
    matcha5      : {displayName: 'Matcha'             , level : 5       ,  id : 'matcha5'      ,  baseHealth : 80       ,  baseAttack : 11 , baseBlock : 26 , moves: ['basicAttack'     ,  'supriseAllergy(2,1)',  'itchyOozeSpecial'  ,  'block'         ,  null                      ]},
    matcha6      : {displayName: 'Matcha'             , level : 6       ,  id : 'matcha6'      ,  baseHealth : 105      ,  baseAttack : 14 , baseBlock : 31 , moves: ['basicAttack'     ,  'supriseAllergy(3,2)',  'itchyOoze(2)'      ,  'block'         ,  'engulf(50)'              ]},
    matcha7      : {displayName: 'Matcha'             , level : 7       ,  id : 'matcha7'      ,  baseHealth : 130      ,  baseAttack : 15 , baseBlock : 36 , moves: ['basicAttack'     ,  'supriseAllergy(3,2)',  'itchyOoze(2)'      ,  'block'         ,  'engulf(50)'              ]},
    matcha8      : {displayName: 'Matcha'             , level : 8       ,  id : 'matcha8'      ,  baseHealth : 160      ,  baseAttack : 19 , baseBlock : 41 , moves: ['basicAttack'     ,  'supriseAllergy(4,2)',  'itchyOoze(2)'      ,  'block'         ,  'engulf(75)'              ]},
    matcha9      : {displayName: 'Matcha'             , level : 9       ,  id : 'matcha9'      ,  baseHealth : 175      ,  baseAttack : 22 , baseBlock : 48 , moves: ['basicAttack'     ,  'supriseAllergy(4,2)',  'itchyOoze(2)'      ,  'block'         ,  'engulf(75)'              ]},
    matcha10     : {displayName: 'Matcha'             , level : 10      ,  id : 'matcha10'     ,  baseHealth : 200      ,  baseAttack : 25 , baseBlock : 56 , moves: ['basicAttack'     ,  'supriseAllergy(5,2)',  'itchyOoze(2)'      ,  'block'         ,  'engulf(75)'              ]},
    orcWarrior1  : {displayName: 'Orc Warrior'        , level : 1       ,  id : 'orcWarrior1'  ,  baseHealth : 15       ,  baseAttack : 3  , baseBlock : 6  , moves: ['meatyCharge(1)'  ,  null                 ,  null                ,  'block'         ,  null                      ]},
    orcWarrior2  : {displayName: 'Orc Warrior'        , level : 2       ,  id : 'orcWarrior2'  ,  baseHealth : 33       ,  baseAttack : 4  , baseBlock : 8  , moves: ['meatyCharge(1)'  ,  null                 ,  null                ,  'block'         ,  null                      ]},
    orcWarrior3  : {displayName: 'Orc Warrior'        , level : 3       ,  id : 'orcWarrior3'  ,  baseHealth : 50       ,  baseAttack : 6  , baseBlock : 10 , moves: ['meatyCharge(1)'  ,  'slash'              ,  null                ,  'block'         ,  null                      ]},
    orcWarrior4  : {displayName: 'Orc Warrior'        , level : 4       ,  id : 'orcWarrior4'  ,  baseHealth : 75       ,  baseAttack : 9  , baseBlock : 12 , moves: ['meatyCharge(1)'  ,  'slash'              ,  'bellowAndSing(1,1)',  'block'         ,  null                      ]},
    orcWarrior5  : {displayName: 'Orc Warrior'        , level : 5       ,  id : 'orcWarrior5'  ,  baseHealth : 88       ,  baseAttack : 12 , baseBlock : 14 , moves: ['meatyCharge(1)'  ,  'slash'              ,  'bellowAndSing(2,2)',  'block'         ,  'screamAndCharge(100,1)'  ]},
    orcWarrior6  : {displayName: 'Orc Warrior'        , level : 6       ,  id : 'orcWarrior6'  ,  baseHealth : 103      ,  baseAttack : 14 , baseBlock : 16 , moves: ['meatyCharge(2)'  ,  'slash'              ,  'bellowAndSing(2,2)',  'block'         ,  'screamAndCharge(100,1)'  ]},
    orcWarrior7  : {displayName: 'Orc Warrior'        , level : 7       ,  id : 'orcWarrior7'  ,  baseHealth : 118      ,  baseAttack : 16 , baseBlock : 19 , moves: ['meatyCharge(2)'  ,  'slash'              ,  'bellowAndSing(2,2)',  'block'         ,  'screamAndCharge(100,2)'  ]},
    orcWarrior8  : {displayName: 'Orc Warrior'        , level : 8       ,  id : 'orcWarrior8'  ,  baseHealth : 133      ,  baseAttack : 18 , baseBlock : 22 , moves: ['meatyCharge(2)'  ,  'slash'              ,  'bellowAndSing(2,2)',  'block'         ,  'screamAndCharge(125,2)'  ]},
    orcWarrior9  : {displayName: 'Orc Warrior'        , level : 9       ,  id : 'orcWarrior9'  ,  baseHealth : 148      ,  baseAttack : 20 , baseBlock : 25 , moves: ['meatyCharge(2)'  ,  'slash'              ,  'bellowAndSing(2,1)',  'block'         ,  'screamAndCharge(125,2)'  ]},
    orcWarrior10 : {displayName: 'Orc Warrior'        , level : 10      ,  id : 'orcWarrior10' ,  baseHealth : 163      ,  baseAttack : 23 , baseBlock : 28 , moves: ['meatyCharge(2)'  ,  'slash'              ,  'bellowAndSing(2,2)',  'block'         ,  'screamAndCharge(125,2)'  ]},
    bosshogJurgen: {displayName: 'Bosshog Jürgen'     , level : null    ,  id : 'bosshogJurgen',  baseHealth : 190      ,  baseAttack : 30 , baseBlock : 30 , moves: ['jurgenBellyFlop' ,  'jurgenRollAround'   ,  'jurgenStampSnort'  ,  'block'         ,  'jurgenSitUpon'           ]},
    mimic1       : {displayName: 'Mimic'              , level : 1       ,  id : 'mimic1'       ,  baseHealth : 39       ,  baseAttack : 3  , baseBlock : 8  , moves: ['mimicAttack'     ,  'chomp'              ,  'infectiousBite(2)' ,  'block'         ,  null                      ]},
    mimic2       : {displayName: 'Mimic'              , level : 2       ,  id : 'mimic2'       ,  baseHealth : 66       ,  baseAttack : 4  , baseBlock : 12 , moves: ['mimicAttack'     ,  'chomp'              ,  'infectiousBite(2)' ,  'block'         ,  null                      ]},
    mimic3       : {displayName: 'Mimic'              , level : 3       ,  id : 'mimic3'       ,  baseHealth : 103      ,  baseAttack : 6  , baseBlock : 16 , moves: ['mimicAttack'     ,  'chomp'              ,  'infectiousBite(2)' ,  'block'         ,  null                      ]},
    mimic4       : {displayName: 'Mimic'              , level : 4       ,  id : 'mimic4'       ,  baseHealth : 129      ,  baseAttack : 8  , baseBlock : 20 , moves: ['mimicAttack'     ,  'chomp'              ,  'infectiousBite(3)' ,  'block'         ,  null                      ]},
    mimic5       : {displayName: 'Mimic'              , level : 5       ,  id : 'mimic5'       ,  baseHealth : 155      ,  baseAttack : 12 , baseBlock : 24 , moves: ['mimicAttack'     ,  'chomp'              ,  'infectiousBite(3)' ,  'block'         ,  null                      ]},
    mimic6       : {displayName: 'Mimic'              , level : 6       ,  id : 'mimic6'       ,  baseHealth : 172      ,  baseAttack : 14 , baseBlock : 28 , moves: ['mimicAttack'     ,  'chomp'              ,  'infectiousBite(3)' ,  'block'         ,  null                      ]},
    mimic7       : {displayName: 'Mimic'              , level : 7       ,  id : 'mimic7'       ,  baseHealth : 205      ,  baseAttack : 16 , baseBlock : 32 , moves: ['mimicAttack'     ,  'chomp'              ,  'infectiousBite(3)' ,  'block'         ,  null                      ]},
    mimic8       : {displayName: 'Mimic'              , level : 8       ,  id : 'mimic8'       ,  baseHealth : 222      ,  baseAttack : 18 , baseBlock : 35 , moves: ['mimicAttack'     ,  'chomp'              ,  'infectiousBite(4)' ,  'block'         ,  null                      ]},
    mimic9       : {displayName: 'Mimic'              , level : 9       ,  id : 'mimic9'       ,  baseHealth : 245      ,  baseAttack : 20 , baseBlock : 38 , moves: ['mimicAttack'     ,  'chomp'              ,  'infectiousBite(4)' ,  'block'         ,  null                      ]},
    mimic10      : {displayName: 'Mimic'              , level : 10      ,  id : 'mimic10'      ,  baseHealth : 264      ,  baseAttack : 22 , baseBlock : 42 , moves: ['mimicAttack'     ,  'chomp'              ,  'infectiousBite(5)' ,  'block'         ,  null                      ]},
    toadmaw      : {displayName: 'Hans Toadmaw'       , level : null    ,  id : 'toadmaw'      ,  baseHealth : 132      ,  baseAttack : 25 , baseBlock : 9  , moves: ["hansBuffBlock"   ,  "hansMagicMissile"   ,  "hansGuards"        ,  "hansCurse"     ,  null                      ]},
    cultist      : {displayName: 'Cultist Guard'      , level : null    ,  id : 'cultist'      ,  baseHealth : 18       ,  baseAttack : 4  , baseBlock : 0  , moves: ['attack4'         ,  null                 ,  null                ,  null            ,  null                      ]},
    halfdan      : {displayName: 'Halfdan The Ancient', level : null    ,  id : 'halfdan'      ,  baseHealth : 250      ,  baseAttack : 25 , baseBlock : 20 , moves: ['rest'            ,  'evisceratingSweep'  ,  'passiveBlock'      ,  'ancientStrike' ,  null                       ]},
    matchaLarge  : {displayName: 'Mega Matcha'        , level : 'large' ,  id : 'matchaLarge'  ,  baseHealth : '200-100', baseAttack  : 15 , baseBlock : 20 , moves: ['matchaMash'      ,  'matchaMadness'      ,  'matchaMeld'        ,  null            ,  null                      ]},
    matchaMedium : {displayName: 'Matcha'             , level : 'medium',  id : 'matchaMedium' ,  baseHealth : '99-30'  ,  baseAttack : 10 , baseBlock : 10 , moves: ['matchaMash'      ,  null                 ,  null                ,  null            ,  null                      ]},
    matchaSmall  : {displayName: 'Matcha'             , level : 'small' ,  id : 'matchaSmall'  ,  baseHealth : '>29'    ,  baseAttack : 10 , baseBlock : 5  , moves: ['matchaMash'      ,  null                 ,  null                ,  null            ,  null                      ]},
} as const // prettier-ignore

type BaseHealth = number | `${number}-${number}` | `>${number}`
type Selfkeys<T> = { [K in keyof T]: { id: K } }
export type EnemyAttack = {
    displayName: string
    level: number | string | null
    id: string
    baseHealth: BaseHealth
    baseAttack: number
    baseBlock: number
    moves: readonly [
        EnemyAttackName,
        EnemyAttackName | null,
        EnemyAttackName | null,
        EnemyAttackName | null,
        EnemyAttackName | null
    ]
}
satisfies<Record<string, EnemyAttack>>(enemyAttacks)
satisfies<Selfkeys<typeof enemyAttacks>>(enemyAttacks)

/** TODO: Break this down into the DSL. Do one!! */
export const attackNames = {
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
    startlingSpook: 'Startling Spook (Applies Unguarded x, Fatigue x)',
    supriseAllergy:
        'Surprise Allergy (Deals 50% of attack damage, applies Poison X if unblocked, Fatigue X)',
    itchyOoze: 'Itchy Ooze (DOT X)',
    infectiousBite:
        'Infectious Bite (DOT1, applies poison (X) if 5 or more damage goes unblocked)',
    engulf: 'Engulf (Deals X% of attack damage, applies Stun if any damage goes unblocked)',
    meatyCharge:
        'Meaty Charge (BA, applies bleed (X) if any damage goes unblocked)',
    bellowAndSing:
        'Bellow and Sing, deals 50% of attack damage, applies fatigue (X) (applies debilatated (X) if any damage goes unblocked)',
    screamAndCharge:
        'Scream and Charge (Deals X% of attack damage, applies Unguarded (X) after)',
}

export type EnemyAttackName =
    | keyof typeof attackNames
    | `startlingSpook(${number},${number})`
    | `supriseAllergy(${number},${number})`
    | `itchyOoze(${number})`
    | `infectiousBite(${number})`
    | `engulf(${number})`
    | `meatyCharge(${number})`
    | `bellowAndSing(${number},${number})`
    | `screamAndCharge(${number},${number})`
