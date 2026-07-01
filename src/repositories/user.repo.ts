import { singleton } from "tsyringe";
import { User } from "../entities/user.entity";
import { BaseRepository } from "./base.repo";


@singleton()
export class UserRepository extends BaseRepository<User> {

    constructor() {
        super(User, "userId");
    }

    async findUsersByOrgId(
        orgId: number,
        page: number,
        limit: number,
        search?: string
    ): Promise<{ data: User[]; total: number }> {
        const query = this.repository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.userOrgBranches", "uobr")
            .leftJoinAndSelect("uobr.organisation", "org")
            .andWhere("org.orgId = :orgId", { orgId });
        if (search) {
            query.andWhere(
                "(user.userName LIKE :search OR user.userCode LIKE :search OR user.email LIKE :search)",
                { search: `%${search}%` }
            );
        }
        const offset = (page - 1) * limit;
        const [data, total] = await query
            .orderBy("user.createdDate", "DESC")
            .limit(limit)
            .offset(offset)
            .getManyAndCount();
        return { data, total };
    }

}