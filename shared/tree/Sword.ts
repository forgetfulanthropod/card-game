import {
    BasicTargetType,
    CardAction,
    CharacterUid,
    StatModifiers,
} from './battle'
import { SouvenirActivationKey } from './Souvenir'

export type SwordMap = Record<SwordId, Sword>

export type SwordId = string
type SwordPartSlot = 'pommel' | 'handle' | 'guard' | 'blade'

export const swordPartIds = [
    'dirt',
    'junk',
    'normal',
    'wood',
    'air',
    'earth',
    'fire',
    'iron',
    'jade',
    'love',
    'soap',
    'spooky',
    'water',
    'cup',
    'great',
    'lava',
    'oni',
]

export type SwordPartId = typeof swordPartIds[number]

export type Sword = {
    id: SwordId
    name: string
    equippable: boolean
    description: string
    characterUid?: CharacterUid
    targetNum?: number
    targetType?: BasicTargetType
    on: Partial<Record<SouvenirActivationKey, CardAction>>
}

export const swordPartExplanations: Record<string, string> = {
    bladeNormal: '+1 STR\n+1DEF',
    guardNormal: '+1 DEF',
    handleNormal: '+1 DEF',
    pommelNormal: '+1 MAG',

    bladeDirt: '+3 HP\n+1 DEF',
    guardDirt: '+2 HP',
    handleDirt: '+2 HP',
    pommelDirt: '+2 HP',

    bladeWood: '+1 STR',
    guardWood: '+1 STR',
    handleWood: '+1 STR',
    pommelWood: '+1 STR',

    bladeJunk: '+1 STR\n+1 DEF',
    guardJunk: '+1 STR',
    handleJunk: '+1 STR',
    pommelJunk: '+1 HP',

    bladeAir: 'in progress...',
    guardAir: 'in progress...',
    handleAir: 'in progress...',
    pommelAir: 'in progress...',

    bladeEarth: 'in progress...',
    guardEarth: 'in progress...',
    handleEarth: 'in progress...',
    pommelEarth: 'in progress...',

    bladeFire: 'in progress...',
    guardFire: 'in progress...',
    handleFire: 'in progress...',
    pommelFire: 'in progress...',

    bladeIron: 'in progress...',
    guardIron: 'in progress...',
    handleIron: 'in progress...',
    pommelIron: 'in progress...',

    bladeJade: 'in progress...',
    guardJade: 'in progress...',
    handleJade: 'in progress...',
    pommelJade: 'in progress...',

    bladeLove: 'in progress...',
    guardLove: 'in progress...',
    handleLove: 'in progress...',
    pommelLove: 'in progress...',

    bladeSoap: 'in progress...',
    guardSoap: 'in progress...',
    handleSoap: 'in progress...',
    pommelSoap: 'in progress...',

    bladeSpooky: 'in progress...',
    guardSpooky: 'in progress...',
    handleSpooky: 'in progress...',
    pommelSpooky: 'in progress...',

    bladeWater: 'in progress...',
    guardWater: 'in progress...',
    handleWater: 'in progress...',
    pommelWater: 'in progress...',

    bladeCup: 'in progress...',
    guardCup: 'in progress...',
    handleCup: 'in progress...',
    pommelCup: 'in progress...',

    bladeGreat: 'in progress...',
    guardGreat: 'in progress...',
    handleGreat: 'in progress...',
    pommelGreat: 'in progress...',

    bladeLava: 'in progress...',
    guardLava: 'in progress...',
    handleLava: 'in progress...',
    pommelLava: 'in progress...',

    bladeOni: 'in progress...',
    guardOni: 'in progress...',
    handleOni: 'in progress...',
    pommelOni: 'in progress...',
}

// type StatModifier = number | { addend?: number; multiplicand?: number }

// type SwordStatModifiers = {
//     strength?: StatModifier
//     defense?: StatModifier
//     magic?: StatModifier
//     constitution?: StatModifier
//     critChanceAddend?: StatModifier
//     critDamage?: StatModifier
//     dodge?: StatModifier

//     on?: Record<SouvenirActivationKey, string | (() => void)>
// }

export const swordPartDefinitionsMap: Record<
    SwordPartId,
    Record<SwordPartKey, StatModifiers>
> = {
    normal: {
        pommel: {
            magic: 1,
        },
        handle: {
            defense: 1,
        },
        guard: {
            defense: 1,
        },
        blade: {
            strength: 1,
            defense: 1,
        },
    },
    junk: {
        pommel: {
            constitution: 1,
        },
        handle: {
            strength: 1,
        },
        guard: {
            strength: 1,
        },
        blade: {
            strength: 1,
            defense: 1,
        },
    },
    dirt: {
        pommel: {
            constitution: 2,
        },
        handle: {
            constitution: 2,
        },
        guard: {
            constitution: 2,
        },
        blade: {
            constitution: 3,
            defense: 1,
        },
    },
    wood: {
        pommel: {
            strength: 1,
        },
        handle: {
            strength: 1,
        },
        guard: {
            strength: 1,
        },
        blade: {
            strength: 1,
        },
    },

    air: {
        pommel: {
            defense: 4,
            magic: 1,
            strength: 1,
        },
        handle: {
            constitution: 6,
            defense: 1,
        },
        guard: {
            strength: 1,
        },
        blade: {
            magic: 4,
            defense: 2,
            strength: 1,
        },
    },
    earth: {
        pommel: {
            defenseMultiplicand: 0.04,
            constitutionMultiplicand: 0.05,
        },
        handle: {
            defenseMultiplicand: 0.06,
            constitutionMultiplicand: 0.04,
        },
        guard: {
            defenseMultiplicand: 0.04,
            constitutionMultiplicand: 0.05,
        },
        blade: {
            defenseMultiplicand: 0.04,
            constitutionMultiplicand: 0.05,
        },
    },
    fire: {
        pommel: {
            magicMultiplicand: 0.08,
            magic: 3,
            strengthMultiplicand: 0.08,
            strength: 3,
            critChanceAddend: 0.03,
        },
        handle: {
            magicMultiplicand: 0.07,
            magic: 3,
            strengthMultiplicand: 0.08,
            strength: 3,
            critChanceAddend: 0.03,
        },
        guard: {
            magicMultiplicand: 0.08,
            magic: 3,
            strengthMultiplicand: 0.08,
            strength: 3,
            // on: {
            //     playAttackCard() => fire chance
            // }
        },
        blade: {
            magicMultiplicand: 0.04,
            magic: 3,
            critChanceAddend: 0.02,
            // on: {
            //     playAttackCard() => fire guarantee
            // }
        },
    },
    iron: {
        pommel: {
            strength: 2,
        },
        handle: {
            strength: 2,
        },
        guard: {
            defense: 2,
        },
        blade: {
            strengthMultiplicand: 0.02,
            strength: 2,
            defenseMultiplicand: 0.02,
            defense: 2,
        },
    },
    jade: {
        pommel: {
            magicMultiplicand: 0.04,
            magic: 1,
        },
        handle: {
            magic: 1,
        },
        guard: {
            magicMultiplicand: 0.04,
            magic: 1,
        },
        blade: {
            magicMultiplicand: 0.02,
        },
    },
    love: {
        pommel: {
            constitutionMultiplicand: 0.03,
            magicMultiplicand: 0.02,
            strengthMultiplicand: 0.02,
        },
        handle: {
            // on: {
            //     playAttackCard() 10% Vulnerable 1
            // }
        },
        guard: {
            constitutionMultiplicand: 0.05,
            constitution: 10,
        },
        blade: {
            magicMultiplicand: 0.04,
            // on: {
            //     playAttackCard() 33% Unguarded 1
            // }
        },
    },
    soap: {
        pommel: {
            dodgeChanceAddend: 0.01,
            defenseMultiplicand: 0.02,
            defense: 1,
        },
        handle: {
            dodgeChanceAddend: 0.01,
            defenseMultiplicand: 0.02,
            defense: 1,
        },
        guard: {
            dodgeChanceAddend: 0.01,
            defenseMultiplicand: 0.02,
            defense: 1,
        },
        blade: {
            dodgeChanceAddend: 0.02,
            defenseMultiplicand: 0.03,
            defense: 1,
        },
    },
    spooky: {
        pommel: {
            strength: 1,
        },
        handle: {
            strength: 1,
        },
        guard: {
            strength: 1,
        },
        blade: {
            strength: 1,
        },
    },
    water: {
        pommel: {
            magic: 2,
            defense: 1,
        },
        handle: {
            defense: 1,
        },
        guard: {
            strength: 1,
        },
        blade: {
            magic: 2,
            strength: 2,
            defense: 2,
        },
    },
    cup: {
        pommel: {
            strength: 1,
        },
        handle: {
            strength: 1,
        },
        guard: {
            strength: 1,
        },
        blade: {
            strength: 1,
        },
    },
    great: {
        pommel: {
            strength: 1,
        },
        handle: {
            strength: 1,
        },
        guard: {
            strength: 1,
        },
        blade: {
            strength: 1,
        },
    },
    lava: {
        pommel: {
            strength: 1,
        },
        handle: {
            strength: 1,
        },
        guard: {
            strength: 1,
        },
        blade: {
            strength: 1,
        },
    },
    oni: {
        pommel: {
            strength: 1,
        },
        handle: {
            strength: 1,
        },
        guard: {
            strength: 1,
        },
        blade: {
            strength: 1,
        },
    },
}

export type SwordPart = {
    kind: SwordPartId
    tinted?: boolean
    rarity?: Rarity
}
export type SwordParts = Record<SwordPartSlot, SwordPart>
export type SwordPartKey = keyof SwordParts

export type Rarity = 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common'

export function getFullTitle(swordParts: SwordParts) {
    const partToAdjectiveMap: Record<
        SwordPartId,
        Record<SwordPartKey, string>
    > = {
        water: {
            pommel: 'Water',
            handle: 'Agua',
            guard: 'Watery',
            blade: 'Water',
        },
        fire: {
            pommel: 'Firey',
            handle: 'Fire',
            guard: 'Firey',
            blade: 'Fire',
        },
        air: { pommel: 'Windy', handle: 'Air', guard: 'Windy', blade: 'Air' },
        earth: {
            pommel: 'Rocky',
            handle: 'Rock',
            guard: 'Earthy',
            blade: 'Earth',
        },
        jade: {
            pommel: 'Jaded',
            handle: 'Jade',
            guard: 'Jaded',
            blade: 'Jade',
        }, // formerly dragon
        wood: {
            pommel: 'Woody',
            handle: 'Wood',
            guard: 'Wooden',
            blade: 'Wood',
        },
        soap: {
            pommel: 'Soapy',
            handle: 'Soap',
            guard: 'Clean',
            blade: 'Soap',
        },
        spooky: {
            pommel: 'Scary',
            handle: 'Bat',
            guard: 'Spooky',
            blade: 'Bats',
        }, // formerly bat
        iron: {
            pommel: 'Heavy',
            handle: 'Iron',
            guard: 'Metal',
            blade: 'Iron',
        },
        normal: {
            pommel: 'Plain',
            handle: 'Mid',
            guard: 'Swordy',
            blade: 'Steel',
        }, // formerly sword
        junk: { pommel: 'Junky', handle: 'Junk', guard: 'Bad', blade: 'Junk' },
        love: {
            pommel: 'Lovey',
            handle: 'Love',
            guard: 'Lovely',
            blade: 'Love',
        },
        dirt: {
            pommel: 'Dirty',
            handle: 'Dirt',
            guard: 'Dirty',
            blade: 'Dirt',
        },
        lava: {
            pommel: 'Spicy',
            handle: 'Lava',
            guard: 'Spicy',
            blade: 'Lava',
        },
        oni: { pommel: 'Oni', handle: '---', guard: '---', blade: '---' },
        cup: { pommel: '---', handle: '---', guard: '---', blade: 'Cup' },
        great: {
            pommel: 'Big',
            handle: 'Good',
            guard: 'Great',
            blade: 'Glory',
        },
    }

    // const partOrder: PartName[] = ["pommel", "handle", "guard", "blade"];
    // pommel handle sword of guard blade
    const sp = swordParts
    return `${partToAdjectiveMap[sp.pommel.kind].pommel} ${
        partToAdjectiveMap[sp.handle.kind].handle
    } Sword of ${partToAdjectiveMap[sp.guard.kind].guard} ${
        partToAdjectiveMap[sp.blade.kind].blade
    }`
}
