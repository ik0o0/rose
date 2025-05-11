import { FileService } from "../services/FileService";
import type { Request, Response } from "express";
import { File } from "../entities/File";
import { existsSync } from "fs"

export class FileController {

    private fileService = new FileService()

    getAllMetadatas = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id
            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized access, you must be authenticated."
                })
            }

            const files: File[] = await this.fileService.findAllMetadatas(userId)

            return res.status(200).json(files)
        } catch (err: any) {
            return res.status(500).json({
                message: "Error when getting metadatas files.",
                error: err.message
            })
        }
    }

    getDatasById = async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            const integerId: number = parseInt(id!)
            const userId = req.user.id

            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized access, you must be authenticated."
                })
            }
            
            const file: File | null = await this.fileService.findDatasById(integerId, userId)
            if (!file) {
                return res.status(404).json({
                    message: "File not found."
                })
            }

            return res.status(200).json(file)
        } catch (err: any) {
            return res.status(500).json({
                message: "Error when getting metadatas of a file.",
                error: err.message
            })
        }
    }

    getFileById = async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            const integerId: number = parseInt(id!)
            const userId = req.user.id

            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized access, you must be authenticated."
                })
            }

            const fileMetadata: File | null = await this.fileService.findDatasById(integerId, userId)
            if (!fileMetadata) {
                return res.status(404).json({
                    message: "File not found."
                })
            }

            const path = fileMetadata.path
            if (!existsSync(path)) {
                return res.status(404).json({
                    message: "File not found on the disk."
                })
            }

            return res.status(200).sendFile(path)
        } catch (err: any) {
            return res.status(500).json({
                message: "Error when getting a file.",
                error: err.message
            })
        }
    }

    uploadFile = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id
            if (!userId) {
                return res.status(401).json({
                    message: "Access unauthorized (you must be authenticated)."
                })
            }

            if (!req.file) {
                return res.status(400).json({
                    message: "No file uploaded."
                })
            }

            const file = await this.fileService.createFile(
                req.file.path,
                req.file.filename,
                req.file.mimetype,
                req.file.size,
                userId)
        
            return res.status(200).json({
                message: "File uploaded with success.",
                file: file
            })
        } catch (err: any) {
            return res.status(400).json({
                message: "Error when uploading the file.",
                error: err.message
            })
        }
    }
}
