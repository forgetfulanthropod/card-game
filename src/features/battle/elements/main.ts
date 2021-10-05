import { BASE_WIDTH } from 'data/battle/constants'
import background from './background'
import { Application, PixiApplication } from './mypixi'

export function start(canvas: HTMLCanvasElement): PixiApplication {
    const scale = window.innerWidth / BASE_WIDTH
    const bg = background({ scale: scale / 2 })
    const characters = allCharacters({ scale: scale / 2 })

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
