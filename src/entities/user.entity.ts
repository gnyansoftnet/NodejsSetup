import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Token } from "./token.entity";
import { UserStatus } from "../constants/user-status.enum";
import { UserOrgBranchRole } from "./user-org-branch-role.entity";


@Entity("users")
export class User {

    @PrimaryGeneratedColumn({ name: "user_id" })
    userId!: number;

    @Column({ name: "user_name" })
    userName!: string;

    @Column({ name: "password" })
    password!: string;

    @Column({ name: "user_code" })
    userCode!: string;

    @Column({ default: UserStatus.Active, type: "enum", enum: UserStatus, name: "status" })
    status!: string

    @Column({ name: "full_name", type: "varchar", nullable: true })
    fullName!: string | null;

    @Column({ name: "email", type: "varchar", nullable: true })
    email!: string | null;

    @Column({ name: "phone_number", type: "varchar", nullable: true })
    phoneNumber!: string | null;

    @Column({ name: "profile_poic", type: "varchar", nullable: true })
    profilePic!: string | null;

    @Column({ name: "DOB", type: "date", nullable: true })
    DOB!: Date | null;

    @Column({ name: "created_by", type: "varchar", nullable: true })
    createdBy!: string | null;

    @CreateDateColumn({ name: "created_date" })
    createdDate!: Date;

    @Column({ name: "modified_by", type: "varchar", nullable: true })
    modifiedBy!: string | null;

    @UpdateDateColumn({ name: "modified_date" })
    modifiedDate!: Date;

    @Column({ name: "dFlag", default: false })
    dFlag!: boolean


    @OneToMany(() => Token, (token) => token.user)
    tokens!: Token[];

    @OneToMany(
        () => UserOrgBranchRole,
        uob => uob.user
    )
    userOrgBranches!: UserOrgBranchRole[];

}