import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Organisation } from "./organisation.entity";
import { UserOrgBranchRole } from "./user-org-branch-role.entity";

@Entity("branches")
export class Branch {

    @PrimaryGeneratedColumn({ name: "branch_id" })
    branchId!: number;

    @Column({ name: "branch_name" })
    branchName!: string;

    @Column({ name: "branch_short_name" })
    branchShortName!: string;

    @Column({ name: "branch_code" })
    branchCode!: string;


    @Column({ name: "created_by", type: "varchar", nullable: true })
    createdBy!: string | null;

    @CreateDateColumn({ name: "created_date" })
    createdDate!: Date;

    @Column({ name: "modified_by", type: "varchar", nullable: true })
    modifiedBy!: string | null;

    @UpdateDateColumn({ name: "modified_date" })
    modifiedDate!: Date;


    @Column({ name: "dFlag", default: false })
    dFlag!: boolean;

    @ManyToOne(() => Organisation)
    @JoinColumn({ name: "org_id" })
    organisation!: Organisation;

    @OneToMany(
        () => UserOrgBranchRole,
        uob => uob.branch
    )
    userOrgBranches!: UserOrgBranchRole[];

}