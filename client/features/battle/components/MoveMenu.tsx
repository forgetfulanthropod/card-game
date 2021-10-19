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
        const x = selectedMove.get()
        if (x == null) { return }
        setSm(x)
    })

    const selectedCharacter = scene.select('selectedCharacter')
    const allCharacters = scene.select('allCharacters')

    const movesOf = (charId: string) => allCharacters.select(charId).select('moves').get()
    const [mvs, setMvs] = useState(movesOf(selectedCharacter.get()))
    selectedCharacter.on('update', () => {
        const sc = selectedCharacter.get()
        // tl('moves list change to ' + JSON.stringify(moves.get()));
        if (sc == null) { setMvs([]); return }
        const newMoves = movesOf(sc)
        setMvs(newMoves)
        dispatch({ a: 'setSelectedMove', m: newMoves[0] })
    })

    return <MoveMenuDiv>
        {mvs.map(m => <MoveButton
            key={m.types[0]}
            onClick={() => dispatch({ a: 'setSelectedMove', m: m })}
            isSelected={sm.name === m.name}
        >
            {m.name}
        </MoveButton>
        )}
    </MoveMenuDiv>
}
