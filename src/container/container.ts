// import "reflect-metadata";
// import { container } from "tsyringe";
// import { PasswordService } from "../services/interfaces/password-service.interface";
// import { TokenService } from "../services/interfaces/token-service.interface";
// import { DataSource } from "typeorm";
// import { AppDataSource } from "../config/database.config";
// import { CodeGenerateService } from "../services/interfaces/code-generate-service.interface";
// import { OrganisationService } from "../services/organisation.service";
// import { UserService } from "../services/user.service";
// import { BranchService } from "../services/branch.service";
// import { RoleSerivice } from "../services/role.service";
// import { ModuleService } from "../services/module.service";
// import { RolePermissionService } from "../services/role-permission.service";
// import { UserPermissionService } from "../services/user-permission.service";

// container.registerInstance(DataSource, AppDataSource);

// // register interface token → concrete class
// container.register("IOrganisationService", { useClass: OrganisationService });
// container.register("IBranchService", { useClass: BranchService });
// container.register("IUserService", { useClass: UserService });
// container.register("IRoleService", { useClass: RoleSerivice });
// container.register("IModuleService", { useClass: ModuleService });
// container.register("IUserPermissionService", { useClass: UserPermissionService });
// container.register("IRolePermissionService", { useClass: RolePermissionService });


// container.registerSingleton(PasswordService);
// container.registerSingleton(TokenService);
// container.registerSingleton(CodeGenerateService);
