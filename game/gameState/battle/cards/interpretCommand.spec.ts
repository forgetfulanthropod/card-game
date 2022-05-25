import { expect, Test, TestSuite } from 'testyts'

import { explainActions } from './interpretCommand'

@TestSuite()
export class CardAffordances {
    @Test()
    debilitate(): void {
        expect.toBeEqual(
            explainActions('debilitate(2)'),
            'debilitates for 2 rounds'
        )
    }
    @Test()
    dealTimes(): void {
        expect.toBeEqual(explainActions('deal(2, 2)'), 'deals 2 damage 2 times')
    }
    @Test()
    chain(): void {
        expect.toBeEqual(
            explainActions('chain(debilitate(2), deal(2, 2))'),
            'debilitates for 2 rounds\ndeals 2 damage 2 times'
        )
        expect.toBeEqual(
            explainActions('chain(deal(2, 2), debilitate(2))'),
            'deals 2 damage 2 times\ndebilitates for 2 rounds'
        )
    }
    @Test()
    usingStats(): void {
        expect.toBeEqual(
            explainActions(
                'damage=block + strength + dexterity; chain(deal(damage), debilitate(1))',
                { block: 1, strength: 2, dexterity: 3 }
            ),
            'deals 6 damage\ndebilitates for 1 round'
        )
    }
    // @Test()
    // block(): void {
    //     expect.toBeEqual(
    //         explainActions('block(dexterity + 2)', {
    //             block: 1,
    //             strength: 2,
    //             dexterity: 3,
    //         }),
    //         'target receives 5 block'
    //     )
    // }
}
