import type { DisplayObject } from 'pixi.js'

import type { PixiContainer } from '@/elementsUtil'

/** Easier thing for adding and removing sprites maybe. Untested. Not sure if useful. */
export class Managed {
    private child: DisplayObject | null = null
    constructor(private parent: PixiContainer, private childFactory: () => DisplayObject) {}
    show(): void {
        if (this.child != null) {
            console.warn('already shown')
            return
        }
        this.child = this.childFactory()
        this.parent.addChild(this.child)
    }
    remove(): void {
        if (this.child == null) {
            console.warn('already removed')
            return
        }
        if (this.child) this.parent.removeChild(this.child)
        this.child?.destroy()
    }
    get shown(): boolean {
        return this.child != null
    }
}
