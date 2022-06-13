// @index('./*', f => `export { ${f.name} } from '${f.path}'`)
export { hello } from './hello'
export { makeNewUser } from './makeNewUser'
export { maybeMakeUser } from './maybeMakeUser'
// @endindex
