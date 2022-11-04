import { build as esbuild } from 'esbuild'

import cssModulesPlugin from 'esbuild-css-modules-plugin'
import postCssPlugin from 'esbuild-style-plugin'
import tailwindPlugin from 'tailwindcss'
import autoprefixerPlugin from 'autoprefixer'
import alias from 'esbuild-plugin-alias'
import { rmSync } from 'fs'
import { fileURLToPath } from 'url'
import { makeBuildInfo } from './makeBuildInfo.mjs'

const password = 'dailyship'
const buildDir = 'public/'
const entryPoint = 'client/index.tsx'
const outFile = `${buildDir}/${password}.js`

const args = process.argv.slice(2)
const shouldWatchArgv = args[0] === 'watch'

const isProduction = process.env.production === 'yes'

console.log('process.env.PWD:', process.env.PWD)

console.log('substitutions:', makeSubstitutions())

function makeSubstitutions() {
    return {
        ...makeBuildInfo('CLIENT_'),
        global: 'window',
    }
}

if (fileURLToPath(import.meta.url) === process.argv[1]) buildClient()

export function buildClient(shouldWatch = shouldWatchArgv) {
    console.log('BUILDING')
    rmSync(outFile, { recursive: true, force: true })
    rmSync(outFile + '.map', { recursive: true, force: true })
    esbuild({
        minify: isProduction, //!isDevelopment,
        sourcemap: !isProduction, //isDevelopment,
        keepNames: !isProduction,
        entryPoints: [entryPoint],
        inject: ['client/config/preact-shim.js'],
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        bundle: true,
        outfile: outFile,
        target: 'es6',
        loader: {
            '.ts': 'ts',
            '.tsx': 'tsx',
            '.svg': 'dataurl',
            '.css': 'css',
            // '.png': 'file',
            // '.webp': 'file',
            // '.jpg': 'file',
            // '.mp4': 'file',
            // '.webm': 'file',
            // '.ttf': 'file',
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
            postCssPlugin({ postcss: {
                plugins: [tailwindPlugin, autoprefixerPlugin]
            }}),
            alias({
                react: `${process.env.PWD}/node_modules/preact/compat/dist/compat.js`,
                'react-dom': `${process.env.PWD}/node_modules/preact/compat/dist/compat.js`,
            }),
        ],
    })
        .then(() => console.log(`${time()}: client build succeeded`))
        .catch(err => console.error('CLIENT BUILD FAILED:', err))
}

function time() {
    return new Date().toLocaleTimeString()
}
