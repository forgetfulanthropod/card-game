import { h, JSX } from 'preact'
import { useState } from 'preact/hooks'
//@ts-ignore
import styled from 'styled-components'
import { set } from 'util'
import { CharacterAssetKey, characterAssetKeys } from '../logic/AssetLoader'
import { getScene } from 'data/rootTree'
import { statsMap } from 'data/battle/constants'

const scene = getScene()

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
                <Row><ChooseCharacters type="PC" /></Row>
                <Row><ChooseCharacters type="NPC" /></Row>
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
    // position: absolute;
    /* top: 5%;
    right: 5%; */
    font-size: 2vw;
    // border-radius: 5%;
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
    // max-width: 100%;
    padding: 1vw;
    background-color: #008e00;
    :hover {
        background-color: #00b600;
    }
`

function Radio<T extends string>(props: { options: readonly T[], choice: T | null, setChoice: (s: T) => void }): JSX.Element {
    return <div style={{ overflowWrap: 'break-word', width: '80vw' }}>
        {props.options.map(c =>
            <span
                key={c}
                style={{
                    backgroundColor: c === props.choice ? '#22e822' : '#058e05',
                    padding: '5px',
                    margin: '5px',
                    border: '1px solid black',
                    // borderRadius: '5px',
                }}
                onClick={() => props.setChoice(c)}>
                {c}
            </span>
        )}
    </div>
}

function ChooseCharacters(props: { type: 'PC' | 'NPC' }): JSX.Element {
    const cursor = scene.select('allCharacters')
    const allCharacters = cursor.get()
    const offset = props.type === 'NPC' ? 0 : 6
    const [choices, setChoices] = useState<CharacterAssetKey[]>(Array(6).fill(null).map((_, i) => allCharacters[i + offset].assetId))
    return <Dropdown
        top={`Choose ${props.type}s`}
        rest={choices.map((c, i) =>
            <Radio
                key={i}
                options={characterAssetKeys}
                choice={c}
                setChoice={(newChoice => {
                    setChoices(cs => set(cs, i, newChoice))
                    // TODO
                    cursor.apply(i + offset, cm => {
                        const stats = statsMap[newChoice]
                        return { ...cm, ...stats, health: stats.maxHealth }
                    })
                })}
            />)}
    />
}
