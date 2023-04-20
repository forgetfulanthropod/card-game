import type { BattleCursor, CardUid, CharacterUid, GameActions } from 'shared'
import produce from 'immer'
import { getBattleSceneIn } from '@/util'
import { omit } from 'lodash'
import { restoreDeadCharacterCards } from '@/gameState/battle/util/removeDeadCharacterCards'

const REVIVE_HEAL = 0.25
const SINGLE_HEAL = 0.5
const PARTY_HEAL = 0.5
const MAX_NUM_CARDS_TO_REMOVE = 3

export const choosePlushy: GameActions['choosePlushy'] = args => {
    const scene = getBattleSceneIn(args.game)
    if (
        scene.get('currentRoom', 'category') !== 'restSite' ||
        scene.get('isInMap')
    )
        return

    if (args.index === 2) healAllPartyMembers(scene)
    else if (args.index === 1)
        healOrReviveOne(scene, args.specifics as CharacterUid)
    else if (args.index === 0) removeCards(scene, args.specifics as CardUid[])

    scene.set('isInMap', true)
}

function healAllPartyMembers(scene: BattleCursor) {
    scene.apply(
        'allCharacters',
        produce(ac => {
            Object.values(ac)
                .filter(cm => cm.isPc && cm.health > 0)
                .forEach(cm => {
                    cm.health = Math.min(
                        cm.constitution,
                        Math.ceil(cm.health + cm.constitution * PARTY_HEAL)
                    )
                })
        })
    )
}

function removeCards(scene: BattleCursor, cardUids: CardUid[]) {
    scene
        .select('cards', 'draw')
        .apply(draw =>
            omit(draw, ...cardUids.slice(0, MAX_NUM_CARDS_TO_REMOVE))
        )
}

function healOrReviveOne(scene: BattleCursor, characterUid: CharacterUid) {
    const character = scene.get('allCharacters', characterUid)
    if (character.health <= 0) {
        restoreDeadCharacterCards(scene, characterUid)
    }

    scene.select('allCharacters', characterUid).apply(
        produce(c => {
            if (c.health <= 0) {
                c.health = Math.ceil(c.constitution * REVIVE_HEAL)
            } else
                c.health = Math.min(
                    c.constitution,
                    c.health + Math.ceil(c.constitution * SINGLE_HEAL)
                )
        })
    )
}
