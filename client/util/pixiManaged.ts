import type { DisplayObject } from 'pixi.js'

import type { PixiContainer } from '@/features/battle/elements/mypixi'

export class Managed {
    public shown: boolean
    private child: DisplayObject | null = null
    constructor(private parent: PixiContainer, private childFactory: () => DisplayObject) {
        this.shown = false
    }
    show(): void {
        if (this.shown) {
            console.warn('already shown')
            return
        }
        this.child = this.childFactory()
        this.parent.addChild(this.child)
        this.shown = true
    }
    remove(): void {
        if (!this.shown) {
            console.warn('already removed')
            return
        }
        this.parent.removeChild(this.child)
        this.child?.destroy()
        this.shown = false
    }
}
