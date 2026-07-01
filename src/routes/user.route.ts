import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { container } from "tsyringe";
import { RoleController } from "../controllers/role.controller";
import { UserController } from "../controllers/user.controller";

const router = Router();
const controller = container.resolve(UserController);
router.use(authMiddleware);
// router.use(permissionMiddleware(PageId.ORGANISATION));
router.post("/createUser", controller.createUser);
// router.put("/updateUser", controller.updateUser);
router.delete("/deleteUser", controller.deleteUser);
router.get("/getUsersByOrgId", controller.getUsersByorgId);
router.get("/getUserById/:userId", controller.getUserById);

export default router;