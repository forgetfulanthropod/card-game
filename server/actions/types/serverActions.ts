
import type { Func } from '@shared'
// @index(['../../../shared/actions/*.ts', '!../../../shared/actions/index.ts'], f => `import type { ${f.name} as _${f.name} } from '@shared'\nexport type ${f.name} = ServerAction<_${f.name}>`)
import type { AddSelected as _AddSelected } from '@shared'
export type AddSelected = ServerAction<_AddSelected>
import type { ChangeDungeon as _ChangeDungeon } from '@shared'
export type ChangeDungeon = ServerAction<_ChangeDungeon>
import type { ChangeScene as _ChangeScene } from '@shared'
export type ChangeScene = ServerAction<_ChangeScene>
import type { ChooseDoor as _ChooseDoor } from '@shared'
export type ChooseDoor = ServerAction<_ChooseDoor>
import type { DoCharacterAction as _DoCharacterAction } from '@shared'
export type DoCharacterAction = ServerAction<_DoCharacterAction>
import type { ExitDungeon as _ExitDungeon } from '@shared'
export type ExitDungeon = ServerAction<_ExitDungeon>
import type { Hello as _Hello } from '@shared'
export type Hello = ServerAction<_Hello>
import type { IncrementTestCounter as _IncrementTestCounter } from '@shared'
export type IncrementTestCounter = ServerAction<_IncrementTestCounter>
import type { MakeNewUser as _MakeNewUser } from '@shared'
export type MakeNewUser = ServerAction<_MakeNewUser>
import type { MaybeMakeUser as _MaybeMakeUser } from '@shared'
export type MaybeMakeUser = ServerAction<_MaybeMakeUser>
import type { ResetRandomSeed as _ResetRandomSeed } from '@shared'
export type ResetRandomSeed = ServerAction<_ResetRandomSeed>
import type { RulebookAction as _RulebookAction } from '@shared'
export type RulebookAction = ServerAction<_RulebookAction>
import type { SelectMove as _SelectMove } from '@shared'
export type SelectMove = ServerAction<_SelectMove>
import type { StartBattle as _StartBattle } from '@shared'
export type StartBattle = ServerAction<_StartBattle>
import type { ToggleBlessing as _ToggleBlessing } from '@shared'
export type ToggleBlessing = ServerAction<_ToggleBlessing>
import type { ToggleStance as _ToggleStance } from '@shared'
export type ToggleStance = ServerAction<_ToggleStance>
// @endindex


type ServerAction<T extends Func> =
    (args: Objify<Parameters<T>[0]> & { username: string })
        => ReturnType<T>


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Empty { }
type Objify<Type> = Type extends Obj ? Obj : Empty

type Obj = Record<string | number | symbol, any>
