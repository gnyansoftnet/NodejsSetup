import { inject, injectable, singleton } from "tsyringe";
import { asyncHandler } from "../utils/async.handler";
import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../utils/response.util";
import { IOrganisationService } from "../services/organisation.service";

@singleton()
@injectable()
export class OrganisationController {
    constructor(
        @inject("IOrganisationService")
        private orgService: IOrganisationService
    ) { }

    createOrganisation = asyncHandler(async (req: Request, res: Response) => {
        const createdBy = req.query.createdBy as string;
        const org = await this.orgService.createOrganisation(req.body);
        return sendCreated(res, org, "organisation created successfully");
    });

    updateOrganisation = asyncHandler(async (req: Request, res: Response) => {
        const { orgId, modifiedBy } = req.query as {
            orgId: string;
            modifiedBy: string;
        }
        const org = await this.orgService.updateOrganisation(parseInt(orgId), req.body);
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
        const modifiedBy = Number(req.query.modifiedBy);
        await this.orgService.deleteOrganisation(orgId, modifiedBy);
        return sendSuccess(res, "organisation deleted successfully");
    });
}