import {
    AssetKey,
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

const MIN_Y_OFFSET = 80
const MIN_X_OFFSET = 50
const BASE_PADDING = 15
const BASE_HEIGHT = 65
const verticalMargin = BASE_HEIGHT + BASE_PADDING

/**
 * This variable keeps track of where the next subsequent Notification should be displayed on the screen.
 * It is increased (eg. make position lower) when a Notification is added to the stage, and decreased when a Notification is removed.
 * It is closed over by the Notification-adjacent functions, thus persisting its value throughout the stage's lifetime.
 */
let currY = MIN_Y_OFFSET
let currNotificationsCount = 0
let itemsToDestroy = 0
const positionsInQueue = {}
const containerName = `NotificationContainer`

/**
 * To display multiple notifications simultaneously, simply call this function without awaiting it (it will still clean up fine)
 * KNOWN BUG: when many notifications show up at once, the latter ones will not be pushed all the way up to the screen
 * @param textToDisplay
 * @param assetSrc
 * @param count
 */
const displayScoreNotification = async <T extends string>(
    textToDisplay: T,
    assetSrc: AssetKey,
    count: number
) => {
    const stage = getStage()
    adjustNextNotificationPosition(stage) // important to do this before creating new notification
    // console.log(
    //     `creating ${textToDisplay}... AT currY: ${currY}, currNotificationsCount: ${currNotificationsCount}`
    // )
    const newNotification = Notification(textToDisplay, assetSrc, count)
    stage.addChild(newNotification)
    await slamAnimateElIntoScreen(newNotification)

    setTimeout(async () => {
        // console.log(
        //     `destroying ${textToDisplay}... currY: ${currY}, currNotificationsCount: ${currNotificationsCount}`
        // )
        itemsToDestroy++
        // console.log({ itemsToDestroy })
        await destroyNotification(newNotification, stage)
        itemsToDestroy--

        // console.log({ itemsToDestroy })
        if (itemsToDestroy === 0) {
            // console.log('now can shift rest of items - will only do once')
            shiftExistingItems(stage)
        }
    }, 2000)
}

const adjustNextNotificationPosition = (stage: PixiContainer) => {
    currNotificationsCount++

    const existingNotifications = stage.children.filter(el =>
        el.name.includes(containerName)
    )
    if (existingNotifications.length > 0) {
        currY += verticalMargin // makes the next notification render at a lower y axis
    }
}

const slamAnimateElIntoScreen = async (el: TweenablePixiContainer) => {
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

const destroyNotification = async (
    newNotification: TweenablePixiContainer,
    stage: PixiContainer
): Promise<void> => {
    await fadeNotificationOut(newNotification)
    const existingNotifications = stage.children.filter(
        el =>
            el.name.includes(containerName) &&
            el instanceof TweenablePixiContainer
    ) as TweenablePixiContainer[]

    if (existingNotifications.length === 0) return

    currY -= verticalMargin
    if (currY < MIN_Y_OFFSET) currY = MIN_Y_OFFSET
    currNotificationsCount--

    Tweener.killTweensOf(newNotification)
    newNotification.destroy({
        children: true,
        baseTexture: false,
        texture: false,
    })
}

const fadeNotificationOut = async (notification: PixiContainer) => {
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

const shiftExistingItems = (stage: PixiContainer) => {
    const existingNotifications = stage.children.filter(
        el =>
            el.name.includes(containerName) &&
            el instanceof TweenablePixiContainer
    ) as TweenablePixiContainer[]
    existingNotifications.forEach(el => {
        shiftNotificationUp(el)
    })
}

const shiftNotificationUp = async (
    el: TweenablePixiContainer,
) => {
    await Tweener.add(
        {
            target: el,
            duration: 0.5,
            ease: Easing.easeFromTo,
        },
        {
            y: el.position.y - verticalMargin,
        }
    )
}

/**
 * Begins at alpha 0, is then faded into the screen by slamAnimateElIntoScreen
 */
function Notification<T extends string>(
    textToDisplay: T,
    assetSrc: AssetKey,
    count: number
) {
    let textureSrc
    try {
        textureSrc = getTexture(assetSrc)
    } catch (e) {
        console.error(e)
    }

    const NotificationIcon = Container(
        {
            height: 50,
            width: 50,
        },
        RoundedBordered(
            Sprite({
                src: textureSrc ?? getTexture('cardArtPlaceholder'),
                // scale: 0.125,
                height: 50,
                width: 50,
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
            height: NotificationIcon.height + BASE_PADDING,
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
            name: `${containerName}_${assetSrc}_${currNotificationsCount}`,
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
