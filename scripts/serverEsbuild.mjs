import { build as esbuild } from 'esbuild'
import { makeBuildInfo } from './makeBuildInfo.mjs'
import { fileURLToPath } from 'url'
import { checkEnv  } from './makeBuildInfo.mjs'
const args = process.argv.slice(2)
const shouldWatchArgv = args.length === 1 && args[0] === 'watch'
const envObj = makeBuildInfo('SERVER_')
console.log('build environment:', envObj)

if (fileURLToPath(import.meta.url) === process.argv[1]) buildServer()

export function buildServer(shouldWatch = shouldWatchArgv) {
    console.log('building server!!')
    checkEnv('server')
    esbuild({
        entryPoints: ['server/index.ts'],
        bundle: true,
        platform: 'node',
        keepNames: true,
        outfile: 'builds/server.js',
        sourcemap: true,
        allowOverwrite: true,
        external: ['classic-level'],
        // tsconfig: 'server/tsconfig.json',
        define: makeBuildInfo('SERVER_'),
        watch: shouldWatch && {
            onRebuild(error, result) {
                if (error) {
                    console.error('SERVER REBUILD ERROR:', error)
                } else {
                    console.log(`${time()}: server rebuilt`)
                }
            },
        },
    })
        .then(() => console.log(`${time()}: server build succeeded`))
        .catch(err => console.error('SERVER BUILD FAILED:', err))
}

function time() {
    return new Date().toLocaleTimeString()
}
