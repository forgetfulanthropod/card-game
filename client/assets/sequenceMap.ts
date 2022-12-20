import { keys } from 'shared/code'
import { sequences } from './deluxeAssetMaps'

type SequenceMapKey = keyof typeof sequenceMap
type SequenceFrames = (keyof typeof sequences)[]

export const sequenceMap = {
    KC_FX_AdvAttack_121222_: [] as SequenceFrames,
    KC_FX_BasicAttack_121222_: [] as SequenceFrames,
    KC_FX_Bleed_121222_: [] as SequenceFrames,
    KC_FX_BlockBreak_121222_: [] as SequenceFrames,
    KC_FX_BlockBreakShort_121222_: [] as SequenceFrames,
    KC_FX_GainEnergy_121222_: [] as SequenceFrames,
    KC_FX_GainHealth_121222_: [] as SequenceFrames,
    KC_FX_Poison_121222_: [] as SequenceFrames,
    KC_FX_PsychicAttack_121222_: [] as SequenceFrames,
    KC_FX_Shield_121222_: [] as SequenceFrames,
}

keys(sequences).forEach(s => {
    keys(sequenceMap).forEach(
        sequenceKey =>
            s.includes(sequenceKey) && sequenceMap[sequenceKey].push(s)
    )
})

console.log({ sequenceMap })
