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
    async createUser(data: UserCreateDto): Promise<User> {
        const existUser = await this.userRepository.exists({
            where: {
                userCode: data.createdBy,
                dFlag: false,
            },
        });
        if (!existUser) {
            throw new AppError(409, "CretedBy user does not exist");
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
        const createUser = await this.userRepository.create({
            userName: data.userName,
            userCode: userCode,
            password: hashedPassword,
            email: data.email,
            phoneNumber: data.phoneNumber,
            fullName: data.fullName,
            status: data.status,
        });

        await this.userOrgBranchRepo.create({
            user: createUser,
            organisation: org,
            branch: branch,
            role: role,
        });

        return createUser;

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