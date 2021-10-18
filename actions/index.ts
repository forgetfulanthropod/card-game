import { firestore, initializeApp } from 'firebase-admin'

initializeApp({ projectId: 'kaiju-75e84', })

export * from './functions'

// for debugging
global.firestore = firestore()
