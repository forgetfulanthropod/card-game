import { Sprite, BaseTexture, VideoResource, Texture } from 'pixi.js'
import { Stage, Container, PixiComponent } from '@inlet/react-pixi'
import CaveVideo from '../assets/cave_main_1.webm'


export default PixiComponent<{ scale: number }, Sprite>('PixiBackground', {
    create: (props) => {
        const r = new VideoResource(CaveVideo, { updateFPS: 24 })
        const source = r.source as HTMLVideoElement
        source.muted = true
        source.loop = true
        const sprite = Sprite.from(Texture.from(r.source))
        sprite.width = 1920 * props.scale
        // sprite.width = sprite.width * props.scale
        // sprite.height = sprite.height * props.scale
        return sprite
    },
})
