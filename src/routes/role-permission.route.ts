import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { container } from "tsyringe";
import { RolePermissionController } from "../controllers/role-permission.controller";

const router = Router();
const controller = container.resolve(RolePermissionController);
router.use(authMiddleware);
router.get("/getRolePermissions", controller.getRolePermissionsByroleId);
router.put("/updateRolePermissions", controller.updateRolePermissions);

export default router;