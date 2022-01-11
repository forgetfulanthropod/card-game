import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react'
import type { ComponentChildren, RefObject } from 'preact'

type CC = ComponentChildren
export type Disclosure = ReturnType<typeof useDisclosure>
export function MyModal(props: {
    title?: CC
    body?: CC
    footer?: CC
    apiRef: RefObject<Disclosure | undefined>
}): JSXElement {
    const disclosure = useDisclosure()
    props.apiRef.current = disclosure
    const { isOpen, onClose } = disclosure
    return <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            {props.title && <ModalHeader>{props.title}</ModalHeader>}
            <ModalCloseButton />
            {props.body && <ModalBody>{props.body}</ModalBody>}
            {props.footer && <ModalFooter>{props.footer}</ModalFooter>}
        </ModalContent>
    </Modal>
}
