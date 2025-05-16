import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import { initializeDatabase } from "./datasource/datasource"
import { UserController } from "./controllers/UserController"
import { FileController } from "./controllers/FileController"
import { authMiddleware } from "./middlewares/auth"
import { upload } from "./middlewares/upload"

async function bootstrap() {
    await initializeDatabase()

    const app = express()
    const PORT = process.env.PORT
    const HOST = process.env.HOST
    const INT_PORT = parseInt(PORT!)
    const CORS_ORIGIN = process.env.CORS_ORIGIN

    app.use(cors({ origin: CORS_ORIGIN }))

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    const userController = new UserController()
    const fileController = new FileController()

    // User endpoints
    app.post("/register", userController.register)
    app.post("/login", userController.login)
    app.get("/profile", authMiddleware, userController.profile)

    // Metadatas file endpoints
    app.get("/infos/files", authMiddleware, fileController.getAllMetadatas)
    app.get("/infos/files/:id", authMiddleware, fileController.getDatasById)

    // File endpoints
    app.get("/files/:id", authMiddleware, fileController.getFileById)
    app.post(
        "/upload",
        authMiddleware,
        upload.single("file"),
        fileController.uploadFile,
    )

    app.listen(INT_PORT, HOST!, () => {
        console.log(`Listening on http://${HOST}:${PORT}`)
    })
}

bootstrap().catch((err) => {
    console.error("Error when bootstraping the application: ", err)
})
