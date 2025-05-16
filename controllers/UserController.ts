import { UserService } from "../services/UserService"
import type { Request, Response } from "express"

export class UserController {

    private userService = new UserService()

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body

            const user = await this.userService.createUser(username, password)

            res.status(201).json({
                message: "User created with success.",
                user: { id: user.id, username: user.username },
            })
            return
        } catch (err: any) {
            res.status(400).json({
                message: "Error when creating the user.",
                error: err.message,
            })
            return
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body

            const user = await this.userService.findByUsername(username)
            if (!user) {
                res.status(404).json({
                    message: "A user with this username cannot be found.",
                })
                return
            }

            const isPasswordValid = await this.userService.verifyPassword(
                user,
                password,
            )
            if (!isPasswordValid) {
                res.status(401).json({
                    message: "Password incorrect",
                })
                return
            }

            const jwtSecret = process.env.JWT_SECRET
            if (!jwtSecret) {
                res.status(500).json({
                    message:
                        "Internal server error (environnement error), please contact the system administrator.",
                })
                return
            }

            const token = this.userService.generateAccessToken(
                { id: user.id, username },
                jwtSecret,
                "7d",
            )

            res.status(200).json({
                message: "Successfully logged in.",
                user: { id: user.id, username: user.username, token: token },
            })
            return
        } catch (err: any) {
            res.status(500).json({
                message: "Error when logging.",
                error: err.message,
            })
            return
        }
    }

    async profile(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = req.user.id
            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized access, you must be authenticated.",
                })
                return
            }

            const user = await this.userService.findById(userId)
            if (!user) {
                res.status(404).json({
                    message: "User not found.",
                })
                return
            }

            res.status(200).json(user)
            return
        } catch (err: any) {
            res.status(500).json({
                message: "Error when getting the profile.",
                error: err.message,
            })
            return
        }
    }
}
