import { Graphics } from 'pixi.js'
import { Stage, Container, PixiComponent } from '@inlet/react-pixi'


export default PixiComponent<{ scale: number }, Graphics>('PixiHealthBar', {
    create: (props) => {

        const graphics = new Graphics()

        // Set the fill color
        graphics.beginFill(0xe74c3c) // Red

        // Draw a circle
        graphics.drawCircle(40, 40, 40)
        return graphics
    },
})
