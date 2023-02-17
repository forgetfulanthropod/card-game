import { build as esbuild } from 'esbuild'

import cssModulesPlugin from 'esbuild-css-modules-plugin'
import postCssPlugin from 'esbuild-style-plugin'
import tailwindPlugin from 'tailwindcss'
import autoprefixerPlugin from 'autoprefixer'
import alias from 'esbuild-plugin-alias'
import { rmSync } from 'fs'
import { fileURLToPath } from 'url'

import { makeBuildInfo } from './makeBuildInfo.mjs'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { config as loadDotEnv } from 'dotenv'

loadDotEnv()
const password = process.env.CLIENT_PASSWORD ?? 'dailyship'
const buildDir = 'public/'
const entryPoint = 'client/index.tsx'
const outFile = `${buildDir}/${password}.js`

const args = process.argv.slice(2)
const shouldWatchArgv = args[0] === 'watch'

console.log('process.env.PWD:', process.env.PWD)

console.log('substitutions:', makeSubstitutions())

const REQUIRED_CLIENT_ENV_KEYS =
    ['WALLET_GATED',
     'RPC_URL',
     'GAME_IS_LIVE',
     'IS_PRODUCTION',
     'CLIENT_PASSWORD'
    ]

export const checkEnv = (envKeys) => {
    console.log('Checking ENV...')
    for (let key of envKeys) {
        const value = process.env[key]
        if (value === undefined) {
            console.error(key, 'IS MISSING IN .ENV')
            process.exit(1)
        }
    }
    console.log('.env contains all keys: ', envKeys)
}

function makeSubstitutions() {
    // loadDotEnv();
    const walletGated = process.env.WALLET_GATED === 'true'
    const gameIsLive = process.env.GAME_IS_LIVE === 'true'
    const isProduction = process.env.IS_PRODUCTION === 'true'
    const rpcUrl = `"${process.env.RPC_URL}"`
    return {
        ...makeBuildInfo('CLIENT_'),
        ['process.env.WALLET_GATED']: walletGated, // true in prod
        ['process.env.GAME_IS_LIVE']: gameIsLive,
        ['process.env.IS_PRODUCTION']: isProduction,
        ['process.env.RPC_URL']: rpcUrl,
        global: 'window',
    }
}

if (fileURLToPath(import.meta.url) === process.argv[1]) buildClient()

export function buildClient(shouldWatch = shouldWatchArgv) {
    console.log('BUILDING CLIENT')
    loadDotEnv();

    checkEnv(REQUIRED_CLIENT_ENV_KEYS)
    const isProduction = process.env.IS_PRODUCTION === 'true'
    rmSync(outFile, { recursive: true, force: true })
    rmSync(outFile + '.map', { recursive: true, force: true })
    esbuild({
        minify: isProduction, //!isDevelopment,
        sourcemap: !isProduction, //isDevelopment,
        keepNames: !isProduction,
        entryPoints: [entryPoint],
        // external: ['@solana/wallet-adapter-react-ui/styles.css'],
        // inject: ['client/config/preact-shim.js'],
        // jsxFactory: 'h',
        // jsxFragment: 'Fragment',
        // jsxImportSource: 'preact',
        // jsx: 'transform',
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
        watch: shouldWatch && {
            onRebuild(err, result) {
                if (err) {
                    console.error(`${time()}: CLIENT REBUILD FAILED`, err)
                } else {
                    console.log(`${time()}: client rebuilt`)
                }
                // result.stop()
                // build()
            },
        },
        plugins: [
            cssModulesPlugin(),
            NodeModulesPolyfillPlugin(),
            NodeGlobalsPolyfillPlugin({
                process: true,
                buffer: true
            }),
            postCssPlugin({ postcss: {
                plugins: [tailwindPlugin, autoprefixerPlugin]
            }}),
            // alias({
            //     'react': `${process.env.PWD}/node_modules/preact/compat/dist/compat.js`,
            //     'react-dom': `${process.env.PWD}/node_modules/preact/compat/dist/compat.js`,
            // }),
        ],
        logLevel: 'error',
    })
        .then(() => console.log(`${time()}: client build succeeded`))
        .catch(err => console.error('CLIENT BUILD FAILED:', err))
}

function time() {
    return new Date().toLocaleTimeString()
}
