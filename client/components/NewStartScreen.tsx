import { useState, useEffect, useContext, useRef } from 'react'
import { getStage, getStringFromLocalStorage, assetsLoadedPromise } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { collectData, initAnalytics } from '@/analytics/collectData'
import { getPromiseForTreeInitialized } from '@/data'
import { AppContext } from './App'
import {
    MAX_USERNAME_LENGTH,
    MIN_USERNAME_LENGTH,
    Nonce,
    UserID,
    UserType,
} from 'shared'
import {
    NavIconWrapper,
    PrimaryButton,
} from './StartScreen/'
import { TopMenu } from './TopMenu'
import { socket, waitForSocket } from '@/socket'

export type UserDoc = {
    userId: UserID
    userType: UserType
    username: string | null
    nonce?: Nonce
} | null

type Account = { userId: string; username: string | null }

function generateUsername(): string {
    const suffix = Math.random().toString(36).slice(2, 7)
    return `player-${suffix}`
}

export function NewStartScreen(): JSXElement {
    const [userDoc, setUserDoc] = useState<UserDoc>(null)
    const [editingUsername, setEditingUsername] = useState(false)
    const [usernameDraft, setUsernameDraft] = useState('')
    const [usernameError, setUsernameError] = useState<string | null>(null)
    const [isSavingUsername, setIsSavingUsername] = useState(false)
    const [ready, setReady] = useState(false)
    const [assetsReady, setAssetsReady] = useState(false)
    const [isStarting, setIsStarting] = useState(false)
    const startingRef = useRef(false)

    const { setUserId, setInPixi, inPixi } = useContext(AppContext)

    useEffect(() => {
        try {
            const stage = getStage()
            if (stage) {
                stage.visible = false
            }
        } catch {
            // pixi not ready yet
        }
    }, [])

    useEffect(() => {
        if (!inPixi) {
            setEditingUsername(false)
            setUsernameError(null)
        }
    }, [inPixi])

    const refreshAccounts = async () => {
        try {
            const res = await callApi('listAccounts', {}) as any
            return (res?.accounts || []) as Account[]
        } catch (e) {
            console.warn('listAccounts failed', e)
            return [] as Account[]
        }
    }

    const handleStartGame = async (
        userId: string,
        opts?: { daily?: boolean; plain?: boolean; enhanced?: boolean }
    ) => {
        if (startingRef.current) return
        startingRef.current = true
        setIsStarting(true)

        try {
            const isDaily = !!opts?.daily
            const usePlain = !!opts?.plain || (!opts?.enhanced && !opts?.daily)
            const useEnhanced = !!opts?.enhanced

            await callApi('prepareRun', {
                userId,
                daily: isDaily,
                plain: usePlain,
                enhanced: useEnhanced,
                autoStart: isDaily || !!opts?.autoStart,  // Daily forces bypass of selection UI
            } as any)

            await assetsLoadedPromise()
            await getPromiseForTreeInitialized()

            setUserId(userId)
            setInPixi(true)
            try {
                getStage().visible = true
            } catch {
                // pixi may still be initializing; bindGamestate will show the scene
            }
            collectData('enter_game', { mode: isDaily ? 'daily' : 'completionist' })
        } catch (e) {
            console.error('Failed to start game', e)
            alert('Could not start the run. Try again or refresh the page.')
        } finally {
            startingRef.current = false
            setIsStarting(false)
        }
    }

    const loginWithAccount = async (userId: string, username: string | null) => {
        await waitForSocket()
        let res = await callApi('login', { accountId: userId, socketId: socket.id }) as any
        let uId = res?.userId || userId
        let uname = res?.username ?? username
        if (!uId) {
            res = await callApi('loginGuest', { existingUserId: userId, socketId: socket.id }) as any
            uId = res?.userId
            uname = res?.username
        }
        localStorage.setItem('userId', uId)
        localStorage.setItem('lastUserId', uId)
        if (res?.nonce) localStorage.setItem('nonce', res.nonce)
        localStorage.removeItem('walletAddress')

        const udoc: UserDoc = { userId: uId, username: uname || null, userType: 'player' }
        setUserDoc(udoc)
        setUserId(uId)
        initAnalytics(uId)
        collectData('login', { method: 'auto' })
        return udoc
    }

    const ensureAccount = async (): Promise<UserDoc> => {
        if (userDoc?.userId) return userDoc

        let accounts = await refreshAccounts()
        const saved = getStringFromLocalStorage('userId')
        let account = saved.userId
            ? accounts.find(a => a.userId === saved.userId)
            : accounts[0]

        if (!account) {
            let name = generateUsername()
            for (let attempt = 0; attempt < 5; attempt++) {
                const createRes = await callApi('createAccount', { username: name }) as any
                if (createRes?.result === 'success' && createRes.userId) {
                    account = { userId: createRes.userId, username: createRes.username || name }
                    break
                }
                name = generateUsername()
            }
            if (!account) {
                accounts = await refreshAccounts()
                account = accounts[0]
            }
        }

        if (!account) {
            throw new Error('Could not create local account')
        }

        return loginWithAccount(account.userId, account.username)
    }

    const startDaily = async () => {
        const doc = await ensureAccount()
        // NO CHARACTER SELECTION – ONLY MODE
        await handleStartGame(doc!.userId, { daily: true, enhanced: true, autoStart: true })
    }

    const startCompletionist = async () => {
        const doc = await ensureAccount()
        await handleStartGame(doc!.userId, { daily: false, plain: true })
    }

    useEffect(() => {
        void assetsLoadedPromise().then(() => setAssetsReady(true))
    }, [])

    useEffect(() => {
        const init = async () => {
            try {
                await ensureAccount()
            } catch (e) {
                console.error('Failed to init account', e)
            } finally {
                setReady(true)
            }
        }
        init()
    }, [])

    const beginUsernameEdit = () => {
        setUsernameDraft(userDoc?.username || '')
        setUsernameError(null)
        setEditingUsername(true)
    }

    const saveUsername = async () => {
        if (!userDoc?.userId) return
        const trimmed = usernameDraft.trim()
        if (trimmed.length < MIN_USERNAME_LENGTH || trimmed.length > MAX_USERNAME_LENGTH) {
            setUsernameError(`Use ${MIN_USERNAME_LENGTH}-${MAX_USERNAME_LENGTH} characters`)
            return
        }
        setIsSavingUsername(true)
        setUsernameError(null)
        const result = await callApi('setUsername', {
            userId: userDoc.userId,
            username: trimmed,
        })
        if (result.result === 'failure') {
            setUsernameError('Username taken or invalid')
        } else {
            setUserDoc({ ...userDoc, username: trimmed.toLowerCase() })
            setEditingUsername(false)
        }
        setIsSavingUsername(false)
    }

    const cancelUsernameEdit = () => {
        setEditingUsername(false)
        setUsernameError(null)
        setUsernameDraft(userDoc?.username || '')
    }

    return <>
        <div className={`font-bigFont grid grid-rows-4 absolute left-0 w-full h-full z-0 pointer-events-auto`}>
            <video
                src='./assets/backgrounds/main_menu_shed_bg.mp4'
                autoPlay
                muted
                loop
                className='w-full max-w-full absolute -z-50'
            />

            <div className='nav w-full row-span-1 flex p-2 xs:p-4 lg:p-8 justify-end items-start'>
                <div className='navRight flex justify-end items-start gap-4 sm:gap-8 pt-4 md:pt-6'>
                    <div className='grid grid-cols-3 items-center mr-4 pointer-events-auto'>
                        <NavIconWrapper link='https://magiceden.io/marketplace/kaiju_cards'>
                            <img src='./logos/MagicEden.png' alt='Magic Eden Marketplace' className='lg:w-auto h-full' />
                        </NavIconWrapper>
                        <NavIconWrapper link='https://twitter.com/KaijuCards'>
                            <img src='./logos/Twitter.png' alt='Twitter' className=' scale-75 w-auto h-full' />
                        </NavIconWrapper>
                        <NavIconWrapper link='https://dsc.gg/kaijucards'>
                            <img src='./logos/Discord.png' alt='Discord' className='scale-110 w-auto h-full' />
                        </NavIconWrapper>
                    </div>
                    <div className='text-white text-right pointer-events-auto min-w-[10rem]'>
                        {editingUsername ? (
                            <div className='flex flex-col items-end gap-1'>
                                <input
                                    className='bg-stone-800/90 rounded px-2 py-1 font-mono text-sm text-white focus:outline-none w-full max-w-[12rem]'
                                    value={usernameDraft}
                                    maxLength={MAX_USERNAME_LENGTH}
                                    autoFocus
                                    disabled={isSavingUsername}
                                    onChange={e => {
                                        setUsernameDraft(e.target.value)
                                        if (usernameError) setUsernameError(null)
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') void saveUsername()
                                        if (e.key === 'Escape') cancelUsernameEdit()
                                    }}
                                />
                                <div className='flex gap-2 text-xs'>
                                    <button
                                        className='opacity-70 hover:opacity-100'
                                        onClick={cancelUsernameEdit}
                                        disabled={isSavingUsername}
                                    >
                                        cancel
                                    </button>
                                    <button
                                        className='hover:underline'
                                        onClick={() => void saveUsername()}
                                        disabled={isSavingUsername}
                                    >
                                        save
                                    </button>
                                </div>
                                {usernameError && <div className='text-red-400 text-[10px]'>{usernameError}</div>}
                            </div>
                        ) : (
                            <button
                                className='font-mono text-sm hover:underline disabled:opacity-50'
                                onClick={beginUsernameEdit}
                                disabled={!ready || !userDoc?.username}
                                title='Change username'
                            >
                                {ready ? (userDoc?.username || '...') : '...'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className='bottom h-full p-2 row-span-3 grid grid-cols-12'>
                <div className='left-buttons h-full col-span-2' />
                <div className='mid-buttons h-full col-span-8 flex items-end justify-center gap-4 sm:gap-8 p-1 sm:p-2 xl:p-10'>
                    <div className='h-auto w-full max-w-3xl flex xl:pt-4 gap-4 md:gap-8 xl:gap-12'>
                        <TopMenu />
                        {/* legacy buttons kept for compat in some flows; main is TopMenu Daily | Worlds | PVP | Marketplace */}
                    </div>
                </div>
                <div className='right-buttons h-full col-span-2' />
            </div>
        </div>
    </>
}
