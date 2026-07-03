import { singleton } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { UserPermission } from "../entities/user-permission.entity";

@singleton()
export class UserPermissionRepository extends BaseRepository<UserPermission> {
    constructor() {
        super(UserPermission, "userPermissionId")
    }

}