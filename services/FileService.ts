import dotenv from "dotenv"
dotenv.config()

import { promisify } from "util";
import { AppDataSource } from "../datasource/datasource";
import { File } from "../entities/File";
import * as fs from "fs";
import * as path from "path";
import { validate } from "class-validator";
import { ensureDirectory, getMimeType } from "../utils/file.utils";

const writeFile = promisify(fs.writeFile)

export class FileService {

    private fileRepository = AppDataSource.getRepository(File)
    private readonly uploadDir = process.env.UPLOAD_DIR || "/var/data"

    async findAll(userId: number): Promise<File[]> {
        return this.fileRepository.findBy({ user_id: userId })
    }

    async findById(id: number, userId: number): Promise<File | null> {
        return this.fileRepository.findOneBy({ id: id, user_id: userId})
    }

    async createFile(
        path: string,
        filename: string,
        mimeType: string,
        size: number,
        userId: number
    ): Promise<File> {
        const file = new File()
        file.path = path
        file.filename = filename
        file.mime_type = mimeType
        file.size = size
        file.user_id = userId

        const errors = await validate(file)
        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.map(e => Object.values(e.constraints || {}).join(', ')).join(', ')}`)
        }

        return this.fileRepository.save(file)
    }
}
