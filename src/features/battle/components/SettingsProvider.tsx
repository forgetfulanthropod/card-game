import produce from 'immer'
import type { WritableDraft } from 'immer/dist/internal'
import React, { createContext, useContext, useMemo, useState } from 'react'
import type { CharacterAssetKey } from '../components/AssetLoader'
// TODO:

export function SettingsProvider(props: { children: Children }): JSX.Element {
    const [state, setState] = useState(initialState)
    const callbacks = useMemo(() => {
        const update = (mutate: (d: WritableDraft<State>) => void) => setState(produce(mutate))
        const cbs: Callbacks = {
            toggleHealthType() {
                update(d => {
                    d.health = nextOf(['bars', 'number', 'both'], d.health)
                })
            },
            toggleHasMoved() {
                update(d => {
                    d.hasMoved = d.hasMoved === 'checkmark' ? 'grey' : 'checkmark'
                })
            },
            toggleOpponentType() {
                update(d => {
                    const opponents: CharacterAssetKey[] = ['notoriousBEAN', 'orcWarrior', 'warhog']
                    const i = opponents.indexOf(d.npcCharacters[0].assetId)
                    const o = opponents[(i + 1) % opponents.length]
                    d.npcCharacters.forEach(d => d.assetId = o)
                })
            },
            setPcCharacters(v: Characters) { update(d => { d.pcCharacters = v }) },
            setNpcCharacters(v: Characters) { update(d => { d.npcCharacters = v }) },
        }
        return cbs
    }, [])

    return <settingsContext.Provider
        value={{ ...state, ...callbacks }}>
        {props.children}
    </settingsContext.Provider>
}

export function useSettingsContext(): Value {
    return useContext(settingsContext)
}


type Health = 'bars' | 'number' | 'both'
type HasMoved = 'checkmark' | 'grey'
type Characters = { shown: boolean, assetId: CharacterAssetKey }[]
const initialState = {
    health: 'both' as Health,
    hasMoved: 'checkmark' as HasMoved,
    pcCharacters: [
        { shown: true, assetId: 'frogknight' },
        { shown: true, assetId: 'frogknight' },
        { shown: true, assetId: 'frogknight' },
        { shown: true, assetId: 'frogknight' },
        { shown: true, assetId: 'frogknight' },
        { shown: true, assetId: 'frogknight' },
    ] as Characters,
    npcCharacters: [
        { shown: true, assetId: 'skeleton' },
        { shown: true, assetId: 'skeleton' },
        { shown: true, assetId: 'skeleton' },
        { shown: true, assetId: 'skeleton' },
        { shown: true, assetId: 'skeleton' },
        { shown: true, assetId: 'skeleton' },
    ] as Characters
}

type State = typeof initialState

interface Callbacks {
    toggleHealthType(): void
    toggleHasMoved(): void
    toggleOpponentType(): void
    setPcCharacters(v: Characters): void
    setNpcCharacters(v: Characters): void
}
interface Value extends Callbacks, State { }
export const settingsContext = createContext<Value>(null as unknown as Value)

function nextOf<T>(array: T[], item: T): T {
    const i = array.indexOf(item)
    return array[(i + 1) % array.length]
}
