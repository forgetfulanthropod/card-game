import { https } from "firebase-functions"

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// export const makeUppercase = functions.firestore.document('/messages/{documentId}')
//     .onCreate((snap, context) => {
//         // Grab the current value of what was written to Firestore.
//         const original = snap.data().original

//         // Access the parameter `{documentId}` with `context.params`
//         functions.logger.log('Uppercasing', context.params.documentId, original)

//         const uppercase = original.toUpperCase()

//         // You must return a Promise when performing asynchronous tasks inside a Functions such as
//         // writing to Firestore.
//         // Setting an 'uppercase' field in Firestore document returns a Promise.
//         return snap.ref.set({ uppercase }, { merge: true })
//     })

// http://localhost:5001/kaiju-75e84/us-central1/helloWorld
export const helloWorld = https.onCall((data, context) => {
    return 'hello'
})
