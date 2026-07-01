import { inject, injectable, singleton } from "tsyringe";
import { IRoleService } from "../services/role.serive";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async.handler";
import { sendCreated, sendSuccess } from "../utils/response.util";
import { requirePositiveInt, requireString } from "../utils/validators";

@singleton()
@injectable()
export class RoleController {
    constructor(
        @inject("IRoleService")
        private roleService: IRoleService
    ) { }


    createRole = asyncHandler(async (req: Request, res: Response) => {
        const roleName = requireString(req.body.roleName, "Role name", 50);
        const createdBy = requireString(req.body.createdBy, "Created by");
        const orgId = requirePositiveInt(req.body.orgId, "Organisation ID");
        const role = await this.roleService.createRole(roleName, createdBy, orgId);
        return sendCreated(res, role, "Role created successfully");
    });


    updateRole = asyncHandler(async (req: Request, res: Response) => {
        const roleName = requireString(req.body.roleName, "Role name", 50);
        const modifiedBy = requireString(req.body.modifiedBy, "modifiedBy");
        const orgId = requirePositiveInt(req.body.orgId, "Organisation ID");
        const roleId = requirePositiveInt(req.body.roleId, "Role ID");
        const role = await this.roleService.updateRole(roleId, roleName, modifiedBy, orgId);
        return sendSuccess(res, role, "Branch updated successfully");
    });
    getRoleById = asyncHandler(async (req: Request, res: Response) => {
        const roleId = Number(req.params.roleId);
        const role = await this.roleService.getRoleById(roleId);
        return sendSuccess(res, role);
    });

    getRolesByOrgId = asyncHandler(async (req: Request, res: Response) => {
        const orgId = Number(req.query.orgId);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string | undefined;
        const roles = await this.roleService.getRolesByOrgId(orgId, page, limit, search);
        return sendSuccess(res, roles);
    });

    deleteRole = asyncHandler(async (req: Request, res: Response) => {
        const roleId = Number(req.query.roleId);
        await this.roleService.deleteRole(roleId);
        return sendSuccess(res, "Role deleted successfully");
    });
}