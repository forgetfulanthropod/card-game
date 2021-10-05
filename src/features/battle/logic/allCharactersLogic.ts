import { EventEmitter } from 'eventemitter3'
import { useEventEmitter, useSize } from 'ahooks'
import { BASE_WIDTH, moveTypeMetaMap } from 'data/battle/constants'
import { Dispatcher } from 'data/battle/dispatch'
import { BattleState } from 'data/battle/factories'
import { checkMoveAvailable, checkWinner, getClosestAlive, getNpcMove, getUnmovedPc } from 'data/battle/misc'
import { useEffectWhen } from 'hooks'
import { useEffect, useRef, useState } from 'preact/hooks'
import toast from 'react-hot-toast'
import { MoveEmitter, NpcMoveEmitter } from '../elements/AllCharacters'
export const tl = (x: string): void => { console.log(x); toast(x) }
const TIME_AFTER_PLAYER_MOVE = 1000

const DEBUG = true
// TODO
export function allCharactersLogic(props: { reset: () => void, state: BattleState, dispatch: Dispatcher }) {

    const { state, dispatch } = props
    const move$: MoveEmitter = new EventEmitter()
    const npcMove$: NpcMoveEmitter = new EventEmitter()
    const [isPlayerFirstTurn] = useState(() => state.isPlayerTurn)
    const [endScreen, setEndScreen] = useState<null | 'lose' | 'win'>(null)
    console.log({ state })
    const { allCharacters, battleHasBegun, isPlayerTurn, selectedCharacter } = state

    // useLog({ isPlayerFirstTurn })
    const alivePcs = allCharacters.filter(c => c.isPc && c.health > 0)
    const aliveNpcs = allCharacters.filter(c => !c.isPc && c.health > 0)

    move$.on('move', function showMove(ad: AttackData) {
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

    npcMove$.on('npcMove', function doNpcMove(_reason) {
        // tl(`npcMove(reason: ${reason})`)
        if (checkWinner(allCharacters) != null) { return }
        if (isPlayerTurn) { return }
        if (alivePcs.length === 0) { return }
        if (aliveNpcs.every(c => c.hasMoved)) {
            dispatch({ a: 'setIsPlayerTurn', v: true })
            return
        }
        move$.emit('move', getNpcMove(allCharacters))
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
        move$.emit('move', {
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
}
