import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1785390164148 implements MigrationInterface {
    name = 'Migration1785390164148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tokens\` (\`tokenId\` int NOT NULL AUTO_INCREMENT, \`token\` text NOT NULL, \`tokenType\` enum ('BEARER', 'REFRESH', 'RESET') NOT NULL DEFAULT 'BEARER', \`revoked\` tinyint NOT NULL DEFAULT 0, \`expired\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifiedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NOT NULL, PRIMARY KEY (\`tokenId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`user_name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`user_code\` varchar(255) NOT NULL, \`status\` enum ('Active', 'InActive') NOT NULL DEFAULT 'Active', \`full_name\` varchar(255) NULL, \`email\` varchar(255) NULL, \`phone_number\` varchar(255) NULL, \`profile_poic\` varchar(255) NULL, \`DOB\` date NULL, \`created_by\` varchar(255) NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dFlag\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`role_id\` int NOT NULL AUTO_INCREMENT, \`role_name\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`d_flag\` tinyint NOT NULL DEFAULT 0, \`org_id\` int NOT NULL, PRIMARY KEY (\`role_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_org_branch_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`org_id\` int NOT NULL, \`branch_id\` int NOT NULL, \`role_id\` int NOT NULL, UNIQUE INDEX \`IDX_5b2a6bdb8a2451a83f9448de50\` (\`user_id\`, \`org_id\`, \`branch_id\`, \`role_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`organisations\` (\`org_id\` int NOT NULL AUTO_INCREMENT, \`org_name\` varchar(255) NOT NULL, \`org_short_name\` varchar(255) NOT NULL, \`org_code\` varchar(255) NOT NULL, \`org_Reg_Number\` varchar(255) NULL, \`org_GST\` varchar(255) NULL, \`org_PAN\` varchar(255) NULL, \`org_GSTIN_Number\` varchar(255) NULL, \`org_FY\` varchar(255) NULL, \`orgdistrict_number\` varchar(255) NULL, \`org_city\` varchar(255) NULL, \`org_state_code\` varchar(255) NULL, \`org_pin\` varchar(255) NULL, \`org_phone\` varchar(255) NULL, \`org_email\` varchar(255) NULL, \`org_location\` varchar(255) NULL, \`org_logo\` varchar(255) NULL, \`address\` varchar(255) NULL, \`contact_number\` varchar(255) NULL, \`created_by\` varchar(255) NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dFlag\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`org_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`branches\` (\`branch_id\` int NOT NULL AUTO_INCREMENT, \`branch_name\` varchar(255) NOT NULL, \`branch_short_name\` varchar(255) NOT NULL, \`branch_code\` varchar(255) NOT NULL, \`created_by\` varchar(255) NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dFlag\` tinyint NOT NULL DEFAULT 0, \`org_id\` int NULL, PRIMARY KEY (\`branch_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pages\` (\`page_id\` int NOT NULL AUTO_INCREMENT, \`page_name\` varchar(255) NOT NULL, \`page_icon\` varchar(255) NULL, \`created_by\` varchar(255) NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dFlag\` tinyint NOT NULL DEFAULT 0, \`module_id\` int NULL, UNIQUE INDEX \`IDX_f44f328ead2140a800b95e8b3c\` (\`page_name\`), PRIMARY KEY (\`page_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`modules\` (\`module_id\` int NOT NULL AUTO_INCREMENT, \`module_name\` varchar(255) NOT NULL, \`module_icon\` varchar(255) NULL, \`created_by\` varchar(255) NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dFlag\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_e10bfbd4b8f0bdc8f363ab5757\` (\`module_name\`), PRIMARY KEY (\`module_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_permissions\` (\`role_permission_id\` int NOT NULL AUTO_INCREMENT, \`can_read\` tinyint NOT NULL DEFAULT 0, \`can_write\` tinyint NOT NULL DEFAULT 0, \`can_update\` tinyint NOT NULL DEFAULT 0, \`can_delete\` tinyint NOT NULL DEFAULT 0, \`created_by\` varchar(255) NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dFlag\` tinyint NOT NULL DEFAULT 0, \`role_id\` int NULL, \`page_id\` int NULL, PRIMARY KEY (\`role_permission_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_permissions\` (\`user_permission_id\` int NOT NULL AUTO_INCREMENT, \`can_read\` tinyint NOT NULL DEFAULT 0, \`can_write\` tinyint NOT NULL DEFAULT 0, \`can_update\` tinyint NOT NULL DEFAULT 0, \`can_delete\` tinyint NOT NULL DEFAULT 0, \`created_by\` varchar(255) NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dFlag\` tinyint NOT NULL DEFAULT 0, \`user_id\` int NOT NULL, \`page_id\` int NOT NULL, PRIMARY KEY (\`user_permission_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tokens\` ADD CONSTRAINT \`FK_8769073e38c365f315426554ca5\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles\` ADD CONSTRAINT \`FK_ba4f96af4628cc8b18e940436d8\` FOREIGN KEY (\`org_id\`) REFERENCES \`organisations\`(\`org_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` ADD CONSTRAINT \`FK_76ae46b9aea791325d4e9e19439\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` ADD CONSTRAINT \`FK_a42ea5a889e239e620d75378ad0\` FOREIGN KEY (\`org_id\`) REFERENCES \`organisations\`(\`org_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` ADD CONSTRAINT \`FK_d78fe734c616c5c787503b0ef17\` FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`branch_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` ADD CONSTRAINT \`FK_f764a08b5afcc4dc42f404c078b\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`role_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`branches\` ADD CONSTRAINT \`FK_11a5e18b1a497189d0ec3cb5dac\` FOREIGN KEY (\`org_id\`) REFERENCES \`organisations\`(\`org_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pages\` ADD CONSTRAINT \`FK_50375159f958ea3f33b7f2149dc\` FOREIGN KEY (\`module_id\`) REFERENCES \`modules\`(\`module_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_178199805b901ccd220ab7740ec\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`role_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_becd26d9c4332330de1cfed61a7\` FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`page_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD CONSTRAINT \`FK_3495bd31f1862d02931e8e8d2e8\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD CONSTRAINT \`FK_04a0f8dce7daa00fea9c192112d\` FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`page_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP FOREIGN KEY \`FK_04a0f8dce7daa00fea9c192112d\``);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP FOREIGN KEY \`FK_3495bd31f1862d02931e8e8d2e8\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_becd26d9c4332330de1cfed61a7\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_178199805b901ccd220ab7740ec\``);
        await queryRunner.query(`ALTER TABLE \`pages\` DROP FOREIGN KEY \`FK_50375159f958ea3f33b7f2149dc\``);
        await queryRunner.query(`ALTER TABLE \`branches\` DROP FOREIGN KEY \`FK_11a5e18b1a497189d0ec3cb5dac\``);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` DROP FOREIGN KEY \`FK_f764a08b5afcc4dc42f404c078b\``);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` DROP FOREIGN KEY \`FK_d78fe734c616c5c787503b0ef17\``);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` DROP FOREIGN KEY \`FK_a42ea5a889e239e620d75378ad0\``);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` DROP FOREIGN KEY \`FK_76ae46b9aea791325d4e9e19439\``);
        await queryRunner.query(`ALTER TABLE \`roles\` DROP FOREIGN KEY \`FK_ba4f96af4628cc8b18e940436d8\``);
        await queryRunner.query(`ALTER TABLE \`tokens\` DROP FOREIGN KEY \`FK_8769073e38c365f315426554ca5\``);
        await queryRunner.query(`DROP TABLE \`user_permissions\``);
        await queryRunner.query(`DROP TABLE \`role_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_e10bfbd4b8f0bdc8f363ab5757\` ON \`modules\``);
        await queryRunner.query(`DROP TABLE \`modules\``);
        await queryRunner.query(`DROP INDEX \`IDX_f44f328ead2140a800b95e8b3c\` ON \`pages\``);
        await queryRunner.query(`DROP TABLE \`pages\``);
        await queryRunner.query(`DROP TABLE \`branches\``);
        await queryRunner.query(`DROP TABLE \`organisations\``);
        await queryRunner.query(`DROP INDEX \`IDX_5b2a6bdb8a2451a83f9448de50\` ON \`user_org_branch_role\``);
        await queryRunner.query(`DROP TABLE \`user_org_branch_role\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`tokens\``);
    }

}
