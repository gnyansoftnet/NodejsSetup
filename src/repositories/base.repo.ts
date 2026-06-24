
import {
    Repository, EntityTarget, FindManyOptions,
    FindOneOptions, DeepPartial, ObjectLiteral
} from "typeorm";
import { AppDataSource } from "../config/database.config";

export class BaseRepository<T extends ObjectLiteral> {

    protected repository: Repository<T>;
    protected primaryKey: string;

    constructor(entity: EntityTarget<T>, primaryKey: string = "id") {
        this.repository = AppDataSource.getRepository(entity);
        this.primaryKey = primaryKey;
    }

    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
    }

    async findAllActive(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find({
            ...options,
            where: { ...(options?.where as any), dFlag: false } as any
        });
    }

    async findOne(options: FindOneOptions<T>): Promise<T | null> {
        return this.repository.findOne(options);
    }

    async findByField(
        field: keyof T,
        value: any,
        extra?: FindOneOptions<T>
    ): Promise<T | null> {
        return this.repository.findOne({
            ...extra,
            where: { [field]: value, ...(extra?.where as any) } as any
        });
    }

    // async findById(id: number): Promise<T | null> {
    //     return this.repository.findOne({
    //         where: { [this.primaryKey]: id } as any
    //     });
    // }

    async findById(
        id: number,
        includeDeleted: boolean = false
    ): Promise<T | null> {
        return this.repository.findOne({
            where: {
                [this.primaryKey]: id,
                ...(includeDeleted ? {} : { dFlag: false })
            } as any
        });
    }

    async create(data: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(data);
        return this.repository.save(entity as any);
    }

    async bulkCreate(dataArray: DeepPartial<T>[]): Promise<T[]> {
        const entities = this.repository.create(dataArray as any);
        return this.repository.save(entities as any);
    }

    async update(id: number, data: DeepPartial<T>): Promise<T | null> {
        await this.repository.update(
            { [this.primaryKey]: id } as any,
            data as any
        );
        return this.findById(id);
    }

    async delete(id: number, deletedBy?: number): Promise<boolean> {
        const result = await this.repository.update(
            { [this.primaryKey]: id } as any,
            { dFlag: true, modifiedBy: deletedBy ?? null } as any
        );
        return (result.affected ?? 0) > 0;
    }

    async restore(id: number, restoredBy?: string): Promise<boolean> {
        const result = await this.repository.update(
            { [this.primaryKey]: id } as any,
            { dFlag: false, modifiedBy: restoredBy ?? null } as any
        );
        return (result.affected ?? 0) > 0;
    }

    async hardDelete(id: number): Promise<boolean> {
        const result = await this.repository.delete(
            { [this.primaryKey]: id } as any
        );
        return (result.affected ?? 0) > 0;
    }

    async count(options?: FindManyOptions<T>): Promise<number> {
        return this.repository.count(options);
    }

    async exists(options: FindOneOptions<T>): Promise<boolean> {
        const entity = await this.repository.findOne(options);
        return entity !== null;
    }

    async paginate(
        page: number,
        limit: number,
        options?: FindManyOptions<T>
    ): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }> {
        const [data, total] = await this.repository.findAndCount({
            ...options,
            skip: (page - 1) * limit,
            take: limit
        });
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
}