import { inject, injectable, singleton } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async.handler";
import { IModuleService } from "../services/module.service";
import { sendSuccess } from "../utils/response.util";

@singleton()
@injectable()
export class ModuleController {
    constructor(
        @inject("IModuleService")
        private moduleService: IModuleService,
    ) { }

    getModules = asyncHandler(async (req: Request, res: Response) => {
        const modules = await this.moduleService.getModules();
        return sendSuccess(res, modules);
    });



}