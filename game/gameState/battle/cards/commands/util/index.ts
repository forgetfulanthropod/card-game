/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Value as VAngu } from 'angu'

//@ts-expect-error
import simpleColorConverter from 'simple-color-converter'
import type {
    Command,
    CharacterUid,
    BattleCursor,
    CalculatedCharacterStats,
    CardUid,
    EffectId,
    OrbType,
    RequiredActionName,
    BasicTargetType,
    CharacterStats,
    StanceId,
    CharacterMeta,
    Card,
} from 'shared'

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

interface ArgsOf {
    addBlock: [block: number]
    addBlockToSelf: [block: number]
    addWisdom: [block: number]
    addStrength: [block: number]
    addEnergy: [energy: number]
    addEnergyPerRound: [energy: number]

    choice: any[]
    chain: any[]
    deal: [damage: number, times?: number]
    dealFromStance: [stance: StanceId, damage: number, times?: number]
    dwindle: []
    effect: [id: EffectId, increase: number, targetType?: BasicTargetType]
    ifFirstPlay: any[]
    momentary: []
    orb: [type: OrbType, count: number]
    text: [str: string]
    ifDamageDealt: [mainMove: any, conditionalMove: any]
    ifStance: [stanceId: StanceId, conditionalMove: any]
    smite: [damage: number, block: number]
    queue: [numTurns: number, move: any]

    killIf: [condition: boolean]

    draw: [numCards: number]
    discard: [numCards: number]
    orbOfHolyLight: []
    psychicWarfare: [damage: number, sameTargetAddend: number]
    doubleEnchantmentOrToken: []
    require: [type: RequiredActionName, least: number, most: number]

    mimicAttack: []
}

export type Locals = CalculatedCharacterStats & {
    /** only defined when there is exactly 1 target and it is a character */
    targetHealth: number | undefined
}

export type Anguify<T extends any[]> = { [K in keyof T]: VAngu<T[K]> }

export type Executors = {
    [K in keyof ArgsOf]: (args: ExecuteArgs<Anguify<ArgsOf[K]>>) => void
}

export type ExplainerContext = {
    command: Command | Card
    characterMeta: CharacterMeta
    scene?: BattleCursor
}

export type Explainers = {
    [K in keyof ArgsOf]: (
        dslArgs: Anguify<ArgsOf[K]>,
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

export function evalAllAsHtml<T extends any[]>(angus: Anguify<T>): string[] {
    const statsToColorsMap: Partial<Record<keyof CharacterStats, string>> = {
        strength: '#d44c47',
        wisdom: '#9e6ec2',
        defense: '#337ea9',
        constitution: '#1cc8af',
    }

    return angus.map(angu => {
        let color = ''
        Object.keys(statsToColorsMap).map(stat => {
            const statColor = statsToColorsMap[
                stat as keyof CharacterStats
            ] as string
            if (angu.name().includes(stat)) {
                if (!color.length) color = statColor
                else color = blend(color, statColor)
            }
        })

        const rawVal = angu.eval()
        const val = typeof rawVal === 'number' ? Math.ceil(rawVal) : rawVal

        return color
            ? `<span style="color: ${color}; font-weight: bold;">${val}</span>`
            : `${val}`
    })
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
