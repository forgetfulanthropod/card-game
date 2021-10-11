import { getApp, initializeApp } from 'firebase/app'
import { Functions, getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions'

console.log('initializing app but not storing result -- not sure if that works')
initializeApp({
    apiKey: 'AIzaSyDavWqGtoB5JavUmkz_l4EdtFhxETFkB2o',
    authDomain: 'kaiju-75e84.firebaseapp.com',
    projectId: 'kaiju-75e84',
    storageBucket: 'kaiju-75e84.appspot.com',
    messagingSenderId: '1004107907735',
    appId: '1:1004107907735:web:d180cfa470b5b5c6365fd2'
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
