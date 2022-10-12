import {
    getStage,
    getTexture,
    RoundedBordered,
    RoundedRectangleGradientSprite,
    Text,
} from '@/elementsUtil'
import { Container, Sprite } from '@/elementsUtil'

const MIN_Y_OFFSET = 50
const MIN_X_OFFSET = 50
const BASE_PADDING = 15
const BASE_HEIGHT = 64
let currY = MIN_Y_OFFSET
const containerName = `NotificationContainer`

function displayScoreNotification<T extends string>(
    textToDisplay: T,
    assetSrc: string,
    count: number
) {
    const stage = getStage()
    const existingNotification = stage.getChildByName(containerName)
    const verticalMargin = BASE_HEIGHT + BASE_PADDING
    if (existingNotification) {
        currY += verticalMargin
    }

    const newNotification = Notification(textToDisplay, assetSrc, count)
    stage.addChild(newNotification)

    setTimeout(() => {
        newNotification.destroy({ children: true })
        currY -= verticalMargin
        if (currY < MIN_Y_OFFSET) currY = MIN_Y_OFFSET
    }, 2000)
}

function Notification<T extends string>(
    textToDisplay: T,
    assetSrc: string,
    count: number
) {
    const NotificationIcon = Container(
        {},
        RoundedBordered(
            Sprite({
                src: getTexture(assetSrc),
                scale: 0.125,
                anchor: [0, 0],
                x: 0,
                y: 0, // TODO: adjust based on unique item attr
                name: 'NotificationIcon',
            }),
            {
                radius: 20,
                borderThickness: 4,
                borderColor: 0,
            }
        )
    )

    const TextToDisplay = Text({
        text: `${textToDisplay}`,
        anchor: [0, 0],
        x: NotificationIcon.x + NotificationIcon.width + BASE_PADDING - 5,
        y: NotificationIcon.y + 7.5,
        style: {
            fontSize: 24,
            fill: 'white',
            padding: 4,
            fontWeight: '100',
            align: 'center',
            fontFamily: 'sansFont',
        },
        name: `${textToDisplay}`,
    })

    const CountToDisplay = Text({
        text: `+ ${count}`,
        anchor: [0, 0],
        x: TextToDisplay.x + TextToDisplay.width + BASE_PADDING,
        y: TextToDisplay.y,
        style: {
            fontSize: 28,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontFamily: 'bigFont',
        },
        name: `${count}`,
    })

    const RoundedBlackRectBackground = RoundedRectangleGradientSprite({
        spriteArgs: {
            width:
                NotificationIcon.width +
                TextToDisplay.width +
                CountToDisplay.width +
                BASE_PADDING * 4,
            height: TextToDisplay.height + BASE_PADDING * 2 + 5,
            x: -15,
            y: -10,
            name: 'RoundedBlackRectBackground',
            anchor: [0, 0],
            alpha: 0.5,
            tint: 1,
        },
        radius: 100,
        gradientArgs: {
            x0: 0,
            x1: 500,
            y0: 0,
            y1: 500,
            colorStops: [
                { color: 'black', offset: 0 },
                { color: 'white', offset: 1 },
            ],
        },
    })

    const NotificationContainer = Container(
        {
            name: containerName,
            x: MIN_X_OFFSET,
            y: currY,
        },
        RoundedBlackRectBackground,
        NotificationIcon,
        TextToDisplay,
        CountToDisplay
    )

    return NotificationContainer
}

export { displayScoreNotification, Notification }
