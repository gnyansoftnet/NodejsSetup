import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Unique
} from "typeorm";

import { User } from "./user.entity";
import { Organisation } from "./organisation.entity";
import { Branch } from "./branch.entity";
import { Role } from "./role.entity";

@Entity("user_org_branch_role")
@Unique(["user", "organisation", "branch", "role"])
export class UserOrgBranchRole {

    @PrimaryGeneratedColumn({ name: "id" })
    id!: number;

    @ManyToOne(
        () => User,
        user => user.userOrgBranches,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToOne(
        () => Organisation,
        organisation => organisation.userOrgBranches,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({ name: "org_id" })
    organisation!: Organisation;

    @ManyToOne(
        () => Branch,
        branch => branch.userOrgBranches,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({ name: "branch_id" })
    branch!: Branch;

    @ManyToOne(
        () => Role,
        role => role.userOrgBranches,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({ name: "role_id" })
    role!: Role;
}