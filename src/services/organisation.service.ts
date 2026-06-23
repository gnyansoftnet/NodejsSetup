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
        createdBy: string
    ): Promise<Organisation> {

        if (!data.orgShortName) {
            throw new AppError(400, "Organisation short name is required");
        }
        const shortNameExists = await this.organisationRepo.exists({
            where: { orgShortName: data.orgShortName, dFlag: false }
        });

        if (shortNameExists) {
            throw new AppError(400, "Organisation short name already exist");
        }

        const orgCode = await generateOrgCode(data.orgShortName);

        const existOrgCode = await this.organisationRepo.exists({
            where: { orgCode: orgCode, dFlag: false }
        });
        if (existOrgCode) {
            throw new AppError(400, "Organisation code already exist");
        }

        return this.organisationRepo.create({
            ...data,
            orgCode,
            dFlag: false,
            createdBy: createdBy
        });
    }


    async updateOrganisation(
        orgId: number,
        data: DeepPartial<Organisation>,
        modifiedBy: string
    ): Promise<Organisation> {
        const org = await this.organisationRepo.findByOrgId(orgId);
        if (!org) throw new AppError(404, "Organisation not found");
        if (org.dFlag) throw new AppError(400, "Cannot update a deleted organisation");
        if (data.orgShortName && data.orgShortName !== org.orgShortName) {
            const exists = await this.organisationRepo.exists({
                where: { orgShortName: data.orgShortName, dFlag: false }
            });
            if (exists) throw new AppError(400, "Organisation short name already exist");
        }

        if (data.orgCode && data.orgCode !== org.orgCode) {
            const exists = await this.organisationRepo.exists({
                where: { orgCode: data.orgCode, dFlag: false }
            });
            if (exists) throw new AppError(400, "Organisation code already exist");
        }

        const updatedOrg = await this.organisationRepo.update(
            orgId,
            { ...data, modifiedBy: modifiedBy }
        );
        if (!updatedOrg) throw new AppError(400, "Cannot update organisation");
        return updatedOrg;
    }

    async getOrganisationsPaginated(
        page: number,
        limit: number,
        search?: string
    ) {


    }

}