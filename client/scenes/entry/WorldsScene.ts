import { DungeonEntryScene } from './DungeonEntryScene'
import { Container, Text, fontMap } from '@/elementsUtil'
import { collectData } from '@/analytics/collectData'

/**
 * WorldsScene MUST extend DungeonEntryScene (MANDATED).
 * Base World uses exact main rulebook.
 * This is the foundation for Worlds entry + character/team selection + per-world rulebooks.
 */
export class WorldsScene extends DungeonEntryScene {
    constructor() {
        super()
        // Worlds specific: tag + collect + possible world selector (stub)
        this.name = 'WorldsScene'
        collectData('ui_ux_view', { page_title: 'Worlds Entry' })

        // Add a small worlds header indicator (non-intrusive to base selection UI)
        try {
            const label = Text({
                text: 'WORLDS (extends DungeonEntryScene)',
                style: { fontFamily: fontMap.sansFont[0], fontSize: 18, fill: 0x88ffaa },
            })
            label.position.set(20, 20)
            this.addChild(label)
        } catch {}
    }
}
