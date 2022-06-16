import type { ServerActions } from 'shared'

export const incrementTestCounter: ServerActions['incrementTestCounter'] =
    // eslint-disable-next-line @typescript-eslint/require-await
    async _ => {
        logger.warn('incrementTestCounter: unimplemented')
    }
