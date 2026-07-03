import { singleton } from "tsyringe";
import { RolePermission } from "../entities/role-permission.entity";
import { BaseRepository } from "./base.repo";

@singleton()
export class RolePermissionRepository extends BaseRepository<RolePermission> {
    constructor() {
        super(RolePermission, "rolePermissionId")
    }

}