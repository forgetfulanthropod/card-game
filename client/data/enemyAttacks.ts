// prettier-ignore
const enemyAttacksTable = [
    ['Enemy', 'Level', 'Base Health', 'Base Attack', 'Base Block', 'Move 1', 'Move 2', 'Move 3', 'Move 4', 'Move 5'],
    //
    ['Skeleton', '1', '18', '4', '7', 'Sword Whack (BA)', '', '', 'Block', ''],
    ['Skeleton', '2', '27', '6', '9', 'Sword Whack (BA)', 'Rusty Poke (DOT 2)', '', 'Block', ''],
    ['Skeleton', '3', '36', '8', '12', 'Sword Whack (BA)', 'Rusty Poke (DOT 2)', 'Slash (SL)', 'Block', ''],
    ['Skeleton', '4', '50', '11', '16', 'Sword Whack (BA)', 'Rusty Poke (DOT 2)', 'Slash (SL)', 'Block', ''],
    ['Skeleton', '5', '65', '14', '19', 'Sword Whack (BA)', 'Rusty Poke (DOT 2)', 'Slash (SL)', 'Block', ''],
    //
    ['Skeleton', '6', '87', '17', '22', 'Sword Whack (BA)', 'Rusty Poke (DOT 2, also applies Fatigue 1)', 'Slash (SL)', 'Block', 'Startling Spook (Applies Unguarded 1, Fatigue 1)'],
    ['Skeleton', '7', '101', '20', '25', 'Sword Whack (BA)', 'Rusty Poke (DOT 2, also applies Fatigue 1)', 'Slash (SL)', 'Block', 'Startling Spook (Applies Unguarded 2, Fatigue 2)'],
    ['Skeleton', '8', '121', '23', '28', 'Sword Whack (BA)', 'Rusty Poke (DOT 2, also applies Fatigue 1)', 'Slash (SL)', 'Block', 'Startling Spook (Applies Unguarded 2, Fatigue 2)'],
    ['Skeleton', '9', '135', '26', '31', 'Sword Whack (BA)', 'Rusty Poke (DOT 2, also applies Fatigue 1)', 'Slash (SL)', 'Block', 'Startling Spook (Applies Unguarded 3, Fatigue 3)'],
    ['Skeleton', '10', '150', '29', '34', 'Sword Whack (BA)', 'Rusty Poke (DOT 2, also applies Fatigue 1)', 'Slash (SL)', 'Block', 'Startling Spook (Applies Unguarded 3, Fatigue 3)'],
    //
    ['Matcha', '1', '24', '3', '10', 'Basic Attack', '', '', 'Block', ''],
    ['Matcha', '2', '36', '4', '14', 'Basic Attack', 'Surprise Allergy (Deals 50% of attack damage, applies Poison 1 if unblocked, Fatigue 1)', '', 'Block', ''],
    ['Matcha', '3', '55', '6', '17', 'Basic Attack', 'Surprise Allergy (Deals 50% of attack damage, applies Poison 1 if unblocked, Fatigue 1)', 'Itchy Ooze (DOT 1)', 'Block', ''],
    ['Matcha', '4', '72', '8', '22', 'Basic Attack', 'Surprise Allergy (Deals 50% of attack damage, applies Poison 2 if unblocked, Fatigue 1)', 'Itchy Ooze (DOT 2)', 'Block', ''],
    ['Matcha', '5', '80', '11', '26', 'Basic Attack', 'Surprise Allergy (Deals 50% of attack damage, applies Poison 2 if unblocked, Fatigue 1)', 'Itchy Ooze (DOT 2, applies Poison 1 if any damage goes unblocked.)', 'Block', ''],
    //
    ['Matcha', '6', '105', '14', '31', 'Basic Attack', 'Surprise Allergy (Deals 50% of attack damage, applies Poison 3 if unblocked, Fatigue 2)', 'Itchy Ooze (DOT 2)', 'Block', 'Engulf (Deals 50% of attack damage, applies Stun if any damage goes unblocked)'],
    ['Matcha', '7', '130', '15', '36', 'Basic Attack', 'Surprise Allergy (Deals 50% of attack damage, applies Poison 3 if unblocked, Fatigue 2)', 'Itchy Ooze (DOT 2)', 'Block', 'Engulf (Deals 50% of attack damage, applies Stun if any damage goes unblocked)'],
    ['Matcha', '8', '160', '19', '41', 'Basic Attack', 'Surprise Allergy (Deals 50% of attack damage, applies Poison 4 if unblocked, Fatigue 2)', 'Itchy Ooze (DOT 2)', 'Block', 'Engulf (Deals 75% of attack damage, applies Stun if any damage goes unblocked)'],
    ['Matcha', '9', '175', '22', '48', 'Basic Attack', 'Surprise Allergy (Deals 50% of attack damage, applies Poison 4 if unblocked, Fatigue 2)', 'Itchy Ooze (DOT 2)', 'Block', 'Engulf (Deals 75% of attack damage, applies Stun if any damage goes unblocked)'],
    ['Matcha', '10', '200', '25', '56', 'Basic Attack', 'Surprise Allergy (Deals 50% of attack damage, applies Poison 5 if unblocked, Fatigue 2)', 'Itchy Ooze (DOT 2)', 'Block', 'Engulf (Deals 75% of attack damage, applies Stun if any damage goes unblocked)'],
    //
    ['Orc Warrior', '1', '15', '3', '6', 'Meaty Charge (BA, applies bleed (1) if any damage goes unblocked)', '', '', 'Block', ''],
    ['Orc Warrior', '2', '33', '4', '8', 'Meaty Charge (BA, applies bleed (1) if any damage goes unblocked)', '', '', 'Block', ''],
    ['Orc Warrior', '3', '50', '6', '10', 'Meaty Charge (BA, applies bleed (1) if any damage goes unblocked)', 'Slash (SL)', '', 'Block', ''],
    ['Orc Warrior', '4', '75', '9', '12', 'Meaty Charge (BA, applies bleed (1) if any damage goes unblocked)', 'Slash (SL)', 'Bellow and Sing, deals 50% of attack damage, applies fatigue (1) (applies debilatated (1) if any damage goes unblocked)', 'Block', ''],
    ['Orc Warrior', '5', '88', '12', '14', 'Meaty Charge (BA, applies bleed (1) if any damage goes unblocked)', 'Slash (SL)', 'Bellow and Sing, deals 50% of attack damage, applies fatigue (2) (applies debilatated (2) if any damage goes unblocked)', 'Block', 'Scream and Charge (Deals 100% of attack damage, applies Unguarded (1) after)'],
    ['Orc Warrior', '6', '103', '14', '16', 'Meaty Charge (BA, applies bleed (2) if any damage goes unblocked)', 'Slash (SL)', 'Bellow and Sing, deals 50% of attack damage, applies fatigue (2) (applies debilatated (2) if any damage goes unblocked)', 'Block', 'Scream and Charge (Deals 100% of attack damage, applies Unguarded (1) after)'],
    ['Orc Warrior', '7', '118', '16', '19', 'Meaty Charge (BA, applies bleed (2) if any damage goes unblocked)', 'Slash (SL)', 'Bellow and Sing, deals 50% of attack damage, applies fatigue (1)Bellow and Sing, deals 50% of attack damage, applies fatigue (2) (applies debilatated (2) if any damage goes unblocked)', 'Block', 'Scream and Charge (Deals 100% of attack damage, applies Unguarded (2) after)'],
    ['Orc Warrior', '8', '133', '18', '22', 'Meaty Charge (BA, applies bleed (2) if any damage goes unblocked)', 'Slash (SL)', 'Bellow and Sing, deals 50% of attack damage, applies fatigue (2) (applies debilatated (2) if any damage goes unblocked)', 'Block', 'Scream and Charge (Deals 125% of attack damage, applies Unguarded (2) after)'],
    ['Orc Warrior', '9', '148', '20', '25', 'Meaty Charge (BA, applies bleed (2) if any damage goes unblocked)', 'Slash (SL)', 'Bellow and Sing, deals 50% of attack damage, applies fatigue (2) (applies stunned (1) if any damage goes unblocked)', 'Block', 'Scream and Charge (Deals 125% of attack damage, applies Unguarded (2) after)'],
    ['Orc Warrior', '10', '163', '23', '28', 'Meaty Charge (BA, applies bleed (2) if any damage goes unblocked)', 'Slash (SL)', 'Bellow and Sing, deals 50% of attack damage, applies fatigue (2) (applies debilatated (2) if any damage goes unblocked)', 'Block', 'Scream and Charge (Deals 125% of attack damage, applies Vulnerable (2) after)'],
    //
    ['Bosshog Jürgen', '', '190', '30', '30', 'Belly Flop: Bosshog Jürgen will attempt to attack for 30 damage, but will deal 1 point less for every point of damage he takes.', 'Roll Around (same as Belly Flop, but with Slash damage)', 'Stamp and Snort: Jürgen gets very angry and stamps around in place. He does nothing this turn but doubles his attack damage the following turn.', 'Block', 'Sit Upon: Jürgen sits on one of your characters. This attack does 50% of his attack damage and gives Stun (1) to the target.'],
    //
    ['Mimic', '1', '39', '3', '8', 'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).', 'Chomp (BA)', 'Infectious Bite (DOT1, applies poison (2) if 5 or more damage goes unblocked)', 'Block', ''],
    ['Mimic', '2', '66', '4', '12', 'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).', 'Chomp (BA)', 'Infectious Bite (DOT1, applies poison (2) if 5 or more damage goes unblocked)', 'Block', ''],
    ['Mimic', '3', '103', '6', '16', 'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).', 'Chomp (BA)', 'Infectious Bite (DOT1, applies poison (2) if 5 or more damage goes unblocked)', 'Block', ''],
    ['Mimic', '4', '129', '8', '20', 'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).', 'Chomp (BA)', 'Infectious Bite (DOT1, applies poison (3) if 5 or more damage goes unblocked)', 'Block', ''],
    ['Mimic', '5', '155', '12', '24', 'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).', 'Chomp (BA)', 'Infectious Bite (DOT1, applies poison (3) if 5 or more damage goes unblocked)', 'Block', ''],
    ['Mimic', '6', '172', '14', '28', 'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).', 'Chomp (BA)', 'Infectious Bite (DOT1, applies poison (3) if 5 or more damage goes unblocked)', 'Block', ''],
    ['Mimic', '7', '205', '16', '32', 'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).', 'Chomp (BA)', 'Infectious Bite (DOT1, applies poison (3) if 5 or more damage goes unblocked)', 'Block', ''],
    ['Mimic', '8', '222', '18', '35', 'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).', 'Chomp (BA)', 'Infectious Bite (DOT1, applies poison (4) if 5 or more damage goes unblocked)', 'Block', ''],
    ['Mimic', '9', '245', '20', '38', 'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).', 'Chomp (BA)', 'Infectious Bite (DOT1, applies poison (4) if 5 or more damage goes unblocked)', 'Block', ''],
    ['Mimic', '10', '264', '22', '42', 'Mimic (Whenever a mimic loses 10% or more of its base health from a single attack, it deals the same amount of damage back to the player).', 'Chomp (BA)', 'Infectious Bite (DOT1, applies poison (5) if 5 or more damage goes unblocked)', 'Block', ''],
    //
    ['Hans Toadmaw, Warlock at Large (reskinned Frog Wizard to match the Frog Wizard artist proof)', '', '132', '25', '9', "Buff/Block (Gives +3 damage to all of Hans' Guards and Hans himself till the end of the following turn).", 'Magic Missile (attacks for 25)', 'Guards!!! (summons up to 2 cultist guards)', 'Blood Moon Curse (all player characters receive fatigue (2), unguarded (2))'],
    ['Cultist Guard (reskinned Frog Knight)', '', '18', '4', '0', 'Attack (Attacks for 4)', '', '', ''],
    //
    ['Halfdan The Ancient', '', '250', '25', '20', 'Rest (does nothing)', 'Eviscerating Sweep (Deals 100%, Splash Damage) applies vulnerable (3)', 'Passive block (every time Halfdan rests, generate 20 block). If he is ever stunned or skips his turn for any reason, generate 20 block.', 'Ancient Strike (Deals 200%) if any damage goes unblocked, the targeted Kaiju is stunned for 1 turn.', ''],
    //
    ['Mega Matcha (Large)', '', '200-100', '15', '20', 'Matcha Mash: Matcha will deal damage equal to ATK.', 'Matcha Madness: Apply poison 3 to ALL characters.', 'Matcha Meld: Block equal to DEF and Level 1 and 2 matchas, will attempt to rejoin the matcha with the highest HP. If successful, the lesser Matcha will add their HP to the greater matcha and the lesser Matcha will be removed from the field. The targeted matcha will level up if it exceeds the minimum health threshold for the next level of matcha.', '', ''],
    ['Medium', '99-30', '10', '10', '', '', '', '', ''],
    ['Small', '>29', '10', '5', '', '', '', '', ''],
] as const

export {}
