import { PrimaryButton } from './StartScreen/'
import { callApi } from '@/callApi'
import { collectData } from '@/analytics/collectData'
import { getPromiseForTreeInitialized } from '@/data'
import { getStage, assetsLoadedPromise } from '@/elementsUtil'
import { useContext } from 'react'
import { AppContext } from './App'

/**
 * TopMenu: Daily | Worlds | PVP | Shop | Creator Hub
 * Daily ONLY mode with NO CHARACTER SELECTION.
 */
export function TopMenu(props: { onStart?: (mode: string) => void }) {
    const { setUserId, setInPixi } = useContext(AppContext)

    const startMode = async (mode: 'daily' | 'worlds' | 'pvp' | 'shop' | 'creator') => {
        collectData('main_menu_click', { mode })
        const docRes = await callApi('listAccounts', {}) as any
        const accounts = (docRes?.accounts || [])
        let userId = accounts[0]?.userId
        if (!userId) {
            const create = await callApi('createAccount', { username: 'player-menu' }) as any
            userId = create?.userId
        }
        if (!userId) return

        // ensure account/login similar to NewStartScreen
        try {
            await callApi('login', { accountId: userId, socketId: (window as any).socket?.id } as any)
        } catch {}

        if (mode === 'daily') {
            // NO CHARACTER SELECTION – ONLY MODE
            await callApi('prepareRun', { userId, daily: true, enhanced: true, autoStart: true, sceneId: 'daily' } as any)
            // activate pixi (critical - was missing)
            await assetsLoadedPromise().catch(() => {})
            await getPromiseForTreeInitialized().catch(() => {})
            setUserId(userId)
            setInPixi(true)
            try { getStage().visible = true } catch {}
            return
        }
        if (mode === 'worlds') {
            await callApi('prepareRun', { userId, daily: false, plain: true, sceneId: 'worlds' } as any)
            await assetsLoadedPromise().catch(() => {})
            await getPromiseForTreeInitialized().catch(() => {})
            setUserId(userId)
            setInPixi(true)
            try { getStage().visible = true } catch {}
            await callApi('changeScene', { newSceneName: 'worlds' } as any)
            return
        }
        if (mode === 'pvp') {
            await callApi('prepareRun', { userId, daily: false, plain: true, sceneId: 'pvp' } as any)
            await assetsLoadedPromise().catch(() => {})
            await getPromiseForTreeInitialized().catch(() => {})
            setUserId(userId)
            setInPixi(true)
            try { getStage().visible = true } catch {}
            // auto load strongest via pipeline-wired startQuick (exercises place + battle)
            const qm = await import('@/scenes/entry/QuickMatch')
            if (qm && qm.startQuickMatchPVP) await qm.startQuickMatchPVP().catch(() => {})
            // change to pvp scene if needed for UI, but quick goes to battle
            return
        }
        if (mode === 'shop' || mode === 'creator') {
            await assetsLoadedPromise().catch(() => {})
            await getPromiseForTreeInitialized().catch(() => {})
            setUserId(userId)
            setInPixi(true)
            try { getStage().visible = true } catch {}
            await callApi('changeScene', { newSceneName: mode } as any)
            return
        }
        props.onStart && props.onStart(mode)
    }

    return (
        <div className='flex flex-wrap gap-3 p-3 items-center justify-center'>
            <PrimaryButton text='Daily' onClick={() => void startMode('daily')} size='large' type='primary' />
            <PrimaryButton text='Worlds' onClick={() => void startMode('worlds')} size='large' type='primary' />
            <PrimaryButton text='PVP' onClick={() => void startMode('pvp')} size='large' type='primary' />
            <PrimaryButton text='Shop' onClick={() => void startMode('shop')} size='large' type='primary' />
            <PrimaryButton text='Creator Hub' onClick={() => void startMode('creator')} size='large' type='primary' />
        </div>
    )
}
