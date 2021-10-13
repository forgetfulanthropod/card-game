import { moveModiferMap } from '@/data/battle/constants'
import { CharacterMeta } from '@/data/types'
import type { h, JSX } from 'preact'
import { EnemyHoverDiv, PCHoverDiv } from './Styles'
import Table from './Table'



export function Hover(props: { characterMeta: CharacterMeta }): JSX.Element {
    const cm = props.characterMeta
    const damageOf = (i: number) => {
        const mod = moveModiferMap[cm.moves[i].types[0]]
        if (mod.multiplier != null)
            return mod.multiplier * cm.damage | 0
        if (mod.multipliers != null)
            return mod.multipliers.map(mul => mul * cm.damage | 0)
        if (mod.multiplierRange != null)
            return mod.multiplierRange.map(mul => mul * cm.damage | 0)
    }
    const moveAt = (i: number) => `${cm.moves[i].name} ${damageOf(i)}`
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
