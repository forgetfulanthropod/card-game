import { build as _build } from 'esbuild'
import { makeBuildInfo } from './makeBuildInfo.js'
const args = process.argv.slice(2)
const shouldWatch = args.length === 1 && args[0] === 'watch'

const envObj = makeBuildInfo()
console.log("build environment:", envObj)

build()

function build() {
    _build({
        // --bundle --platform=node --keep-names --outfile=../server-build/index.js --sourcemap --allow-overwrite  --tsconfig=tsconfig.json
        bundle: true,
        platform: 'node',
        keepNames: true,
        outfile: '../server-build/index.js',
        sourcemap: true,
        allowOverwrite: true,
        tsconfig: './tsconfig.json',
        define: makeBuildInfo(),
        watch: shouldWatch && {
            onRebuild(_error, result) {
                result.stop()
                build()
            }
        },
    })
        .then(() => { console.log(`${time()}: build succeeded`) })
        .catch((err) => { console.error(err) })
}

function time() {
    return new Date().toLocaleTimeString()
}
