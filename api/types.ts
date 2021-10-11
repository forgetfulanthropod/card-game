import { VercelRequest, VercelResponse } from "@vercel/node"
export type Route = (req: VercelRequest, res: VercelResponse) => void
