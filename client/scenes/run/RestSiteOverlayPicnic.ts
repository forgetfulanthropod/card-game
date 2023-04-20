import { collectData } from '@/analytics/collectData'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import {
    Adjust,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getStage,
    glowFilter,
    If,
    loopSong,
    PixiContainer,
    Sprite,
} from '@/elementsUtil'
import { CardsTiltedInLine, Explanation } from '@sharedElements'
import { datum } from 'datums'
import { Texture } from 'pixi.js'
import { CardUid, CharacterUid } from 'shared'
import { vals } from 'shared/code'
import { Backdrop } from './Backdrop'
import { DeckViewer } from './DeckViewer'
import { CharacterChoices } from './CharacterChoices'
import { DEFAULT_TILTED_CARDS_WIDTH } from '../shared/cards/CardsTiltedInLine'
import { OutlineFilter } from 'pixi-filters'

export function RestSiteOverlay(): PixiContainer {
    collectData('ui_ux_view', { page_title: 'Rest Site' })

    loopSong('restSiteMusicHooligansBluff')

    const xya = {
        x: BASE_WIDTH * 0.5,
        y: BASE_HEIGHT * 0.5,
        anchor: 0.5,
    }

    const plushyChoices = [
        {
            description: 'remove up to three cards from your deck',
            getParamPromise: getCardChoicePromise,
        },
        {
            description: hasAPlayerCharacterDied()
                ? 'revive a dead Kaiju to 25% Health'
                : 'heal a Kaiju for 50% of its Health',
            getParamPromise: getCharacterChoicePromise,
        },
        { description: 'Heal all living Kaiju by 25%' },
        // "bring back a Kaiju's exhausted abilities",
        // "bring back a Kaiju's exhausted abilities",
    ]

    const choices = [
        Sprite({
            src: 'restSitePenguin',
            ...xya,
        }),
        Sprite({
            src: 'restSiteFrog',
            ...xya,
        }),
        Sprite({
            src: 'restSiteWarhog',
            ...xya,
        }),
    ]

    const hoveredBoxIndex = datum<number | null>(null)
    const boundingBoxes = calcBoundingBoxes()
    const boxes = boundingBoxes.map(([x, y, w, h], index) => {
        const s = Sprite({
            src: Texture.WHITE,
            x: x * BASE_WIDTH,
            y: y * BASE_HEIGHT,
            width: w * BASE_WIDTH,
            height: h * BASE_HEIGHT,
            alpha: 0.0,
            events: {
                pointerenter() {
                    choices[index].filters = [glowFilter]
                    hoveredBoxIndex.set(index)
                },
                async pointerup() {
                    let specifics
                    let paramPromise

                    if ((paramPromise = plushyChoices[index].getParamPromise))
                        specifics = await paramPromise()

                    void callApi('choosePlushy', {
                        index,
                        specifics,
                    })
                },
                pointerleave() {
                    choices[index].filters = []
                    hoveredBoxIndex.set(null)
                },
            },
        })
        return s
    })

    const bg = Sprite({
        src: 'restSiteBg',
        events: {
            pointerenter() {},
        },
        ...xya,
    })
    bg.cursor = 'default'

    return Container(
        {},
        bg,
        ...choices,
        ...boxes,
        If(hoveredBoxIndex, index => {
            // console.log({
            //     x: boundingBoxes[index][0],
            //     y: boundingBoxes[index][1] + boundingBoxes[index][3],
            // })
            return Explanation({
                texts: [plushyChoices[index].description],
                displayObjectArgs: {
                    x: boundingBoxes[index][0] * BASE_WIDTH + 0.05 * BASE_WIDTH,
                    y:
                        (boundingBoxes[index][1] + boundingBoxes[index][3]) *
                        BASE_HEIGHT,
                },
            })
        })
    )
}

function getCardChoicePromise(): Promise<CardUid[]> {
    return new Promise(resolve => {
        const chosenCards = datum<CardUid[]>([])
        getStage().addChild(DeckViewer('draw', chosenCards, 3))
        chosenCards.onChange((cards, _, unsub) => {
            unsub()
            resolve(cards)
        })
    })
}

function getCharacterChoicePromise(): Promise<CharacterUid> {
    const scene = getBattleScene()
    let characters = vals(scene.get('allCharacters')).filter(c => c.isPc)

    if (hasAPlayerCharacterDied()) {
        characters = characters.filter(c => c.health <= 0)
    }

    return new Promise(resolve => {
        const choice = datum<null | { characterUid: CharacterUid }>(null)
        const doneChoosing = datum(false)
        const characterChoices = Container(
            {},
            Backdrop({
                events: {
                    pointerup() {
                        unsub()
                        getStage().removeChild(characterChoices)
                    },
                },
            }),
            ...(hasAPlayerCharacterDied()
                ? characters.map((c, index) =>
                      Adjust(
                          CardsTiltedInLine({
                              cards: vals(
                                  getBattleScene().get('cards', 'removedDead')
                              ).filter(card => card.characterUid === c.uid),
                          }),
                          {
                              filters: [new OutlineFilter(3, 0)],
                              x:
                                  characters.length > 1
                                      ? BASE_WIDTH * (0.33 + index * 0.33)
                                      : BASE_WIDTH * 0.5 -
                                        DEFAULT_TILTED_CARDS_WIDTH / 2,
                              y: BASE_HEIGHT * 0.55,
                          }
                      )
                  )
                : []),
            ...CharacterChoices({
                choice,
                doneChoosing,
                charactersOverride: characters,
                yOverride: hasAPlayerCharacterDied()
                    ? BASE_HEIGHT * 0.5
                    : BASE_HEIGHT * 0.1,
            })
        )

        const unsub = doneChoosing.onChange((_, __, unsub) => {
            unsub()
            resolve(choice.val!.characterUid)
            getStage().removeChild(characterChoices)
        })

        getStage().addChild(characterChoices)
    })
}

function hasAPlayerCharacterDied() {
    return !!vals(getBattleScene().get('allCharacters')).find(
        c => c.health <= 0
    )
}

function calcBoundingBoxes(): Rect[] {
    const lefts = [0.203, 0.396, 0.595]
    const tops = [0.26, 0.16, 0.2]
    const widths = [0.18, 0.2, 0.833 - 0.595]
    const heights = [0.37, 0.37, 0.39]
    return lefts.map((_, i) => [lefts[i], tops[i], widths[i], heights[i]])
}
