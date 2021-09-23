import { stanceTypeMetaMap } from "battleFunctions/battleConstants"
import produce from "immer"
import React, { useCallback, useEffect, useState } from "react"
// import toast from "react-hot-toast"
import styled, { css, keyframes } from "styled-components"
import frogknightPng from "./assets/Frog_Knight_sprite-200.png"
import skeletonPng from "./assets/Skeleton_Warrior_sprite-200.png"
import startPng from "./assets/start.png"
import { getDamage } from "./battleFunctions/attack"

const TIME_AFTER_PLAYER_MOVE = 1000
const X_AGGRESSIVE_THRESH = 11
const X_NEUTRAL_THRESH = 9


export default function AllCharacters(): JSX.Element {
    const [isPlayerTurn, setIsPlayerTurn] = useState(true)
    const [battleHasBegun, setBattleHasBegun] = useState(false)
    const [selectedCharacter, setSelectedCharacter] = useState<CharacterMeta | null>(null)
    const [allCharacters, setAllCharacters] = useState(() => initialPlayerCharacters())

    function getUnmovedNPC() {
        return randomEl(
            allCharacters
                .filter(c => !c.isPlayerCharacter && !c.hasMoved)
        )
    }
    function getPCTarget() {
        // c.stance
        const allLivingPlayerCharacters = allCharacters
            .filter(c => c.isPlayerCharacter && c.health > 0)

        const targetIndex = weightedRandom(
            allLivingPlayerCharacters
                .map(c => stanceTypeMetaMap[c.stance].targetLikelihood)
        )

        return allLivingPlayerCharacters[targetIndex]
    }
    function getRandomMove(attacker: CharacterMeta) {
        return randomEl(attacker.moves)
    }

    const onClick = function doCharacterAction(character: CharacterMeta) {
        if (!isPlayerTurn) return

        if (character.isPlayerCharacter) {
            if (character.hasMoved) return
            // if (unmovedAttackers.find(p => p.id === character.id) == null) return

            setSelectedCharacter(character)
            // toast("you selected someone")
        } else if (!character.isPlayerCharacter) {
            // setIsDefending?
            if (!selectedCharacter) {
                // toast("must select pc to attack with first")
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
            setIsPlayerTurn(false)
            // Skeleton attacks back:
            // setTimeout(() => {
            //     const attacker = getUnmovedNPC()
            //     const defender = getPCTarget()
            //     const move = getRandomMove(attacker)
            //     attackBus.emit({ attacker, defender, move })
            //     if (move.type === 'SL')
            //         attackBus.emit({ attacker, defender: getClosest(defender), move })

            //     setIsPlayerTurn(true)
            // }, TIME_AFTER_PLAYER_MOVE)
        }
        // else if (!isPlayerTurn && c.isPlayerCharacter) {
        //     // do nothing?
        // } else if (!isPlayerTurn && !c.isPlayerCharacter) {
        //     // do nothing?
        // }
    }

    const setStat = useCallback(function setStat(id, property: keyof CharacterMeta, x: unknown) {
        setAllCharacters(cs => produce(cs, draft => {
            const c = draft.find(c => c.id === id)
            c[property] = x
            // toast(`${property} set to ${x}`)
            return
        }))
    }, [])

    function getClosest(character: CharacterMeta): CharacterMeta {

        return allCharacters
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
            return characterMeta.isPlayerCharacter ?
                <Frogknight setHealth={(h) => setStat(id, 'health', h)} key={id} {...{ characterMeta, onClick }} isSelected={selectedCharacter?.id === id} /> :
                <Skeleton setHealth={(h) => setStat(id, 'health', h)} key={id} {...{ characterMeta, onClick }} />
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
    setHealth: (h: number) => void
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
            // console.log('attackbus subscriber')

            if (d.attacker.id === props.characterMeta.id) {
                setIsAttacking(true)
            }

            if (d.defender.id === props.characterMeta.id) {
                // console.log('emitting setHealth')
                setIsDefending(true)
                // console.log(`damage: ${getDamage(d)}`)
                // toast(`${props.characterMeta.id} is calling setHealth to ${health - getDamage(d)}`)
                props.setHealth(health - getDamage(d))
            }
        })
    }, [])

    const spriteProps = {
        src: props.src,
        isAttacking,
        isDefending
    }

    return <>
        {health > 0 ?
            <div
                onClick={() => props.onClick(props.characterMeta)}
                style={{ position: 'absolute', left: x + '%', top: y + '%', width: '13%' }}
            >
                <div style={{ position: 'relative', width: '100%', height: '100%', }}>
                    {(isAttacking || isDefending)
                        ?
                        <>
                            <Sprite {...spriteProps} x={5} y={0} blur={true} />
                            <Sprite {...spriteProps} x={5} y={0} absolute={true} color={isAttacking ? 'blue' : (isDefending ? 'red' : '')} blur={true} />
                        </>
                        :
                        <Sprite {...spriteProps} x={0} y={0} />
                    }
                    <Health color={props.characterMeta.isPlayerCharacter ? '#53C541' : 'red'}>{health}</Health>
                    {/* <Health x={size?.width == null ? 10 : size.width / 2} y={size?.height == null ? 10 : size.height} color={props.color}>{health}</Health> */}
                </div>
            </div> :
            <></>}
    </>
}

const attackBus = {
    subscribers: [(d: AttackData) => { d }],
    emit(d: AttackData) {
        this.subscribers.forEach(s => s(d))
    },
    subscribe(callback: (d: AttackData) => void) {
        this.subscribers.push(callback)
    }
}


function initialPlayerCharacters(): CharacterMeta[] {
    const skeletonPositions = makePositions(70, 25, 18, 15)
    const frogknightPositions = makePositions(10, 25, 18, 15)
    const result = [
        ...skeletonPositions.map(([x, y]) => newSkeletonMeta({ x, y })),
        ...frogknightPositions.map(([x, y]) => newFrogknightMeta({ x, y })),
    ]
    // console.log(result)
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
    <{ isAttacking: boolean, isDefending: boolean, x: number, y: number, color?: string, blur?: boolean, absolute?: boolean }>`
    ${p => (p.isAttacking || p.isDefending) && css`animation: ${shake} 0.5s;`}
    user-select: none;
    position: ${p => p.absolute === true ? 'absolute' : 'relative'};
    left: ${p => p.x}%;
    top: ${p => p.y}%;
    width: 100%;
    ${p => p.blur === true && `filter: blur(2px);`}
    ${p => p.color != null && css`
        filter: opacity(0.5) drop-shadow(0 0 0 ${p.color});
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


function randomEl<T>(arr: T[]): T {
    return arr[Math.random() * arr.length | 0]
}


/** Returns index of chosen element */
function weightedRandom(probabilites: number[]): number {
    if (probabilites.some(x => Number.isNaN(x) || !Number.isFinite(x)) || x < 0) {
        console.error("array contains NaN or Inf or negative numbers")
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
