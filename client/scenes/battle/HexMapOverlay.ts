import { Texture } from 'pixi.js'
import type { CharacterMeta, DungeonRoom } from 'shared'
import { keys, vals } from 'shared/code'

import { AdjustmentFilter } from 'pixi-filters'
import { MainCharacterAnimation } from '../shared'
import type { PixiContainer, PixiSprite } from '@/elementsUtil'
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
        VideoBackground({
            name: 'mapBg',
            src: 'assets/hex map/dungeon test bg for export.mp4',
            scale: 1,
        }),
        Container({}, ...AllTiles())
    )
}

function AllTiles(): PixiContainer[] {
    const tileGraphMap = getTileGraphMap()
    const rootNode = tileGraphMap[keys(tileGraphMap)[0]]
    const allTiles: PixiContainer[] = []

    addNodeAbove(rootNode, 1, 0)
    addNode(rootNode, 1, 0)
    addNodeBelow(rootNode, 1, 0)

    return sortAndRemoveDuplicates(allTiles)

    function addNodeAbove(node: MapNode, depth: number, yOffset: number) {
        const nextNode = tileGraphMap[node.edges[0]]
        const nextDepth = depth + 1
        const nextYOffset = yOffset - 1

        addNode(nextNode, nextDepth, nextYOffset)
        if (nextNode) {
            addNodeAbove(nextNode, nextDepth, nextYOffset)
            addNodeBelow(nextNode, nextDepth, nextYOffset)
        }
        return nextNode
    }

    function addNodeBelow(node: MapNode, depth: number, yOffset: number) {
        const nextNode = tileGraphMap[node.edges[1]]
        const nextDepth = depth + 1
        const nextYOffset = yOffset + 1

        addNode(nextNode, nextDepth, nextYOffset)
        if (nextNode) {
            addNodeAbove(nextNode, nextDepth, nextYOffset)
            addNodeBelow(nextNode, nextDepth, nextYOffset)
        }
        return nextNode
    }

    function addNode(node: MapNode, depth: number, yOffset: number) {
        allTiles.push(TileForNode(node, depth, yOffset))
    }
}

function sortAndRemoveDuplicates(allTiles: PixiContainer[]) {
    const sorted = allTiles.sort((tileA, tileB) => {
        return tileA.y - tileB.y
    })
    const unique = sorted.filter((tile, i) => {
        return ![...sorted.slice(0, i), ...sorted.slice(i + 1)].find(
            tile2 => tile2.x === tile.x && tile2.y === tile.y
        )
    })
    return unique
}

type MapNode = {
    depth: number
    enemies: DungeonRoom
    edges: [string, string]
}

function TileForNode(node: MapNode, depth: number, yOffset: number) {
    const texture = getTexture(`mapTile${depth !== 4 ? depth : 1}`)
    const displayWidth = (BASE_WIDTH / 7) * 2

    if (node == null) return Container({})

    const root = Container(
        {
            x: depth * displayWidth * 0.41,
            y: BASE_HEIGHT * 0.55 + displayWidth * 0.18 * yOffset,
            filters:
                depth > getBattleScene().get('numRoomsPassed') + 2 ||
                node == null
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

function TileContents(node: MapNode | null): PixiContainer {
    if (node == null) return Container({})
    const scene = getBattleScene()
    const passed = scene.get('numRoomsPassed')

    // TODO: node should be null after it's passed
    if (node.enemies[0]?.id === 'REST_SITE' && passed < node.depth)
        return RestSiteContents(node)

    return TileCharacters(node)
}

function RestSiteContents(node: MapNode): PixiSprite {
    const src = getTexture('mapRestSite')

    const numRoomsPassed = getBattleScene().get('numRoomsPassed')

    const root = Sprite({
        scale: 255 / src.width,
        src: 'mapRestSite',
        anchor: 0.5,
        events: {
            pointerdown() {
                void callApi('confirmNextRoom', {})
            },
            pointerover() {
                if (numRoomsPassed + 1 === node.depth)
                    root.filters = [glowFilter]
            },
            pointerout() {
                root.filters = []
            },
        },
    })

    return root
}

function TileCharacters(node: MapNode): PixiContainer {
    const scene = getBattleScene()
    const numRoomsPassed = scene.get('numRoomsPassed')

    const characters: CharacterMeta[] =
        numRoomsPassed === node.depth
            ? vals(scene.get('allCharacters')).filter(
                  c => c.isPc && c.health > 0
              )
            : node.depth < numRoomsPassed
            ? []
            : node.enemies.map(
                  (e): CharacterMeta =>
                      ({ id: e.id, isPc: false } as CharacterMeta)
              )

    const root = Container(
        {
            scale: 0.55,
            y: -60,
            x: characters?.[0]?.isPc ? -60 : 0,
            events: {
                pointerover() {
                    if (numRoomsPassed + 1 === node.depth)
                        root.filters = [glowFilter]
                },
                pointerout() {
                    root.filters = []
                },
                pointerdown() {
                    if (numRoomsPassed + 1 === node.depth)
                        void callApi('confirmNextRoom', {})
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

            if (numRoomsPassed + 1 !== node.depth) anim.cursor = 'default'

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

function getTileGraphMap(): Record<NodeUid, MapNode> {
    // TODO: copied from game/rooms.ts
    const rooms = getBattleScene().get('rooms')

    console.log({ rooms })

    const graph: Record<NodeUid, MapNode> = {
        'room 0': {
            depth: 0,
            enemies: [],
            edges: ['', getNodeId(0)],
        },
    }

    rooms.forEach((room, i) => {
        const edges: [string, string] = ['', getNodeId(i + 1)]
        if ((i + 1) % 2) edges.reverse()

        graph[getNodeId(i)] = {
            depth: i + 1,
            enemies: rooms[i],
            edges,
        }
    })

    return graph
}

type NodeUid = string

function getNodeId(i: number): NodeUid {
    return `${i}-${i % 2 ? 'a' : 'b'}`
}
