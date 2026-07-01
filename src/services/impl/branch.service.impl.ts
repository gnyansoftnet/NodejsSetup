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
import { IBranchService } from "../branch.service";
import { BranchCreateDto } from "../../dtos/branch-create.dto";
import { BranchUpdateDto } from "../../dtos/branch-update.dto";
import { AppConstants } from "../../constants/app.constants";


@injectable()
export class BranchServiceImpl implements IBranchService {
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
        data: BranchCreateDto,
    ): Promise<Branch> {
        const user = await this.userRepo.exists({
            where: { userCode: data.createdBy, dFlag: false }
        });

        if (!user) throw new AppError(404, "user not found!");

        const shortNameExists = await this.branchRepo.exists({
            where: { branchShortName: data.branchShortName, dFlag: false }
        });

        if (shortNameExists) {
            throw new AppError(400, "Branch short name already exist");
        }

        const branchCode = await this.codeService.generateOrgCode(data.branchShortName);

        const existBranch = await this.branchRepo.exists({
            where: { branchCode: branchCode, dFlag: false }
        });
        if (existBranch) {
            throw new AppError(400, "Branch code already exist");
        }
        const org = await this.organisationRepo.findById(data.orgId);
        if (!org) throw new AppError(400, "Organisation not found");

        return this.branchRepo.create({
            branchName: data.branchName,
            branchShortName: data.branchShortName,
            branchCode: branchCode,
            createdBy: data.createdBy,
            dFlag: false,
            organisation: org,
        });
    }


    async updateBranch(data: BranchUpdateDto): Promise<Branch> {
        const user = await this.userRepo.exists({
            where: { userCode: data.modifiedBy, dFlag: false }
        });

        if (!user) throw new AppError(404, "user not found!");
        const branch = await this.branchRepo.findById(data.branchId);
        if (!branch) throw new AppError(404, "Branch not found");

        const updateBranch = await this.branchRepo.update(
            data.branchId, {
            branchName: data.branchName,
            branchShortName: data.branchShortName,
            modifiedBy: data.modifiedBy,
        });
        if (!updateBranch) throw new AppError(400, "Cannot update branch");
        return updateBranch;

    }
    async deleteBranch(branchId: number): Promise<boolean> {
        const branch = await this.branchRepo.findById(branchId);
        if (!branch) throw new AppError(404, "Branch not found");
        await this.branchRepo.delete(branchId);
        return true;
    }
    async getBranchById(branchId: number): Promise<Branch> {
        const branch = await this.branchRepo.findById(branchId);
        if (!branch) throw new AppError(404, "Organisation not found");
        return branch;
    }
    async getbranchesByorgId(orgId: number, page: number, limit: number, search?: string): Promise<PaginatedResultDto<Branch>> {
        const { data, total } = await this.branchRepo.findBranchPaginated(orgId, page, limit, search);
        const filteredUsers = data
            .filter(user => user.branchCode != AppConstants.SystemAdminBranchCode);
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
}