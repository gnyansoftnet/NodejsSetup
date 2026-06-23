// src/repositories/base.repository.ts
import {
    Repository, EntityTarget, FindManyOptions,
    FindOneOptions, DeepPartial, ObjectLiteral
} from "typeorm";
import { AppDataSource } from "../config/database.config";

export class BaseRepository<T extends ObjectLiteral> {

    protected repository: Repository<T>;

    constructor(entity: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository(entity);
    }

    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<T>): Promise<T | null> {
        return this.repository.findOne(options);
    }

    async findById(id: number): Promise<T | null> {
        return this.repository.findOne({ where: { id } as any });
    }

    async create(data: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(data);
        return this.repository.save(entity as any);
    }

    async update(id: number, data: DeepPartial<T>): Promise<T | null> {
        await this.repository.update(id, data as any);
        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.softDelete(id);
        return (result.affected ?? 0) > 0;
    }

    async count(options?: FindManyOptions<T>): Promise<number> {
        return this.repository.count(options);
    }

    async exists(options: FindOneOptions<T>): Promise<boolean> {
        const entity = await this.repository.findOne(options);
        return entity !== null;
    }
}