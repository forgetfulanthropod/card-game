import type { ServerOnlyAction } from 'shared'

export const hello: ServerOnlyAction['Hello'] = () => 'Hello'
