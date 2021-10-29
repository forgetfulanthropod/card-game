import type { PixiContainer, PixiSprite } from './mypixi'
import { Container, PngLayersBackground, VideoBackground } from './mypixi'

const config = {
    enableBackground: true,
}

export default function Background({ scale, src, srcs }: { scale: number, src?: string, srcs?: string[] }): PixiSprite | PixiContainer {
    if (!config.enableBackground) {
        return Container({ children: [] })
    }
    if (src != null) {
        return VideoBackground({
            name: 'Background',
            src,
            scale,
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
