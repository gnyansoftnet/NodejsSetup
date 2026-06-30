import { Role } from "../entities/role.entity";
import { BaseRepository } from "./base.repo";

export class RoleRepository extends BaseRepository<Role> {
    constructor() {
        super(Role, "roleId")
    }


    async findRolePaginated(
        orgId: number,
        page: number,
        limit: number,
        search?: string
    ): Promise<{ data: Role[]; total: number }> {
        const query = this.repository
            .createQueryBuilder("role")
            .where("role.dFlag = :dFlag", { dFlag: false })
            .andWhere("role.org_id = :orgId", { orgId });

        if (search) {
            query.andWhere(
                "(role.roleName LIKE :search)",
                { search: `%${search}%` }
            );
        }
        const offset = (page - 1) * limit;
        const [data, total] = await query
            .orderBy("role.createdDate", "DESC")
            .limit(limit)
            .offset(offset)
            .getManyAndCount();
        return { data, total };
    }

}