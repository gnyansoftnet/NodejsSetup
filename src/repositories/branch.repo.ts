import { Branch } from "../entities/branch.entity";
import { BaseRepository } from "./base.repo";

export class BranchRepository extends BaseRepository<Branch> {
    constructor() {
        super(Branch, "branchId")
    }

}