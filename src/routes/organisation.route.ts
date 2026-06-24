// src/routes/role.routes.ts
import { Router } from "express";
import { organisationController } from "../container";
import { authMiddleware } from "../middlewares/auth.middleware";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import { PageId } from "../constants/page-id.enum";



const router = Router();
router.use(authMiddleware);
// router.use(permissionMiddleware(PageId.ORGANISATION));
router.post("/createOrganisation", organisationController.createOrganisation);
router.put("/updateOrganisation", organisationController.updateOrganisation);
router.put("/deleteOrganisation", organisationController.deleteOrganisation);
router.get("/getAllOrganisation", organisationController.getOrganisationsPaginated);
router.get("/getOrganisationById/:orgId", organisationController.getOrganisationById);

export default router;