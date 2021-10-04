import orcWarrior from '../assets/chars/orcWarrior-200.png'
import chestBody from '../assets/CHEST_BODY.png'
import chestLid from '../assets/CHEST_LID.png'
import frogknight from '../assets/Frog_Knight_sprite-200.png'
import healthTexture from '../assets/HEALTH_TEXTURE.png'
import fishstick from '../assets/misc-png/INVENTORY_FISHSTICK.png'
import potion from '../assets/misc-png/INVENTORY_POTION.png'
import bread from '../assets/misc-png/ITEM_BREAD.png'
import skeleton from '../assets/Skeleton_Warrior_sprite-200.png'


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
