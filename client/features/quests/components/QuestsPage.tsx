import { Box, Button, Heading, Image, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { SBaobab } from 'baobab'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'
import { useRef } from 'preact/hooks'

import type { PageProps } from '@/components/PageManager'
import { useCursor } from '@/components/util'

import mapJpg from '../assets/high-res-map.jpg'
import type { Disclosure } from './MyModal'
import { MyModal } from './MyModal'

type SubpageKey = keyof typeof subpages

const subpages = { About, Overworld, MyCharacters, QuestProgress, ManageAssets }

const state = new SBaobab({
    dared: false,
    subpage: 'About' as SubpageKey,
})

export default function QuestsPage(_props: PageProps): JSX.Element {
    const dared = useCursor(state.select('dared'))
    const subpageKey = useCursor(state.select('subpage'))
    const Subpage = subpages[subpageKey]
    return (
        <Box m={10} p={10}>
            <GQMenu setSubpage={sp => state.set('subpage', sp)} />
            <Heading>Genesis quests</Heading>
            {!dared ? (
                <WelcomeModal onDare={() => state.set('dared', true)} />
            ) : (
                <Text bg="black" color="red" fontWeight="bold">
                    YOU HAVE DARED
                </Text>
            )}
            <Subpage />
        </Box>
    )
}

function GQMenu(props: { setSubpage: (s: SubpageKey) => void }): JSX.Element {
    const { setSubpage } = props
    const choices: [string, SubpageKey][] = [
        ['About', 'About'],
        ['Overworld', 'Overworld'],
        ['My Characters', 'MyCharacters'],
        ['Quest Progress', 'QuestProgress'],
        ['Manage Assets', 'ManageAssets'],
    ]
    return (
        <Menu>
            <MenuButton as={Button}>☰</MenuButton>
            <MenuList>
                {choices.map(([name, Comp]) => (
                    <MenuItem key={name} onClick={() => setSubpage(Comp)}>
                        {name}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    )
}

function WelcomeModal(props: { onDare: Callback }) {
    const ref = useRef<Disclosure>()

    return (
        <>
            <Button onClick={() => ref.current?.onOpen()}>Genesis</Button>
            <MyModal
                apiRef={ref}
                title="Welcome to good Earth"
                body={
                    <>
                        <Text>Do you dare embark on a quest?</Text>
                        <Text>There is danger ahead.</Text>
                    </>
                }
                footer={
                    <>
                        <Button colorScheme={'red'} onClick={props.onDare}>
                            Dare
                        </Button>
                        <Button onClick={() => ref.current?.onClose()}>Nope</Button>
                    </>
                }
            />
        </>
    )
}

function About() {
    return (
        <>
            <Heading size="lg">Intro</Heading>
            <MyBox>
                <Text fontSize="xxx-large">
                    wife different tone doctor join box star nuts eager fuel direct that chance fifty back select
                    vegetable now vapor court agree salmon coal word
                </Text>
            </MyBox>
            <MyBox>
                <Text fontSize="xxx-large">
                    seven measure final copper is scene thought wire ate beside where interest porch prove fly donkey
                    hall diagram rice rod thumb does curve wonderful
                </Text>
            </MyBox>
            <MyBox>
                <Text fontSize="xxx-large">
                    fourth just hit dish chosen team whose reason room writing practice tin machinery voyage sunlight
                    wear piece mistake split composed every balloon tank bit
                </Text>
            </MyBox>
            {/* <Button fontSize="xxx-large" padding="1em" onClick={() => props.setSubpage('Choose')}>
                BEGIN
            </Button> */}
        </>
    )
}

function Overworld(): JSX.Element {
    return (
        <Box>
            Overworld
            <Image src={mapJpg} w={400} />
        </Box>
    )
}
function MyCharacters(): JSX.Element {
    return <>MyCharacters</>
}
function QuestProgress(): JSX.Element {
    return <>QuestProgress</>
}
function ManageAssets(): JSX.Element {
    return <>ManageAssets</>
}

function MyBox(props: { children: Children }) {
    return (
        <Box backgroundColor="#EEE" borderRadius="2em" marginBottom="2em" padding="2em" boxShadow="4px 4px 4px black">
            {props.children}
        </Box>
    )
}
