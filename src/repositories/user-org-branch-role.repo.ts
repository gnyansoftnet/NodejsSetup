import { singleton } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { UserOrgBranchRole } from "../entities/user-org-branch-role.entity";

@singleton()
export class UserOrgBranchRoleRepository extends BaseRepository<UserOrgBranchRole> {

    constructor() {
        super(UserOrgBranchRole, "id");
    }

}