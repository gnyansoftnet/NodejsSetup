import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781261890131 implements MigrationInterface {
    name = 'Migration1781261890131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`user_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone_number\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`profile_poic\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`DOB\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`organisations\` DROP COLUMN \`org_charter_date\``);
        await queryRunner.query(`ALTER TABLE \`organisations\` ADD \`org_charter_date\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organisations\` DROP COLUMN \`org_charter_date\``);
        await queryRunner.query(`ALTER TABLE \`organisations\` ADD \`org_charter_date\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`DOB\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`profile_poic\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone_number\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`user_name\``);
    }

}
