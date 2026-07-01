import { inject, injectable, singleton } from "tsyringe";
import { AppError } from "../utils/app-error";
import { OrganisationRepository } from "../repositories/organisation.repo";
import { BranchRepository } from "../repositories/branch.repo";
import { UserRepository } from "../repositories/user.repo";

@singleton()
@injectable()
export class CodeGenerateService {
    constructor(
        @inject(OrganisationRepository)
        private orgRepo: OrganisationRepository,
        @inject(BranchRepository)
        private branchRepo: BranchRepository,
        @inject(UserRepository)
        private userRepository: UserRepository,

    ) { }

    async generateOrgCode(orgShortName: string | undefined): Promise<string> {
        if (!orgShortName) {
            throw new AppError(400, "Organisation short name is required to generate org code");
        }
        const prefix = orgShortName.toUpperCase();
        const lastOrg = await this.orgRepo
            .createQueryBuilder("organisation")
            .where("organisation.org_code LIKE :prefix", { prefix: `${prefix}%` })
            .orderBy("organisation.org_code", "DESC")
            .getOne();

        if (!lastOrg) {
            return `${prefix}0001`;
        }

        const lastCodeNumber = parseInt(
            lastOrg.orgCode.replace(prefix, ""),
            10
        );

        return `${prefix}${String(lastCodeNumber + 1).padStart(4, "0")}`;
    }


    async generateUserCode(orgShortName: string | undefined): Promise<string> {
        if (!orgShortName) {
            throw new AppError(400, "Organisation short name is required to generate org code");
        }
        const prefix = orgShortName.toUpperCase();
        const lastOrg = await this.userRepository
            .createQueryBuilder("user")
            .where("user.user_code LIKE :prefix", { prefix: `${prefix}%` })
            .orderBy("user.user_code", "DESC")
            .getOne();

        if (!lastOrg) {
            return `USR${prefix}0001`;
        }

        const lastCodeNumber = parseInt(
            lastOrg.userCode.replace(prefix, ""),
            10
        );

        return `${prefix}${String(lastCodeNumber + 1).padStart(4, "0")}`;
    }

    async generateBranchCode(branchShortName: string | undefined): Promise<string> {
        if (!branchShortName) {
            throw new AppError(400, "Branch short name is required to generate org code");
        }
        const prefix = branchShortName.toUpperCase();
        const lastOrg = await this.branchRepo
            .createQueryBuilder("branch")
            .where("branch.branch_code LIKE :prefix", { prefix: `${prefix}%` })
            .orderBy("branch.branch_code", "DESC")
            .getOne();

        if (!lastOrg) {
            return `${prefix}0001`;
        }

        const lastCodeNumber = parseInt(
            lastOrg.branchCode.replace(prefix, ""),
            10
        );

        return `${prefix}${String(lastCodeNumber + 1).padStart(4, "0")}`;
    }
}