import { getBattleScene } from '@/data'
import {
    Adjust,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    DisplayObject,
    fontMap,
    glowFilter,
    Sprite,
    Text,
} from '@/elementsUtil'
import { Datum } from 'datums'
import { Texture } from 'pixi.js'
import { Souvenir } from 'shared'
import { vals } from 'shared/code'
import { BattleSceneCharacterInfo, MainCharacterAnimation } from '../shared'
import { SouvenirEl } from './Souvenirs'
import { EventResponse, explanationScale } from './EventScene'

export function EquipSouvenirInterface(
    souvenir: Souvenir,
    choiceDatum: Datum<null | EventResponse>,
    doneChoosing?: Datum<boolean>
): DisplayObject {
    const souvenirWidth = 300

    return Container(
        {},
        Sprite({
            src: Texture.WHITE,
            tint: 0,
            alpha: 0.8,
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
        }),
        Text({
            text: 'Choose a Kaiju to Receive:',
            style: {
                fontSize: 40,
                fontFamily: fontMap['sansFont'],
                fill: 'white',
            },
            anchor: 0.5,
            x: BASE_WIDTH * 0.5,
            y: BASE_HEIGHT * 0.4,
        }),
        Adjust(
            SouvenirEl({
                souvenir,
                width: souvenirWidth,
                displayArgs: {
                    filters: [glowFilter],
                },
                explanationDisplayArgs: {
                    scale: explanationScale,
                    y: -50,
                    x: 50,
                },
            }),
            {
                x: BASE_WIDTH * 0.5 + souvenirWidth / 2,
                y: BASE_HEIGHT * 0.2,
            }
        ),
        ...CharacterChoices(choiceDatum, doneChoosing),
        BattleSceneCharacterInfo()
    )
}
function CharacterChoices(
    choice: Datum<null | EventResponse>,
    doneChoosing?: Datum<boolean>
) {
    return vals(getBattleScene().get('allCharacters'))
        .filter(cm => cm.isPc && cm.health > 0)
        .map((characterMeta, index) => {
            return Adjust(
                MainCharacterAnimation({
                    characterMeta,
                    events: {
                        pointerup() {
                            choice.set({
                                index: choice.val?.index!,
                                characterUid: characterMeta.uid,
                            })
                            doneChoosing && doneChoosing.set(true)
                        },
                    },
                })!,
                {
                    x: BASE_WIDTH * 0.2 + index * BASE_WIDTH * 0.6 * 0.5,
                    y: BASE_HEIGHT * 0.8,
                }
            )
        })
}
