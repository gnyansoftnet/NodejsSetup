import { inject, injectable } from "tsyringe";
import { User } from "../../entities/user.entity";
import { UserRepository } from "../../repositories/user.repo";
import { AppError } from "../../utils/app-error";
import { PasswordService } from "../password.service";
import { TokenService } from "../token.service";
import { TokenRepository } from "../../repositories/token.repo";
import { IUserService } from "../user.service";
import { UserCreateDto } from "../../dtos/user-create.dto";
import { RoleRepository } from "../../repositories/role.repo";
import { OrganisationRepository } from "../../repositories/organisation.repo";
import { BranchRepository } from "../../repositories/branch.repo";
import { UserOrgBranchRoleRepository } from "../../repositories/user-org-branch-role.repo";
import { CodeGenerateService } from "../code-generate.service";
import { PaginatedResultDto } from "../../dtos/paginated.result.dto";
import { AppConstants } from "../../constants/app.constants";
import { UserUpdateDto } from "../../dtos/user-update.dto";
import { AppDataSource } from "../../config/database.config";
import { UserOrgBranchRole } from "../../entities/user-org-branch-role.entity";
import { Organisation } from "../../entities/organisation.entity";
import { Branch } from "../../entities/branch.entity";
import { Role } from "../../entities/role.entity";



@injectable()
export class UserServiceImpl implements IUserService {
    constructor(
        @inject(UserRepository)
        private userRepository: UserRepository,
        @inject(PasswordService)
        private passwordService: PasswordService,
        @inject(TokenService)
        private tokenService: TokenService,
        @inject(TokenRepository)
        private tokenRepo: TokenRepository,
        @inject(RoleRepository)
        private roleRepo: RoleRepository,
        @inject(OrganisationRepository)
        private orgRepo: OrganisationRepository,
        @inject(BranchRepository)
        private branchRepo: BranchRepository,
        @inject(UserOrgBranchRoleRepository)
        private userOrgBranchRepo: UserOrgBranchRoleRepository,
        @inject(CodeGenerateService)
        private codeService: CodeGenerateService,
    ) { }


    async deleteUser(userId: number): Promise<boolean> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError(404, "User not found");
        }
        await this.userRepository.delete(userId);
        return true;
    }
    async getUsersByorgId(orgId: number, page: number, limit: number, search?: string): Promise<PaginatedResultDto<User>> {
        const { data, total } = await this.userRepository.findUsersByOrgId(orgId, page, limit, search);
        const filteredUsers = data
            .filter(user => user.userName != AppConstants.SystemAdminUserName);
        const totalPages = Math.ceil(total / limit);
        return {
            data: filteredUsers,
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
    async getUserById(userId: number): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError(404, "User not found");
        }
        return user;
    }

    async loginUser(
        userName: string,
        password: string,
    ): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                userName: userName,
                dFlag: false,
            },
            relations: {
                userOrgBranches: {
                    organisation: true,
                    branch: true,
                    role: true
                }
            }
        })
        if (!user) {
            throw new AppError(401, "Incorrect username or password");
        }
        const isMatch = await this.passwordService.compare(password, user.password);

        if (!isMatch) {
            throw new AppError(401, "Incorrect username or password");
        }
        return user;
    }


    async validateLogin(

        userId: number,
        orgId: number,
        branchId: number,
    ) {
        const user = await this.userRepository.findOne({
            where: {
                userId: userId,
                dFlag: false,
            },
            relations: {
                userOrgBranches: {
                    organisation: true,
                    branch: true,
                    role: true
                }
            }
        })
        if (!user) {
            throw new AppError(401, "Incorrect username or password");
        }

        const selectedContext = user.userOrgBranches.find(e => e.organisation.orgId == orgId && e.branch.branchId == branchId);

        if (!selectedContext) {
            throw new AppError(
                403,
                "Invalid organisation or branch"
            );
        }
        const payLoad = {
            userCode: user.userCode,
            userId: user.userId,
            orgId: selectedContext.organisation.orgId,
            branchId: selectedContext.branch.branchId,
            roleId: selectedContext.role.roleId,
        };

        const accessToken = this.tokenService.generateAccessToken(payLoad);
        const refreshToken = this.tokenService.generateRefreshToken(payLoad);
        this.tokenRepo.create({
            user: user,
            token: refreshToken,
        });

        const userResponse = {
            userId: user.userId,
            userName: user.userName,
            userCode: user.userCode,
            status: user.status,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePic: user.profilePic,
            DOB: user.DOB,
        };



        return {
            accessToken,
            refreshToken,
            user: userResponse,
            organisation: selectedContext.organisation,
            branch: selectedContext.branch,
            role: selectedContext.role
        };


    }

    async updateUser(data: UserUpdateDto): Promise<User> {

        const modifiedBy = await this.userRepository.findOne({
            where: {
                userCode: data.modifiedBy,
                dFlag: false,
            }
        });

        if (!modifiedBy) {
            throw new AppError(404, "ModifiedBy user not found");
        }

        const targetUser = await this.userRepository.findOne({
            where: {
                userId: data.userId,
                dFlag: false,
            },
            relations: {
                userOrgBranches: {
                    organisation: true,
                    branch: true,
                    role: true
                }
            }
        });

        if (!targetUser) {
            throw new AppError(404, "User not found");
        }

        if (targetUser.userName !== data.userName) {

            const duplicateUser = await this.userRepository.findOne({
                where: {
                    userName: data.userName,
                    dFlag: false,
                }
            });

            if (duplicateUser && duplicateUser.userId !== targetUser.userId) {
                throw new AppError(409, "Username already exists");
            }
        }



        return await AppDataSource.transaction(async manager => {

            const userRepo = manager.getRepository(User);
            const mappingRepo = manager.getRepository(UserOrgBranchRole);

            targetUser.userName = data.userName;
            targetUser.status = data.status;
            targetUser.modifiedBy = data.modifiedBy;

            targetUser.email = data.email ?? targetUser.email;
            targetUser.phoneNumber = data.phoneNumber ?? targetUser.phoneNumber;
            targetUser.fullName = data.fullName ?? targetUser.fullName;

            const savedUser = await userRepo.save(targetUser);

            await mappingRepo.delete({
                user: {
                    userId: savedUser.userId
                }
            });

            for (const item of data.assignments) {
                const organisation = await manager.getRepository(Organisation).findOne({
                    where: {
                        orgId: item.orgId,
                        dFlag: false
                    }
                });
                if (!organisation) {
                    throw new AppError(404, `Organisation ${item.orgId} not found`);
                }

                const branch = await manager.getRepository(Branch).findOne({
                    where: {
                        branchId: item.branchId,
                        organisation: {
                            orgId: item.orgId
                        },
                        dFlag: false
                    },
                    relations: {
                        organisation: true
                    }
                });

                if (!branch) {
                    throw new AppError(
                        404,
                        `Branch ${item.branchId} does not belong to Organisation ${item.orgId}`
                    );
                }

                const role = await manager.getRepository(Role).findOne({
                    where: {
                        roleId: item.roleId,
                        organisation: {
                            orgId: item.orgId
                        },
                        dFlag: false
                    },
                    relations: {
                        organisation: true
                    }
                });

                if (!role) {
                    throw new AppError(
                        404,
                        `Role ${item.roleId} does not belong to Organisation ${item.orgId}`
                    );
                }

                const mapping = mappingRepo.create({
                    user: savedUser,
                    organisation,
                    branch,
                    role
                });

                await mappingRepo.save(mapping);
            }

            return savedUser;
        });
    }

    async createUser(data: UserCreateDto): Promise<User> {
        // Created By User
        const createdByUser = await this.userRepository.findOne({
            where: {
                userCode: data.createdBy,
                dFlag: false,
            }
        });

        if (!createdByUser) {
            throw new AppError(404, "Created By user not found");
        }

        // Username
        const existingUser = await this.userRepository.findOne({
            where: {
                userName: data.userName,
                dFlag: false,
            }
        });

        if (existingUser) {
            throw new AppError(409, "Username already exists");
        }
        // At least one assignment
        if (!data.assignments || data.assignments.length === 0) {
            throw new AppError(
                400,
                "Please assign at least one Organisation."
            );
        }

        const password = await this.passwordService.hash(
            data.password
        );


        const userCode = await this.codeService.generateUserCode();
        return await AppDataSource.transaction(async (manager) => {
            const userRepo = manager.getRepository(User);
            const orgRepo = manager.getRepository(Organisation);
            const branchRepo = manager.getRepository(Branch);
            const roleRepo = manager.getRepository(Role);
            const mappingRepo = manager.getRepository(UserOrgBranchRole);
            // Create User
            let user = userRepo.create({
                userName: data.userName,
                fullName: data.fullName,
                password: password,
                userCode: userCode,
                email: data.email,
                phoneNumber: data.phoneNumber,
                status: data.status,
                createdBy: data.createdBy,

            });

            user = await userRepo.save(user);
            // Assign multiple organisations
            for (const assignment of data.assignments) {
                // Organisation
                const organisation = await orgRepo.findOne({
                    where: {
                        orgId: assignment.orgId,
                        dFlag: false
                    }
                });
                if (!organisation) {
                    throw new AppError(
                        404,
                        `Organisation ${assignment.orgId} not found`
                    );
                }
                // Branch
                const branch = await branchRepo.findOne({
                    where: {
                        branchId: assignment.branchId,
                        organisation: {
                            orgId: organisation.orgId

                        },
                        dFlag: false
                    },
                    relations: {
                        organisation: true
                    }
                });
                if (!branch) {
                    throw new AppError(400, `Branch ${assignment.branchId} does not belong to ${organisation.orgName}`);
                }

                // Role
                const role = await roleRepo.findOne({
                    where: {
                        roleId: assignment.roleId,
                        organisation: {
                            orgId: organisation.orgId
                        },
                        dFlag: false
                    },
                    relations: {
                        organisation: true
                    }
                });

                if (!role) {
                    throw new AppError(400, `Role ${assignment.roleId} does not belong to ${organisation.orgName}`
                    );
                }
                // Duplicate Assignment
                const duplicate = await mappingRepo.findOne({
                    where: {
                        user: {
                            userId: user.userId
                        },
                        organisation: {
                            orgId: organisation.orgId
                        },
                        branch: {
                            branchId: branch.branchId
                        },
                        role: {
                            roleId: role.roleId
                        }
                    },

                    relations: {
                        user: true,
                        organisation: true,
                        branch: true,
                        role: true
                    }

                });
                if (duplicate) {
                    throw new AppError(409, `Duplicate assignment found for ${organisation.orgName}`);

                }

                const mapping = mappingRepo.create({
                    user,
                    organisation,
                    branch,
                    role
                });
                await mappingRepo.save(mapping);
            }

            return user;

        });

    }
}