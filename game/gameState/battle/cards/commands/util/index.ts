/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Value as VAngu } from 'angu'

import type {
    BasicTargetType,
    BattleCursor,
    CalculatedCharacterStats,
    Card,
    CardType,
    CardUid,
    CharacterMeta,
    CharacterStats,
    CharacterUid,
    Command,
    EffectId,
    OrbType,
    RequiredActionName,
    RoomCategoryId,
    SouvenirId,
    StanceId,
    StatModifierExpiration,
    TargetType,
} from 'shared'
//@ts-expect-error
import simpleColorConverter from 'simple-color-converter'

export type { Value as VAngu } from 'angu'

type ExecuteArgs<T = VAngu[]> = {
    dslArgs: T
    command: Command
    targetUids: CharacterUid[]
    cardUid?: CardUid
    scene: BattleCursor
    calculatedStats: Locals
}

export function s(n: number) {
    return n > 1 ? 's' : ''
}

export interface ActionArgs {
    chain: any[]
    choice: any[]
    explain: any[]
    killIf: [condition: boolean]

    addBlock: [block: number, targetType?: BasicTargetType]
    addEnergy: [energy: number]
    addEnergyPerRound: [energy: number]
    modifyStats: [
        statNames: string, //ModifiableStatName[],
        amounts: string, //number[],
        expiration: StatModifierExpiration,
        targetType?: BasicTargetType
    ]

    deal: [damage: number, modifier?: 'piercing', targetType?: BasicTargetType]
    dealFromStance: [stance: StanceId, damage: number, times?: number]
    drawSizeChange: [amount: number]
    effect: [id: EffectId, increase: number, targetType?: BasicTargetType]
    heal: [amount: number, targetType?: BasicTargetType]

    if: [condition: boolean, ifMove: any, elseMove?: any]
    ifDamageDealt: [mainMove: any, conditionalMove: any]
    ifDamageDealtApplyEffect: [
        damage: number,
        effectId: EffectId,
        counter: number
    ]
    ifHealthUnder: [health: StanceId, isUnderMove: any, defaultMove: any]
    ifKilled: [mainMove: any, conditionalMove: any]
    ifFirstPlay: any[]
    ifStance: [stanceId: StanceId, conditionalTrueMove: any]
    ifStanceElse: [
        stanceId: StanceId,
        conditionalTrueMove: any,
        conditionalFalseMove: any
    ]

    acquireSouvenir: [souvenirId: SouvenirId]
    removeSouvenir: [souvenirId: SouvenirId]

    brittle: [count: number]
    dwindle: []
    momentary: []

    hypnotize: [count: number]
    orb: [type: OrbType, count: number]
    queue: [numTurns: number, move: any]
    removeAllDebuffs: [targetType?: TargetType]
    setStance: [stance: StanceId, targetType?: TargetType]
    smite: [damage: number, block: number]
    text: [str: string]

    discard: [numCards: number]
    discardRandom: [numCards: number]
    doubleEnchantmentOrToken: []
    draw: [numCards: number]
    orbOfHolyLight: []
    psychicWarfare: [damage: number, sameTargetAddend: number]
    require: [type: RequiredActionName, least: number, most: number]

    mimicAttack: []
    bellyFlop: [damage: number, times: number]
    infectiousBite: [damage: number]
}

export type Locals = CalculatedCharacterStats & {
    /** only defined when there is exactly 1 target and it is a character */
    targetConstitution: number | undefined
    targetHealth: number | undefined
    incomingDamageIntended: number
    handSize: number
    drawPileSize: number
    discardPileSize: number
    lastCardPlayedType: CardType | undefined
    wasLastCardPlayedFromThisCharacter: boolean
    currentRoomCategory: RoomCategoryId | undefined
}

export type Anguify<T extends any[]> = { [K in keyof T]: VAngu<T[K]> }

export type Executors = {
    [K in keyof ActionArgs]: (args: ExecuteArgs<Anguify<ActionArgs[K]>>) => void
}

export type ExplainerContext = {
    command: Command | Card
    characterMeta: CharacterMeta
    scene?: BattleCursor
}

export type Explainers = {
    [K in keyof ActionArgs]: (
        dslArgs: Anguify<ActionArgs[K]>,
        context: ExplainerContext
    ) => string
}

export function evalAll<T extends any[]>(angus: Anguify<T>): T {
    // @ts-expect-error
    return angus.map(angu => angu.eval())
}

export function getOuterHtmlArr(html: string) {
    return html.split('>').length > 1
        ? [html.split('>')[0] + '>', '</' + html.split('</')[1]]
        : ['', '']
}

const statsToColorsMap: Partial<Record<keyof CharacterStats, string>> = {
    strength: '#d44c47',
    magic: '#9e6ec2',
    defense: '#337ea9',
    constitution: '#1cc8af',
}

export function evalAllAsHtml<T extends any[]>(angus: Anguify<T>): string[] {
    return angus.map(angu => {
        const statName = angu.name()
        const rawValue = angu.eval()
        const value =
            typeof rawValue === 'number' ? Math.ceil(rawValue) : rawValue

        return applyStatHtml(statName, value)
    })
}

export function applyStatHtml(statName: string, value: string) {
    let color = ''
    Object.keys(statsToColorsMap).map(stat => {
        const statColor = statsToColorsMap[
            stat as keyof CharacterStats
        ] as string
        if (statName.includes(stat)) {
            if (!color.length) color = statColor
            else color = blend(color, statColor)
        }
    })

    return color
        ? `<span style="color: ${color}; font-weight: bold;">${value}</span>`
        : `${value}`
}

function blend(color1Hex: string, color2Hex: string) {
    const color1 = new simpleColorConverter({
        hex6: color1Hex,
        to: 'cmyk',
    }).color
    const color2 = new simpleColorConverter({
        hex6: color2Hex,
        to: 'cmyk',
    }).color

    const blendColor = new simpleColorConverter({
        cmyk: {
            c: color1.c + color2.c / 2,
            m: color1.m + color2.m / 2,
            y: color1.y + color2.y / 2,
            k: color1.k + color2.k / 2,
        },
        to: 'hex6',
    })

    // logger.info(
    //     `blending ${vals(color1).join(', ')} + ${vals(color2).join(', ')} -> ${
    //         blendColor.color
    //     }`
    // )

    return `#${blendColor.color}`
}

// remaining verbs: doubleEnchantmentOrToken
// weird choice / target type: arcanePower prayerOfGoodFortune

// Verbs enemies need: mimicAttack dot ifDamageDealt damageTaken rest matchaMeld summon
