import type { SCursor } from 'baobab'
import { isEqual } from 'lodash'

export function onCursorKeyChangeRecursive<T>(
    cursor: SCursor<T>,
    callback: () => void
) {
    const lastTree = cursor.get()

    cursor.on('update', function checkIfKeysChanged() {
        if (isEqual(cursor.get(), lastTree)) return

        callback()
    })
}
