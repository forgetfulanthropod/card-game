**You can test functions in an interactive shell with `npm run shell`.**
For example, use `square.get('?n=10')` for `onRequest` or `square({n:10})` for `onCall`.

-   This folder, `/actions`, is for server functions.
-   We could make this a second build target & build source in the parent tsconfig etc but there's not much point. Better to leave it as a separate package.
-   **You need to remember to re-build this folder when you change it.** You can `npm run watch` to rebuild as you go.
-   **The actual data for the rulebook is in src/rulebook.** It is almost exclusively constants following the types from `/shared/rulebook`. Should keep it that way if we can.
