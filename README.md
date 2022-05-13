# kaiju

This [repo](https://github.com/kaijucards/kaiju) is the primary repository for the Kaiju Cards NFT game.

## Pattern language

For more info, see Robert Nystrom's _Game Programming Patterns_ or the Gang of 4's _Design Patterns_.

### Core patterns

-   ~~Flyweight~~ **Table keys**: Keep objects flat and reference nested data using a key in a table.
    -   Suppose a move set is a very large object. Then you can store one move set for each character class and have a character store the name of its own character class. That is a key to the table.
    -   Tables often look like this and we end them in the word `map`:
        ```ts
        const attacksMap = {
            slash: { id: 'slash', displayName: 'Slash Attack', damage: 3 },
            bodySlam: { id: 'bodySlam' displayName: 'Body Slam' damage: 6 },
        }
        ```
-   **Observer**: Listen for changes on data.
    -   Datum or baobab. Suppose component `CheckBox` is a child of component `CheckList`. Instead of passing `onChecked` down as an argument, or back up as a child API, you can have `CheckBox` pass down a **datum** `checked: boolean` which the child calls `.set(true)` on and the parent calls e.g. `.onChange(updateTotal)`. This reduces the callbacks passing _between components_ and keeps them more often _within_ components.
    -   The client's entire render system is largely an observer on the game state it receives from the server. **The component tree roughly follows the gamestate tree.**
-   **Components**: Break a large thing into a collection of children.
    -   Universally recognized at this point, each visual object in our game is a component, but GPP shows a useful example I haven't seen before: in large components, you can **split it up by domain**:
    ```ts
    function Character(props: {x, y, isAttacking, ...}) {
        const data = datum(x, y, isAttacking, ...)
        return Container({
            children: [ Display(), Audio(), Input() ]
        })
    }
    ```
-   **Module singleton**: Export `setupX()` and `xMethod()` from a module to enforce singletons and narrow their API.
    ```ts
    const db = new Db()
    let ready = false
    export function setup() {
        if (ready) return
        db.setup()
        ready = true
    }
    export function getUser(id) {
        if (!ready) throw Error('db not ready')
        return db.get('users', id)
    }
    ```
-   **Interpreter**: Use a DSL for designer-created or user-created data.
    -   There's going to be a lot of cards with wild composing effects, and we want to quickly add or remove a bunch, so we have a DSL for the cards. Using `angu` for the interpreter keeps stuff simple. We don't have the performance needs for bytecode since our game is turn based.
-   **State machines**: Pack a collection of values into one value with a transition function.
    -   ~~isLoaded, isStarted, didSucceed~~ -> `state: 'loaded' | 'started' | 'succeeded'` <--- ONE variable!
    -   Possibly the most important pattern. You know it but you may underutilize it. Any time you've got some nested `switch`es or `if`s, you may be able to write much simpler code using a state machine. **The core game logic is a giant state machine** to the extent it's practical. The game is in a state, a user action is taken, and it transitions to a new state. Some diagrams:
        <img src="https://user-images.githubusercontent.com/10591373/168342032-4d7627d9-b315-4b21-a748-9e2d36d550be.jpg" width="200"/>
        <img src="https://user-images.githubusercontent.com/10591373/168342044-ab6f7647-90c5-4ecf-82c0-54220d401ac9.png" width="200"/>
        <img src="https://user-images.githubusercontent.com/10591373/168342061-25b10798-23b3-42f2-b538-9bb679434417.png" width="200"/>

### Less core / not in use

-   **Command**: Make a user action ("play card") or other effect ("lightning orb round") an object with an `.execute(target)` method, instead of doing callbacks or putting code in `applyOrbs(game, orbs)`. The input handler could return a Command stream. Then you can store the commands in an array, the core game loops are simpler, there's a clear sequence of execution, the orbs can come from wherever (less coupling in some ways).
-   **Event Queue**: Asynchronous, buffered, broader version of observer. If a function takes lots of CPU cycles or has limited throughput, e.g. server networking and audio, then you can buffer requests in an event channel and process or discard them as needed. Not using in server rn but would be useful for e.g. preventing double-actions.
-   **Subclass sandbox**: Not using. For when Interpreter is too constrained. If you have some really wild and varied collection of effects, e.g. superpowers that make sounds & graphics & adjust physics etc, then each superpower module can have its imports restricted to exclusively to one superpower-lib module. This prevents the superpowers from getting tightly couple with the entire codebase.
-   **Update method**: If there's a strong notion of time, then instead of having `giantUpdateLoop`, you can do `for object of scene: object.update()`. Pixi mostly does this for us, and pixi offers a shared ticker that components can hook into and unsub from. So we don't use this really. We might use it in the game logic.
-   **Double buffer**: To produce a simultaneous update, you can do `newState = deepClone(oldState) ... modifications ... return newState`. If state is very large, you can save memory by swapping back and forth between two objects.
-   **Prototype**: Make a new thing by copying and modifying a base thing. ()
    -   One narrow but useful use case: Say game has Enemy, Skeleton, and FireSkeleton. A pretty concise pattern looks like this:
    ```ts
    const baseEnemy = {health: 10, ...} as const
    // Could do baseSkeleton = Object.create(baseEnemy) to reduce data duplication but typescript might kill you, and logger & stringify will lose the prototype
    const baseSkeleton = {...baseEnemy, health: baseEnemy.health + 5, name: "skeleton"} as const
    const baseFireSkeleton =  {...baseSkeleton, modifiers: ["fire"]} as const
    export function makeFireSkeleton() {return deepClone(baseFireSkeleton)}
    ```

## Install and run

```
git clone git@github.com:kaijucards/kaiju.git
cd kaiju

# install pnpm:
# curl -fsSL https://get.pnpm.io/install.sh | sh -

pnpm i -r
# can just hit cmd-shift-b in vscode, or
bash run client:build
bash run server:build
bash run server:server
```

## Technologies/Tooling

We're using a decent number of libraries and tools but the big ones are

-   vscode's build system (cmd-shift-b) and eslint & prettier & abracadabra extensions
-   typescript of course
-   client:
    -   pixi.js for graphics
    -   baobab for listening to changes in game state from server
-   server:
    -   express server (for now)
    -   baobab for updating game state
    -   angu for parsing the cards' DSL
    -   socket.io for pushing data to client

## Root directories

-   `./github`: github yaml continuous integration (CI) actions which are triggered by new branches, pushes, etc
-   `./vscode`: editor configuration and build/debug tasks
-   `client/`: **(package)** code to make the UI that runs in the browser
-   `patches/`: holds little code changes that aren't worth keeping on a branch, and cause problems living in the codebase
-   `scripts/`: bash and node scripts for one-off actions (such as image resizing) and complex builds
-   `server/`: **(package)** the primary server for Kaiju Cards. Interfaces between `client/`, `crypto-server/`, and `db/`
-   `shared/`: Typescript type files that are shared between `client/` and `server/`

### Root files

-   **run** has all the scripts. e.g. `bash run client:build`
-   `.eslintrc.json`: eslint formatter/linter configuration
-   `.gitignore`: patterns for git to ignore from version control
-   `.prettierignore`: patterns to exclude from prettier formatting
-   `.prettierrc.json`: prettier formatting settings
-   `arkit.json`: config for arkit, which makes a graph of imports/exports in the package
-   `package.json`: js dependencies
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
