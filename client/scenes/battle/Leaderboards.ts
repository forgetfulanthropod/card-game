import {
    depricatedScoreUpdateFromClient,
    InfoBox,
    ModalBackdrop,
} from '@sharedElements'
import {
    Adjust,
    animateNumberInElement,
    AssetKey,
    clearContainer,
    getShowOnHoverFns,
    getStage,
    loopSong,
    PixiContainer,
    PixiText,
    PixiTexture,
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

const style = {
    fill: 'white',
    fontFamily: 'monoFont',
}

export const LeaderboardContainer = () => {
    const currLeaderboardPage = datum(0)
    const activeTimeToggle = datum<LeaderboardTimeToggle>('daily')
    const scene = getBattleScene()
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
            clearContainer(LeaderboardEntries)
            clearContainer(LeaderboardSelfEntry)

            // change twice to force trigger a refresh on nav arrows if prev page was 0
            currLeaderboardPage.set(1)
            currLeaderboardPage.set(0)
            renderLeaderboardsPage(
                allLeaderboards[newVal],
                currLeaderboardPage.val
            )

            clearContainer(LeaderboardContextMenu)
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

    const LeaderboardEntries = Container({})
    const LeaderboardSelfEntry = Container({})

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

    const renderLeaderboardsPage = (
        sortedLeaderboard: Leaderboard,
        page: number
    ) => {
        clearContainer(LeaderboardEntries)

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

    const changeLeaderboardPage = (direction: 'next' | 'prev') => {
        if (direction === 'prev') {
            if (currLeaderboardPage.val > 0)
                currLeaderboardPage.set(currLeaderboardPage.val - 1)
        } else if (direction === 'next') {
            if (currLeaderboardPage.val < MAX_LEADERBOARD_PAGE - 1)
                currLeaderboardPage.set(currLeaderboardPage.val + 1)
        }
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

    const LeaderboardContextMenu = Container(
        {},
        createTimeToggle('daily'),
        createTimeToggle('weekly'),
        createTimeToggle('allTime')
    )

    const LeaderboardContainer = Container(
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

    return LeaderboardContainer
}
