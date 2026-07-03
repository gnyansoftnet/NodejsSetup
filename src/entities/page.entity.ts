import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Module } from "./module.entity";

@Entity({ name: "pages" })
export class Page {
    @PrimaryGeneratedColumn({ name: "page_id" })
    pageId!: number;


    @Column({ name: "page_name", unique: true })
    pageName!: string;


    @Column({ name: "page_icon", type: "varchar", nullable: true })
    pageIcon!: string | null

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

    @ManyToOne(() => Module)
    @JoinColumn({ name: "module_id" })
    module!: Module;



}