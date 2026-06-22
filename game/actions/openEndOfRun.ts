import type { GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'

export const openEndOfRun: GameActions['openEndOfRun'] = args => {
    const scene = getBattleSceneIn(args.game)
    scene.set('endScreenHasOpened', true)

    // Post-battle / post-PvP Gems hook for economy (stub)
    const ev = args.game.select('events')
    const cur = (ev.get('gems') as number) || 50
    ev.set('gems', cur + 25) // award gems on run end (PVE/PVP)
    console.log('[economy] awarded 25 gems post-battle')
    return
}
