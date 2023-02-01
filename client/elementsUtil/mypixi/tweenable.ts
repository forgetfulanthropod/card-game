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

    set tweenableScaleX(scale: number) {
        this.scale.set(scale, this.scale.y)
    }

    get tweenableScaleX() {
        return this.scale.x
    }

    set tweenableScaleY(scale: number) {
        this.scale.set(this.scale.x, scale)
    }

    get tweenableScaleY() {
        return this.scale.y
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
