import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import { PageId } from "../constants/page-id.enum";
import { OrganisationController } from "../controllers/organisation.controller";
import { container } from "tsyringe";

const router = Router();
const controller = container.resolve(OrganisationController);
router.use(authMiddleware);
// router.use(permissionMiddleware(PageId.ORGANISATION));
router.post("/createOrganisation", controller.createOrganisation);
router.put("/updateOrganisation", controller.updateOrganisation);
router.put("/deleteOrganisation", controller.deleteOrganisation);
router.get("/getAllOrganisation", controller.getOrganisations);
router.get("/getOrganisationById/:orgId", controller.getOrganisationById);

export default router;