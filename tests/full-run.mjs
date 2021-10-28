/**
 * A full-run API test.
 * Separately run this to have fixed seed in the server:
 * $ FIXED_SEED=yes node ../server-build/index.js
 * Then use the client and read clientTree.serverCalls to get a recording.
 * Then restart the server (to reset the seed) before running this file with your recording.
*/
import axios from 'axios'

// still not finishing for some reason:
const clientRecording = [{ "name": "makeNewUser", "args": { "username": "alice" }, "time": "11:38:44 AM" }, { "name": "addSelected", "args": { "character": { "uid": "char-uid-TLO4", "tokenId": "4", "nftName": "frogKnight #1234", "name": "frogKnight", "displayName": "Frog Knight", "isPc": true, "points": 15, "maxHealth": 72, "damage": 8, "moves": [{ "name": "Dutiful Stab", "types": ["BA"] }, { "name": "Sword Slash", "types": ["SL"] }], "learnableMoves": [{ "minLevel": 2, "name": "Parry", "types": ["DBF2"] }, { "minLevel": 2, "name": "Shield", "types": ["BLK"] }], "modifier": 1, "level": 1 } }, "time": "11:38:47 AM" }, { "name": "changeScene", "args": { "newSceneName": "battle" }, "time": "11:38:48 AM" }, { "name": "startGame", "time": "11:38:48 AM" }, { "name": "doCharacterAction", "args": { "uid": "makeCharacters5647" }, "time": "11:38:51 AM" }, { "name": "doCharacterAction", "args": { "uid": "makeCharacters5647" }, "time": "11:38:55 AM" }, { "name": "doCharacterAction", "args": { "uid": "makeCharacters0222" }, "time": "11:38:59 AM" }, { "name": "doCharacterAction", "args": { "uid": "makeCharacters0222" }, "time": "11:39:03 AM" }, { "name": "chooseDoor", "args": { "door": "normal" }, "time": "11:39:08 AM" }, { "name": "doCharacterAction", "args": { "uid": "charUid-fromDoors-8493" }, "time": "11:39:12 AM" }, { "name": "doCharacterAction", "args": { "uid": "charUid-fromDoors-8493" }, "time": "11:39:19 AM" }, { "name": "doCharacterAction", "args": { "uid": "charUid-fromDoors-8493" }, "time": "11:39:30 AM" }, { "name": "doCharacterAction", "args": { "uid": "charUid-fromDoors-8493" }, "time": "11:39:34 AM" }, { "name": "doCharacterAction", "args": { "uid": "charUid-fromDoors-8493" }, "time": "11:39:38 AM" }, { "name": "exitDungeon", "args": {}, "time": "11:39:42 AM" }, { "name": "exitDungeon", "args": {}, "time": "11:39:42 AM" }]

async function fullRun() {
    for (let thing of clientRecording) {
        console.log(`running ${thing.name} with`, thing.args)
        const result = await axios.post(`http://localhost:3000/${thing.name}`, thing.args)
        console.log('result:', { data: result.data, status: result.status, statusText: result.statusText })
        if (result.data?.status != 'success') {
            console.error('failure')
            process.exit(1)
        }
    }
    // console.log(x.data)
}
fullRun()
