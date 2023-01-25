import {
    depricatedScoreUpdateFromClient,
    InfoBox,
    ModalBackdrop,
} from '@sharedElements'
import {
    Adjust,
    getStage,
    loopSong,
    PixiContainer,
    PixiText,
    playSongOnce,
    RoundedRectangleGradientSprite,
    TweenablePixiContainer,
} from '@/elementsUtil'
import {
    getTexture,
    Text,
    TweenableContainer,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    Sprite,
} from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { callApi } from '@/callApi'
import {
    Leaderboard,
    LEADERBOARD_ENTRIES_PER_PAGE,
    MAX_LEADERBOARD_PAGE,
    RunScoreAttributeName,
    RUN_SCORE_EVENT_MAPPING,
    RUN_SCORE_EVENT_META,
} from 'shared'
import { DisplayObject, ITextStyle, Texture } from 'pixi.js'
import { callServerApi } from '@/callServerApi'
import { round, sortBy } from 'lodash'
import { collectData } from '@/analytics/collectData'
import { compose, Datum, datum } from 'datums'
import { getShortWalletAddress } from '@/components/util'

const getShowOnHoverFns = (el: PixiContainer) => ({
    onMouseover: () => getStage().addChild(el),
    onMouseout: () => getStage().removeChild(el),
})

const animateNumberInElement = async (
    element: PixiText,
    text: string,
    finalNumber: number,
    speed: 'slow' | 'normal' | 'fast' = 'normal'
): Promise<void> => {
    let initialNumber = 0
    const numberIncrement = speed === 'slow' ? 1 : speed === 'normal' ? 2 : 3
    const intervalIncrement =
        speed === 'slow' ? 100 : speed === 'normal' ? 25 : 10

    return await new Promise(resolve => {
        const tempInterval = setInterval(() => {
            element.text = `${initialNumber} ${text}`
            initialNumber += numberIncrement

            if (initialNumber >= finalNumber) {
                element.text = `${finalNumber.toFixed(0)} ${text}`
                clearInterval(tempInterval)
                resolve(void 0)
            }
        }, intervalIncrement)
    })
}

let itemsOnScreen = 0
const getScoreItemPosition = () => {
    const ITEMS_PER_COLUMN = 9

    const leftColumnX = BASE_WIDTH / 2 - 500
    const rightColumnX = BASE_WIDTH / 2 + 50
    const x = itemsOnScreen <= ITEMS_PER_COLUMN ? leftColumnX : rightColumnX

    const Y_MARGIN = 38
    const Y_BASE = BASE_HEIGHT / 2 - 180
    const y =
        itemsOnScreen <= ITEMS_PER_COLUMN
            ? Y_BASE + Y_MARGIN * itemsOnScreen
            : Y_BASE + Y_MARGIN * (itemsOnScreen - ITEMS_PER_COLUMN)

    return { x, y }
}

const baseStyle: Partial<ITextStyle> = {
    fontSize: 24,
    fill: 'white',
    padding: 4,
    align: 'center',
    fontWeight: 'lighter',
    fontFamily: 'bigFont',
}

const ScoreAttributeItem = (
    attribute: RunScoreAttributeName,
    score: number
) => {
    itemsOnScreen++

    const { x, y } = getScoreItemPosition()
    const attributeEvent =
        RUN_SCORE_EVENT_MAPPING[attribute as RunScoreAttributeName]

    const { keyword, description, pointValue } =
        RUN_SCORE_EVENT_META[attributeEvent]

    const descriptionSubtitle = `${pointValue} ${
        pointValue === 1 ? 'point' : 'points'
    } per unit`

    const Title = Text({
        text: `${keyword}   x   ${score}`,
        anchor: [0, 0.5],
        x,
        y,
        style: {
            ...baseStyle,
        },
        name: attribute,
    })

    const Points = Text({
        text: `${round(score * pointValue, 1)} pts`,
        anchor: [1, 0.5],
        x: x + 425,
        y,
        style: {
            ...baseStyle,
            fontFamily: 'sansFont',
        },
        name: `${attribute}_score`,
    })

    const ExplanationTitle = Text({
        text: description,
        x: 15,
        y: 10,
        style: {
            ...baseStyle,
            fill: '#c5e0ef',
        },
    })
    const ExplanationSubtitle = Text({
        text: descriptionSubtitle,
        x: 15,
        y: 40,
        style: {
            ...baseStyle,
            fontSize: 20,
            fontFamily: 'sansFont',
            fontStyle: 'italic',
        },
    })

    const ExplanationInfoBox = InfoBox(
        Container({}, ExplanationTitle, ExplanationSubtitle),
        {
            x: x + Title.width + 25,
            y: y - 24,
            name: `${keyword} Explanation`,
            zIndex: 999,
            padding: 8,
            borderColor: 0x44403c,
            colorStops: [{ color: 0x57534e, offset: 0 }],
            alpha: 0.95,
        }
    )

    const { onMouseout, onMouseover } = getShowOnHoverFns(ExplanationInfoBox)

    const ScoreItemContainer = TweenableContainer(
        { onMouseover, onMouseout },
        Title,
        Points
    )

    return ScoreItemContainer
}

export function EndOfRunScreen(): PixiContainer {
    collectData('ui_ux_view', { page_title: 'End of Run Screen' })

    const scene = getBattleScene()
    const battleState = scene.get('state')
    const showLeaderboard = datum(true)
    const currLeaderboardPage = datum(0)
    const userId = scene.get('username')
    const leaderboardsss = callServerApi('getLeaderboard', {
        userId,
    })

    const leaderboard = callServerApi('getLeaderboard', {
        userId,
    }).then(leaderboard => {
        const sortedLeaderboards = sortBy(
            leaderboard,
            entry => entry.highest_score
        ).reverse()

        renderLeaderboardsPage(sortedLeaderboards, 0)
        return sortedLeaderboards as Leaderboard
    })

    const changeLeaderboardPage = (direction: 'next' | 'prev') => {
        if (direction === 'prev') {
            if (currLeaderboardPage.val > 0)
                currLeaderboardPage.set(currLeaderboardPage.val - 1)
        } else if (direction === 'next') {
            if (currLeaderboardPage.val < MAX_LEADERBOARD_PAGE - 1)
                currLeaderboardPage.set(currLeaderboardPage.val + 1)
        }
    }

    currLeaderboardPage.onChange(newPage => {
        leaderboard.then(board => {
            renderLeaderboardsPage(board, newPage)
            LeaderboardPageButtons.removeChildren()
            if (newPage > 0 && newPage < MAX_LEADERBOARD_PAGE - 1) {
                LeaderboardPageButtons.addChild(PageUpArrow)
                LeaderboardPageButtons.addChild(PageDownArrow)
            } else if (newPage === 0) {
                LeaderboardPageButtons.addChild(PageDownArrow)
            } else if (newPage === MAX_LEADERBOARD_PAGE - 1) {
                LeaderboardPageButtons.addChild(PageUpArrow)
            }
        })
        console.log(newPage)
    })

    const renderLeaderboardsPage = (
        sortedLeaderboard: Leaderboard,
        page: number
    ) => {
        LeaderboardEntries.children.forEach(child => {
            child.destroy()
        })
        LeaderboardEntries.removeChildren()

        const entryIsInRange = (idx: number): boolean => {
            const lowerBound = page * LEADERBOARD_ENTRIES_PER_PAGE - 1
            const upperBound =
                LEADERBOARD_ENTRIES_PER_PAGE +
                page * LEADERBOARD_ENTRIES_PER_PAGE

            if (idx > lowerBound && idx < upperBound) {
                return true
            }
            return false
        }

        let inScreenIdx = 0
        sortedLeaderboard.forEach((entry, idx) => {
            const entryIsCurrentUser = entry.user_id === userId
            if (!entryIsInRange(idx) && !entryIsCurrentUser) {
                return
            }
            if (entryIsInRange(idx)) {
                inScreenIdx++
                LeaderboardEntries.addChild(
                    LeaderboardEntry(
                        entry.wallet_address,
                        entry.highest_score,
                        entry.end_ts,
                        inScreenIdx - 1,
                        idx + 1,
                        false
                    )
                )
            }

            if (entryIsCurrentUser) {
                LeaderboardEntries.addChild(
                    LeaderboardEntry(
                        entry.wallet_address,
                        entry.highest_score,
                        entry.end_ts,
                        inScreenIdx - 1,
                        idx + 1,
                        true
                    )
                )
            }
        })
    }

    battleState === 'won'
        ? loopSong('runVictoryMusicHooligansBluff')
        : loopSong('defeatMusicHooligansBluff')

    // --- Pixi Elements ---
    const RunResultBanner = () => {
        const src = getTexture(
            `${battleState === 'won' ? 'victory' : 'defeat'}`
        )
        const scale = 0.35
        return TweenableContainer(
            {},
            Sprite({
                src,
                scale,
                x: BASE_WIDTH / 2 - (src.width * scale) / 2,
                y: BASE_HEIGHT / 2 - 550,
            })
        )
    }

    const TotalScoreTitle = Text({
        text: `Total Score`,
        anchor: [0, 0.5],
        x: BASE_WIDTH / 2 - 500,
        y: BASE_HEIGHT / 2 + 265,
        style: {
            fontSize: 64,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'bigFont',
        },
        name: 'TotalScoreTitle',
    })

    const TotalScore = Text({
        text: ``,
        anchor: [1, 0.5],
        x: BASE_WIDTH / 2 + 450,
        y: BASE_HEIGHT / 2 + 265,
        style: {
            fontSize: 50,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'lighter',
            fontFamily: 'sansFont',
        },
        name: 'TotalScore',
    })

    const TopBorder = Sprite({
        src: Texture.WHITE,
        width: 1000,
        height: 2,
        x: BASE_WIDTH / 2 - 500,
        y: BASE_HEIGHT / 2 + 210,
        anchor: [0, 0.5],
        alpha: 0.1,
    })

    const TotalScoreContainer = Container(
        {},
        TopBorder,
        TotalScoreTitle,
        TotalScore
    )

    const tryAgainButton = Sprite({
        src: getTexture('tryAgainButton'),
        anchor: 0,
        y: BASE_HEIGHT / 2 + 380,
        x: BASE_WIDTH / 2 - 400,
        scale: 0.6,
        onClick: handleTryAgain,
    })

    const showLeaderboardButton = Sprite({
        src: getTexture('endTurnButton'),
        anchor: 0,
        y: BASE_HEIGHT / 2 + 380,
        x: BASE_WIDTH / 2 + 75,
        scale: 0.6,
        onClick: () => {
            showLeaderboard.set(!showLeaderboard.val)
        },
    })

    const backToScoreButton = Text({
        text: '❎',
        // anchor: 0,
        y: BASE_HEIGHT / 2 - 500,
        x: BASE_WIDTH / 2 + 800,
        style: {
            fontSize: 64
        },
        onClick: () => {
            showLeaderboard.set(!showLeaderboard.val)
        },
    })

    // const backToScoreButton = Sprite({
    //     src: getTexture('skipButton'),
    //     anchor: 0,
    //     y: BASE_HEIGHT / 2 + 400,
    //     // x: BASE_WIDTH / 2,
    //     scale: 0.6,
    //     onClick: () => {
    //         showLeaderboard.set(!showLeaderboard.val)
    //     },
    // })

    const RoundedBlackRectBackground = RoundedRectangleGradientSprite({
        spriteArgs: {
            width: 1100,
            height: 525,
            x: BASE_WIDTH / 2,
            y: BASE_HEIGHT / 2 + 65,
            name: 'RoundedBlackRectBackground',
            anchor: [0.5, 0.5],
            alpha: 0.6,
            tint: 1,
        },
        radius: 50,
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

    type LeaderboardTimeToggle = 0 | 1 | 2
    const activeTimeOption = datum<LeaderboardTimeToggle>(0)

    const LeaderboardTimeOption = (
        text: string = 'default',
        active: boolean = false,
        id: LeaderboardTimeToggle
    ) => {
        const Background = RoundedRectangleGradientSprite({
            spriteArgs: {
                width: 500,
                height: 85,
                anchor: [0, 0],
                alpha: 0.8,
            },
            radius: 50,
            gradientArgs: {
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 50,
                colorStops: [{ color: active ? 'white' : 0x404040, offset: 0 }],
            },
        })

        const TimeOptionText = Text({
            text,
            anchor: [0, 0],
            x: Background.width / 2,
            style: {
                fill: active ? 'black' : 'white',
                fontFamily: 'bigFont',
                fontWeight: '100',
                fontSize: 36,
            },
        })

        return Container(
            {
                name: `${text}_Container`,
                y: BASE_HEIGHT / 2 - 430,
                onClick: () => activeTimeOption.set(id),
            },
            Background,
            Adjust(TimeOptionText, {
                x: Background.width / 2 - TimeOptionText.width / 2,
                y: Background.height / 2 - TimeOptionText.height / 2,
            })
        )
    }

    const createTimeOption = (index: LeaderboardTimeToggle) => {
        const isActive = activeTimeOption.val === index
        switch (index) {
            case 0:
                return Adjust(LeaderboardTimeOption('TODAY', isActive, 0), {
                    x: BASE_WIDTH / 2 - 800,
                })
            case 1:
                return Adjust(LeaderboardTimeOption('THIS WEEK', isActive, 1), {
                    x: BASE_WIDTH / 2 - 250,
                })
            case 2:
                return Adjust(LeaderboardTimeOption('ALL TIME', isActive, 2), {
                    x: BASE_WIDTH / 2 + 300,
                })
        }
    }

    const style = {
        fill: 'white',
        fontFamily: 'monoFont'
    }

    const PageUpArrow = Text({
        name: 'PageUpArrow',
        text: '⬆️',
        x: BASE_WIDTH / 2 + 785,
        y: BASE_HEIGHT / 2 - 250,
        style: {
            fontSize: 42,
        },
        onClick: () => changeLeaderboardPage('prev'),
    })

    const PageDownArrow = Text({
        name: 'PageDownArrow',
        text: '⬇️',
        x: BASE_WIDTH / 2 + 785,
        y: BASE_HEIGHT / 2 + 215,
        style: {
            fontSize: 42,
        },
        onClick: () => changeLeaderboardPage('next'),
    })

    const LeaderboardPageButtons = Container({}, PageDownArrow)

    const LeaderboardContextMenu = Container(
        {},
        createTimeOption(0),
        createTimeOption(1),
        createTimeOption(2),
        Text({
            text: 'RANK',
            y: BASE_HEIGHT / 2 - 300,
            x: BASE_WIDTH / 2 - 700,
            style,
        }),
        Text({
            text: 'USER',
            y: BASE_HEIGHT / 2 - 300,
            x: BASE_WIDTH / 2 - 400,
            style,
        }),
        Text({
            text: 'SCORE',
            y: BASE_HEIGHT / 2 - 300,
            x: BASE_WIDTH / 2 - 100,
            style,
        }),
        Text({
            text: 'TEAM',
            y: BASE_HEIGHT / 2 - 300,
            x: BASE_WIDTH / 2 + 250,
            style,
        }),
        Text({
            text: 'DATE',
            y: BASE_HEIGHT / 2 - 300,
            x: BASE_WIDTH / 2 + 600,
            style,
        })
    )

    activeTimeOption.onChange(() => {
        LeaderboardContextMenu.children.forEach(child => {
            child.destroy()
        })
        LeaderboardContextMenu.removeChildren()
        LeaderboardContextMenu.addChild(
            createTimeOption(0),
            createTimeOption(1),
            createTimeOption(2)
        )
    })

    const LeaderboardEntry = (
        walletAddress: string,
        highScore: number,
        endTime: number,
        inScreenIdx: number,
        rank: number,
        isSelf: boolean
    ) => {
        const y = isSelf
            ? BASE_HEIGHT / 2 + 375
            : BASE_HEIGHT / 2 - 200 + 105 * inScreenIdx
        const x = BASE_WIDTH / 2
        const date = new Date(endTime)

        return Container(
            {},
            RoundedRectangleGradientSprite({
                spriteArgs: {
                    width: 1550,
                    height: 100,
                    x,
                    y,
                    name: 'LeaderboardBackground',
                    anchor: [0.5, 0.5],
                    alpha: 1,
                },
                radius: 30,
                gradientArgs: {
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: 100,
                    colorStops: [
                        { color: isSelf ? 0x7D4E57 : rank % 2 > 0 ? 0x212D40 : 0x364156, offset: 0 },
                    ],
                },
            }),
            Text({
                text: `${rank}.`,
                y: y - 10,
                x: x - 700,
                style,
            }),
            Text({
                text:
                    getShortWalletAddress(walletAddress) +
                    (isSelf ? ' (YOU)' : ''),
                y: y - 10,
                x: x - 400,
                style,
            }),
            Text({
                text: highScore,
                y: y - 10,
                x: x - 100,
                style,
            }),
            Text({
                text: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
                y: y - 10,
                x: x + 500,
                style,
            })
        )
    }

    const LeaderboardEntries = Container({})

    const Leaderboard = Container(
        {},
        RoundedRectangleGradientSprite({
            spriteArgs: {
                width: 1700,
                height: 950,
                x: BASE_WIDTH / 2,
                y: BASE_HEIGHT / 2,
                name: 'LeaderboardBackground',
                anchor: [0.5, 0.5],
                alpha: 0.9,
                // tint: 1,
            },
            radius: 50,
            gradientArgs: {
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 500,
                colorStops: [{ color: 0x11151c, offset: 0 }],
            },
        }),
        LeaderboardContextMenu,
        LeaderboardPageButtons,
        LeaderboardEntries
    )

    const ScoreElements = Container({}, RoundedBlackRectBackground)

    // Runs text animations synchronously
    ;(async () => {
        const screenHasNotOpened = scene.get('endScreenHasOpened') === false
        const isVictory = scene.get('state') === 'won'

        // below condition will only be met once (even after refresh)
        if (screenHasNotOpened) {
            collectData('level_end', {
                room_number: scene.get('numRoomsPassed'), // no +1 bc it should already be updated
                room_id: scene.get('currentRoom').uid,
                room_tier: scene.get('currentRoom').category,
                run_id: scene.get('runId'),
            })

            collectData('run_end', {
                map_seed: 1,
                run_id: scene.get('runId'),
            })

            if (isVictory) {
                depricatedScoreUpdateFromClient('ROOM_CLEARED', 1, scene)
                callApi('openEndScreen', {})
            }

            const { runId } = await callServerApi('endRun', {
                userId,
            })

            if (runId === null) {
                console.warn('Tried to end run but runId was null')
            }
        }

        const runScoreAttributes = scene.get('runScore').attributes

        for (let attribute in runScoreAttributes) {
            const points =
                runScoreAttributes[attribute as RunScoreAttributeName]
            if (points === 0) continue
            const ScoreAttribute = ScoreAttributeItem(
                attribute as RunScoreAttributeName,
                points
            )
            ScoreElements.addChild(ScoreAttribute)
        }

        await animateNumberInElement(
            TotalScore,
            'points',
            scene.select('runScore').get('totalScore'),
            'normal'
        )
        callApi('openEndScreen', {})
    })()

    const TogglableMainContainer = Container({})
    const TogglableButtonsContainer = Container({})

    // --- Handlers ---
    const handleLeaderboardToggle = (showLeaderboard: boolean) => {
        TogglableMainContainer.removeChildren()
        TogglableButtonsContainer.removeChildren()

        if (showLeaderboard) {
            TogglableMainContainer.addChild(Leaderboard)
            TogglableButtonsContainer.addChild(backToScoreButton)
            // Adjust(backToScoreButton, {
            //     x: BASE_WIDTH / 2 - backToScoreButton.width / 2,
            // })
        } else {
            TogglableMainContainer.addChild(ScoreElements)
            TogglableMainContainer.addChild(TotalScoreContainer)
            TogglableMainContainer.addChild(RunResultBanner())
            TogglableButtonsContainer.addChild(tryAgainButton)
            TogglableButtonsContainer.addChild(showLeaderboardButton)
            Adjust(showLeaderboardButton, { x: BASE_WIDTH / 2 + 75 })
        }
    }

    showLeaderboard.onChange(
        showLeaderboard => handleLeaderboardToggle(showLeaderboard),
        true
    )

    /** Takes you to character select screen */
    function handleTryAgain() {
        void callApi('makeNewUser', {
            username: localStorage.getItem('username') as string,
        })
        window.location.reload()
    }

    const EndOfRunContainer = Container(
        { x: 0, y: 0, scale: 1, name: 'EndOfRunContainer' },
        ModalBackdrop(),
        TogglableMainContainer,
        TogglableButtonsContainer
    )

    return EndOfRunContainer
}
