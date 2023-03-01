import { callApi } from '@/callApi'
import { styled } from '@/config'
import { useState, useRef, MouseEvent, useEffect } from 'react'
import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import {
    muteMusic,
    muteSFX,
    toggleMuteMusic,
    toggleMuteSFX,
    isHighResolution,
    toggleHighResolution,
    toggleBooleanInLocalStorage
} from '@/elementsUtil'
import { callServerApi } from '@/callServerApi'
import { getBattleScene } from '@/data'
import { enableMotionFX, shakeScreen, shakeSetting, toggleShakeSetting } from '@/scenes/shared'

const Root = styled.button`
    position: absolute;
    right: 20px;
    top: 10px;
    pointer-events: auto;
    border: none;
    background: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
`

export function ResetButton(props: { username: string }): JSXElement {
    const [showActions, setShowActions] = useState(false)
    const actionsRef = useRef(null)
    useOutsideClickDismisser(actionsRef, setShowActions)
    const [sfxIsMuted, setSfxIsMuted] = useState(muteSFX)
    const [musicIsMuted, setMusicIsMuted] = useState(muteMusic)
    const [highResEnabled, setHighResEnabled] = useState(isHighResolution)
    const [motionFXEnabled, setMotionFXEnabled] = useState(enableMotionFX)

    const handleClick = () => {
        setShowActions(actions => !actions)
    }

    const handleMuteSFX = () => {
        toggleMuteSFX()
        toggleBooleanInLocalStorage('muteSFX')
        setSfxIsMuted(muted => !muted)
    }

    const handleMuteMusic = () => {
        toggleMuteMusic()
        setMusicIsMuted(muted => !muted)
    }

    const handleRestartRun = async () => {
        const runState = getBattleScene().get('state')
        if (runState !== 'lost' && runState !== 'won') {
            await callServerApi('endRun', {
                userId: props.username,
                restart: true,
            })
        }
        await callApi('makeNewUser', {
            username: props.username,
        })
        window.location.reload();
        setShowActions(false)
    }

    const handleBackToMenu = async () => {
        localStorage.removeItem('username')
        await callApi('makeNewUser', {
            username: props.username,
        })
        window.location.reload()
    }

    const handleHighRes = async () => {
        toggleHighResolution()
        setHighResEnabled(enabled => !enabled)
    }

    const handleMotionFX = async () => {
        toggleBooleanInLocalStorage('enableMotionFX')
        setMotionFXEnabled(enabled => !enabled)
    }

    return <div className='flex flex-col items-end text-white' ref={actionsRef}>
        <Root onClick={() => handleClick()}>⚙</Root>
        <div
            className={`pointer-events-auto absolute top-14 right-6 flex flex-col text-white mt-2 rounded-xl bg-stone-700 font-sans p-1 w-auto font-medium z-50 text-sm shadow-3xl transition-all ${
                showActions ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
        >
            <MenuButton
                handler={handleMuteSFX}
                text={'Mute SFX'}
                isEnabled={sfxIsMuted}
                textIfEnabled={'Unmute SFX'}
            />
            <MenuButton
                handler={handleMuteMusic}
                text={'Mute Music'}
                isEnabled={musicIsMuted}
                textIfEnabled={'Unmute Music'}
            />
            <MenuButton
                handler={handleHighRes}
                text={'Enable High-Res'}
                isEnabled={highResEnabled}
                textIfEnabled={'Disable High-Res'}
            />
            <MenuButton
                handler={handleMotionFX}
                text={'Enable Motion FX'}
                isEnabled={motionFXEnabled}
                textIfEnabled={'Disable Motion FX'}
                />
            <MenuButton
                handler={toggleShakeSetting}
                text={`[TEMP] Toggle shake version`}
            />
            <MenuButton
                handler={() => shakeScreen(1, true)}
                text={`[TEMP] Trigger Screen Shake`}
            />
            <MenuButton
                handler={handleRestartRun}
                text={'Restart Run'}
            />
            <MenuButton
                handler={handleBackToMenu}
                text={'Back to Main Menu'}
            />
        </div>
    </div>
}

type IMenuButtonProps = {
    handler: () => any
    text: string
    isEnabled?: boolean
    textIfEnabled?: string
}

const MenuButton = ({
    handler,
    text,
    isEnabled = false,
    textIfEnabled
}: IMenuButtonProps): JSXElement => {
    return <button
        className='px-8 py-2 hover:bg-stone-900 rounded-lg z-50'
        onClick={handler}
    >
        {isEnabled ? textIfEnabled : text}
    </button>
}
