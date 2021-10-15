import DungeonEntryPng from '../assets/temple_background.png'
import background from './background'
import type { PixiContainer } from './mypixi'
import { Container } from './mypixi'


export function DungeonEntryScene(): PixiContainer {
    return Container({
        children: [
            background({ scale: 1, srcs: [DungeonEntryPng] }),
        ]
    })
}
