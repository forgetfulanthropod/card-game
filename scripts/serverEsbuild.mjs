import { build as esbuild } from 'esbuild'
import { makeBuildInfo } from './makeBuildInfo.mjs'
const args = process.argv.slice(2)
const shouldWatch = args.length === 1 && args[0] === 'watch'
console.log({ shouldWatch })
const envObj = makeBuildInfo('SERVER_')
console.log('build environment:', envObj)

// const parentDir = process.env.PWD.split('/').at(-1)
// if (parentDir !== 'server') throw Error("must be run from directory 'server'")

build()

function build() {
    esbuild({
        entryPoints: ['server/index.ts'],
        bundle: true,
        platform: 'node',
        keepNames: true,
        outfile: 'builds/server.js',
        sourcemap: true,
        allowOverwrite: true,
        tsconfig: 'server/tsconfig.json',
        define: makeBuildInfo('SERVER_'),
        watch: shouldWatch && {
            onRebuild(error, result) {
                if (error) {
                    console.error('rebuild error:', error)
                }
                console.log('rebuilt. stopping old build.')
                result.stop()
                console.log('running another build.')
                build()
            },
        },
    })
        .then(() => {
            console.log(`${time()}: build succeeded`)
        })
        .catch(err => {
            console.error(err)
        })
}

function time() {
    return new Date().toLocaleTimeString()
}
