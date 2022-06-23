import { Container } from '@/elementsUtil'
import { Background } from '@/scenes'

export function DungeonEntryBg() {
    const root = Container(
        {},
        Background({ scale: 1, srcs: ['skelepitEntrySceneBackground'] })
    )
    return root
}
