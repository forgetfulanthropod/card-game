import { Doors } from './Doors'
import { callApi } from '@/actions'
import { getBattleScene } from '@/data'
import type { PixiContainer } from '@/elementsUtil'

export function bindDoors(parent: PixiContainer) {
    const doorCursor = getBattleScene().select('doors')
    let doorsContainer: PixiContainer | null = null
    update()
    doorCursor.on('update', update)

    function update() {
        const doors = doorCursor.get()
        // console.log('doors update...')
        if (
            (doors == null || doors.options.length === 0) &&
            doorsContainer != null
        ) {
            parent.removeChild(doorsContainer)
            doorsContainer.destroy()
            doorsContainer = null
        } else if (doors != null) {
            // console.log('adding some doors')
            doorsContainer = Doors({
                callbacks: doors.options.map(
                    d => () => callApi('ChooseDoor', { door: d })
                ),
                descriptions: doors.descriptions,
                exit: () => callApi('ExitDungeon', {}),
            })
            parent.addChild(doorsContainer)
        }
    }
}
