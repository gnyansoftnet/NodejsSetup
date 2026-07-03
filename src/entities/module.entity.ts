import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Page } from "./page.entity";

@Entity({ name: "modules" })
export class Module {

    @PrimaryGeneratedColumn({ name: "module_id" })
    moduleId!: number;

    @Column({ name: "module_name" ,unique: true})
    moduleName!: string;

    @Column({ name: "module_icon", type: "varchar", nullable: true })
    moduleIcon!: string | null

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

    @OneToMany(() => Page, (page) => page.module)
    pages!: Page[];

}