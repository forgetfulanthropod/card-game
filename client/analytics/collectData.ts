import { getStringFromLocalStorage } from '@/elementsUtil'
import { UserID } from 'shared'

let currUserId: string | null = null

export const collectData = <T extends keyof AnalyticsEventMeta>(
    eventName: T,
    params: AnalyticsEventMeta[T]
) => {
    if (!currUserId) {
        console.log('Init analytics with no currUserId')
        const localUserId = getStringFromLocalStorage('username')
        if (localUserId === null) {
            console.warn(
                'No username in localstorage or initialized. UserID analytics disabled.'
            )
            return
        } else {
            initAnalytics(localUserId)
        }
    }
    gtag('event', eventName, params)
}

export const initAnalytics = (userId: UserID) => {
    console.log('Init analytics for', userId)
    currUserId = userId
    gtag('set', {
        user_id: userId,
    })
    localStorage.setItem('username', userId)
}

type AnalyticsEventMeta = {
    level_start: AnalyticsRoomEventParams
    level_end: AnalyticsRoomEventParams
    run_start: AnalyticsRunEventParams
    run_end: AnalyticsRunEventParams
    login: {
        method: AnalyticsLoginMethods
    }
    ui_ux_view: {
        page_title: AnalyticsPageTitle
    }
    enter_game: Empty
    tutorial_begin: Empty
    tutorial_complete: Empty
}

type AnalyticsRoomEventParams = {
    room_number: number
    room_id: string
    room_tier: string | undefined
    run_id: number | null
}

type AnalyticsRunEventParams = {
    map_seed: number
    run_id: number | null
}

type AnalyticsLoginMethods = 'connect_wallet' | 'guest_user'

type AnalyticsPageTitle =
    | 'Battle Scene'
    | 'End of Run Screen'
    | 'Hex Map'
    | 'Rest Site'
    | 'Event Scene'
    | 'Character Select'
    | 'Start Screen'

export type AnalyticsEvents = {
    [K in keyof AnalyticsEventMeta]: (args: AnalyticsEventMeta[K]) => void
}
