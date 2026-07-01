// src/repositories/organisation.repository.ts
import { singleton } from "tsyringe";
import { Organisation } from "../entities/organisation.entity";
import { BaseRepository } from "./base.repo";

@singleton()
export class OrganisationRepository extends BaseRepository<Organisation> {
    constructor() {
        super(Organisation, "orgId");
    }

    async findOrganisationPaginated(
        page: number,
        limit: number,
        search?: string
    ): Promise<{ data: Organisation[]; total: number }> {
        const query = this.repository
            .createQueryBuilder("org")
            .where("org.dFlag = :dFlag", { dFlag: false });
        if (search) {
            query.andWhere(
                "(org.orgName LIKE :search OR org.orgShortName LIKE :search OR org.orgCode LIKE :search)",
                { search: `%${search}%` }
            );
        }
        const offset = (page - 1) * limit;
        const [data, total] = await query
            .orderBy("org.createdDate", "DESC")
            .limit(limit)
            .offset(offset)
            .getManyAndCount();
        return { data, total };
    }
}