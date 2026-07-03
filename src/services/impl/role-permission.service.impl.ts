import { inject, injectable } from "tsyringe";
import { Module } from "../../entities/module.entity";
import { IModuleService } from "../module.service";
import { RolePermissionRepository } from "../../repositories/role-permission.repo";
import { IRolePermissionService } from "../role-permission.service";
import { RolePermission } from "../../entities/role-permission.entity";
import { RolePermissionUpdateDto } from "../../dtos/role-prmission-update.dto";
import { DataSource, In } from "typeorm";
import { AppError } from "../../utils/app-error";



@injectable()
export class RolePermissionServiceImpl implements IRolePermissionService {

    constructor(
        @inject(RolePermissionRepository)
        private rolePermissionRepo: RolePermissionRepository,
        @inject(DataSource)
        private dataSource: DataSource,
    ) { }


    async getRolePermissionsByroleId(roleId: number): Promise<RolePermission[]> {
        return await this.rolePermissionRepo.findAll(
            {
                where: {
                    dFlag: false,
                    role: { roleId: roleId },
                },
                relations: {
                    page: {
                        module: true,
                    },
                    role: true,
                }
            },

        );
    }


    async updateRolePermissions(
        roleId: number,
        permissions: RolePermissionUpdateDto[],
        modifiedBy: string
    ): Promise<RolePermission[]> {
        return await this.dataSource.transaction(async (manager) => {
            const rolePermissionRepo = manager.getRepository(RolePermission);
            const ids = permissions.map(p => p.rolePermissionId);
            const existingPermissions = await rolePermissionRepo.find({
                where: {
                    rolePermissionId: In(ids),
                    role: { roleId },
                    dFlag: false,
                },
            });

            if (existingPermissions.length !== permissions.length) {
                throw new AppError(404, 'One or more role permissions not found for this role');
            }

            const updated: RolePermission[] = [];

            for (const perm of permissions) {
                const record = existingPermissions.find(
                    (rp) => rp.rolePermissionId === perm.rolePermissionId
                );

                if (!record) continue;

                record.canRead = perm.canRead;
                record.canWrite = perm.canWrite;
                record.canUpdate = perm.canUpdate;
                record.canDelete = perm.canDelete;
                record.modifiedBy = modifiedBy;

                updated.push(record);
            }

            return await rolePermissionRepo.save(updated);
        });
    }


}