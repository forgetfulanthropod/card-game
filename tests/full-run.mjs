/**
 * deno run full-run.ts
 * A full-run API test.
 * Separately run this to have fixed seed in the server:
 * $ FIXED_SEED=yes node ../server-build/index.js
 * Then use the client and read clientTree.serverCalls to get a recording.
 * Then restart the server (to reset the seed) before running this file with your recording.
 */
import axios from 'axios'

// still not finishing for some reason:
const clientRecording = [
    { name: 'makeNewUser', args: { username: 'alice' }, time: '12:51:18 PM' },
    {
        name: 'addSelected',
        args: {
            character: {
                uid: 'char-uid-TLO4',
                tokenId: '4',
                nftName: 'frogKnight #1234',
                name: 'frogKnight',
                displayName: 'Frog Knight',
                isPc: true,
                points: 15,
                maxHealth: 72,
                damage: 8,
                moves: [
                    { name: 'Dutiful Stab', types: ['BA'] },
                    { name: 'Sword Slash', types: ['SL'] },
                ],
                learnableMoves: [
                    { minLevel: 2, name: 'Parry', types: ['DBF2'] },
                    { minLevel: 2, name: 'Shield', types: ['BLK'] },
                ],
                modifier: 1,
                level: 1,
            },
        },
        time: '12:51:21 PM',
    },
    {
        name: 'changeScene',
        args: { newSceneName: 'battle' },
        time: '12:51:22 PM',
    },
    { name: 'startBattle', time: '12:51:22 PM' },
    {
        name: 'doCharacterAction',
        args: { uid: 'makeCharacters5647' },
        time: '12:51:25 PM',
    },
    {
        name: 'doCharacterAction',
        args: { uid: 'makeCharacters5647' },
        time: '12:51:29 PM',
    },
    {
        name: 'doCharacterAction',
        args: { uid: 'makeCharacters0222' },
        time: '12:51:32 PM',
    },
    {
        name: 'doCharacterAction',
        args: { uid: 'makeCharacters0222' },
        time: '12:51:37 PM',
    },
    { name: 'chooseDoor', args: { door: 'normal' }, time: '12:51:39 PM' },
    {
        name: 'doCharacterAction',
        args: { uid: 'charUid-fromDoors-8493' },
        time: '12:51:42 PM',
    },
    {
        name: 'doCharacterAction',
        args: { uid: 'charUid-fromDoors-8493' },
        time: '12:51:44 PM',
    },
    {
        name: 'doCharacterAction',
        args: { uid: 'charUid-fromDoors-8493' },
        time: '12:51:48 PM',
    },
    {
        name: 'doCharacterAction',
        args: { uid: 'charUid-fromDoors-8493' },
        time: '12:51:52 PM',
    },
    {
        name: 'doCharacterAction',
        args: { uid: 'charUid-fromDoors-8493' },
        time: '12:51:55 PM',
    },
    { name: 'exitDungeon', args: {}, time: '12:51:58 PM' },
]
test('full run', async function fullRun() {
    console.log('doing full run')
    console.log('resetting random seed')
    await axios.post(`http://localhost:3000/resetRandomSeed`)
    for (let thing of clientRecording) {
        console.log(`running ${thing.name} with`, thing.args)
        const result = await axios.post(
            `http://localhost:3000/${thing.name}`,
            thing.args
        )
        console.log('result:', {
            data: result.data,
            status: result.status,
            statusText: result.statusText,
        })
        if (result.data?.status != 'success') {
            throw Error('failure')
        }
    }
    // console.log(x.data)
})
