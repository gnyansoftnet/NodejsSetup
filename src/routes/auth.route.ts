// src/routes/role.routes.ts
import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller";

const router = Router();
const controller = container.resolve(UserController);
router.post("/login", controller.loginUser);
router.post("/validateLogin", controller.validateLogin);



export default router;