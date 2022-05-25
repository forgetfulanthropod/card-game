import type { Datum } from 'datums'

import type { PixiContainer, PlayablePixiSprite } from '@/elementsUtil'
import { Container, PngLayersBackground, VideoBackground } from '@/elementsUtil'

const config = {
    enableBackground: true,
}

export function Background({
    scale,
    src,
    srcs,
    autoPlay,
    bgLoopEnded,
}: {
    scale: number
    src?: string
    srcs?: string[]
    autoPlay?: boolean
    bgLoopEnded?: Datum<number>
}): PlayablePixiSprite | PixiContainer {
    if (!config.enableBackground) {
        return Container({ children: [] })
    }
    if (src != null) {
        return VideoBackground({
            name: 'Background',
            src,
            scale,
            autoPlay,
            bgLoopEnded,
        })
    }

    if (srcs != null) {
        return PngLayersBackground({
            name: 'Background',
            srcs,
            scale,
        })
    }

    throw new Error('must have src or srcs')
}
