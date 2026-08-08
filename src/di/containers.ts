import "reflect-metadata";
import { container } from "tsyringe";
import { OrganisationService } from "../services/organisation.service";
import { BranchService } from "../services/branch.service";
import { UserService } from "../services/user.service";
import { RoleSerivice } from "../services/role.service";
import { ModuleService } from "../services/module.service";
import { UserPermissionService } from "../services/user-permission.service";
import { RolePermissionService } from "../services/role-permission.service";
import { DataSource } from "typeorm";
import { AppDataSource } from "../config/database.config";
import { TOKENS } from "./tokens";
import { PasswordService } from "../services/password.service";
import { TokenService } from "../services/token.service";
import { CodeGenerateService } from "../services/code-generate.service";


export function bootstrapContainer(): void {

    container.registerInstance(DataSource, AppDataSource);

    container.register(TOKENS.OrganisationService, { useClass: OrganisationService });
    container.register(TOKENS.BranchService, { useClass: BranchService });
    container.register(TOKENS.UserService, { useClass: UserService });
    container.register(TOKENS.RoleService, { useClass: RoleSerivice });
    container.register(TOKENS.ModuleService, { useClass: ModuleService });
    container.register(TOKENS.UserPermissionService, { useClass: UserPermissionService });
    container.register(TOKENS.RolePermissionService, { useClass: RolePermissionService });

    container.registerSingleton(PasswordService);
    container.registerSingleton(TokenService);
    container.registerSingleton(CodeGenerateService);
}

export { container };