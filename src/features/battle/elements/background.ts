import CaveVideo from '../assets/cave_main_1.webm'
import { PixiSprite, VideoBackground } from './mypixi'

export default ({ scale }: { scale: number }): PixiSprite => VideoBackground({
    name: 'CaveVideo',
    src: CaveVideo,
    scale
})
