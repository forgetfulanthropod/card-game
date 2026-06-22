import { PixiContainer, Container, Text, fontMap } from '@/elementsUtil'
import { collectData } from '@/analytics/collectData'

/**
 * DailyScene - ONLY MODE without character selection UI.
 * // NO CHARACTER SELECTION – ONLY MODE
 * Auto-loads pre-determined team via daily seed + prepareRun path.
 * Does not render the full DungeonEntryScene selection components.
 */
export function DailyScene(): PixiContainer {
    // NO CHARACTER SELECTION – ONLY MODE
    collectData('ui_ux_view', { page_title: 'Daily Quick' })

    // Minimal container (daily path typically bypasses to battle via auto in prepare/after)
    const root = Container(
        {
            name: 'DailyScene',
        },
        Text({
            text: 'DAILY (NO CHARACTER SELECTION – ONLY MODE)',
            style: { fontFamily: fontMap.sansFont[0], fontSize: 24, fill: 0xffffff },
        })
    )
    return root
}
