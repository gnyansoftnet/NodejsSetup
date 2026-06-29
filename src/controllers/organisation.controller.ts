import { inject, injectable, singleton } from "tsyringe";
import { asyncHandler } from "../utils/async.handler";
import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../utils/response.util";
import { IOrganisationService } from "../services/organisation.service";
import { OrgCreateDto } from "../dtos/org-create.dto";
import { OrgUpdateDto } from "../dtos/org-update.dto";

@singleton()
@injectable()
export class OrganisationController {
    constructor(
        @inject("IOrganisationService")
        private orgService: IOrganisationService
    ) { }

    createOrganisation = asyncHandler(async (req: Request, res: Response) => {
        const orgCreateDto: OrgCreateDto = req.body;
        const org = await this.orgService.createOrganisation(orgCreateDto);
        return sendCreated(res, org, "organisation created successfully");
    });


    updateOrganisation = asyncHandler(async (req: Request, res: Response) => {
        const orgUpdateDto: OrgUpdateDto = req.body;
        const org = await this.orgService.updateOrganisation(orgUpdateDto);
        return sendSuccess(res, org, "organisation updated successfully");
    });
    getOrganisationById = asyncHandler(async (req: Request, res: Response) => {
        const orgId = Number(req.params.orgId);
        const organisations = await this.orgService.getOrganisationById(orgId);
        return sendSuccess(res, organisations);
    });

    getOrganisations = asyncHandler(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string | undefined;
        const organisations = await this.orgService.getOrganisations(page, limit, search);
        return sendSuccess(res, organisations);
    });

    deleteOrganisation = asyncHandler(async (req: Request, res: Response) => {
        const orgId = Number(req.query.orgId);

        await this.orgService.deleteOrganisation(orgId);
        return sendSuccess(res, "organisation deleted successfully");
    });
}