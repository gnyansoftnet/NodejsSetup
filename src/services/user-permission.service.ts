import { inject, injectable } from "tsyringe";
import { DataSource, In } from "typeorm";
import { AppError } from "../utils/app-error";
import { UserRepository } from "../repositories/user.repo";
import { IUserPermissionService } from "./interfaces/user-permission-service.interface";
import { UserPermissionUpdateDto } from "../dtos/user-permission-update.dto";
import { UserPermission } from "../entities/user-permission.entity";
import { UserPermissionRepository } from "../repositories/user-permission.repo";



@injectable()
export class UserPermissionService implements IUserPermissionService {

    constructor(
        @inject(UserPermissionRepository)
        private userPermissionRepo: UserPermissionRepository,
        @inject(UserRepository)
        private userRepository: UserRepository,
        @inject(DataSource)
        private dataSource: DataSource,
    ) { }



    async getUserPermissionsByuserId(userId: number): Promise<UserPermission[]> {
        return await this.userPermissionRepo.findAll(
            {
                where: {
                    dFlag: false,
                    user: { userId },
                },
                relations: {
                    page: {
                        module: true,

                    },
                    user: true,

                }
            },

        );
    }


    async updateUserPermissions(
        userId: number,
        permissions: UserPermissionUpdateDto[],
        modifiedBy: string
    ): Promise<UserPermission[]> {
        return await this.dataSource.transaction(async (manager) => {
            const userPermissionRepo = manager.getRepository(UserPermission);
            const user = await this.userRepository.findOne({ where: { userCode: modifiedBy, dFlag: false } });
            if (!user) {
                throw new AppError(404, 'User not found');
            }
            const ids = permissions.map(p => p.userPermissionId);
            const existingPermissions = await userPermissionRepo.find({
                where: {
                    userPermissionId: In(ids),
                    user: { userId },
                    dFlag: false,
                },
            });

            if (existingPermissions.length !== permissions.length) {
                throw new AppError(404, 'One or more user permissions not found for this user');
            }

            const updated: UserPermission[] = [];

            for (const perm of permissions) {
                const record = existingPermissions.find(
                    (rp) => rp.userPermissionId === perm.userPermissionId
                );

                if (!record) continue;

                record.canRead = perm.canRead;
                record.canWrite = perm.canWrite;
                record.canUpdate = perm.canUpdate;
                record.canDelete = perm.canDelete;
                record.modifiedBy = modifiedBy;

                updated.push(record);
            }

            return await userPermissionRepo.save(updated);
        });
    }


}