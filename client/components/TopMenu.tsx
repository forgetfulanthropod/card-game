import { PrimaryButton } from './StartScreen/'
import { callApi } from '@/callApi'
import { collectData } from '@/analytics/collectData'

/**
 * TopMenu: Daily | Worlds | PVP | Shop | Creator Hub
 * Daily ONLY mode with NO CHARACTER SELECTION.
 */
export function TopMenu(props: { onStart?: (mode: string) => void }) {
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

        if (mode === 'daily') {
            // NO CHARACTER SELECTION – ONLY MODE
            await callApi('prepareRun', { userId, daily: true, enhanced: true, autoStart: true } as any)
            // already in battle
            return
        }
        if (mode === 'worlds') {
            await callApi('prepareRun', { userId, daily: false, plain: true } as any)
            // force worlds selection entry (uses DungeonEntry base)
            await callApi('changeScene', { newSceneName: 'worlds' } as any)
            return
        }
        if (mode === 'pvp') {
            await callApi('prepareRun', { userId, daily: false, plain: true } as any)
            await callApi('changeScene', { newSceneName: 'pvp' } as any)
            return
        }
        if (mode === 'shop' || mode === 'creator') {
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
