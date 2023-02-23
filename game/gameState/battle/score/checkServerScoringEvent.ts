import {
    BattleCursor,
    CharacterUid,
    CharacterMeta,
    RunScoreEvent,
    CardId,
} from 'shared'
import { vals } from 'shared/code'
import { trackStanceChanges } from '../characters/trackStanceChanges'
import { updateScore } from './updateScore'
import { NUM_KAIJUS_IN_PARTY } from 'shared'
import { makeCards } from '@/gameState'

type applyDamageArgs = {
    damage: number
    targetUid: CharacterUid
    attackerUid?: CharacterUid
    scene: BattleCursor
    attacker?: CharacterMeta
}

const roundWinPointMap: Record<number, number> = {
    1: 4,
    2: 3,
    3: 2,
    4: 2,
    5: 1,
}

export const checkServerScoringEvent = (
    event: RunScoreEvent,
    scene: BattleCursor,
    data?: any
) => {
    if (data === undefined) data = {}
    switch (event) {
        case 'ROOM_CLEARED':
            updateScore({
                scene,
                event: 'ROOM_CLEARED',
                count: 1,
                notify: true,
            })
            checkRoomClearSpeed(scene)
            checkRoomDifficulty(scene)
            checkCharsInFullHealth(scene)
            checkBossRoomCleared(scene)
            checkNoEnergyUsed(scene)
            break
        case 'HIGHEST_DAMAGE':
            checkHighestDamageHit(scene, data as applyDamageArgs)
            break
        case 'RUN_COMPLETED':
            checkSurvivingKaiju(scene)
            checkSouvenirs(scene)
            checkBalancedTeam(scene)
            checkSpecialBoy(scene)
            break
        case 'RUN_DEFEATED':
            checkSouvenirs(scene)
            checkBalancedTeam(scene)
            checkSpecialBoy(scene)
            break
        case 'BLOCK_OVER_THRESHOLD':
            checkBlocksAppliedInTurn(scene)
            break
        case 'HIT_VULGAR_THRESHOLD':
            checkDamageDealtInTurn(scene)
            break
        case 'CARDS_OVER_THRESHOLD':
            checkCardsOverThreshold(scene)
            break
        case 'CARDS_WHOLE_PARTY':
            checkCardsWholeParty(scene)
            break
        case 'CARDS_DRAFT_BALANCED':
            checkCardsDraftBalanced(scene)
            break
        case 'ROOM_TAKE_100_DAMAGE':
            checkRoomTake100Damage(scene)
            break
        case 'PERFECT_BLOCK':
            checkPerfectBlock(scene)
            break
    }
}

const checkSouvenirs = (scene: BattleCursor) => {
    const numSouvenirs = scene.get('souvenirs').length
    updateScore({
        scene,
        event: 'NUM_SOUVENIRS',
        count: numSouvenirs,
    })
}

const checkBalancedTeam = (scene: BattleCursor) => {
    const team = new Set(
        Object.entries(scene.get('allCharacters'))
            .filter(([key, char]) => char.isPc)
            .map(([key, char]) => char.id)
    )
    if (team.size === 3) {
        updateScore({
            scene,
            event: 'BALANCED_TEAM',
            count: 1,
        })
    }
}

const checkSpecialBoy = (scene: BattleCursor) => {
    const allCards = scene.get('cards')
    const startDeck = Object.values(makeCards(scene).draw)
        .filter(card => card.id)
        .map(card => card.id)
    let countStartDeck: Partial<Record<CardId, number>> = {}
    startDeck.forEach(
        cardId => (countStartDeck[cardId] = (countStartDeck[cardId] || 0) + 1)
    )
    const fullDeck = Object.values({
        ...allCards.discard,
        ...allCards.draw,
        ...allCards.hand,
        ...allCards.removedRoom,
        // TODO sepearte manually removed vs dead char removed
        ...allCards.removedRun,
    }).map(card => card.id)
    let countFullDeck: Partial<Record<CardId, number>> = {}
    fullDeck.forEach(cardId => {
        let start =
            countFullDeck[cardId] !== undefined
                ? countFullDeck[cardId]
                : countStartDeck[cardId] !== undefined
                ? // @ts-expect-error
                  -countStartDeck[cardId]
                : 0
        // @ts-expect-error
        countFullDeck[cardId] = start + 1
    })
    let foundBadDuplicate = false
    for (let [cardId, count] of Object.entries(countFullDeck)) {
        if (count > 1) {
            foundBadDuplicate = true
            break
        }
    }
    if (foundBadDuplicate === false) {
        updateScore({
            scene,
            event: 'SPECIAL_BOY',
            count: 1,
        })
    }
}

const checkRoomClearSpeed = (scene: BattleCursor) => {
    const turnCount = scene.get('turnCount')
    if (!(turnCount in roundWinPointMap)) return
    updateScore({
        scene,
        event: 'ROOM_CLEAR_SPEED',
        count: roundWinPointMap[turnCount],
        notify: true,
    })
}

const checkRoomDifficulty = (scene: BattleCursor) => {
    const roomCategory = scene.get('currentRoom', 'category')
    let points
    if (roomCategory === 'tierThree') {
        points = 2
    } else if (roomCategory === 'tierFour') {
        points = 3
    } else {
        return
    }
    updateScore({
        scene,
        event: 'ROOM_CLEAR_DIFFICULTY',
        count: points,
    })
}

const checkCharsInFullHealth = (scene: BattleCursor) => {
    const userCharsInFullHealth = vals(scene.get('allCharacters')).filter(
        meta => meta.isPc && meta.constitution === meta.health
    )

    const partyInFullHealth =
        userCharsInFullHealth.length === NUM_KAIJUS_IN_PARTY

    const roomHadBoss = roomContainsBoss(scene)

    if (partyInFullHealth) {
        const roomTypeEvent: RunScoreEvent = roomHadBoss
            ? 'EXIT_BOSS_FULL_HEALTH'
            : 'EXIT_ROOM_FULL_HEALTH'

        updateScore({ scene, event: roomTypeEvent, count: 1, notify: true })
    }
    if (roomHadBoss) {
        checkHealthLostInBossRoom(scene)
    } else {
        checkHealthLostInRoom(scene)
    }
}

const checkBossRoomCleared = (scene: BattleCursor): void => {
    if (roomContainsBoss(scene)) {
        updateScore({ scene, event: 'BOSS_KILLED', count: 1, notify: true })
    }
}

const checkHealthLostInBossRoom = (scene: BattleCursor) => {
    const totalHealthLost = getTotalHealthLost(scene)

    if (totalHealthLost < 15) {
        updateScore({
            scene,
            event: 'EXIT_BOSS_LOW_DAMAGE',
            count: 1,
            notify: true,
        })
    }
}

const checkHealthLostInRoom = (scene: BattleCursor) => {
    const totalHealthLost = getTotalHealthLost(scene)
    if (totalHealthLost === 0) {
        updateScore({
            scene,
            event: 'ROOM_WIN_ZERO_DAMAGE',
            count: 1,
            notify: true,
        })
    } else if (totalHealthLost < 5) {
        updateScore({
            scene,
            event: 'ROOM_WIN_FIVE_DAMAGE',
            count: 1,
            notify: true,
        })
    }
}

const checkRoomTake100Damage = (scene: BattleCursor) => {
    const roomScoreEventCount = scene.get(
        'scoreEventsThisRoom',
        'roomsTake100Damage'
    )
    if (roomScoreEventCount >= 1) return
    const totalHealthLost = getTotalHealthLost(scene)
    if (totalHealthLost > 100) {
        updateScore({
            scene,
            event: 'ROOM_TAKE_100_DAMAGE',
            count: 1,
            notify: true,
        })
    }
}

const roomContainsBoss = (scene: BattleCursor): boolean => {
    const currentRoom = scene.get('currentRoom')
    const boss = currentRoom.enemies.filter(enemyChar => enemyChar.boss)
    return boss.length > 0
}

const checkNoEnergyUsed = (scene: BattleCursor) => {
    const noEnergyUsed = scene.get('energy') === scene.get('roundEnergy')
    if (noEnergyUsed) {
        updateScore({
            scene,
            event: 'ROOM_WIN_NO_ENERGY_USED',
            count: 1,
            notify: true,
        })
    }
}

const getTotalHealthLost = (scene: BattleCursor): number => {
    return scene.get('damagesUnblockedThisRoom').reduce((prev, curr) => {
        if (curr.targetUid.includes('pc')) {
            return curr.amount + prev
        }
        return prev + 0
    }, 0)
}

const checkHighestDamageHit = (scene: BattleCursor, data: applyDamageArgs) => {
    const { damage, attackerUid, attacker } = data
    const userIsAttacker =
        ((attackerUid && scene.get('allCharacters', attackerUid).isPc) ||
            (attacker && attacker.isPc)) ??
        false
    if (userIsAttacker) {
        const prevHighest = scene.get('runScore').attributes.highestDamageHit
        if (damage > prevHighest) {
            updateScore({
                scene,
                event: 'HIGHEST_DAMAGE',
                count: parseInt(damage.toFixed(0)),
            })
        }
    }
}

const checkSurvivingKaiju = (scene: BattleCursor) => {
    const survivingKaiju = vals(scene.get('allCharacters')).filter(
        char => char.isPc && char.health > 0
    )
    updateScore({
        scene,
        event: 'SURVIVING_KAIJU',
        count: survivingKaiju.length,
    })

    const healthRemaining = Math.round(
        survivingKaiju.reduce((prev, curr) => {
            return prev + (curr.health / curr.constitution) * 30
        }, 0)
    )

    updateScore({
        scene,
        event: 'FINAL_USER_HEALTH_REMAINING',
        count: healthRemaining,
    })
}

const checkBlocksAppliedInTurn = (scene: BattleCursor) => {
    const BLOCK_THRESHOLD = 40
    const turnScoreEventCount = scene.get(
        'scoreEventsThisTurn',
        'blocksOverThreshold'
    )
    const roomScoreEventCount = scene.get(
        'scoreEventsThisRoom',
        'blocksOverThreshold'
    )
    if (turnScoreEventCount >= 1 || roomScoreEventCount >= 3) return
    const totalBlockApplied = scene
        .get('blocksAppliedThisTurn')
        .reduce((prev, curr) => {
            if (curr.targetUid.includes('pc')) {
                return prev + curr.amount
            }
            return prev + 0
        }, 0)
    if (totalBlockApplied > BLOCK_THRESHOLD) {
        updateScore({
            scene,
            event: 'BLOCK_OVER_THRESHOLD',
            count: 1,
        })
    }
}

const checkDamageDealtInTurn = (scene: BattleCursor) => {
    const VULGAR_DAMAGE_THRESHOLD = 20
    const turnScoreEventCount = scene.get(
        'scoreEventsThisTurn',
        'hitsOverVulgarThreshold'
    )
    const roomScoreEventCount = scene.get(
        'scoreEventsThisRoom',
        'hitsOverVulgarThreshold'
    )
    if (turnScoreEventCount >= 1 || roomScoreEventCount >= 3) return
    const totalDamageApplied = scene
        .get('damagesDealtThisTurn')
        .reduce((prev, curr) => {
            if (curr.targetUid.includes('pc')) {
                return prev + 0
            }
            return prev + curr.amount
        }, 0)

    if (totalDamageApplied > VULGAR_DAMAGE_THRESHOLD) {
        updateScore({
            scene,
            event: 'HIT_VULGAR_THRESHOLD',
            count: 1,
        })
    }
}

const checkStanceChanges = (scene: BattleCursor) => {
    trackStanceChanges(scene) // used for final turn update
    // const STANCE_CHANGES_THRESHOLD = 5
    const stanceChanges = scene.get('stanceChangesThisRoom')
    // currently removed quicked-footed
    // else if (stanceChanges.length > STANCE_CHANGES_THRESHOLD) {
    //     updateRunScoreAttribute(
    //         scene,
    //         'stanceChangesOverThreshold',
    //         stanceChanges.length - STANCE_CHANGES_THRESHOLD,
    //         true
    //     )
    // }
}

const checkCardsOverThreshold = (scene: BattleCursor) => {
    const CARDS_PLAYED_THRESHOLD = 5
    const turnScoreEventCount = scene.get(
        'scoreEventsThisTurn',
        'cardsPlayedOverThreshold'
    )
    const roomScoreEventCount = scene.get(
        'scoreEventsThisRoom',
        'cardsPlayedOverThreshold'
    )
    if (turnScoreEventCount >= 1 || roomScoreEventCount >= 3) return

    const cardsPlayed = scene.get('cardsPlayedThisTurn')
    // equals comparison to only check once per turn
    if (cardsPlayed.length === CARDS_PLAYED_THRESHOLD) {
        updateScore({
            scene,
            event: 'CARDS_OVER_THRESHOLD',
            count: 1,
        })
    }
}

const checkCardsWholeParty = (scene: BattleCursor) => {
    const CARDS_PLAYED_THRESHOLD = 5
    const turnScoreEventCount = scene.get(
        'scoreEventsThisTurn',
        'cardsWholeParty'
    )
    const roomScoreEventCount = scene.get(
        'scoreEventsThisRoom',
        'cardsWholeParty'
    )
    if (turnScoreEventCount >= 1 || roomScoreEventCount >= 1) return

    const cardsPlayed = scene.get('cardsPlayedThisTurn')
    // equals comparison to only check once per turn
    const charsPlayedSet = new Set(cardsPlayed.map(card => card.characterUid))
    if (charsPlayedSet.size === 3) {
        updateScore({
            scene,
            event: 'CARDS_WHOLE_PARTY',
            count: 1,
        })
    }
}

const checkCardsDraftBalanced = (scene: BattleCursor) => {
    const cardsDrafted = scene.get('cardsDrafted')
    if (cardsDrafted.length < 3) return
    const lastDraftTypes = cardsDrafted
        .slice(cardsDrafted.length - 3)
        .map(card => card.type)
    if (!lastDraftTypes.slice(0, 2).includes(lastDraftTypes[2])) {
        updateScore({
            scene,
            event: 'CARDS_DRAFT_BALANCED',
            count: 1,
        })
    }
}

const checkPerfectBlock = (scene: BattleCursor) => {
    const roomScoreEventCount = scene.get(
        'scoreEventsThisRoom',
        'perfectBlocks'
    )
    if (roomScoreEventCount >= 3) return
    updateScore({
        scene,
        event: 'PERFECT_BLOCK',
        count: 1,
        notify: true,
    })
}
