import { applyContainerArgs } from './_applyArgs'
import type { ContainerArgs } from './_types'
import { PixiContainer } from './aliases'
import { startChecking } from './_util'

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
    startChecking(c)
    return c
}

export type PixiContainerWithTweenableChildren = PixiContainer & {
    children: TweenablePixiContainer[]
}
