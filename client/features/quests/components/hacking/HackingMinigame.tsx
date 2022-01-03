import s from './style.module.css'
export default function HackingMinigame(): JSXElement {
    return (
        <>
            <button class={s.reset} onClick={init}>
                Reset
            </button>
            <div class={s.win}></div>
            <div class={s.wrap}></div>
        </>
    )
}

function init() {}
