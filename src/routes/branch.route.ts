import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { container } from "tsyringe";
import { validateDto } from "../middlewares/validate.middleware";
import { BranchController } from "../controllers/branch.controller";
import { BranchCreateDto } from "../dtos/branch-create.dto";
import { BranchUpdateDto } from "../dtos/branch-update.dto";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import { PageId } from "../constants/page-id.enum";

const router = Router();
const controller = container.resolve(BranchController);
router.use(authMiddleware);
router.use(permissionMiddleware(PageId.BRANCH));
router.post("/createBranch", validateDto(BranchCreateDto), controller.createBranch);
router.put("/updateBranch", validateDto(BranchUpdateDto), controller.updateBranch);
router.delete("/deleteBranch", controller.deleteBranch);
router.get("/getAllBranch", controller.getbranchesByorgId);
router.get("/getBranchById/:branchId", controller.getBranchById);

export default router;