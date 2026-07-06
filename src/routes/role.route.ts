import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { container } from "tsyringe";
import { RoleController } from "../controllers/role.controller";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import { PageId } from "../constants/page-id.enum";

const router = Router();
const controller = container.resolve(RoleController);
router.use(authMiddleware);
router.use(permissionMiddleware(PageId.ROLE));
router.post("/createRole", controller.createRole);
router.put("/updateRole", controller.updateRole);
router.delete("/deleteRole", controller.deleteRole);
router.get("/getRolesByOrgId", controller.getRolesByOrgId);
router.get("/getRoleById/:roleId", controller.getRoleById);

export default router;