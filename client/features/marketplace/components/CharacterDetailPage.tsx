import { Box, Circle, Grid, GridItem, Heading, Image, SimpleGrid, Text } from '@chakra-ui/react'
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

export default function CharacterDetailPage(props: PageProps): JSX.Element {
    // const [order, setOrder] = useState(imageSrcs)
    const [isLarge] = useMediaQuery('(min-width: 62em)')

    const cards = (
        <GridItem colSpan={[4, 4, 4, 1]}>
            <Text>Battle</Text>
            <SimpleGrid columns={2} spacing={1}>
                {imageSrcs.map(src => (
                    <Image width={200} key={src} src={src} />
                ))}
            </SimpleGrid>
        </GridItem>
    )
    const character = (
        <GridItem colSpan={[4, 4, 4, 2]}>
            <Text>My funKYy Penguin</Text>
            <Image width={'100%'} src={characterSrc} />
        </GridItem>
    )
    return (
        <>
            <Heading size="2xl">Marketplace Character Details</Heading>

            <Grid
                templateColumns="repeat(4, 1fr)"
                columns={3}
                overflowY={'scroll'}
                position="fixed"
                top="13%"
                left={0}
                right={0}
                bottom={0}
                bg="black"
                color="white"
                fontSize="3rem"
            >
                {/* <Heading>Marketplace Character Details</Heading>
            <PageHeader setPage={props.setPage} />
            <Text>Character details go here</Text> */}
                {/* <VStack spacing="-80%" marginTop="50%"> */}
                {isLarge ? cards : character}
                {isLarge ? character : cards}
                <GridItem colSpan={[4, 4, 4, 1]}>
                    <Text>Gather / Craft</Text>
                    <SimpleGrid columns={4} spacing={1}>
                        {icons.flatMap(icon => [
                            <Box key={icon} textAlign="center">
                                <Circle size="50px" bg="white">
                                    {icon}
                                </Circle>
                            </Box>,
                            <Text key={icon}>{random(1, 10)}</Text>,
                        ])}
                    </SimpleGrid>
                </GridItem>
                {/* <Box w={['100vw', '50vw', '50vw']}>
                <Image width={200} src={characterSrc} />
            </Box> */}
                {/* <SimpleGrid columns={2} spacing={10} w={['100vw', '50vw', '25vw']}>
                {imageSrcs.map(src => (
                    <Image width={200} key={src} src={src} />
                ))}
            </SimpleGrid> */}
            </Grid>
        </>
    )
}
