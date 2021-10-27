# kaiju
kaiju

## Directories

- `.vscode`: editor configuration and build/debug tasks
- `action`: server code
- `client`: browser code
- `public`: just minimal `favicon.png` and `index.html`
- `tests`: unstructured test files

### Root files

- `.eslintrc.json`: eslint formatter/linter configuration
- `.gitattributes`: just has a snippet for ignoring lines
- `.ignorecommits.json`: set of commits to ignore for deep blaming
- `README.md`: this file
- `example.env`: example `.env` file. `.env` has build settings for the client, used by scripts/esbuild.js.
- `package.json`: dependencies and scripts
- `tsconfig.json`: typescript configuration

## Structure

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
