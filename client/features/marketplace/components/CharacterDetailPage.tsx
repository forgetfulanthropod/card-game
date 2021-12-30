import {
    Box,
    Circle,
    Grid,
    GridItem,
    Heading,
    HStack,
    Image,
    SimpleGrid,
    Square,
    Text,
} from '@chakra-ui/react'
import { useMediaQuery } from '@chakra-ui/react'
import { random } from 'lodash'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'

import type { PageProps } from '@/components/PageManager'
import characterSrc from '@/features/battle/assets/cards/PenguinKnight-200.png'

import {
    ChainLightning,
    Dispel,
    MagicalBarrier,
    MagicalStorm,
    MagicMirrorV2,
    MagicMissile,
    MysticalStrength,
    OrbofLightning,
    PonderOrb,
    ScatterBrained,
    SpellBook,
} from '../assets/Wizard'

const imageSrcs = [
    ChainLightning,
    Dispel,
    MagicMirrorV2,
    MagicMissile,
    MagicalBarrier,
    MagicalStorm,
    MysticalStrength,
    OrbofLightning,
    PonderOrb,
    ScatterBrained,
    SpellBook,
]

const icons = ['👍', '🎉', '💪', '🏃‍♀️', '🧠', '👀', '🍀']
const classes = ['Trinity-Cleric', 'Climber-Arborist']
const certs = ['🚗', '🪚', '✂️']
export default function CharacterDetailPage(props: PageProps): JSX.Element {
    const [isLarge] = useMediaQuery('(min-width: 62em)')

    const cards = 
        <GridItem colSpan={[4, 4, 4, 1]}>
            <Text>Battle</Text>
            <SimpleGrid columns={2} spacing={1}>
                {imageSrcs.map(src => 
                    <Image width={200} key={src} src={src} />
                )}
            </SimpleGrid>
        </GridItem>
    

    const character = 
        <GridItem colSpan={[4, 4, 4, 2]}>
            <Text>My funKYy Penguin</Text>
            {classes.map(cl => 
                <Text
                    key={cl}
                    margin='10px'
                    as='span'
                    bg='#333'
                    fontSize={'1.5rem'}
                    p='8px'
                    borderRadius='12px'
                >
                    {cl}
                </Text>
            )}
            <Image width={'100%'} src={characterSrc} />
        </GridItem>
    

    const gatherCraft = 
        <GridItem colSpan={[4, 4, 4, 1]}>
            <Text>Gather / Craft</Text>
            <SimpleGrid columns={4} spacing={1}>
                {icons.flatMap(icon => [
                    <Box key={icon} textAlign='center'>
                        <Circle size='50px' bg='white'>
                            {icon}
                        </Circle>
                    </Box>,
                    <Text key={icon}>{random(1, 10)}</Text>,
                ])}
            </SimpleGrid>
            <Text>Certs</Text>
            <HStack>
                {certs.map((cert, i) => 
                    <Square
                        // display="inline-block"
                        // as="span"
                        key={i}
                        size='1.5em'
                        bg='silver'
                        borderRadius='5%'
                        // m="5"
                        // centerContent={true}
                    >
                        {cert}
                    </Square>
                )}
            </HStack>
        </GridItem>
    

    return (
        <>
            <Heading size='2xl'>
                Marketplace Character Details
                {/* <Button onClick={() => props.setPage('MenuPage')}>Home</Button> */}
            </Heading>

            <Grid
                templateColumns='repeat(4, 1fr)'
                columns={3}
                gap={10}
                overflowY={'scroll'}
                position='fixed'
                top='13%'
                left={0}
                right={0}
                bottom={0}
                bg='black'
                color='white'
                fontSize='3rem'
            >
                {isLarge ? cards : character}
                {isLarge ? character : cards}
                {gatherCraft}
            </Grid>
        </>
    )
}
