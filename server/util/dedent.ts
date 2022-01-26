// https://gist.github.com/malthe/02350255c759d5478e89
export function dedent(text: string): string {
    const re_whitespace = /^([ \t]*)(.*)\n/gm
    let l, m, i

    while ((m = re_whitespace.exec(text)) !== null) {
        if (!m[2]) continue
        l = m[1].length
        if (l) {
            i = i !== undefined ? Math.min(i, l) : l
        } else break
    }

    if (i)
        text = text.replace(new RegExp('^[ \t]{' + i + '}(.*\n)', 'gm'), '$1')

    return text
}
