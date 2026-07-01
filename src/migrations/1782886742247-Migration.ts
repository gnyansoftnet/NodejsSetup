import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782886742247 implements MigrationInterface {
    name = 'Migration1782886742247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`full_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`status\` enum ('Active', 'InActive') NOT NULL DEFAULT 'Active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`status\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`full_name\``);
    }

}
