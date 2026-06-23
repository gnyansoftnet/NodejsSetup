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
}