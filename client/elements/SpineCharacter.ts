import { Spine } from 'pixi-spine'

import type { PixiApplication, PixiLoader } from '@/elementsUtil'

export function addSpineCharacter(app: PixiApplication): void {
    app.loader
        // .add('spineboypro', 'spine/demo/spineboy-pro.json')
        // .add('spineboypro', 'spine/penguin/spine.json')
        .add('spineboypro', 'spine/frog/FK_RIG_007.json')
        .load(onAssetsLoaded)

    app.stage.interactive = true

    function onAssetsLoaded(loader: PixiLoader, res) {
        // create a spine boy
        const spineBoyPro = new Spine(res.spineboypro.spineData)

        // set the position
        spineBoyPro.x = app.screen.width / 2
        spineBoyPro.y = app.screen.height

        spineBoyPro.scale.set(0.5)

        app.stage.addChild(spineBoyPro)

        // const singleAnimations = ['aim', 'death', 'jump', 'portal']
        // const loopAnimations = ['hoverboard', 'idle', 'run', 'shoot', 'walk']
        // const allAnimations = [...singleAnimations, ...loopAnimations]

        // let lastAnimation = ''

        // // Press the screen to play a random animation
        // app.stage.on('pointerdown', () => {
        //     let animation = ''
        //     do {
        //         animation = allAnimations[Math.floor(Math.random() * allAnimations.length)]
        //     } while (animation === lastAnimation)

        //     spineBoyPro.state.setAnimation(0, animation, loopAnimations.includes(animation))

        //     lastAnimation = animation
        // })
    }
}
