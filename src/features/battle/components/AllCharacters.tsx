import { moveTypeMetaMap, stanceTypeMetaMap } from '../util/constants'
import produce from 'immer'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import styled, { css, keyframes } from 'styled-components'
import frogknightPng from '../assets/Frog_Knight_sprite-200.png'
import skeletonPng from '../assets/Skeleton_Warrior_sprite-200.png'
import startPng from '../assets/start.png'
import { getDamage } from '../util/attack'
import { attackBus } from '../util/attackBus'
import Table from './Table'
import { useEventEmitter } from 'ahooks'

const TIME_AFTER_PLAYER_MOVE = 1000
const X_AGGRESSIVE_THRESH = 11
const X_NEUTRAL_THRESH = 9

const tl = (x: string) => { toast(x); console.log(x) }

type Set<T> = T | ((old: T) => T)

export default function AllCharacters(): JSX.Element {
    const [isPlayerTurn, setIsPlayerTurn] = useState(Math.random() < .5)
    const [battleHasBegun, setBattleHasBegun] = useState(false)
    const [allCharacters, setAllCharacters] = useState(() => initialPlayerCharacters())
    const [selectedCharacter, setSelectedCharacter] = useState<CharacterMeta>(() => {
        const c = allCharacters.find(c => c.isPlayerCharacter)
        if (c == null) { throw Error('no player characters!') }
        return c
    })

    const winner = checkWinner(allCharacters)
    useEffect(() => { winner != null && tl(winner === 'PC' ? 'You win' : 'Computer wins') }, [winner])

    useEffect(() => {
        if (!battleHasBegun) return

        toast(isPlayerTurn ? 'You go first!' : 'Enemy goes first!')
        if (!isPlayerTurn) npcMove$.emit()
    }, [battleHasBegun])


    const npcMove$ = useEventEmitter()
    npcMove$.useSubscription(

        function npcRebuttal() {

            const ac = allCharacters
            if (checkWinner(ac) != null) {
                return
            }

            const attacker = getUnmovedNpc(ac)
            if (attacker == null) {
                clearAllMoved()
                // trigger again so fires after state update
                npcMove$.emit()
                return
            }

            const defender = getPCTarget(ac)
            const move = getRandomMove(attacker)
            // tl(`${attacker.id} will attack ${defender.id} with ${move.name}`)
            attackBus.emit({ attacker, defender, move })
            if (move.type === 'SL')
                attackBus.emit({ attacker, defender: getClosest(defender), move })

            setIsPlayerTurn(true)
        }
    )

    function clearAllMoved() {
        setAllCharacters(cs => produce(cs, draft => {
            draft.forEach(c => c.hasMoved = false)
        }))
    }

    const onClick = function doCharacterAction(character: CharacterMeta) {
        if (checkWinner(allCharacters) != null) {
            return
        }
        if (!isPlayerTurn) return

        if (character.isPlayerCharacter) {
            if (character.hasMoved) { return }

            setSelectedCharacter(character)
            return
        }
        // clicked on NPC
        if (!selectedCharacter || selectedCharacter.hasMoved) {
            clearAllMoved()
            return
        }
        attackBus.emit({
            attacker: selectedCharacter,
            defender: character,
            move: {
                name: 'Dutiful Stab',
                type: 'BA',
            }
        })
        const newPc = getUnmovedPc(allCharacters)
        if (newPc == null) {
            console.error('no player characters')
            clearAllMoved()
            return
        }
        setIsPlayerTurn(false)
        setSelectedCharacter(newPc)
        setTimeout(() => npcMove$.emit(), TIME_AFTER_PLAYER_MOVE + 500)

    }

    const setStat = useCallback(
        function setStat<P extends keyof CharacterMeta>(id: string, property: P, update: Set<CharacterMeta[P]>) {
            setAllCharacters(cs => produce(cs, draft => {
                const c = draft.find(c => c.id === id)
                if (c == null) {
                    throw new Error(`cannot find character ${id}`)
                }
                if (typeof update === 'function') {
                    c[property] = update(c[property])
                } else {
                    c[property] = update
                }
            }))
        }, [])

    function getClosest(character: CharacterMeta): CharacterMeta {

        return [...allCharacters]
            .filter(c => c.isPlayerCharacter === character.isPlayerCharacter)
            .sort((a, b) => dist([a.x, a.y], [character.x, character.y]) - dist([b.x, b.y], [character.x, character.y]))[1]

        function dist([x1, y1]: [number, number], [x2, y2]: [number, number]) {
            return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
        }
    }

    return <div>
        {
            !battleHasBegun ?
                <IdleScreenOverlay>
                    <Start onClick={() => setBattleHasBegun(true)} />
                </IdleScreenOverlay> :
                <></>
        }
        {allCharacters.map(characterMeta => {
            const { x, y } = characterMeta
            const id = getId(x, y)
            const setHealth = (update: Set<number>) => setStat(id, 'health', update)
            const setHasMoved = (update: Set<boolean>) => setStat(id, 'hasMoved', update)

            const characterProps = { setHealth, setHasMoved, characterMeta, onClick, key: id }

            return characterMeta.isPlayerCharacter ?
                <Frogknight {...characterProps} isSelected={selectedCharacter?.id === id} /> :
                <Skeleton {...characterProps} />
        })}
        {/* {skeletonPositions.map(([x, y]) =>
            <Skeleton key={getId(x, y)} {...{ x, y, onClick }} />)}
        {frogknightPositions.map(([x, y]) =>
            <Frogknight key={getId(x, y)} {...{ x, y, onClick }} isSelected={selectedCharacter.id === getId(x, y)} />)} */}
        {/* <div>
            <button onClick={() => setShake(true)}>Punch</button>
            <button onClick={() => setWidth(400)}>Kick</button>
            <button onClick={() => setWidth(500)}>Dodge</button>
        </div> */}
    </div>
}


function Frogknight(props: KnownPlayerCharacterProps) {
    return <Character src={frogknightPng} direction={-1} {...props} />
}


function Skeleton(props: KnownCharacterProps) {
    return <Character src={skeletonPng} direction={-1} {...props} />
}

interface KnownCharacterProps {
    characterMeta: CharacterMeta
    onClick: (c: CharacterMeta) => void
    setHealth: (update: Set<number>) => void
    setHasMoved: (has: boolean) => void
}
interface KnownPlayerCharacterProps extends KnownCharacterProps {
    isSelected: boolean
}
interface CharacterProps extends KnownCharacterProps {
    isSelected?: boolean
    src: string
    direction: -1 | 1
    characterMeta: CharacterMeta
}
function Character(props: CharacterProps): JSX.Element {
    const { x, y, health } = props.characterMeta
    const [isAttacking, setIsAttacking] = useState(false)
    const [isDefending, setIsDefending] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    useEffect(() => {
        if (!isAttacking && !isDefending) return () => { }
        const t = setTimeout(() => {
            setIsAttacking(false)
            setIsDefending(false)
        }, 500)
        return () => clearTimeout(t)
    }, [isAttacking, isDefending])

    useEffect(() => {
        attackBus.subscribe((d: AttackData) => {

            if (d.attacker.id === props.characterMeta.id) {
                setIsAttacking(true)
                props.setHasMoved(true)

            }

            if (d.defender.id === props.characterMeta.id) {
                setIsDefending(true)


                //todo setSelectedMove

                props.setHasMoved(true)
                const damage = getDamage(d)
                setTimeout(() => props.setHealth(health => health - damage), 500)
            }
        })
    }, [])

    const spriteProps = {
        src: props.src,
        isAttacking,
        isDefending
    }

    const midAttack = () => <>
        <Sprite {...spriteProps} x={5} y={0} blur={true} />
        <Sprite {...spriteProps} x={5} y={0} absolute={true} color={isAttacking ? 'blue' : (isDefending ? 'red' : '')} blur={true} />
    </>
    const selected = () => <>
        <Sprite {...spriteProps} x={0} y={0} glow={true} color={'white'} />
        <Sprite {...spriteProps} x={0} y={0} absolute={true} />
    </>
    const regular = () => <Sprite {...spriteProps} x={0} y={0} />

    const sprite = () => (isAttacking || isDefending) ? midAttack() : props.isSelected ? selected() : regular()
    return <>
        {health > 0 ?
            <div
                onClick={() => props.onClick(props.characterMeta)}
                style={{ position: 'absolute', left: x + '%', top: y + '%', width: '13%' }}
                onPointerEnter={() => setIsHovering(true)}
                onPointerLeave={() => setIsHovering(false)}
            >
                <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 2 }}>
                    {isHovering && <Hover characterMeta={props.characterMeta} />}
                    {sprite()}
                    <Health color={props.characterMeta.isPlayerCharacter ? '#53C541' : 'red'}>{health}</Health>
                    {/* <Health x={size?.width == null ? 10 : size.width / 2} y={size?.height == null ? 10 : size.height} color={props.color}>{health}</Health> */}
                </div>
            </div> :
            <></>}
    </>
}

function Hover(props: { characterMeta: CharacterMeta }) {
    const cm = props.characterMeta
    const moveAt = (i: number) => `${cm.moves[i].name} ${moveTypeMetaMap[cm.moves[i].type].multiplier * cm.damage | 0}`
    return <>{
        cm.isPlayerCharacter ?
            <PCHoverDiv>
                stance: {cm.stance}
            </PCHoverDiv> :
            <EnemyHoverDiv>
                <Table
                    header={cm.type}
                    rows={
                        [[`LVL ${cm.level}`, moveAt(0)],
                        [`HP ${cm.health}`, moveAt(1)],
                        [`ATK ${cm.damage}`, moveAt(2)]]
                    }
                />
            </EnemyHoverDiv>
    }
    </>
}


const HoverDiv = styled.div`
    background: black;
    opacity: 0.5;
    font-size: 2em;
    padding: 1%;
    border-radius: .4vw;
    z-index: 10;
    position: absolute;
    bottom: 15vw;
    color: white;
    font-size: 1vw;
    font-family: monospace;
    font-weight: bold;
    padding: 8px;


`

const EnemyHoverDiv = styled(HoverDiv)`
    box-shadow: 0 0 2px 4px red;
    right: 3vw;
    width: 18vw;
`

const PCHoverDiv = styled(HoverDiv)`
    box-shadow: 0 0 2px 4px skyblue;
    width: 12vw;
    left: 0;
    text-align: center;
`


function initialPlayerCharacters(): CharacterMeta[] {
    const skeletonPositions = makePositions(70, 25, 18, 15)
    const frogknightPositions = makePositions(10, 25, 18, 15)
    const result = [
        ...skeletonPositions.map(([x, y]) => newSkeletonMeta({ x, y })),
        ...frogknightPositions.map(([x, y]) => newFrogknightMeta({ x, y })),
    ]
    return result
}


function makePositions(x0: number, y0: number, hGap: number, vGap: number): [number, number][] {
    return [
        [x0, y0],
        [x0 + hGap, y0],
        [x0 - hGap / 2, y0 + vGap],
        [x0 + hGap / 2, y0 + vGap],
        [x0, y0 + vGap * 2],
        [x0 + hGap, y0 + vGap * 2],
    ]
}


function getId(x: number, y: number): string { return `${x}-${y}` }


function newFrogknightMeta(args: { x: number, y: number }): CharacterMeta {
    const stance: StanceType = args.x > X_AGGRESSIVE_THRESH ?
        'aggressive' :
        (args.x > X_NEUTRAL_THRESH ? 'neutral' : 'defensive')
    return {
        id: getId(args.x, args.y),
        type: 'Frogknight',
        level: 1,
        damage: 8,
        isPlayerCharacter: true,
        x: args.x,
        y: args.y,
        stance,
        hasMoved: false,
        health: 72,
        moves: [
            {
                name: 'Dutiful Stab',
                type: 'BA',
            },
            {
                name: 'Slash',
                type: 'SL',
            },
            {
                name: 'Slash',
                type: 'SL',
            },
        ]
    }
}


function newSkeletonMeta(args: { x: number, y: number }): CharacterMeta {
    return {
        id: getId(args.x, args.y),
        type: 'Skeleton',
        level: 1,
        damage: 8,
        isPlayerCharacter: false,
        x: args.x,
        y: args.y,
        stance: 'neutral',
        hasMoved: false,
        health: 10,
        moves: [
            {
                name: 'Sword Whack',
                type: 'BA',
            },
            {
                name: 'Rusty Poke',
                type: 'DOT2',
            },
            {
                name: 'Slash',
                type: 'SL',
            },
        ]
    }
}


const Health = styled.div<{ color: string }>`
    font-family: monospace;
    font-weight: bold;
    position: absolute;
    /* position: relative; */
    font-size: 3vw;
    color: ${p => p.color};
    left: 50%;
    transform: translateX(-50%) translateY(-15%);
`


const IdleScreenOverlay = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background: rgba(0,0,0,.4);
`


const Start = styled.img.attrs({ src: startPng })`
    position: absolute;
    transform: translate(-50%, -50%);
    width: 20%;
    left: 50%;
    top: 25%;
    z-index: 1001;
    user-select: none;
`


const Sprite = styled.img.attrs({ width: 200 })
    <{
        isAttacking: boolean,
        isDefending: boolean,
        x: number,
        y: number,
        color?: string,
        blur?: boolean,
        glow?: boolean,
        absolute?: boolean,
    }>`
    ${p => (p.isAttacking || p.isDefending) && css`animation: ${shake} 0.5s;`}
    user-select: none;
    position: ${p => p.absolute === true ? 'absolute' : 'relative'};
    left: ${p => p.x}%;
    top: ${p => p.y}%;
    width: 100%;
    z-index: 5;
    ${p => p.blur === true && 'filter: blur(8px);'}
    ${p => p.color != null && css`
        filter: opacity(0.5) drop-shadow(0 0 ${p.glow ? '3vw' : '0'} ${p.color});
    `}
    /* box-shadow: 5px 6px 7px black; */
`


const shake = keyframes`
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
`


function getUnmovedNpc(ac: CharacterMeta[]): CharacterMeta | null {
    const chars = ac.filter(c => !c.isPlayerCharacter && c.health > 0 && !c.hasMoved)
    if (chars.length === 0) { return null }
    return randomEl(chars)
}


function getUnmovedPc(ac: CharacterMeta[]): CharacterMeta | null {
    const chars = ac.filter(c => c.isPlayerCharacter && c.health > 0 && !c.hasMoved)
    if (chars.length === 0) { return null }
    return randomEl(chars)
}

function getPCTarget(ac: CharacterMeta[]) {
    const allLivingPlayerCharacters = ac
        .filter(c => c.isPlayerCharacter && c.health > 0)

    const targetIndex = weightedRandom(
        allLivingPlayerCharacters
            .map(c => stanceTypeMetaMap[c.stance].targetLikelihood)
    )

    return allLivingPlayerCharacters[targetIndex]
}

function checkWinner(ac: CharacterMeta[]): null | 'PC' | 'NPC' {
    if (ac.every(c => c.isPlayerCharacter || c.health <= 0))
        return 'PC'
    if (ac.every(c => !c.isPlayerCharacter || c.health <= 0))
        return 'NPC'
    return null
}


function getRandomMove(attacker: CharacterMeta) {
    return randomEl(attacker.moves)
}


function randomEl<T>(arr: T[]): T {
    return arr[Math.random() * arr.length | 0]
}


/** Returns index of chosen element */
function weightedRandom(probabilites: number[]): number {
    if (probabilites.some(x => Number.isNaN(x) || !Number.isFinite(x) || x < 0)) {
        console.error('array contains NaN or Inf or negative numbers')
        return 0
    }
    let runningTotal = 0
    const runningTotals = []
    for (let i = 0; i < probabilites.length; i++) {
        runningTotal += probabilites[i]
        runningTotals[i] = runningTotal
    }
    const total = runningTotal
    const x = Math.random() * total
    const index = runningTotals.findIndex(t => t > x)
    if (index !== -1) return index
    // hits e.g. when all probabilities are 0
    return Math.random() * probabilites.length | 0
}


// TODO: jest/mocha?
// function test(A) {
//     const counts = A.map(() => 0)
//     const n = 10000
//     for (let i = 0; i < n; i++) {
//         counts[weightedRandom(A)] += 1
//     }
//     return counts.map(x => x / n)
// }
