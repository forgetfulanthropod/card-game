const esbuild = require('esbuild')
const fs = require('fs')
const { spawn } = require('child_process')
const { copyFolderRecursiveSync } = require('./copy')
const envFile = require('dotenv').config()
const cssModulesPlugin = require('esbuild-css-modules-plugin')

const buildDir = 'build'
const publicDir = 'public'

const args = process.argv.slice(2)
const shouldWatch = args.length === 1 && args[0] === 'watch'
const shouldLint = envFile?.parsed?.ESBUILD_SHOULD_LINT === 'yes'
console.log({ shouldWatch, shouldLint })

const isDevelopment = envFile?.parsed?.ESBUILD_NODE_ENV === 'development'
const envObj = {
    'process.env.NODE_ENV': `"${isDevelopment ? 'development' : 'production'}"`
}
console.log(envObj)
const alias = require('esbuild-plugin-alias')

// const preactSubs = {
//     '"react"': '"preact/compat"',
//     '"react-dom/test-utils"': '"preact/test-utils"',
//     '"react-dom"': '"preact/compat"',
//     '"react/jsx-runtime"': '"preact/jsx-runtime"'
// }
const substitions = {
    ...envObj,
    "global": "window" // node_modules/baobab/dist/helpers.js:203
    // ...preactSubs,
}

main()

async function main() {
    fs.rmSync(buildDir, { 'recursive': true, force: true })
    fs.mkdirSync(buildDir)
    copyFolderRecursiveSync(publicDir, buildDir, makeSubdir = false)
    esbuild.build({
        minify: false, //!isDevelopment,
        sourcemap: true, //isDevelopment,
        entryPoints: ['client/index.tsx'],
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        inject: ['./client/preact-shim.js'],
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
        },
        define: substitions,
        watch: !shouldWatch ? null : {
            onRebuild(error, result) {
                if (error) {
                    console.error(`!!${time()}: ERROR watch build failed:`, error)
                } else {
                    console.log(`${time}: watch build succeeded:`, result)
                    if (shouldLint) {
                        console.log('linting...')
                        spawn('npm', ['run', 'lint'], { stdio: 'inherit' })
                    }
                }
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
        .then(() => {
            console.log(`${time()}: initial build succeeded`)
            if (shouldLint) {
                console.log('linting...')
                spawn('npm', ['run', 'lint'], { stdio: 'inherit' })
            }
        })
        .catch((err) => { console.error(err) })
}

function time() {
    return new Date().toLocaleTimeString()
}
