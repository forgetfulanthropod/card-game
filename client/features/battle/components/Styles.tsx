/* eslint-disable @typescript-eslint/no-explicit-any */
import { styled } from '@/config'

export const HoverDiv = styled.div`
    background: black;
    opacity: 0.5;
    font-size: 2em;
    padding: 1%;
    border-radius: 0.4vw;
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

// export const shake = keyframes`
//     0% { transform: translate(1px, 1px) rotate(0deg); }
//     10% { transform: translate(-1px, -2px) rotate(-1deg); }
//     20% { transform: translate(-3px, 0px) rotate(1deg); }
//     30% { transform: translate(3px, 2px) rotate(0deg); }
//     40% { transform: translate(1px, -1px) rotate(1deg); }
//     50% { transform: translate(-1px, 2px) rotate(-1deg); }
//     60% { transform: translate(-3px, 1px) rotate(0deg); }
//     70% { transform: translate(3px, 1px) rotate(-1deg); }
//     80% { transform: translate(-1px, -1px) rotate(1deg); }
//     90% { transform: translate(1px, 2px) rotate(0deg); }
//     100% { transform: translate(1px, -2px) rotate(-1deg); }
// `

// export const zoom = keyframes`
//     0% {transform: scale(1.0)}
//     100% {transform: scale(2.0)}
// `

// export const fadeIn = keyframes`
//   0% { opacity: 0; }
//   50% {opacity: 0;}
//   100% { opacity: 0.8; }
// `

// export const popup = keyframes`
//   0% { transform: translateY(100%); }
//   50% { transform: translateY(20%); }
//   100% { transform: translateY(0%);; }
// `

export const IdleScreenOverlay = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.4);
`

export const Lose = styled.img`
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 50%;
    height: 50%;
    /* transition: transform 2.0s; */
    /* &:hover { */
    /* transform: scale(2.0); */
    /* } */
    animation-fill-mode: forwards;
`
// animation: ${css`${zoom} .5s`};

export const Reset = styled.button`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 75%;
    background: #e3dcb9;
    border: 1px solid black;
    border-radius: 10%;
    color: white;
    font-size: 4vw;
    padding: 10px 10px 2px 10px;
    font-family: fantasy;
    animation-fill-mode: forwards;
    &:hover {
        font-weight: bold;
    }
`
// animation: ${css`${fadeIn}`} 3s;

export const MoveMenuDiv = styled.div`
    pointer-events: auto;
    position: absolute;
    bottom: calc(8vw * 1.4 / 20);
    left: 1vw;
`

interface ABP {
    isSelected: boolean
}
export const MoveButton = styled.button<ABP>`
    background: ${(p: ABP) =>
        p.isSelected ? 'rgba(0,0,0,.6)' : 'rgba(40,40,40,.6)'};
    color: white;
    font-family: monospace;
    display: block;
    width: 100%;
    font-size: 1vw;
    padding: 1vw;
`
