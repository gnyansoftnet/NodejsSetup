import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserOrgBranch } from "./user-organisation-branch.entity";
import { Branch } from "./branch.entity";

@Entity("organisations")
export class Organisation {

    @PrimaryGeneratedColumn({ name: "org_id" })
    orgId!: number;

    @Column({ name: "org_name" })
    orgName!: string;

    @Column({ name: "org_short_name",unique:true })
    orgShortName!: string;

    @Column({ name: "org_code" ,unique:true})
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

    @Column({ name: "org_enable_TDS_deduction", type: "varchar", nullable: true })
    orgEnableTDSDeduction!: string | null;

    @Column({ name: "org_TDS_deduction_type", type: "varchar", nullable: true })
    orgTDSDeductionType!: string | null;

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

    @Column({ name: "org_registered_address", type: "varchar", nullable: true })
    orgRegisteredAddress!: string | null

    @Column({ name: "document_type", type: "varchar", nullable: true })
    documentType!: string | null;

    @Column({ name: "document", type: "varchar", nullable: true })
    document!: string | null;

    @Column({ name: "org_charter_date", type: "date", nullable: true })
    orgCharterDate!: string | null;

    @Column({ name: "org_location", type: "varchar", nullable: true })
    orgLocation!: string | null;

    @Column({ name: "org_logo", type: "varchar", nullable: true })
    orgLogo!: string | null;

    @Column({ name: "enable_TDS_deduction", type: "varchar", nullable: true })
    enableTDSDeduction!: string | null;

    @Column({ name: "deducter_type", type: "varchar", nullable: true })
    deducterType!: string | null;

    @Column({ name: "address", type: "varchar", nullable: true })
    address!: string | null;

    @Column({ name: "contact_number", type: "varchar", nullable: true })
    contactNumber!: string | null;

    @Column({ name: "fax_number", type: "varchar", nullable: true })
    faxNumber!: string | null;

    @Column({ name: "email", type: "varchar", nullable: true })
    email!: string | null;

    @Column({ name: "wesite", type: "varchar", nullable: true })
    wesite!: string | null;

    @Column({ name: "service_tax", type: "varchar", nullable: true })
    serviceTax!: string | null;

    @Column({ name: "dept_logo", type: "varchar", nullable: true })
    deptLogo!: string | null;

    @Column({ name: "cash_account_number", type: "varchar", nullable: true })
    cashAccountNumber!: string | null;

    @Column({ name: "tan_number", type: "varchar", nullable: true })
    tanNumber!: string | null;

    @Column({ name: "tin_number", type: "varchar", nullable: true })
    tinNumber!: string | null;

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
        () => UserOrgBranch,
        uob => uob.organisation
    )
    userOrgBranches!: UserOrgBranch[];

    @OneToMany(() => Branch, (branch) => branch.organisation)
    branches!: Branch[];

}