import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    Min
} from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { User } from "./User";

@Entity()
export class File {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        nullable: false,
        unique: true
    })
    @IsNotEmpty({ message: "Path cannot be empty." })
    path!: string

    @Column({
        nullable: false
    })
    @IsNotEmpty({ message: "File name cannot be empty." })
    filename!: string

    @Column({
        nullable: true
    })
    @IsOptional()   
    mime_type!: string

    @Column({
        nullable: true,
        type: "int"
    })
    @IsOptional()
    @IsInt({ message: "The size must be an integer." })
    @Min(0, { message: "The size cannot be negative." })
    size!: number

    @Column({
        nullable: false
    })
    user_id!: number

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
