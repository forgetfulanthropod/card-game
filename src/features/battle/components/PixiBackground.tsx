import { Sprite, BaseTexture, VideoResource, Texture } from 'pixi.js'
import { Stage, Container, PixiComponent } from '@inlet/react-pixi'
import CaveVideo from '../assets/cave_main_1.webm'


export default PixiComponent('PixiBackground', {
    create: () => {
        const r = new VideoResource(CaveVideo, { updateFPS: 24 })
        const source = r.source as HTMLVideoElement
        source.muted = true
        source.loop = true
        return Sprite.from(Texture.from(r.source))
    },
})
