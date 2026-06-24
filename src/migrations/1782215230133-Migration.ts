import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782215230133 implements MigrationInterface {
    name = 'Migration1782215230133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pages\` CHANGE \`module_icon\` \`page_icon\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pages\` DROP COLUMN \`page_icon\``);
        await queryRunner.query(`ALTER TABLE \`pages\` ADD \`page_icon\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pages\` DROP COLUMN \`page_icon\``);
        await queryRunner.query(`ALTER TABLE \`pages\` ADD \`page_icon\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pages\` CHANGE \`page_icon\` \`module_icon\` varchar(255) NULL`);
    }

}
