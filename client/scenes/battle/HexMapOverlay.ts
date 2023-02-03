import { Texture } from 'pixi.js'
import type {
    BattleCursor,
    BattleScene,
    CharacterMeta,
    DungeonRoom,
    DungeonRoomMap,
    RoomEnemies,
    RoomUid,
} from 'shared'
import { keys, vals } from 'shared/code'

import { AdjustmentFilter } from 'pixi-filters'
import { MainCharacterAnimation } from '../shared'
import {
    AssetKey,
    loopSong,
    PixiContainer,
    PixiSprite,
    Spine,
} from '@/elementsUtil'
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
import { intersection, mean } from 'lodash'
import { ROCursor } from 'sbaobab'
import { collectData } from '@/analytics/collectData'

export function HexMapOverlay(): PixiContainer {
    collectData('ui_ux_view', { page_title: 'Hex Map' })
    hoveredCharacterUid.set(null)
    loopSong('hexMapMusicHooligansBluff')

    const spineBg = Spine({
        name: 'hooligansBluffHexMapBg',
        animation: 'animation',
        scale: 1.2,
    })

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
        Adjust(spineBg, { y: BASE_HEIGHT / 2 - spineBg.height * 0.52 }),
        // VideoBackground({
        //     name: 'mapBg',
        //     src: 'mapBg',
        //     scale: 1,
        // }),
        Container(
            {
                x: BASE_WIDTH * 0.05,
                y: BASE_HEIGHT * 0.75,
                // TODO: zoomed panning
                scale: 1.05,
            },
            ...AllTiles()
        )
    )
}

function AllTiles(): PixiContainer[] {
    const tileGraphMap = getTileGraphMap()
    const rootNode = tileGraphMap['root']
    const allTiles: PixiContainer[] = []
    let depthsAndYOffsets: [number, number][] = []

    addNodeAboveRight(rootNode, 1, 0)
    addNode(rootNode, 1, 0)
    addNodeBelowRight(rootNode, 1, 0)

    return sortNodes(allTiles)

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
        if (
            !depthsAndYOffsets.find(
                ([ndepth, nyOffset]) => ndepth === depth && nyOffset === yOffset
            )
        )
            depthsAndYOffsets.push([depth, yOffset])
        else return

        allTiles.push(TileForNode(node, depth, yOffset))
    }
}

function sortNodes(allTiles: PixiContainer[]) {
    return allTiles.sort((tileA, tileB) => {
        return tileA.y - tileB.y
    })
    // const unique = sorted.filter((tile, i) => {
    //     const passesFilter = !sorted
    //         .slice(0, i)
    //         .find(tile2 => tile2.x === tile.x && tile2.y === tile.y)

    //     if (!passesFilter) setTimeout(() => tile.destroy(true), 0)

    //     return passesFilter
    // })
    // return unique
}

// type DungeonRoom = {
//     depth: number
//     enemies: RoomEnemies
//     edges: [string, string]
// }

function TileForNode(node: DungeonRoom, depth: number, yOffset: number) {
    const texture = getTexture(`mapTile${depth !== 4 ? depth : 1}` as AssetKey)
    const displayWidth = BASE_WIDTH * 0.12

    if (node == null) return Container({})

    const { choice, currentRoom } = getCurrentRoomAndChoiceFromNode(node)

    const isPlayerCharacterRoom = currentRoom.uid === node.uid

    const filters =
        !~choice && !isPlayerCharacterRoom
            ? [new AdjustmentFilter({ brightness: 0.5 })]
            : []

    const root = Container(
        {
            x: depth * displayWidth * 0.78,
            y: displayWidth * 0.34 * yOffset,
            filters,
            events: {
                pointerdown() {
                    if (~choice) void callApi('nextRoom', { choice })
                },
                pointerover() {
                    if (~choice) root.filters = [glowFilter]
                },
                pointerout() {
                    if (~choice) root.filters = filters
                },
            },
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

function TileContents(node: DungeonRoom | null) {
    if (node == null) return Container({})
    const scene = getBattleScene()
    const passed = scene.get('numRoomsPassed')

    return Adjust(TileCharacters(node), {
        scale: node.category === 'bosses' ? 0.6 : 0.45,
    })
}

function RestSiteContents(node: DungeonRoom): PixiSprite {
    const src = getTexture('mapRestSite')

    const { choice } = getCurrentRoomAndChoiceFromNode(node)

    const root = Sprite({
        scale: 100 / src.width,
        src: 'mapRestSite',
        anchor: 0.5,
        events: {},
    })

    return root
}

function TileCharacters(node: DungeonRoom): PixiContainer {
    const scene = getBattleScene()
    const numRoomsPassed = scene.get('numRoomsPassed')

    const { currentRoom, choice } = getCurrentRoomAndChoiceFromNode(node)

    const isPlayerCharacterRoom = currentRoom.uid === node.uid

    // const isCurrentRoomPastThisDepth =
    //     parseInt(currentRoom.uid.split('_')[0]) >
    //     parseInt(node.uid.split('_')[0])
    const wasRoomVisited = scene
        .get('roomUidsVisited')
        .slice(0, -1)
        ?.includes(node.uid)

    if (wasRoomVisited) return Container({})

    if (!isPlayerCharacterRoom && node.enemies[0]?.id === 'REST_SITE')
        return RestSiteContents(node)

    if (!isPlayerCharacterRoom && node.category === 'events')
        return Sprite({
            src: 'mapEventSite',
            anchor: [0.5, 0.8],
            scale: 0.7,
        })

    return AnimatedCharacters(node, isPlayerCharacterRoom, scene, choice)
}

function AnimatedCharacters(
    node: DungeonRoom,
    isPlayerCharacterRoom: boolean,
    scene: ROCursor<BattleScene>,
    choice: number
) {
    const characters: CharacterMeta[] = isPlayerCharacterRoom
        ? vals(scene.get('allCharacters')).filter(c => c.isPc && c.health > 0)
        : node.enemies.map(
              (e): CharacterMeta => ({ id: e.id, isPc: false } as CharacterMeta)
          )

    const root = Container(
        {
            y: -60,
            x: characters?.[0]?.isPc ? -60 : 0,
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

            // freezes animation..
            // if (!~choice && !isPlayerCharacterRoom)
            //     setTimeout(
            //         () => anim?.state && (anim.state.timeScale = 0),
            //         Math.random() * 1000
            //     )
            if (!~choice) anim.cursor = 'default'

            const pcXPositions = [180, 0, 180]
            const npcXPositions = [-50, 130, -50]
            const xPositions = characterMeta.isPc ? pcXPositions : npcXPositions

            const yPositions = [70, 155, 270]
            const isSolo = characters.length === 1

            return Adjust(anim, {
                x: isSolo ? mean(xPositions) : xPositions[i],
                y: isSolo ? mean(yPositions) : yPositions[i],
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
    return getBattleScene().get('rooms')
}

function getNodeId(i: number): RoomUid {
    return `${i}-${i % 2 ? 'a' : 'b'}`
}
