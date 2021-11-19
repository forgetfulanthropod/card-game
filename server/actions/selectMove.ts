import type { SelectMove } from '@serverActions'

import { getBattleScene } from '@/util'

export const selectMove: SelectMove = args => {
    const scene = getBattleScene(args.username)
    scene.set('selectedMove', args.move)
}
