import { getScene } from 'data/rootTree'
import { h, JSX } from 'preact'
import { useState } from 'preact/hooks'
import dispatch from '../../../data/battle/dispatch'
import { MoveButton, MoveMenuDiv } from './Styles'
const scene = getScene()
const selectedMove = scene.select('selectedMove')
const moves = scene.select('selectedCharacter').select('moves')
export default function MoveMenu(): JSX.Element {
    const [sm, setSm] = useState(selectedMove.get())
    selectedMove.on('update', () => {
        // tl('selected move change');
        setSm(selectedMove.get())
    })
    const [mvs, setMvs] = useState(moves.get())
    moves.on('update', () => {
        // tl('moves list change to ' + JSON.stringify(moves.get()));
        setMvs(moves.get())
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
