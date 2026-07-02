import { PaginatedResultDto } from "../dtos/paginated.result.dto";
import { UserCreateDto } from "../dtos/user-create.dto";
import { UserUpdateDto } from "../dtos/user-update.dto";
import { User } from "../entities/user.entity";

export interface IUserService {
    loginUser(userName: string, password: string,): Promise<User>;
    validateLogin(userId: number, orgId: number, branchId: number): Promise<any>;
    createUser(data: UserCreateDto): Promise<User>;
    updateUser(data: UserUpdateDto): Promise<User>;
    deleteUser(userId: number): Promise<boolean>;
    getUsersByorgId(orgId: number, page: number, limit: number, search?: string): Promise<PaginatedResultDto<User>>;
    getUserById(userId: number): Promise<User>;
}