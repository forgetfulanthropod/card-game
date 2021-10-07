import App from 'components/App'
import { getScene } from 'data/rootTree'
import { AllCharacters } from './AllCharacters'
import background from './background'
import Chest from './Chest'
import { Application, PixiApplication } from './mypixi'
export function start(canvas: HTMLCanvasElement): PixiApplication {
    // const scale = window.innerWidth / BASE_WIDTH
    const bg = background({ scale: 1 })
    const characters = AllCharacters({ scale: 1, cursor: getScene().select('allCharacters') })

    const stateCursor = getScene().select('state')
    stateCursor.on('update', () => {
        if (stateCursor.get() === 'won')
            app.stage.addChild(
                Chest({ size: { width: app.stage.width, height: app.stage.height } })
            )
    })

    const app = Application({
        canvas,
        children: [
            bg,
            characters,
        ]
    })

    return app
}
            // <Stage width={width} height={height} options={{ backgroundAlpha: 0 }}>
            //     <LoaderProvider>
            //         <AssetLoader />
            //         <PixiBackground scale={scale} />
            //         {allCharacters.map(characterMeta => {
            //             const { x, y } = characterMeta
            //             const id = getId(x, y)
            //             const characterProps = { scale, move$, dispatch, characterMeta, onClick, key: id }

            //             return characterMeta.isPc ?
            //                 <Frogknight {...characterProps} isSelected={selectedCharacter?.id === id} /> :
            //                 <Skeleton {...characterProps} />
            //         })}
            //         {endScreen === 'win' && <Chest size={{ width, height }} />}
            //     </LoaderProvider>
            // </Stage>
