import { Request, Response, NextFunction } from "express";
import { RolePermission } from "../entities/role-permission.entity";
import { UserPermission } from "../entities/user-permission.entity";
import { UserOrgBranch } from "../entities/user-organisation-branch.entity";
import { AppError } from "../utils/app-error";
import { AppDataSource } from "../config/database.config";

export type PermissionAction = "canRead" | "canWrite" | "canUpdate" | "canDelete";

const METHOD_PERMISSION_MAP: Record<string, PermissionAction> = {
    GET: "canRead",
    POST: "canWrite",
    PUT: "canUpdate",
    PATCH: "canUpdate",
    DELETE: "canDelete",
};


export const permissionMiddleware = (pgId: number) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {


            const userId: number = (req as any).user?.userId;
            const orgId: number = (req as any).user?.orgId;
            const branchId: number = (req as any).user?.branchId;
            const roleId: number = (req as any).user?.roleId;

            console.log(userId + "================")
            if (!userId) {
                throw new AppError(401, "Unauthorized: missing user context.");
            }

            if (orgId === null || branchId === null || roleId === null) {
                throw new AppError(400,
                    "Missing or invalid x-org-id, x-branch-id, or x-role-id header.",
                );
            }
            const action: PermissionAction = METHOD_PERMISSION_MAP[req.method];
            if (!action) {
                throw new AppError(405, `Unsupported HTTP method: ${req.method}`);
            }

            const userOrgBranch = await AppDataSource.getRepository(UserOrgBranch).findOne({
                where: {
                    user: { userId },
                    organisation: { orgId },
                    branch: { branchId },
                    role: { roleId },
                },
            });

            if (!userOrgBranch) {
                throw new AppError(403,
                    `User '${userId}' is not assigned to org '${orgId}', branch '${branchId}', role '${roleId}'.`,
                );
            }

            // Check RolePermission (role + page) and UserPermission (user + page) in parallel
            const [rolePermission, userPermission] = await Promise.all([
                AppDataSource.getRepository(RolePermission).findOne({
                    where: {
                        role: { roleId },
                        page: { pageId: pgId },
                    },
                }),
                AppDataSource.getRepository(UserPermission).findOne({
                    where: {
                        user: { userId },
                        page: { pageId: pgId },
                    },
                }),
            ]);

            if (!rolePermission) {
                throw new AppError(403,
                    `Access not configured for role '${roleId}' on page '${pgId}'.`,

                );
            }

            if (!userPermission) {
                throw new AppError(403,
                    `Access not configured for user '${userId}' on page '${pgId}'.`,

                );
            }

            const roleAllows = rolePermission[action] === true && !rolePermission.dFlag;
            const userAllows = userPermission[action] === true;

            if (!roleAllows || !userAllows) {
                throw new AppError(403,
                    `Permission denied: '${action}' operation not allowed on this page.`,

                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

function parseHeaderId(value: string | string[] | undefined): number | null {
    if (Array.isArray(value)) {
        value = value[0];
    }
    if (!value) return null;
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
}