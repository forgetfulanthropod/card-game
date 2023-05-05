import { EventId, EventScene } from 'shared/tree/EventScene'

export const eventSceneMap: Record<EventId, EventScene> = {
    cursedStatue: {
        id: 'cursedStatue',
        title: 'The Cursed Statue',
        prompts: [
            'A large statue of a demon with gems for eyes stands before you.\nYou hear a faint whisper echo as you lock eyes with the demon. The whisper feels like it coming within your own head.',
            '"Closer", says the demon.\n"Choose a hand,"\n"Gifts, Closer."',
        ],
        choices: [
            {
                souvenirId: 'demonsLeftHand',
                text: "Touch the demon's left hand.",
                postPrompts: [
                    "One of your Kaiju steps forward and touches the Demon's left hand. They let out a shriek as their body is wrapped in a red mist.",
                    'After the mist settles you can tell that your Kaiju is 5% shorter\n but its head and arms are 5 % larger.',
                    '"Gifts of power, at the cost of Vitality." the statue whispered.',
                ],
            },
            {
                souvenirId: 'demonsRightHand',
                text: "Touch the demon's right hand.",
                postPrompts: [
                    "One of your Kaiju steps forward and touches the Demon's right hand. They let out a shriek as their body is wrapped in a yellow mist.",
                    'After the mist has settled you can tell that your Kaiju is 5% taller\nbut its head and arms are 5 % smaller.',
                    '"Gifts of Vitality, at the cost of Power" the statue hisses.',
                ],
            },
            {
                souvenirId: null,
                text: '"Aaaaaaaaah!", you scream "AaaaaAaah!".',
                postPrompts: [
                    "AAAAAAAAaaaaaHHHhh! aaaAAAHHHhh!\nThe statue was too scary so you had to run away.\nYou leave without accepting the Demon's gifts.",
                ],
            },
        ],
    },
    frogCarriage: {
        id: 'frogCarriage',
        title: 'No Carriage For Old Frogs',
        prompts: [
            'Your party sees a carriage with a broken wheel.\n Driving the carriage is an elderly frog with a very big beard.',
            '"Hello Travelers. I am an elderly frog with a very big beard. I am bad at driving and as a result i have broken my carriage wheel while attempting to do donuts in the fields. ',
            'I am unable to fix the wheel by myself, but perhaps I could repair it with the assistance of some strapping young Kaiju. Will you help me?"',
        ],
        choices: [
            {
                souvenirId: 'frogWine',
                text: 'Help the elderly frog fix his wheel.',
                postPrompts: [
                    '"Well I"ll be darned, you fixed it up good as new! I"d bet I could do hundreds of donuts with this wheel."',
                    '"Take a barrel of frog wine for your trouble. Don"t mind me now, I"ve got open fields to do donuts in."',
                ],
            },
            {
                souvenirId: 'brokenCarriageWheel',
                text: 'Attempt to do donuts with the broken carriage, further damaging the wheel.',
                postPrompts: [
                    '"That wheel has at least 3 or 4 more donuts left in it my guy" you say to the old frog with the very big beard.',
                    'Everyone hops in and you get two perfect donuts before the broken wheel shatters.',
                    '"Hmm, looks like you don"t know anything about carriages, Please take this broken wheel because it is reminding me of how bad at doing donuts you are."',
                ],
            },
            {
                souvenirId: 'bundleOfFrogWine',
                text: 'Fight the elderly frog and rob him of his cargo.',
                postPrompts: [
                    'You look over the old man and determine that he is very old and frail, and his beard is very big.',
                    'You decide to rob him of his cargo and grab all of the frog wine you can carry. The old frog doesn"t put up a fight because he is worried about damaging his very big beard.',
                ],
            },
        ],
    },
    gnomeStory: {
        id: 'gnomeStory',
        title: '"It is my bedtime."',
        prompts: [
            'A gnome wearing striped pajamas with matching nightcap approaches you.\nHe smacks his lips three times. "Ho hum, memememe", exclaims the gnome.',
            '"It is my bed time", the gnome tells you.',
            '"I will have a much more comfortable sleep if you read me a tale from my favorite book: "The Little Gnome Prince Who Lived in a Bath Tub Made of Chocolate".',
            '"Please do not read me the tale from the back of the book: "The little Gnome Who Lived Alone in a Townhouse Made of Ghosts". It will give me sleep paralysis".',
        ],
        choices: [
            {
                souvenirId: 'glassOfWarmMilk',
                text: 'Read: "The Little Gnome Prince Who\nLived in a Bathtub Made of Chocolate."',
                postPrompts: [
                    '"mmmmmmmmm ZzzZzz mmMmmm zzZZZZzz mmmzzzz mm zzz zzz zZz".',
                ],
            },
            {
                souvenirId: 'nightmareBiscuit',
                text: 'Read: "The Little Gnome Who Lived in a Townhouse Made of Ghosts."',
                postPrompts: [
                    '"aaaAAAAAAAAAAA ZZZZZZZZZZ AAAAAAAHHHHAAAA ZZZ AHAHAAAAAAAAA NONONONO AAAAAAAAA ZZZZ aaaHhhhhhhhhhfffffffff"!',
                ],
            },
        ],
    },
    gnomeTooth: {
        id: 'gnomeTooth',
        title: 'Are You a Dentist?',
        prompts: [
            'A gnome with a gigantic tooth stands before you. He looks like he is in terrible pain. "I am in terrible pain", says the gnome.',
            '"Owie ouch ouch ouch, I do not like having a gigantic tooth no sir wow this sucks".',
            '"If you are a dentist, would you mind removing it for me?\nI have never seen a dentist before so I do not know how to identify one."',
        ],
        choices: [
            {
                souvenirId: 'dentistryForDummies',
                text: '"No, I am not a dentist".',
                postPrompts: [
                    'You tell the gnome that you aren"t a dentist and cannot help him.',
                    '"Oh, Ok. I think I have a book on removing teeth, but I cannot read it because \nmy very large tooth is blocking my good reading eye."',
                    '"If you encounter another Gnome with a big stinky tooth,hopefully you can help them with this book. Owww Owwwie."',
                ],
            },
            {
                souvenirId: 'bigStinkyTooth',
                text: '"Yes, I am a licensed medical professional."',
                postPrompts: [
                    'You attempt to remove the tooth despite not actually being a dentist.\nAfter a slight struggle and some painful cries, the tooth slides right out.',
                    '"Hooray! You were a dentist after all!  Thank you for not lying about that.\nI will remember that all dentists look like you from now on."',
                    '"This is my first time ever meeting a licensed medical professional.\nPlease, keep the tooth as a reward, I do not want it."',
                ],
            },
        ],
    },
    hogClown: {
        id: 'hogClown',
        title: '“Ack!  I am covered in small clowns!”',
        prompts: [
            'A Warhog covered in gnome Hooligans that are dressed as clowns stands nearby.\nHe is desperately trying to swat them off.',
            '"There are too many dang clowns on my back. Can you please help me decrease the number of clowns that are on my back?" ',
            '"I cannot remove them myself because my body is enormous but my arms are very small."',
        ],
        choices: [
            {
                souvenirId: 'squeakyClownShoes',
                text: '"Yes, I will help you remove the small clowns that are on your back."',
                postPrompts: [
                    '"Thank goodness! There were far too many clowns on my back. There is a pair of clown shoes wedged in-between my shoulder blades if you would like to take them."',
                ],
            },
            {
                souvenirId: 'clownInfestation',
                text: '"Sorry you are a stranger and I have no interest in helping you at this time."',
                postPrompts: [
                    '"I respect your decision to be wary of strangers, but I am also sad because I simply have too many clowns on my back and would like for them to not be there anymore."',
                    '"Uh-Oh, it looks like you have clowns on your back now. Hopefully you can find a stranger willing to help you. I would help you but I simply have too many clowns on my back."',
                ],
            },
            {
                souvenirId: 'cowardsCrown',
                text: '"I have a fear of clowns. I would help you but it is too scary sorry time for me to go."',
                postPrompts: [
                    '"That is extremely reasonable. It is unfortunate for me that you are too scared of clowns to help me. I have a lot of clowns on my back and I do not want them there but I understand. Pleae take this, It will hopefully help you with your fear of clowns."',
                ],
            },
        ],
    },
    tooManyHats: {
        id: 'tooManyHats',
        title: 'Too Many Hats',
        prompts: [
            `"Hats!  Hats for sale!  I am selling hats oh god is there anyone here please please help me sell these hats I am desperate to sell my hats".`,
            '“Through a series of events I am legally not allowed to disclose, I have been cursed with the burden of 1000 hats. I must sell them all or go to jail. Buy a hat please?”',
        ],
        choices: [
            {
                souvenirId: 'questionableHat',
                text: 'Acquire Questionable Hat',
                postPrompts: [],
            },
            {
                souvenirId: null,
                text: 'This man and his terrible hats must suffer for their unspoken crimes. Leave without purchasing one.',
                postPrompts: [],
            },
        ],
    },
}
