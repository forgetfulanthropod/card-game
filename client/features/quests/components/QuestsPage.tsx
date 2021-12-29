import { Box, Button, ButtonGroup, Heading, Text } from '@chakra-ui/react'
import { SBaobab } from 'baobab'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'
import type { StateUpdater } from 'preact/hooks'
import { useRef } from 'preact/hooks'
import { useState } from 'preact/hooks'

import { PageHeader } from '@/components/PageHeader'
import type { PageProps } from '@/components/PageManager'
import { useCursor } from '@/components/util'

import type { Disclosure } from './MyModal'
import { MyModal } from './MyModal'

type SubpageArgs = { setSubpage: SetSubpage }
type SetSubpage = StateUpdater<keyof typeof subpages>

const subpages = { Intro, Choose, Quest }

const state = new SBaobab({
    dared: false,
})

export default function QuestsPage(props: PageProps): JSX.Element {
    const dared = useCursor(state.select('dared'))
    return (
        <Box m={10} p={10}>
            <Heading>Genesis quests</Heading>
            {!dared ? (
                <WelcomeModal onDare={() => state.set('dared', true)} />
            ) : (
                <Text bg="black" color="red" fontWeight="bold">
                    YOU HAVE DARED
                </Text>
            )}
        </Box>
    )
}

function WelcomeModal(props: { onDare: Callback }) {
    const ref = useRef<Disclosure>()

    return (
        <>
            <Button onClick={() => ref.current?.onOpen()}>Genesis</Button>
            <MyModal
                apiRef={ref}
                title="modal 2"
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

function QuestsPage2(props: PageProps): JSX.Element {
    const [subpage, setSubpage] = useState<keyof typeof subpages>('Intro')
    const Subpage = subpages[subpage]
    return (
        <>
            <Heading>Genesis Quests</Heading>
            <PageHeader setPage={props.setPage} />
            <ButtonGroup variant="outline" spacing="2">
                <Button onClick={() => setSubpage('Intro')} colorScheme="blue">
                    Intro
                </Button>
                <Button onClick={() => setSubpage('Choose')} colorScheme="red">
                    Choose your character
                </Button>
                <Button onClick={() => setSubpage('Quest')} colorScheme="green">
                    Quest
                </Button>
            </ButtonGroup>
            <Text>Genesis quests are the genesis bests</Text>
            <Subpage setSubpage={setSubpage} />
        </>
    )
}

function Intro(props: SubpageArgs) {
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
            <Button fontSize="xxx-large" padding="1em" onClick={() => props.setSubpage('Choose')}>
                BEGIN
            </Button>
        </>
    )
}

function MyBox(props: { children: Children }) {
    return (
        <Box backgroundColor="#EEE" borderRadius="2em" marginBottom="2em" padding="2em" boxShadow="4px 4px 4px black">
            {props.children}
        </Box>
    )
}

function Choose(props: SubpageArgs) {
    return (
        <>
            <Heading size="lg">Choose your character</Heading>
        </>
    )
}

function Quest(props: SubpageArgs) {
    return (
        <>
            <Heading size="lg">Quest!</Heading>
        </>
    )
}
