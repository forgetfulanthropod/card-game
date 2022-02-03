import type { Card, CharacterUid, Pile } from '@shared'
// import { myPIXI } from '@/elementsUtil'
import { gsap } from 'gsap'
import { filters } from 'pixi.js'

import { playCard } from '@/actions'
import { getBattleScene } from '@/data/rootTree'
import type {
    InteractionEventHandler,
    PixiContainer,
    PixiSprite,
    SpriteArgs,
} from '@/elementsUtil'
import { getTexture } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Container, Sprite } from '@/elementsUtil'
import { keys, vals } from '@/util'

import type { AssetKey } from '../../logic/AssetLoader'

export function Hand(pile: Pile): PixiContainer {
    const cardUids = keys(pile)
    const scale = 0.5

    const children = vals(pile).map((card, index) => {
        const xyr = getXYRotationForNthCard(index + 1, keys(pile).length)

        const restingParams: Partial<SpriteArgs> = {
            src: getTexture(card.id as AssetKey),
            name: cardUids[index],
            scale,
            anchor: [0.5, 0.5],
            ...xyr,
        }

        //@ts-ignore says src type incompatible but it's a PixiTexture
        return Sprite({
            ...restingParams,
            ...getMouseEvents(card, restingParams),
        })
    })

    return Container({
        x: BASE_WIDTH * 0.5,
        y: BASE_HEIGHT * 1,
        children,
    })
}

function getMouseEvents(
    card: Card,
    restingParams: Partial<SpriteArgs>
): {
    onMouseover: InteractionEventHandler
    onMouseout: InteractionEventHandler
    onClick: InteractionEventHandler
} {
    const hideFilter = new filters.AlphaFilter(0)
    let animationForCard = gsap.to({}, 0, {})
    let expandedCard: PixiSprite | null

    const onMouseover: InteractionEventHandler = async ({ currentTarget }) => {
        if (animationForCard != null) await animationForCard

        const parent = currentTarget.parent

        currentTarget.filters = [hideFilter]

        if (expandedCard != null) {
            parent.removeChild(expandedCard)
            expandedCard.destroy()
            expandedCard = null
        }

        //@ts-ignore says src type incompatible but it's a PixiTexture
        expandedCard = Sprite({
            ...{ ...restingParams, name: `${restingParams.name}-expanded` },
        })

        parent.addChild(expandedCard)

        animationForCard = gsap.to(expandedCard, {
            pixi: { y: -350, rotation: 0, scale: 1 },
            duration: 0.3,
        })
    }

    const onMouseout: InteractionEventHandler = async ({ currentTarget }) => {
        if (animationForCard == null) return

        await animationForCard.reverse().then(() => {
            animationForCard.kill()
            currentTarget.filters = []
            if (expandedCard != null) {
                currentTarget.parent.removeChild(expandedCard)
                expandedCard.destroy()
                expandedCard = null
            }
        })
    }

    const onClick: InteractionEventHandler = async ({ currentTarget }) => {
        let targetUids
        switch (card.targetType) {
            case 'enemies':
                targetUids = [getFrontEnemyUid()]
                break
            case 'friends':
                targetUids = [getFrontFriendUid()]
                break
        }
        await playCard({
            cardUid: currentTarget.name,
            targetUids,
        })
    }

    return {
        onMouseover,
        onMouseout,
        onClick,
    }
}

function getFrontFriendUid(): CharacterUid {
    const frontFriend = vals(getBattleScene().get('allCharacters'))
        .sort((a, b) => b.x - a.x)
        .find(c => c.isPc && c.health > 0)

    if (frontFriend == null) throw new Error('there is no enemy...')

    return frontFriend.uid
}

function getFrontEnemyUid(): CharacterUid {
    const frontEnemy = vals(getBattleScene().get('allCharacters'))
        .sort((a, b) => a.x - b.x)
        .find(c => !c.isPc && c.health > 0)

    if (frontEnemy == null) throw new Error('there is no enemy...')

    return frontEnemy.uid
}

const RIGHT_TO_LEFT = 1
const MAX_HAND_WIDTH = BASE_WIDTH * 0.4
const MAX_HAND_SIZE = 12
const CARD_WIDTH = (150 * BASE_WIDTH) / 1920
const MAX_CARD_ROTATION = Math.PI * 0.1
const Y_MAX_OFFSET = BASE_HEIGHT * 0.04

type XYRotation = { x: number; y: number; rotation: number }

function getXYRotationForNthCard(
    n: number,
    numCardsInHand: number
): XYRotation {
    if (n < 1 || n > numCardsInHand)
        throw new Error(`n must be between 1 and numCardsInHand, value: ${n}`)

    const handWidth = Math.min(
        (numCardsInHand - 1) * CARD_WIDTH,
        MAX_HAND_WIDTH
    )

    const xPlacementPortion =
        RIGHT_TO_LEFT * 1 - (2 * (n - 1)) / Math.max(numCardsInHand - 1, 1) // -1 -> 1

    // console.log({ xPlacementPortion })

    const endCardRotation =
        ((numCardsInHand - 1) / (MAX_HAND_SIZE - 1)) * MAX_CARD_ROTATION

    return {
        x: handWidth * 0.5 * xPlacementPortion,
        y:
            -Y_MAX_OFFSET * (1 - Math.abs(xPlacementPortion)) ||
            Y_MAX_OFFSET / 8,
        rotation: xPlacementPortion * endCardRotation,
    }
}
