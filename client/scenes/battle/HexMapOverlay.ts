import { Texture } from 'pixi.js'
import type {
    CharacterMeta,
    DungeonRoom,
    DungeonRoomMap,
    RoomEnemies,
    RoomUid,
} from 'shared'
import { keys, vals } from 'shared/code'

import { AdjustmentFilter } from 'pixi-filters'
import { checkOtherScoringEvents, MainCharacterAnimation } from '../shared'
import type { AssetKey, PixiContainer, PixiSprite } from '@/elementsUtil'
import {
    glowFilter,
    Adjust,
    getTexture,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    Sprite,
    VideoBackground,
} from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { callApi } from '@/callApi'
import { hoveredCharacterUid } from '@/util'
import { Background } from '../background'

export function HexMapOverlay(): PixiContainer {
    hoveredCharacterUid.set(null)

    return Container(
        {},
        Sprite({
            src: Texture.WHITE,
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            tint: 0x000011,
            events: {
                pointerdown() {},
            },
            defaultCursor: true,
        }),
        Background({
            srcs: ['hooligansBluffHexMapBg'],
            scale: 1,
        }),
        // VideoBackground({
        //     name: 'mapBg',
        //     src: 'mapBg',
        //     scale: 1,
        // }),
        Container({}, ...AllTiles())
    )
}

function AllTiles(): PixiContainer[] {
    const tileGraphMap = getTileGraphMap()
    const rootNode = tileGraphMap[keys(tileGraphMap)[0]]
    const allTiles: PixiContainer[] = []

    addNodeAboveRight(rootNode, 1, 0)
    addNode(rootNode, 1, 0)
    addNodeBelowRight(rootNode, 1, 0)

    return sortAndRemoveDuplicates(allTiles)

    function addNodeAbove(node: DungeonRoom, depth: number, yOffset: number) {
        const nextNode = tileGraphMap[node.edges[0]]
        const nextDepth = depth
        const nextYOffset = yOffset - 2

        if (nextNode) {
            addBranchingNodes(nextNode, nextDepth, nextYOffset)
        }
        return nextNode
    }

    function addNodeAboveRight(
        node: DungeonRoom,
        depth: number,
        yOffset: number
    ) {
        const nextNode = tileGraphMap[node.edges[1]]
        const nextDepth = depth + 1
        const nextYOffset = yOffset - 1

        if (nextNode) {
            addBranchingNodes(nextNode, nextDepth, nextYOffset)
        }
        return nextNode
    }

    function addNodeBelowRight(
        node: DungeonRoom,
        depth: number,
        yOffset: number
    ) {
        const nextNode = tileGraphMap[node.edges[2]]
        const nextDepth = depth + 1
        const nextYOffset = yOffset + 1

        if (nextNode) {
            addBranchingNodes(nextNode, nextDepth, nextYOffset)
        }
        return nextNode
    }

    function addNodeBelow(node: DungeonRoom, depth: number, yOffset: number) {
        const nextNode = tileGraphMap[node.edges[3]]
        const nextDepth = depth
        const nextYOffset = yOffset + 2

        if (nextNode) {
            addBranchingNodes(nextNode, nextDepth, nextYOffset)
        }
        return nextNode
    }

    function addBranchingNodes(
        nextNode: DungeonRoom,
        nextDepth: number,
        nextYOffset: number
    ) {
        addNodeAbove(nextNode, nextDepth, nextYOffset)
        addNodeAboveRight(nextNode, nextDepth, nextYOffset)
        addNode(nextNode, nextDepth, nextYOffset)
        addNodeBelow(nextNode, nextDepth, nextYOffset)
        addNodeBelowRight(nextNode, nextDepth, nextYOffset)
    }

    function addNode(node: DungeonRoom, depth: number, yOffset: number) {
        allTiles.push(TileForNode(node, depth, yOffset))
    }
}

function sortAndRemoveDuplicates(allTiles: PixiContainer[]) {
    const sorted = allTiles.sort((tileA, tileB) => {
        return tileA.y - tileB.y
    })
    const unique = sorted.filter((tile, i) => {
        return !sorted
            .slice(0, i)
            .find(tile2 => tile2.x === tile.x && tile2.y === tile.y)
    })
    return unique
}

// type DungeonRoom = {
//     depth: number
//     enemies: RoomEnemies
//     edges: [string, string]
// }

function TileForNode(node: DungeonRoom, depth: number, yOffset: number) {
    const texture = getTexture(`mapTile${depth !== 4 ? depth : 1}` as AssetKey)
    const displayWidth = BASE_WIDTH * 0.24

    if (node == null) return Container({})

    const { choice } = getCurrentRoomAndChoiceFromNode(node)

    const root = Container(
        {
            x: depth * displayWidth * 0.41,
            y: BASE_HEIGHT * 0.8 + displayWidth * 0.18 * yOffset,
            filters: !~choice
                ? [new AdjustmentFilter({ brightness: 0.5 })]
                : [],
        },
        Sprite({
            src: texture,
            scale: displayWidth / texture.width,
            anchor: [0.5, 0.42],
            // alpha: node == null ? 0.4 : 1,
        }),
        TileContents(node)
    )

    return root
}

function TileContents(node: DungeonRoom | null): PixiContainer {
    if (node == null) return Container({})
    const scene = getBattleScene()
    const passed = scene.get('numRoomsPassed')

    if (node.enemies[0]?.id === 'REST_SITE') return RestSiteContents(node)

    return TileCharacters(node)
}

function RestSiteContents(node: DungeonRoom): PixiSprite {
    const src = getTexture('mapRestSite')

    const { choice } = getCurrentRoomAndChoiceFromNode(node)

    const root = Sprite({
        scale: 255 / src.width,
        src: 'mapRestSite',
        anchor: 0.5,
        events: {
            pointerdown() {
                if (~choice) void callApi('nextRoom', { choice })
            },
            pointerover() {
                if (~choice) root.filters = [glowFilter]
            },
            pointerout() {
                root.filters = []
            },
        },
    })

    return root
}

function TileCharacters(node: DungeonRoom): PixiContainer {
    const scene = getBattleScene()
    const numRoomsPassed = scene.get('numRoomsPassed')

    const { currentRoom, choice } = getCurrentRoomAndChoiceFromNode(node)

    const nodeDepth = parseInt(node.uid.split('_')[0])
    const isPlayerCharacterRoom = currentRoom.uid === node.uid

    const characters: CharacterMeta[] = isPlayerCharacterRoom
        ? vals(scene.get('allCharacters')).filter(c => c.isPc && c.health > 0)
        : nodeDepth <= numRoomsPassed
        ? []
        : node.enemies.map(
              (e): CharacterMeta => ({ id: e.id, isPc: false } as CharacterMeta)
          )

    const root = Container(
        {
            scale: 0.55,
            y: -60,
            x: characters?.[0]?.isPc ? -60 : 0,
            events: {
                pointerdown() {
                    if (~checkOtherScoringEvents)
                        void callApi('nextRoom', { choice })
                },
                pointerover() {
                    if (~choice && !isPlayerCharacterRoom)
                        root.filters = [glowFilter]
                },
                pointerout() {
                    root.filters = []
                },
            },
        },
        ...characters.map((characterMeta, i) => {
            const anim = MainCharacterAnimation({
                characterMeta,
                events: {
                    pointerover() {},
                    pointerdown() {},
                },
            })

            if (anim == null) throw new Error('missing a spine broken')

            if (!~choice && !isPlayerCharacterRoom)
                setTimeout(
                    () => (anim.state.timeScale = 0),
                    Math.random() * 1000
                )

            if (!~choice) anim.cursor = 'default'

            return Adjust(anim, {
                x: characterMeta.isPc
                    ? 120 * (2 - i)
                    : i === 2
                    ? -50
                    : 180 * i - 50,
                y: characters.length === 1 ? 110 : 110 * i,
            })
        })
    )

    return root
}

function getCurrentRoomAndChoiceFromNode(node: DungeonRoom) {
    const currentRoom = getBattleScene().get('currentRoom')
    const choice = currentRoom.edges.findIndex(edge => edge === node.uid) as
        | 0
        | 1
        | 2
        | 3
    return { currentRoom, choice }
}

function getTileGraphMap(): DungeonRoomMap {
    console.log({ rooms: getBattleScene().get('rooms') })

    return getBattleScene().get('rooms')

    // TODO: copied from game/rooms.ts
    // const rooms = getBattleScene().get('rooms')

    // console.log({ rooms })

    // const graph: Record<RoomUid, MapNode> = {
    //     'room 0': {
    //         depth: 0,
    //         enemies: [],
    //         edges: ['', getNodeId(0)],
    //     },
    // }

    // rooms.forEach((room, i) => {
    //     const edges: [string, string] = ['', getNodeId(i + 1)]
    //     if ((i + 1) % 2) edges.reverse()

    //     graph[getNodeId(i)] = {
    //         depth: i + 1,
    //         enemies: rooms[i],
    //         edges,
    //     }
    // })

    // return graph
}

// type RoomUid = string

function getNodeId(i: number): RoomUid {
    return `${i}-${i % 2 ? 'a' : 'b'}`
}
