import { singleton } from "tsyringe";
import { Module } from "../entities/module.entity";
import { BaseRepository } from "./base.repo";


@singleton()
export class ModuleRepository extends BaseRepository<Module> {
    constructor() {
        super(Module, "moduleId")
    }

}