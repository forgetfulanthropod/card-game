import type { Datum, RODatum } from 'datums'
import type {
    DisplayObject,
    FederatedPointerEvent,
    Filter as PixiFilter,
    ITextStyle,
} from 'pixi.js'
import type { ROCursor } from 'sbaobab'
import type {
    PixiContainer,
    PixiGraphics,
    PixiSprite,
    PixiTexture,
} from './aliases'
import type { InteractionEvents } from './InteractionEvents'
import type { AssetKey } from '@/elementsUtil'

export interface DisplayObjectArgs {
    position?: Pair
    scale?: number | Pair
    width?: number
    height?: number
    pivot?: number | Pair
    x?: number
    y?: number
    onTick?: OnPixiTick
    alpha?: number
    filters?: (PixiFilter | null | false | undefined)[]
    // deprecated
    onClick?: InteractionEventHandler
    // deprecated
    onMouseover?: InteractionEventHandler
    // deprecated
    onMouseout?: InteractionEventHandler
    events?: InteractionEvents
    defaultCursor?: boolean
    name?: string
    zIndex?: number
    visible?: boolean
    angle?: number
    rotation?: number
    onDestroy?: Callback[]
    /** will be bound to pointerover and pointerout */
    isHoveredDatum?: Datum<boolean>
}
// text and sprite but not graphics
export interface ShownArgs extends DisplayObjectArgs {
    tint?: number
    anchor?: number | Pair
}
// type OnContainerTick = (self: PixiContainer, delta: number) => void | 'remove'
export interface ContainerArgs extends DisplayObjectArgs {
    // onTick?: OnContainerTick
    cache?: boolean
}
export interface TextArgs extends ShownArgs {
    text:
        | string
        | number
        | ROCursor<string>
        | ROCursor<number>
        | RODatum<string>
        | RODatum<number>
    style?: Partial<ITextStyle>
    isHtml?: boolean
}
export interface GraphicsArgs extends DisplayObjectArgs {
    tint?: number
    draw: (g: PixiGraphics) => void
}

export type OnPixiTick = (
    self: PixiSprite | PixiContainer,
    delta: number
) => void | 'remove'
export interface SpriteArgs extends ShownArgs {
    src: AssetKey | PixiTexture
}
export type ContainerChild =
    | PixiSprite
    | PixiContainer
    | DisplayObject
    | null
    | false

export type ContainerChildren = ContainerChild[]

export type InteractionEventHandler = (e: FederatedPointerEvent) => void
export type Pair = [x: number, y: number]
