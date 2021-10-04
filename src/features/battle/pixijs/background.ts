import CaveVideo from '../assets/cave_main_1.webm'
import { VideoBackground } from './mypixi'

export default ({ scale }: { scale: number }) => VideoBackground({
    src: CaveVideo,
    scale
})
