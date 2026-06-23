import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

import { User } from "./user.entity";
import { Page } from "./page.entity";

@Entity("user_permissions")
export class UserPermission {

    @PrimaryGeneratedColumn({
        name: "user_permission_id"
    })
    userPermissionId!: number;

    @ManyToOne(() => User, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToOne(() => Page, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "page_id" })
    page!: Page;

    @Column({
        name: "can_read",
        default: false
    })
    canRead!: boolean;

    @Column({
        name: "can_write",
        default: false
    })
    canWrite!: boolean;

    @Column({
        name: "can_update",
        default: false
    })
    canUpdate!: boolean;

    @Column({
        name: "can_delete",
        default: false
    })
    canDelete!: boolean;

    @Column({
        name: "created_by",
        nullable: true,
        type: "varchar"
    })
    createdBy!: string | null;

    @CreateDateColumn({
        name: "created_date"
    })
    createdDate!: Date;

    @Column({
        name: "modified_by",
        nullable: true,
        type: "varchar"
    })
    modifiedBy!: string | null;

    @UpdateDateColumn({
        name: "modified_date"
    })
    modifiedDate!: Date;
}