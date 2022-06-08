// RUN_TESTS=yes esr gameState/battle/cards/interpretCommand.spec.ts
/* eslint-disable no-console */

import { deepStrictEqual as equals, ok as truthy } from 'assert'
import { SBaobab } from 'sbaobab'
import type { Card, CharacterUid, Command, Gamestate, TargetType } from 'shared'
import winston from 'winston'
import { interpretCommand, play } from './cards'
// @ts-ignore
import exampleBattleScene_ from './exampleBattlescene.json'
import { getBattleSceneIn } from '@/util'
const exampleBattleScene = exampleBattleScene_ as unknown as Gamestate
const originalScene = exampleBattleScene_.scene

const pc1 = 'pc-1'
const pc2 = 'pc-2'
const npc1 = 'npc-1'
const npc2 = 'npc-2'

global.logger = winston.createLogger()

const interpretCommandSuite = {
    addBlock() {
        const scene = freshBattleScene()
        interpretCommand({
            command: makeCmd(pc1, 'addBlock(dexterity)', 'self'),
            scene,
            targetUids: [pc1],
        })
        equals(
            scene.get('allCharacters', pc1, 'block'),
            exampleBattleScene_.scene.allCharacters[pc1].dexterity
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
    smite() {
        const scene = freshBattleScene()
        scene.select('allCharacters', pc1).merge({ wisdom: 0, block: 0 })
        // should not give block to pc1
        interpretCommand({
            command: makeCmd(pc1, 'smite()'),
            scene,
            targetUids: [npc1],
        })
        scene.select('allCharacters', pc2).merge({ wisdom: 1000, block: 0 })
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
    momentary() {},
    orb() {},
    queue() {},
    text() {},
} as const

const effectsTest = {
    bleed() {},
    debilitated() {},
    fatigue() {},
    poison() {},
    stunned() {},
    unguarded() {},
    vulnerable() {},
    strongblock() {},
    smallDamageIncrease() {},
} as const

export const suites = {
    interpretCommandSuite,
    //  effectsTest
} as const

function makeCard(
    owner: CharacterUid,
    actions: string,
    targetType: TargetType = 'enemies',
    targetNum = 1
): Card {
    const uid = () => Math.random().toString(36).slice(2)
    return {
        // @ts-expect-error
        id: uid(),
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

function makeCmd(
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

function freshBattleScene() {
    const state = new SBaobab(exampleBattleScene).select()
    const scene = getBattleSceneIn(state)
    return scene
}

function main() {
    console.log('starting tests')
    const suiteRatios: Record<string, string> = {}
    for (const [suiteName, suite] of Object.entries(suites)) {
        console.log(`\n\ntesting suite ${suiteName}`)
        const failed: string[] = []
        for (const [name, test] of Object.entries(suite)) {
            console.log(`\n\ttesting ${name}`)
            try {
                test()
                console.log(`✅ ${name} passed`)
            } catch (e) {
                console.log(`❌ ${name} failed`)
                if (e instanceof Error) {
                    console.log('\t\t', e.message.split('\n').join('\n\t\t'))
                }
                failed.push(name)
            }
        }
        console.log(`finished suite ${suiteName}`)
        const testNames = Object.keys(suite)
        const numTests = testNames.length
        const ratio = `${numTests - failed.length}/${numTests}`
        suiteRatios[suiteName] = ratio
        console.log(`\n${ratio} tests passed`)
        console.log(`failed: ${failed.join(', ')}`)
        console.log(
            `passed: ${testNames
                .filter(name => !failed.includes(name))
                .join(', ')}`
        )
    }
    console.log('\n\nsummary:')
    for (const [name, ratio] of Object.entries(suiteRatios)) {
        console.log(`\t${name}: ${ratio} tests passed`)
    }
}

if (process.env.RUN_TESTS === 'yes') {
    main()
}

/** TODO: iterate through all cards and enemies and make sure they all explain() and execute() ok */
