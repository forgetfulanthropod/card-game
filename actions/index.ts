import * as admin from 'firebase-admin'
// https://github.com/firebase/firebase-admin-node/issues/593#issuecomment-908616694
// import { firestore, initializeApp } from 'firebase-admin'
const firebaseConfig = {
    projectId: 'kaiju-75e84',
}
admin.initializeApp(firebaseConfig)

export * from './functions'

// for debugging
// @ts-ignore
// global.firestore = firestore()
