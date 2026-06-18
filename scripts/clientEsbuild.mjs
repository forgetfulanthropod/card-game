import { build as esbuild } from 'esbuild'

import cssModulesPlugin from 'esbuild-css-modules-plugin'
import postCssPlugin from 'esbuild-style-plugin'
import tailwindPlugin from 'tailwindcss'
import autoprefixerPlugin from 'autoprefixer'
// import alias from 'esbuild-plugin-alias'  // not used in config
import { rmSync } from 'fs'
import { fileURLToPath } from 'url'

import { checkEnv, makeBuildInfo } from './makeBuildInfo.mjs'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

/*
  Build hack notes (for local dev compatibility):
  - Tailwind/global.css is NOT imported in JS (commented in App.tsx) to avoid esbuild-style-plugin crash.
    Instead, use separate `npm run styles:build` (or in client:build) which runs tailwind CLI -> public/styles.css
    linked from public/index.html.
  - postCssPlugin + tailwind still configured here (may be noop now).
  - Polyfills disabled (commented) due to virtual file resolution errors in this env.
  - Watch mode disabled (commented) for esbuild compat; use rebuild or `bash run client:build-watch` (limited).
  - Dupe keepNames kept for compat.
  - Always clean old outputs before build.
  - Run via `bash run dev` which orchestrates: styles+client build, server build, then node server.
*/
const bundleName = 'dailyship'
const buildDir = 'public/'
const entryPoint = 'client/index.tsx'
const outFile = `${buildDir}/${bundleName}.js`

const args = process.argv.slice(2)
const shouldWatchArgv = args[0] === 'watch'

function makeSubstitutions() {
    const gameIsLive = (process.env.GAME_IS_LIVE ?? 'false') === 'true'
    const isProduction = (process.env.IS_PRODUCTION ?? 'false') === 'true'
    const isLocal = (process.env.IS_LOCAL ?? 'true') === 'true'
    return {
        ...makeBuildInfo('CLIENT_'),
        ['process.env.GAME_IS_LIVE']: JSON.stringify(gameIsLive),
        ['process.env.IS_PRODUCTION']: JSON.stringify(isProduction),
        ['process.env.IS_LOCAL']: JSON.stringify(isLocal),
        global: 'window',
    }
}

if (fileURLToPath(import.meta.url) === process.argv[1]) buildClient()

export function buildClient(shouldWatch = shouldWatchArgv) {
    console.log('BUILDING CLIENT')
    // no dotenv, no .env check (cleared)
    const isProduction = (process.env.IS_PRODUCTION ?? 'false') === 'true'
    rmSync(outFile, { recursive: true, force: true })
    rmSync(outFile + '.map', { recursive: true, force: true })
    esbuild({
        minify: isProduction, //!isDevelopment,
        sourcemap: !isProduction, //isDevelopment,
        keepNames: !isProduction,
        entryPoints: [entryPoint],
        keepNames: true,
        bundle: true,
        outfile: outFile,
        target: 'es6',
        loader: {
            '.ts': 'ts',
            '.tsx': 'tsx',
            '.svg': 'dataurl',
            '.css': 'css',
            '.map': 'json',
            '.js': 'js',
            '.ttf': 'file',
            // '.png': 'file',
            // '.webp': 'file',
            // '.jpg': 'file',
            // '.mp4': 'file',
            // '.webm': 'file',
            // '.atlas': 'file',
            // '.json': 'file',
        },
        define: makeSubstitutions(),
        // watch stripped for newer esbuild compat (single build)
        // watch: shouldWatch && { ... },
        plugins: [
            cssModulesPlugin(),
            // Polyfill plugins disabled: they produce virtual file resolution errors with current esbuild
            // NodeModulesPolyfillPlugin(),
            // NodeGlobalsPolyfillPlugin({ process: true, buffer: true }),
            postCssPlugin({ postcss: {
                plugins: [tailwindPlugin, autoprefixerPlugin]
            }}),
        ],
        logLevel: 'error',
        // Do NOT externalize browser deps like fast-equals / deep-diff.
        // They must be bundled; external caused "Dynamic require ... not supported" at runtime.
        // external: ['deep-diff', 'fast-equals'],
    })
        .then(() => console.log(`${time()}: client build succeeded`))
        .catch(err => console.error('CLIENT BUILD FAILED:', err))
}

function time() {
    return new Date().toLocaleTimeString()
}
