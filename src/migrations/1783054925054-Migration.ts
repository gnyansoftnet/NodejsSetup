import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1783054925054 implements MigrationInterface {
    name = 'Migration1783054925054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pages\` ADD \`module_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`pages\` ADD CONSTRAINT \`FK_50375159f958ea3f33b7f2149dc\` FOREIGN KEY (\`module_id\`) REFERENCES \`modules\`(\`module_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pages\` DROP FOREIGN KEY \`FK_50375159f958ea3f33b7f2149dc\``);
        await queryRunner.query(`ALTER TABLE \`pages\` DROP COLUMN \`module_id\``);
    }

}
