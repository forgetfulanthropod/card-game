let tests = []

function test(name, fn) {
    tests.push({ name, fn })
}
global.test = test

async function runTests() {
    tests.forEach(async t => {
        console.log(`running test ${t.name}`)
        try {
            await t.fn()
            console.log('✅', t.name)
        } catch (e) {
            console.log('❌', t.name)
            console.log(e.stack)
        }
    })
}

async function start() {
    console.log('starting')
    const files = process.argv.slice(2)
    await Promise.all(files.map(async file => await import(file)))
    console.log('will run')
    await runTests()
}

if (import.meta.url === `file://${process.argv[1]}`) {
    start()
}
