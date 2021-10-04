export function styled<T extends keyof HTMLElementTagNameMap>(kind: T, className: string): HTMLElementTagNameMap[T] {
    const elm = document.createElement(kind)
    elm.className = className
    return elm
}
