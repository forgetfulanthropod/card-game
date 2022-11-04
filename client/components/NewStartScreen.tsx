import { useState, useEffect } from 'preact/hooks'

import styles from './NewStartScreen.module.css'

export function NewStartScreen(props: {
    onEnter: (username: string) => void
}): JSXElement {
    const [showText, setShowText] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setShowText(showText => !showText)
        }, 800)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return <div
        onClick={() => props.onEnter('random-' + Math.random().toString())}
        class={styles.startScreenContainer}
    >
        <video
            src='./assets/backgrounds/main_menu_shed_bg.webm'
            autoPlay
            loop
            style={{maxWidth: '110%'}}
        />
        <img class={styles.kaijuLogo} src='./logos/NewKaijuLogo.png' />
        {showText && <p className={styles.startGame} id='startGame'>
            START GAME
        </p>}
    </div>
}
