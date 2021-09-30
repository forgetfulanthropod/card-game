import { Loader } from 'pixi.js'
import React, { useEffect } from 'react'
import frogknight from '../assets/Frog_Knight_sprite-200.png'
import skeleton from '../assets/Skeleton_Warrior_sprite-200.png'
import { useLoaderContext } from '../providers/LoaderContext'

import fishstick from '../assets/misc-png/INVENTORY_FISHSTICK.png'
import potion from '../assets/misc-png/INVENTORY_POTION.png'
import bread from '../assets/misc-png/ITEM_BREAD.png'
import chestBody from '../assets/CHEST_BODY.png'
import chestLid from '../assets/CHEST_LID.png'


const assets = {
    frogknight,
    skeleton,
    fishstick,
    potion,
    bread,
    chestBody,
    chestLid,
}
export default function AssetLoader(): JSX.Element {
    // const app = useApp()
    const { basicLoaded } = useLoaderContext()

    useEffect(() => {

        let anyNewLoaded = false
        for (const [name, url] of Object.entries(assets)) {
            if (Loader.shared.resources[name]?.data == null) {
                Loader.shared.add(name, url)
                anyNewLoaded = true
            }
        }
        if (!anyNewLoaded) {
            basicLoaded()
            return
        }
        Loader.shared.load()
            .onComplete.add(() => {
                basicLoaded()
            })

    }, [basicLoaded])

    return <></>
}
