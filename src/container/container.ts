// src/container/index.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { PasswordService } from "../services/password.service";
import { TokenService } from "../services/token.service";
import { DataSource } from "typeorm";
import { AppDataSource } from "../config/database.config";
import { CodeGenerateService } from "../services/code-generate.service";
import { OrganisationServiceImpl } from "../services/impl/organisation.service.impl";
import { UserServiceImpl } from "../services/impl/user.service.impl";
import { BranchServiceImpl } from "../services/impl/branch.service.impl";
import { RoleSeriviceImpl } from "../services/impl/role.service.impl";

container.registerInstance(DataSource, AppDataSource);

// register interface token → concrete class
container.register("IOrganisationService", { useClass: OrganisationServiceImpl });
container.register("IBranchService", { useClass: BranchServiceImpl });
container.register("IUserService", { useClass: UserServiceImpl });
container.register("IRoleService", { useClass: RoleSeriviceImpl });


container.registerSingleton(PasswordService);
container.registerSingleton(TokenService);
container.registerSingleton(CodeGenerateService);
