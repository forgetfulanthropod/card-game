import { BASE_WIDTH } from 'data/battle/constants'
import { AllCharacters } from './AllCharacters'
import background from './background'
import { Application, PixiApplication } from './mypixi'
import { getScene } from 'data/rootTree'
export function start(canvas: HTMLCanvasElement): PixiApplication {
    const scale = window.innerWidth / BASE_WIDTH
    const bg = background({ scale: 1 })
    const characters = AllCharacters({ scale: 1, cursor: getScene().select('allCharacters') })

    return Application({
        canvas,
        children: [
            bg,
            characters,
        ]
    })

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
