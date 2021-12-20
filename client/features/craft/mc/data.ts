const COBBLESTONE = 4
const WOOD_PLANK = 5
const WOOD = 17
const TORCH = 50
const CHEST = 54
const CRAFTING_TABLE = 58
const FURNACE = 61
const REDSTONETORCH = 76
const REDSTONE_BLOCK = 152
const IRON_SHOVEL = 256
const IRON_PICKAXE = 257
const IRON_AXE = 258
const FLINT_AND_STEEL = 259
const BOW = 261
const ARROW = 262
const COAL = 263
const DIAMOND = 264
const IRON_INGOT = 265
const GOLD = 266
const IRON_SWORD = 267
const WOODEN_SWORD = 268
const WOODEN_SHOVEL = 269
const WOODEN_PICKAXE = 270
const WOODEN_AXE = 271
const STONE_SWORD = 272
const STONE_SHOVEL = 273
const STONE_PICKAXE = 274
const STONE_AXE = 275
const DIAMOND_SWORD = 276
const DIAMOND_SHOVEL = 277
const DIAMOND_PICKAXE = 278
const DIAMOND_AXE = 279
const STICK = 280
const GOLDEN_SWORD = 283
const GOLDEN_SHOVEL = 284
const GOLDEN_PICKAXE = 285
const GOLDEN_AXE = 286
const STRING = 287
const FEATHER = 288
const WOODEN_HOE = 290
const STONE_HOE = 291
const IRON_HOE = 292
const DIAMOND_HOE = 293
const GOLDEN_HOE = 294
const FLINT = 318
const BUCKET = 325
const REDSTONE = 331
const _COMPASS = 345
const FISHING_ROD = 346
const _CLOCK = 347

export type Recipe = [string, number, [number, number, number, number, number, number, number, number, number]]

export const recipes: Recipe[] = [
    ['Wood Planks', WOOD_PLANK, [0, 0, 0, 0, WOOD, 0, 0, 0, 0]],
    ['Stick', STICK, [0, 0, 0, 0, WOOD_PLANK, 0, 0, WOOD_PLANK, 0]],
    ['Bow', BOW, [STRING, STICK, 0, STRING, 0, STICK, STRING, STICK, 0]],
    ['Arrow', ARROW, [0, FLINT, 0, 0, STICK, 0, 0, FEATHER, 0]],
    ['Torch', TORCH, [0, 0, 0, 0, COAL, 0, 0, STICK, 0]],
    ['Redstone Torch', REDSTONETORCH, [0, 0, 0, 0, REDSTONE, 0, 0, STICK, 0]],
    [
        'Redstone Block',
        REDSTONE_BLOCK,
        [REDSTONE, REDSTONE, REDSTONE, REDSTONE, REDSTONE, REDSTONE, REDSTONE, REDSTONE, REDSTONE],
    ],
    [
        'Chest',
        CHEST,
        [WOOD_PLANK, WOOD_PLANK, WOOD_PLANK, WOOD_PLANK, 0, WOOD_PLANK, WOOD_PLANK, WOOD_PLANK, WOOD_PLANK],
    ],
    ['Crafting Table', CRAFTING_TABLE, [0, 0, 0, WOOD_PLANK, WOOD_PLANK, 0, WOOD_PLANK, WOOD_PLANK, 0]],
    [
        'Furnace',
        FURNACE,
        [COBBLESTONE, COBBLESTONE, COBBLESTONE, COBBLESTONE, 0, COBBLESTONE, COBBLESTONE, COBBLESTONE, COBBLESTONE],
    ],
    ['Bucket', BUCKET, [0, 0, 0, IRON_INGOT, 0, IRON_INGOT, 0, IRON_INGOT, 0]],
    ['Flint and Steel', FLINT_AND_STEEL, [0, 0, 0, IRON_INGOT, 0, 0, 0, FLINT, 0]],
    ['Wooden Axe', WOODEN_AXE, [WOOD_PLANK, WOOD_PLANK, 0, WOOD_PLANK, STICK, 0, 0, STICK, 0]],
    ['Stone Axe', STONE_AXE, [COBBLESTONE, COBBLESTONE, 0, COBBLESTONE, STICK, 0, 0, STICK, 0]],
    ['Iron Axe', IRON_AXE, [IRON_INGOT, IRON_INGOT, 0, IRON_INGOT, STICK, 0, 0, STICK, 0]],
    ['Diamond Axe', DIAMOND_AXE, [DIAMOND, DIAMOND, 0, DIAMOND, STICK, 0, 0, STICK, 0]],
    ['Golden Axe', GOLDEN_AXE, [GOLD, GOLD, 0, GOLD, STICK, 0, 0, STICK, 0]],
    ['Wooden Hoe', WOODEN_HOE, [WOOD_PLANK, WOOD_PLANK, 0, 0, STICK, 0, 0, STICK, 0]],
    ['Stone Hoe', STONE_HOE, [COBBLESTONE, COBBLESTONE, 0, 0, STICK, 0, 0, STICK, 0]],
    ['Iron Hoe', IRON_HOE, [IRON_INGOT, IRON_INGOT, 0, 0, STICK, 0, 0, STICK, 0]],
    ['Diamond Hoe', DIAMOND_HOE, [DIAMOND, DIAMOND, 0, 0, STICK, 0, 0, STICK, 0]],
    ['Golden Hoe', GOLDEN_HOE, [GOLD, GOLD, 0, 0, STICK, 0, 0, STICK, 0]],
    ['Wooden Pickaxe', WOODEN_PICKAXE, [WOOD_PLANK, WOOD_PLANK, WOOD_PLANK, 0, STICK, 0, 0, STICK, 0]],
    ['Stone Pickaxe', STONE_PICKAXE, [COBBLESTONE, COBBLESTONE, COBBLESTONE, 0, STICK, 0, 0, STICK, 0]],
    ['Iron Pickaxe', IRON_PICKAXE, [IRON_INGOT, IRON_INGOT, IRON_INGOT, 0, STICK, 0, 0, STICK, 0]],
    ['Diamond Pickaxe', DIAMOND_PICKAXE, [DIAMOND, DIAMOND, DIAMOND, 0, STICK, 0, 0, STICK, 0]],
    ['Golden Pickaxe', GOLDEN_PICKAXE, [GOLD, GOLD, GOLD, 0, STICK, 0, 0, STICK, 0]],
    ['Wooden Shovel', WOODEN_SHOVEL, [0, WOOD_PLANK, 0, 0, STICK, 0, 0, STICK, 0]],
    ['Stone Shovel', STONE_SHOVEL, [0, COBBLESTONE, 0, 0, STICK, 0, 0, STICK, 0]],
    ['Iron Shovel', IRON_SHOVEL, [0, IRON_INGOT, 0, 0, STICK, 0, 0, STICK, 0]],
    ['Diamond Shovel', DIAMOND_SHOVEL, [0, DIAMOND, 0, 0, STICK, 0, 0, STICK, 0]],
    ['Golden Shovel', GOLDEN_SHOVEL, [0, GOLD, 0, 0, STICK, 0, 0, STICK, 0]],
    ['Wooden Sword', WOODEN_SWORD, [0, WOOD_PLANK, 0, 0, WOOD_PLANK, 0, 0, STICK, 0]],
    ['Stone Sword', STONE_SWORD, [0, COBBLESTONE, 0, 0, COBBLESTONE, 0, 0, STICK, 0]],
    ['Iron Sword', IRON_SWORD, [0, IRON_INGOT, 0, 0, IRON_INGOT, 0, 0, STICK, 0]],
    ['Diamond Sword', DIAMOND_SWORD, [0, DIAMOND, 0, 0, DIAMOND, 0, 0, STICK, 0]],
    ['Golden Sword', GOLDEN_SWORD, [0, GOLD, 0, 0, GOLD, 0, 0, STICK, 0]],
    ['Fishing Rod', FISHING_ROD, [0, 0, STICK, 0, STICK, STRING, STICK, 0, STRING]],
]
export const initialInventory = [
    COBBLESTONE,
    WOOD,
    IRON_INGOT,
    GOLD,
    DIAMOND,
    REDSTONE,
    STRING,
    FEATHER,
    FLINT,
    COAL,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
]
