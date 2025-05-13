import dotenv from "dotenv"
dotenv.config()

import { UserService } from "../services/UserService"
import type { Request, Response } from "express"

export class UserController {

    private userService = new UserService()

    register = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body

            const user = await this.userService.createUser(username, password)

            return res.status(201).json({
                message: "User created with success.",
                user: { id: user.id, username: user.username }
            })
        } catch (err: any) {
            return res.status(400).json({
                message: "Error when creating the user.",
                error: err.message
            })
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body

            const user = await this.userService.findByUsername(username)
            if (!user) {
                return res.status(404).json({
                    message: "A user with this username cannot be found."
                })
            }

            const isPasswordValid = await this.userService.verifyPassword(user, password)
            if (!isPasswordValid) {
                return res.status(401).json({
                    message: "Password incorrect"
                })
            }

            if (!process.env.JWT_SECRET) {
                return res.status(500).json({
                    message: "Internal server error (environnement error), please contact the system administrator."
                })
            }

            const token = this.userService.generateAccessToken({ id: user.id, username }, process.env.JWT_SECRET, "7d")

            return res.status(200).json({
                message: "Successfully logged in.",
                user: { id: user.id, username: user.username, token: token }
            })
        } catch (err: any) {
            return res.status(500).json({
                message: "Error when logging.",
                error: err.message
            })
        }
    }

    profile = async (req: Request, res: Response) => {
        try {
            const userId: number = req.user.id
            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized access, you must be authenticated."
                })
            }

            const user = await this.userService.findById(userId)
            if (!user) {
                return res.status(404).json({
                    message: "User not found."
                })
            }

            return res.status(200).json(user)
        } catch (err: any) {
            return res.status(500).json({
                message: "Error when getting the profile.",
                error: err.message
            })
        }
    }
}
