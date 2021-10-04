import type { h, JSX } from 'preact'
import { moveTypeMetaMap } from '../util/constants'
import { EnemyHoverDiv, PCHoverDiv } from './Styles'
import Table from './Table'



export function Hover(props: { characterMeta: CharacterMeta }): JSX.Element {
    const cm = props.characterMeta
    const moveAt = (i: number) => `${cm.moves[i].name} ${moveTypeMetaMap[cm.moves[i].type].multiplier * cm.damage | 0}`
    return <>{cm.isPc ?
        <PCHoverDiv>
            stance: {cm.stance}
        </PCHoverDiv> :
        <EnemyHoverDiv>
            <Table
                header={cm.type}
                rows={[[`LVL ${cm.level}`, moveAt(0)],
                [`HP ${cm.health}`, moveAt(1)],
                [`ATK ${cm.damage}`, moveAt(2)]]} />
        </EnemyHoverDiv>}
    </>
}
