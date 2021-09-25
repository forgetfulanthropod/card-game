const esbuild = require('esbuild')
const fs = require('fs')
const { spawn } = require("child_process")
const { copyFolderRecursiveSync } = require('./copy')
const envFile = require("dotenv").config()
const cssModulesPlugin = require('esbuild-css-modules-plugin')

const buildDir = "build"
const publicDir = "public"

const args = process.argv.slice(2)
const shouldWatch = args.length === 1 && args[0] === 'watch'
const shouldLint = envFile?.parsed?.ESBUILD_SHOULD_LINT === 'yes'
console.log({ shouldWatch, shouldLint })

const isDevelopment = envFile?.parsed?.ESBUILD_NODE_ENV === "development"
const envObj = {
    "process.env.NODE_ENV": `"${isDevelopment ? 'development' : "production"}"`
}
console.log(envObj)

main()

async function main() {
    fs.rmSync(buildDir, { "recursive": true, force: true })
    fs.mkdirSync(buildDir)
    copyFolderRecursiveSync(publicDir, buildDir, makeSubdir = false)
    esbuild.build({
        minify: !isDevelopment,
        sourcemap: isDevelopment,
        entryPoints: ['src/index.tsx'],
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
        },
        define: envObj,
        watch: !shouldWatch ? null : {
            onRebuild(error, result) {
                if (error) {
                    console.error(`ERROR watch at ${new Date()} failed:`, error)
                } else {
                    console.log(`watch build at ${new Date()} succeeded:`, result)
                    if (shouldLint) {
                        console.log("linting...")
                        spawn('npm', ['run', 'lint'], { stdio: 'inherit' })
                    }
                }
            }
        },
        plugins: [
            cssModulesPlugin()
        ]

    })
        .then(() => {
            console.log("built at " + new Date())
            if (shouldLint) {
                console.log("linting...")
                spawn('npm', ['run', 'lint'], { stdio: 'inherit' })
            }
        })
        .catch((err) => { console.error(err) })
}
