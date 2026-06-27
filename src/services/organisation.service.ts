import { OrgCreateDto } from "../dtos/org-create.dto";
import { PaginatedResultDto } from "../dtos/paginated.result.dto";
import { Organisation } from "../entities/organisation.entity";


export interface IOrganisationService {
    createOrganisation(dto: OrgCreateDto): Promise<Organisation>;
    getOrganisations(page: number, limit: number, search?: string): Promise<PaginatedResultDto<Organisation>>;
    getOrganisationById(orgId: number): Promise<Organisation>;
    updateOrganisation(orgId: number, dto: Organisation): Promise<Organisation>;
    deleteOrganisation(orgId: number, modifiedBy: number): Promise<boolean>;
}