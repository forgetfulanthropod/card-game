import { Route } from './types'

export default ((req, res) => {
    return res.json({ message: "Hello World" })
}) as Route
