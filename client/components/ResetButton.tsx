import { callApi } from '@/callApi'
import { styled } from '@/config'
import { useState, useRef, useContext } from 'react'
import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import {
    muteMusic,
    muteSFX,
    toggleMuteMusic,
    toggleMuteSFX,
    isHighResolution,
    toggleHighResolution,
    toggleBooleanInLocalStorage,
    toggleIsFrameRateCapped,
    isFrameRateCapped,
} from '@/elementsUtil'
import { callServerApi } from '@/callServerApi'
import { getBattleScene } from '@/data'
import { enableMotionFX } from '@/scenes/shared'
import { AppContext } from './App'
import { composeDefaultParty } from '@/scenes/entry/CharacterOptions'
import { getClientEnv } from '@/util/getClientEnv'
import { UserID } from 'shared'

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

// todo: change name to SettingsMenu
export function ResetButton(props: { userId: UserID }): JSXElement {
    const { userId } = props
    const [showMenu, setShowMenu] = useState(false)
    const actionsRef = useRef(null)
    useOutsideClickDismisser(actionsRef, setShowMenu)
    const [sfxIsMuted, setSfxIsMuted] = useState(muteSFX)
    const [musicIsMuted, setMusicIsMuted] = useState(muteMusic)
    const [highResEnabled, setHighResEnabled] = useState(isHighResolution)
    const [motionFXEnabled, setMotionFXEnabled] = useState(enableMotionFX)
    const { setInPixi } = useContext(AppContext)

    const handleClick = () => {
        setShowMenu(actions => !actions)
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
                userId: userId,
                restart: true,
            })
        }
        await callApi('setInitialGameState', {
            userId,
        })
        setShowMenu(false)
    }

    const handleBackToMenu = async () => {
        console.log('handleBackToMenu...')
        const IS_LOCAL = getClientEnv('IS_LOCAL')
        if (IS_LOCAL) {
            localStorage.removeItem('userId')
        }
        await callApi('setInitialGameState', {
            userId,
        })
        composeDefaultParty()
        setInPixi(false)
        setShowMenu(false)
    }

    const handleHighRes = async () => {
        toggleHighResolution()
        setHighResEnabled(enabled => !enabled)
    }

    const handleFrameRateCap = async () => {
        toggleIsFrameRateCapped()
    }

    const handleMotionFX = async () => {
        toggleBooleanInLocalStorage('enableMotionFX')
        setMotionFXEnabled(enabled => !enabled)
    }

    return <div className='flex flex-col items-end text-white' ref={actionsRef}>
        <Root onClick={() => handleClick()}>⚙</Root>
        <div
            className={`pointer-events-auto absolute top-14 right-6 flex flex-col text-white mt-2 rounded-xl bg-stone-700 font-sans p-1 w-auto font-medium z-50 text-sm shadow-3xl transition-all ${
                showMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
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
                handler={handleFrameRateCap}
                text={'Limit to 30 FPS'}
                isEnabled={isFrameRateCapped}
                textIfEnabled={'Remove frame rate limit'}
            />
            <MenuButton
                handler={handleMotionFX}
                text={'Enable Motion FX'}
                isEnabled={motionFXEnabled}
                textIfEnabled={'Disable Motion FX'}
            />
            <MenuButton handler={handleRestartRun} text={'Restart Run'} />
            <MenuButton handler={handleBackToMenu} text={'Back to Main Menu'} />
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
    textIfEnabled,
}: IMenuButtonProps): JSXElement => {
    return <button
        className='px-8 py-2 hover:bg-stone-900 rounded-lg z-50'
        onClick={handler}
    >
        {isEnabled ? textIfEnabled : text}
    </button>
}
