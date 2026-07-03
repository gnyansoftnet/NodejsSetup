import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { container } from "tsyringe";
import { ModuleController } from "../controllers/module.controller";

const router = Router();
const controller = container.resolve(ModuleController);
router.use(authMiddleware);
router.get("/getModules", controller.getModules);

export default router;