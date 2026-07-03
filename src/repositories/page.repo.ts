import { singleton } from "tsyringe";
import { Page } from "../entities/page.entity";
import { BaseRepository } from "./base.repo";

@singleton()
export class PageRepository extends BaseRepository<Page> {
    constructor() {
        super(Page, "pageId")
    }

}