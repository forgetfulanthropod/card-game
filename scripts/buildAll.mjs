import { buildClient } from './clientEsbuild.mjs'
import { buildServer } from './serverEsbuild.mjs'

const shouldWatch = process.argv[2] === 'watch'

buildClient(shouldWatch)
buildServer(shouldWatch)
