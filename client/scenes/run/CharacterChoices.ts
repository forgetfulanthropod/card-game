import { getBattleScene } from '@/data'
import { Adjust, BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Datum } from 'datums'
import { CharacterMeta, CharacterUid } from 'shared'
import { vals } from 'shared/code'
import { MainCharacterAnimation } from '../shared'
import { EventResponse } from './EventScene'

export function CharacterChoices({
    choice,
    doneChoosing,
    charactersOverride,
    yOverride = BASE_HEIGHT * 0.8,
}: {
    choice: Datum<null | EventResponse | { characterUid: CharacterUid }>
    doneChoosing?: Datum<boolean>
    charactersOverride?: CharacterMeta[]
    yOverride?: number
}) {
    const characters =
        charactersOverride ??
        vals(getBattleScene().get('allCharacters')).filter(
            cm => cm.isPc && cm.health > 0
        )
    return characters.map((characterMeta, index) => {
        return Adjust(
            MainCharacterAnimation({
                characterMeta,
                events: {
                    pointerup() {
                        choice.set({
                            //@ts-expect-error
                            index: choice.val?.index,
                            characterUid: characterMeta.uid,
                        })
                        doneChoosing && doneChoosing.set(true)
                    },
                },
            })!,
            {
                x:
                    characters.length === 3
                        ? BASE_WIDTH * 0.2 + index * BASE_WIDTH * 0.3
                        : characters.length === 2
                        ? BASE_WIDTH * 0.33 + index * BASE_WIDTH * 0.33
                        : BASE_WIDTH / 2,
                y: yOverride,
            }
        )
    })
}
