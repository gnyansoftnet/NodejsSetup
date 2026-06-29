import { DeepPartial } from "typeorm";
import { Branch } from "../entities/branch.entity";
import { BranchCreateDto } from "../dtos/branch-create.dto";
import { BranchUpdateDto } from "../dtos/branch-update.dto";
import { PaginatedResultDto } from "../dtos/paginated.result.dto";

export interface IBranchService {
    createBranch(data: BranchCreateDto): Promise<Branch>;
    updateBranch(data: BranchUpdateDto): Promise<Branch>;
    deleteBranch(branchId: number): Promise<boolean>;
    getBranchById(branchId: number): Promise<Branch>;
    getbranchesByorgId(orgId: number, page: number, limit: number, search?: string): Promise<PaginatedResultDto<Branch>>;

}