import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {
    IsNotEmpty,
    Length
} from "class-validator";
import * as bcrypt from "bcrypt"

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        unique: true,
        nullable: false,
        length: 50
    })
    @IsNotEmpty({ message: "Username cannot be empty." })
    username!: string

    @Column({
        nullable: false
    })
    @IsNotEmpty({ message: "Password cannot be empty." })
    @Length(6, 100, { message: "The password must be between 6 and 100 caracters." })
    password!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
        }
    }
}
