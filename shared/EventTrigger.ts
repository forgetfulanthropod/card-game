

export interface EventTrigger {
    name: EventTriggerName
    shortDescription: string
    fullDescription: string
}

export type EventTriggersMap = Record<EventTriggerName, EventTrigger>
export type EventTriggerName = 'carriage' | 'clearing' | 'hats' | 'gnome' | 'babysitting' | 'baron'
