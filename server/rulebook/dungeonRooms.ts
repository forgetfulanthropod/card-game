import type { CharacterName, DungeonRooms } from '@shared'

const config = {
    doValidation: false,
}

// type RoomLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
// type DoorLetter = string//'A' | 'B' | 'C' | 'D'

// https://www.notion.so/combat-mechanics-1-2-as-list-b095bf5399d546ae9d15d31134e5ca10#964bc1d3db774a29ba80df49fac856db

const m: CharacterName = 'matchaGelatinCube'
const s: CharacterName = 'skeletonWarrior'
const mimic: CharacterName = 'mimic'

export const dungeonRooms: DungeonRooms = {
    1: {
        A: {
            outcomes: [
                [[m, 1]],
                [
                    [s, 1],
                    [s, 1],
                ],
            ],
            probs: [0.5, 0.5],
        },
        B: { outcomes: [[[m, 3]], [[s, 2]]], probs: [0.5, 0.5] },
    },
    2: {
        A: {
            outcomes: [
                [
                    [m, 1],
                    [m, 1],
                ],
                [
                    [s, 1],
                    [s, 1],
                ],
                [[m, 2]],
                [[s, 2]],
            ],
            probs: [0.25, 0.25, 0.25, 0.25],
        },
        B: {
            outcomes: [
                [
                    [s, 4],
                    [m, 1],
                ],
                [
                    [s, 4],
                    [s, 1],
                ],
            ],
            probs: [0.5, 0.5],
        },
        C: { outcomes: [[[s, 5]]], probs: [1] },
    },
    3: {
        A: {
            outcomes: [
                [
                    [m, 3],
                    [m, 2],
                ],
                [
                    [m, 3],
                    [s, 2],
                ],
                [
                    [s, 3],
                    [m, 2],
                ],
                [
                    [s, 3],
                    [s, 2],
                ],
            ],
            probs: [0.25, 0.25, 0.25, 0.25],
        },
        B: { outcomes: [[[s, 5]], [[m, 5]]], probs: [0.5, 0.5] },
        C: {
            outcomes: [
                [
                    [m, 2],
                    [m, 2],
                    [m, 2],
                    [m, 2],
                ],
                [
                    [s, 2],
                    [s, 2],
                    [s, 2],
                    [s, 2],
                ],
            ],
            probs: [0.5, 0.5],
        },
    },
    4: {
        // TODO: cases below
        A: { outcomes: [[[m, 8]], [[s, 8]]], probs: [0.5, 0.5] },
    },
    5: {
        A: { outcomes: [[[m, 8]], [[s, 8]]], probs: [0.5, 0.5] },
    },
    6: {
        A: { outcomes: [[[mimic, 5]]], probs: [1] },
    },
    7: {
        A: { outcomes: [[[m, 8]], [[s, 8]]], probs: [0.5, 0.5] },
    },
    8: {
        // boss
        A: { outcomes: [[[m, 8]], [[s, 8]]], probs: [0.5, 0.5] },
    },
}

if (config.doValidation) {
    validate(dungeonRooms)
    logger.info('dungeon rooms are ok')
}

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
