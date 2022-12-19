import { callApi } from '@/callApi'
import { styled } from '@/config'
import { useState, useRef, MouseEvent, useEffect } from 'react'
import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import { toggleMuteMusic, toggleMuteSFX } from '@/elementsUtil'

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
    const [sfxIsMuted, setSfxIsMuted] = useState(false)
    const [musicIsMuted, setMusicIsMuted] = useState(false)

    const handleClick = () => {
        setShowActions(actions => !actions)
    }

    const handleMuteSFX = () => {
        toggleMuteSFX()
        setSfxIsMuted(muted => !muted)
    }

    const handleMuteMusic = () => {
        toggleMuteMusic()
        setMusicIsMuted(muted => !muted)
        //TODO
    }

    let release = false
    return <div className='flex flex-col items-end text-white'>
        <Root
            onClick={() => handleClick()}
            // onPointerDown={() => {
            //     release = false
            //     setTimeout(async () => {
            //         if (!release) {
            //             localStorage.removeItem('username')
            //             await callApi('makeNewUser', {
            //                 username: props.username,
            //             })
            //             window.location.reload()
            //         }
            //     }, 2500)
            // }}
            // onPointerUp={async () => {
            //     release = true
            //     // window.location.reload()
            //     // location.replace(
            //     //     window.location.href.replace('#continue', '') + '#continue'
            //     // )
            // }}
        >
            ⚙
        </Root>
        <div
            className={`pointer-events-auto absolute top-14 right-6 flex flex-col text-white mt-2 rounded-xl bg-stone-700 font-sans p-1 w-auto font-medium z-50 text-sm shadow-3xl transition-all ${
                showActions ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            ref={actionsRef}
        >
            <button
                className='px-8 py-2 hover:bg-stone-900 rounded-lg z-50'
                onClick={handleMuteSFX}
            >
                {sfxIsMuted ? 'Unmute SFX' : 'Mute SFX'}
            </button>
            <button
                className='px-8 py-2 hover:bg-stone-900 rounded-lg z-50'
                onClick={handleMuteMusic}
            >
                {musicIsMuted ? 'Unmute Music' : 'Mute Music'}
            </button>
            <button
                className='px-8 py-2 hover:bg-stone-900 rounded-lg z-50'
                onClick={async () => {
                    await callApi('makeNewUser', {
                        username: props.username,
                    })
                    window.location.reload()
                }}
            >
                Restart Run
            </button>
            <button
                className='px-8 py-2 hover:bg-stone-900 rounded-lg z-50'
                onClick={async () => {
                    localStorage.removeItem('username')
                    await callApi('makeNewUser', {
                        username: props.username,
                    })
                    window.location.reload()
                }}
            >
                Back to Main Menu
            </button>
        </div>
    </div>
}
