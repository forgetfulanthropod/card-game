Characters have two stats, health and damage.

Characters each have two ways of attacking.:

-   Each way of attacking applies damage differently (splash damage, DOT, standard attack, etc).

A coin flip determines who goes first, the player or enemy.:

-   This cycle is repeated after each combat round.
-   A combat round ends when all characters from both sides have attacked once.

After determining who goes first but before any characters attack, players set the stances of their characters.:

-   There are three stances: aggressive, defensive, and neutral.
-   Aggressive characters deal 25% more damage but take 25% more (rounded down to a minimum of 1 more damage for both).
-   Defensive characters take 25% less but deal 25% less damage (rounded down to a minimum of 1 less damage for both).
-   Neutral characters take/receive take and receive damage with no modifier.
-   Defensive characters are not targeted unless all characters are in a defensive stance.
-   Aggressive characters have a twice as high chance of being targeted over characters in a neutral stance.
-   A character can only stay in the same stance for two rounds max in a row in PVP.

Example: a player has two characters, one in neutral and one aggressive.:

-   The aggressive character has a 75% chancte of being targeted.
-   If there were two characters in neutral and one aggressive, the aggressive character would have a 50% chance of being targeted.

Players choose which enemy character to attack every combat.:

-   They alternate choosing characters to attack with.

Players can see what moves enemies have by hovering over them.

Players are given a maximum of 15 seconds to decide what character to activate in PVP.:

-   They are then given 15 seconds to decide what move to use and who to target in PVP.
-   Players are given an infinite amount of time vs AI.

Slash damage attacks two characters.:

-   Potential: A player can forgo attacking to swap the position of two characters, although this will most likely be a rare occurrence.

Damage over time abilities last for X rounds.:

-   A character can only be affected by a single type of damage over time effect at once.
-   If a more powerful damage over time ability affects a character, that more powerful one takes priority.
-   When the more powerful one has expired, the less powerful damage over time will go back into effect.
-   Damage over time can be queued to last for multiple turns, but only the damage from one of those attacks can be taken at once (the next damage over time effect will start once the one currently affecting the target has expired).

Damage can never be 0.:

-   It is always 1 at a minimum.

For ROD attacks with slash or splash, randomize the damage result of each hit individually (targets are still selected by player)..

Health of all characters is visible to the player at all times.:

-   Damage potential of their own characters should be on screen too.
-   Enemies can be seen by hovering over.

You can exit a dungeon at any time between combat rounds.:

-   Once a combat round starts, you cannot leave until it is finished.
-   If you leave a dungeon you collect treasure up to the current dungeon level you’re at.
-   The amount of loot you get is exponentially correlated to the amount of time you are in a dungeon in a single instance.
-   If your party is wiped while fighting, a large percentage of loot will be lost (tbd).

Energy Drinks: For 5 Points, heal up to +20 health and +10 maximum damage to a single character.:

-   This is a consumable that helps scale the balance of commons and uncommons, and we can make fun skins for them.
-   Each character can have up to two energy drinks per dungeon run.
-   I was imagining they’re used pre dungeon, but maybe we can have a mechanic where a player uses one during their turn (this would not replace their attack).
-   Activated ability

In PVP, Player character’s base attacks go down by 33% when they are at less than 50% health, and they go down by 50% at less than 25% of health.

## Move Keywords:

Basic Attack: 100% of attack damage, no modifiers

Slash: 50% of attack damage, affects up to one adjacent target (rounded up at .5 or greater, down otherwise)

DOT 1: Deals 50% of attack damage.:

-   Does 33% for three subsequent turns as well.
-   (subsequent damage is inflicted before that character activates.
-   This is not modified by RNG)

DOT 2: Deals 50% of attack damage.:

-   Does 25% for four subsequent turns as well (subsequent damage is inflicted before that character activates.
-   This is not modified by RNG).

Random Damage 1: Deals 25% more to 25% less damage randomly

Random Damage 2: Deals 33% more to 33% less damage randomly

Random Damage 3: Deals 50% more to 50% less damage randomly

Splash: Deals 33% of damage (rounded up at .5 or greater, down otherwise), affects up to 2 adjacent targets.:

-   If only two targets are present, it does 40% damage to both.

Heal: Heals target for 75% of attack damage.

Life steal: Deals 50% of attack damage.:

-   Heals for 25%.

Stable: No ⅓ Modifier

Block: Reduce all damage received this round by this kaiju’s attack characteristic to a minimum of 1.:

-   If the combined attack value of enemies attacking this kaiju exceeds this kaiju’s attack characteristic during the round, excess damage is taken as normal.

Debuff 1: Reduce the attack characteristic of an enemy by 100% of this kaiju’s attack characteristic, to a minimum of 1, for the remainder of the round.

Debuff 2: Deal 50% of attack damage.:

-   Reduce the target’s attack damage by 50% of your attack damage (to a minimum of 1) until the end of the round.
-   If this has a splash or slash modifier, split both the 50% damage reduction and damage inflicted from this attack between all targets evenly.

The potential damage range of each character’s attack should always be displayed.:

-   For example, if a character has 10 attack and does a basic attack, it should show the potential damage as 9-11, not 10.

DOT effects applied by multiple characters can stack, but a character cannot stack DOT with itself.:

-   If a character applies DOT a second time, it simply resets how many turns of DOT are left.
-   If a character has multiple DOT attacks and two different ones are applied, whichever character does the most damage takes priority.

## AI Attack priority:

AI choose attack priority based on the stances of the player’s characters.:

-   The AI has a 50/50 chance attacking with their character that has the highest amount of attack power first.
-   If an AI has a character with 25% health or less, it has a 50/50 chance of prioritizing attacking with that character first (this takes precedence over the attack power modifier).
-   After that, the attack sequence is completely random.

All the dungeon enemies are versions of our own characters with special dungeon skins.:

-   That way players aren’t fighting exact mirrors of their own party.
-   Maybe we can realize a “dungeon monster” pack at some point that allows players to use these.

After clearing 2 dungeon fights, characters each receive 10% of their maximum health back.

# Dungeon Levels

-   Hooligan’s Bluff (up to 20 points) 1x modifier
-   The Matcha Caves (up to 40 points) 2x modifier
-   Fort Skeleton (up to 65 points) 3x modifier
-   The Ninth Trash Hole of Hell (up to 100 points) 5x modifier

Normal Dungeons have up to 3 types of rooms, A, B, and C.:

-   When a player enters the next room of a normal dungeon, either A, B, or C will be generated.
-   If a prior room is A, B, or C, it does not affect if the next room is A, B or C.

When dungeon rooms are scaled by a modifier, either randomly increase the number of enemies based on the X modifier, or increase the level of enemies in that room by the X modifier (a 2x modifier on a level 1 skeleton warrior would randomly either produce 2 skeleton warriors, or a level 3 skeleton warrior.:

-   A 3x modifier on a level 2 skeleton warrior would either produce three level 2 skeleton warriors or a single level 5 skeleton warrior.
-   Etc.
-   If a higher level than 10 enemy is needed, add 20 health and 2 damage per level).
-   Do this per creature, not one roll for the entire room.
-   If a modifier is applied to leveling, add that modifier’s value to the generated enemy’s level.

Enemies level 10 and above deal half damage when at 50% health or less.

After a player has gone through all 10 normal dungeon rooms, start back at the dungeon room 3 and add a x2 modifier.

### Hooligans Bluff Enemy Generation:

Dungeon Room 1:

-   A: Two Level 1 Matchas or Skeletons. 50/50 of each.
-   B: One Level 2 Matcha or Skeleton.
-   C:

Dungeon Room 2:

-   A: Two Level 1 Matchas or Skeletons. 50/50 of each.
-   One Level 2 Matcha or Skeleton. 50/50.
-   B: One Lv4 Skeleton, 50/50 lvl 1 skeleton or matcha

Dungeon Room 3:

-   A: One Level 3 Matcha or Skeleton. 50/50 of each.
-   One Level 2 Matcha or Skeleton. 50/50.
-   B: One Level 5 Skeleton or Matcha. 60/40

Dungeon Room 4:

-   A: Two Level 1 Matchas or Skeletons. 50/50 of each.
-   One Level 1 Orc Warrior.
-   50/50 Chance of Level 2 Jumbo (1.5x attack, 2x health) or normal level 2 matcha/skeleton. Loot is scaled accordingly.
-   B: Level 3 Orc warrior.

Dungeon Room 5:

-   A: One Level 3 Matcha or Skeleton. 50/50 of each.
-   One Level 2 Matcha or Skeleton. 50/50.
-   One Level 1 Orc Warrior.

Dungeon Room 6 (boss):

-   A: Level 5 Mimic
    Choose boss as a door

Players are given a choice of 3 different new rooms they can choose to enter after clearing each dungeon room. These are randomly generated from the following list:

1. Big scary door (additional x2 dungeon modifier)
2. Candy door that looks like weenie hut jr (generates a room equal to three rooms back, with equally scaled loot modifier)
3. Normal door (⅓ chance of being generated as a choice. Unlike all other doors, multiple of these can be generated.)
4. Matcha door (will automatically spawn all matcha if given a choice between randomly generating matcha with 50/50 variables. If this level is level 6, spawn a level 10 matcha cube).
5. Skeleton door (same as matcha door but for skeletons)
6. Rare item door. We should figure out the specifics of what this should be in conjunction with crafting, but it’d be fun to have a door that has an especially difficult material or crafting item.
7. Character boss door. Door with a specific character’s face on it that lets you fight them as a boss. After the 5th room, the 6th room always has the option of being a boss door (in the middle of the other two doors)
8. Series of tiny doors: applies dungeon level modifier to generate more characters for all enemies
9. Very very big door: applies dungeon level modifier to generate higher level characters for all enemies

For enemies above level 10, add +3 attack/+21 health per level.

-   Room 1= 1 treasure token.
-   Room 2= 2 treasure tokens (3 total).
-   Room 3= 3 treasure tokens (6 total).
-   Etc

## Future points:

We need to consider how NFTs are healed.

-   Do they heal immediately when leaving the dungeon but only a certain number of dungeon visits per day?
-   Do they heal over time but we give them the option of healing with a potion?
-   Can you use infinite potions to farm a dungeon endlessly?
-   Etc.

How does the heal ability work in combat?

-   What % is healed?
-   Can you heal allies or does it only target the kaiju who has it?
-   What are the consequences of both?
-   Is there a max amount of heals that can be used per combat round?
-   Max per dungeon run?

Figure out an average damage per point per turn, figure out damage per point per turn for all moves, figure out the same for health per point

-   Average health per 15 points=60
-   Avg Damage=10
-   Avg health per 20 points=80
-   Avg damage per 20 points=13.33
-   Average Health per 25 points=100
-   Average damage per 25 points=16.67
-   Average Health per 30 points=120
-   Average damage per 30 points=20
-   Lootbox leveling system, different looking lootboxes per 10 levels
-   Average health per point: 4
-   Average damage per point: .6

Level scaling proposal:

-   Whenever leveling up, choose between gaining +1 attack or +7 health?

Frost breath: deals less damage, makes opponent deal less damage

Menu for leveling skill trees

### Ideas for skin attributes:

-   Autumn bog spirit: +3 attack, -14 health
-   All colors (including gold): cosmetic only
-   Blueberry matcha: custom blueberry sprite animation for random allergy?
-   Cave mushroom: +14 base health, -2 attack
-   Cherry blossom: emit cherry particles with all attacks?
-   Clown: +3/-3 rng modifier on every attack. Attacks trigger a clown horn or squeaky toy sound effect and confetti animation
-   Day snacky: cosmetic only
-   Dragon king trio of fools: Three Fools Are Better Than One also has DOT 1
-   Garbage: new ability: stinky aura (block)
-   Ghost: +2 attack, -14 health
-   Glitch: +1 attack, -7 health
-   Night: -1 attack, +7 health
-   Poison mushroom farmer: whomp applies DOT2
-   Psychedelic mushroom farmer: has an additional move: disorient (debuff 1)
-   Tiny: -3 attack, +21 health
-   Jumbo: +3 attack, -21 health
-   Viking, pirate both cosmetic
-   Watermelon sorbet: custom watermelon sprite animation for random allergy?
-   Warlock: +3 attack, -14 health:
