import { inject, injectable } from "tsyringe";
import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repo";
import { BaseService } from "./base.service";


@injectable()
export class UserService extends BaseService<User> {
    constructor(
        @inject(UserRepository) private userRepository: UserRepository
    ) {
        super(userRepository);
    }

}