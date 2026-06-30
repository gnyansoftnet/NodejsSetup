import { PaginatedResultDto } from "../dtos/paginated.result.dto";
import { Role } from "../entities/role.entity";

export interface IRoleService {
    createRole(roleName: string, createdBy: string, orgId: number): Promise<Role>;
    updateRole(roleId: number, roleName: string, modifiedBy: string, orgId: number): Promise<Role>;
    deleteRole(roleId: number): Promise<boolean>;
    getRolesByOrgId(orgId: number, page: number, limit: number, search?: string): Promise<PaginatedResultDto<Role>>;
    getRoleById(roleId: number): Promise<Role>;

}