import type { h, JSX } from 'preact'
import { useEffectWhen } from 'hooks'
import { useEventEmitter, useSize } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useEffect, useRef, useState } from 'preact/hooks'
import toast from 'react-hot-toast'
import losePng from '../assets/fainted.png'
// import Chest from '../pixijs/Chest'
import { BASE_WIDTH, moveTypeMetaMap } from 'data/battle/constants'
import { checkMoveAvailable, checkWinner, getClosestAlive, getNpcMove, getUnmovedPc } from 'data/battle/misc'
import { BattleState } from 'data/battle/factories'
import { IdleScreenOverlay, Lose, MoveButton, MoveMenuDiv, Reset, Start } from './Styles'
import { Action, Dispatcher } from 'data/battle/dispatch'
export const DEBUG = false
const TIME_AFTER_PLAYER_MOVE = 1000

export const tl = (x: string): void => { console.log(x); toast(x) }



export default function AllCharacters(props: { reset: () => void, state: BattleState, dispatch: Dispatcher }): JSX.Element {
    const { state, dispatch } = props
    const move$: MoveEmitter = useEventEmitter()
    const npcMove$: NpcMoveEmitter = useEventEmitter()
    const [isPlayerFirstTurn] = useState(() => state.isPlayerTurn)
    const [endScreen, setEndScreen] = useState<null | 'lose' | 'win'>(null)
    console.log({ state })
    const { allCharacters, battleHasBegun, isPlayerTurn, selectedCharacter } = state

    // useLog({ isPlayerFirstTurn })
    const alivePcs = allCharacters.filter(c => c.isPc && c.health > 0)
    const aliveNpcs = allCharacters.filter(c => !c.isPc && c.health > 0)

    useEffect(() => {

    }, [])

    move$.useSubscription(function showMove(ad) {
        DEBUG && tl(`${ad.attacker.id} attacks ${ad.defenders.map(d => d.id)} with ${ad.move.name}`)
        toast(ad.move.name,
            //     {
            //     style: {
            //         backgroundColor: ad.attacker.isPc ? 'green' : 'red',
            //         color: 'white'
            //     }
            // }
        )
        console.log(ad.move.name)
    })

    useEffectWhen(function startGame() {
        if (!battleHasBegun) return () => { }
        tl(isPlayerTurn ? 'You go first!' : 'Enemy goes first!')
        if (!isPlayerTurn) {
            const t = setTimeout(() => npcMove$.emit('first move of game'), 1000)
            return () => clearTimeout(t)
        }
        return () => { }
    }, [battleHasBegun, isPlayerTurn, npcMove$], [battleHasBegun])

    const isMoveAvailable = checkMoveAvailable(allCharacters)
    useEffectWhen(function resetRound() {
        if (isMoveAvailable) return
        if (!battleHasBegun) return
        if (DEBUG) tl('resetting moves')
        dispatch({ a: 'clearHasMoved' })
        dispatch({ a: 'setIsPlayerTurn', v: isPlayerFirstTurn })
        tl(isPlayerFirstTurn ? 'You start' : 'Enemy starts')
        if (!isPlayerFirstTurn) {
            setTimeout(() => npcMove$.emit('first move of round'), 500)
        }
    }, [battleHasBegun, dispatch, isMoveAvailable, isPlayerFirstTurn, npcMove$], [isMoveAvailable])

    const winner = checkWinner(allCharacters)
    useEffect(function endGame() {
        console.log(winner === 'PC' ? 'You win' : 'Computer wins')
        if (winner === 'NPC') {
            const st = setTimeout(() => setEndScreen('lose'), 1000)
            return () => clearTimeout(st)
        }
        if (winner === 'PC') {
            const st = setTimeout(() => setEndScreen('win'), 0) // MARK
            return () => clearTimeout(st)
        }
        return () => { }
    }, [winner])

    npcMove$.useSubscription(function doNpcMove(_reason) {
        // tl(`npcMove(reason: ${reason})`)
        if (checkWinner(allCharacters) != null) { return }
        if (isPlayerTurn) { return }
        if (alivePcs.length === 0) { return }
        if (aliveNpcs.every(c => c.hasMoved)) {
            dispatch({ a: 'setIsPlayerTurn', v: true })
            return
        }
        move$.emit(getNpcMove(allCharacters))
        if (alivePcs.some(c => !c.hasMoved)) {
            setTimeout(() => dispatch({ a: 'setIsPlayerTurn', v: true }), 500)
            return
        }
        if (aliveNpcs.some(c => !c.hasMoved)) {
            setTimeout(() => npcMove$.emit('no unmoved PC and NPC turn'), 1000)
        }
    })

    const onClick = function doCharacterAction(clicked: CharacterMeta) {
        if (checkWinner(allCharacters) != null) return
        if (!isPlayerTurn) return
        if (alivePcs.every(c => c.hasMoved)) return
        // click to choose selected Pc:
        if (clicked.isPc) {
            if (clicked.hasMoved) return
            dispatch({ a: 'setSelectedCharacter', c: clicked })
            return
        }

        // clicked on NPC but no selected character
        if (!selectedCharacter || selectedCharacter.hasMoved) {
            // should be unreachable
            tl('select attacker first')
            return
        }
        if (state.selectedMove == null) {
            // should be unreachable
            tl('select move first')
            return
        }
        const defenders = [clicked]
        if (moveTypeMetaMap[state.selectedMove.type].numTargets > 1) {
            const closest = getClosestAlive(allCharacters, clicked, 1)
            if (closest != null) defenders.push(closest)
        }
        move$.emit({
            attacker: selectedCharacter,
            defenders: defenders,
            move: state.selectedMove,
        })

        // change to unmoved PC if there is one
        const newPc = getUnmovedPc(allCharacters)
        if (newPc == null) {
            // should be unreachable
            tl('no unmoved PC')
            dispatch({ a: 'setIsPlayerTurn', v: false })
            setTimeout(() => npcMove$.emit('attack back'), TIME_AFTER_PLAYER_MOVE + 500)
            return
        }
        dispatch({ a: 'setSelectedCharacter', c: newPc })

        // if there's another unmoved NPC then make it strike
        if (aliveNpcs.some(c => !c.hasMoved)) {
            dispatch({ a: 'setIsPlayerTurn', v: false })
            setTimeout(() => npcMove$.emit('NPC has extra turns'), TIME_AFTER_PLAYER_MOVE + 500)
        }
    }

    const ref = useRef<HTMLDivElement>(null)
    // const size = useSize(ref)
    const { width = 1920, height = 1080 } = useSize(ref)
    const scale = width / BASE_WIDTH

    useEffect(() => {
        dispatch({ a: 'updateScreenSize', size: { width, height } })
    }, [dispatch, width, height])

    return <div ref={ref} style={{ width: '100%', height: '100%' }}>
        {
            !battleHasBegun &&
            <IdleScreenOverlay>
                <Start onClick={() => dispatch({ a: 'setBattleHasBegun' })} />
            </IdleScreenOverlay>
        }
        {
            endScreen == null ? null :
                endScreen === 'lose' ? <LoseScreen reset={props.reset} /> :
                    <Reset onClick={props.reset}>Reset</Reset>
        }
        {isPlayerTurn && <MoveMenu character={selectedCharacter} dispatch={dispatch} selectedMove={state.selectedMove?.type} />}
    </div>
}


function MoveMenu(props: { character: CharacterMeta, dispatch: (a: Action) => void, selectedMove: string | undefined }) {
    return <MoveMenuDiv>
        {props.character.moves.map(m =>
            <MoveButton
                key={m.type}
                onClick={() => props.dispatch({ a: 'setSelectedMove', m: m })}
                isSelected={props.selectedMove === m.type}
            >
                {m.name}
            </MoveButton>
        )}
    </MoveMenuDiv>
}

export type MoveEmitter = EventEmitter<AttackData>
export type NpcMoveEmitter = EventEmitter<string>

function LoseScreen(props: { reset: () => void }): JSX.Element {
    return <IdleScreenOverlay>
        <Lose src={losePng} />
        <Reset onClick={props.reset}>Reset</Reset>
    </IdleScreenOverlay>
}

function WinScreen(props: { reset: () => void, size: SizeQ }): JSX.Element {
    // TODO: pixiPreactChannel.emit("showChest")
    return <></>
    // return <Chest size={props.size} />
    /* <Stage
       width={props.size.width}
       height={props.size.height}
       style={{
           position: 'absolute',
           width: '100%',
           height: '100%'
       }}
       options={{ backgroundAlpha: 0 }}
   >
   </Stage> */
}
