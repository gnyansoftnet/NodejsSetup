import { OrgCreateDto } from "../dtos/org-create.dto";
import { OrgUpdateDto } from "../dtos/org-update.dto";
import { PaginatedResultDto } from "../dtos/paginated.result.dto";
import { Organisation } from "../entities/organisation.entity";


export interface IOrganisationService {
    createOrganisation(dto: OrgCreateDto): Promise<Organisation>;
    updateOrganisation(dto: OrgUpdateDto): Promise<Organisation>;
    getOrganisationById(orgId: number): Promise<Organisation>;
    getOrganisations(page: number, limit: number, search?: string): Promise<PaginatedResultDto<Organisation>>;
    deleteOrganisation(orgId: number, modifiedBy: number): Promise<boolean>;
}