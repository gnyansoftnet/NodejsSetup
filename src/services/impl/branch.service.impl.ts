import { inject, injectable } from "tsyringe";
import { Organisation } from "../../entities/organisation.entity";
import { OrganisationRepository } from "../../repositories/organisation.repo";
import { DeepPartial } from "typeorm";
import { AppError } from "../../utils/app-error";
import { PaginatedResultDto } from "../../dtos/paginated.result.dto";
import { UserRepository } from "../../repositories/user.repo";
import { BranchRepository } from "../../repositories/branch.repo";
import { Branch } from "../../entities/branch.entity";
import { CodeGenerateService } from "../code-generate.service";


@injectable()
export class BranchServiceImpl {
    constructor(
        @inject(OrganisationRepository)
        private organisationRepo: OrganisationRepository,
        @inject(UserRepository)
        private userRepo: UserRepository,
        @inject(BranchRepository)
        private branchRepo: BranchRepository,
        @inject(CodeGenerateService)
        private codeService: CodeGenerateService,
    ) {

    }

    async createBranch(
        data: DeepPartial<Branch>,
        createdBy: string
    ): Promise<Branch> {

        if (!data.branchShortName) {
            throw new AppError(400, "Branch short name is required");
        }
        const shortNameExists = await this.branchRepo.exists({
            where: { branchShortName: data.branchShortName, dFlag: false }
        });

        if (shortNameExists) {
            throw new AppError(400, "Branch short name already exist");
        }

        const branchCode = await this.codeService.generateOrgCode(data.branchShortName);

        const existOrgCode = await this.branchRepo.exists({
            where: { branchCode: branchCode, dFlag: false }
        });
        if (existOrgCode) {
            throw new AppError(400, "Branch code already exist");
        }

        return this.branchRepo.create({
            ...data,
            branchCode,
            dFlag: false,
            createdBy: createdBy
        });
    }


    // async updateOrganisation(
    //     branchId: number,

    //     data: DeepPartial<Branch>,
    //     modifiedBy: string
    // ): Promise<Branch> {
    //     const branch = await this.branchRepo.findById(branchId);
    //     if (!branch) throw new AppError(404, "Branch not found");
    //     if (branch.dFlag) throw new AppError(400, "Cannot update a deleted branch");
    //     if (data.branchShortName && data.branchShortName !== branch.branchShortName) {
    //         const exists = await this.branchRepo.exists({
    //             where: { branchShortName: data.branchShortName, dFlag: false }
    //         });
    //         if (exists) throw new AppError(400, "Branch short name already exist");
    //     }

    //     if (data.branchCode && data.branchCode !== branch.branchCode) {
    //         const exists = await this.branchRepo.exists({
    //             where: { branchCode: data.branchCode, dFlag: false }
    //         });
    //         if (exists) throw new AppError(400, "Branch code already exist");
    //     }

    //     const updatedBranch = await this.organisationRepo.update(
    //         branchId,
    //         { ...data, modifiedBy: modifiedBy }
    //     );
    //     if (!updatedBranch) throw new AppError(400, "Cannot update branch");
    //     return updatedBranch;
    // }


    // async getOrganisationById(
    //     orgId: number
    // ): Promise<Organisation> {
    //     const organisation = await this.organisationRepo.findById(orgId);
    //     if (!organisation) throw new AppError(404, "Organisation not found");
    //     return organisation;

    // }

    // async getOrganisationsPaginated(
    //     page: number,
    //     limit: number,
    //     search?: string
    // ): Promise<PaginatedResultDto<Organisation>> {
    //     const { data, total } = await this.organisationRepo.findOrganisationPaginated(page, limit, search);
    //     const totalPages = Math.ceil(total / limit);
    //     return {
    //         data,
    //         pagination: {
    //             total,
    //             page,
    //             limit,
    //             totalPages,
    //             hasNextPage: page < totalPages,
    //             hasPrevPage: page > 1,
    //         },
    //     };
    // }


    // async deleteOrganisation(
    //     orgId: number,
    //     modifiedBy: number
    // ) {
    //     const organisation = await this.organisationRepo.findById(orgId);
    //     if (!organisation) throw new AppError(404, "Organisation not found");
    //     const user = await this.userRepo.findById(modifiedBy);
    //     if (!user) throw new AppError(404, "User  not found");
    //     await this.organisationRepo.delete(orgId, modifiedBy);


    // }



}