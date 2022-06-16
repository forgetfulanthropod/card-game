import type { CharacterMeta, CharacterUid } from 'shared'
import { getValidSpineAssetName } from '@/assets'
import { hoveredCharacterUid } from '@/util'
import type { InteractionEvents, PixiSpine } from '@/elementsUtil'
import { glowFilter, Spine } from '@/elementsUtil'

export function MainCharacterAnimation({
    characterMeta,
    events,
    height = 190,
    centerX = false,
}: {
    characterMeta: Pick<CharacterMeta, 'name' | 'isPc' | 'uid'>
    // characterMeta: CharacterMeta
    events?: InteractionEvents
    height?: number
    centerX?: boolean
}): PixiSpine | null {
    const spineAssetName = getValidSpineAssetName(characterMeta.name)

    if (!spineAssetName) return null

    const root = Spine({
        name: spineAssetName,
        animation: 'Idle',
        events: {
            pointerover() {
                hoveredCharacterUid.set(characterMeta.uid)
            },
            pointerout() {
                hoveredCharacterUid.set(null)
            },
            ...(events ?? {}),
        },
        onDestroy: [hoveredCharacterUid.onChange(updateGlow)],
    })

    const heightOverrides = {
        matchaGelatinCube: 15 / 19,
    }

    //@ts-expect-error
    const desiredHeight = (heightOverrides?.[characterMeta.name] ?? 1) * height // TODO: what is it tho
    const desiredScale = desiredHeight / root.height
    root.scale.set((characterMeta.isPc ? 1 : -1) * desiredScale, desiredScale)

    // console.log({ rootWidth: root.width })

    if (centerX) root.x += ((characterMeta.isPc ? 1 : -1) * root.width) / 4

    root.y -= 20

    return root

    // return Container({
    //     children: [root, CharacterInfo(characterMeta)],
    // })

    function updateGlow(hoveredCharacterUid: CharacterUid | null) {
        if (root == null) return
        if (hoveredCharacterUid === characterMeta.uid) {
            root.filters = [glowFilter]
        } else {
            root.filters = null
        }
    }
}
