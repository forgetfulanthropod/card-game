import {
    Box,
    Button,
    ButtonGroup,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'
import type { StateUpdater } from 'preact/hooks'
import { useState } from 'preact/hooks'

import { PageHeader } from '@/components/PageHeader'
import type { PageProps } from '@/components/PageManager'

const subpages = { Intro, Choose, Quest }

type Subpage = { setSubpage: SetSubpage }
type SetSubpage = StateUpdater<keyof typeof subpages>

export default function QuestsPage(props: PageProps): JSX.Element {
    return (
        <>
            <ModalExample />
            <Heading>Genesis quests</Heading>
        </>
    )
}
function ModalExample() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button onClick={onOpen}>Open Modal</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis modi tempore dolore
                            veritatis possimus rerum similique, odio accusantium
                        </Text>
                        <Text>
                            adipisci suscipit id vel sequi distinctio reiciendis. Sequi aliquam reprehenderit in iure.
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="ghost">Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
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

function Intro(props: Subpage) {
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

function Choose(props: Subpage) {
    return (
        <>
            <Heading size="lg">Choose your character</Heading>
        </>
    )
}

function Quest(props: Subpage) {
    return (
        <>
            <Heading size="lg">Quest!</Heading>
        </>
    )
}
