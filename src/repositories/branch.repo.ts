import { Branch } from "../entities/branch.entity";
import { BaseRepository } from "./base.repo";

export class BranchRepository extends BaseRepository<Branch> {
    constructor() {
        super(Branch, "branchId")
    }


    async findBranchPaginated(
        orgId: number,
        page: number,
        limit: number,
        search?: string
    ): Promise<{ data: Branch[]; total: number }> {
        const query = this.repository
            .createQueryBuilder("branch")
            .leftJoinAndSelect("branch.organisation", "organisation")
            .where("branch.dFlag = :dFlag", { dFlag: false })
            .andWhere("branch.org_id = :orgId", { orgId });
        if (search) {
            query.andWhere(
                "(branch.branchName LIKE :search OR branch.branchShortName LIKE :search OR branch.branchCode LIKE :search)",
                { search: `%${search}%` }
            );
        }
        const offset = (page - 1) * limit;
        const [data, total] = await query
            .orderBy("branch.createdDate", "DESC")
            .limit(limit)
            .offset(offset)
            .getManyAndCount();
        return { data, total };
    }

}