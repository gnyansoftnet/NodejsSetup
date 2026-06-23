// src/container/index.ts
import "reflect-metadata";
import { container } from "tsyringe";

import { OrganisationController } from "../controllers/organisation.controller";

// Organisation
export const organisationController = container.resolve(OrganisationController);
