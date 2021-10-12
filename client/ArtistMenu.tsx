import { statsMap } from '@/data/battle/constants'
import { getBattleScene } from '@/data/rootTree'
import { keys, objFilter, objMap } from '@/util'
import { h, JSX } from 'preact'
import { useState } from 'preact/hooks'
//@ts-ignore
import styled from 'styled-components'
import { characterAssetKeys } from './features/battle/logic/AssetLoader'
export default function ArtistMenu(): JSX.Element {
    // const [x, setX] = useState<string | null>(null)
    // const stuff = useSettingsContext()
    return <div style={{ pointerEvents: 'auto', maxHeight: '100%', overflow: 'scroll' }}>
        <Dropdown
            top={'Menu'}
            rest={<>
                {/*
                <Row onClick={() => stuff.toggleHasMoved()}>Toggle hasMoved indicator</Row>
                <Row onClick={() => stuff.toggleHealthType()}>Toggle health indicator</Row>
                <Row onClick={() => stuff.toggleOpponentType()}>Toggle opponent</Row>
                */}
                <Row>
                    <ChooseCharacters type="PC" />
                </Row>
                <Row>
                    <ChooseCharacters type="NPC" />
                </Row>
            </>
            }
        />
    </div>
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
    font-size: 2vw;
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
    border: 1px solid black;
`

const Row = styled.div`
    max-width: 100vw;
    overflow: scroll;
    padding: 1vw;
    margin: 1vw
    background-color: #008e00;
    :hover {
        background-color: #00b600;
    }
`

function Radio<T extends string>(props: { options: readonly T[], choice: T | null, setChoice: (s: T) => void }): JSX.Element {
    return <div
        style={{
            // overflowWrap: 'break-word'
        }}
    >
        {props.options.map(c =>
            <span
                key={c}
                style={{
                    backgroundColor: c === props.choice ? '#22e822' : '#058e05',
                    padding: '1vw',
                    margin: '1vw',
                    border: '1px solid black',
                    // borderRadius: '5px',
                }}
                onClick={() => props.setChoice(c)}>
                {c}
            </span>
        )}
    </div>
}

/** Assumes equal number PC & NPC! */
function ChooseCharacters(props: { type: 'PC' | 'NPC' }): JSX.Element {
    const battle = getBattleScene()
    const cursor = battle.select('allCharacters')
    const allCharacters = cursor.get()
    const chars = objFilter(allCharacters, (_k, v) => v.isPc === (props.type === 'PC'))
    const [choices, setChoices] = useState(objMap(chars, (_k, v) => v.name))
    return <Dropdown
        top={`Choose ${props.type}s`}
        rest={keys(choices).map(k =>
            <Row key={k}>
                <Radio
                    options={characterAssetKeys}
                    choice={choices[k]}
                    setChoice={(newChoice => {
                        setChoices(cs => ({ ...cs, k: newChoice }))
                        // TODO?: needs to be an API call
                        cursor.apply(k, cm => {
                            const stats = statsMap[newChoice]
                            return { ...cm, ...stats, health: stats.maxHealth }
                        })
                    })}
                />
            </Row>
        )}
    />
}
