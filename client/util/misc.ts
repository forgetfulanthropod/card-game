export function nextFrame() {
    return new Promise(resolve => {
        setTimeout(resolve, 0)
    })
}
