import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserOrgBranch } from "./user-organisation-branch.entity";
import { Organisation } from "./organisation.entity";


@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn({ name: "role_id" })
    roleId!: number;

    @Column({ name: "role_name" })
    roleName!: string;

    @Column({ name: "created_by", type: "varchar", nullable: true })
    createdBy!: string | null;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @Column({ name: "modified_by", type: "varchar", nullable: true })
    modifiedBy!: string | null;

    @UpdateDateColumn({ name: "modified_at" })
    modifiedAt!: Date;

    @Column({ name: "d_flag", default: false })
    dFlag!: boolean;

    @ManyToOne(() => Organisation, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "org_id" })
    organisation!: Organisation;

    @OneToMany(
        () => UserOrgBranch,
        uob => uob.role
    )
    userOrgBranches!: UserOrgBranch[];

}   