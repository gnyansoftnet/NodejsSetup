import { inject, injectable, singleton } from "tsyringe";
import { asyncHandler } from "../utils/async.handler";
import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../utils/response.util";
import { IBranchService } from "../services/branch.service";
import { BranchCreateDto } from "../dtos/branch-create.dto";
import { BranchUpdateDto } from "../dtos/branch-update.dto";

@singleton()
@injectable()
export class BranchController {
    constructor(
        @inject("IBranchService")
        private branchService: IBranchService
    ) { }

    createBranch = asyncHandler(async (req: Request, res: Response) => {
        const branchCreateDto: BranchCreateDto = req.body;
        const org = await this.branchService.createBranch(branchCreateDto);
        return sendCreated(res, org, "Branch created successfully");
    });


    updateBranch = asyncHandler(async (req: Request, res: Response) => {
        const branchCreateDto: BranchUpdateDto = req.body;
        const org = await this.branchService.updateBranch(branchCreateDto);
        return sendSuccess(res, org, "Branch updated successfully");
    });
    getBranchById = asyncHandler(async (req: Request, res: Response) => {
        const branchId = Number(req.params.branchId);
        const branch = await this.branchService.getBranchById(branchId);
        return sendSuccess(res, branch);
    });

    getbranchesByorgId = asyncHandler(async (req: Request, res: Response) => {
        const orgId = Number(req.query.orgId);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string | undefined;
        const branches = await this.branchService.getbranchesByorgId(orgId, page, limit, search);
        return sendSuccess(res, branches);
    });

    deleteBranch = asyncHandler(async (req: Request, res: Response) => {
        const branchId = Number(req.query.branchId);
        await this.branchService.deleteBranch(branchId);
        return sendSuccess(res, "Branch deleted successfully");
    });
}