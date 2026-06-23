import { inject, injectable } from "tsyringe";
import { UserService } from "../services/user.service";


@injectable()
export class UserController {

    constructor(
        @inject(UserService)
        private userService: UserService
    ) {

        
     }
}