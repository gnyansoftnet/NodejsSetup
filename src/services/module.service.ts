import { inject, injectable } from "tsyringe";
import { Module } from "../entities/module.entity";
import { IModuleService } from "./interfaces/module-service.interface";
import { ModuleRepository } from "../repositories/module.repo";


@injectable()
export class ModuleService implements IModuleService {

    constructor(
        @inject(ModuleRepository)
        private moduleRepo: ModuleRepository,
    ) { }


    async getModules(): Promise<Module[]> {
        const modules = await this.moduleRepo.findAll(
            {
                where: { dFlag: false },
                relations: {
                    pages: true,
                },

            },

        );
        modules.forEach(module => {
            module.pages.reverse();
        });

        return modules;
    }


}