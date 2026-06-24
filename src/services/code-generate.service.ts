import { inject, injectable, singleton } from "tsyringe";
import { DataSource, Repository } from "typeorm";
import { Organisation } from "../entities/organisation.entity";
import { AppError } from "../utils/app-error";
import { Branch } from "../entities/branch.entity";
import { OrganisationRepository } from "../repositories/organisation.repo";
import { BranchRepository } from "../repositories/branch.repo";

@singleton()
@injectable()
export class CodeGenerateService {
    constructor(
        @inject(OrganisationRepository)
        private orgRepo: OrganisationRepository,
        @inject(BranchRepository)
        private branchRepo: BranchRepository,
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

    async generateBranchCode(branchShortName: string | undefined): Promise<string> {
        if (!branchShortName) {
            throw new AppError(400, "Branch short name is required to generate org code");
        }
        const prefix = branchShortName.toUpperCase();
        const lastOrg = await this.branchRepo
            .createQueryBuilder("branch")
            .where("branch.branch_code LIKE :prefix", { prefix: `${prefix}%` })
            .orderBy("organisation.branch_code", "DESC")
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