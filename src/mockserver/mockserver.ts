
type DidSucceed = boolean

type AuthLevel = 'admin' | 'user'
type Items = {
    color: string
    name: string
    level: number
}[]

// interface Endpoint {
//     "authLevel": AuthLevel
//     "getItems": Items
//     "makeMove": DidSucceed
// }

interface Move { move: { name: string, target: number } }

// interface Args {
//     authLevel: null
//     getItems: null
//     makeMove:  Move
// }

export function fetchAuthLevel(): AuthLevel {
    return 'user'
}

export function fetchItems(): Items {
    return [{ color: 'red', name: 'sword', level: 1 }]

}

export function makeMove(m: Move): DidSucceed {
    if (m.move.name === 'punch') {
        return true
    }
    return false
}
