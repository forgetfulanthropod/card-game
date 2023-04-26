export {}
// import { CardAction, CharacterClass } from './battle'

// export type ClassAbility = {
//     name: string
//     on: {
//         blockFriend?: CardAction
//         allThreePlayedCard?: CardAction
//         kill?: CardAction
//     }
// }

// export const classAbilityMap: Partial<Record<CharacterClass, ClassAbility>> = {
//     wizard: {
//         name: 'arcane connection',
//         on: {
//             allThreePlayedCard: `chain(
//                 addEnergy(1),
//                 draw(NUM_OF_CLASS)
//             )`,
//         },
//     },
//     knight: {
//         name: 'valiant',
//         on: {
//             // crit and clear in deal damage
//             blockFriend: 'effect("valiant", 1)',
//         },
//     },
//     rogue: {
//         name: 'an honest living',
//         on: {
//             kill: `addEnergy(1)`,
//         },
//     },
// }
