import { DeepPartial } from "typeorm";
import { Branch } from "../entities/branch.entity";

export interface BranchService {
    createBranch(data: DeepPartial<Branch>, createdBy: string): Promise<Branch>;

}