import background from './background'
import { Container, PixiContainer } from './mypixi'
import DungeonEntryPng from '../assets/temple_background.png'


export function DungeonEntryScene(): PixiContainer {
    return Container({
        children: [
            background({ scale: 1, srcs: [DungeonEntryPng] }),
        ]
    })
}
