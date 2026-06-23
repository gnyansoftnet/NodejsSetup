// src/routes/role.routes.ts
import { Router } from "express";
import { organisationController } from "../container";
import { authMiddleware } from "../middlewares/auth.middleware";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import { PageId } from "../constants/page-id.enum";



const router = Router();
router.use(authMiddleware);
router.use(permissionMiddleware(PageId.ORGANISATION));
router.get("/createOrganisation", organisationController.createOrganisation);
router.get("/updateOrganisation", organisationController.updateOrganisation);

export default router;