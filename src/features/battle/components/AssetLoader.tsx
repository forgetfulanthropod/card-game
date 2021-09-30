import { Loader } from 'pixi.js'
import React, { useEffect } from 'react'
import frogknightPng from '../assets/Frog_Knight_sprite-200.png'
import skeletonPng from '../assets/Skeleton_Warrior_sprite-200.png'
import { useLoaderContext } from '../providers/LoaderContext'


// export default Pixi<{ scale: number }, Graphics>('PixiHealthBar', {
//     create: (props) => {

//     },
// })
export default function AssetLoader(): JSX.Element {
    // const app = useApp()
    const { dispatch } = useLoaderContext()

    useEffect(() => {
        Loader.shared
            .add('frogknight', frogknightPng)
            .add('skeleton', skeletonPng)
            .load()
            .onComplete.add(() => {
                dispatch({ a: 'basicLoaded' })
            })
    }, [])

    return <></>
}
