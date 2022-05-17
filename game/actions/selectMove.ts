import type { ServerActions } from '@serverActions'

import { getBattleScene } from '@/util'

export const selectMove: ServerActions['SelectMove'] = args => {
    const scene = getBattleScene(args.username)
    scene.set('selectedMove', args.move)
}
