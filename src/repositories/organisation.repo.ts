// src/repositories/organisation.repository.ts
import { singleton } from "tsyringe";
import { Organisation } from "../entities/organisation.entity";
import { BaseRepository } from "./base.repo";

@singleton()
export class OrganisationRepository extends BaseRepository<Organisation> {
    constructor() {
        super(Organisation);
    }

    async findByOrgCode(orgCode: string): Promise<Organisation | null> {
        return this.repository.findOne({
            where: { orgCode: orgCode, dFlag: false },
            relations: { branches: true }
        });
    }
    async findByOrgId(orgId: number): Promise<Organisation | null> {
        return this.repository.findOne({
            where: { orgId: orgId, dFlag: false },
            relations: { branches: true }
        });
    }

    async findAllWithBranches(): Promise<Organisation[]> {
        return this.repository.find({
            where: { dFlag: false },
            relations: { branches: true },
            order: { createdDate: "DESC" }
        });
    }

    async findByIdWithBranches(orgId: number): Promise<Organisation | null> {
        return this.repository.findOne({
            where: { orgId: orgId, dFlag: false },
            relations: { branches: true }
        });
    }
}