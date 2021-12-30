import { Button, Text } from '@chakra-ui/react'
import { Fragment, h, JSX } from 'preact'
import { useRef } from 'preact/hooks'

import type { Disclosure } from './MyModal'
import { MyModal } from './MyModal'

export default function WelcomeModal(props: { onDare: Callback }): JSX.Element {
    const ref = useRef<Disclosure>()

    return (
        <>
            <Button onClick={() => ref.current?.onOpen()}>Genesis</Button>
            <MyModal
                apiRef={ref}
                title='Welcome to good Earth'
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
                        <Button onClick={() => ref.current?.onClose()}>
                            Nope
                        </Button>
                    </>
                }
            />
        </>
    )
}
