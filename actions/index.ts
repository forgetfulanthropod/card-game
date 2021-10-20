import * as admin from 'firebase-admin'
// https://github.com/firebase/firebase-admin-node/issues/593#issuecomment-908616694
// import { firestore, initializeApp } from 'firebase-admin'
const firebaseConfig = {
    apiKey: 'AIzaSyDavWqGtoB5JavUmkz_l4EdtFhxETFkB2o',
    authDomain: 'kaiju-75e84.firebaseapp.com',
    projectId: 'kaiju-75e84',
    storageBucket: 'kaiju-75e84.appspot.com',
    messagingSenderId: '1004107907735',
    appId: '1:1004107907735:web:d180cfa470b5b5c6365fd2'
}
admin.initializeApp(firebaseConfig)

export * from './functions'

// for debugging
// @ts-ignore
// global.firestore = firestore()
