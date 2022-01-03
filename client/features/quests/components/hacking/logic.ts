/*Developed By Yash Bhardwaj*/

export default null

const segments = 36
const rings = 4
let cnt: number
let i: number | NodeJS.Timer | undefined
let error_snd: HTMLElement | null
const angle = Array(rings)
const angleSpeed = Array(rings)
let done = false

function setupSegments() {
    const wrap = document.getElementById('wrap')
    let scale = 1.3
    let opac = 0.5
    angleSpeed[0] = 3.0
    angleSpeed[1] = -3.0
    angleSpeed[2] = 2.5
    angleSpeed[3] = -2.5
    for (let r = 0; r < rings; r++) {
        angle[r] = 0
        const ring = document.createElement('div')
        ring.className = 'ring'
        let hide = false
        for (let s = 0; s < segments; s++) {
            const segment = document.createElement('div')
            let cn = 'seg'
            const change_p = hide ? 0.5 : 0.3
            if (Math.random(1.0) < change_p) hide = !hide
            if (hide) cn += ' hide'
            if (Math.random(1.0) < 0.1) cn += ' long'
            segment.className = cn
            segment.title = ring
            ring.insertBefore(segment, null)
        }
        $(ring).css('transform', 'scale(' + scale + ')')
        ring.style.opacity = opac
        opac += 0.15
        scale *= 0.7
        wrap.insertBefore(ring, null)
    }
}

function doFrame() {
    for (let j = 0; j < rings; j++) {
        angle[j] += angleSpeed[j]
        if (angle[j] >= 360) angle[j] -= 360
    }
    cnt = 0
    $('.seg').each(function () {
        const index = Math.floor(cnt / segments)
        const a = angle[index] + (360 / segments) * cnt
        $(this).css('transform', 'rotate(' + a + 'deg)')
        cnt++
    })
    let a = (Math.PI * angle[0]) / 45.0
    a = Math.sin(a) / 4 + 0.8
    $('#win').css('transform', 'scale(' + a + ')')
}

function init() {
    $('#wrap').html('')
    $('#reset').css('display', 'none')
    $('#win').mouseenter(function () {
        fail(false)
    })
    setupSegments()
    error_snd = document.getElementById('fail')
    $('.seg').each(function () {
        $(this).css('transform-origin', '50% 200px')
        $(this).mouseenter(function () {
            fail(true)
        })
    })
    i = setInterval(doFrame, 30)
    done = false
}

function fail(play: boolean) {
    if (done) return
    window.clearTimeout(i)
    if (play) error_snd.play()
    else alert('You Win')
    $('#reset').css('display', 'block')
    done = true
}

$(document).ready(init)
