export default {
    "bigScary": { id: "bigScary", description: "additional x2 dungeon modifier" },
    "candyBaby": { id: "candyBaby", description: "generates a room equal to three rooms back, with equally scaled loot modifier" },
    "normal": { id: "normal", description: "always takes up 1 door slot. does A-B-C system based on level" },
    "matcha": { id: "matcha", description: "will automatically spawn all matcha if given a choice between randomly generating matcha with 50/50 variables.if this level is level 6, spawn a level 10 matcha cube" },
    "skeleton": { id: "skeleton", description: "same as matcha door but for skeletons" },
    "rareItem": { id: "rareItem", description: "we should figure out the specifics of what this should be in conjunction with crafting, but it’d be fun to have a door that has an especially difficult material or crafting item" },
    "bossDoor": { id: "bossDoor", description: "has the boss" },
    "face": { id: "face", description: "with a specific character’s face on it that lets you fight them as a boss. generate this character at level 1. for each difficult modifier, randomly increase the character's health by +7 or give them +1 attack" },
    "tiny": { id: "tiny", description: "applies dungeon level modifier to generate more characters for all enemies" },
    "jumbo": { id: "jumbo", description: "makes the character with the highest level in this dungeon room jumbo" },
    "randomEvent": { id: "randomEvent", description: "question mark door" },
    "campfire": { id: "campfire", description: "heals all characters for either a flat value or % of health, not sure what a good number would be yet. probably either 10% or +14" },
}
