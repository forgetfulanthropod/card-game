
export const attackBus = {
    subscribers: <((ad: AttackData) => void)[]>[],
    emit(d: AttackData): void {
        this.subscribers.forEach(s => s(d))
    },
    subscribe(callback: (d: AttackData) => void): void {
        this.subscribers.push(callback)
    }
}
