import { inject, injectable } from "tsyringe";
import { Organisation } from "../entities/organisation.entity";
import { OrganisationRepository } from "../repositories/organisation.repo";
import { DeepPartial } from "typeorm";
import { generateOrgCode } from "../utils/generate_org_code";
import { AppError } from "../utils/app-error";

@injectable()
export class OrganisationService {

    constructor(
        @inject(OrganisationRepository)
        private organisationRepo: OrganisationRepository
    ) { }

    async createOrganisation(
        data: DeepPartial<Organisation>,
        createdBy: string) {
        const orgCode = await generateOrgCode(data.orgShortName);
        const existOrgCode = await this.organisationRepo.exists({
            where: { orgCode: orgCode, dFlag: false }
        });
        if (existOrgCode) throw new AppError(400, "Organisation code already exist")

        return this.organisationRepo.create({
            ...data,
            dFlag: false,
            createdBy: createdBy
        })

    }

    async updateOrganisation(
        orgId: number,
        data: DeepPartial<Organisation>,
        modifiedBy: string
    ): Promise<Organisation> {
        const org = await this.organisationRepo.findByOrgId(orgId);
        if (!org) throw new AppError(404, "organisation not found");
        const updatedOrg = await this.organisationRepo.update(
            orgId,
            { ...data, modifiedBy: modifiedBy },
        )
        if (!updatedOrg) throw new AppError(400, "can not updated organisation")
        return updatedOrg;

    }

}