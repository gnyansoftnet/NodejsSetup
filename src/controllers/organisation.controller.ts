import { inject, injectable } from "tsyringe";
import { OrganisationService } from "../services/organisation.service";
import { asyncHandler } from "../utils/async.handler";
import { Request, Response, NextFunction } from "express";
import { sendCreated } from "../utils/response.util";


@injectable()
export class OrganisationController {

    constructor(
        @inject(OrganisationService)
        private organisationService: OrganisationService
    ) { }

    createOrganisation = asyncHandler(async (req: Request, res: Response) => {
        const org = await this.organisationService.createOrganisation(req.body, "");
        return sendCreated(res, org, "organisation created successfully");
    });
}