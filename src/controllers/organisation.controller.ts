import { inject, injectable } from "tsyringe";
import { OrganisationService } from "../services/organisation.service";
import { asyncHandler } from "../utils/async.handler";
import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../utils/response.util";


@injectable()
export class OrganisationController {

    constructor(
        @inject(OrganisationService)
        private organisationService: OrganisationService
    ) { }

    createOrganisation = asyncHandler(async (req: Request, res: Response) => {
        const createdBy = req.query.createdBy as string;
        const org = await this.organisationService.createOrganisation(req.body, createdBy);
        return sendCreated(res, org, "organisation created successfully");
    });

    updateOrganisation = asyncHandler(async (req: Request, res: Response) => {
        const { orgId, modifiedBy } = req.query as {
            orgId: string;
            modifiedBy: string;
        }
        const org = await this.organisationService.updateOrganisation(parseInt(orgId), req.body, modifiedBy);
        return sendSuccess(res, org, "organisation updated successfully");
    });
    getOrganisationById = asyncHandler(async (req: Request, res: Response) => {
        const orgId = Number(req.params.orgId);
        const organisations = await this.organisationService.getOrganisationById(orgId);
        return sendSuccess(res, organisations);
    });

    getOrganisationsPaginated = asyncHandler(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string | undefined;

        const organisations = await this.organisationService.getOrganisationsPaginated(page, limit, search);
        return sendSuccess(res, organisations);
    });
}