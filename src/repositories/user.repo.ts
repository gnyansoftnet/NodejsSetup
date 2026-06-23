import { singleton } from "tsyringe";
import { User } from "../entities/user.entity";
import { BaseRepository } from "./base.repo";


@singleton()
export class UserRepository extends BaseRepository<User> {

    constructor() {
        super(User);
    }

}