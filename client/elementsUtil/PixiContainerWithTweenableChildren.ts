import type { PixiContainer, TweenablePixiContainer } from '@/elementsUtil'

export type PixiContainerWithTweenableChildren = PixiContainer & {
    children: TweenablePixiContainer[]
}
