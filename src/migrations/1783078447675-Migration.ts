import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1783078447675 implements MigrationInterface {
    name = 'Migration1783078447675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD \`dFlag\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP COLUMN \`dFlag\``);
    }

}
