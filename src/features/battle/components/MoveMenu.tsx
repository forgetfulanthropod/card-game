import { Action } from '../../../data/battle/dispatch'
import preact, { h, JSX } from 'preact'
import { MoveButton, MoveMenuDiv } from './Styles'

function MoveMenu(props: { character: CharacterMeta; dispatch: (a: Action) => void; selectedMove: string | undefined }): JSX.Element {
    return <MoveMenuDiv>
        {props.character.moves.map(m => <MoveButton
            key={m.type}
            onClick={() => props.dispatch({ a: 'setSelectedMove', m: m })}
            isSelected={props.selectedMove === m.type}
        >
            {m.name}
        </MoveButton>
        )}
    </MoveMenuDiv>
}
