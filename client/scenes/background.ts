import type { Datum } from 'datums'

import {
    AssetKey,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    PixiContainer,
    PlayablePixiSprite,
    Spine,
    SpineAsset,
} from '@/elementsUtil'
import { PngLayersBackground, VideoBackground } from '@/elementsUtil'

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
    srcs?: AssetKey[]
    autoPlay?: boolean
    bgLoopEnded?: Datum<number>
}): PlayablePixiSprite | PixiContainer | null {
    if (!config.enableBackground) {
        return null
    }
    if (src != null) {
        return VideoBackground({
            name: Background.name,
            src,
            scale,
            autoPlay,
            bgLoopEnded,
        })
    }

    if (srcs != null) {
        return PngLayersBackground({
            name: Background.name,
            srcs,
            scale,
        })
    }

    throw new Error('must have src or srcs')
}

export function SpineBackground({ srcs }: { srcs: SpineAsset[] }) {
    return Container(
        {},
        ...srcs.map(src => {
            return Spine({
                name: src,
                animation: 'animation',
                x: BASE_WIDTH / 2,
                y: BASE_HEIGHT,
            })
        })
    )
}
