import { useEventEmitter } from 'ahooks'
import produce from 'immer'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import frogknightPng from '../assets/Frog_Knight_sprite-200.png'
import skeletonPng from '../assets/Skeleton_Warrior_sprite-200.png'
import { getDamage } from '../util/attack'
import { attackBus } from '../util/attackBus'
import { moveTypeMetaMap } from '../util/constants'
import { initialPlayerCharacters } from '../util/factories'
import { checkWinner, getPCTarget, getRandomMove, getUnmovedNpc, getUnmovedPc, getId } from '../util/misc'
import { EnemyHoverDiv, Health, IdleScreenOverlay, PCHoverDiv, Sprite, Start } from './Styles'
import Table from './Table'

const TIME_AFTER_PLAYER_MOVE = 1000
export const X_AGGRESSIVE_THRESH = 11
export const X_NEUTRAL_THRESH = 9

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
