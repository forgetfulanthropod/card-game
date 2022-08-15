export {}

// work in progress

// import { Texture } from 'pixi.js'
// import type { CardGroup } from '@/data'
// import { localTree } from '@/data'
// import { BASE_HEIGHT, BASE_WIDTH, Container, If, Sprite } from '@/elementsUtil'
// import { toDatum } from '@/util'

// export function DeckView() {
//     const cardsCursor = localTree.select('cardGroupsInView')

//     return If(
//         toDatum(cardsCursor, c => c.length),
//         () =>
//             Container(
//                 {},
//                 SemitransparentDarkOverlay(),
//                 ScrollableCardOverlay(cardsCursor.get())
//             )
//     )
// }

// export function SemitransparentDarkOverlay() {
//     return Sprite({
//         src: Texture.WHITE,
//         tint: 0,
//         alpha: 0.6,
//         width: BASE_WIDTH,
//         height: BASE_HEIGHT,
//     })
// }

// function ScrollableCardOverlay(cardGroups: CardGroup[]) {
//     return cardGroups.map(group => )
// }
