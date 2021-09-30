import { Loader } from 'pixi.js'
import React, { useEffect } from 'react'
import frogknightPng from '../assets/Frog_Knight_sprite-200.png'
import skeletonPng from '../assets/Skeleton_Warrior_sprite-200.png'
import { useLoaderContext } from '../providers/LoaderContext'


// export default Pixi<{ scale: number }, Graphics>('PixiHealthBar', {
//     create: (props) => {

//     },
// })

const assets = {
    'frogknight': frogknightPng,
    'skeleton': skeletonPng,
}
export default function AssetLoader(): JSX.Element {
    // const app = useApp()
    const { dispatch } = useLoaderContext()

    useEffect(() => {

        let anyNewLoaded = false
        for (const [name, url] of Object.entries(assets)) {
            if (Loader.shared.resources[name]?.data == null) {
                Loader.shared.add(name, url)
                anyNewLoaded = true
            }
        }
        if (!anyNewLoaded) {
            dispatch({ a: 'basicLoaded' })
            return
        }
        Loader.shared.load()
            .onComplete.add(() => {
                dispatch({ a: 'basicLoaded' })
            })

    }, [dispatch])

    return <></>
}
