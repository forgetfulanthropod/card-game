import { Heading, Image, Radio, RadioGroup, Stack } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'
import { useState } from 'preact/hooks'

import type { PageProps } from '@/components/TempApp'
import { PageHeader } from '@/components/TempApp'
import mimic from '@/features/battle/assets/cards/mimic-200.png'
import mushroomFarmer from '@/features/battle/assets/cards/Mushroom_Farmer2-200.png'
import penguinKnight from '@/features/battle/assets/cards/PenguinKnight-200.png'
import snacky from '@/features/battle/assets/cards/Snacky-200.png'

export default function SpawnPage(props: PageProps): JSX.Element {
    return (
        <>
            <Heading>Spawn page</Heading>
            <PageHeader setPage={props.setPage} />
            <RadioExample />
        </>
    )
}
function RadioExample() {
    const [value, setValue] = useState('1')
    return (
        <RadioGroup onChange={setValue} value={value}>
            <Stack direction="row">
                <Radio value="mimic">
                    <Image width={'50px'} src={mimic} />
                </Radio>
                <Radio value="mushroomFarmer">
                    <Image width={'50px'} src={mushroomFarmer} />
                </Radio>
                <Radio value="penguinKnight">
                    <Image width={'50px'} src={penguinKnight} />
                </Radio>
                <Radio value="snacky">
                    <Image width={'50px'} src={snacky} />{' '}
                </Radio>
            </Stack>
        </RadioGroup>
    )
}
