import type { Gamestate } from '../datamodel'

export type MaybeMakeUser = (args: { username: string }) => Gamestate
