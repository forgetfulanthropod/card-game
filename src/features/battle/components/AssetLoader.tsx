import type { h, JSX } from 'preact'

import { Loader } from 'pixi.js'
import { useEffect, useState } from 'preact/hooks'
import orcWarrior from '../assets/chars/orcWarrior-200.png'
import chestBody from '../assets/CHEST_BODY.png'
import chestLid from '../assets/CHEST_LID.png'
import frogknight from '../assets/Frog_Knight_sprite-200.png'
import healthTexture from '../assets/HEALTH_TEXTURE.png'
import fishstick from '../assets/misc-png/INVENTORY_FISHSTICK.png'
import potion from '../assets/misc-png/INVENTORY_POTION.png'
import bread from '../assets/misc-png/ITEM_BREAD.png'
import skeleton from '../assets/Skeleton_Warrior_sprite-200.png'
import { useLoaderContext } from '../providers/LoaderProvider'


// export default Pixi<{ scale: number }, Graphics>('PixiHealthBar', {
//     create: (props) => {

//     },
// })

const basicAssets = {
    frogknight,
    skeleton,
    fishstick,
    potion,
    bread,
    chestBody,
    chestLid,
    orcWarrior,
}
const deluxeAssets = {
    healthTexture,
}
const allAssets = { ...basicAssets, ...deluxeAssets }
export type AssetKey = keyof typeof allAssets
export default function AssetLoader(): JSX.Element {
    // const app = useApp()
    const { deluxeLoaded, basicLoaded, isBasicLoaded } = useLoaderContext()
    const [loaded, setLoaded] = useState(new Set(
        Object.keys(allAssets).filter(name => Loader.shared.resources[name]?.data != null)
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

    }, [basicLoaded])

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
