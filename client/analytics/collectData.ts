import { UserID } from 'shared'

let currUserId: string | null = null

export const collectData = <T extends keyof AnalyticsEventMeta>(
    eventName: T,
    params: AnalyticsEventMeta[T]
) => {
    if (!currUserId) {
        console.log('Init analytics with no currUserId')
        const localUserId = localStorage.getItem('username')
        if (localUserId === null) {
            console.error('No username in localstorage or initialized. UserID analytics disabled.')
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
        page_title: PageTitle
    }
    enter_game: Empty
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

type AnalyticsLoginMethods = 'connect_wallet'

type PageTitle =
    | 'Battle Scene'
    | 'End of Run Screen'
    | 'Hex Map'
    | 'Rest Site'
    | 'Character Select'
    | 'Start Screen'

export type AnalyticsEvents = {
    [K in keyof AnalyticsEventMeta]: (args: AnalyticsEventMeta[K]) => void
}
