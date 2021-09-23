
export const attackBus = {
    subscribers: [(d: AttackData) => { d }],
    emit(d: AttackData) {
        this.subscribers.forEach(s => s(d))
    },
    subscribe(callback: (d: AttackData) => void) {
        this.subscribers.push(callback)
    }
}
