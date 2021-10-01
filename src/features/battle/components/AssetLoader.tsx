import { IAddOptions, Loader } from 'pixi.js'
import React, { useEffect, useState } from 'react'
import { useLoaderContext } from '../providers/LoaderContext'

import frogknightPng from '../assets/Frog_Knight_sprite-200.png'
import skeletonPng from '../assets/Skeleton_Warrior_sprite-200.png'

import healthTexturePng from '../assets/HEALTH_TEXTURE.png'
import produce from 'immer'
import { from } from '.pnpm/form-data@3.0.1/node_modules/form-data'


// export default Pixi<{ scale: number }, Graphics>('PixiHealthBar', {
//     create: (props) => {

//     },
// })

const basicAssets = {
    'frogknight': frogknightPng,
    'skeleton': skeletonPng,
}
const deluxeAssets = {
    'healthTexture': healthTexturePng,
}
const allAssets = [...Object.keys(basicAssets), ...Object.keys(deluxeAssets)]
export default function AssetLoader(): JSX.Element {
    // const app = useApp()
    const { deluxeLoaded, basicLoaded, isBasicLoaded } = useLoaderContext()
    const [loaded, setLoaded] = useState(new Set(
        allAssets.filter(name => Loader.shared.resources[name]?.data != null)
    ))

    useEffect(() => {
        console.log(loaded)
        if (Object.keys(basicAssets).every(k => loaded.has(k))) {
            basicLoaded()
        }
        if (Object.keys(deluxeAssets).every(k => loaded.has(k))) {
            deluxeLoaded()
        }
    }, [basicLoaded, deluxeLoaded, loaded])

    useEffect(() => {
        for (const [name, url] of Object.entries({ ...basicAssets, ...deluxeAssets })) {
            if (Loader.shared.resources[name]?.data == null) {
                Loader.shared.add(name, url)
            }
        }
        Loader.shared.load()

        // @ts-ignore
        Loader.shared.onLoad.add((_, { name }) => { setLoaded(s => new Set([...Array.from(s), name])) })
        // return () => Loader.shared.onLoad.detach(cb)
    }, [basicLoaded, deluxeLoaded, isBasicLoaded])

    return <></>
}
