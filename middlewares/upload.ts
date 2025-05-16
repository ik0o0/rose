import multer from "multer"
import * as path from "path"

const storage = multer.diskStorage({
    destination: (req: Express.Request, file: Express.Multer.File, cb) => {
        cb(null, process.env.UPLOAD_DIR || "/var/data")
    },
    filename: (req: Express.Request, file: Express.Multer.File, cb) => {
        const ext = path.extname(file.originalname)
        const baseName = path.basename(file.originalname, ext)
        const safeName = baseName.replace(/\s+/g, "_")
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, `${safeName}-${uniqueSuffix}${ext}`)
    },
})

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(
            new Error(
                "Invalid file type. Only images and documents are allowed.",
            ),
        )
    }

    cb(null, true)
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
})
