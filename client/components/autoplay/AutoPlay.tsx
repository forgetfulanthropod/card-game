/** NOT MAINTAINED OR WORKING */
import { sample, values } from 'lodash'
import { useState } from 'react'
import toast from 'react-hot-toast'
import type {
    BattleScene,
    EntryScene,
    GameState,
    OwnedCharacterStats,
} from 'shared'

import { callApi } from '@/callApi'
import { styled } from '@/config'
import { getTree } from '@/data'

const Root = styled.button`
    pointer-events: auto;
    position: absolute;
    bottom: 1%;
    left: 1%;
`

export function AutoPlay(): JSXElement {
    const [running, setRunning] = useState(false)
    const [runner] = useState(() => new Runner())
    return <Root
        onClick={() => {
            setRunning(r => {
                if (r) {
                    runner.stop()
                } else {
                    runner.start()
                }
                return !r
            })
        }}
    >
        {running ? 'Stop' : 'Start'} Autoplay
    </Root>
}

const minWait = 2000
const probChangeLevel = 0.8
class Runner {
    running = false
    lastStep = 0

    constructor() {}

    start() {
        this.running = true
        // console.log('runner started')
        void this.step()
    }

    stop() {
        this.running = false
        // console.log('runner stopped')
    }

    async step() {
        if (Date.now() - this.lastStep < minWait) {
            if (this.running) {
                requestAnimationFrame(() => this.step())
            }
            return
        }
        this.lastStep = Date.now()
        const tree = getTree().get()
        const sceneName = tree.scene.id
        if (sceneName === 'entry') {
            await this.entryStep(tree)
        } else if (sceneName === 'battle') {
            this.battleStep(tree)
        }
        if (this.running) {
            requestAnimationFrame(() => this.step())
        }
    }

    async entryStep(tree: GameState) {
        const scene = tree.scene as EntryScene
        if (
            scene.selectedCharacters.filter(c => c != null).length === 0 &&
            flip(probChangeLevel)
        ) {
            toast('changing dungeon')
            await callApi('changeDungeon', { direction: flip(0.5) ? -1 : 1 })
            return
        }
        const availableChars = getAvailableChars(scene, tree)
        if (availableChars.length > 0) {
            toast('adding another character')
            addNewCharacter(availableChars)
            return
        }
        toast('out of points. starting battle.')
        await callApi('changeScene', { newSceneName: 'battle' })
    }

    battleStep(tree: GameState) {
        const scene = tree.scene as BattleScene
        // const doorOptions = scene.doors.options
        // if (doorOptions.length > 0) {
        //     toast('doors detected. picking random door.')
        //     const door = sample(doorOptions)
        //     if (door == null) {
        //         throw Error('null door')
        //     }
        //     await callApi('nextRoom', { door })
        // }
        if (!scene.isPlayerTurn) {
            toast('not my turn - doing nothing')
            return
        }
        const enemies = values(scene.allCharacters).filter(
            c => !c.isPc && c.health > 0
        )
        if (enemies.length === 0) {
            toast('no enemies to hit -- doing nothing')
            return
        }
        // TODO: pick random unmoved PC
        // TODO: pick random stance
        const enemy = sample(enemies)
        if (enemy == null) {
            throw Error('null enemy')
        }
        toast(`hitting enemy ${enemy.id} (${enemy.uid})`)
    }
}

function addNewCharacter(availableChars: OwnedCharacterStats[]) {
    // console.log(`there are ${availableChars.length} options`)
    if (availableChars.length === 0) {
        throw Error('no chars left')
    }
    const charChoice = sample(availableChars)
    if (charChoice == null) {
        throw Error('null char')
    }
    // await callApi('placeSelectedCharacters', {
    //     character: charChoice,
    //     //TODO: HOW??
    //     index: 0,
    // })
}

function getAvailableChars(scene: EntryScene, tree: GameState) {
    return values(tree.ownedCharacters)

    // const pointsRemaining =
    //     scene.selectedLevel.pointLimit -
    //     sum(scene.selectedCharacters.map(sc => sc.points))
    // const availableChars = values(tree.ownedCharacters).filter(
    //     oc =>
    //         find(scene.selectedCharacters, { tokenId: oc.tokenId }) == null && // not selected
    //         oc.points < pointsRemaining // within point limit
    // )
    // return availableChars
}

function flip(probTrue: number): boolean {
    return Math.random() < probTrue
}
