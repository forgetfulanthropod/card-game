import { deepStrictEqual as equals, ok as truthy } from 'assert'
import { interpretCommand } from './cards'
import { applyEffect } from './cards/commands/effect'
import {
    freshGameAndBattleScene,
    makeCmd,
    npc1,
    pc1,
} from './interpretCommand.spec'

export const suites = {
    effects: {
        reflectBuff() {
            testReflect(4, 1)
            testReflect(1, 4)
            testReflect(4, 4)

            function testReflect(count: number, damage: number) {
                const { scene } = freshGameAndBattleScene()

                const npc1HealthBefore = scene.get(
                    'allCharacters',
                    npc1,
                    'health'
                )

                applyEffect(scene, [pc1], 'reflectBuff', count)
                interpretCommand({
                    command: makeCmd(npc1, `deal(${damage})`, 'enemies'),
                    scene,
                    targetUids: [pc1],
                })

                const npc1HealthAfter = scene.get(
                    'allCharacters',
                    npc1,
                    'health'
                )

                truthy(
                    npc1HealthBefore - npc1HealthAfter ===
                        Math.min(count, damage)
                )
            }
        },
    },
}
