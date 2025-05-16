import { FileService } from "../services/FileService"
import type { Request, Response } from "express"
import { File } from "../entities/File"
import { existsSync } from "fs"

export class FileController {
    
    private fileService = new FileService()

    async getAllMetadatas(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user.id
            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized access, you must be authenticated.",
                })
                return
            }

            const files: File[] =
                await this.fileService.findAllMetadatas(userId)

            res.status(200).json(files)
            return
        } catch (err: any) {
            res.status(500).json({
                message: "Error when getting metadatas files.",
                error: err.message,
            })
            return
        }
    }

    async getDatasById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const integerId: number = parseInt(id!)
            const userId = req.user.id

            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized access, you must be authenticated.",
                })
                return
            }

            const file: File | null =
                await this.fileService.findDatasById(integerId, userId,)
            
            if (!file) {
                res.status(404).json({
                    message: "File not found.",
                })
                return
            }

            res.status(200).json(file)
            return
        } catch (err: any) {
            res.status(500).json({
                message: "Error when getting metadatas of a file.",
                error: err.message,
            })
            return
        }
    }

    async getFileById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const integerId: number = parseInt(id!)
            const userId = req.user.id

            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized access, you must be authenticated.",
                })
                return
            }

            const fileMetadata: File | null =
                await this.fileService.findDatasById(integerId, userId)

            if (!fileMetadata) {
                res.status(404).json({
                    message: "File not found.",
                })
                return
            }

            const path = fileMetadata.path
            if (!existsSync(path)) {
                res.status(404).json({
                    message: "File not found on the disk.",
                })
                return
            }

            res.status(200).sendFile(path)
            return
        } catch (err: any) {
            res.status(500).json({
                message: "Error when getting a file.",
                error: err.message,
            })
            return
        }
    }

    async uploadFile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user.id
            if (!userId) {
                res.status(401).json({
                    message: "Access unauthorized (you must be authenticated).",
                })
                return
            }

            if (!req.file) {
                res.status(400).json({
                    message: "No file uploaded.",
                })
                return
            }

            const file = await this.fileService.createFile(
                req.file.path,
                req.file.filename,
                req.file.mimetype,
                req.file.size,
                userId,
            )

            res.status(200).json({
                message: "File uploaded with success.",
                file: file,
            })
            return
        } catch (err: any) {
            res.status(400).json({
                message: "Error when uploading the file.",
                error: err.message,
            })
            return
        }
    }
}
