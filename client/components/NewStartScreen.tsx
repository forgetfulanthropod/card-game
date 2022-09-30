import { useState, useEffect } from 'preact/hooks'

import styles from './UsernameEntry.module.css'

const fullGoodEarthImg = 'assets/root/good-earth.webp'

export function NewStartScreen(props: {
    onEnter: (username: string) => void
}): JSXElement {
    const [showText, setShowText] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setShowText(showText => !showText)
            console.log('interval running...')
            console.log(`showText: ${showText}`)
        }, 800)
        return () => {
            clearInterval(interval)
        }
    }, [])

    return <div
        onClick={() => props.onEnter('random-' + Math.random().toString())}
        class={styles.startScreenContainer2}
    >
        <div class={styles.startScreenContainer2}>
            <img class={styles.kaiju} src='./logos/NewKaijuLogo.png' />
            {showText && <p className={styles.startGame} id='startGame'>
                START GAME
            </p>}
        </div>
    </div>
}
