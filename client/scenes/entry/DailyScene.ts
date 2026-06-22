import { PixiContainer, Container, Text, fontMap } from '@/elementsUtil'
import { collectData } from '@/analytics/collectData'

/**
 * DailyScene - ONLY MODE without character selection UI.
 * // NO CHARACTER SELECTION – ONLY MODE
 * Auto-loads pre-determined team via daily seed + prepareRun path.
 * Does not render the full DungeonEntryScene selection components.
 * Exported as class so bind can safely do `new` if ever dispatched (but daily should go straight to battle).
 */
export class DailyScene extends (require('@/elementsUtil').PixiContainer || Object) {
    constructor() {
        super()
        // NO CHARACTER SELECTION – ONLY MODE
        collectData('ui_ux_view', { page_title: 'Daily Quick' })

        try {
            const label = Text({
                text: 'DAILY (NO CHARACTER SELECTION – ONLY MODE)',
                style: { fontFamily: fontMap.sansFont[0], fontSize: 24, fill: 0xffffff },
            })
            this.addChild(label)
        } catch {}
        this.name = 'DailyScene'
    }
}

// Back-compat function form
export function createDailyScene(): PixiContainer {
    return new DailyScene()
}
