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

    async updateUser(data: UserUpdateDto): Promise<User> {
        const existModifiedBy = await this.userRepository.exists({
            where: { userCode: data.modifiedBy, dFlag: false },
        });
        if (!existModifiedBy) {
            throw new AppError(404, "ModifiedBy user does not exist");
        }

        const targetUser = await this.userRepository.findById(data.userId);
        if (!targetUser) {
            throw new AppError(404, "User not found");
        }

        if (data.userName && data.userName !== targetUser.userName) {
            const duplicate = await this.userRepository.findOne({
                where: { userName: data.userName, dFlag: false },
            });
            if (duplicate && duplicate.userId !== data.userId) {
                throw new AppError(409, "User name already in use");
            }
        }

        let role: any, org: any, branch: any;

        if (data.roleId) {
            role = await this.roleRepo.findOne({ where: { roleId: data.roleId, dFlag: false } });
            if (!role) throw new AppError(404, "Role not found");
        }
        if (data.orgId) {
            org = await this.orgRepo.findOne({ where: { orgId: data.orgId, dFlag: false } });
            if (!org) throw new AppError(404, "Organisation not found");
        }
        if (data.branchId) {
            branch = await this.branchRepo.findOne({ where: { branchId: data.branchId, dFlag: false } });
            if (!branch) throw new AppError(404, "Branch not found");
        }

        return AppDataSource.transaction(async (manager) => {
            const userRepo = manager.getRepository(User);
            const mappingRepo = manager.getRepository(UserOrgBranchRole);

            userRepo.merge(targetUser, {
                userName: data.userName ?? targetUser.userName,
                email: data.email ?? targetUser.email,
                phoneNumber: data.phoneNumber ?? targetUser.phoneNumber,
                fullName: data.fullName ?? targetUser.fullName,
                status: data.status ?? targetUser.status,
                modifiedBy: data.modifiedBy,
            });
            const savedUser = await userRepo.save(targetUser);

            if (role || org || branch) {
                const mapping = await mappingRepo.findOne({
                    where: { user: { userId: data.userId } },
                    relations: { role: true, organisation: true, branch: true },
                });
                if (!mapping) {
                    throw new AppError(404, "User org/branch mapping not found");
                }

                if (role) mapping.role = role;
                if (org) mapping.organisation = org;
                if (branch) mapping.branch = branch;
                await mappingRepo.save(mapping);
            }

            return savedUser;
        });

    }


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
    async createUser(data: UserCreateDto): Promise<User> {
        const existUser = await this.userRepository.exists({
            where: {
                userCode: data.createdBy,
                dFlag: false,
            },
        });
        if (!existUser) {
            throw new AppError(404, "CreatedBy user does not exist");
        }

        const user = await this.userRepository.findOne({
            where: {
                userName: data.userName,
                dFlag: false,
            },
        });
        if (user) {
            throw new AppError(409, "User already exists");
        }

        const role = await this.roleRepo.findOne({
            where: {
                roleId: data.roleId,
                dFlag: false,
            },
        });
        if (!role) {
            throw new AppError(404, "Role not found");
        }

        const org = await this.orgRepo.findOne({
            where: {
                orgId: data.orgId,
                dFlag: false,
            },
        });
        if (!org) {
            throw new AppError(404, "Organisation not found");
        }

        const branch = await this.branchRepo.findOne({
            where: {
                branchId: data.branchId,
                dFlag: false,
            },
        });
        if (!branch) {
            throw new AppError(404, "Branch not found");
        }

        const hashedPassword = await this.passwordService.hash(data.password);
        const userCode = await this.codeService.generateUserCode(org.orgShortName);

        return AppDataSource.transaction(async (manager) => {
            const userRepo = manager.getRepository(User);
            const mappingRepo = manager.getRepository(UserOrgBranchRole);

            let createdUser = userRepo.create({
                userName: data.userName,
                userCode: userCode,
                password: hashedPassword,
                email: data.email,
                phoneNumber: data.phoneNumber,
                fullName: data.fullName,
                status: data.status,
                createdBy: data.createdBy,
            });
            createdUser = await userRepo.save(createdUser);

            const mapping = mappingRepo.create({
                user: createdUser,
                organisation: org,
                branch: branch,
                role: role,
            });
            await mappingRepo.save(mapping);

            return createdUser;
        });
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



}