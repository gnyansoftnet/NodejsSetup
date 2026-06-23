import { singleton } from "tsyringe";
import { BaseRepository } from "./base.repo";
import { Token } from "../entities/token.entity";


@singleton()
export class TokenRepository extends BaseRepository<Token> {

    constructor() {
        super(Token, "tokenId");
    }

}