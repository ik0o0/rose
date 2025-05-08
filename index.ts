import dotenv from "dotenv"
dotenv.config()

import express from "express"
import { initializeDatabase } from "./datasource/datasource"
import { UserController } from "./controllers/UserController"
import { FileController } from "./controllers/FileController"
import { authMiddleware } from "./middlewares/auth"
import { upload } from "./middlewares/upload"

async function bootstrap() {
    await initializeDatabase()

    const app = express()
    const PORT = process.env.PORT

    app.use(express.json())
    
    const userController = new UserController()
    const fileController = new FileController()

    // User endpoints
    app.post("/register", userController.register)
    app.post("/login", userController.login)

    // File endpoints
    app.get("/files", authMiddleware, fileController.getAllFiles)
    app.get("/files/:id", authMiddleware, fileController.getFileById)
    app.post("/upload", authMiddleware, upload.single("file"), fileController.uploadFile)

    app.listen(PORT, () => {
        console.log(`Listening on http://127.0.0.1:${PORT}`)
    })
}

bootstrap().catch((err) => {
    console.error("Error when bootstraping the application: ", err)
})
