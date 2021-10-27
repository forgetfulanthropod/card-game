import { h, JSX, Fragment } from 'preact' // eslint-disable-line
import { useState } from 'preact/hooks'

import { dispatch } from '@/actions'
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
        // @ts-ignore
        const elapsed = Date.now() - window.startTime
        console.log(`round trip move change took ${elapsed / 1000} seconds`)
        const x = selectedMove.get()
        if (x == null) { return }
        setSm(x)
    })

    const selectedCharacter = scene.select('selectedCharacter')
    const allCharacters = scene.select('allCharacters')

    const movesOf = (charId: string) => allCharacters.select(charId).select('moves').get()
    const [mvs, setMvs] = useState(movesOf(selectedCharacter.get()))
    selectedCharacter.on('update', async () => {
        const sc = selectedCharacter.get()
        // tl('moves list change to ' + JSON.stringify(moves.get()));
        if (sc == null) { setMvs([]); return }
        const newMoves = movesOf(sc)
        setMvs(newMoves)
        await dispatch({ a: 'setSelectedMove', m: newMoves[0] })
    })

    return <>
        {isPlayerTurn && <MoveMenuDiv>
            {mvs.map(m => <MoveButton
                key={m.types[0]}
                onClick={async () => {
                    // @ts-ignore
                    window.startTime = Date.now()
                    await dispatch({ a: 'setSelectedMove', m: m })
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
