import DungeonEntryPng from '../assets/temple_background.png'
import background from './background'
import { Container, PixiContainer } from './mypixi'


export function DungeonEntryScene(): PixiContainer {
    return Container({
        children: [
            background({ scale: 1, srcs: [DungeonEntryPng] }),
        ]
    })
}
