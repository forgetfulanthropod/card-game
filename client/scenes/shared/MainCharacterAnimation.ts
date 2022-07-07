import type { CharacterId, CharacterMeta, CharacterUid } from 'shared'
import { getValidSpineAssetName } from '@/assets'
import { hoveredCharacterUid } from '@/util'
import type { InteractionEvents, PixiSpine } from '@/elementsUtil'
import { glowFilter, Spine } from '@/elementsUtil'

export function MainCharacterAnimation({
    characterMeta,
    events = {},
    height = 190,
    centerX = false,
    onSpineEvent,
}: {
    characterMeta: Pick<CharacterMeta, 'id' | 'isPc' | 'uid'>
    // characterMeta: CharacterMeta
    events?: InteractionEvents

    onSpineEvent?: (e: string) => void
    height?: number
    centerX?: boolean
}): PixiSpine | null {
    const spineAssetName = getValidSpineAssetName(characterMeta.id)

    if (!spineAssetName) return null

    const pointerover = () => hoveredCharacterUid.set(characterMeta.uid)
    const pointerout = () => hoveredCharacterUid.set(null)
    const basicEvents = {
        pointerover,
        pointerdown: pointerover,
        pointerout,
        pointerup() {},
        pointermove() {},
    }

    const root = Spine({
        name: spineAssetName,
        animation: 'Idle',
        events: {
            ...basicEvents,
            // pointerup: pointerout,
            ...events, // choosing not to extend base events on override..
            // //@ts-expect-error
            // ...keys(events).reduce((processedEvents, eventKey) => {
            //     processedEvents[eventKey] = e => {
            //         events?.[eventKey]?.(e)
            //         basicEvents[eventKey]()
            //     }

            //     return processedEvents
            // }, {} as InteractionEvents),
        },
        onSpineEvent,
        onDestroy: [hoveredCharacterUid.onChange(updateGlow)],
    })

    updateGlow(hoveredCharacterUid.val)

    const heightOverrides: Partial<Record<CharacterId, number>> = {
        matchaGelatinCube: 0.88,
        frogKnight: 1.4,
        warhog: 0.85,
        jerry: 1.1,
        gnomeHooligan: 1.1,
        skeletonWarrior: 0.75,
    }

    // //@ts-expect-error
    // const desiredHeight = (heightOverrides?.[characterMeta.id] ?? 1) * height // TODO: what is it tho
    // const desiredScale = Math.min(
    //     desiredHeight / root.height,
    //     (desiredHeight * 1.2) / root.width
    // )
    const desiredScale = 0.0826 * (heightOverrides?.[characterMeta.id] ?? 1) // 260/matcha height
    // console.log({ name: characterMeta.id, desiredScale })
    root.scale.set((characterMeta.isPc ? 1 : -1) * desiredScale, desiredScale)

    if (!characterMeta.isPc) {
        root.x -= root.width * 0.36
    }

    // if (centerX) root.x -= ((characterMeta.isPc ? 1 : -1) * root.width) / 2

    return root

    function updateGlow(hoveredCharacterUid: CharacterUid | null) {
        if (root == null) return
        if (hoveredCharacterUid === characterMeta.uid) {
            root.filters = [glowFilter]
        } else {
            root.filters = null
        }
    }
}
