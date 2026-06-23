import { inject, injectable } from "tsyringe";
import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repo";
import { AppError } from "../utils/app-error";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { TokenRepository } from "../repositories/token.repo";


@injectable()
export class UserService {
    constructor(
        @inject(UserRepository)
        private userRepository: UserRepository,
        @inject(PasswordService)
        private passwordService: PasswordService,
        @inject(TokenService)
        private tokenService: TokenService,
        @inject(TokenRepository)
        private tokenRepo: TokenRepository,
    ) {

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