import { h, JSX } from 'preact'
//@ts-ignore
import styled from 'styled-components'
import { characterAssetKeys } from '../logic/AssetLoader'
import { useSettingsContext } from './SettingsProvider'


export default function ArtistMenu(): JSX.Element {
    // const [x, setX] = useState<string | null>(null)
    const stuff = useSettingsContext()
    return <Dropdown
        top={'Menu'}
        rest={<>
            <Row onClick={() => stuff.toggleHasMoved()}>Toggle hasMoved indicator</Row>
            <Row onClick={() => stuff.toggleHealthType()}>Toggle health indicator</Row>
            <Row onClick={() => stuff.toggleOpponentType()}>Toggle opponent</Row>
            <ChooseCharacters type="PC" />
            {/* <Dropdown
                top={'letter'}
                rest={<Radio choices={['a', 'b', 'c']} choice={x} setChoice={setX} />}
            /> */}
        </>
        }
    />
}

function Dropdown(props: { top: JSX.Element | string, rest: Children }): JSX.Element {
    return <DropdownDiv>
        <div className="top">{props.top}</div>
        <div className="dropdown">
            {props.rest}
        </div>
    </DropdownDiv>
}

const DropdownDiv = styled.div`
    position: absolute;
    /* top: 5%;
    right: 5%; */
    font-size: 2vw;
    border-radius: 5%;
    background-color: darkgreen;
    color: white;
    .top {
        padding: 1vw;
    }
    .dropdown {
        display: none;
    }
    &:hover > .dropdown {
        display: block;
    }
`

const Row = styled.div`
    max-width: 100%;
    padding: 1vw;
    background-color: #008e00;
    :hover {
        background-color: #00b600;
    }
`

function Radio(props: { options: readonly string[], choice: string | null, setChoice: (s: string) => void }): JSX.Element {
    return <div>
        {props.options.map(c =>
            <div key={c}>
                <input
                    type="radio"
                    checked={c === props.choice}
                    onChange={() => props.setChoice(c)}
                />
                {c}
            </div>
        )}
    </div>
}

function ChooseCharacters(props: { type: 'PC' | 'NPC' }): JSX.Element {
    const [choices, setChoices] = useState(Array(6).fill(characterAssetKeys[0]))
    return <Dropdown
        top={`Choose ${props.type}s`}
        rest={choices.map((c, i) =>
            <Radio
                key={i}
                options={characterAssetKeys}
                choice={c}
                setChoice={newChoice => setChoices(produce(cs => { cs[i] = newChoice }))}
            />)}
    />
}
