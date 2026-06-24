import { inject, injectable } from "tsyringe";
import { Organisation } from "../../entities/organisation.entity";
import { OrganisationRepository } from "../../repositories/organisation.repo";
import { DeepPartial } from "typeorm";
import { AppError } from "../../utils/app-error";
import { PaginatedResultDto } from "../../dtos/paginated.result.dto";
import { UserRepository } from "../../repositories/user.repo";
import { CodeGenerateService } from "../code-generate.service";
import { IOrganisationService } from "../organisation.service";


@injectable()
export class OrganisationServiceImpl implements IOrganisationService {
    constructor(
        @inject(OrganisationRepository)
        private organisationRepo: OrganisationRepository,
        @inject(UserRepository)
        private userRepo: UserRepository,
        @inject(CodeGenerateService)
        private codeService: CodeGenerateService,
    ) { }
    async createOrganisation(
        data: DeepPartial<Organisation>,
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

        const orgCode = await this.codeService.generateOrgCode(data.orgShortName);

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
            createdBy: '"createdBy"'
        });
    }


    
    async updateOrganisation(
        orgId: number,
        data: DeepPartial<Organisation>,

    ): Promise<Organisation> {
        const org = await this.organisationRepo.findById(orgId);
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
            { ...data, modifiedBy: "modifiedBy" }
        );
        if (!updatedOrg) throw new AppError(400, "Cannot update organisation");
        return updatedOrg;
    }
    async getOrganisationById(
        orgId: number
    ): Promise<Organisation> {
        const organisation = await this.organisationRepo.findById(orgId);
        if (!organisation) throw new AppError(404, "Organisation not found");
        return organisation;
    }

    async getOrganisations(
        page: number,
        limit: number,
        search?: string
    ): Promise<PaginatedResultDto<Organisation>> {
        const { data, total } = await this.organisationRepo.findOrganisationPaginated(page, limit, search);
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }


    async deleteOrganisation(
        orgId: number,
        modifiedBy: number
    ): Promise<boolean> {
        const organisation = await this.organisationRepo.findById(orgId);
        if (!organisation) throw new AppError(404, "Organisation not found");
        const user = await this.userRepo.findById(modifiedBy);
        if (!user) throw new AppError(404, "User  not found");
        await this.organisationRepo.delete(orgId, modifiedBy);
        return true;
    }



}