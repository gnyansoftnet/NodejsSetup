// src/routes/role.routes.ts
import { Router } from "express";
import { organisationController } from "../container";
import { authMiddleware } from "../middlewares/auth.middleware";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import { PAGE_IDS } from "../constants/page-id.enum";


const router = Router();
router.use(authMiddleware);
router.use(permissionMiddleware(PAGE_IDS.ORGANISATION));
router.get("/createOrganisation", organisationController.createOrganisation);

export default router;