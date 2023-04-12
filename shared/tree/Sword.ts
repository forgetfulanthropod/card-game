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

export type PartId = 'dirt' | 'junk' | 'normal' | 'wood'
// | 'air'
// | 'earth'
// | 'fire'
// | 'iron'
// | 'jade'
// | 'love'
// | 'soap'
// | 'spooky'
// | 'water'
// | 'cup'
// | 'great'
// | 'lava'
// | 'oni'

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
}

type SwordStatModifiers = {
    strength?: number
    defense?: number
    magic?: number
    constitution?: number
}

export const swordPartDefinitionsMap: Record<
    PartId,
    Record<SwordPartKey, SwordStatModifiers>
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
}

export type SwordPart = {
    kind: PartId
    tinted?: boolean
    rarity?: Rarity
}
export type SwordParts = Record<SwordPartSlot, SwordPart>
export type SwordPartKey = keyof SwordParts

export type Rarity = 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common'

export function getFullTitle(swordParts: SwordParts) {
    const partToAdjectiveMap: Record<PartId, Record<SwordPartKey, string>> = {
        // water: {
        //     pommel: 'Water',
        //     handle: 'Agua',
        //     guard: 'Watery',
        //     blade: 'Water',
        // },
        // fire: {
        //     pommel: 'Firey',
        //     handle: 'Fire',
        //     guard: 'Firey',
        //     blade: 'Fire',
        // },
        // air: { pommel: 'Windy', handle: 'Air', guard: 'Windy', blade: 'Air' },
        // earth: {
        //     pommel: 'Rocky',
        //     handle: 'Rock',
        //     guard: 'Earthy',
        //     blade: 'Earth',
        // },
        // jade: {
        //     pommel: 'Jaded',
        //     handle: 'Jade',
        //     guard: 'Jaded',
        //     blade: 'Jade',
        // }, // formerly dragon
        wood: {
            pommel: 'Woody',
            handle: 'Wood',
            guard: 'Wooden',
            blade: 'Wood',
        },
        // soap: {
        //     pommel: 'Soapy',
        //     handle: 'Soap',
        //     guard: 'Clean',
        //     blade: 'Soap',
        // },
        // spooky: {
        //     pommel: 'Scary',
        //     handle: 'Bat',
        //     guard: 'Spooky',
        //     blade: 'Bats',
        // }, // formerly bat
        // iron: {
        //     pommel: 'Heavy',
        //     handle: 'Iron',
        //     guard: 'Metal',
        //     blade: 'Iron',
        // },
        normal: {
            pommel: 'Plain',
            handle: 'Mid',
            guard: 'Swordy',
            blade: 'Steel',
        }, // formerly sword
        junk: { pommel: 'Junky', handle: 'Junk', guard: 'Bad', blade: 'Junk' },
        // love: {
        //     pommel: 'Lovey',
        //     handle: 'Love',
        //     guard: 'Lovely',
        //     blade: 'Love',
        // },
        dirt: {
            pommel: 'Dirty',
            handle: 'Dirt',
            guard: 'Dirty',
            blade: 'Dirt',
        },
        // lava: {
        //     pommel: 'Spicy',
        //     handle: 'Lava',
        //     guard: 'Spicy',
        //     blade: 'Lava',
        // },
        // oni: { pommel: 'Oni', handle: '---', guard: '---', blade: '---' },
        // cup: { pommel: '---', handle: '---', guard: '---', blade: 'Cup' },
        // great: {
        //     pommel: 'Big',
        //     handle: 'Good',
        //     guard: 'Great',
        //     blade: 'Glory',
        // },
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
