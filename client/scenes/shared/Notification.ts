import {
    getStage,
    getTexture,
    PixiContainer,
    RoundedBordered,
    RoundedRectangleGradientSprite,
    Text,
    TweenableContainer,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { Container, Sprite } from '@/elementsUtil'
import { Easing, Tweener } from 'pixi-tweener'

const MIN_Y_OFFSET = 50
const MIN_X_OFFSET = 50
const BASE_PADDING = 15
const BASE_HEIGHT = 64
let currY = MIN_Y_OFFSET
const containerName = `NotificationContainer`

const displayScoreNotification = async <T extends string>(
    textToDisplay: T,
    assetSrc: string,
    count: number
) => {
    const stage = getStage()
    const existingNotification = stage.getChildByName(containerName)
    const verticalMargin = BASE_HEIGHT + BASE_PADDING
    if (existingNotification) {
        currY += verticalMargin
    }

    const newNotification = Notification(textToDisplay, assetSrc, count)
    stage.addChild(newNotification)
    await animateElementSlamIn(newNotification)

    setTimeout(async () => {
        await animateNotificationOut(newNotification)
        newNotification.destroy({
            children: true,
            baseTexture: false,
            texture: false,
        })
        currY -= verticalMargin
        if (currY < MIN_Y_OFFSET) currY = MIN_Y_OFFSET
    }, 2000)
}

const animateElementSlamIn = async (el: TweenablePixiContainer) => {
    await Tweener.add(
        {
            target: el,
            duration: 0.75,
            ease: Easing.bouncePast,
        },
        {
            alpha: 1,
            tweenableScale: 1,
            x: MIN_X_OFFSET,
        }
    )
}

const animateNotificationOut = async (notification: PixiContainer) => {
    await Tweener.add(
        {
            target: notification,
            duration: 0.2,
        },
        {
            alpha: 0,
        }
    )
}

function Notification<T extends string>(
    textToDisplay: T,
    assetSrc: string,
    count: number
) {
    let textureSrc
    try {
        textureSrc = getTexture(assetSrc)
    } catch (e) {
        console.error(e)
    }

    const NotificationIcon = Container(
        {},
        RoundedBordered(
            Sprite({
                src: textureSrc ?? getTexture('cardArtPlaceholder'),
                scale: 0.125,
                x: -300,
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
            alpha: 0.5,
            tint: 1,
        },
        radius: 40,
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

    const NotificationContainer = TweenableContainer(
        {
            name: containerName,
            x: MIN_X_OFFSET - RoundedBlackRectBackground.width / 2,
            y: currY,
            alpha: 0,
            scale: 2,
        },
        RoundedBlackRectBackground,
        NotificationIcon,
        TextToDisplay,
        CountToDisplay
    )

    return NotificationContainer
}

export { displayScoreNotification, Notification }
