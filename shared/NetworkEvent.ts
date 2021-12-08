export interface NetworkEvent<Name extends string, Data> {
    type: Name
    sentAt: string
    uid: string
    data: Data
}
