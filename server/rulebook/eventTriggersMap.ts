import type { EventTriggersMap } from '@shared'

import { dedent } from '@/util'

// TODO: markdown processing
export const eventTriggersMap: EventTriggersMap = {
    carriage: {
        name: 'carriage',
        shortDescription:
            'Your party sees a carriage with a broken wheel.  Driving the carriage is an elderly frog with a very big beard.',
        fullDescription: dedent(`
            "Hello travelers, I am an elderly frog with a very big beard.  I am bad at driving and as a result I have broken my carriage wheel while attempting to do donuts in the cave.  I am unable to fix the wheel by myself, but perhaps could repair it with the assistance of some strapping young kaiju.  Will you help me?"

            1. Help the elderly frog fix his wheel.  Receive X treasure.
            2. Attempt to do donuts with the broken carriage, further damaging the wheel.  Lose X treasure but restore X health to all party members.
            3. Fight the elderly frog and rob him of his cargo.  Deal X damage to all party members, receive 2X treasure.

            **A squeaky voice screeches from an unseen location.**

            "BOMBS, BOMBS FOR SALE!  I HAVE A BOMB/IT IS FOR SALE!"

            Out of a nearby bush emerges a Gnome Hooligan.  He is holding a large unlit bomb and a rolled up wad of wet dollar bills.

            "HELLO TRAVELER, I HAVE A BOMB FOR SALE.  WOULD YOU LIKE TO BUY MY BOMB PLEASE?"

            1.  Purchase the bomb.  Give a single character in your party the ability: WHOLESALE GNOME BOMB (Single use): Splash damage, double the attack value of this character for one round.  Costs X.
            2. Light the bomb.  The gnome hooligan runs away screaming and leaves all of his wet dollar bills scattered on the ground.  Take X damage, receive X treasure.
            3. Ask pressing questions about the Gnome Hooligan's childhood until he has a panic attack and shares his life story.  Build a small campfire and exchange tales while eating salted meat bread.  Heal all party members for X.`),
    },
    clearing: {
        name: 'clearing',
        shortDescription:
            'You find a clearing in the dungeon.  It is a dark and peaceful night.  What would you like to do?',
        fullDescription: dedent(`
            1. Set up camp for the night.  Heal all party members by 20 health.
            2. Bury treasure.  Put aside 30% of your current loot to be saved if you die while in the dungeon.
            3. Throw a small party to lift everyone’s spirits.  Give all characters a +3 attack buff for the next 5 rooms.`),
    },
    hats: {
        name: 'hats',
        shortDescription:
            'Hats!  Hats for sale!  I am selling hats oh god is there anyone here please please help me sell these hats I am desperate to sell my hats.',
        fullDescription: dedent(`
            A desperate hat salesman approaches your party.  He is wearing far too many hats.  They are stacked very tall above his head in a big tower that sways when he walks.

            “Through a series of events I am legally not allowed to discuss, I have been cursed with this burden of 1000 hats. I must sell them all or go to jail.  Buy a hat please?”

            1. Purchase **Fanciful Hat** (costs x)**:** Head item, one use per dungeon room.  While wearing a hat, this character does not suffer a debuff while in an aggressive or defensive stance.
            2. This man and his terrible hats must suffer for their unspoken crimes.  Leave without purchasing one.

            **A large statue of a demon with gems for eyes stands before you.**

            You hear a faint whisper echo as you lock eyes with the demon.  The whisper feels like it is coming from within your own head.

            “Closer”, says the demon.  “Gifts.  Closer”.

            1. One of your party members touches the demon’s left hand.  Permanently give that party member +3 attack and -21 health (to a minimum of 1).
            2. One of your party members touches the demon’s right hand.  Permanently give that party member +22 health and -3 attack (to a minimum of 1).
            3.  “Aaaaaaaaaaaah!”, you scream.  “Ahhhhhhhhhhhhhh!”.  Leave without touching the statue.`),
    },
    gnome: {
        name: 'gnome',
        shortDescription:
            'A gnome wearing striped pajamas with matching nightcap approaches you.  He is carrying a small candle and a warm glass of milk.  He smacks his lips three times.  “Ho hum, memememe”, exclaims the gnome.',
        fullDescription: dedent(`
            **“**It is my bed time” the gnome tells you.  “I will have a much more comfortable sleep if you read me a tale from my favorite book, ‘The Little Gnome Prince Who Lived in A Bath Tub Made of Chocolate’.  Please do not read me the tale from the back of the book, ‘The Little Gnome Who Lived Alone in a Townhouse Made of Ghosts’.  It will give me sleep paralysis”.

            1.  Read “The Little Gnome Prince Who Lived in A Bath Tub Made of Chocolate”.  Receive **Warm Glass of Milk** (restore 12 health to target party member).
            2. Read “The Little Gnome Who Lived Alone in a Townhouse Made of Ghosts”.  Receive **Nightmare Biscuit (**give target character +2 attack until end of dungeon room).

            If prompt 1 is chose, play the following dialogue box:

            “mmmmmmmmm ZzzZzz mmMmmm zzZZZZzz mmmzzzz mm zzz zzz zZz”.

            If prompt 2 is chose, play the following dialogue box:

            “aaaAAAAAAAAAAA ZZZZZZZZZZ AAAAAAAHHHHAAAA ZZZ AHAHAAAAAAAAA NONONONO AAAAAAAAA ZZZZ aaaHhhhhhhhhhfffffffff”!`),
    },
    babysitting: {
        name: 'babysitting',
        shortDescription:
            '*Oh no!  The three adult men I am responsible for baby sitting have run off again.”',
        fullDescription: dedent(`
            A distressed young woman approaches you.  “Please help me.  I am responsible for baby sitting three idiots (fully grown) who have run off and hid somewhere nearby.  Their mother will not pay me if I return without them, and I need money to stay alive.  I think they are gnomes but honestly I am not sure they could just be extremely hairy and small”.

            Every room for the rest of the dungeon has a 50% chance of having a small adult man inside.   If it does, put the character art for a small adult man somewhere in back of the enemy monsters.  If you defeat a room with a small adult man inside, receive X treasure bonus.  *When a player clears a room with an adult man inside, play the following prompt:*

            “Thank God, that is one less adult man than I am missing.  Here, please take this for your troubles.  I think there are only X remaining.  Will you help me find them?”

            *Upon finding the last one:*

            “You did it!  You helped me find all of the adult men I am babysitting!  Thank you so much.  Please take this money goodbye.”

            “**I am not happy”, says the frog.  “Not happy not happy not happy no sir I am the opposite of a happy frog today”.**

            A frog in a jester costume is angrily stomping around in circles nearby.  He has little bells on his costume that jingle with every step.  His shoes sound like rubber chickens.

            “I am angry I am angry I am angry”.

            The frog stops stamping when he notices your party.

            “Hey, you there.  I am an angry frog because I have lost my jester wand, my most prized possession.  Can you please help me get it back?  If I get it back boy howdy I will be such a happy frog”.

            Every room for the rest of the dungeon has a 33% chance of having a *Frog Jester Wand* inside. If it does, put the character art for the wand somewhere in back of the enemy monsters. If you defeat a room with a *Frog Jester Wand* in it, play the following prompt:

            “My wand!!  Hooray, I am a happy frog today!  Thank you so much for finding it.  May I please have it back?”

            1. Return the wand.  Receive X treasure, X money.
            2. Deny the frog of his most prized possession.  Receive *Frog Jester Wand:* Hand item, +1 damage.  One use per dungeon activated ability: reduce all damage this character receives by 80% next combat round.

            If prompt 1 is selected, play the following dialogue box:

            “You have saved me.  I am no longer doomed to an eternity of stomping in a circle while being mad.  Bless you stranger here is all of my money”.

            If prompt 2 is selected, play the following dialogue box:

            “Oh…. You want are going to keep the wand?  I guess that means I am doomed to a lifetime of stomping in circles and being mad.  This is the worst day of my entire life.  I no longer want to be alive.  Goodbye stranger”.`),
    },
    baron: {
        name: 'baron',
        shortDescription:
            '“I am The Baron of Fun!!!!  YOU are about to have FUN!!!!!!!  This is my kingdom and it is FUN!!!!  I DEMAND that you have fun RIGHT NOW!!!”',
        fullDescription: dedent(`
            An incredibly nervous looking penguin stands before you.  He is wearing an extremely ostentatious cape and waves a scepter around`),
    },
}
