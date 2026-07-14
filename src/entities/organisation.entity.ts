import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Branch } from "./branch.entity";
import { UserOrgBranchRole } from "./user-org-branch-role.entity";

@Entity("organisations")
export class Organisation {

    @PrimaryGeneratedColumn({ name: "org_id" })
    orgId!: number;

    @Column({ name: "org_name" })
    orgName!: string;

    @Column({ name: "org_short_name", })
    orgShortName!: string;

    @Column({ name: "org_code" })
    orgCode!: string;

    @Column({ name: "org_Reg_Number", type: "varchar", nullable: true })
    orgRegNumber!: string | null;

    @Column({ name: "org_GST", type: "varchar", nullable: true })
    orgGST!: string | null;

    @Column({ name: "org_PAN", type: "varchar", nullable: true })
    orgPAN!: string | null;

    @Column({ name: "org_GSTIN_Number", type: "varchar", nullable: true })
    orgGSTINNumber!: string | null;

    @Column({ name: "org_FY", type: "varchar", nullable: true })
    orgFY!: string | null;

    @Column({ name: "orgdistrict_number", type: "varchar", nullable: true })
    orgDistrictNumber!: string | null;

    @Column({ name: "org_city", type: "varchar", nullable: true })
    orgCity!: string | null;

    @Column({ name: "org_state_code", type: "varchar", nullable: true })
    orgStateCode!: string | null;

    @Column({ name: "org_pin", type: "varchar", nullable: true })
    orgPin!: string | null;

    @Column({ name: "org_phone", type: "varchar", nullable: true })
    orgPhone!: string | null;

    @Column({ name: "org_email", type: "varchar", nullable: true })
    orgEmail!: string | null;

    @Column({ name: "org_location", type: "varchar", nullable: true })
    orgLocation!: string | null;

    @Column({ name: "org_logo", type: "varchar", nullable: true })
    orgLogo!: string | null;

    @Column({ name: "address", type: "varchar", nullable: true })
    address!: string | null;

    @Column({ name: "contact_number", type: "varchar", nullable: true })
    contactNumber!: string | null;

    @Column({ name: "created_by", type: "varchar", nullable: true })
    createdBy!: string | null;

    @CreateDateColumn({ name: "created_date" })
    createdDate!: Date;

    @Column({ name: "modified_by", type: "varchar", nullable: true })
    modifiedBy!: string | null;

    @UpdateDateColumn({ name: "modified_date" })
    modifiedDate!: Date;

    @Column({ name: "dFlag", default: false })
    dFlag!: boolean;

    @OneToMany(
        () => UserOrgBranchRole,
        uob => uob.organisation
    )
    userOrgBranches!: UserOrgBranchRole[];

    @OneToMany(() => Branch, (branch) => branch.organisation)
    branches!: Branch[];

}