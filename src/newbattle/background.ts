import { Sprite, Texture, VideoResource } from './mypixi'
import CaveVideo from './assets/cave_main_1.webm'


export default function (args: { scale: number }): Sprite {
    const r = new VideoResource(CaveVideo, { updateFPS: 24 })
    const source = r.source as HTMLVideoElement
    source.muted = true
    source.loop = true
    const sprite = Sprite.from(Texture.from(r.source))
    sprite.width = 1920 * args.scale
    return sprite
}
