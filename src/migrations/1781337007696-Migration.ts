import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781337007696 implements MigrationInterface {
    name = 'Migration1781337007696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`modules\` (\`module_id\` int NOT NULL AUTO_INCREMENT, \`module_name\` varchar(255) NOT NULL, \`module_icon\` varchar(255) NULL, \`created_by\` varchar(255) NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dFlag\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`module_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pages\` (\`page_id\` int NOT NULL AUTO_INCREMENT, \`page_name\` varchar(255) NOT NULL, \`module_icon\` varchar(255) NULL, \`created_by\` varchar(255) NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dFlag\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`page_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`user_code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_23351656ab098559729ac15f50\` (\`user_code\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`status\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_23351656ab098559729ac15f50\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`user_code\``);
        await queryRunner.query(`DROP TABLE \`pages\``);
        await queryRunner.query(`DROP TABLE \`modules\``);
    }

}
