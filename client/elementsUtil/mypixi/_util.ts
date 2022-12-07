import type { DisplayObject } from 'pixi.js'

const config = { shouldCheck: false }

const WARN_COUNT = 3
const INTERVAL = 5000

const warnCount: Record<number, number> = {}

/** Periodically checks if element has a parent, and gives warning if not */
export function startChecking(el: DisplayObject) {
    if (!config.shouldCheck) return
    const stack = getStackTrace()
    const id = window.setInterval(() => {
        if (el.parent == null) {
            console.warn(
                'element has no parent and is not destroyed:',
                el.constructor.name,
                el.name,
                el
            )
            if (warnCount[id] <= 0) console.error(stack)
            warnCount[id] = (warnCount[id] ?? 0) + 1
            if (warnCount[id] > WARN_COUNT) window.clearInterval(id)
        }
    }, INTERVAL)
    el.on('destroyed', () => clearInterval(id))
}

// eslint-disable-next-line no-var
var getStackTrace = function () {
    const obj = {}
    if (Error.captureStackTrace !== undefined) {
        Error.captureStackTrace(obj, getStackTrace)
    }
    // @ts-expect-error
    return obj.stack
}
