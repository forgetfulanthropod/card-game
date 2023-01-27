import {
    depricatedScoreUpdateFromClient,
    InfoBox,
    ModalBackdrop,
} from '@sharedElements'
import {
    Adjust,
    AssetKey,
    getStage,
    loopSong,
    PixiContainer,
    PixiText,
    playSongOnce,
    RoundedBordered,
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
    CharacterId,
    Leaderboard,
    LeaderboardTimeToggle,
    LEADERBOARD_ENTRIES_PER_PAGE,
    MappedLeaderboards,
    MAX_LEADERBOARD_PAGE,
    RunScoreAttributeName,
    RUN_SCORE_EVENT_MAPPING,
    RUN_SCORE_EVENT_META,
    ScoreTags,
    Timeframe,
} from 'shared'
import { DisplayObject, ITextStyle, Texture } from 'pixi.js'
import { callServerApi } from '@/callServerApi'
import { keys, round, sortBy } from 'lodash'
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
    const showLeaderboard = datum(false)
    const currLeaderboardPage = datum(0)
    const activeTimeToggle = datum<LeaderboardTimeToggle>('daily')
    const userId = scene.get('username')

    callServerApi('getLeaderboard', {
        userId,
    }).then(allLeaderboards => {
        // sort leaderboards in place
        keys(allLeaderboards).forEach(_timeframe => {
            const timeframe = _timeframe as Timeframe
            const currBoard = allLeaderboards[timeframe]
            const sortedBoard = sortBy(
                currBoard,
                entry => entry.highest_score
            ).reverse()
            allLeaderboards[timeframe] = sortedBoard
        })

        // refreshes leaderboard entries and nav arrows when user toggles timeframe
        activeTimeToggle.onChange(newVal => {
            LeaderboardEntries.removeChildren()
            LeaderboardSelfEntry.removeChildren()

            // change twice to force trigger a refresh on nav arrows if prev page was 0
            currLeaderboardPage.set(1)
            currLeaderboardPage.set(0)
            renderLeaderboardsPage(
                allLeaderboards[newVal],
                currLeaderboardPage.val
            )

            LeaderboardContextMenu.removeChildren()
            LeaderboardContextMenu.addChild(
                createTimeToggle('daily'),
                createTimeToggle('weekly'),
                createTimeToggle('allTime')
            )
        }, true)

        // checks number of total entries vs currently displayed to display or hide nav arrows
        currLeaderboardPage.onChange(newPage => {
            LeaderboardNavArrows.removeChildren()

            const currLeaderboards = allLeaderboards[activeTimeToggle.val]
            const currMaxEntryDisplayed =
                newPage * LEADERBOARD_ENTRIES_PER_PAGE +
                LEADERBOARD_ENTRIES_PER_PAGE
            const currMinEntryDisplayed = newPage * LEADERBOARD_ENTRIES_PER_PAGE

            // currLeaderboards is of length === 101 when currUser is not in top 100
            if (currMaxEntryDisplayed < currLeaderboards.length - 1) {
                LeaderboardNavArrows.addChild(PageDownArrow)
            }

            if (currMinEntryDisplayed > 0) {
                LeaderboardNavArrows.addChild(PageUpArrow)
            }

            renderLeaderboardsPage(currLeaderboards, newPage)
        }, true)
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
            const entryIsCurrentUser = entry.is_self
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
                        false,
                        entry.teamComp ?? []
                    )
                )
            }

            if (
                entryIsCurrentUser &&
                LeaderboardSelfEntry.children.length === 0
            ) {
                LeaderboardSelfEntry.addChild(
                    LeaderboardEntry(
                        entry.wallet_address,
                        entry.highest_score,
                        entry.end_ts,
                        inScreenIdx - 1,
                        idx + 1,
                        true,
                        entry.teamComp ?? []
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
        y: BASE_HEIGHT / 2 + 262,
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

    const NewHighScoreTag = () => {
        const Background = RoundedRectangleGradientSprite({
            spriteArgs: {
                width: 160,
                height: 50,
                anchor: [0, 0],
            },
            radius: 50,
            gradientArgs: {
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 50,
                colorStops: [{ color: 0x184777, offset: 0 }],
            },
        })

        const HighScoreText = Text({
            text: 'HIGH SCORE',
            anchor: [0, 0],
            x: Background.width / 2,
            style: {
                fill: 0xccdff5,
                fontFamily: 'sansFont',
                fontWeight: '300',
                fontSize: 20,
            },
        })

        return Container(
            {
                name: `HighScoreTag_Container`,
                x: BASE_WIDTH / 2 - 110,
                y: BASE_HEIGHT / 2 + 240,
            },
            Background,
            Adjust(HighScoreText, {
                x: Background.width / 2 - HighScoreText.width / 2,
                y: Background.height / 2 - HighScoreText.height / 2,
            })
        )
    }

    const TopPercentileTag = () => {
        const Background = RoundedRectangleGradientSprite({
            spriteArgs: {
                width: 110,
                height: 50,
                anchor: [0, 0],
            },
            radius: 30,
            gradientArgs: {
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 50,
                colorStops: [{ color: 0x084a35, offset: 0 }],
            },
        })

        const HighScoreText = Text({
            text: 'TOP 3%',
            anchor: [0, 0],
            x: Background.width / 2,
            style: {
                fill: 0xa1e3ce,
                fontFamily: 'sansFont',
                fontWeight: '100',
                fontSize: 20,
            },
        })

        return Container(
            {
                name: `TopPercentileTag_Container`,
                x: BASE_WIDTH / 2 + 80,
                y: BASE_HEIGHT / 2 + 240,
            },
            Background,
            Adjust(HighScoreText, {
                x: Background.width / 2 - HighScoreText.width / 2,
                y: Background.height / 2 - HighScoreText.height / 2,
            })
        )
    }

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
        src: getTexture('leaderboardButton'),
        anchor: 0,
        y: BASE_HEIGHT / 2 + 380,
        x: BASE_WIDTH / 2 + 75,
        scale: 0.6,
        onClick: () => {
            showLeaderboard.set(!showLeaderboard.val)
        },
    })

    const closeModalButton = Sprite({
        src: getTexture('closeButton'),
        // anchor: [0.5, 0.5],
        y: BASE_HEIGHT / 2 - 500,
        x: BASE_WIDTH / 2 + 700,
        scale: 0.4,
        onClick: () => {
            showLeaderboard.set(!showLeaderboard.val)
        },
    })

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
            x1: 0,
            y0: 0,
            y1: 700,
            colorStops: [
                { color: 0x0b0b09, offset: 0 },
                { color: 0x3f4338, offset: 1 },
            ],
        },
    })

    const LeaderboardTimeToggle = (
        text: string = 'default',
        active: boolean = false,
        id: LeaderboardTimeToggle
    ) => {
        const Background = RoundedRectangleGradientSprite({
            spriteArgs: {
                width: 450,
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
                colorStops: [
                    { color: active ? 0xf4f5f6 : 0x545a64, offset: 0 },
                ],
            },
        })

        const TimeToggleText = Text({
            text,
            anchor: [0, 0],
            x: Background.width / 2,
            style: {
                fill: active ? 'black' : 'white',
                fontFamily: 'bigFont',
                fontWeight: '100',
                fontSize: 30,
            },
        })

        return Container(
            {
                name: `${text}_Container`,
                y: BASE_HEIGHT / 2 - 335,
                onClick: () => activeTimeToggle.set(id),
            },
            Background,
            Adjust(TimeToggleText, {
                x: Background.width / 2 - TimeToggleText.width / 2,
                y: Background.height / 2 - TimeToggleText.height / 2,
            })
        )
    }

    const createTimeToggle = (toggledValue: LeaderboardTimeToggle) => {
        const isActive = activeTimeToggle.val === toggledValue
        switch (toggledValue) {
            case 'daily':
                return Adjust(
                    LeaderboardTimeToggle('TODAY', isActive, 'daily'),
                    {
                        x: BASE_WIDTH / 2 - 750,
                    }
                )
            case 'weekly':
                return Adjust(
                    LeaderboardTimeToggle('THIS WEEK', isActive, 'weekly'),
                    {
                        x: BASE_WIDTH / 2 - 225,
                    }
                )
            case 'allTime':
                return Adjust(
                    LeaderboardTimeToggle('ALL TIME', isActive, 'allTime'),
                    {
                        x: BASE_WIDTH / 2 + 300,
                    }
                )
        }
    }

    const style = {
        fill: 'white',
        fontFamily: 'monoFont',
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

    const LeaderboardNavArrows = Container({})

    const y = BASE_HEIGHT / 2 - 200
    const LeaderboardContextMenu = Container(
        {},
        createTimeToggle('daily'),
        createTimeToggle('weekly'),
        createTimeToggle('allTime')
    )

    activeTimeToggle.onChange(() => {
        LeaderboardContextMenu.children.forEach(child => {
            child.destroy()
        })
        LeaderboardContextMenu.removeChildren()
        LeaderboardContextMenu.addChild(
            createTimeToggle('daily'),
            createTimeToggle('weekly'),
            createTimeToggle('allTime')
        )
    })

    const LeaderboardEntry = (
        walletAddress: string,
        highScore: number,
        endTime: number,
        inScreenIdx: number,
        rank: number,
        isSelf: boolean,
        teamComp: CharacterId[]
    ) => {
        const y = isSelf
            ? BASE_HEIGHT / 2 + 375
            : BASE_HEIGHT / 2 - 165 + 105 * inScreenIdx
        const x = BASE_WIDTH / 2
        const date = new Date(endTime)

        // TODO: CHANGE TO ACTUAL CHARACTER TEXTURE
        const renderTeamCompUnit = (idx: number, characterId: CharacterId) => {
            return Container(
                {
                    y: y - 35,
                    x: x + 100 + idx * 100,
                },
                RoundedBordered(
                    Sprite({
                        src: getTexture(`${characterId}Profile` as AssetKey),
                        scale: 0.2,
                    }),
                    {
                        radius: 20,
                        borderThickness: 3,
                        borderColor: 0,
                    }
                )
            )
        }

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
                        {
                            color: isSelf
                                ? 0x7d4e57
                                : rank % 2 > 0
                                ? 0x212d40
                                : 0x364156,
                            offset: 0,
                        },
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
            Sprite({
                src: isSelf
                    ? `userAvatar1`
                    : (`userAvatar${Math.ceil(
                          10 * Math.random()
                      )}` as AssetKey),
                y: y - 20,
                x: x - 460,
                scale: 0.5,
            }),
            Text({
                text: highScore,
                y: y - 10,
                x: x - 80 - 10 * highScore.toString().length,
                style: {
                    ...style,
                    align: 'right',
                },
            }),
            Text({
                text: 'points',
                y: y - 2,
                x: x - 55,
                style: {
                    fill: 0xd8dad3,
                    fontSize: 14,
                },
            }),
            ...teamComp.map((char, idx) => {
                return renderTeamCompUnit(idx, char)
            }),
            Text({
                text: `${
                    date.getMonth() + 1
                }/${date.getDate()}/${date.getFullYear()}`,
                y: y - 10,
                x: x + 500,
                style,
            })
        )
    }

    const LeaderboardEntries = Container({})
    const LeaderboardSelfEntry = Container({})

    const LeaderboardSign = TweenableContainer(
        {
            x: 290,
            y: -275,
            scale: 0.35,
        },
        Sprite({
            src: getTexture('roomClearedSign'),
        })
    )

    const Leaderboard = Container(
        {},
        RoundedRectangleGradientSprite({
            spriteArgs: {
                width: 1700,
                height: 900,
                x: BASE_WIDTH / 2,
                y: BASE_HEIGHT / 2 + 50,
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
                colorStops: [{ color: 0x141612, offset: 0 }],
            },
        }),
        LeaderboardContextMenu,
        LeaderboardNavArrows,
        LeaderboardEntries,
        LeaderboardSelfEntry,
        LeaderboardSign
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
            TogglableButtonsContainer.addChild(closeModalButton)
            TogglableMainContainer.addChild(Leaderboard)
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

    showLeaderboard.onChange(showLeaderboard => {
        handleLeaderboardToggle(showLeaderboard)
    }, true)

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
