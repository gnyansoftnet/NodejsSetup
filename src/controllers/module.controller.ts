import { inject, injectable, singleton } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async.handler";
import { IModuleService } from "../services/interfaces/module-service.interface";
import { sendSuccess } from "../utils/response.util";
import { TOKENS } from "../di/tokens";

@singleton()
@injectable()
export class ModuleController {
    constructor(
        @inject(TOKENS.ModuleService)
        private readonly moduleService: IModuleService,
    ) { }

    getModules = asyncHandler(async (req: Request, res: Response) => {
        const modules = await this.moduleService.getModules();
        return sendSuccess(res, modules);
    });



}