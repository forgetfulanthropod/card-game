import { useState, useEffect } from 'preact/hooks'

import styles from './UsernameEntry.module.css'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'

const fullGoodEarthImg = 'assets/root/good-earth.webp'

export function NewStartScreen(props: {
    onEnter: (username: string) => void
}): JSXElement {

    return <div
        onClick={() => props.onEnter('KaijuDemoOne')}
        class={styles.startScreenContainer2}
    >
        <div class={styles.startScreenContainer2}>
            <img class={styles.kaiju} src='./logos/NewKaijuLogo.png' />
            <p className={styles.startGame}>START GAME</p>
        </div>
    </div>
}
