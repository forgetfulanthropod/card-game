import { getStage, getTexture, Text } from '@/elementsUtil'
import { Container, Sprite } from '@/elementsUtil'

const MIN_Y_OFFSET = 50
const MIN_X_OFFSET = 50
const BASE_PADDING = 25
let currY = MIN_Y_OFFSET

// Can eventually separate logic and view if it ever becomes necessary
function displayScoreNotification<T extends string>(
    textToDisplay: T,
    assetSrc: string,
    count: number
) {
    const stage = getStage()
    const containerName = `NotificationContainer`
    const NotificationIcon = Sprite({
        src: getTexture(assetSrc),
        scale: 0.2,
        anchor: [0, 0],
        x: 0,
        y: 0, // TODO: adjust based on unique item attr
        name: 'NotificationIcon',
    })

    const TextToDisplay = Text({
        text: `${textToDisplay}`,
        anchor: [0, 0],
        x: NotificationIcon.x + NotificationIcon.width + BASE_PADDING,
        y: NotificationIcon.y - 5,
        style: {
            fontSize: 40,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontFamily: 'bigFont',
        },
        name: `${textToDisplay}`,
    })

    const CountToDisplay = Text({
        text: `+ ${count}`,
        anchor: [0, 0],
        x: TextToDisplay.x + TextToDisplay.width + BASE_PADDING,
        y: TextToDisplay.y,
        style: {
            fontSize: 40,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontFamily: 'bigFont',
        },
        name: `${count}`,
    })

    const existingNotification = stage.getChildByName(containerName)
    const verticalMargin = TextToDisplay.height + BASE_PADDING
    if (existingNotification) {
        currY += verticalMargin
    }

    const NotificationContainer = Container(
        {
            name: containerName,
            x: MIN_X_OFFSET,
            y: currY,
        },
        NotificationIcon,
        TextToDisplay,
        CountToDisplay
    )

    stage.addChild(NotificationContainer)

    setTimeout(() => {
        NotificationContainer.destroy({ children: true})
        currY -= verticalMargin
        if (currY < MIN_Y_OFFSET) currY = MIN_Y_OFFSET
    }, 2000)
}

export { displayScoreNotification }
