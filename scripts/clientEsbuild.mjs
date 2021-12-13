import { build as esbuild } from 'esbuild'
import cssModulesPlugin from 'esbuild-css-modules-plugin'
import alias from 'esbuild-plugin-alias'
import { cpSync, mkdirSync, rmSync } from 'fs'
import { makeBuildInfo } from './makeBuildInfo.mjs'

const buildDir = 'build'
const publicDir = 'client/public_'

const args = process.argv.slice(2)
const shouldWatch = args[0] === 'watch'

console.log('substitutions:', makeSubstitutions())

function makeSubstitutions() {
    return {
        ...makeBuildInfo('CLIENT_'),
        'global': 'window',
    }
}

build()

function build() {
    rmSync(buildDir, { 'recursive': true, force: true })
    mkdirSync(buildDir)
    cpSync(publicDir, buildDir, { recursive: true })
    esbuild({
            minify: true, //!isDevelopment,
            sourcemap: true, //isDevelopment,
            entryPoints: ['client/index.tsx'],
            jsxFactory: 'h',
            jsxFragment: 'Fragment',
            bundle: true,
            outfile: buildDir + '/out.js',
            target: 'es6',
            loader: {
                '.ts': 'ts',
                '.tsx': 'tsx',
                '.svg': 'dataurl',
                '.css': 'css',
                '.png': 'file',
                '.jpg': 'file',
                '.mp4': 'file',
                '.webm': 'file',
                '.ttf': 'file',
                '.atlas': 'file',
                '.json': 'file',
            },
            define: makeSubstitutions(),
            watch: shouldWatch && {
                onRebuild(_error, result) {
                    console.log(`${time()}: rebuild succeeded`)
                    // result.stop()
                    // build()
                }
            },
            plugins: [
                cssModulesPlugin(),
                alias({
                    'react': `${process.env.PWD}/node_modules/preact/compat/dist/compat.js`,
                    'react-dom': `${process.env.PWD}/node_modules/preact/compat/dist/compat.js`,
                })
            ]

        })
        .then(() => { console.log(`${time()}: build succeeded`) })
        .catch((err) => { console.error(err) })
}

function time() {
    return new Date().toLocaleTimeString()
}
