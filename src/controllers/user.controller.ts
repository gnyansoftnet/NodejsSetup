import { inject, injectable } from "tsyringe";
import { UserService } from "../services/user.service";
import { asyncHandler } from "../utils/async.handler";
import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../utils/response.util";


@injectable()
export class UserController {

    constructor(
        @inject(UserService)
        private userService: UserService
    ) { }

    loginUser = asyncHandler(async (req: Request, res: Response) => {
        const { userName, password } = req.body;
        const org = await this.userService.loginUser(userName, password);
        return sendSuccess(res, org, "User login successfully");
    });

    validateLogin = asyncHandler(async (req: Request, res: Response) => {
        const { userId, orgId, branchId } = req.body;
        const user = await this.userService.validateLogin(userId, orgId, branchId);
        return sendSuccess(res, user, "User validate successfully");
    });

}