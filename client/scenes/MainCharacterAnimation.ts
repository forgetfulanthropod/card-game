import type { CharacterMeta } from 'shared'
import { getValidSpineAssetName } from '@/scenes'
import { hoveredCharacterUid } from '@/util'
import type { PixiSpine } from '@/elementsUtil'
import { Spine } from '@/elementsUtil'

export function MainCharacterAnimation(
    characterMeta: Pick<CharacterMeta, 'name' | 'isPc' | 'uid'>,
    onClick?: () => void
): PixiSpine | null {
    const spineAssetName = getValidSpineAssetName(characterMeta.name)

    if (!spineAssetName) return null

    const mainAnimation = Spine({
        name: spineAssetName,
        animation: 'Idle',
        events: onClick
            ? {
                  pointerup: onClick,
                  pointerover: () => {
                      hoveredCharacterUid.set(characterMeta.uid)
                  },
                  pointerout: () => {
                      hoveredCharacterUid.set(null)
                  },
              }
            : undefined,
    })

    const desiredHeight = 260 // TODO: what is it tho
    const desiredScale = desiredHeight / mainAnimation.height
    mainAnimation.scale.set(
        (characterMeta.isPc ? 1 : -1) * desiredScale,
        desiredScale
    )

    mainAnimation.x += ((characterMeta.isPc ? 1 : -1) * mainAnimation.width) / 4

    mainAnimation.y -= 20

    return mainAnimation
}
