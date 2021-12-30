import { Box, Button, Heading, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { SBaobab } from 'baobab'
import type { JSX } from 'preact'
import { h } from 'preact'

import type { PageProps } from '@/components/PageManager'
import { useCursor } from '@/components/util'

import About from './sp/About'
import ManageAssets from './sp/ManageAssets'
import MyCharacters from './sp/MyCharacters'
import Overworld from './sp/Overworld'
import QuestProgress from './sp/QuestProgress'
import UITour from './sp/UITour'
import WelcomeModal from './util/WelcomeModal'

type SubpageKey = keyof typeof subpages

const subpages = { About, Overworld, MyCharacters, QuestProgress, ManageAssets, UITour }

const state = new SBaobab({
    dared: false,
    nothing: null,
    subpage: 'UITour' as SubpageKey,
})

export default function QuestsPage(_props: PageProps): JSX.Element {
    const dared = useCursor(state.select('dared'))
    const subpageKey = useCursor(state.select('subpage'))
    const Subpage = subpages[subpageKey]
    return (
        <Box m={10} p={10}>
            <GQMenu setSubpage={sp => state.set('subpage', sp)} />
            <Heading>Genesis quests</Heading>
            {!dared ? 
                <WelcomeModal onDare={() => state.set('dared', true)} />
             : 
                <Text bg="black" color="red" fontWeight="bold">
                    YOU HAVE DARED
                </Text>
            }
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
        ['UI Component Tour', 'UITour'],
    ]
    return (
        <Menu>
            <MenuButton as={Button}>☰</MenuButton>
            <MenuList>
                {choices.map(([name, Comp]) => 
                    <MenuItem key={name} onClick={() => setSubpage(Comp)}>
                        {name}
                    </MenuItem>
                )}
            </MenuList>
        </Menu>
    )
}
