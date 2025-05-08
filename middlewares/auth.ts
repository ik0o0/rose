import dotenv from "dotenv"
dotenv.config()

import type { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken"

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            message: "Internal server error (environnement error), please contact the system administrator."
        })
    }

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Access unauthorized."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token."
        })
    }
}
