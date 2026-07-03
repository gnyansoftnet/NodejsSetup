import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { container } from "tsyringe";
import { UserPermissionController } from "../controllers/user-permission.controller";

const router = Router();
const controller = container.resolve(UserPermissionController);
router.use(authMiddleware);
router.get("/getUserPermissions", controller.getUserPermissionsByuserId);
router.put("/updateUserPermissions", controller.updateUserPermissions);

export default router;