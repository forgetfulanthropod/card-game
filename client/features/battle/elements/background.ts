import type { PixiContainer, PlayablePixiSprite } from '@/elementsUtil'
import { Container, PngLayersBackground, VideoBackground } from '@/elementsUtil'

const config = {
    enableBackground: true,
}

export default function Background({
    scale,
    src,
    srcs,
    autoPlay: autoplay,
}: {
    scale: number
    src?: string
    srcs?: string[]
    autoPlay?: boolean
}): PlayablePixiSprite | PixiContainer {
    if (!config.enableBackground) {
        return Container({ children: [] })
    }
    if (src != null) {
        return VideoBackground({
            name: 'Background',
            src,
            scale,
            autoPlay: autoplay,
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
