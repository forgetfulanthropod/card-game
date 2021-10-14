import type { PixiContainer, PixiSprite} from './mypixi';
import { PngLayersBackground, VideoBackground } from './mypixi'

export default ({ scale, src, srcs }: { scale: number, src?: string, srcs?: string[] }): PixiSprite | PixiContainer => {
    if (src != null) {
        return VideoBackground({
            name: 'Background',
            src,
            scale
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
