# kaiju

This [repo](https://github.com/kaijucards/kaiju) is the primary repository for the Kaiju Cards NFT game.

## Install and run

TODO

## Technologies/Tooling

TODO

## Root directories

-   `./github`: github yaml continuous integration (CI) actions which are triggered by new branches, pushes, etc
-   `./vscode`: editor configuration and build/debug tasks
-   `client/`: **(package)** code to make the UI that runs in the browser
-   `crypto/-server`: **(package)** micro-server to separate chain-facing actions from the main server
-   `db/`: **(package)** database configuration
-   `patches/`: holds little code changes that aren't worth keeping on a branch, and cause problems living in the codebase
-   `scripts/`: bash and node scripts for one-off actions (such as image resizing) and complex builds
-   `server/`: **(package)** the primary server for Kaiju Cards. Interfaces between `client/`, `crypto-server/`, and `db/`
-   `shared/`: Typescript type files that are shared between `client/` and `server/`
-   `tests/`: Some unorganized testing scripts

### Root files

-   `.eslintrc.json`: eslint formatter/linter configuration
-   `.gitattributes`: just has a snippet for ignoring lines
-   `.gitignore`: patterns for git to ignore from version control
-   `.prettierignore`: patterns to exclude from prettier formatting
-   `.prettierrc.json`: prettier formatting settings
-   `arkit.json`: config for arkit, which makes a graph of imports/exports in the package
-   `package.json`: js dependencies and scripts; child packages can use dependencies from here
-   `pnpm-lock.yaml`: automatically generated more-precise dependency list. **We use pnpm for everything!**
-   `README.md`: this file

## Structure

-   root types:
    -   rulebook
        gameState (hydrated)
-   collections:
    -   rulebook (singleton)
        gameStates (one for each user)
-   Actions server:
    ```
    doAction(action) // updates gameState for user
    ```
-   client update example:
    ```
    // gameState comes direct from db, not through Actions server
    gameState.key.on('update', updateUI())
    ```
-   server update example:
    ```
    npcMove() {
        db.setInGameState('health', -10)
        // event emission is implicit
    }
    ```
