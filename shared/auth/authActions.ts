import type { AuthenticatedActions } from 'shared'

const authenticatedActions: AuthenticatedActions = {
    activateOrb: true,
    activateSouvenir: true,
    addCardToDeck: true,
    changeDungeon: true,
    changeScene: true,
    chooseEventResponse: true,
    choosePlushy: true,
    chooseStance: true,
    collectLoot: true,
    discard: true,
    endRun: true,
    endTurn: true,
    exitDungeon: true,
    finishCard: true,
    getCurrentRun: true,
    getFreeCard: true,
    getFreeSouvenir: true,
    getLeaderboard: true,
    loadGameState: true,
    nextRoom: true,
    openEndOfRoom: true,
    openEndOfRun: true,
    placeSelectedCharacters: true,
    playCard: true,
    removeCardForFree: true,
    resetRandomSeed: true,
    rollKaiju: true,
    rulebookAction: true,
    setBattleScene: true,
    setInitialGameState: true,
    setRunId: true,
    prepareRun: true,
    startRun: true,
    setUsername: true,
};

export function isAuthenticatedAction(action: string): action is keyof AuthenticatedActions {
    return action in authenticatedActions
}
