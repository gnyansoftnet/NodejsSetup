// src/container/index.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { OrganisationController } from "../controllers/organisation.controller";
import { PasswordService } from "../services/password.service";
import { TokenService } from "../services/token.service";
import { UserController } from "../controllers/user.controller";

// Controller
export const organisationController = container.resolve(OrganisationController);
export const userController = container.resolve(UserController);


// services
container.registerSingleton(PasswordService);
container.registerSingleton(TokenService);
