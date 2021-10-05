import { Container, PixiContainer, PixiSprite } from './mypixi'

const FLY_TIME = 800
const FLY_TO_TIME = FLY_TIME * .6
const FLY_BACK_TIME = FLY_TIME - FLY_TO_TIME

type Point = { x: number, y: number }
export default function FlyingContainer(args: {
    children: (PixiSprite | PixiContainer)[],
    scale: number,
    start: Point,
    flyTo: Point,
}): PixiContainer {

    return Container({
        scale: args.scale,
        children: args.children,
        onTick: makeOnTick(args.start, args.flyTo)
    })
}

function makeOnTick(start: Point, flyTo: Point) {
    let totalElapsed = 0
    return (self: PixiContainer, elapsed: number): void | 'remove' => {
        // const deltaTimeMs = elapsed * 1000 / 60
        totalElapsed += elapsed * 16.66
        let x: number, y: number
        if (totalElapsed < FLY_TO_TIME) {
            x = start.x + (flyTo.x - start.x) * totalElapsed / FLY_TO_TIME
            y = start.y + (flyTo.y - start.y) * totalElapsed / FLY_TO_TIME
        } else if (totalElapsed < FLY_TIME) {
            x = flyTo.x + (start.x - flyTo.x) * (totalElapsed - FLY_TO_TIME) / FLY_BACK_TIME
            y = flyTo.y + (start.y - flyTo.y) * (totalElapsed - FLY_TO_TIME) / FLY_BACK_TIME
        } else {
            x = start.x
            y = start.y
            return 'remove'
        }
        self.x = x
        self.y = y
        return undefined
    }
}
