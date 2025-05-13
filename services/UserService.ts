import { validate } from "class-validator";
import { AppDataSource } from "../datasource/datasource";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import type { StringValue } from "ms"

export class UserService {

    private userRepository = AppDataSource.getRepository(User)

    async findAll(): Promise<User[]> {
        return this.userRepository.find()
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id: id },
            select: ["id", "username", "createdAt", "updatedAt"]
        })
    }

    async createUser(username: string, password: string): Promise<User> {
        const user = new User()
        user.username = username
        user.password = password

        const errors = await validate(user)
        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.map(e => Object.values(e.constraints || {}).join(', ')).join(', ')}`)
        }

        return this.userRepository.save(user)
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOneBy({ username: username })
    }

    async verifyPassword(user: User, plainPassword: string): Promise <boolean> {
        return bcrypt.compare(plainPassword, user.password)
    }

    generateAccessToken(payload: object, token: string, time: StringValue) {
        return jwt.sign(payload, token, { expiresIn: time })
    }
}
