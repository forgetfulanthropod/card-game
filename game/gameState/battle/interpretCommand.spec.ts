import { deepStrictEqual as equals, ok as truthy } from 'assert'
import { SBaobab, SCursor } from 'sbaobab'
import type {
    BattleCursor,
    Card,
    CharacterUid,
    Command,
    GameState,
    TargetType,
} from 'shared'
import { interpretCommand, play } from './cards'
// @ts-ignore
import exampleBattleScene_ from './exampleBattlescene.json'
// eslint-disable-next-line import/no-internal-modules
import { explainCommand } from './cards/interpretCommand'
import { getBattleSceneIn } from '@/util'
import { playCard } from '@/actions'

const exampleBattleScene = exampleBattleScene_ as unknown as GameState
const originalScene = exampleBattleScene_.scene

export const pc1 = 'pc-1'
export const pc2 = 'pc-2'
export const npc1 = 'npc-1'
export const npc2 = 'npc-2'

const interpretCommandSuite = {
    addBlock() {
        const scene = freshBattleScene()
        interpretCommand({
            command: makeCmd(pc1, 'addBlock(defense)', 'self'),
            scene,
            targetUids: [pc1],
        })
        equals(
            scene.get('allCharacters', pc1, 'block'),
            exampleBattleScene_.scene.allCharacters[pc1].defense
        )
    },
    addEnergy() {
        const scene = freshBattleScene()
        interpretCommand({
            command: makeCmd(pc1, 'addEnergy(2)', 'self'),
            scene,
            targetUids: [pc1],
        })
        equals(scene.get('energy'), 3 + 2)
    },
    brittle() {
        const { scene, game } = freshGameAndBattleScene()

        addCardToHand(
            {
                characterUid: pc1,
                uid: 'a',
                explanation: '',

                name: 'Song of Good Health',
                energy: 1,
                id: 'songOfGoodHealth',
                targetNum: 1,
                targetType: 'friends',
                actions: `brittle(2)`,
                type: 'utility',
                characterClass: 'bard',
            },
            scene
        )
        playCard({ cardUid: 'a', targetUids: [npc1], game })

        equals(scene.get('cards', 'discard', 'a').actions, 'brittle(1)')

        addCardToHand(
            {
                characterUid: pc1,
                uid: 'b',
                explanation: '',

                name: 'Song of Good Health',
                energy: 1,
                id: 'songOfGoodHealth',
                targetNum: 1,
                targetType: 'friends',
                actions: `brittle(1)`,
                type: 'utility',
                characterClass: 'bard',
            },
            scene
        )
        playCard({ cardUid: 'b', targetUids: [npc1], game })

        equals(!!scene.get('cards', 'removedRun', 'b'), true)
        equals(!!scene.get('cards', 'discard', 'b'), false)
    },
    // addStrength() { },
    // addWisdom() {},
    chain() {
        const scene = freshBattleScene()
        interpretCommand({
            command: makeCmd(pc1, 'chain(addEnergy(2),addEnergy(2))', 'self'),
            scene,
            targetUids: [pc1],
        })
        equals(scene.get('energy'), 3 + 2 + 2)
    },
    // choice() {},
    deal() {
        const scene = freshBattleScene()
        interpretCommand({
            command: makeCmd(pc1, 'deal(strength)', 'enemies'),
            scene,
            targetUids: [npc1],
        })
        equals(
            scene.get('allCharacters', npc1, 'health'),
            originalScene.allCharacters[npc1].health -
                originalScene.allCharacters[pc1].strength
        )
    },
    heal() {
        const scene = freshBattleScene()
        interpretCommand({
            command: makeCmd(npc1, 'deal(10)', 'friends'),
            scene,
            targetUids: [pc1],
        })
        interpretCommand({
            command: makeCmd(pc1, 'heal(5)', 'friends'),
            scene,
            targetUids: [pc1],
        })
        equals(
            scene.get('allCharacters', pc1, 'health'),
            originalScene.allCharacters[pc1].health - 5
        )
        interpretCommand({
            command: makeCmd(pc1, 'heal(999)', 'friends'),
            scene,
            targetUids: [pc1],
        })
        equals(
            scene.get('allCharacters', pc1, 'health'),
            originalScene.allCharacters[pc1].constitution
        )
    },
    // effect() {},
    ifDamageDealt() {
        const scene = freshBattleScene()
        interpretCommand({
            command: makeCmd(pc1, 'ifDamageDealt(deal(0), deal(10))'),
            scene,
            targetUids: [npc1],
        })
        interpretCommand({
            command: makeCmd(pc1, 'ifDamageDealt(deal(1), deal(10))'),
            scene,
            targetUids: [npc2],
        })
        equals(
            scene.get('allCharacters', npc1, 'health'),
            originalScene.allCharacters[npc1].health
        )
        equals(
            scene.get('allCharacters', npc2, 'health'),
            originalScene.allCharacters[npc2].health - (1 + 10)
        )
        // ifDamageDealt(deal(strength/2)
    },
    ifFirstPlay() {
        const scene = freshBattleScene()
        const card: Card = makeCard(pc1, 'ifFirstPlay(deal(1))')
        scene.set(['cards', 'hand', card.uid], card)
        play({ card, scene, targetUids: [npc1] })
        play({ card, scene, targetUids: [npc1] })
        equals(
            scene.get('allCharacters', npc1, 'health'),
            originalScene.allCharacters[npc1].health - 1
        )
    },
    setStance() {
        const scene = freshBattleScene()
        scene
            .select('allCharacters', pc1)
            .merge({ stance: 'avoidant', hasMoved: true })
        // should not give block to pc1
        interpretCommand({
            command: makeCmd(pc1, 'setStance("aggressive")', 'self'),
            scene,
            targetUids: [pc1],
        })
        truthy(
            scene.get('allCharacters', pc1, 'stance') === 'aggressive',
            'stance not set'
        )
        truthy(
            scene.get('allCharacters', pc1, 'hasMoved') === true,
            'hasMoved should stay true'
        )
    },
    smite() {
        const scene = freshBattleScene()
        scene.select('allCharacters', pc1).merge({ magic: 0, block: 0 })
        // should not give block to pc1
        interpretCommand({
            command: makeCmd(pc1, 'smite()'),
            scene,
            targetUids: [npc1],
        })
        scene.select('allCharacters', pc2).merge({ magic: 1000, block: 0 })
        // should give block to pc2
        interpretCommand({
            command: makeCmd(pc2, 'smite()'),
            scene,
            targetUids: [npc2],
        })
        truthy(scene.get('allCharacters', pc1, 'block') <= 0)
        truthy(scene.get('allCharacters', pc2, 'block') > 0)
    },
    killIf() {
        const scene = freshBattleScene()
        interpretCommand({
            command: makeCmd(pc1, 'killIf(health < 0)'),
            scene,
            targetUids: [pc1],
        })
        interpretCommand({
            command: makeCmd(pc1, 'killIf(health < 1000)'),
            scene,
            targetUids: [pc2],
        })
        truthy(scene.get('allCharacters', pc1, 'health') > 0)
        truthy(scene.get('allCharacters', pc2, 'health') <= 0)
    },
    momentary() {
        const scene = freshBattleScene()
        const card: Card = makeCard(pc1, 'chain(addEnergy(2), momentary())')
        scene.set(['cards', 'hand', card.uid], card)
        truthy(scene.select('cards', 'hand').get(card.uid) != null)
        play({ card, scene, targetUids: [] })
        truthy(scene.select('cards', 'hand').get(card.uid) == null)
        truthy(scene.select('cards', 'discard').get(card.uid) == null)
    },
    // orb() {},
    // queue() {},
    // text() {},
} as const

const explainSuite = {
    scatterBrained() {
        const scene = freshBattleScene()
        const cmd = makeCmd(pc1, 'chain(draw(3), discard(2))')
        const explanation = explainCommand(cmd, scene)
        truthy(typeof explanation === 'string')
    },
    mantraOfPatience() {
        const scene = freshBattleScene()
        const cmd = makeCmd(pc1, 'chain(queue(1, addEnergy(2)), momentary())')
        const explanation = explainCommand(cmd, scene)
        truthy(typeof explanation === 'string')
    },
}

export const suites = {
    interpretCommandSuite,
    //  effectsSuite,
    explainSuite,
} as const

function uid() {
    return Math.random().toString(36).slice(2)
}

function makeCard(
    owner: CharacterUid,
    actions: string,
    targetType: TargetType = 'enemies',
    targetNum = 1,
    id = uid()
): Card {
    return {
        // @ts-expect-error
        id,
        name: uid(),
        actions: actions,
        characterClass: 'knight',
        characterUid: owner,
        targetType: targetType,
        targetNum: targetNum,
        energy: 0,
        explanation: '',
        type: 'attack',
        uid: uid(),
    }
}

export function makeCmd(
    owner: CharacterUid,
    actions: string,
    targetType: TargetType = 'enemies',
    targetNum = 1
): Command {
    return {
        id: 'unknown',
        characterUid: owner,
        actions: actions,
        targetNum: targetNum,
        targetType: targetType,
        name: '',
    }
}

function addCardToHand(card: Card, scene: BattleCursor) {
    scene.select('cards', 'hand').set(card.uid, card)
}

function freshGame() {
    return new SBaobab(exampleBattleScene).select()
}

function freshBattleScene(game?: SCursor<GameState>) {
    const scene = getBattleSceneIn(game ?? freshGame())
    return scene
}

export function freshGameAndBattleScene() {
    const game = freshGame()
    const scene = freshBattleScene(game)
    return { game, scene }
}
