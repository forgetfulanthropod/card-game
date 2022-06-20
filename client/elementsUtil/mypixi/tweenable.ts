import type { ContainerArgs, ContainerChildren } from './_types'
import { PixiContainer } from './aliases'
import { startChecking } from './_util'
import { applyDisplayObjectArgs } from './_applyArgs'

export class TweenablePixiContainer extends PixiContainer {
    set tweenableScale(scale: number) {
        this.scale.set(scale)
    }
    get tweenableScale() {
        return this.scale.x
    }
}
export function TweenableContainer(
    args: ContainerArgs,
    ...children: ContainerChildren
): TweenablePixiContainer {
    const c = new TweenablePixiContainer()
    children.forEach(ch => ch && c.addChild(ch))
    applyDisplayObjectArgs(c, args)
    startChecking(c)
    return c
}

export type PixiContainerWithTweenableChildren = PixiContainer & {
    children: TweenablePixiContainer[]
}
