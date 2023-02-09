import {
    AssetKey,
    getStage,
    getTexture,
    RoundedBordered,
    RoundedRectangleGradientSprite,
    Text,
    TweenableContainer,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { Container, Sprite } from '@/elementsUtil'
import { uid } from '@pixi/utils'
import { Easing, Tweener } from 'pixi-tweener'

const MIN_Y_OFFSET = 40
const MIN_X_OFFSET = 50
const BASE_PADDING = 15
const BASE_HEIGHT = 65
const VERTICAL_MARGIN = (BASE_HEIGHT + BASE_PADDING) as 80

type NotificationMetadata = {
    elementName: string
    isFadingIn: boolean
}

class NotificationSpawner {
    private stage
    private queue: NotificationMetadata[] = []

    constructor() {
        this.stage = getStage()
    }

    public async spawn(
        textToDisplay: string,
        assetSrc: AssetKey,
        count: number
    ) {
        const notification = Notification(textToDisplay, assetSrc, count)
        const metadata = this.getInitialMetadata(notification)
        this.queue.unshift(metadata)
        this.stage.addChild(notification)
        this.triggerAnimations()
        this.setDestroyTimer(notification)
    }

    private getInitialMetadata(
        el: TweenablePixiContainer
    ): NotificationMetadata {
        return { elementName: el.name, isFadingIn: true }
    }

    private async triggerAnimations() {
        this.queue.forEach(async (el, idx) => {
            const pixiEl = this.stage.getChildByName(
                el.elementName
            ) as TweenablePixiContainer
            const targetY = this.getTargetY(idx)
            if (el.isFadingIn) {
                // this adjusts the starting position in case other notifications are displayed concurrently.
                // otherwise, all the concurrent notifications would first fade into the same y-position (before being adjusted to their correct one).
                Tweener.killTweensOf(pixiEl)
                pixiEl.position.set(pixiEl.position.x, targetY)
                this.slamAnimateElIntoScreen(pixiEl, targetY)
            } else {
                this.shiftElement(pixiEl, targetY)
            }
        })
    }

    private getTargetY(index: number) {
        return index * VERTICAL_MARGIN + MIN_Y_OFFSET
    }

    private async slamAnimateElIntoScreen(
        el: TweenablePixiContainer,
        targetY: number
    ) {
        await Tweener.add(
            {
                target: el,
                duration: 0.6,
                ease: Easing.bouncePast,
            },
            {
                alpha: 1,
                tweenableScale: 1,
                x: MIN_X_OFFSET,
                y: targetY,
            }
        )
        const actualY = el.position.y
        if (Math.abs(targetY - actualY) > 5) {
            // this means the tweener was cancelled (and another one triggered) by a concurrent notification, so we shouldn't update the metadata yet
        } else {
            const elMetadataIdx = this.queue.findIndex(
                queueEl => queueEl.elementName === el.name
            )
            this.queue[elMetadataIdx].isFadingIn = false
        }
    }

    private async shiftElement(el: TweenablePixiContainer, targetY: number) {
        await Tweener.add(
            {
                target: el,
                duration: 0.4,
                ease: Easing.easeFromTo,
            },
            {
                y: targetY,
            }
        )
    }

    private async setDestroyTimer(el: TweenablePixiContainer) {
        setTimeout(async () => {
            await Tweener.add(
                {
                    target: el,
                    duration: 0.2,
                },
                {
                    alpha: 0,
                }
            )
            Tweener.killTweensOf(el)
            el.destroy()
            this.queue.pop()
        }, 3000)
    }
}

let spawner: NotificationSpawner

const displayScoreNotification = (
    textToDisplay: string,
    assetSrc: AssetKey,
    count: number
) => {
    if (!spawner) {
        spawner = new NotificationSpawner()
    }
    spawner.spawn(textToDisplay, assetSrc, count)
}

/** Initial opacity 0, is animated to opacity 1 by spawner */
function Notification(
    textToDisplay: string,
    assetSrc: AssetKey,
    count: number
) {
    let textureSrc
    try {
        textureSrc = getTexture(assetSrc)
    } catch (e) {
        console.warn(`asset ${assetSrc} is missing`)
    }

    const NotificationIcon = Container(
        {
            height: 50,
            width: 50,
        },
        RoundedBordered(
            Sprite({
                src: textureSrc ?? getTexture('cardArtPlaceholder'),
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
            name: `${textToDisplay}${uid()}`,
            x: MIN_X_OFFSET - RoundedBlackRectBackground.width / 2,
            y: -20,
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

export { displayScoreNotification }
