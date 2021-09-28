import { Sprite, BaseTexture, VideoResource, Texture } from 'pixi.js'
import { Stage, Container, PixiComponent } from '@inlet/react-pixi'
import CaveVideo from '../assets/cave_main_1.webm'


export default PixiComponent('PixiBackground', {
    create: () => {
        const r = new VideoResource(CaveVideo)
        const source = r.source as HTMLVideoElement
        source.muted = true
        source.loop = true
        source.style.position = 'absolute'
        source.style.left = '0'
        source.style.right = '0'
        source.style.bottom = '0'
        source.style.top = '0'
        return Sprite.from(Texture.from(r.source))
    },
})
