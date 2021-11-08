import { Fragment, h, JSX } from 'preact' // eslint-disable-line
import { useState } from 'preact/hooks'

import { selectMove } from '@/actions'
import { getBattleScene } from '@/data/rootTree'

import { MoveButton, MoveMenuDiv } from './Styles'


export default function MoveMenu(): JSX.Element {
    const scene = getBattleScene()
    const selectedMove = scene.select('selectedMove')

    const [sm, setSm] = useState(selectedMove.get())
    const [isPlayerTurn, setIsPlayerTurn] = useState(scene.select('isPlayerTurn').get())


    scene.select('isPlayerTurn').on('update', () => {
        setIsPlayerTurn(scene.select('isPlayerTurn').get())
    })

    selectedMove.on('update', () => {
        // tl('selected move change');
        // @ ts-expect-error
        // const elapsed = Date.now() - window.startTime
        // console.log(`round trip move change took ${elapsed / 1000} seconds`)
        const x = selectedMove.get()
        if (x == null) { return }
        setSm(x)
    })

    const selectedCharacter = scene.select('selectedCharacter')
    const allCharacters = scene.select('allCharacters')

    const movesOf = (charId: string) => {
        if (allCharacters.get() == null)
            return []

        return allCharacters.select(charId).select('moves').get()
    }
    const [mvs, setMvs] = useState(movesOf(selectedCharacter.get()))

    allCharacters.select(selectedCharacter.get()).select('moves').on('update', updateMoves)
    selectedCharacter.on('update', async (e) => {
        if (e.data.previousData)
            allCharacters.select(e.data.previousData).select('moves').off('update', updateMoves)

        const sc = e.data.currentData
        if (sc == null) return
        allCharacters.select(sc).select('moves').on('update', updateMoves)

        // tl('moves list change to ' + JSON.stringify(moves.get()));
        if (sc == null) { setMvs([]); return }
        const newMoves = movesOf(sc)
        setMvs(newMoves)
        // TODO: server should update the move itself
        await selectMove({ move: newMoves[0] })
    })

    function updateMoves() {
        console.log('updating', selectedCharacter.get())
        setMvs(movesOf(selectedCharacter.get()))
    }

    return <>
        {isPlayerTurn && <MoveMenuDiv>
            {mvs.map(m => <MoveButton
                key={m.types[0]}
                onClick={async () => {
                    // window.startTime = Date.now()
                    await selectMove({ move: m })
                }}
                isSelected={sm.name === m.name}
            >
                {m.name} ({m.types.toString()}) [{m.damageRange?.join('-')}]
            </MoveButton>
            )}
        </MoveMenuDiv>
        }
    </>
}
