import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { Page } from "./page.entity";

@Entity("role_permissions")
export class RolePermission {
    @PrimaryGeneratedColumn({
        name: "role_permission_id"
    })
    rolePermissionId!: number;

    @ManyToOne(() => Role)
    @JoinColumn({ name: "role_id" })
    role!: Role;

    @ManyToOne(() => Page)
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

    @Column({ name: "created_by", type: "varchar", nullable: true })
    createdBy!: string | null;

    @CreateDateColumn({ name: "created_date" })
    createdDate!: Date;

    @Column({ name: "modified_by", type: "varchar", nullable: true })
    modifiedBy!: string | null;

    @UpdateDateColumn({ name: "modified_date" })
    modifiedDate!: Date


    @Column({ name: "dFlag", default: false })
    dFlag!: boolean


}