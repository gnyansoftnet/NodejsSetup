import { RolePermissionUpdateDto } from "../dtos/role-prmission-update.dto";
import { RolePermission } from "../entities/role-permission.entity";

export interface IRolePermissionService {
    getRolePermissionsByroleId(roleId: number): Promise<RolePermission[]>;
    updateRolePermissions(roleId: number, permissions: RolePermissionUpdateDto[], modifiedBy: string): Promise<RolePermission[]>;

}