import { inject, injectable } from "tsyringe";
import { PaginatedResultDto } from "../../dtos/paginated.result.dto";
import { Role } from "../../entities/role.entity";
import { IRoleService } from "../role.service";
import { UserRepository } from "../../repositories/user.repo";
import { RoleRepository } from "../../repositories/role.repo";
import { AppError } from "../../utils/app-error";
import { OrganisationRepository } from "../../repositories/organisation.repo";
import { AppConstants } from "../../constants/app.constants";
import { RolePermission } from "../../entities/role-permission.entity";
import { RolePermissionRepository } from "../../repositories/role-permission.repo";
import { DataSource } from "typeorm";
import { PageRepository } from "../../repositories/page.repo";

@injectable()
export class RoleSeriviceImpl implements IRoleService {

    constructor(
        @inject(UserRepository)
        private userRepo: UserRepository,
        @inject(RoleRepository)
        private roleRepo: RoleRepository,
        @inject(OrganisationRepository)
        private orgRepo: OrganisationRepository,
        @inject(RolePermissionRepository)
        private rolePer: RolePermissionRepository,
        @inject(DataSource)
        private dataSource: DataSource,
        @inject(PageRepository)
        private pageRepo: PageRepository,
    ) { }

    async createRole(roleName: string, createdBy: string, orgId: number): Promise<Role> {
        const user = await this.userRepo.exists({
            where: { userCode: createdBy, dFlag: false }
        });
        if (!user) throw new AppError(404, "user not found!");

        const org = await this.orgRepo.findOne({
            where: { orgId: orgId, dFlag: false }
        });
        if (!org) throw new AppError(404, "Organisation not found!");

        const roleExists = await this.roleRepo.exists({
            where: { roleName: roleName, dFlag: false }
        });
        if (roleExists) throw new AppError(400, "Role already exist!");

        const allPages = await this.pageRepo.findAll({
            where: { dFlag: false }
        });

        return await this.dataSource.transaction(async (manager) => {
            const role = manager.create(Role, {
                createdBy: createdBy,
                roleName: roleName,
                dFlag: false,
                organisation: org,
            });
            const savedRole = await manager.save(Role, role);

            const rolePermissions = allPages.map((page) =>
                manager.create(RolePermission, {
                    role: savedRole,
                    page: page,
                    canRead: false,
                    canWrite: false,
                    canUpdate: false,
                    canDelete: false,
                    createdBy: createdBy,
                    dFlag: false,
                })
            );
            await manager.save(RolePermission, rolePermissions);
            return savedRole;
        });
    }

    async updateRole(roleId: number, roleName: string, modifiedBy: string, orgId: number): Promise<Role> {
        const user = await this.userRepo.exists({
            where: { userCode: modifiedBy, dFlag: false }
        });
        if (!user) throw new AppError(404, "user not found!");
        const org = await this.orgRepo.findOne({
            where: { orgId: orgId, dFlag: false }
        });
        if (!org) throw new AppError(404, "Organisation not found!");

        const updateRole = await this.roleRepo.update(roleId, {
            roleName: roleName,
            modifiedBy: modifiedBy,
            dFlag: false,
            organisation: org,
        });
        if (!updateRole) throw new AppError(400, "Role not updated")
        return updateRole;
    }
    async deleteRole(roleId: number): Promise<boolean> {
        const role = await this.roleRepo.exists({
            where: {
                roleId: roleId, dFlag: false,
            }
        })
        if (!role) throw new AppError(400, "Role not exist exist!");
        await this.roleRepo.delete(roleId);
        return true;
    }
    async getRolesByOrgId(orgId: number, page: number, limit: number, search?: string): Promise<PaginatedResultDto<Role>> {
        const { data, total } = await this.roleRepo.findRolePaginated(orgId, page, limit, search);
        const filteredRoles = data
            .filter(user => user.roleName != AppConstants.SystemAdminRoleName);
        const totalPages = Math.ceil(total / limit);
        return {
            data: filteredRoles,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    async getRoleById(roleId: number): Promise<Role> {
        const role = await this.roleRepo.findById(roleId);
        if (!role) throw new AppError(404, "Role not found");
        return role;
    }

}