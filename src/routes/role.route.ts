import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { container } from "tsyringe";
import { RoleController } from "../controllers/role.controller";

const router = Router();
const controller = container.resolve(RoleController);
router.use(authMiddleware);
// router.use(permissionMiddleware(PageId.ORGANISATION));
router.post("/createRole", controller.createRole);
router.put("/updateRole", controller.updateRole);
router.delete("/deleteRole", controller.deleteRole);
router.get("/getRolesByOrgId", controller.getRolesByOrgId);
router.get("/getRoleById/:roleId", controller.getRoleById);

export default router;