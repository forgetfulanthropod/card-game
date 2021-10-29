/** Use jss`some template string` to stringify json */
export function jss(literals: TemplateStringsArray, ...placeholders: unknown[]): string {
    let result = ''
    for (let i = 0; i < placeholders.length; i++) {
        result += literals[i]
        const p = placeholders[i]
        result += typeof p === 'object' ? JSON.stringify(p) : p
    }
    // add the last literal
    result += literals[literals.length - 1]
    return result
}

console.log(jss`My object is ${{ x: { y: { z: 1 } } }} and the color is ${'purple'}`)
