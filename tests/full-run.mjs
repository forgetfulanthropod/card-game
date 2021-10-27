/**
 * A full-run API test.
 * Separately run this to have fixed seed in the server:
 * $ FIXED_SEED=yes node ../server-build/index.js
 * Then use the client and read clientTree.serverCalls to get a recording.
 * Then restart the server (to reset the seed) before running this file with your recording.
*/
import axios from 'axios'

// comes from clientTree.serverCalls
const clientRecording = [{ 'name': 'makeNewUser', 'args': { 'username': 'alice' }, 'time': '4:46:22 PM' }, { 'name': 'addSelected', 'args': { 'character': { 'uid': 'char-uid-TLO4', 'tokenId': '4', 'nftName': 'frogKnight #1234', 'name': 'frogKnight', 'displayName': 'Frog Knight', 'isPc': true, 'points': 15, 'maxHealth': 72, 'damage': 8, 'moves': [{ 'name': 'Dutiful Stab', 'types': ['BA'] }, { 'name': 'Sword Slash', 'types': ['SL'] }], 'learnableMoves': [{ 'minLevel': 2, 'name': 'Parry', 'types': ['DBF2'] }, { 'minLevel': 2, 'name': 'Shield', 'types': ['BLK'] }], 'modifier': 1, 'level': 1 } }, 'time': '4:46:35 PM' }, { 'name': 'changeScene', 'args': { 'newSceneName': 'battle' }, 'time': '4:46:36 PM' }, { 'name': 'startGame', 'time': '4:46:36 PM' }, { 'name': 'doCharacterAction', 'args': { 'uid': 'makeCharacters5647' }, 'time': '4:46:39 PM' }, { 'name': 'doCharacterAction', 'args': { 'uid': 'makeCharacters5647' }, 'time': '4:46:43 PM' }, { 'name': 'doCharacterAction', 'args': { 'uid': 'makeCharacters0222' }, 'time': '4:46:47 PM' }, { 'name': 'doCharacterAction', 'args': { 'uid': 'makeCharacters0222' }, 'time': '4:46:51 PM' }, { 'name': 'chooseDoor', 'args': { 'door': 'normal' }, 'time': '4:46:54 PM' }, { 'name': 'doCharacterAction', 'args': { 'uid': 'charUid-fromDoors-8650' }, 'time': '4:46:55 PM' }, { 'name': 'doCharacterAction', 'args': { 'uid': 'charUid-fromDoors-8650' }, 'time': '4:47:00 PM' }, { 'name': 'doCharacterAction', 'args': { 'uid': 'charUid-fromDoors-0869' }, 'time': '4:47:05 PM' }, { 'name': 'doCharacterAction', 'args': { 'uid': 'charUid-fromDoors-0869' }, 'time': '4:47:08 PM' }, { 'name': 'exitDungeon', 'args': {}, 'time': '4:47:12 PM' }]

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
