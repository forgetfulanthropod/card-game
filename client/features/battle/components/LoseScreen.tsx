import losePng from '../assets/fainted.png'
import { IdleScreenOverlay, Lose, Reset } from './Styles'

export function LoseScreen(props: { reset: () => void }): JSXElement {
    return <IdleScreenOverlay>
        <Lose src={losePng} />
        <Reset onClick={props.reset}>Reset</Reset>
    </IdleScreenOverlay>
}
