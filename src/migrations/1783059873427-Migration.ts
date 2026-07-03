import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1783059873427 implements MigrationInterface {
    name = 'Migration1783059873427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pages\` ADD UNIQUE INDEX \`IDX_f44f328ead2140a800b95e8b3c\` (\`page_name\`)`);
        await queryRunner.query(`ALTER TABLE \`modules\` ADD UNIQUE INDEX \`IDX_e10bfbd4b8f0bdc8f363ab5757\` (\`module_name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`modules\` DROP INDEX \`IDX_e10bfbd4b8f0bdc8f363ab5757\``);
        await queryRunner.query(`ALTER TABLE \`pages\` DROP INDEX \`IDX_f44f328ead2140a800b95e8b3c\``);
    }

}
