import { Route } from './types'

export default ((req, res) => {
    const q = req.query
    const errMessage = (k: string) => `missing required parameter "${k}"`
    if (q?.x == null)
        return res.json({ sucess: false, message: errMessage('x') })
    if (q?.y == null)
        return res.json({ sucess: false, message: errMessage('y') })
    return res.json({
        success: true,
        message: Number(q.x) + Number(q.y)
    })
}) as Route
