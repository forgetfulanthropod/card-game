import type { JSX } from 'preact'
import { useState } from 'preact/hooks'

import { dispatch } from '@/actions'
import { getBattleScene } from '@/data/rootTree'

import { MoveButton, MoveMenuDiv } from './Styles'


export default function MoveMenu(): JSX.Element {
    const scene = getBattleScene()
    const selectedMove = scene.select('selectedMove')

    const [sm, setSm] = useState(selectedMove.get())
    selectedMove.on('update', () => {
        // tl('selected move change');
        setSm(selectedMove.get())
    })

    const selectedCharacter = scene.select('selectedCharacter')
    const allCharacters = scene.select('allCharacters')

    const movesOf = (charId: string) => allCharacters.select(charId).select('moves').get()
    const [mvs, setMvs] = useState(movesOf(selectedCharacter.get()))
    selectedCharacter.on('update', () => {
        // tl('moves list change to ' + JSON.stringify(moves.get()));
        const newMoves = movesOf(selectedCharacter.get())
        setMvs(newMoves)
        dispatch({ a: 'setSelectedMove', m: newMoves[0] })
    })

    return <MoveMenuDiv>
        {mvs.map(m => <MoveButton
            key={m.types[0]}
            onClick={() => dispatch({ a: 'setSelectedMove', m: m })}
            isSelected={sm.name === m.name}
        >
            {m.name} ({m.types.toString()})
        </MoveButton>
        )}
    </MoveMenuDiv>
}
