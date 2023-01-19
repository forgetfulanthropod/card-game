import { writeMetric } from 'server/metrics'
import type {
    Card,
    BattleCursor,
    CharacterUid,
    CharacterMeta,
    DungeonRoom,
} from 'shared'

export const playCardMetric = (
    card: Card,
    scene: BattleCursor,
    targetUids: CharacterUid[],
    username: string = ''
) => {
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
    })
    if (targetUids.length == 1) {
        let target = scene.get('allCharacters', targetUids[0])
        tags.target_id = target.id
        tags.target_hp = target.health
    } else {
        tags.target_id = 'multiple'
    }
    if (username) {
        tags.user_name = username
    }
    writeMetric('card_play', 1, tags)
}

export const chooseStanceMetric = (
    character: CharacterMeta,
    stanceId: string,
    scene: BattleCursor,
    username: string = ''
) => {
    let tags = {
        character_name: character.id,
        character_class: character.class,
        character_hp: character.health,
        turn_count: scene.get('turnCount'),
        stance_name: stanceId,
        run_id: scene.get('runId'),
    }
    if (username) {
        Object.assign(tags, { user_name: username })
    }
    writeMetric('choose_stance', 1, tags)
}

export const nextRoomMetric = (
    choice: number,
    chosenRoom: DungeonRoom,
    runId: number,
    username: string = ''
) => {
    let tags = {
        room_choice: chosenRoom.uid,
        room_category: chosenRoom.category,
        run_id: runId,
    }
    if (username) {
        Object.assign(tags, { user_name: username })
    }
    writeMetric('next_room', choice, tags)
}

export const addCardToDeckMetric = (
    card: Card,
    runId: number,
    username: string | undefined = ''
) => {
    let tags = {
        card_name: card.id,
        card_type: card.type,
        card_energy: card.energy,
        character_class: card.characterClass,
        run_id: runId,
    }
    if (username) {
        Object.assign(tags, { user_name: username })
    }
    writeMetric('card_draft', 1, tags)
}

export const endTurnMetric = (scene: BattleCursor, username: string = '') => {
    let cards = scene.get('cardsPlayedThisTurn')
    let damages = scene.get('damagesDealtThisTurn')
    let blocks = scene.get('blocksAppliedThisTurn')
    let tags = {
        turn_count: scene.get('turnCount'),
        num_cards_played: cards.length,
        num_damage_cards: damages.length,
        num_block_cards: blocks.length,
        //NOT ACCURATE COUNT; parry that's a damage card that also adds block only counts damage here
        turn_damage_dealt: damages.reduce((n, { amount }) => n + amount, 0),
        turn_block_added: blocks.reduce((n, { amount }) => n + amount, 0),
        run_id: scene.get('runId'),
    }
    if (username) {
        Object.assign(tags, { user_name: username })
    }
    writeMetric('turn_end', 1, tags)
}
