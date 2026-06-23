import bcrypt from "bcrypt";
import { AppDataSource } from "../config/database.config";
import { Organisation } from "../entities/organisation.entity";
import { Branch } from "../entities/branch.entity";
import { Role } from "../entities/role.entity";
import { User } from "../entities/user.entity";
import { UserOrgBranch } from "../entities/user-organisation-branch.entity";
import { UserStatus } from "../constants/user-status.enum";



const SEED_CONFIG = {
    org: {
        code: process.env.SEED_ORG_CODE!,
        name: process.env.SEED_ORG_NAME!,
        shortName: process.env.SEED_ORG_SHORT!,
        address: process.env.SEED_ORG_ADDRESS!,
    },

    branch: {
        name: process.env.SEED_BRANCH_NAME!,
        shortName: process.env.SEED_BRANCH_SHORT!,
        code: process.env.SEED_BRANCH_CODE!,
    },

    role: {
        name: process.env.SEED_ROLE_NAME!,
    },

    admin: {
        userCode: process.env.SEED_ADMIN_CODE!,
        name: process.env.SEED_ADMIN_NAME!,
        fullName: process.env.SEED_ADMIN_FULLNAME!,
        email: process.env.SEED_ADMIN_EMAIL!,
        password: process.env.SEED_ADMIN_PASSWORD!,
    },
    common: {
        modifiedBy: process.env.SEED_MODIFIEDBY!,
        createdBy: process.env.SEED_CREATEDBY!

    }
};

export const seedAdminUser = async () => {

    const queryRunner =
        AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const orgRepo = queryRunner.manager.getRepository(Organisation);
        const branchRepo = queryRunner.manager.getRepository(Branch);

        const roleRepo = queryRunner.manager.getRepository(Role);

        const userRepo = queryRunner.manager.getRepository(User);

        const userOrgBranchRepo = queryRunner.manager.getRepository(UserOrgBranch);

        let organisation = await orgRepo.findOne({
            where: { orgCode: SEED_CONFIG.org.code, dFlag: false }
        });

        if (!organisation) {
            organisation = orgRepo.create({
                orgCode: SEED_CONFIG.org.code,
                orgName: SEED_CONFIG.org.name,
                orgShortName: SEED_CONFIG.org.shortName,
                address: SEED_CONFIG.org.address,
                modifiedBy: SEED_CONFIG.common.modifiedBy,
                createdBy: SEED_CONFIG.common.createdBy
            });
            organisation = await orgRepo.save(organisation);
            console.log("✔ Organisation created");
        }


        let branch = await branchRepo.findOne({ where: { branchCode: SEED_CONFIG.branch.code } });
        if (!branch) {
            branch = branchRepo.create({
                branchName: SEED_CONFIG.branch.name,
                branchShortName: SEED_CONFIG.branch.shortName,
                branchCode: SEED_CONFIG.branch.code,
                organisation: organisation,
                modifiedBy: SEED_CONFIG.common.modifiedBy,
                createdBy: SEED_CONFIG.common.createdBy
            });
            branch = await branchRepo.save(branch);
            console.log("✔ Branch created");
        }

        let role = await roleRepo.findOne({ where: { roleName: SEED_CONFIG.role.name } });
        if (!role) {
            role = roleRepo.create({
                roleName: SEED_CONFIG.role.name,
                organisation: organisation,
                modifiedBy: SEED_CONFIG.common.modifiedBy,
                createdBy: SEED_CONFIG.common.createdBy,
            });
            role = await roleRepo.save(role);

            console.log("✔ Role created"
            );
        }


        let admin = await userRepo.findOne({ where: { userCode: SEED_CONFIG.admin.userCode } });
        if (!admin) {
            const password = await bcrypt.hash(SEED_CONFIG.admin.password, 10);
            admin = userRepo.create({
                userName: SEED_CONFIG.admin.name,
                userCode: SEED_CONFIG.admin.userCode,
                password: password,
                status: UserStatus.Active,
                modifiedBy: SEED_CONFIG.common.modifiedBy,
                createdBy: SEED_CONFIG.common.createdBy,
            });
            admin = await userRepo.save(admin);
            console.log(
                "✔ Admin user created"
            );
        }


        const existingMapping =
            await userOrgBranchRepo.findOne({
                where: {
                    user: {
                        userId: admin.userId
                    },
                    organisation: {
                        orgId:
                            organisation.orgId
                    },
                    branch: {
                        branchId:
                            branch.branchId
                    }
                },
                relations: {
                    user: true,
                    organisation: true,
                    branch: true
                }
            });

        if (!existingMapping) {

            const mapping =
                userOrgBranchRepo.create({
                    user: admin,
                    organisation,
                    branch,
                    role
                });

            await userOrgBranchRepo.save(
                mapping
            );
            console.log("✔ UserOrgBranch mapping created");
        }
        await queryRunner.commitTransaction();
        console.log("✔ Seed completed successfully");
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("✖ Seed failed", error);
        throw error;
    } finally {
        await queryRunner.release();
    }
};