import { metricField, writeMetric } from 'server/metrics'
import type {
    Card,
    BattleCursor,
    CharacterUid,
    CharacterMeta,
    DungeonRoom,
} from 'shared'

// TODO: discussion: put these meta interfaces/types in another file along
// with the server metric args?
export interface BareGameMetricsArgs {
    playCard: { card: Card; targetUids: CharacterUid[] }
    chooseStance: { character: CharacterMeta; stanceId: string }
    nextRoom: { choice: number; chosenRoom: DungeonRoom }
    addCardToDeck: { card: Card }
    endTurn: {}
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
        character_name: string
        character_stance: string
        character_class: string
        turn_count: number
        play_order: number
        target_id: string
        target_type: string
        target_hp?: number
        user_name?: string
        run_id: number
    }
    let tags = {} as tagInfo

    let character = scene.get('allCharacters', card.characterUid)

    Object.assign(tags, {
        card_name: card.id,
        card_energy: card.energy,
        character_name: character.id,
        character_stance: character.stance,
        character_class: character.class,
        turn_count: scene.get('turnCount'),
        play_order: scene.get('cardsPlayedThisTurn').length,
        target_type: card.targetType,
        run_id: scene.get('runId'),
        user_name: scene.get('username'),
    })
    if (targetUids.length == 1) {
        let target = scene.get('allCharacters', targetUids[0])
        tags.target_id = target.id
        tags.target_hp = target.health
    } else {
        tags.target_id = 'multiple'
    }
    writeMetric('card_play', tags)
}

export const chooseStance: GameMetrics['chooseStance'] = args => {
    const { character, stanceId, scene } = args
    let tags = {
        character_name: character.id,
        character_class: character.class,
        character_hp: character.health,
        turn_count: scene.get('turnCount'),
        stance_name: stanceId,
        run_id: scene.get('runId'),
        user_name: scene.get('username'),
    }
    writeMetric('choose_stance', tags)
}

export const nextRoom: GameMetrics['nextRoom'] = args => {
    const { choice, chosenRoom, scene } = args
    let tags = {
        room_choice: chosenRoom.uid,
        room_category: chosenRoom.category,
        run_id: scene.get('runId'),
        user_name: scene.get('username'),
    }
    let fields = [metricField({ value: choice })]
    writeMetric('next_room', tags, fields)
}

export const addCardToDeck: GameMetrics['addCardToDeck'] = args => {
    const { card, scene } = args
    let tags = {
        card_name: card.id,
        card_type: card.type,
        card_energy: card.energy,
        character_class: card.characterClass,
        run_id: scene.get('runId'),
        user_name: scene.get('username'),
    }
    writeMetric('card_draft', tags)
}

export const endTurn: GameMetrics['endTurn'] = args => {
    let { scene } = args
    let cards = scene.get('cardsPlayedThisTurn')
    let damages = scene.get('damagesDealtThisTurn')
    let blocks = scene.get('blocksAppliedThisTurn')
    let tags = {
        turn_count: scene.get('turnCount'),
        num_cards_played: cards.length,
        num_damage_cards: damages.length,
        num_block_cards: blocks.length,
        // NOT ACCURATE COUNT; parry that's a damage card that also adds block only counts damage here
        turn_damage_dealt: damages.reduce((n, { amount }) => n + amount, 0),
        turn_block_added: blocks.reduce((n, { amount }) => n + amount, 0),
        run_id: scene.get('runId'),
        username: scene.get('username'),
    }
    writeMetric('turn_end', tags)
}
