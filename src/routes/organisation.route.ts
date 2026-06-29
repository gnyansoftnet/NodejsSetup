import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import { PageId } from "../constants/page-id.enum";
import { OrganisationController } from "../controllers/organisation.controller";
import { container } from "tsyringe";
import { validateDto } from "../middlewares/validate.middleware";
import { OrgCreateDto } from "../dtos/org-create.dto";
import { OrgUpdateDto } from "../dtos/org-update.dto";

const router = Router();
const controller = container.resolve(OrganisationController);
router.use(authMiddleware);
// router.use(permissionMiddleware(PageId.ORGANISATION));
router.post("/createOrganisation", validateDto(OrgCreateDto), controller.createOrganisation);
router.put("/updateOrganisation", validateDto(OrgUpdateDto), controller.updateOrganisation);
router.delete("/deleteOrganisation", controller.deleteOrganisation);
router.get("/getAllOrganisation", controller.getOrganisations);
router.get("/getOrganisationById/:orgId", controller.getOrganisationById);

export default router;