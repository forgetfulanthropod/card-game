import { useState, useEffect, useContext } from 'react'
import { getStage, getStringFromLocalStorage } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { collectData, initAnalytics } from '@/analytics/collectData'
import { getClientEnv } from '@/util/getClientEnv'
import { AppContext } from './App'
import {
    BUILD_VER,
    Nonce,
    UserID,
    UserType,
} from 'shared'
import {
    UsernameModal,
    ClosedGameModal,
    TutorialModal,
    NavIconWrapper,
    PrimaryButton,
} from './StartScreen/'
import { socket, waitForSocket } from '@/socket'

// Local accounts: max 4, add by unique username (typed), delete, pick to play.
// No crypto / wallets.

export type UserDoc = {
    userId: UserID
    userType: UserType
    username: string | null
    nonce?: Nonce
} | null

type Account = { userId: string; username: string | null }

export function NewStartScreen(): JSXElement {
    const GAME_IS_LIVE = getClientEnv('GAME_IS_LIVE') || 'true'

    const [userDoc, setUserDoc] = useState<UserDoc>(null)
    const [showTutorial, setShowTutorial] = useState(false)
    const [showAccountManager, setShowAccountManager] = useState(false)
    const [showClosedGameModal, setShowClosedGameModal] = useState(false)
    const [showUsernameModal, setShowUsernameModal] = useState(false)
    const [clickedPlay, setClickedPlay] = useState(false)

    const [accounts, setAccounts] = useState<Account[]>([])
    const [newUsername, setNewUsername] = useState('')
    const [accountError, setAccountError] = useState<string | null>(null)
    const [isWorking, setIsWorking] = useState(false)
    const [lastTakenUsername, setLastTakenUsername] = useState('') // for overwrite option

    // Generative AI flow state (using Grok Imagine + X login)
    const [xLoggedIn, setXLoggedIn] = useState(false)
    const [xHandle, setXHandle] = useState<string | null>(null)
    const [showGenModal, setShowGenModal] = useState(false)
    const [worldPrompt, setWorldPrompt] = useState('')
    const [stylePrompt, setStylePrompt] = useState('')
    const [genLoading, setGenLoading] = useState(false)
    const [generatedGame, setGeneratedGame] = useState<any>(null)

    const { setUserId, setInPixi, IS_PRODUCTION } = useContext(AppContext)

    const refreshAccounts = async () => {
        try {
            const res = await callApi('listAccounts', {}) as any
            const accs = res?.accounts || []
            setAccounts(accs)
            return accs as Account[]
        } catch (e) {
            console.warn('listAccounts failed', e)
            return [] as Account[]
        }
    }

    const handleStartGame = async (userId: string, opts?: { daily?: boolean; plain?: boolean; enhanced?: boolean }) => {
        console.log('STARTING GAME', opts)
        const isDaily = !!opts?.daily
        await callApi('loadGameState', { userId } as any)
        await callApi('prepareRun', { userId, daily: isDaily } as any)
        console.log('gamestate loaded, prepared')
        if (opts) {
            // for the two main buttons: auto fill party with plain/enhanced (bypass manual entry)
            const usePlain = !!opts.plain || (!opts.enhanced && !opts.daily)
            const useEnhanced = !!opts.enhanced
            for (let i = 0; i < 3; i++) {
                await callApi('rollKaiju', { placeIndex: i as any, plain: usePlain, enhanced: useEnhanced } as any)
            }
            // auto start the run
            const { runId } = await callApi('startRun', { userId } as any)
            await callApi('changeScene', { newSceneName: 'battle' } as any)
            await callApi('setRunId', { userId, runId } as any)
        }
        setUserId(userId)
        setInPixi(true)
        if (getStage()) {
            getStage().visible = true
        }
        collectData('enter_game', {})
    }

    const loginWithAccount = async (userId: string, username: string | null) => {
        console.log('Logging in with account', userId)
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
        if (res?.nonce) localStorage.setItem('nonce', res.nonce)
        localStorage.removeItem('walletAddress')

        const udoc: UserDoc = { userId: uId, username: uname || null, userType: 'player' }
        setUserDoc(udoc)
        initAnalytics(uId)
        collectData('login', { method: 'pick_account' })

        setShowAccountManager(false)
        if (!uname) {
            setShowUsernameModal(true)
        } else if (clickedPlay) {
            handleStartGame(uId)
        }
        return { userId: uId, username: uname }
    }

    const handlePlayButtonClick = async () => {
        console.log('Handling Play button click')
        setClickedPlay(true)
        if (GAME_IS_LIVE !== 'true' && GAME_IS_LIVE !== '') return setShowClosedGameModal(true)

        if (!userDoc || !userDoc.userId) {
            await refreshAccounts()
            setShowAccountManager(true)
            return
        }
        if (userDoc.username === null) {
            return setShowUsernameModal(true)
        }
        handleStartGame(userDoc.userId)
    }

    const startDaily = async () => {
        if (!userDoc?.userId) {
            await refreshAccounts()
            setShowAccountManager(true)
            return
        }
        await waitForSocket()
        await loginWithAccount(userDoc.userId, userDoc.username || 'player')
        handleStartGame(userDoc.userId, { daily: true, enhanced: true })
    }

    const startCollectionAdventure = async () => {
        if (!userDoc?.userId) {
            await refreshAccounts()
            setShowAccountManager(true)
            return
        }
        await waitForSocket()
        await loginWithAccount(userDoc.userId, userDoc.username || 'player')
        handleStartGame(userDoc.userId, { daily: false, plain: true })
    }

    const handleTutorialClick = () => {
        setShowTutorial(true)
        collectData('tutorial_begin', {})
    }

    // load accounts and auto-restore
    useEffect(() => {
        const init = async () => {
            let currentAccounts = await refreshAccounts()
            // first-run UX: auto-create a default 'player' account so modal is not empty (only if none)
            if (currentAccounts.length === 0) {
                try {
                    const createRes = await callApi('createAccount', { username: 'player' }) as any
                    if (createRes?.result === 'success') {
                        currentAccounts = await refreshAccounts()
                        console.log('auto-created default player account')
                    }
                } catch (e) { /* ignore */ }
            }
            // Do NOT auto-start the game here. Previously this logic (and the saved userId restore)
            // would immediately call setInPixi(true) / handleStartGame, causing "going back to main menu
            // keeps starting a game for no reason".
            //
            // Now we only restore the last user so the menu can show "playing as ..." and the user
            // can explicitly click Play. Going back to menu will stay on the menu.
            const saved = getStringFromLocalStorage('userId')
            const savedId = saved.userId
            if (!savedId) return
            // validate it still exists
            const exists = (await callApi('listAccounts', {}) as any)?.accounts?.some((a: Account) => a.userId === savedId)
            if (!exists) {
                localStorage.removeItem('userId')
                return
            }
            console.log('found existing userId (restoring to menu only, no auto-start)', savedId)
            await waitForSocket()
            await callApi('loginGuest', { existingUserId: savedId, socketId: socket.id })
            await callApi('loadGameState', { userId: savedId })
            setUserDoc({ userId: savedId, userType: 'player', username: null })
            setUserId(savedId)
            // deliberately NOT calling setInPixi(true) here
        }
        init()
    }, [])

    useEffect(() => {
        if (clickedPlay && userDoc && !userDoc.username) {
            setShowUsernameModal(true)
        }
    }, [userDoc, clickedPlay])

    // Account management actions
    const handleAddAccount = async (overwrite = false) => {
        const name = newUsername.trim() || lastTakenUsername
        if (!name) return
        setIsWorking(true)
        setAccountError(null)
        const res = await callApi('createAccount', { username: name, overwrite }) as any
        if (res?.result === 'success' && res.userId) {
            setNewUsername('')
            setLastTakenUsername('')
            await refreshAccounts()
            // auto pick the new one
            await loginWithAccount(res.userId, res.username || name)
        } else {
            const err = res?.error || 'Could not create account'
            setAccountError(err)
            if (!overwrite && (err.includes('taken') || err.includes('already'))) {
                setLastTakenUsername(name)
            }
        }
        setIsWorking(false)
    }

    const handleDelete = async (userId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('Delete this account and all its progress?')) return
        setIsWorking(true)
        const res = await callApi('deleteAccount', { userId }) as any
        await refreshAccounts()
        if (userDoc?.userId === userId) {
            setUserDoc(null)
            localStorage.removeItem('userId')
        }
        setIsWorking(false)
    }

    const handlePick = async (acc: Account) => {
        await loginWithAccount(acc.userId, acc.username)
    }

    const openAccountManager = async () => {
        await refreshAccounts()
        setShowAccountManager(true)
        setAccountError(null)
        setNewUsername('')
        setLastTakenUsername('')
    }

    // Mock X login (in real would use X OAuth + Grok session)
    const handleLoginWithX = () => {
        const mockHandle = prompt('Enter your X handle (e.g. @kaijugamer) or leave blank for demo:', '@demo_x_user') || '@demo_x_user'
        setXHandle(mockHandle)
        setXLoggedIn(true)
        // Optionally link to current account or create one
        if (!userDoc && accounts.length > 0) {
            loginWithAccount(accounts[0].userId, mockHandle.replace('@', ''))
        }
        alert(`Logged in with X as ${mockHandle}. Generative AI features unlocked!`)
    }

    // Generative flow: prompt world + style -> generate game elements (text + imagine placeholder)
    const handleGenerateGame = async () => {
        if (!worldPrompt.trim()) {
            alert('Please describe the world!')
            return
        }
        if (!userDoc?.userId) {
            alert('Pick or create an account first!')
            return
        }
        setGenLoading(true)

        try {
            // Call server generative action (in real: uses Grok for text + xAI Imagine for unique art)
            const res = await callApi('generateGame', {
                userId: userDoc.userId,
                worldPrompt: worldPrompt.trim(),
                stylePrompt: stylePrompt.trim()
            }) as any

            const newGame = {
                name: res.name,
                desc: res.desc,
                world: worldPrompt.trim(),
                style: stylePrompt.trim() || 'default',
                cards: res.cards,
                image: res.image,
                generatedAt: new Date().toISOString()
            }

            setGeneratedGame(newGame)
            console.log('Generated via AI:', newGame)
        } catch (e) {
            console.error(e)
            // Fallback local gen
            const world = worldPrompt.trim()
            const style = stylePrompt.trim() || 'vibrant'
            setGeneratedGame({
                name: `Generated: ${world} ${style}`,
                desc: `A ${style} world: ${world}. AI-crafted Kaiju & cards.`,
                world,
                style,
                cards: [{name: 'AI Slash', desc: 'Custom generated'}],
                image: '/assets/generated/grok-generated-kaiju.jpg',
                generatedAt: new Date().toISOString()
            })
        }
        setGenLoading(false)
    }

    const handlePlayGenerated = () => {
        if (!generatedGame) return
        alert(`Starting generated game: ${generatedGame.name}\n\n(In real impl this would load a custom rulebook/dungeon with AI-generated cards and assets. For now, launching normal run with note.)`)
        setShowGenModal(false)
        // For demo, just start a normal game (could extend to custom state)
        if (userDoc?.userId) {
            handleStartGame(userDoc.userId)
        } else if (accounts.length > 0) {
            loginWithAccount(accounts[0].userId, xHandle || 'gen_player').then(() => {
                // start after
            })
        }
    }

    // Stubs for other demo buttons (may have been added previously)
    const startDaily = () => {
        alert('Starting daily seed run (demo)')
        if (userDoc?.userId) handleStartGame(userDoc.userId)
    }
    const startCollectionAdventure = () => {
        alert('Starting collection adventure (demo)')
        if (userDoc?.userId) handleStartGame(userDoc.userId)
    }

    return <>
        {showTutorial && <TutorialModal setShowTutorial={setShowTutorial} />}
        {showClosedGameModal && <ClosedGameModal setShowModal={setShowClosedGameModal} />}
        {showUsernameModal && <UsernameModal
            setShowModal={setShowUsernameModal}
            userDoc={userDoc}
            setUserDoc={setUserDoc}
            onSuccess={handleStartGame}
        />}

        {/* Account Manager Modal: list, add by username, delete. 4 max limit */}
        {showAccountManager && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70" onClick={() => setShowAccountManager(false)}>
                <div className="bg-[#1f1e3a] text-white p-8 rounded-xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bigFont uppercase mb-1 text-center">Accounts ({accounts.length}/{4})</h2>
                    <p className="text-center text-sm opacity-70 mb-4">Max 4 local accounts. Type a unique username to add. Overwrite reuses slot by replacing existing record.</p>
                    {!xLoggedIn ? (
                        <button onClick={handleLoginWithX} className="mt-2 w-full py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded text-white">
                            Login with X to unlock Generative AI (Grok Imagine)
                        </button>
                    ) : (
                        <div className="mt-2 text-center text-xs text-green-400">X logged in as {xHandle} • Generative unlocked</div>
                    )}
                    <div className="mt-1 text-center text-[10px] opacity-50">Roadmap: ROADMAP-asset-generation.md</div>

                    <div className="flex flex-col gap-2 mb-4">
                        {accounts.length === 0 && (
                            <div className="text-center text-sm opacity-60 py-2">No accounts yet. Add one below.</div>
                        )}
                        {accounts.map(acc => {
                            const label = acc.username || acc.userId
                            return (
                                <div key={acc.userId} className="flex items-center gap-2 bg-[#2a2744] rounded px-3 py-2">
                                    <button
                                        onClick={() => handlePick(acc)}
                                        className="flex-1 text-left py-1 px-2 hover:bg-white/5 rounded text-lg"
                                    >
                                        {label}
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(acc.userId, e)}
                                        className="text-red-400 px-2 text-sm hover:text-red-300"
                                        title="Delete account"
                                        disabled={isWorking}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    {accounts.length < 4 ? (
                        <div className="border-t border-white/20 pt-4">
                            <div className="text-sm mb-2 opacity-80">Add new account (unique username)</div>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-stone-700 rounded px-3 py-2 font-mono text-white focus:outline-none"
                                    placeholder="username"
                                    value={newUsername}
                                    maxLength={20}
                                    onChange={e => { setNewUsername(e.target.value); if (lastTakenUsername) setLastTakenUsername('') }}
                                    onKeyDown={e => { if (e.key === 'Enter') handleAddAccount() }}
                                    disabled={isWorking}
                                />
                                <button
                                    onClick={() => handleAddAccount(false)}
                                    disabled={isWorking || !newUsername.trim()}
                                    className="px-4 py-2 bg-[#5a4a8a] hover:brightness-110 rounded disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>
                            {accountError && <div className="text-red-400 text-xs mt-1">{accountError}</div>}
                            {lastTakenUsername && (
                                <button
                                    onClick={() => handleAddAccount(true)}
                                    disabled={isWorking}
                                    className="mt-2 px-3 py-1 text-xs bg-red-800 hover:bg-red-700 rounded text-white"
                                >
                                    Overwrite existing '{lastTakenUsername}' (deletes its progress)
                                </button>
                            )}
                            <div className="text-[10px] opacity-50 mt-1">3-20 chars, letters/numbers/_- . Use overwrite to reuse a taken name's slot.</div>
                        </div>
                    ) : (
                        <div className="text-xs text-center opacity-70">At 4 account limit. Delete one to add another.</div>
                    )}

                    <button className="mt-6 w-full text-xs underline opacity-60" onClick={() => setShowAccountManager(false)}>close</button>
                </div>
            </div>
        )}

        {/* Generative AI Game Generator Modal (from main menu, requires X login) */}
        {showGenModal && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80" onClick={() => setShowGenModal(false)}>
                <div className="bg-[#1f1e3a] text-white p-8 rounded-xl max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bigFont uppercase mb-2 text-center">Generate Game with Grok AI</h2>
                    <p className="text-center text-sm opacity-70 mb-4">Logged in as {xHandle}. Prompt a world + style. Uses Grok Imagine for assets + generative text for new cards/world.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs opacity-70">World prompt (e.g. post-apocalyptic city with mutant kaiju)</label>
                            <textarea
                                className="w-full mt-1 bg-stone-700 rounded p-3 text-sm font-mono"
                                placeholder="Describe the world..."
                                value={worldPrompt}
                                onChange={e => setWorldPrompt(e.target.value)}
                                rows={3}
                                disabled={genLoading}
                            />
                        </div>
                        <div>
                            <label className="text-xs opacity-70">Style (e.g. dark cyberpunk, cute chibi, grim fantasy)</label>
                            <input
                                className="w-full mt-1 bg-stone-700 rounded p-3 text-sm"
                                placeholder="Art style..."
                                value={stylePrompt}
                                onChange={e => setStylePrompt(e.target.value)}
                                disabled={genLoading}
                            />
                        </div>
                    </div>

                    {!generatedGame ? (
                        <button
                            onClick={handleGenerateGame}
                            disabled={genLoading || !worldPrompt.trim()}
                            className="mt-6 w-full py-3 bg-[#5a4a8a] hover:brightness-110 rounded text-lg disabled:opacity-50"
                        >
                            {genLoading ? 'Generating with Grok Imagine...' : 'Generate Game'}
                        </button>
                    ) : (
                        <div className="mt-4">
                            <div className="bg-black/30 p-3 rounded text-sm mb-2">
                                <strong>{generatedGame.name}</strong><br/>
                                {generatedGame.desc}<br/><br/>
                                <em>Style: {generatedGame.style}</em><br/>
                                Sample cards: {generatedGame.cards.map((c: any) => c.name).join(', ')}
                            </div>
                            <img src={generatedGame.image} alt="generated art" className="w-full rounded mb-2" />
                            <button onClick={handlePlayGenerated} className="w-full py-2 bg-green-600 hover:bg-green-500 rounded">Play this Generated Game</button>
                            <button onClick={() => { setGeneratedGame(null); setWorldPrompt(''); setStylePrompt('') }} className="mt-2 w-full py-1 text-xs underline">Generate another</button>
                        </div>
                    )}

                    <button className="mt-4 w-full text-xs underline opacity-60" onClick={() => setShowGenModal(false)}>close</button>
                    <div className="text-[9px] opacity-40 mt-2 text-center">Real version would call xAI Grok for text + Imagine API for unique art. Saved to your compendium.</div>
                </div>
            </div>
        )}

        <div className={`font-bigFont grid grid-rows-4 absolute left-0 w-full h-full z-0 pointer-events-auto`}>
            <video
                src='./assets/backgrounds/main_menu_shed_bg.mp4'
                autoPlay
                muted
                loop
                className='w-full max-w-full absolute -z-50'
            />

            <div className='nav w-full row-span-1 flex p-2 xs:p-4 lg:p-8 justify-between items-start'>
                <div className='flex flex-col items-center w-1/6 cursor-pointer hover:scale-105 transition text-white '>
                    <img src='./logos/KaijuCards.png' />
                    <p className='uppercase pt-4 font-bigFont text-sm md:text-base tracking-widest text-stone-300 text-center opacity-50'>
                        demo {BUILD_VER}
                    </p>
                </div>
                <div className='navRight flex justify-between sm:pl-12 xs:pl-6 items-start w-full pt-4 md:pt-6'>
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
                    <div className='text-white text-right pointer-events-auto'>
                        <div className='text-[10px] opacity-50 mb-0.5'>{accounts.length}/4 accounts</div>
                        {userDoc && userDoc.userId ? (
                            <div>
                                <div className='text-xs'>playing as</div>
                                <button className='font-mono text-sm hover:underline' onClick={openAccountManager}>
                                    {userDoc.username || userDoc.userId}
                                </button>
                                {xLoggedIn && <div className='text-[10px] text-blue-400'>X: {xHandle}</div>}
                                <div>
                                    <button className='text-red-400 text-xs mt-1' onClick={openAccountManager}>
                                        switch / manage accounts
                                    </button>
                                    {!xLoggedIn && <button className='text-blue-400 text-xs mt-1 ml-2' onClick={handleLoginWithX}>login w/ X for AI</button>}
                                </div>
                            </div>
                        ) : (
                            <button className='text-xs opacity-60 hover:underline' onClick={openAccountManager}>pick account to play</button>
                        )}
                    </div>
                </div>
            </div>

            <div className='bottom h-full p-2 row-span-3 grid grid-cols-12'>
                <div className='left-buttons h-full col-span-2 flex flex-col justify-end gap-2 lg:gap-4 xl:gap-6 px-3 p-2  xl:p-10'></div>
                <div className='mid-buttons h-full col-span-8 flex items-end gap-2 sm:gap-8 p-1 sm:p-2 xl:p-10'>
                    <div className='h-auto w-full flex xl:pt-4 gap-4 md:gap-8 xl:gap-12'>
                        <PrimaryButton text='tutorial' onClick={handleTutorialClick} type='secondary' size='large' />
                        <PrimaryButton text='daily seed' onClick={startDaily} type='primary' size='large' />
                        <PrimaryButton text='collection adventure' onClick={startCollectionAdventure} type='primary' size='large' />
                        {xLoggedIn && (
                            <PrimaryButton text='generate game' onClick={() => { setShowGenModal(true); setGeneratedGame(null) }} type='secondary' size='large' />
                        )}
                    </div>
                </div>
                <div className='right-buttons h-full col-span-2 flex flex-col justify-end gap-2 sm:gap-4 xl:gap-6 p-1 px-3 sm:p-2 md:px-4 xl:p-10'></div>
                <button
                  onClick={() => { void callApi('changeScene', { newSceneName: 'showcase' } as any) }}
                  className="absolute bottom-3 right-3 text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-white"
                >
                  all characters anims
                </button>
            </div>
        </div>
    </>
}
