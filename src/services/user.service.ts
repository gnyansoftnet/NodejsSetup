import { User } from "../entities/user.entity";

export interface IUserService {
    loginUser(userName: string, password: string,): Promise<User>;
    validateLogin(userId: number, orgId: number, branchId: number): Promise<any>;
}