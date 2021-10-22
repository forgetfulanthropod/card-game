// import type { JSX } from 'preact'

// import { getRulebook } from '@/data/rootTree'
// import type { CharacterMeta } from '@/data/types'

// import { EnemyHoverDiv, PCHoverDiv } from './Styles'
// import Table from './Table'


// export function Hover(props: { characterMeta: CharacterMeta }): JSX.Element {
//     const cm = props.characterMeta
//     const { moveMetaMap } = getRulebook()
//     const damageOf = (i: number) => {
//         const mod = moveMetaMap[cm.moves[i].types[0]]
//         if (mod.multiplier != null)
//             return mod.multiplier * cm.damage | 0
//         if (mod.multipliers != null)
//             return mod.multipliers.map(mul => mul * cm.damage | 0)
//         if (mod.multiplierRange != null)
//             return mod.multiplierRange.map(mul => mul * cm.damage | 0)
//     }
//     const moveAt = (i: number) => `${cm.moves[i].name} ${damageOf(i)}`
//     return <>{cm.isPc ?
//         <PCHoverDiv>
//             stance: {cm.stance}
//         </PCHoverDiv> :
//         <EnemyHoverDiv>
//             <Table
//                 header={cm.displayName}
//                 rows={[[`LVL ${cm.level}`, moveAt(0)],
//                 [`HP ${cm.health}`, moveAt(1)],
//                 [`ATK ${cm.damage}`, moveAt(2)]]} />
//         </EnemyHoverDiv>}
//     </>
// }

export default null
