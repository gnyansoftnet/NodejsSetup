import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller";
import { validateDto } from "../middlewares/validate.middleware";
import { UserUpdateDto } from "../dtos/user-update.dto";
import { UserCreateDto } from "../dtos/user-create.dto";

const router = Router();
const controller = container.resolve(UserController);
router.use(authMiddleware);
// router.use(permissionMiddleware(PageId.ORGANISATION));
router.post("/createUser", validateDto(UserCreateDto), controller.createUser);
router.put("/updateUser", validateDto(UserUpdateDto), controller.updateUser);
router.delete("/deleteUser", controller.deleteUser);
router.get("/getUsersByOrgId", controller.getUsersByorgId);
router.get("/getUserById/:userId", controller.getUserById);

export default router;