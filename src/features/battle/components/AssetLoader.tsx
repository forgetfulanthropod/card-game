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
import orcWarrior from '../assets/chars/orcWarrior.png'

const assetMap = {
    frogknight,
    skeleton,
    fishstick,
    potion,
    bread,
    chestBody,
    chestLid,
    orcWarrior,
}
export type AssetKey = keyof typeof assetMap
export default function AssetLoader(): JSX.Element {
    // const app = useApp()
    const { basicLoaded } = useLoaderContext()

    useEffect(() => {

        let anyNewLoaded = false
        for (const [name, url] of Object.entries(assetMap)) {
            if (Loader.shared.resources[name]?.data == null) {
                Loader.shared.add(name, url)
                console.log("gonna load", name)
                anyNewLoaded = true
            }
        }
        if (!anyNewLoaded) {
            basicLoaded()
            return
        }
        Loader.shared.load()
            .onComplete.add(() => {
                console.log('everything is loaded')
                basicLoaded()
            })

    }, [basicLoaded])

    return <></>
}
