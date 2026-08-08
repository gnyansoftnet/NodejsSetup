import { UserPermissionUpdateDto } from "../../dtos/user-permission-update.dto";
import { UserPermission } from "../../entities/user-permission.entity";

export interface IUserPermissionService {
    getUserPermissionsByuserId(userId: number): Promise<UserPermission[]>;
    updateUserPermissions(userId: number, permissions: UserPermissionUpdateDto[], modifiedBy: string): Promise<UserPermission[]>;

}