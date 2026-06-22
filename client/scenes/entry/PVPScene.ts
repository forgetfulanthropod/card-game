import { DungeonEntryScene } from './DungeonEntryScene'
import { Container, Text, fontMap } from '@/elementsUtil'
import { collectData } from '@/analytics/collectData'
import { startQuickMatchPVP } from './QuickMatch'

/**
 * PVPScene MUST extend DungeonEntryScene (MANDATED).
 * Uses shared battle actions + auto strongest team for QuickMatch.
 * Foundation for PVP entry, character/team selection.
 */
export class PVPScene extends DungeonEntryScene {
    constructor() {
        super()
        this.name = 'PVPScene'
        collectData('ui_ux_view', { page_title: 'PVP Entry' })

        try {
            const label = Text({
                text: 'PVP ARENA (extends DungeonEntryScene)',
                style: { fontFamily: fontMap.sansFont[0], fontSize: 18, fill: 0xffaa88 },
            })
            label.position.set(20, 20)
            this.addChild(label)
        } catch {}

        // Auto strongest team QuickMatch (wired): call on entry for PVP
        try {
            const { autoSelectStrongestForPVP, startQuickMatchPVP } = require('./QuickMatch')
            ;(this as any).__autoStrongest = autoSelectStrongestForPVP
            // For bot/quick path, kick off
            void startQuickMatchPVP().catch(() => {})
        } catch {}
    }
}
