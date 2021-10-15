import type { JSX } from 'preact'

import { getRulebook } from '@/data/rootTree'
import type { CharacterMeta } from '@/data/types'

import { EnemyHoverDiv, PCHoverDiv } from './Styles'
import Table from './Table'


export function Hover(props: { characterMeta: CharacterMeta }): JSX.Element {
    const cm = props.characterMeta
    const { moveModiferMap } = getRulebook()
    const moveAt = (i: number) => `${cm.moves[i].name} ${moveModiferMap[cm.moves[i].types[0]].multiplier * cm.damage | 0}`
    return <>{cm.isPc ?
        <PCHoverDiv>
            stance: {cm.stance}
        </PCHoverDiv> :
        <EnemyHoverDiv>
            <Table
                header={cm.displayName}
                rows={[[`LVL ${cm.level}`, moveAt(0)],
                [`HP ${cm.health}`, moveAt(1)],
                [`ATK ${cm.damage}`, moveAt(2)]]} />
        </EnemyHoverDiv>}
    </>
}
