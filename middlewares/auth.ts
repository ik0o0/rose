import type { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
        res.status(500).json({
            message:
                "Internal server error (environnement error), please contact the system administrator.",
        })
        return
    }

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        res.status(401).json({
            message: "Access unauthorized.",
        })
        return
    }

    try {
        const decoded = jwt.verify(token, jwtSecret)
        req.user = decoded
        next()
    } catch (err) {
        res.status(403).json({
            message: "Invalid token.",
        })
        return
    }
}
