import { styled } from '../util'
//@ts-ignore
import styles from './AppWrap.module.css'

console.log("styles are", styles)

export default function AppWrap(props: { children: HTMLElement[] }): HTMLElement {
    const Root = styled('div', styles.root)
    const Relative = styled('div', styles.relative)
    Root.appendChild(Relative)
    for (const c of props.children) {
        Relative.appendChild(c)
    }
    return Root
}
