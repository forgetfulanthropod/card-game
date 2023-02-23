import { Texture } from 'pixi.js'
import type {
    BattleScene,
    CharacterMeta,
    DungeonRoom,
    DungeonRoomMap,
    RoomUid,
} from 'shared'
import { keys, vals } from 'shared/code'

import { collectData } from '@/analytics/collectData'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import {
    Adjust,
    AssetKey,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getRenderer,
    getTexture,
    glowFilter,
    loopSong,
    mapTileAssets,
    PixiContainer,
    PixiSprite,
    PixiTexture,
    Spine,
    Sprite,
    TweenableContainer,
} from '@/elementsUtil'
import { hoveredCharacterUid } from '@/util'
import { mean, sample, union } from 'lodash'
import { AdjustmentFilter } from 'pixi-filters'
import { Easing, Tweener } from 'pixi-tweener'
import { ROCursor } from 'sbaobab'
import { MainCharacterAnimation } from '../shared'

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
        Sprite({
            src: getTexture('hooligansBluffLogo'),
            scale: 0.6,
            x: 50,
            y: 50,
        }),
        Container(
            {
                x: BASE_WIDTH * 0.15,
                y: BASE_HEIGHT * 0.91,
                // TODO: zoomed panning?
                scale: 0.67,
            },
            ...AllTiles()
        )
    )
}

function AllTiles(): PixiContainer[] {
    const tileGraphMap = getTileGraphMap()
    const allTiles: PixiContainer[] = []
    const rootNode = tileGraphMap['root']
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

        const allEdges = getAllEdges(node)

        allTiles.push(TileForNode(node, depth, yOffset, allEdges))
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
const darkenFilter = new AdjustmentFilter({ brightness: 0.5 })

function TileForNode(
    node: DungeonRoom,
    depth: number,
    yOffset: number,
    allEdges: string
) {
    const baseTexture = getTexture(
        roomContainsBoss(node) ? 'mapTileBoss' : 'mapTileBase'
    )
    const decorationTexture = getGenerativeTileTexture(node.uid)
    const displayWidth = BASE_WIDTH * 0.12

    if (node == null) return Container({})

    const { choice, currentRoom } = getCurrentRoomAndChoiceFromNode(node)

    const isPlayerCharacterRoom = currentRoom.uid === node.uid

    const filters = !~choice && !isPlayerCharacterRoom ? [darkenFilter] : []

    const root = TweenableContainer(
        {
            name: node.uid,
            x: depth * displayWidth * 0.78,
            y: displayWidth * 0.34 * yOffset,
            filters,
            onDestroy: [() => Tweener.killTweensOf(root)],
        },
        Sprite({
            src: baseTexture,
            scale: displayWidth / baseTexture.width,
            anchor: [0.5, 0.42],
            events: {
                pointerup() {
                    if (~choice) void callApi('nextRoom', { choice })
                },
                pointerover() {
                    Tweener.add(
                        {
                            target: root,
                            duration: 0.3,
                            ease: Easing.bouncePast,
                        },
                        {
                            y: rootYPlacement - 33,
                        }
                    )
                    if (~choice) {
                        root.filters = [glowFilter]
                    }
                    // unfilterTileById(root.parent, node.uid)

                    //DEBUG
                    // if (!isPlayerCharacterRoom)
                    // highlightPossiblePaths(root, node)
                },
                pointerout() {
                    Tweener.add(
                        {
                            target: root,
                            duration: 0.3,
                            ease: Easing.bouncePast,
                        },
                        {
                            y: rootYPlacement,
                        }
                    )
                    if (~choice) {
                        root.filters = []
                    }

                    // //DEBUG
                    // if (!~choice && !isPlayerCharacterRoom)
                    //     darkenTileById(root.parent, node.uid)
                    // if (!isPlayerCharacterRoom) darkenPossiblePaths(root, node)
                },
            },
            // alpha: node == null ? 0.4 : 1,
            // onDestroy: [() => Tweener.killTweensOf(root)],
        }),
        Sprite({
            src: decorationTexture,
            scale: displayWidth / decorationTexture.width,
            anchor: [0.5, 0.42],
        }),
        Sprite({
            src: `mapTilePath${allEdges}` as AssetKey,
            scale: 1.7,
            anchor: [0.5, 0.425],
        }),
        TileContents(node)
    )

    const rootYPlacement = root.y

    return root
}

const generativeTextureCache: Record<string, PixiTexture> = {}

function getGenerativeTileTexture(seed: string) {
    if (generativeTextureCache[seed]) return generativeTextureCache[seed]

    const layers = Container(
        {},
        Sprite({ src: getTexture(`mapTileTopG_1`) }),
        getRandomTopDecorationSprite(1),
        getRandomTopDecorationSprite(2),
        getRandomTopDecorationSprite(3),
        getRandomTopDecorationSprite(4),
        getRandomTopDecorationSprite(5),
        getRandomTopDecorationSprite(6),
        getRandomBottomDecorationSprite(1),
        getRandomBottomDecorationSprite(2),
        getRandomBottomDecorationSprite(3),
        getRandomBottomDecorationSprite(4)
    )

    const texture = getRenderer().generateTexture(layers)

    setTimeout(() => layers.destroy(), 0)

    return (generativeTextureCache[seed] = texture)
}

// top decorations have one choice per slot
function getRandomTopDecorationSprite(slot: number) {
    const options = keys(mapTileAssets).filter(k =>
        k.includes(`mapTileTop${slot}`)
    )

    if (!options.length) throw new Error('tile generation bug.. missing slot?')

    return Sprite({ src: sample(options)! })
}

// bottom decorations can pull multiple by layer
function getRandomBottomDecorationSprite(layer: number) {
    const options = keys(mapTileAssets).filter(k =>
        k.includes(`mapTileBottom${layer}`)
    )

    if (!options.length) throw new Error('tile generation bug.. missing layer?')

    // percent chance of choosing is based on number at the end..
    const sprites = options
        .filter(o => Number(o.split('__')[1]) / 100 > Math.random())
        .map(option => Sprite({ src: option }))

    return Container({}, ...sprites)
}

function darkenPossiblePaths(root: PixiContainer, node: DungeonRoom) {
    node.edges.forEach(edgeKey => {
        if (!edgeKey) return
        darkenTileById(root.parent, edgeKey)

        darkenPossiblePaths(root, getTileGraphMap()[edgeKey])
    })
}

function highlightPossiblePaths(root: PixiContainer, node: DungeonRoom) {
    node.edges.forEach(edgeKey => {
        if (!edgeKey) return
        unfilterTileById(root.parent, edgeKey)

        // highlightPossiblePaths(root, getTileGraphMap()[edgeKey])
    })
}

function unfilterTileById(parent: PixiContainer, nodeUid: string) {
    const tile = parent.getChildByName(nodeUid)
    tile && (tile.filters = [])
}

function darkenTileById(parent: PixiContainer, nodeUid: string) {
    const tile = parent.getChildByName(nodeUid)
    tile && (tile.filters = [darkenFilter])
}

function TileContents(node: DungeonRoom | null) {
    if (node == null) return Container({})
    const scene = getBattleScene()
    const passed = scene.get('numRoomsPassed')

    const { currentRoom } = getCurrentRoomAndChoiceFromNode(node)

    const isPlayerCharacterRoom = currentRoom.uid === node.uid

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
            anchor: [0.5, 0.6],
            scale: 0.5,
        })

    if (!isPlayerCharacterRoom && node.category?.includes('tier'))
        return Sprite({
            src: `${node.category}Icon` as AssetKey,
            scale: 0.75,
            anchor: [0.5, 0.6],
        })

    return TileCharacters(node)
}

function RestSiteContents(node: DungeonRoom): PixiSprite {
    const src = getTexture('mapRestSite')

    const root = Sprite({
        scale: 180 / src.width,
        src,
        anchor: 0.5,
        events: {},
    })

    return root
}

function TileCharacters(node: DungeonRoom): PixiContainer {
    const scene = getBattleScene()

    const { currentRoom, choice } = getCurrentRoomAndChoiceFromNode(node)

    const isPlayerCharacterRoom = currentRoom.uid === node.uid

    return Adjust(
        AnimatedCharacters(node, isPlayerCharacterRoom, scene, choice),
        {
            scale: node.category === 'bosses' ? 0.55 : 0.4,
        }
    )
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
            y: characters?.[0]?.isPc ? -60 : -65,
            x: characters?.[0]?.isPc ? -40 : 0,
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

            anim.interactive = false

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

function roomContainsBoss(node: DungeonRoom): boolean {
    let containsBoss = false
    for (let enemy of node.enemies) {
        if (enemy.boss === true) {
            containsBoss = true
        }
    }
    return containsBoss
}

function getAllEdges(node: DungeonRoom) {
    const tileGraphMap = getTileGraphMap()
    const backwardEdges: string[] = []
    keys(tileGraphMap).forEach(tile => {
        tileGraphMap[tile].edges.forEach(edge => {
            if (edge === node.uid) {
                backwardEdges.push(tile)
            }
        })
    })
    const allEdges = union(backwardEdges, node.edges).filter(edge => !!edge)
    const currNodeWidth = parseInt(node.uid.split('_')[0])
    const currNodeHeight = parseInt(node.uid.split('_')[1])
    const allEdgesNumerical: any[] = []
    allEdges.forEach(edge => {
        let sideNumber: number | null = null
        if (node.uid === 'root') {
            allEdgesNumerical.push('root')
            return
        }
        const edgeWidth = parseInt(edge.split('_')[0])
        const edgeHeight = parseInt(edge.split('_')[1])
        if (edge === 'root') {
            allEdgesNumerical.push(4)
        }

        if (edgeWidth < currNodeWidth) {
            sideNumber = edgeHeight > currNodeHeight ? 5 : 4
        } else if (edgeWidth > currNodeWidth) {
            sideNumber = edgeHeight > currNodeHeight ? 1 : 2
        } else if (edgeWidth === currNodeWidth) {
            sideNumber = edgeHeight > currNodeHeight ? 0 : 3
        }

        if (sideNumber !== null) {
            allEdgesNumerical.push(sideNumber)
        }
    })
    return allEdgesNumerical.sort().join('')
}
