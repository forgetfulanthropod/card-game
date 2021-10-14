import type { Gamestate } from '@shared/index'

export function initialize(userCredentials: string) { }
export function getFromRulebook(key: string) { }
export function getFromGameState<K extends keyof Gamestate>(key: K): Gamestate[K] {
    return null as unknown as Gamestate[K]
}
export function setInGameState<K extends keyof Gamestate>(key: K, value: Gamestate[K]) { }

// https://firebase.google.com/docs/firestore/quickstart#add_data
// import { collection, addDoc } from "firebase/firestore";

// try {
//   const docRef = await addDoc(collection(db, "users"), {
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
//   });
//   console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//   console.error("Error adding document: ", e);
// }
