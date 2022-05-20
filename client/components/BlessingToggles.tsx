import type { BlessingName } from 'shared'

import { useCursor } from './util'
import { callApi } from '@/actions'
import { styled } from '@/config'
import { getTree } from '@/data'

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

export function BlessingToggles(): JSXElement {
    const A: BlessingName[] = [
        'ptbotflax',
        'strongPcs',
        'strongEnemies',
        'weakEnemies',
        'weakPcs',
    ]
    const blessings = useCursor(getTree().select('blessings'))
    return <Root>
        {A.map(b => {
            const has = blessings.find(bl => bl.name === b) != null
            return <span
                onClick={() => {
                    // alert('you clicked')
                    void callApi('ToggleBlessing', { name: b })
                }}
                key={b}
            >
                {has ? '✔️' : '☐'} {b}
            </span>
        })}
    </Root>
}
