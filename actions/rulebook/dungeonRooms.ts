type RoomLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type DoorLetter = string//'A' | 'B' | 'C' | 'D'
type EnemyName = string
type EnemyLevel = number
type Probability = number
type Outcome = [EnemyName, EnemyLevel][]
type RoomMaker = {
    outcomes: Outcome[]
    probs: Probability[]
}

const dungeonRooms: Record<RoomLevel, Record<DoorLetter, RoomMaker>> = {
    1: {
        A: { outcomes: [[['matcha', 1]], [['skeleton', 1], ['skeleton', 1]]], probs: [.5, .5] },
        B: { outcomes: [[['matcha', 3]], [['skeleton', 2]]], probs: [.5, .5] },
    }, 2: { // TODO: A
        A: { outcomes: [[['matcha', 1]], [['skeleton', 1], ['skeleton', 1]]], probs: [.5, .5] },
        B: { outcomes: [[['skeleton', 4], ['matcha', 1]], [['skeleton', 4], ['skeleton', 1]]], probs: [.5, .5] },
        C: { outcomes: [[['skeleton', 5]]], probs: [1] },
    }, 3: {
        A: {
            outcomes: [
                [['matcha', 3], ['matcha', 2]], [['matcha', 3], ['skeleton', 2]],
                [['skeleton', 3], ['matcha', 2]], [['skeleton', 3], ['skeleton', 2]]],
            probs: [.25, .25, .25, .25]
        },
        B: { outcomes: [[['skeleton', 5]], [['matcha', 5]]], probs: [.5, .5] },
        C: {
            outcomes: [
                [['matcha', 2], ['matcha', 2], ['matcha', 2], ['matcha', 2]],
                [['skeleton', 2], ['skeleton', 2], ['skeleton', 2], ['skeleton', 2]],
            ],
            probs: [.5, .5]
        },
    }, 4: {  // TODO: A
        A: { outcomes: [[['matcha', 8]], [['skeleton', 8]]], probs: [.5, .5] },
    }, 5: {  // TODO: A, C
        A: { outcomes: [[['matcha', 8]], [['skeleton', 8]]], probs: [.5, .5] },
    }, 6: {  // TODO: A
        A: { outcomes: [[['matcha', 8]], [['skeleton', 8]]], probs: [.5, .5] },
    }, 7: {  // TODO: B
        A: { outcomes: [[['matcha', 8]], [['skeleton', 8]]], probs: [.5, .5] },
    }, 8: { // boss
        A: { outcomes: [[['matcha', 8]], [['skeleton', 8]]], probs: [.5, .5] },
    }
}

validate(dungeonRooms)
console.log('dungeon rooms are ok')


function validate(dr: typeof dungeonRooms): void {
    for (const [num, level] of Object.entries(dr)) {
        for (const [letter, roomMaker] of Object.entries(level)) {
            if (roomMaker.outcomes.length !== roomMaker.probs.length) {
                throw Error(`dungeonRooms[${num}][${letter}] has wrong number of probs`)
            }
            if (sum(roomMaker.probs) !== 1) {
                throw Error(`dungeonRooms[${num}][${letter}] probabilities do not sum to 1`)
            }
        }
    }
}

function sum(arr: number[]): number {
    let total = 0
    for (const x of arr) total += x
    return total
}
