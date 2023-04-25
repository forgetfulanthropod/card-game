import { metricField, writeMetric } from 'server/metrics'
import type {
    BattleCursor,
    Card,
    CharacterUid,
    CharacterMeta,
    DungeonRoom,
    Orb,
} from 'shared'

// TODO: discussion: put these meta interfaces/types in another file along
// with the server metric args?
export interface BareGameMetricsArgs {
    activateOrb: { orb: Orb; character: CharacterMeta }
    addCardToDeck: { card: Card }
    chooseStance: { character: CharacterMeta; stanceId: string }
    discardCard: { card: Card }
    endTurn: {}
    nextRoom: { choice: number; chosenRoom: DungeonRoom }
    playCard: { card: Card; targetUids: CharacterUid[] }
}

export type GameMetricsArgs = {
    [K in keyof BareGameMetricsArgs]: BareGameMetricsArgs[K] & {
        scene: BattleCursor
    }
}
export type GameMetrics = {
    [K in keyof GameMetricsArgs]: (args: GameMetricsArgs[K]) => void
}

// TODO: discussion: should the tags by typed and put in a meta interface
// like the args as well? Possibly return { name, fields, tags } from each
// metric function and put the actual call to write somewhere else
export const playCard: GameMetrics['playCard'] = args => {
    const { card, targetUids, scene } = args
    interface tagInfo {
        card_name: string
        card_energy: number
        card_type: string
        card_class: string
        character_name: string
        character_stance: string
        character_hp: number
        character_block: number
        turn_count: number
        play_order: number
        target_id: string
        target_type: string
        target_hp?: number
        target_block?: number
        user_id?: string
        run_id: number
    }
    let tags = {} as tagInfo

    const character = scene.get('allCharacters', card.characterUid)

    Object.assign(tags, {
        card_name: card.id,
        card_energy: card.energy,
        card_type: card.type,
        card_class: card.characterClass,
        character_name: character.id,
        character_stance: character.stance,
        character_hp: character.health,
        character_block: character.block,
        turn_count: scene.get('turnCount'),
        play_order: scene.get('cardsPlayedThisTurn').length,
        target_type: card.targetType,
        run_id: scene.get('runId'),
        user_id: scene.get('userId'),
    })
    if (targetUids.length == 1) {
        let target = scene.get('allCharacters', targetUids[0])
        tags.target_id = target.id
        tags.target_hp = target.health
        tags.target_block = target.block
    } else {
        tags.target_id = 'multiple'
    }
    writeMetric('card_play', tags)
}

export const chooseStance: GameMetrics['chooseStance'] = args => {
    const { character, stanceId, scene } = args
    const tags = {
        character_name: character.id,
        character_class: character.class,
        character_hp: character.health,
        character_block: character.block,
        turn_count: scene.get('turnCount'),
        stance_name: stanceId,
        run_id: scene.get('runId'),
        user_id: scene.get('userId'),
    }
    writeMetric('choose_stance', tags)
}

export const nextRoom: GameMetrics['nextRoom'] = args => {
    const { choice, chosenRoom, scene } = args
    const tags = {
        room_choice: chosenRoom.uid,
        room_category: chosenRoom.category,
        run_id: scene.get('runId'),
        user_id: scene.get('userId'),
    }
    const fields = [metricField({ value: choice })]
    writeMetric('next_room', tags, fields)
}

export const addCardToDeck: GameMetrics['addCardToDeck'] = args => {
    const { card, scene } = args
    const tags = {
        card_name: card.id,
        card_type: card.type,
        card_energy: card.energy,
        character_class: card.characterClass,
        run_id: scene.get('runId'),
        user_id: scene.get('userId'),
    }
    writeMetric('card_draft', tags)
}

export const endTurn: GameMetrics['endTurn'] = args => {
    const { scene } = args
    const cards = scene.get('cardsPlayedThisTurn')
    const damages = scene.get('damagesDealtThisTurn')
    const blocks = scene.get('blocksAppliedThisTurn')
    const tags = {
        turn_count: scene.get('turnCount'),
        num_cards_played: cards.length,
        num_damage_cards: damages.length,
        num_block_cards: blocks.length,
        // NOT ACCURATE COUNT; parry that's a damage card that also adds block only counts damage here
        turn_damage_dealt: damages.reduce((n, { amount }) => n + amount, 0),
        turn_block_added: blocks.reduce((n, { amount }) => n + amount, 0),
        run_id: scene.get('runId'),
        user_id: scene.get('userId'),
    }
    writeMetric('turn_end', tags)
}

// TODO: process Card[] instead of each Card
export const discardCard: GameMetrics['discardCard'] = args => {
    const { card, scene } = args
    const tags = {
        card_name: card.name,
        card_energy: card.energy,
        card_type: card.type,
        card_class: card.characterClass,
        turn_count: scene.get('turnCount'),
        run_id: scene.get('runId'),
        user_id: scene.get('userId'),
    }
    writeMetric('card_discard', tags)
}

export const activateOrb: GameMetrics['activateOrb'] = args => {
    const { orb, character, scene } = args
    const tags = {
        orb_name: orb.type,
        orb_remaining: orb.remainingCount,
        character_name: character.id,
        character_hp: character.health,
        character_block: character.block,
        turn_count: scene.get('turnCount'),
        run_id: scene.get('runId'),
        user_id: scene.get('userId'),
    }
    writeMetric('orb_activate', tags)
}
