import { inject, injectable } from "tsyringe";
import { Module } from "../../entities/module.entity";
import { IModuleService } from "../module.service";
import { ModuleRepository } from "../../repositories/module.repo";


@injectable()
export class ModuleServiceImpl implements IModuleService {

    constructor(
        @inject(ModuleRepository)
        private moduleRepo: ModuleRepository,
    ) { }


    async getModules(): Promise<Module[]> {
        return await this.moduleRepo.findAll(
            {
                where: { dFlag: false },
                relations: {
                    pages: true
                }
            },

        );
    }


}