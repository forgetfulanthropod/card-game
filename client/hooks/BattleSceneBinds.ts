import type { Datum } from 'datums'
import type { ROCursor } from 'sbaobab'
import type { BattleScene, CardUid, StanceId } from 'shared'

import { callApi } from '@/callApi'
import {
    globalShowSims,
    hoveredSelectedCardUid,
    isAttacking,
    ruleBookEditorIsShown,
    sceneEditorIsShown,
} from '@/util'
import { getEvents } from '@/scenes/shared/cards/Card'
import { FederatedPointerEvent } from 'pixi.js'

type stanceChoose = { characterIndex: number[]; stanceId: StanceId }

const stanceKeybindMap: Record<string, stanceChoose> = {
    q: {
        characterIndex: [0],
        stanceId: 'avoidant',
    },
    w: {
        characterIndex: [0],
        stanceId: 'neutral',
    },
    e: {
        characterIndex: [0],
        stanceId: 'aggressive',
    },
    a: {
        characterIndex: [1],
        stanceId: 'avoidant',
    },
    s: {
        characterIndex: [1],
        stanceId: 'neutral',
    },
    d: {
        characterIndex: [1],
        stanceId: 'aggressive',
    },
    z: {
        characterIndex: [2],
        stanceId: 'avoidant',
    },
    x: {
        characterIndex: [2],
        stanceId: 'neutral',
    },
    c: {
        characterIndex: [2],
        stanceId: 'aggressive',
    },
    r: {
        characterIndex: [0, 1, 2],
        stanceId: 'avoidant',
    },
    t: {
        characterIndex: [0, 1, 2],
        stanceId: 'neutral',
    },
    y: {
        characterIndex: [0, 1, 2],
        stanceId: 'aggressive',
    },
}
const numbersArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
const otherKeys = ['Escape', ' ']

const characterIndices = [0, 1, 2, 3, 4, 5]

const chooseStance = (scene: ROCursor<BattleScene>, key: string) => {
    const characters = Object.entries(scene.get('allCharacters')).filter(
        ([k, _]) => k.startsWith('pc')
    )
    const action = stanceKeybindMap[key]
    for (let idx of action.characterIndex) {
        const character = characters[idx][1]
        if (character.health <= 0) continue
        callApi('chooseStance', {
            characterUid: character.uid,
            stanceId: action.stanceId,
        })
    }
    if (globalShowSims.val === true) {
        globalShowSims.set(false)
        globalShowSims.set(true)
    }
}

const selectCard = (
    scene: ROCursor<BattleScene>,
    hoveredCardUid: Datum<CardUid | null>,
    idx: number
) => {
    const cards = Object.entries(scene.get('cards', 'hand')).reverse()
    const [cardUid, card] = cards[idx]
    hoveredCardUid.set(cardUid)
    hoveredSelectedCardUid.set(cardUid)
    isAttacking.set(true)
    const events = getEvents(card, hoveredCardUid)
    if (events.pointerdown && events.pointerup) {
        events.pointerdown({} as FederatedPointerEvent)
        events.pointerup({} as FederatedPointerEvent)
    }
}

const playCard = (
    scene: ROCursor<BattleScene>,
    hoveredCardUid: Datum<CardUid | null>,
    idx: number
) => {
    if (!characterIndices.includes(idx)) {
        clearAttack(hoveredCardUid)
        return
    }
    const cardUid = hoveredSelectedCardUid.val
    if (!cardUid) {
        clearAttack(hoveredCardUid)
        return
    }
    const targets = Object.entries(scene.get('allCharacters'))
    const target = targets[idx][0]
    if (!target) {
        clearAttack(hoveredCardUid)
        return
    }
    callApi('playCard', {
        cardUid: cardUid,
        targetUids: [target],
    })
    clearAttack(hoveredCardUid)
}

const clearAttack = (hoveredCardUid: Datum<CardUid | null>) => {
    globalShowSims.set(false)
    hoveredCardUid.set(null)
    hoveredSelectedCardUid.set(null)
    isAttacking.set(false)
}

export const battleKeybinds = (
    scene: ROCursor<BattleScene>,
    hoveredCardUid: Datum<CardUid | null>
) => {
    const allKeys = [
        ...Object.keys(stanceKeybindMap),
        ...numbersArray,
        ...otherKeys,
    ]
    const keybinds = (e: KeyboardEvent) => {
        if (
            ruleBookEditorIsShown.val === true ||
            sceneEditorIsShown.val === true ||
            !allKeys.includes(e.key)
        )
            return
        e.preventDefault()
        if (Object.keys(stanceKeybindMap).includes(e.key)) {
            chooseStance(scene, e.key)
        } else if (numbersArray.includes(e.key)) {
            const num = Number(e.key)
            const idx = num == 0 ? 9 : num - 1
            if (!isAttacking.val) {
                selectCard(scene, hoveredCardUid, idx)
                globalShowSims.set(true)
            } else {
                playCard(scene, hoveredCardUid, idx)
            }
        } else if (e.key === 'Escape') {
            clearAttack(hoveredCardUid)
        } else if (e.key === ' ') {
            callApi('endTurn', {})
        }
    }
    return keybinds
}
