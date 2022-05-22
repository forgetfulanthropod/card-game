import type { GameActions } from '@serverActions'

// import { objFilter } from 'shared/code'
// import { resetRound } from './internal/resetRound'
// import { getBattleSceneIn } from '@/util'

export const nextRoom: GameActions['NextRoom'] = args => {
    // const scene = getBattleSceneIn(args.game)
    // const room = modifyRoom(
    //     getRoom({
    //         door: args.door,
    //         dungeonName: scene.get('dungeonName'),
    //         roomsPassed: scene.get('roomsPassed'),
    //         game: args.game,
    //     }),
    //     scene.get('dungeonName')
    // )
    // scene.set('doors', { options: [], descriptions: [] })
    // scene.set('roomsPassed', scene.get('roomsPassed') + 1)
    // scene.apply('allCharacters', ac => ({
    //     ...objFilter(ac, (_, c) => c.isPc),
    //     ...room.enemies,
    // }))
    // scene.set('state', 'in battle')
    // scene.set('nextEnemyCards', getNpcMoves(scene))
    // clearAllEffects(scene)
    // resetTurns(scene)
    // putAllCardsInDrawPile(scene)
    // resetRound(args.game, {})
}
