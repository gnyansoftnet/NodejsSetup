// src/container/index.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { OrganisationController } from "../controllers/organisation.controller";
import { PasswordService } from "../services/password.service";
import { TokenService } from "../services/token.service";
import { UserController } from "../controllers/user.controller";
import { DataSource } from "typeorm";
import { AppDataSource } from "../config/database.config";
import { CodeGenerateService } from "../services/code-generate.service";
import { OrganisationServiceImpl } from "../services/impl/organisation.service.impl";
import { UserServiceImpl } from "../services/impl/user.service.impl";

container.registerInstance(DataSource, AppDataSource);

// register interface token → concrete class
container.register("IOrganisationService", { useClass: OrganisationServiceImpl });
container.register("IUserService", { useClass: UserServiceImpl });


container.registerSingleton(PasswordService);
container.registerSingleton(TokenService);
container.registerSingleton(CodeGenerateService);
