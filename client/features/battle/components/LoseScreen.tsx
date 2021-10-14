import type { JSX } from 'preact';

import losePng from '../assets/fainted.png'
import { IdleScreenOverlay, Lose, Reset } from './Styles'

function LoseScreen(props: { reset: () => void }): JSX.Element {
    return <IdleScreenOverlay>
        <Lose src={losePng} />
        <Reset onClick={props.reset}>Reset</Reset>
    </IdleScreenOverlay>
}
