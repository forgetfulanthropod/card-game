/* eslint-disable no-console */
import { strictEqual } from 'assert'
import { explainActions } from './interpretCommand'

const interpretCommandTests = {
    debilitate(): void {
        strictEqual(explainActions('debilitate(2)'), 'debilitates for 2 rounds')
    },
    dealTimes(): void {
        strictEqual(explainActions('deal(2, 2)'), 'deals 2 damage 2 times')
    },
    chain(): void {
        strictEqual(
            explainActions('chain(debilitate(2), deal(2, 2))'),
            'debilitates for 2 rounds\ndeals 2 damage 2 times'
        )
        strictEqual(
            explainActions('chain(deal(2, 2), debilitate(2))'),
            'deals 2 damage 2 times\ndebilitates for 2 rounds'
        )
    },
    usingStats(): void {
        strictEqual(
            explainActions(
                'damage=block + strength + dexterity; chain(deal(damage), debilitate(1))',
                { block: 1, strength: 2, dexterity: 3 }
            ),
            'deals 6 damage\ndebilitates for 1 round'
        )
    },
}

function main() {
    const failed: string[] = []
    console.log('starting tests')
    for (const [name, test] of Object.entries(interpretCommandTests)) {
        console.log(`\ntesting ${name}`)
        try {
            test()
            console.log(`✅ ${name} passed`)
        } catch (e) {
            console.log(`❌ ${name} failed`)
            if (e instanceof Error) {
                console.log('\t\t', e.message)
            }
            failed.push(name)
        }
    }
    const numTests = Object.keys(interpretCommandTests).length
    console.log(
        `\n${failed.length}/${numTests} tests failed: ${failed.join(', ')}`
    )
}

if (process.env.RUN_TESTS === 'yes') {
    main()
}

/** TODO: iterate through all cards and enemies and make sure they all explain() and execute() ok */
