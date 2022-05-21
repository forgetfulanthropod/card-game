import { jss } from 'shared/code/jsonString'
import { callApi } from '@/actions'
import { getClientTree } from '@/data'

// @ts-expect-error
window.runRecording = runRecording

// @ts-expect-error
window.copyHistory = copyHistory

async function runRecording(
    recording: { name: string; args: Record<string, unknown> }[],
    setSeed = true
): Promise<void> {
    if (setSeed) {
        await callApi('ResetRandomSeed', {})
    }
    for (const { name, args } of recording) {
        console.log(jss`running ${name}(${args})`)
        let res
        try {
            res = await fetch(`${name}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(args),
            })
        } catch (err) {
            const e = err as Error
            console.error('fetch post error:', e?.message, e?.stack)
            break
        }

        try {
            const json = await res.json()
            console.log('result:', json)
        } catch (e) {
            console.warn(`${name} did not return json`)
        }
    }
}

async function copyHistory() {
    console.log('Quick, click the window!')
    await sleep(1000)
    try {
        await navigator.clipboard.writeText(
            JSON.stringify(getClientTree().get().serverCalls)
        )
        console.log('copied!')
    } catch (e) {
        console.log('couldnt copy')
    }
}

function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
