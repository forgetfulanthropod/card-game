import { IAddOptions, Loader } from 'pixi.js'
import React, { useEffect } from 'react'
import { useLoaderContext } from '../providers/LoaderContext'

import frogknightPng from '../assets/Frog_Knight_sprite-200.png'
import skeletonPng from '../assets/Skeleton_Warrior_sprite-200.png'


import goodHealthTexturePng from '../assets/HEALTH_TEXTURE_BAD.png'
import badHealthTexturePng from '../assets/HEALTH_TEXTURE_BAD.png'


// export default Pixi<{ scale: number }, Graphics>('PixiHealthBar', {
//     create: (props) => {

//     },
// })

const basicAssets = {
    'frogknight': frogknightPng,
    'skeleton': skeletonPng,
}
const deluxeAssets = {
    'goodHealthTexture': goodHealthTexturePng,
    'badHealthTexture': badHealthTexturePng,
}
export default function AssetLoader(): JSX.Element {
    // const app = useApp()
    const { dispatch, isBasicLoaded } = useLoaderContext()

    useEffect(() => {
        check(basicAssets, 'basicLoaded')
        if (isBasicLoaded) check(deluxeAssets, 'deluxeLoaded')

        function check(assets: Record<string, string>, a: 'basicLoaded' | 'deluxeLoaded') {
            let anyNewLoaded = false
            for (const [name, url] of Object.entries(assets)) {
                if (Loader.shared.resources[name]?.data == null) {
                    Loader.shared.add(name, url)
                    anyNewLoaded = true
                }
            }
            if (!anyNewLoaded) {
                dispatch({ a })
                return
            }
            Loader.shared.load()
                .onComplete.add(() => {
                    dispatch({ a })
                })
        }

    }, [dispatch, isBasicLoaded])

    return <></>
}
