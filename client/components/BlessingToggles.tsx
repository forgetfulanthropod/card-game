import { Fragment, h, JSX } from 'preact' // eslint-disable-line

import { getTree } from '@/data/rootTree'

import { useCursor } from './util'
import type { BlessingName } from '@shared'
import { toggleBlessing } from '@/actions'

// @ts-expect-error
import styled from 'styled-components'

const Root = styled.div`
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    pointer-events: auto;
    span {
        margin-right: 10px;
    }
`

export function BlessingToggles(): JSX.Element {
    const A: BlessingName[] = [
        'ptbotflax',
        'strongPcs',
        'strongEnemies',
        'weakEnemies',
        'weakPcs',
    ]
    const blessings = useCursor(getTree().select('blessings'))
    return (
        <Root>
            {A.map(b => {
                const has = blessings.find(bl => bl.name === b) != null
                return (
                    <span
                        onClick={() => {
                            // alert('you clicked')
                            void toggleBlessing({ name: b })
                        }}
                        key={b}
                    >
                        {has ? '✔️' : '☐'} {b}
                    </span>
                )
            })}
        </Root>
    )
}
