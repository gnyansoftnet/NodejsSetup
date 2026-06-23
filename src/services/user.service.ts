import { inject, injectable } from "tsyringe";
import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repo";


@injectable()
export class UserService {
    constructor(
        @inject(UserRepository)
        private userRepository: UserRepository
    ) {

    }

}