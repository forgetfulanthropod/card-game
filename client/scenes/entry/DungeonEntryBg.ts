import { Container } from '@/elementsUtil'
import { Background } from '@/scenes'
import { hoveredCharacterUid } from '@/util'

export function DungeonEntryBg() {
    const root = Container(
        {
            events: {
                pointerdown() {
                    hoveredCharacterUid.set(null)
                },
            },
            defaultCursor: true,
        },
        Background({ scale: 1, srcs: ['skelepitEntrySceneBackground'] })
    )
    return root
}
