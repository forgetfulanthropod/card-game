import { tl } from '@/util'

export type OverlayElementId = 'roundStart' | 'stanceMenu'
export type OverlayElementData = { message: string }

export function overlay({
    elementId,
    data,
}: {
    elementId: OverlayElementId
    data: OverlayElementData
}): void {
    void elementId
    tl(data.message)
}
