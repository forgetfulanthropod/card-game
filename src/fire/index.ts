import { getApp, initializeApp } from 'firebase/app'
import { Functions, getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions'

console.log("initializing app but not storing result -- not sure if that works")
initializeApp({
    projectId: 'kaiju-75e84',
    // apiKey: '### FIREBASE API KEY ###',
    // authDomain: '### FIREBASE AUTH DOMAIN ###',
})

type FunctionName =
    | 'makeUppercase'
    | 'helloWorld'

const functions = getFunctions(getApp())
function getFunction(fs: Functions, name: FunctionName) {
    return httpsCallable(functions, name)
}

export function makeCall(): void {
    connectFunctionsEmulator(functions, 'localhost', 5001)
    const helloWorld = getFunction(functions, 'helloWorld')
    helloWorld().then(result => console.log('FIREBASE CLOUD FUNCTION:', result))
}
