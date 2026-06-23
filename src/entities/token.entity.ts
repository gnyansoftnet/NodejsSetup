import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";


export enum TokenType {
    BEARER = "BEARER",
    REFRESH = "REFRESH",
    RESET = "RESET"
}


@Entity("tokens")
export class Token {
    @PrimaryGeneratedColumn()
    tokenId!: number;

    @Column({
        type: "text",
        nullable: false
    })
    token!: string;

    @Column({
        type: "enum",
        enum: TokenType,
        default: TokenType.BEARER
    })
    tokenType!: TokenType;

    @Column({ default: false })
    revoked!: boolean;

    @Column({ default: false })
    expired!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    modifiedAt!: Date;

    @ManyToOne(() => User, (user) => user.tokens, {
        nullable:false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user!: User;
}