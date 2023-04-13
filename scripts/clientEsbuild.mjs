import { build as esbuild } from 'esbuild'

import cssModulesPlugin from 'esbuild-css-modules-plugin'
import postCssPlugin from 'esbuild-style-plugin'
import tailwindPlugin from 'tailwindcss'
import autoprefixerPlugin from 'autoprefixer'
import alias from 'esbuild-plugin-alias'
import { rmSync } from 'fs'
import { fileURLToPath } from 'url'

import { checkEnv, makeBuildInfo } from './makeBuildInfo.mjs'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { config as loadDotEnv } from 'dotenv'

const password = process.env.CLIENT_PASSWORD ?? 'dailyship'
const buildDir = 'public/'
const entryPoint = 'client/index.tsx'
const outFile = `${buildDir}/${password}.js`

const args = process.argv.slice(2)
const shouldWatchArgv = args[0] === 'watch'

function makeSubstitutions() {
    const walletGated = process.env.WALLET_GATED === 'true'
    const gameIsLive = process.env.GAME_IS_LIVE === 'true'
    const isProduction = process.env.IS_PRODUCTION === 'true'
    const rpcUrl = `"${process.env.RPC_URL}"`
    const walletConnectId = `"${process.env.WALLET_CONNECT_ID}"`
    return {
        ...makeBuildInfo('CLIENT_'),
        ['process.env.WALLET_GATED']: walletGated, // true in prod
        ['process.env.GAME_IS_LIVE']: gameIsLive,
        ['process.env.IS_PRODUCTION']: isProduction,
        ['process.env.RPC_URL']: rpcUrl,
        ['process.env.WALLET_CONNECT_ID']: walletConnectId,
        global: 'window',
    }
}

if (fileURLToPath(import.meta.url) === process.argv[1]) buildClient()

export function buildClient(shouldWatch = shouldWatchArgv) {
    console.log('BUILDING CLIENT')
    loadDotEnv()
    checkEnv('client')
    const isProduction = process.env.IS_PRODUCTION === 'true'
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
        ],
        logLevel: 'error',
    })
        .then(() => console.log(`${time()}: client build succeeded`))
        .catch(err => console.error('CLIENT BUILD FAILED:', err))
}

function time() {
    return new Date().toLocaleTimeString()
}
