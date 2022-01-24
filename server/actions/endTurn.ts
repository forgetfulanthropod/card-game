import type { EndTurn } from '@serverActions'

import { getBattleScene } from '@/util'

export const endTurn: EndTurn = args => {
    const scene = getBattleScene(args.username)
    scene.set('energy', 3)
}
