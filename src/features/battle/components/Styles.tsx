/* eslint-disable @typescript-eslint/no-explicit-any */
import startPng from '../assets/start.png'
// @ts-ignore
import styled, { css, keyframes } from 'styled-components'


export const HoverDiv = styled.div`
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


export const EnemyHoverDiv = styled(HoverDiv)`
    box-shadow: 0 0 2px 4px red;
    right: 3vw;
    width: 18vw;
`


export const PCHoverDiv = styled(HoverDiv)`
    box-shadow: 0 0 2px 4px skyblue;
    width: 12vw;
    left: 0;
    text-align: center;
`


export const shake = keyframes`
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


export const Health = styled.div<{ color: string }>`
    font-family: monospace;
    font-weight: bold;
    position: absolute;
    /* position: relative; */
    font-size: 3vw;
    color: ${(p: any) => p.color};
    left: 50%;
    transform: translateX(-50%) translateY(-15%);
`


export const IdleScreenOverlay = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background: rgba(0,0,0,.4);
`


export const Start = styled.img.attrs({ src: startPng })`
    position: absolute;
    transform: translate(-50%, -50%);
    width: 20%;
    left: 50%;
    top: 25%;
    z-index: 1001;
    user-select: none;
`


export const Sprite = styled.img.attrs({ width: 200 })
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
    ${(p: any) => (p.isAttacking || p.isDefending) && css`animation: ${shake} 0.5s;`}
    user-select: none;
    position: ${(p: any) => p.absolute === true ? 'absolute' : 'relative'};
    left: ${(p: any) => p.x}%;
    top: ${(p: any) => p.y}%;
    width: 100%;
    z-index: 5;
    ${(p: any) => p.blur === true && 'filter: blur(8px);'}
    ${(p: any) => p.color != null && css`
        filter: opacity(0.5) drop-shadow(0 0 ${p.glow ? '3vw' : '0'} ${p.color});
    `}
    /* box-shadow: 5px 6px 7px black; */
`
