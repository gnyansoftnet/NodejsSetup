import { Role } from "../entities/role.entity";
import { BaseRepository } from "./base.repo";

export class RoleRepository extends BaseRepository<Role> {
    constructor() {
        super(Role, "roleId")
    }
}