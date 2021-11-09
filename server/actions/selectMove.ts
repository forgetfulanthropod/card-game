import type { SelectMove } from '@shared'

import { commit, getBattleScene } from '@/util'

export const selectMove: SelectMove = args => {
    const scene = getBattleScene('alice')
    scene.set('selectedMove', args.move)
    commit(scene)
}
