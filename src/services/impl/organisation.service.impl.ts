import { inject, injectable } from "tsyringe";
import { Organisation } from "../../entities/organisation.entity";
import { OrganisationRepository } from "../../repositories/organisation.repo";
import { DeepPartial } from "typeorm";
import { AppError } from "../../utils/app-error";
import { PaginatedResultDto } from "../../dtos/paginated.result.dto";
import { UserRepository } from "../../repositories/user.repo";
import { CodeGenerateService } from "../code-generate.service";
import { IOrganisationService } from "../organisation.service";
import { OrgCreateDto } from "../../dtos/org-create.dto";
import { OrgUpdateDto } from "../../dtos/org-update.dto";
import { logger } from "../../utils/logger";


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
        data: OrgCreateDto,
    ): Promise<Organisation> {
        const user = await this.userRepo.exists({
            where: { userCode: data.createdBy, dFlag: false }
        });

        if (!user) throw new AppError(404, "user not found!");

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

        return await this.organisationRepo.create({
            orgName: data.orgName,
            orgShortName: data.orgShortName,
            orgCode: orgCode,
            address: data.address,
            orgPhone: data.orgPhone,
            tinNumber: data.tinNumber,
            orgGSTINNumber: data.orgGSTINNumber,
            deptLogo: data.logo,
            faxNumber: data.faxNumber,
            orgPAN: data.orgPAN,
            orgRegNumber: data.orgRegNumber,
            cashAccountNumber: data.cashAccountNumber,
            wesite: data.website,
            serviceTax: data.serviceTax,
            orgEmail: data.orgEmail,
            dFlag: false,
            createdBy: data.createdBy,
        });
    }



    async updateOrganisation(
        data: OrgUpdateDto,
    ): Promise<Organisation> {
        const user = await this.userRepo.exists({
            where: { userCode: data.modifiedBy, dFlag: false }
        });

        if (!user) throw new AppError(404, "user not found!");
        const org = await this.organisationRepo.findById(data.orgId);
        if (!org) throw new AppError(404, "Organisation not found");

        if (data.orgShortName && data.orgShortName !== org.orgShortName) {
            const exists = await this.organisationRepo.exists({
                where: { orgShortName: data.orgShortName, dFlag: false }
            });
            if (exists) throw new AppError(400, "Organisation short name already exist");
        }

        const updatedOrg = await this.organisationRepo.update(
            data.orgId, {
            orgName: data.orgName,
            orgShortName: data.orgShortName,
            address: data.address,
            orgPhone: data.orgPhone,
            tinNumber: data.tinNumber,
            orgGSTINNumber: data.orgGSTINNumber,
            deptLogo: data.logo,
            faxNumber: data.faxNumber,
            orgPAN: data.orgPAN,
            orgRegNumber: data.orgRegNumber,
            cashAccountNumber: data.cashAccountNumber,
            wesite: data.website,
            orgEmail: data.orgEmail,
            serviceTax: data.serviceTax,
            modifiedBy: data.modifiedBy,
        }
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
        orgId: number
    ): Promise<boolean> {
        const organisation = await this.organisationRepo.findById(orgId);
        if (!organisation) throw new AppError(404, "Organisation not found");
        await this.organisationRepo.delete(orgId);
        return true;
    }



}