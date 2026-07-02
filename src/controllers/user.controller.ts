import { inject, injectable } from "tsyringe";
import { asyncHandler } from "../utils/async.handler";
import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../utils/response.util";
import { IUserService } from "../services/user.service";
import { UserCreateDto } from "../dtos/user-create.dto";
import { UserUpdateDto } from "../dtos/user-update.dto";


@injectable()
export class UserController {

    constructor(
        @inject("IUserService")
        private userService: IUserService
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



    createUser = asyncHandler(async (req: Request, res: Response) => {
        const userCreateDto: UserCreateDto = req.body;
        const user = await this.userService.createUser(userCreateDto);
        return sendCreated(res, user, "User created successfully");
    });


    updateUser = asyncHandler(async (req: Request, res: Response) => {
        const userUpdateDto: UserUpdateDto = req.body;
        const user = await this.userService.updateUser(userUpdateDto);
        return sendSuccess(res, user, "User updated successfully");
    });

    getUserById = asyncHandler(async (req: Request, res: Response) => {
        const userId = Number(req.params.userId);
        const user = await this.userService.getUserById(userId);
        return sendSuccess(res, user);
    });

    getUsersByorgId = asyncHandler(async (req: Request, res: Response) => {
        const orgId = Number(req.query.orgId);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string | undefined;
        const users = await this.userService.getUsersByorgId(orgId, page, limit, search);
        return sendSuccess(res, users);
    });

    deleteUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = Number(req.query.userId);
        await this.userService.deleteUser(userId);
        return sendSuccess(res, "User deleted successfully");
    });

}