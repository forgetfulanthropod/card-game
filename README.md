# kaiju
kaiju

## structure

- root types:
    -  rulebook
    gameState (hydrated)
- collections:
    -  rulebook (singleton)
    gameStates (one for each user)
- Actions server:
    ```
    doAction(action) // updates gameState for user
    ```
- client update example:
    ```
    // gameState comes direct from db, not through Actions server
    gameState.key.on('update', updateUI())
    ```
- server update example:
    ```
    npcMove() {
        db.setInGameState('health', -10)
        // event emission is implicit
    }
    ```
