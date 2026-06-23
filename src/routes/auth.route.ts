// src/routes/role.routes.ts
import { Router } from "express";
import { userController } from "../container";

const router = Router();

router.post("/login", userController.loginUser);
router.post("/validateLogin", userController.validateLogin);



export default router;