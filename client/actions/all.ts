import type { Rulebook } from '@shared/datamodel'

import { call } from './firebaseFunctionsWrap'

export async function helloWorld(): Promise<void> {
    await call('hello')
}

export async function getRulebook(): Promise<Rulebook> {
    return null as unknown as Rulebook
}

export function dispatch(args: Record<string, unknown>): void {

}

export function changeScene(newScene: string): void {}

export function startGame(): void{}
export function doCharacterAction(): void{}
export function chooseDoor(door: string): void{}
