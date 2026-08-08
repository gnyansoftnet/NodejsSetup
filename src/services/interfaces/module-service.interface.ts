import { Module } from "../../entities/module.entity";

export interface IModuleService {
    getModules(): Promise<Module[]>;

}