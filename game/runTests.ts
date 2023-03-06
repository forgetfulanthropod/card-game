#! RUN_TESTS=yes esr runTests.ts
// npm install -g esbuild-runner

/* eslint-disable no-console, import/first, import/no-internal-modules */
import './config/logger'
import './config/seedrand'

type SuiteName = string
type TestName = string

const allSuites: Record<SuiteName, Record<TestName, () => void>> = {}
// @index(['./**/*.spec.ts'], f => `import { suites as ${f.name.split('.')[0]} } from '${f.path}'\nObject.assign(allSuites, ${f.name.split('.')[0]})`)
import { suites as effects } from './gameState/battle/effects.spec'
import { suites as interpretCommand } from './gameState/battle/interpretCommand.spec'
import { suites as souvenirs } from './gameState/battle/souvenirs.spec'
Object.assign(allSuites, effects)
Object.assign(allSuites, interpretCommand)
Object.assign(allSuites, souvenirs)
// @endindex

function main() {
    console.log('starting tests')
    const suiteRatios: Record<string, string> = {}
    for (const [suiteName, suite] of Object.entries(allSuites)) {
        console.log(`\n\ntesting suite ${suiteName}`)
        const failed: string[] = []
        for (const [name, test] of Object.entries(suite)) {
            console.log(`\n\ttesting ${name}`)
            try {
                test()
                console.log(`\t✅ ${name} passed`)
            } catch (e) {
                console.log(`\t❌ ${name} failed`)
                if (e instanceof Error) {
                    console.log('\t\t', e.message.split('\n').join('\n\t\t'))
                }
                failed.push(name)
            }
        }
        console.log(`finished suite ${suiteName}`)
        const testNames = Object.keys(suite)
        const numTests = testNames.length
        const ratio = `${numTests - failed.length}/${numTests}`
        suiteRatios[suiteName] = ratio
        console.log(`\n${ratio} tests passed`)
        console.log(`failed: ${failed.join(', ')}`)
        console.log(
            `passed: ${testNames
                .filter(name => !failed.includes(name))
                .join(', ')}`
        )
    }
    console.log('\n\nsummary:')
    for (const [name, ratio] of Object.entries(suiteRatios)) {
        console.log(`\t${name}: ${ratio} tests passed`)
    }
}
if (process.env.RUN_TESTS === 'yes') {
    main()
}
