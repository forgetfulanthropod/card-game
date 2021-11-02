import { Fragment, h, JSX } from 'preact' // eslint-disable-line

import { getTree } from '@/data/rootTree'

import { useCursor } from './util'


export function BlessingsToggles(): JSX.Element {
    const A = ['amulet', 'charm']
    const blessings = useCursor(getTree().select('blessings'))
    return <div>
        {A.map(b => <span key={b}>{b} {blessings.find(bl => bl.name === b) ? '✔️' : '☐'}</span>)}
    </div>
}
