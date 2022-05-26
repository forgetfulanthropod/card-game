import { applyContainerArgs } from './_applyArgs'
import type { ContainerArgs } from './_types'
import { PixiContainer } from './aliases'

export class TweenablePixiContainer extends PixiContainer {
    set tweenableScale(scale: number) {
        this.scale.set(scale)
    }
    get tweenableScale() {
        return this.scale.x
    }
}
export function TweenableContainer(
    args: ContainerArgs
): TweenablePixiContainer {
    const c = new TweenablePixiContainer()
    applyContainerArgs(args, c)
    return c
}

export type PixiContainerWithTweenableChildren = PixiContainer & {
    children: TweenablePixiContainer[]
}
