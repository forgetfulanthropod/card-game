import { collectData } from '@/analytics/collectData'
import { Adjust, Container, PixiContainer, Text } from '@/elementsUtil'
import { KawaseBlurFilter } from 'pixi-filters'
import { SpineBackground } from '../background'

export function EventScene(): PixiContainer {
    collectData('ui_ux_view', { page_title: 'Event Scene' })

    return Container(
        {},
        Adjust(
            SpineBackground({
                srcs: ['hooligansBluffBg1_0', 'hooligansBluffBg1_1'],
            }),
            {
                filters: [new KawaseBlurFilter(0.5)],
            }
        ),
        Text({
            text: 'event',
        })
    )
}
