import { Box, Heading, Text } from '@chakra-ui/react'

export default function About(): JSXElement {
    return <>
        <Heading size='lg'>Intro</Heading>
        <MyBox>
            <Text fontSize='xxx-large'>
                wife different tone doctor join box star nuts eager fuel direct
                that chance fifty back select vegetable now vapor court agree
                salmon coal word
            </Text>
        </MyBox>
        <MyBox>
            <Text fontSize='xxx-large'>
                seven measure final copper is scene thought wire ate beside
                where interest porch prove fly donkey hall diagram rice rod
                thumb does curve wonderful
            </Text>
        </MyBox>
        <MyBox>
            <Text fontSize='xxx-large'>
                fourth just hit dish chosen team whose reason room writing
                practice tin machinery voyage sunlight wear piece mistake split
                composed every balloon tank bit
            </Text>
        </MyBox>
        {/* <Button fontSize="xxx-large" padding="1em" onClick={() => props.setSubpage('Choose')}>
                BEGIN
            </Button> */}
    </>
}
function MyBox(props: { children: Children }) {
    return <Box
        backgroundColor='#EEE'
        borderRadius='2em'
        marginBottom='2em'
        padding='2em'
        boxShadow='4px 4px 4px black'
    >
        {props.children}
    </Box>
}
